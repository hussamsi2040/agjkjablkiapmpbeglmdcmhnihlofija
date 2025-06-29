# CollegeEssayAI - AI College Admission Essay Generator & Editor

A specialized Streamlit application that generates and improves college admission essays using OpenRouter API. Perfect for students applying to universities and colleges!

## Features

### College Essay Generation
- **Personal Statements**: Authentic personal statements that showcase your unique story
- **Supplemental Essays**: Essays tailored to specific college prompts
- **Common App Essays**: Standard Common Application essays
- **Why This College**: Essays explaining your interest in specific institutions
- **Why This Major**: Essays about your academic interests and preparation
- **Extracurricular Essays**: Essays about leadership and activities
- **Challenge Essays**: Essays about overcoming obstacles
- **Community Service**: Essays about social impact and service

### Essay Types Supported
- **Personal Statement** - Your main college essay
- **Supplemental Essay** - College-specific prompts
- **Common App Essay** - Standard application essay
- **Why This College** - College-specific interest
- **Why This Major** - Academic interest explanation
- **Extracurricular Activity** - Leadership and activities
- **Challenge/Obstacle** - Overcoming difficulties
- **Community Service** - Social impact work

### Target College Levels
- **Ivy League** - Harvard, Yale, Princeton, etc.
- **Top 20 Universities** - Stanford, MIT, Duke, etc.
- **Top 50 Universities** - Major research universities
- **State Flagship** - University of [State] schools
- **Liberal Arts Colleges** - Small, focused institutions
- **Community College** - Two-year institutions

### Essay Editing & Analysis
- **Comprehensive Review** - Full essay analysis
- **Structure & Flow** - Organization and coherence
- **Content & Story** - Narrative and storytelling
- **Grammar & Style** - Writing mechanics
- **Admissions Appeal** - College readiness assessment
- **Authenticity & Voice** - Personal voice evaluation

### AI Models Available
- **o4-mini** (OpenAI) - Fast & efficient, perfect for essays ⭐ **Recommended**
- **GPT-4** (OpenAI) - Most capable model for complex tasks
- **GPT-4 Turbo** (OpenAI) - Faster and more cost-effective
- **GPT-3.5 Turbo** (OpenAI) - Good balance of speed and quality
- **Claude 3 Opus** (Anthropic) - Excellent for analysis and writing
- **Claude 3 Sonnet** (Anthropic) - Fast and reliable
- **Gemini Pro** (Google) - Good for creative tasks
- **Llama 3.1 70B** (Meta) - Open source alternative

### Key Benefits
- **College-Focused**: Specifically designed for admission essays
- **Multiple AI Models**: Choose from the best AI models available
- **Pay-per-use**: Only pay for what you use
- **Fast & Reliable**: Direct API integration with no browser dependencies
- **Modern UI**: Clean, responsive Streamlit interface
- **Export Options**: Download essays and analysis as text files
- **Customizable**: Adjust model, tokens, and other settings
- **Easy to Use**: Simple, intuitive interface

## Setup Instructions

