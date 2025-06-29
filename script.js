// EssayAI - Generator & Grader with OpenRouter API Integration
class EssayAI {
    constructor() {
        this.apiKey = '';
        this.baseUrl = 'https://openrouter.ai/api/v1';
        this.defaultModel = 'openai/o4-mini';
        this.maxTokens = 2000;
        this.isLoading = false;
        this.abortController = null;
        
        this.initializeApp();
        this.loadSettings();
        this.setupEventListeners();
    }

    initializeApp() {
        // Initialize UI elements
        this.elements = {
            modeBtns: document.querySelectorAll('.mode-btn'),
            generatorMode: document.getElementById('generatorMode'),
            graderMode: document.getElementById('graderMode'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            loadingText: document.getElementById('loadingText'),
            settingsModal: document.getElementById('settingsModal'),
            settingsBtn: document.getElementById('settingsBtn'),
            closeSettingsBtn: document.getElementById('closeSettingsBtn'),
            saveSettingsBtn: document.getElementById('saveSettingsBtn'),
            generateBtn: document.getElementById('generateBtn'),
            gradeBtn: document.getElementById('gradeBtn'),
            copyEssayBtn: document.getElementById('copyEssayBtn'),
            downloadEssayBtn: document.getElementById('downloadEssayBtn'),
            copyGradeBtn: document.getElementById('copyGradeBtn'),
            downloadGradeBtn: document.getElementById('downloadGradeBtn')
        };

        // Initialize form elements
        this.forms = {
            generator: {
                topic: document.getElementById('essayTopic'),
                type: document.getElementById('essayType'),
                length: document.getElementById('essayLength'),
                level: document.getElementById('academicLevel'),
                style: document.getElementById('writingStyle'),
                requirements: document.getElementById('additionalRequirements')
            },
            grader: {
                essay: document.getElementById('essayToGrade'),
                criteria: document.getElementById('gradingCriteria'),
                level: document.getElementById('gradeLevel'),
                instructions: document.getElementById('gradingInstructions')
            },
            settings: {
                apiKey: document.getElementById('openaiApiKey'),
                model: document.getElementById('defaultModel'),
                maxTokens: document.getElementById('maxTokens')
            }
        };

        // Initialize output elements
        this.outputs = {
            essay: document.getElementById('essayOutput'),
            grade: document.getElementById('gradeOutput')
        };
    }

    setupEventListeners() {
        // Mode switching
        this.elements.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });

        // Settings
        this.elements.settingsBtn.addEventListener('click', () => this.openSettings());
        this.elements.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.elements.saveSettingsBtn.addEventListener('click', () => this.saveSettings());

        // Main actions
        this.elements.generateBtn.addEventListener('click', () => this.generateEssay());
        this.elements.gradeBtn.addEventListener('click', () => this.gradeEssay());

        // Output actions
        this.elements.copyEssayBtn.addEventListener('click', () => this.copyToClipboard('essay'));
        this.elements.downloadEssayBtn.addEventListener('click', () => this.downloadContent('essay'));
        this.elements.copyGradeBtn.addEventListener('click', () => this.copyToClipboard('grade'));
        this.elements.downloadGradeBtn.addEventListener('click', () => this.downloadContent('grade'));

