# 🎓 CollegeEssayAI

A modern, AI-powered college admission essay generator and analyzer built with **Next.js 14**, **React**, and **TypeScript**. Transform your college application with cutting-edge AI technology.

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

- **🤖 AI-Powered Generation**: Create compelling college essays using state-of-the-art AI models
- **📊 Expert Analysis**: Get detailed feedback and improvement suggestions for your essays
- **🎯 College-Focused**: Specialized prompts and guidance for college admission essays
- **⚡ Multiple AI Models**: Choose from O4 Mini, GPT-4o, Claude 3.5 Sonnet, and more
- **🎨 Modern UI**: Beautiful, responsive design with smooth animations
- **🔒 Secure**: Your API key stays local, no data stored on servers
- **📱 Mobile-Friendly**: Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenRouter API key (free at [openrouter.ai](https://openrouter.ai/keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd college-essay-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Getting Your API Key

1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Sign up for a free account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy and paste it into the app

## 🎯 How to Use

### Generate an Essay

1. **Enter your API key** in the settings panel
2. **Select an AI model** (O4 Mini is recommended for speed)
3. **Switch to the "Generate Essay" tab**
4. **Enter your essay prompt** or choose from Common App prompts
5. **Set your preferences**:
   - Target word count (250-1000 words)
   - Writing tone (professional, personal, etc.)
   - Writing style (narrative, analytical, etc.)
6. **Click "Generate Essay"** and wait for your AI-crafted essay

### Analyze an Essay

1. **Switch to the "Analyze Essay" tab**
2. **Paste your essay** in the text area
3. **Optionally add the original prompt** for better analysis
4. **Click "Analyze Essay"** to get expert feedback

## 🤖 Available AI Models

| Model | Speed | Quality | Best For |
|-------|-------|---------|----------|
| **O4 Mini** | ⚡⚡⚡ | ⭐⭐⭐ | Quick drafts, brainstorming |
| **GPT-4o Mini** | ⚡⚡ | ⭐⭐⭐⭐ | Balanced speed and quality |
| **GPT-4o** | ⚡ | ⭐⭐⭐⭐⭐ | Final drafts, premium quality |
| **Claude 3.5 Sonnet** | ⚡⚡ | ⭐⭐⭐⭐⭐ | Creative writing, analysis |
| **Llama 3.1 70B** | ⚡⚡ | ⭐⭐⭐⭐ | Analytical capabilities |

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules with custom properties
- **AI Integration**: OpenAI SDK with OpenRouter
- **Deployment**: Vercel (recommended)

## 📦 Project Structure

```
college-essay-ai/
├── app/
│   ├── api/
│   │   ├── generate-essay/
│   │   │   └── route.ts          # Essay generation API
│   │   ├── analyze-essay/
│   │   │   └── route.ts          # Essay analysis API
│   │   └── health/
│   │       └── route.ts          # Health check API
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page component
├── public/                       # Static assets
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js
3. **Deploy**: Click "Deploy" and your app will be live!

### Environment Variables (Optional)

For production, you can set environment variables in Vercel:

```bash
NEXT_PUBLIC_APP_NAME=CollegeEssayAI
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style

This project uses:
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Next.js** conventions

## 🎨 Customization

### Styling

The app uses CSS custom properties for easy theming. Key variables in `app/globals.css`:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #4facfe;
  /* ... more variables */
}
```

### Adding New AI Models

To add new models, update the `models` array in `app/page.tsx`:

```typescript
const models = [
  // ... existing models
  { 
    value: 'your-model-id', 
    label: 'Your Model Name', 
    description: 'Model description' 
  }
];
```

## 🔒 Privacy & Security

- **No Data Storage**: Your essays and API keys are never stored on our servers
- **Local Processing**: All API calls are made directly from your browser
- **Secure API**: Uses OpenRouter's secure API endpoints
- **HTTPS Only**: All communications are encrypted

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and the Help tab in the app
- **Issues**: Report bugs on GitHub Issues
- **API Issues**: Contact OpenRouter support for API-related problems

## 🙏 Acknowledgments

- **OpenRouter** for providing access to multiple AI models
- **Next.js** team for the amazing framework
- **OpenAI** for the GPT models
- **Anthropic** for Claude models
- **Meta** for Llama models

---

**Made with ❤️ for college applicants worldwide**

Transform your college application today with AI-powered essay writing! 