### Prerequisites
- [Python](https://python.org/) (version 3.8 or higher)
- [OpenRouter API Key](https://openrouter.ai/keys) (free to get started)

### Quick Setup (Windows)
1. Double-click `setup_streamlit.bat` to automatically install dependencies
2. Run `streamlit run app.py` to start the app
3. The app will open in your browser automatically
4. Enter your OpenRouter API key in the sidebar and start generating!

### Manual Setup
1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Start the Streamlit app:
   ```bash
   streamlit run app.py
   ```

3. The app will automatically open in your browser at:
   ```
   http://localhost:8501
   ```

4. **Important**: Get your API key from [openrouter.ai/keys](https://openrouter.ai/keys) and enter it in the sidebar

## How to Use

### Getting Started
1. **Get an API Key**: Visit [openrouter.ai/keys](https://openrouter.ai/keys) and create a free account
2. **Enter API Key**: Paste your API key in the sidebar
3. **Choose Model**: Select your preferred AI model (o4-mini recommended)
4. **Start Using**: Generate essays or improve existing ones!

### Generating College Essays
1. Go to the "🎓 Essay Generator" tab
2. Paste the college essay prompt
3. Select essay type (Personal Statement, Supplemental, etc.)
4. Choose word count and target college level
5. Add personal details and requirements (optional)
6. Click "🚀 Generate Admission Essay"
7. Wait for the AI to create your essay
8. Download the result

### Editing & Improving Essays
1. Go to the "✏️ Essay Editor" tab
2. Paste your existing essay
3. Select focus area and target college level
4. Add specific feedback requests (optional)
5. Click "🔍 Analyze & Improve Essay"
6. Review the detailed feedback and suggestions
7. Download the analysis

## College Essay Tips

### What Makes a Great College Essay
- **Authenticity**: Be genuine and true to yourself
- **Specificity**: Use concrete examples and details
- **Self-reflection**: Show personal growth and insight
- **Unique perspective**: Share your unique story
- **Strong voice**: Write in your authentic voice
- **Good structure**: Clear introduction, body, and conclusion

### Common Mistakes to Avoid
- **Generic statements**: Avoid clichés and platitudes
- **Trying to impress**: Focus on being authentic, not impressive
- **Poor structure**: Ensure logical flow and organization
- **Grammar errors**: Proofread carefully
- **Too formal**: Write naturally, not like an academic paper
- **Not personal enough**: Share your unique experiences

## Pricing

OpenRouter uses a pay-per-use model:
- **Free Credits**: Get free credits when you sign up
- **Low Cost**: Very affordable pricing (typically $0.01-0.10 per essay)
- **No Subscription**: Only pay for what you use
- **Multiple Models**: Choose the model that fits your budget and needs

## Troubleshooting

### "Please enter your OpenRouter API key" Error
- **Solution**: Get an API key from [openrouter.ai/keys](https://openrouter.ai/keys)
- **Alternative**: Make sure you've entered the key correctly in the sidebar

### "Invalid API key" Error
- **Solution**: Check your API key is correct and has credits
- **Alternative**: Generate a new API key from OpenRouter

### Network Errors
- **Solution**: Check your internet connection
- **Alternative**: Try refreshing the page

### Rate Limit Errors
- **Solution**: Wait a few minutes and try again
- **Alternative**: Check your OpenRouter usage limits

### Common Issues
1. **API Key Missing**: Enter your OpenRouter API key in the sidebar
2. **No Credits**: Add credits to your OpenRouter account
3. **Model Unavailable**: Try a different AI model
4. **Slow Response**: Some models are faster than others

## Technical Details

### Architecture
- **Frontend**: Streamlit web interface
- **Backend**: Python with requests library
- **API Integration**: Direct OpenRouter API integration
- **Model Selection**: Multiple AI models available

### OpenRouter Integration
The app integrates with OpenRouter API to:
1. Send requests to multiple AI models
2. Handle authentication via API key
3. Process responses efficiently
4. Support various model configurations

### Security
- API keys are stored in session state (not persistent)
- No data is sent to our servers
- All communication is encrypted via HTTPS
- Your API key is only used for OpenRouter requests

## Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

### Project Structure
```
college-essay-ai/
├── app.py                 # Main Streamlit application
├── requirements.txt       # Python dependencies
├── setup_streamlit.bat    # Windows setup script
├── README.md             # This file
├── index.html            # Original web app (alternative)
├── script.js             # Original web app (alternative)
├── styles.css            # Original web app (alternative)
├── server.js             # Original web app (alternative)
└── package.json          # Original web app (alternative)
```

### Running in Development
```bash
streamlit run app.py
```

### Customization
- Modify `app.py` to change AI behavior
- Update the CSS in the app for custom styling
- Add new AI models in the model selection
- Customize prompts for different essay types

## Deployment

### Local Deployment
```bash
streamlit run app.py
```

### Cloud Deployment
The app can be easily deployed to:
- **Streamlit Cloud**: Free hosting for Streamlit apps
- **Heroku**: Cloud platform deployment
- **AWS/GCP/Azure**: Cloud provider deployment
- **Railway**: Simple deployment platform

## License

MIT License - feel free to use, modify, and distribute as needed.

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Ensure you have a valid OpenRouter API key
3. Try using a different AI model
4. Check your OpenRouter account for credits

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## College Application Resources

For additional help with college applications:
- **Common App**: [commonapp.org](https://commonapp.org)
- **College Board**: [collegeboard.org](https://collegeboard.org)
- **FAFSA**: [fafsa.gov](https://fafsa.gov)
- **College Essay Guy**: [collegeessayguy.com](https://collegeessayguy.com) 