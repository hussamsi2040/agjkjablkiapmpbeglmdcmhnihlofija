import streamlit as st
import requests
import json
import time
from datetime import datetime

# Page configuration
st.set_page_config(
    page_title="CollegeEssayAI - AI College Admission Essay Generator",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 0.5rem;
    }
    .subtitle {
        font-size: 1.2rem;
        color: #666;
        text-align: center;
        margin-bottom: 2rem;
    }
    .essay-box {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #1f77b4;
    }
    .grade-box {
        background-color: #e8f5e8;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #28a745;
    }
    .stButton > button {
        width: 100%;
        background-color: #1f77b4;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        font-weight: bold;
    }
    .stButton > button:hover {
        background-color: #1565c0;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'api_key' not in st.session_state:
    st.session_state.api_key = ""
if 'model' not in st.session_state:
    st.session_state.model = "openai/o4-mini"
if 'max_tokens' not in st.session_state:
    st.session_state.max_tokens = 2000

def validate_api_key(api_key):
    """Validate API key format"""
    if not api_key:
        return False, "API key is empty"
    if not api_key.startswith("sk-"):
        return False, "API key should start with 'sk-'"
    if len(api_key) < 20:
        return False, "API key seems too short"
    return True, "Valid"

def call_openrouter_api(prompt, api_key, model, max_tokens):
    """Call OpenRouter API with the given parameters"""
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": "https://agjkjablkiapmpbeglmdcmhnihlofija-5ygdsdynwdi6ol6nc59mrv.streamlit.app/",
        "X-Title": "CollegeEssayAI"
    }
    
    data = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": max_tokens,
        "temperature": 0.7,
        "stream": False
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=60)
        
        if response.status_code == 401:
            st.error("❌ **Authentication Error**: Invalid API key. Please check your OpenRouter API key in the sidebar.")
            st.info("💡 **Get your API key**: Visit [openrouter.ai/keys](https://openrouter.ai/keys) to get a valid API key.")
            return None
        elif response.status_code == 403:
            st.error("❌ **Access Denied**: Your API key doesn't have permission to use this model or service.")
            return None
        elif response.status_code == 429:
            st.error("❌ **Rate Limit Exceeded**: Too many requests. Please wait a few minutes and try again.")
            return None
        elif response.status_code == 400:
            error_data = response.json()
            error_msg = error_data.get('error', {}).get('message', 'Bad request')
            st.error(f"❌ **Bad Request**: {error_msg}")
            return None
        elif response.status_code != 200:
            st.error(f"❌ **API Error**: HTTP {response.status_code} - {response.reason}")
            return None
            
        result = response.json()
        return result['choices'][0]['message']['content']
        
    except requests.exceptions.Timeout:
        st.error("❌ **Timeout Error**: Request took too long. Please try again.")
        return None
    except requests.exceptions.ConnectionError:
        st.error("❌ **Connection Error**: Unable to connect to OpenRouter. Please check your internet connection.")
        return None
    except requests.exceptions.RequestException as e:
        st.error(f"❌ **Network Error**: {str(e)}")
        return None
    except KeyError as e:
        st.error(f"❌ **Response Error**: Unexpected response format from API.")
        return None
    except Exception as e:
        st.error(f"❌ **Unexpected Error**: {str(e)}")
        return None

