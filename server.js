const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors({
    origin: true,
    credentials: true
}));

// Serve static files
app.use(express.static(__dirname));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'EssayAI server is running' });
});

app.listen(PORT, () => {
    console.log(`EssayAI server running at http://localhost:${PORT}`);
    console.log('Get your OpenRouter API key from https://openrouter.ai/keys');
    console.log('Enter your API key in the app settings to start generating essays!');
}); 