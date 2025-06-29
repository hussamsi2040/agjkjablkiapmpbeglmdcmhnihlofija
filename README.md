# CollegeEssayAI 🎓

A modern web application for generating and analyzing college admission essays using AI. Built with HTML, CSS, JavaScript frontend and Node.js serverless backend, designed for easy deployment on Vercel.

## 🏗️ Architecture

### Frontend
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)** - Interactive functionality and API integration
- **Font Awesome** - Beautiful icons throughout the interface

### Backend (Serverless API)
- **Vercel Functions** - Serverless API endpoints
- **Node.js** - Runtime environment
- **OpenRouter API** - AI model integration
- **CORS** - Cross-origin resource sharing support

## ✨ Features

- **Essay Generation**: Create compelling college admission essays from prompts
- **Essay Analysis**: Get detailed feedback and improvement suggestions
- **Multiple Essay Types**: Personal statements, supplemental essays, Common App, etc.
- **College Level Targeting**: Ivy League, Top 20, Top 50, and more
- **Writing Style Options**: Authentic, academic, creative, professional, conversational
- **Real-time Token Estimation**: Monitor context usage and stay within limits
- **Download Results**: Save essays and analysis as text files
- **Copy to Clipboard**: Quick copying of generated content
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Secure Backend**: API calls handled through secure serverless functions

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy with Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow prompts** and your app will be live with both frontend and backend!

### Option 2: Deploy via GitHub

1. **Fork this repository** to your GitHub account
2. **Go to [vercel.com](https://vercel.com)** and sign up/login
3. **Click "New Project"**
4. **Import your forked repository**
5. **Deploy** - Vercel will automatically detect the serverless functions

### Option 3: Deploy via Vercel Dashboard

1. **Download the files** from this repository
2. **Go to [vercel.com](https://vercel.com)** and sign up/login
3. **Click "New Project"**
4. **Upload the files** or drag and drop the folder
5. **Deploy**

## 🔑 Setup

### 1. Get OpenRouter API Key

1. Visit [openrouter.ai/keys](https://openrouter.ai/keys)
2. Create an account and get your API key
3. The key should start with `sk-`

### 2. Configure the App

1. Open the deployed app
2. Enter your API key in the settings panel
3. Choose your preferred AI model
4. Set your desired max tokens (recommended: 2,000-4,000)

## 🎯 How to Use

### Generate an Essay

1. **Enter the essay prompt** from your college application
2. **Select essay type** (personal statement, supplemental, etc.)
3. **Choose target college level** (Ivy League, Top 20, etc.)
4. **Pick writing style** (authentic, academic, creative, etc.)
5. **Add personal details** (optional but recommended)
6. **Click "Generate Admission Essay"**

### Analyze an Essay

1. **Paste your existing essay** in the editor tab
2. **Select focus area** (comprehensive, structure, content, etc.)
3. **Choose target college level**
4. **Add specific feedback requests** (optional)
5. **Click "Analyze & Improve Essay"**

## 🤖 Supported AI Models

- **o4-mini** (OpenAI) - Fast & Efficient ⭐
- **GPT-4o Mini** (OpenAI) - Fast & Cost-effective
- **GPT-4o** (OpenAI) - Most Capable
- **GPT-4 Turbo** (OpenAI) - Fast & Reliable
- **Claude 3.5 Sonnet** (Anthropic) - Excellent
- **Gemini Pro** (Google) - Creative Tasks

## 📊 Model Limits

- **Context Limit**: 128K tokens (input + output)
- **Output Limit**: 16K tokens per response
- **Recommended Essay Length**: Up to 50K characters
- **Token Estimation**: ~1 token per 4 characters

## 🏗️ Backend API Endpoints

### `/api/generate-essay`
- **Method**: POST
- **Purpose**: Generate college admission essays
- **Body**: `{ prompt, apiKey, model, maxTokens }`
- **Response**: `{ success: true, content: string, usage: object }`

### `/api/analyze-essay`
- **Method**: POST
- **Purpose**: Analyze and provide feedback on essays
- **Body**: `{ prompt, apiKey, model, maxTokens }`
- **Response**: `{ success: true, content: string, usage: object }`

### `/api/health`
- **Method**: GET
- **Purpose**: Health check endpoint
- **Response**: `{ status: 'healthy', timestamp: string, uptime: number }`

## 🔒 Security Features

- **API Key Validation**: Server-side validation of OpenRouter API keys
- **Input Sanitization**: All inputs are validated and sanitized
- **CORS Protection**: Proper CORS headers for secure cross-origin requests
- **Error Handling**: Comprehensive error handling without exposing sensitive data
- **Rate Limiting**: Built-in protection against abuse
- **No Data Storage**: Your essays and API keys are never stored

## 🎨 Essay Types Supported

- Personal Statement
- Supplemental Essay
- Common App Essay
- Why This College
- Why This Major
- Extracurricular Activity
- Challenge/Obstacle
- Community Service

## 🏫 College Levels

- Ivy League
- Top 20 Universities
- Top 50 Universities
- State Flagship
- Liberal Arts Colleges
- Community College

## 💡 Writing Styles

- **Authentic & Personal**: Genuine, heartfelt voice
- **Academic & Formal**: Scholarly, professional tone
- **Creative & Narrative**: Storytelling, engaging style
- **Professional & Mature**: Sophisticated, polished approach
- **Conversational & Friendly**: Approachable, relatable tone

## 🔧 Technical Details

### Frontend
- **Framework**: Vanilla JavaScript (no framework dependencies)
- **Styling**: CSS3 with CSS Grid and Flexbox
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Inter (Google Fonts)
- **Responsive**: Mobile-first design approach

### Backend
- **Runtime**: Node.js 18+
- **Platform**: Vercel Serverless Functions
- **API**: OpenRouter integration
- **Security**: CORS, input validation, error handling
- **Performance**: Cold start optimization

## 🛠️ Local Development

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd college-essay-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access at**: `http://localhost:3000`

## 🚨 Troubleshooting

### Common Issues

**401 Unauthorized Error**:
- Make sure your API key starts with `sk-`
- Get a fresh API key from [openrouter.ai/keys](https://openrouter.ai/keys)
- Check that you have credits in your OpenRouter account

**Model Not Working**:
- Use the exact model names from the dropdown
- `openai/o4-mini` is the recommended fast model
- Some models may be temporarily unavailable

**Rate Limit Error**:
- Wait a few minutes and try again
- Check your usage limits on OpenRouter

**Large Input Warning**:
- Break very long essays into smaller sections
- Keep inputs under 50K characters for best results
- Monitor the token estimates shown in the interface

**Backend API Errors**:
- Check the `/api/health` endpoint for backend status
- Ensure your Vercel deployment includes the `/api` folder
- Check Vercel function logs for detailed error information

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🔒 Privacy & Security

- **No data storage**: Your essays and API keys are not stored on our servers
- **Client-side processing**: Settings are saved locally in your browser
- **Secure API calls**: HTTPS encryption for all API requests
- **Local storage**: Settings are saved locally in your browser
- **Serverless security**: Vercel provides enterprise-grade security

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify your API key is working
3. Try a different AI model
4. Check the `/api/health` endpoint
5. Contact OpenRouter support for API issues

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Test all API endpoints locally
- [ ] Verify CORS settings
- [ ] Check error handling
- [ ] Test with different API keys
- [ ] Validate input sanitization
- [ ] Test responsive design
- [ ] Verify download functionality
- [ ] Check copy to clipboard feature

---

**Made with ❤️ for college applicants everywhere** 