def build_essay_prompt(essay_prompt, essay_type, word_count, college_level, writing_style, personal_details, additional_requirements):
    """Build the prompt for essay generation"""
    
    type_map = {
        'personal-statement': 'personal statement that showcases your unique personality, experiences, and character',
        'supplemental': 'supplemental essay that addresses the specific prompt requirements',
        'common-app': 'Common Application essay that tells your personal story',
        'why-this-college': 'essay explaining why you want to attend this specific college',
        'why-this-major': 'essay explaining your interest in and preparation for your chosen major',
        'extracurricular': 'essay about a significant extracurricular activity or leadership experience',
        'challenge': 'essay about a challenge or obstacle you have overcome',
        'community': 'essay about community service or social impact work'
    }
    
    level_map = {
        'ivy-league': 'Ivy League standards',
        'top-20': 'Top 20 university standards',
        'top-50': 'Top 50 university standards',
        'state-flagship': 'state flagship university standards',
        'liberal-arts': 'liberal arts college standards',
        'community-college': 'community college standards'
    }
    
    style_map = {
        'authentic': 'authentic, personal, and genuine voice',
        'academic': 'academic and formal tone',
        'creative': 'creative and narrative style',
        'professional': 'professional and mature tone',
        'conversational': 'conversational and friendly style'
    }
    
    prompt = f"""Write a college admission essay for the following prompt: "{essay_prompt}"

Essay Type: {type_map[essay_type]}
Target: {level_map[college_level]}
Length: {word_count} words
Style: {style_map[writing_style]}

Requirements:
- Write a compelling, authentic college admission essay
- Showcase your unique personality, experiences, and character
- Demonstrate self-reflection and personal growth
- Use specific examples and vivid details
- Ensure proper essay structure with engaging introduction, well-developed body, and strong conclusion
- Write in your authentic voice - be genuine and personal
- Avoid clichés and generic statements
- Make it memorable and distinctive
- Show why you would be a valuable addition to the college community
- Ensure excellent grammar, spelling, and punctuation"""

    if personal_details:
        prompt += f"\n\nPersonal Details to Include: {personal_details}"
    
    if additional_requirements:
        prompt += f"\n\nAdditional Requirements: {additional_requirements}"

    prompt += "\n\nCollege Admission Essay:"
    
    return prompt

def build_analysis_prompt(essay, focus_area, college_level, specific_instructions):
    """Build the prompt for essay analysis"""
    
    criteria_map = {
        'comprehensive': 'comprehensive evaluation including structure, content, authenticity, and admissions appeal',
        'structure': 'focus on essay structure, organization, flow, and coherence',
        'content': 'focus on content quality, storytelling, and personal narrative',
        'grammar': 'focus on grammar, spelling, punctuation, and writing mechanics',
        'admissions': 'focus on admissions appeal, authenticity, and college readiness',
        'authenticity': 'focus on authentic voice, personal reflection, and genuine expression'
    }
    
    level_map = {
        'ivy-league': 'Ivy League admission standards',
        'top-20': 'Top 20 university admission standards',
        'top-50': 'Top 50 university admission standards',
        'state-flagship': 'state flagship university admission standards',
        'liberal-arts': 'liberal arts college admission standards'
    }
    
    prompt = f"""Please provide a detailed analysis and improvement suggestions for this college admission essay.

Essay to analyze:
"{essay}"

Analysis Focus: {criteria_map[focus_area]}
Target Level: {level_map[college_level]}

Please provide:
1. Overall Assessment (A-F) and numerical score (0-100)
2. Breakdown scores for:
   - Authenticity & Voice (0-25 points)
   - Content & Storytelling (0-25 points)
   - Structure & Flow (0-25 points)
   - Admissions Appeal (0-25 points)
3. Detailed feedback for each category
4. Specific suggestions for improvement
5. Strengths of the essay
6. Areas that need work
7. Tips for making it more compelling for college admissions"""

    if specific_instructions:
        prompt += f"\n\nSpecific Focus Areas: {specific_instructions}"

    prompt += """\n\nPlease format your response as follows:

## Overall Assessment: [Grade] ([Score]/100)

### Breakdown:
- **Authenticity & Voice**: [Score]/25
- **Content & Storytelling**: [Score]/25  
- **Structure & Flow**: [Score]/25
- **Admissions Appeal**: [Score]/25

### Detailed Analysis:

**Authenticity & Voice:**
[Detailed feedback]

**Content & Storytelling:**
[Detailed feedback]

**Structure & Flow:**
[Detailed feedback]

**Admissions Appeal:**
[Detailed feedback]

### Strengths:
[List of strengths]

### Areas for Improvement:
[Specific suggestions]

### College Admissions Tips:
[Additional advice for making the essay more compelling]

Essay Analysis:"""
    
    return prompt

