import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HfInference } from '@huggingface/inference';

class AIService {
    constructor() {
        this.provider = 'mock';
        this.openai = null;
        this.gemini = null;
        this.huggingface = null;
        this.initialize();
    }

    initialize() {
        // Try HuggingFace first (most reliable free option)
        if (process.env.HUGGINGFACE_API_KEY) {
            try {
                this.huggingface = new HfInference(process.env.HUGGINGFACE_API_KEY);
                this.provider = 'huggingface';
                console.log('✅ AI Service initialized with HuggingFace');
                return;
            } catch (error) {
                console.error('HuggingFace initialization failed:', error.message);
            }
        }

        // Try OpenAI second
        if (process.env.OPENAI_API_KEY) {
            try {
                this.openai = new OpenAI({
                    apiKey: process.env.OPENAI_API_KEY
                });
                this.provider = 'openai';
                console.log('✅ AI Service initialized with OpenAI');
                return;
            } catch (error) {
                console.error('OpenAI initialization failed:', error.message);
            }
        }

        // Try Gemini as last resort
        if (process.env.GEMINI_API_KEY) {
            try {
                this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                this.provider = 'gemini';
                console.log('✅ AI Service initialized with Gemini');
                return;
            } catch (error) {
                console.error('Gemini initialization failed:', error.message);
            }
        }

        console.warn('⚠️  No AI API key configured. Using mock responses.');
        console.warn('   Set HUGGINGFACE_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY in .env to enable AI features.');
    }

    async generateContent(context, type) {
        if (this.provider === 'huggingface') {
            return await this.generateWithHuggingFace(context, type);
        } else if (this.provider === 'openai') {
            return await this.generateWithOpenAI(context, type);
        } else if (this.provider === 'gemini') {
            return await this.generateWithGemini(context, type);
        } else {
            return this.getMockResponse(type);
        }
    }

    async generateWithHuggingFace(context, type) {
        try {
            console.log('🔵 HuggingFace API call started for type:', type);
            const prompt = this.buildPrompt(context, type);

            const response = await this.huggingface.textGeneration({
                model: 'google/flan-t5-base',
                inputs: prompt,
                parameters: {
                    max_new_tokens: 250,
                    temperature: 0.7,
                    return_full_text: false
                }
            });

            console.log('✅ HuggingFace API call successful');
            return {
                suggestion: response.generated_text.trim(),
                provider: 'huggingface',
                type
            };
        } catch (error) {
            console.error('❌ HuggingFace API error:', error.message);
            console.error('Error details:', JSON.stringify(error, null, 2));

            // Fallback to mock response
            console.warn('⚠️  Falling back to mock response due to HuggingFace error');
            return this.getMockResponse(type);
        }
    }

    async generateWithOpenAI(context, type) {
        try {
            const prompt = this.buildPrompt(context, type);

            const completion = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant for a portfolio website. Provide concise, professional suggestions.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 500,
                temperature: 0.7
            });

            return {
                suggestion: completion.choices[0].message.content.trim(),
                provider: 'openai',
                type
            };
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw new Error('AI generation failed: ' + error.message);
        }
    }

    async generateWithGemini(context, type) {
        try {
            console.log('🔵 Gemini API call started for type:', type);
            const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });
            const prompt = this.buildPrompt(context, type);

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            console.log('✅ Gemini API call successful');
            return {
                suggestion: text.trim(),
                provider: 'gemini',
                type
            };
        } catch (error) {
            console.error('❌ Gemini API error:', error.message);
            console.error('Error details:', JSON.stringify(error, null, 2));

            // Fallback to mock response instead of throwing error
            console.warn('⚠️  Falling back to mock response due to Gemini error');
            return this.getMockResponse(type);
        }
    }

    buildPrompt(context, type) {
        const prompts = {
            about: `Improve this "About Me" section for a developer portfolio. Make it professional, engaging, and concise:\n\n${context}`,

            skill: `Suggest a professional description for this skill in a developer portfolio:\n\n${context}`,

            project: `Enhance this project description for a portfolio. Make it compelling and highlight technical achievements:\n\n${context}`,

            blog: `Improve this blog post excerpt. Make it engaging and SEO-friendly:\n\n${context}`,

            funfact: `Suggest an interesting and professional fun fact for a developer portfolio based on:\n\n${context}`,

            experience: `Enhance this work experience description. Make it achievement-focused and quantifiable:\n\n${context}`,

            chat: context,

            rephrase: `Rephrase the following text to be more professional and engaging:\n\n${context}`,

            seo_description: `Generate a compelling SEO meta description (150-160 characters) for:\n\n${context}`,

            seo_title: `Generate an SEO-optimized title (50-60 characters) for:\n\n${context}`,

            keywords: `Generate 5-10 relevant SEO keywords for:\n\n${context}`
        };

        return prompts[type] || context;
    }

    getMockResponse(type) {
        const mockResponses = {
            about: {
                suggestion: "I'm a passionate full-stack developer with expertise in modern web technologies. I love building scalable applications and solving complex problems with elegant solutions.",
                provider: 'mock',
                type
            },
            skill: {
                suggestion: "A powerful framework for building dynamic web applications with TypeScript and reactive programming.",
                provider: 'mock',
                type
            },
            project: {
                suggestion: "A full-featured web application built with modern technologies, featuring real-time updates, responsive design, and optimized performance.",
                provider: 'mock',
                type
            },
            blog: {
                suggestion: "Discover the latest trends and best practices in modern web development. Learn how to build better applications with cutting-edge technologies.",
                provider: 'mock',
                type
            },
            funfact: {
                suggestion: "I've contributed to open-source projects with over 1000+ stars on GitHub.",
                provider: 'mock',
                type
            },
            experience: {
                suggestion: "Led development of key features that improved user engagement by 40% and reduced load times by 60%.",
                provider: 'mock',
                type
            },
            chat: {
                suggestion: "I'm here to help! How can I assist you with your portfolio content?",
                provider: 'mock',
                type
            },
            rephrase: {
                suggestion: "Your text has been rephrased professionally. Configure an AI API key to get real suggestions.",
                provider: 'mock',
                type
            },
            seo_description: {
                suggestion: "Explore my portfolio showcasing innovative web development projects, technical skills, and professional experience in modern technologies.",
                provider: 'mock',
                type
            },
            seo_title: {
                suggestion: "Full-Stack Developer Portfolio | Modern Web Development",
                provider: 'mock',
                type
            },
            keywords: {
                suggestion: "web development, full-stack developer, React, Angular, Node.js, TypeScript, portfolio, software engineer",
                provider: 'mock',
                type
            }
        };

        return mockResponses[type] || {
            suggestion: "Configure OPENAI_API_KEY or GEMINI_API_KEY in .env to enable AI features.",
            provider: 'mock',
            type
        };
    }

    // New methods for specific AI features
    async rephraseText(text) {
        return await this.generateContent(text, 'rephrase');
    }

    async generateSEODescription(content) {
        return await this.generateContent(content, 'seo_description');
    }

    async generateSEOTitle(content) {
        return await this.generateContent(content, 'seo_title');
    }

    async generateKeywords(content) {
        return await this.generateContent(content, 'keywords');
    }
}

export default new AIService();
