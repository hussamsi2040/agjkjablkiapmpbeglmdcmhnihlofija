# 🔑 API Key Troubleshooting Guide

## Common Issues and Solutions

### 1. "Invalid API key" Error

**Problem**: You're getting an "Invalid API key" error when trying to use the app.

**Solutions**:

#### ✅ **Check Your API Key Format**
- Make sure your API key starts with `sk-or-v1-`
- Example: `sk-or-v1-1234567890abcdef...`
- Copy the entire key, including the prefix

#### ✅ **Get a New API Key**
1. Go to [OpenRouter Keys](https://openrouter.ai/keys)
2. Sign in to your account
3. Click "Create Key"
4. Copy the new key immediately
5. Paste it into the app

#### ✅ **Verify Your Account**
- Make sure your OpenRouter account is active
- Check if you have any usage limits
- Verify your email is confirmed

### 2. "Rate limit exceeded" Error

**Problem**: You're getting rate limit errors.

**Solutions**:
- Wait a few minutes and try again
- Check your OpenRouter usage dashboard
- Consider upgrading your plan if you're on the free tier

### 3. "Network error" or Connection Issues

**Problem**: The app can't connect to OpenRouter.

**Solutions**:
- Check your internet connection
- Try refreshing the page
- Clear your browser cache
- Try a different browser

## Step-by-Step Setup Guide

### 1. Create OpenRouter Account
1. Visit [OpenRouter](https://openrouter.ai)
2. Click "Sign Up" or "Get Started"
3. Create an account with your email
4. Verify your email address

### 2. Get Your API Key
1. Go to [OpenRouter Keys](https://openrouter.ai/keys)
2. Click "Create Key"
3. Give your key a name (e.g., "CollegeEssayAI")
4. Copy the generated key (starts with `sk-or-v1-`)

### 3. Use in the App
1. Paste your API key in the "OpenRouter API Key" field
2. Click "Test API Key" to verify it works
3. Start generating essays!

## API Key Security

### ✅ **Best Practices**
- Keep your API key private
- Don't share it publicly
- Use different keys for different projects
- Monitor your usage regularly

### ✅ **What We Do**
- Your API key is stored locally in your browser
- We never store it on our servers
- All API calls are made directly to OpenRouter
- Your data stays private

## Testing Your API Key

### Manual Test
You can test your API key manually using curl:

```bash
curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer sk-or-v1-8f2044dafeae6ac5d80a61bdea372c609cb1c4f82c53a0aa" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "o4-mini",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### Using the App
1. Enter your API key in the app
2. Click "Test API Key" button
3. You should see a success message

## Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| `Invalid API key` | Key format is wrong or expired | Get a new key from OpenRouter |
| `Rate limit exceeded` | Too many requests | Wait and try again |
| `Network error` | Connection problem | Check internet connection |
| `Model not found` | Model name is incorrect | Use a supported model |

## Supported Models

The app supports these OpenRouter models:
- `o4-mini` (recommended for speed)
- `openai/gpt-4o-mini`
- `openai/gpt-4o`
- `anthropic/claude-3-5-sonnet`
- `meta-llama/llama-3.1-70b-instruct`

## Still Having Issues?

If you're still experiencing problems:

1. **Check OpenRouter Status**: Visit [OpenRouter Status](https://status.openrouter.ai)
2. **Contact OpenRouter Support**: Use their [support page](https://openrouter.ai/support)
3. **Check Your Browser Console**: Press F12 and look for error messages
4. **Try a Different Browser**: Sometimes browser extensions can interfere

## Free Tier Limits

OpenRouter offers a generous free tier:
- $5 in free credits
- No credit card required
- Access to all models
- Perfect for testing and personal use

---

**Need more help?** Check the Help tab in the app or visit our documentation. 