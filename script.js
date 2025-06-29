// Global variables
let currentTab = 'generator';

// DOM Elements
const elements = {
    // Tabs
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Settings
    apiKey: document.getElementById('apiKey'),
    model: document.getElementById('model'),
    maxTokens: document.getElementById('maxTokens'),
    tokenValue: document.getElementById('tokenValue'),
    
    // Generator
    essayPrompt: document.getElementById('essayPrompt'),
    essayType: document.getElementById('essayType'),
    wordCount: document.getElementById('wordCount'),
    collegeLevel: document.getElementById('collegeLevel'),
    writingStyle: document.getElementById('writingStyle'),
    personalDetails: document.getElementById('personalDetails'),
    additionalRequirements: document.getElementById('additionalRequirements'),
    generateBtn: document.getElementById('generateBtn'),
    generatorResult: document.getElementById('generatorResult'),
    generatedEssay: document.getElementById('generatedEssay'),
    downloadEssay: document.getElementById('downloadEssay'),
    
    // Editor
    essayText: document.getElementById('essayText'),
    focusArea: document.getElementById('focusArea'),
    analysisCollegeLevel: document.getElementById('analysisCollegeLevel'),
    specificInstructions: document.getElementById('specificInstructions'),
    analyzeBtn: document.getElementById('analyzeBtn'),
    editorResult: document.getElementById('editorResult'),
    analysisResult: document.getElementById('analysisResult'),
    downloadAnalysis: document.getElementById('downloadAnalysis'),
    
    // UI
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingText: document.getElementById('loadingText'),
    errorModal: document.getElementById('errorModal'),
    errorMessage: document.getElementById('errorMessage'),
    
    // Counters
    promptCounter: document.getElementById('promptCounter'),
    detailsCounter: document.getElementById('detailsCounter'),
    requirementsCounter: document.getElementById('requirementsCounter'),
    essayCounter: document.getElementById('essayCounter'),
    instructionsCounter: document.getElementById('instructionsCounter')
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Tab switching
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Token slider
    elements.maxTokens.addEventListener('input', updateTokenDisplay);
    
    // Character counters
    setupCharacterCounters();
    
    // Buttons
    elements.generateBtn.addEventListener('click', generateEssay);
    elements.analyzeBtn.addEventListener('click', analyzeEssay);
    elements.downloadEssay.addEventListener('click', () => downloadContent('essay'));
    elements.downloadAnalysis.addEventListener('click', () => downloadContent('analysis'));
    
    // Modal close
    document.querySelector('.close').addEventListener('click', closeErrorModal);
    elements.errorModal.addEventListener('click', (e) => {
        if (e.target === elements.errorModal) closeErrorModal();
    });
    
    // Load saved settings
    loadSettings();
}

// Tab switching
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    elements.tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab content
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });
}

// Token display
function updateTokenDisplay() {
    elements.tokenValue.textContent = elements.maxTokens.value;
}

// Character counters
function setupCharacterCounters() {
    const textareas = [
        { element: elements.essayPrompt, counter: elements.promptCounter },
        { element: elements.personalDetails, counter: elements.detailsCounter },
        { element: elements.additionalRequirements, counter: elements.requirementsCounter },
        { element: elements.essayText, counter: elements.essayCounter },
        { element: elements.specificInstructions, counter: elements.instructionsCounter }
    ];
    
    textareas.forEach(({ element, counter }) => {
        if (element && counter) {
            element.addEventListener('input', () => updateCounter(element, counter));
        }
    });
}

function updateCounter(element, counter) {
    const charCount = element.value.length;
    const estimatedTokens = Math.ceil(charCount / 4);
    
    counter.textContent = `📊 Characters: ${charCount.toLocaleString()} | Estimated tokens: ~${estimatedTokens.toLocaleString()}`;
    
    // Add warnings for large inputs
    if (estimatedTokens > 80000) {
        counter.innerHTML += ' ⚠️ <strong>Very large input - may approach context limits</strong>';
    } else if (estimatedTokens > 50000) {
        counter.innerHTML += ' ℹ️ <strong>Large input - consider breaking into sections</strong>';
    }
}