        // Close modal on outside click
        this.elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) {
                this.closeSettings();
            }
        });
    }

    switchMode(mode) {
        // Update active button
        this.elements.modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Update active content
        this.elements.generatorMode.classList.toggle('active', mode === 'generator');
        this.elements.graderMode.classList.toggle('active', mode === 'grader');
    }

    async generateEssay() {
        if (this.isLoading) return;

        const topic = this.forms.generator.topic.value.trim();
        if (!topic) {
            this.showError('Please enter an essay topic.');
            return;
        }

        if (!this.apiKey) {
            this.showError('Please enter your OpenRouter API key in settings.');
            this.openSettings();
            return;
        }

        this.setLoading(true, 'Generating your essay...');

        try {
            const prompt = this.buildEssayPrompt();
            const response = await this.callOpenRouter(prompt);
            
            if (response) {
                this.displayEssay(response);
            }
        } catch (error) {
            console.error('Generation error:', error);
            this.showError(`Error generating essay: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }

    async gradeEssay() {
        if (this.isLoading) return;

        const essay = this.forms.grader.essay.value.trim();
        if (!essay) {
            this.showError('Please enter an essay to grade.');
            return;
        }

        if (!this.apiKey) {
            this.showError('Please enter your OpenRouter API key in settings.');
            this.openSettings();
            return;
        }

        this.setLoading(true, 'Grading your essay...');

        try {
            const prompt = this.buildGradingPrompt();
            const response = await this.callOpenRouter(prompt);
            
            if (response) {
                this.displayGrade(response);
            }
        } catch (error) {
            console.error('Grading error:', error);
            this.showError(`Error grading essay: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }

    buildEssayPrompt() {
        const {
            topic,
            type,
            length,
            level,
            style,
            requirements
        } = this.forms.generator;

        const lengthMap = {
            '250': '250 words',
            '500': '500 words',
            '650': '650 words',
            '750': '750 words',
            '1000': '1000+ words'
        };

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

        let prompt = `Write a college admission essay for the following prompt: "${topic.value}"

Essay Type: ${typeMap[type.value]}
Target: ${levelMap[level.value]}
Length: ${lengthMap[length.value]}
Style: ${styleMap[style.value]}

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

        if (requirements.value.trim()) {
            prompt += `\n\nAdditional Requirements: ${requirements.value}`;
        }

        prompt += `\n\nCollege Admission Essay:`;

        return prompt;
    }

    buildGradingPrompt() {
        const {
            essay,
            criteria,
            level,
            instructions
        } = this.forms.grader;

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
"${essay.value}"

Analysis Focus: ${criteriaMap[criteria.value]}
Target Level: ${levelMap[level.value]}

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

        if (instructions.value.trim()) {
            prompt += `\n\nSpecific Focus Areas: ${instructions.value}`;
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

    async callOpenRouter(prompt) {
        try {
            console.log('Calling OpenRouter API with OpenAI SDK format...');
            
            this.abortController = new AbortController();

            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                signal: this.abortController.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'EssayAI'
                },
                body: JSON.stringify({
                    model: this.defaultModel,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: this.maxTokens,
                    temperature: 0.7,
                    stream: false
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error:', response.status, errorData);
                
                if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your OpenRouter API key.');
                } else if (response.status === 429) {
                    throw new Error('Rate limit exceeded. Please try again later.');
                } else if (response.status === 400) {
                    throw new Error(`Bad request: ${errorData.error?.message || 'Invalid parameters'}`);
                } else {
                    throw new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
                }
            }

            const data = await response.json();
            console.log('API Response received:', data);

            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content;
            } else {
                throw new Error('Invalid response format from API');
            }

        } catch (error) {
            console.error('OpenRouter API call error:', error);
            
            if (error.name === 'AbortError') {
                throw new Error('Request was cancelled');
            }
            
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Network error. Please check your internet connection.');
            }
            
            throw error;
        }
    }

    displayEssay(content) {
        this.outputs.essay.innerHTML = `
            <div class="generated-essay">
                <h4>Generated Essay</h4>
                <div class="essay-content">
                    ${content.replace(/\n/g, '<br>')}
                </div>
            </div>
        `;
    }

    displayGrade(content) {
        // Parse the grading response and format it nicely
        const formattedContent = this.formatGradingResponse(content);
        
        this.outputs.grade.innerHTML = `
            <div class="grading-results">
                ${formattedContent}
            </div>
        `;
    }

    formatGradingResponse(content) {
        // Extract grade and score
        const gradeMatch = content.match(/Overall Grade:\s*([A-F])\s*\((\d+)\/100\)/i);
        const breakdownMatches = content.match(/(\w+[^:]*):\s*(\d+)\/25/g);
        
        let html = '';
        
        if (gradeMatch) {
            const grade = gradeMatch[1];
            const score = gradeMatch[2];
            const gradeColor = this.getGradeColor(grade);
            
            html += `
                <div class="grade-summary">
                    <div class="grade-item">
                        <h5>Overall Grade</h5>
                        <div class="score">${score}/100</div>
                        <div class="grade" style="color: ${gradeColor}">${grade}</div>
                    </div>
            `;
            
            if (breakdownMatches) {
                breakdownMatches.forEach(match => {
                    const [category, score] = match.split(':').map(s => s.trim());
                    const cleanCategory = category.replace(/\*\*/g, '');
                    const cleanScore = score.replace('/25', '');
                    
                    html += `
                        <div class="grade-item">
                            <h5>${cleanCategory}</h5>
                            <div class="score">${cleanScore}/25</div>
                        </div>
                    `;
                });
            }
            
            html += '</div>';
        }
        
        // Add the full feedback
        html += `
            <div class="feedback-section">
                <h5>Detailed Feedback</h5>
                <div class="feedback-content">
                    ${content.replace(/\n/g, '<br>')}
                </div>
            </div>
        `;
        
        return html;
    }

    getGradeColor(grade) {
        const colors = {
            'A': '#28a745',
            'B': '#17a2b8',
            'C': '#ffc107',
            'D': '#fd7e14',
            'F': '#dc3545'
        };
        return colors[grade] || '#666';
    }

    setLoading(loading, message = 'Processing...') {
        this.isLoading = loading;
        this.elements.loadingText.textContent = message;
        this.elements.loadingOverlay.classList.toggle('hidden', !loading);
        
        if (!loading && this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }

    showError(message) {
        alert(message); // In a real app, you'd want a better error display
    }

    async copyToClipboard(type) {
        const content = this.outputs[type].textContent;
        try {
            await navigator.clipboard.writeText(content);
            this.showSuccess('Content copied to clipboard!');
        } catch (error) {
            this.showError('Failed to copy content');
        }
    }

    downloadContent(type) {
        const content = this.outputs[type].textContent;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type === 'essay' ? 'essay' : 'grading-results'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showSuccess(message) {
        // In a real app, you'd want a proper success notification
        console.log(message);
    }

    openSettings() {
        this.elements.settingsModal.classList.remove('hidden');
    }

    closeSettings() {
        this.elements.settingsModal.classList.add('hidden');
    }

    saveSettings() {
        this.apiKey = this.forms.settings.apiKey.value.trim();
        this.defaultModel = this.forms.settings.model.value;
        this.maxTokens = parseInt(this.forms.settings.maxTokens.value);
        
        localStorage.setItem('essayAI_settings', JSON.stringify({
            apiKey: this.apiKey,
            defaultModel: this.defaultModel,
            maxTokens: this.maxTokens
        }));
        
        this.closeSettings();
        this.showSuccess('Settings saved successfully!');
    }

    loadSettings() {
        const saved = localStorage.getItem('essayAI_settings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.apiKey = settings.apiKey || '';
            this.defaultModel = settings.defaultModel || 'openai/o4-mini';
            this.maxTokens = settings.maxTokens || 2000;
            
            // Update form fields
            this.forms.settings.apiKey.value = this.apiKey;
            this.forms.settings.model.value = this.defaultModel;
            this.forms.settings.maxTokens.value = this.maxTokens;
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EssayAI();
}); 