# Main app
def main():
    # Header
    st.markdown('<h1 class="main-header">CollegeEssayAI</h1>', unsafe_allow_html=True)
    st.markdown('<p class="subtitle">AI-Powered College Admission Essay Generator & Editor</p>', unsafe_allow_html=True)
    
    # Sidebar for settings
    with st.sidebar:
        st.header("⚙️ Settings")
        
        # API Key input
        api_key = st.text_input(
            "OpenRouter API Key",
            value=st.session_state.api_key,
            type="password",
            help="Get your API key from https://openrouter.ai/keys"
        )
        st.session_state.api_key = api_key
        
        # Validate API key
        if api_key:
            is_valid, message = validate_api_key(api_key)
            if is_valid:
                st.success("✅ API key format looks good")
            else:
                st.error(f"❌ {message}")
        
        # Model selection
        model = st.selectbox(
            "AI Model",
            options=[
                "openai/o4-mini",
                "openai/gpt-4o-mini",
                "openai/gpt-4o",
                "openai/gpt-4-turbo",
                "openai/gpt-3.5-turbo",
                "anthropic/claude-3-5-sonnet-20241022",
                "anthropic/claude-3-opus-20240229",
                "google/gemini-pro",
                "meta-llama/llama-3.1-70b-instruct"
            ],
            format_func=lambda x: {
                "openai/o4-mini": "o4-mini (OpenAI) - Fast & Efficient ⭐",
                "openai/gpt-4o-mini": "GPT-4o Mini (OpenAI) - Fast & Cost-effective",
                "openai/gpt-4o": "GPT-4o (OpenAI) - Most Capable",
                "openai/gpt-4-turbo": "GPT-4 Turbo (OpenAI) - Fast & Reliable",
                "openai/gpt-3.5-turbo": "GPT-3.5 Turbo (OpenAI) - Good Balance",
                "anthropic/claude-3-5-sonnet-20241022": "Claude 3.5 Sonnet (Anthropic) - Excellent",
                "anthropic/claude-3-opus-20240229": "Claude 3 Opus (Anthropic) - Most Capable",
                "google/gemini-pro": "Gemini Pro (Google) - Creative Tasks",
                "meta-llama/llama-3.1-70b-instruct": "Llama 3.1 70B (Meta) - Open Source"
            }[x],
            index=0,
            help="Choose your preferred AI model"
        )
        st.session_state.model = model
        
        # Max tokens
        max_tokens = st.slider(
            "Max Tokens",
            min_value=500,
            max_value=4000,
            value=2000,
            step=100,
            help="Maximum number of tokens for AI responses"
        )
        st.session_state.max_tokens = max_tokens
        
        # Info box
        st.info("""
        **CollegeEssayAI Features:**
        - Personal statement generation
        - Supplemental essay creation
        - Essay editing and improvement
        - Admissions-focused feedback
        - Multiple college levels supported
        """)
        
        # Link to get API key
        st.markdown("[Get OpenRouter API Key](https://openrouter.ai/keys)")
        
        # Troubleshooting section
        with st.expander("🔧 Troubleshooting"):
            st.markdown("""
            **Common Issues:**
            
            **401 Unauthorized Error:**
            - Make sure your API key starts with `sk-`
            - Get a fresh API key from [openrouter.ai/keys](https://openrouter.ai/keys)
            - Check that you have credits in your OpenRouter account
            
            **Model Not Working:**
            - Use the exact model names from the dropdown
            - `openai/o4-mini` is the recommended fast model
            - Some models may be temporarily unavailable
            
            **Rate Limit Error:**
            - Wait a few minutes and try again
            - Check your usage limits on OpenRouter
            
            **API Key Issues:**
            - Copy the entire key (no extra spaces)
            - Make sure you're using the latest key from OpenRouter
            - Check your account has sufficient credits
            """)
    
    # Main content
    tab1, tab2 = st.tabs(["🎓 Essay Generator", "✏️ Essay Editor"])
    
    with tab1:
        st.header("Generate College Admission Essay")
        
        col1, col2 = st.columns([1, 1])
        
        with col1:
            st.subheader("Essay Details")
            
            # Essay prompt
            essay_prompt = st.text_area(
                "College Essay Prompt *",
                placeholder="Paste the college essay prompt here...",
                height=100,
                help="The essay prompt from the college application"
            )
            
            # Essay type
            essay_type = st.selectbox(
                "Essay Type",
                options=[
                    "personal-statement",
                    "supplemental",
                    "common-app",
                    "why-this-college",
                    "why-this-major",
                    "extracurricular",
                    "challenge",
                    "community"
                ],
                format_func=lambda x: {
                    "personal-statement": "Personal Statement",
                    "supplemental": "Supplemental Essay",
                    "common-app": "Common App Essay",
                    "why-this-college": "Why This College",
                    "why-this-major": "Why This Major",
                    "extracurricular": "Extracurricular Activity",
                    "challenge": "Challenge/Obstacle",
                    "community": "Community Service"
                }[x]
            )
            
            # Word count
            word_count = st.selectbox(
                "Word Count",
                options=[250, 500, 650, 750, 1000],
                format_func=lambda x: f"{x} words"
            )
            
            # College level
            college_level = st.selectbox(
                "Target College Level",
                options=[
                    "ivy-league",
                    "top-20",
                    "top-50",
                    "state-flagship",
                    "liberal-arts",
                    "community-college"
                ],
                format_func=lambda x: {
                    "ivy-league": "Ivy League",
                    "top-20": "Top 20 Universities",
                    "top-50": "Top 50 Universities",
                    "state-flagship": "State Flagship",
                    "liberal-arts": "Liberal Arts Colleges",
                    "community-college": "Community College"
                }[x]
            )
            
            # Writing style
            writing_style = st.selectbox(
                "Writing Style",
                options=[
                    "authentic",
                    "academic",
                    "creative",
                    "professional",
                    "conversational"
                ],
                format_func=lambda x: {
                    "authentic": "Authentic & Personal",
                    "academic": "Academic & Formal",
                    "creative": "Creative & Narrative",
                    "professional": "Professional & Mature",
                    "conversational": "Conversational & Friendly"
                }[x]
            )
        
        with col2:
            st.subheader("Additional Information")
            
            # Personal details
            personal_details = st.text_area(
                "Personal Details (Optional)",
                placeholder="Include relevant experiences, achievements, challenges, or background that should be incorporated into the essay...",
                height=100,
                help="Personal information to include in the essay"
            )
            
            # Additional requirements
            additional_requirements = st.text_area(
                "Additional Requirements (Optional)",
                placeholder="Any specific requirements, themes, or focus areas...",
                height=100,
                help="Additional instructions for the essay"
            )
            
            # Generate button
            if st.button("🚀 Generate Admission Essay", type="primary"):
                if not api_key:
                    st.error("❌ **Missing API Key**: Please enter your OpenRouter API key in the sidebar.")
                    st.info("💡 **Get your API key**: Visit [openrouter.ai/keys](https://openrouter.ai/keys)")
                elif not essay_prompt:
                    st.error("❌ **Missing Prompt**: Please enter the essay prompt.")
                else:
                    # Validate API key format
                    is_valid, message = validate_api_key(api_key)
                    if not is_valid:
                        st.error(f"❌ **Invalid API Key**: {message}")
                        st.info("💡 **Get your API key**: Visit [openrouter.ai/keys](https://openrouter.ai/keys)")
                    else:
                        with st.spinner("Generating your college admission essay..."):
                            prompt = build_essay_prompt(
                                essay_prompt, essay_type, word_count, 
                                college_level, writing_style, personal_details, 
                                additional_requirements
                            )
                            
                            result = call_openrouter_api(api_key, model, max_tokens, prompt)
                            
                            if result:
                                st.success("✅ Essay generated successfully!")
                                
                                # Display the essay
                                st.markdown("### Generated College Essay")
                                st.markdown('<div class="essay-box">', unsafe_allow_html=True)
                                st.write(result)
                                st.markdown('</div>', unsafe_allow_html=True)
                                
                                # Download button
                                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                                st.download_button(
                                    label="📥 Download Essay",
                                    data=result,
                                    file_name=f"college_essay_{timestamp}.txt",
                                    mime="text/plain"
                                )
    
    with tab2:
        st.header("Edit & Improve Your Essay")
        
        col1, col2 = st.columns([1, 1])
        
        with col1:
            st.subheader("Essay Analysis")
            
            # Essay input
            essay_text = st.text_area(
                "Your Essay *",
                placeholder="Paste your college admission essay here...",
                height=300,
                help="The essay you want to analyze and improve"
            )
            
            # Focus area
            focus_area = st.selectbox(
                "Focus Area",
                options=[
                    "comprehensive",
                    "structure",
                    "content",
                    "grammar",
                    "admissions",
                    "authenticity"
                ],
                format_func=lambda x: {
                    "comprehensive": "Comprehensive Review",
                    "structure": "Structure & Flow",
                    "content": "Content & Story",
                    "grammar": "Grammar & Style",
                    "admissions": "Admissions Appeal",
                    "authenticity": "Authenticity & Voice"
                }[x]
            )
            
            # College level
            analysis_college_level = st.selectbox(
                "Target College Level",
                options=[
                    "ivy-league",
                    "top-20",
                    "top-50",
                    "state-flagship",
                    "liberal-arts"
                ],
                format_func=lambda x: {
                    "ivy-league": "Ivy League",
                    "top-20": "Top 20 Universities",
                    "top-50": "Top 50 Universities",
                    "state-flagship": "State Flagship",
                    "liberal-arts": "Liberal Arts Colleges"
                }[x]
            )
            
            # Specific instructions
            specific_instructions = st.text_area(
                "Specific Feedback Request (Optional)",
                placeholder="What specific aspects would you like me to focus on? (e.g., 'Make it more personal', 'Improve the opening', 'Strengthen the conclusion')",
                height=100,
                help="Specific areas you want feedback on"
            )
            
            # Analyze button
            if st.button("🔍 Analyze & Improve Essay", type="primary"):
                if not api_key:
                    st.error("❌ **Missing API Key**: Please enter your OpenRouter API key in the sidebar.")
                    st.info("💡 **Get your API key**: Visit [openrouter.ai/keys](https://openrouter.ai/keys)")
                elif not essay_text:
                    st.error("❌ **Missing Essay**: Please enter your essay.")
                else:
                    # Validate API key format
                    is_valid, message = validate_api_key(api_key)
                    if not is_valid:
                        st.error(f"❌ **Invalid API Key**: {message}")
                        st.info("💡 **Get your API key**: Visit [openrouter.ai/keys](https://openrouter.ai/keys)")
                    else:
                        with st.spinner("Analyzing your essay..."):
                            prompt = build_analysis_prompt(
                                essay_text, focus_area, analysis_college_level, 
                                specific_instructions
                            )
                            
                            result = call_openrouter_api(api_key, model, max_tokens, prompt)
                            
                            if result:
                                st.success("✅ Essay analysis completed!")
                                
                                # Display the analysis
                                st.markdown("### Essay Analysis & Suggestions")
                                st.markdown('<div class="grade-box">', unsafe_allow_html=True)
                                st.write(result)
                                st.markdown('</div>', unsafe_allow_html=True)
                                
                                # Download button
                                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                                st.download_button(
                                    label="📥 Download Analysis",
                                    data=result,
                                    file_name=f"essay_analysis_{timestamp}.txt",
                                    mime="text/plain"
                                )
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style='text-align: center; color: #666;'>
        <p>CollegeEssayAI - Powered by OpenRouter API</p>
        <p>Get your API key at <a href='https://openrouter.ai/keys' target='_blank'>openrouter.ai/keys</a></p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main() 