// Settings management
function loadSettings() {
    const savedApiKey = localStorage.getItem('collegeEssayAI_apiKey');
    const savedModel = localStorage.getItem('collegeEssayAI_model');
    const savedMaxTokens = localStorage.getItem('collegeEssayAI_maxTokens');
    
    if (savedApiKey) elements.apiKey.value = savedApiKey;
    if (savedModel) elements.model.value = savedModel;
    if (savedMaxTokens) {
        elements.maxTokens.value = savedMaxTokens;
        updateTokenDisplay();
    }
}

function saveSettings() {
    localStorage.setItem('collegeEssayAI_apiKey', elements.apiKey.value);
    localStorage.setItem('collegeEssayAI_model', elements.model.value);
    localStorage.setItem('collegeEssayAI_maxTokens', elements.maxTokens.value);
}

// API validation
function validateApiKey(apiKey) {
    if (!apiKey) return { valid: false, message: 'API key is required' };
    if (!apiKey.startsWith('sk-')) return { valid: false, message: 'API key should start with "sk-"' };
    if (apiKey.length < 20) return { valid: false, message: 'API key seems too short' };
    return { valid: true, message: 'Valid' };
}

// API call
async function callOpenRouterAPI(prompt, apiKey, model, maxTokens) {
    const url = 'https://openrouter.ai/api/v1/chat/completions';
    
    // Estimate input tokens
    const estimatedInputTokens = Math.ceil(prompt.length / 4);
    if (estimatedInputTokens > 100000) {
        showWarning('Large input detected - may approach context limits');
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'CollegeEssayAI'
    };
    
    const data = {
        model: model,
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        max_tokens: parseInt(maxTokens),
        temperature: 0.7,
        stream: false
    };
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.error?.message || `HTTP ${response.status}`;
            
            switch (response.status) {
                case 401:
                    throw new Error('Invalid API key. Please check your OpenRouter API key.');
                case 403:
                    throw new Error('Access denied. Your API key doesn\'t have permission to use this model.');
                case 413:
                    throw new Error('Request too large. Your input exceeds the model\'s context limit.');
                case 429:
                    throw new Error('Rate limit exceeded. Please wait a few minutes and try again.');
                default:
                    throw new Error(`API Error: ${errorMsg}`);
            }
        }
        
        const result = await response.json();
        return result.choices[0].message.content;
        
    } catch (error) {
        throw error;
    }
}

// Essay generation
async function generateEssay() {
    // Validate inputs
    const apiKey = elements.apiKey.value.trim();
    const essayPrompt = elements.essayPrompt.value.trim();
    
    const apiValidation = validateApiKey(apiKey);
    if (!apiValidation.valid) {
        showError(apiValidation.message);
        return;
    }
    
    if (!essayPrompt) {
        showError('Please enter the essay prompt.');
        return;
    }
    
    // Save settings
    saveSettings();
    
    // Show loading
    showLoading('Generating your college admission essay...');
    
    try {
        // Build prompt
        const prompt = buildEssayPrompt();
        
        // Call API
        const result = await callOpenRouterAPI(
            prompt,
            apiKey,
            elements.model.value,
            elements.maxTokens.value
        );
        
        // Display result
        elements.generatedEssay.textContent = result;
        elements.generatorResult.style.display = 'block';
        
        // Scroll to result
        elements.generatorResult.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Essay analysis
async function analyzeEssay() {
    // Validate inputs
    const apiKey = elements.apiKey.value.trim();
    const essayText = elements.essayText.value.trim();
    
    const apiValidation = validateApiKey(apiKey);
    if (!apiValidation.valid) {
        showError(apiValidation.message);
        return;
    }
    
    if (!essayText) {
        showError('Please enter your essay.');
        return;
    }
    
    // Save settings
    saveSettings();
    
    // Show loading
    showLoading('Analyzing your essay...');
    
    try {
        // Build prompt
        const prompt = buildAnalysisPrompt();
        
        // Call API
        const result = await callOpenRouterAPI(
            prompt,
            apiKey,
            elements.model.value,
            elements.maxTokens.value
        );
        
        // Display result
        elements.analysisResult.textContent = result;
        elements.editorResult.style.display = 'block';
        
        // Scroll to result
        elements.editorResult.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Prompt building
function buildEssayPrompt() {
    const typeMap = {
        'personal-statement': 'personal statement that showcases your unique personality, experiences, and character',
        'supplemental': 'supplemental essay that addresses the specific prompt requirements',
        'common-app': 'Common Application essay that tells your personal story',
        'why-this-college': 'essay explaining why you want to attend this specific college',
        'why-this-major': 'essay explaining your interest in and preparation for your chosen major',
        'extracurricular': 'essay about a significant extracurricular activity or leadership experience',
        'challenge': 'essay about a challenge or obstacle you have overcome',
        'community': 'essay about community service or social impact work'
    };
    
    const levelMap = {
        'ivy-league': 'Ivy League standards',
        'top-20': 'Top 20 university standards',
        'top-50': 'Top 50 university standards',
        'state-flagship': 'state flagship university standards',
        'liberal-arts': 'liberal arts college standards',
        'community-college': 'community college standards'
    };
    
    const styleMap = {
        'authentic': 'authentic, personal, and genuine voice',
        'academic': 'academic and formal tone',
        'creative': 'creative and narrative style',
        'professional': 'professional and mature tone',
        'conversational': 'conversational and friendly style'
    };
    
    let prompt = `Write a college admission essay for the following prompt: "${elements.essayPrompt.value}"

Essay Type: ${typeMap[elements.essayType.value]}
Target: ${levelMap[elements.collegeLevel.value]}
Length: ${elements.wordCount.value} words
Style: ${styleMap[elements.writingStyle.value]}

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
- Ensure excellent grammar, spelling, and punctuation`;

    if (elements.personalDetails.value) {
        prompt += `\n\nPersonal Details to Include: ${elements.personalDetails.value}`;
    }
    
    if (elements.additionalRequirements.value) {
        prompt += `\n\nAdditional Requirements: ${elements.additionalRequirements.value}`;
    }

    prompt += '\n\nCollege Admission Essay:';
    
    return prompt;
}

function buildAnalysisPrompt() {
    const criteriaMap = {
        'comprehensive': 'comprehensive evaluation including structure, content, authenticity, and admissions appeal',
        'structure': 'focus on essay structure, organization, flow, and coherence',
        'content': 'focus on content quality, storytelling, and personal narrative',
        'grammar': 'focus on grammar, spelling, punctuation, and writing mechanics',
        'admissions': 'focus on admissions appeal, authenticity, and college readiness',
        'authenticity': 'focus on authentic voice, personal reflection, and genuine expression'
    };
    
    const levelMap = {
        'ivy-league': 'Ivy League admission standards',
        'top-20': 'Top 20 university admission standards',
        'top-50': 'Top 50 university admission standards',
        'state-flagship': 'state flagship university admission standards',
        'liberal-arts': 'liberal arts college admission standards'
    };
    
    let prompt = `Please provide a detailed analysis and improvement suggestions for this college admission essay.

Essay to analyze:
"${elements.essayText.value}"

Analysis Focus: ${criteriaMap[elements.focusArea.value]}
Target Level: ${levelMap[elements.analysisCollegeLevel.value]}

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
7. Tips for making it more compelling for college admissions`;

    if (elements.specificInstructions.value) {
        prompt += `\n\nSpecific Focus Areas: ${elements.specificInstructions.value}`;
    }

    prompt += `\n\nPlease format your response as follows:

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

Essay Analysis:`;
    
    return prompt;
}

// Download functionality
function downloadContent(type) {
    let content, filename;
    
    if (type === 'essay') {
        content = elements.generatedEssay.textContent;
        filename = `college_essay_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    } else {
        content = elements.analysisResult.textContent;
        filename = `essay_analysis_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// UI helpers
function showLoading(text) {
    elements.loadingText.textContent = text;
    elements.loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    elements.loadingOverlay.style.display = 'none';
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorModal.style.display = 'flex';
}

function closeErrorModal() {
    elements.errorModal.style.display = 'none';
}

function showWarning(message) {
    // Simple alert for warnings - could be enhanced with a toast notification
    console.warn(message);
} 