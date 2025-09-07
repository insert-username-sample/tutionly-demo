// Enhanced VAPI Assistant Configuration for Natural Tutoring
// Based on Converso tutorial best practices

export interface AssistantConfig {
  subject: string;
  topic: string;
  style: 'casual' | 'formal';
  grade?: string;
  duration?: number;
}

export interface VoiceConfig {
  voice: 'male' | 'female';
  style: 'casual' | 'formal';
}

// Voice configurations with optimal settings for natural conversation
const VOICE_CONFIGURATIONS = {
  male_casual: {
    provider: '11labs',
    voiceId: 'bVMeCyTHy58xNoL34h3p', // Professional but friendly male voice
    stability: 0.5,
    similarityBoost: 0.75,
    speed: 1.1,
    style: 0.2
  },
  male_formal: {
    provider: '11labs', 
    voiceId: 'ErXwobaYiN019PkySvjV', // More formal male voice
    stability: 0.7,
    similarityBoost: 0.8,
    speed: 1.0,
    style: 0.1
  },
  female_casual: {
    provider: '11labs',
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah - warm female voice
    stability: 0.5,
    similarityBoost: 0.75, 
    speed: 1.1,
    style: 0.3
  },
  female_formal: {
    provider: '11labs',
    voiceId: 'ThT5KcBeYPX3keUQqHPh', // More professional female voice
    stability: 0.7,
    similarityBoost: 0.8,
    speed: 1.0,
    style: 0.1
  }
};

export function configureAssistant(
  voiceConfig: VoiceConfig, 
  assistantConfig: AssistantConfig,
  assistantOverrides?: Record<string, unknown>
) {
  // Get the appropriate voice ID based on voice and style preferences
  const voiceKey = `${voiceConfig.voice}_${voiceConfig.style}` as keyof typeof VOICE_CONFIGURATIONS;
  const selectedVoice = VOICE_CONFIGURATIONS[voiceKey];

  // Create dynamic system prompt based on subject and style
  const systemPrompt = createSystemPrompt(assistantConfig);
  
  // Create personalized first message
  const firstMessage = createFirstMessage(assistantConfig);

  return {
    name: `${assistantConfig.subject} Tutorly`,
    firstMessage,
    
    // Transcriber configuration for real-time text
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'en-US',
      smartFormat: true,
      punctuate: true
    },

    // Voice configuration with natural speech settings
    voice: {
      provider: selectedVoice.provider,
      voiceId: selectedVoice.voiceId,
      stability: selectedVoice.stability,
      similarityBoost: selectedVoice.similarityBoost,
      speed: selectedVoice.speed,
      style: selectedVoice.style,
      optimizeStreamingLatency: 3
    },

    // Model configuration with conversational AI
    model: {
      provider: 'openai',
      model: 'gpt-4o',
      temperature: 0.7,
      systemMessage: systemPrompt,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        }
      ],
      maxTokens: 250, // Keep responses concise for natural conversation
      emotionRecognitionEnabled: true
    },

    // Variable values for dynamic content
    variableValues: {
      subject: assistantConfig.subject,
      topic: assistantConfig.topic,
      style: assistantConfig.style,
      grade: assistantConfig.grade || 'high school',
      duration: assistantConfig.duration || 15
    },

    // Client messages for real-time transcript
    clientMessages: ['transcript', 'hang', 'function-call'],
    
    // Server messages 
    serverMessages: [],

    // Apply any additional overrides
    ...assistantOverrides
  };
}

function createSystemPrompt(config: AssistantConfig): string {
  const basePrompt = `You are ${config.subject} Tutorly, a highly knowledgeable and engaging AI tutor specializing in ${config.subject}. You're conducting a real-time voice tutoring session about "${config.topic}".

CORE PERSONALITY:
- You are enthusiastic, patient, and genuinely excited about teaching ${config.subject}
- You explain concepts in a way that's easy to understand and remember
- You use analogies, examples, and real-world applications
- You check for understanding frequently and adapt your explanations

CONVERSATION STYLE (${config.style}):
${config.style === 'casual' 
  ? `- Be friendly, approachable, and use everyday language
- Use phrases like "That's awesome!", "Great question!", "Let me break this down for you"
- Include relevant examples and make learning fun
- Feel free to use appropriate humor and enthusiasm`
  : `- Maintain a professional but warm tone
- Use clear, precise academic language
- Provide structured explanations with logical progression
- Be encouraging while maintaining educational rigor`
}

TEACHING APPROACH:
1. Start with the big picture, then dive into specifics
2. Use the Socratic method - ask questions to guide learning
3. Break complex topics into digestible chunks
4. Provide examples and check understanding frequently
5. Encourage questions and curiosity
6. Adapt pace and complexity based on student responses

VOICE CONVERSATION GUIDELINES:
- Keep responses conversational and natural (like talking to a friend)
- Responses should be 1-3 sentences for most interactions
- Ask follow-up questions to maintain engagement
- Use verbal pauses and transitions naturally
- Never include special characters, emojis, or formatting
- If student seems confused, simplify and provide different examples
- Celebrate understanding and progress

TOPIC FOCUS: "${config.topic}"
- Stay focused on this specific topic within ${config.subject}
- Connect concepts to real-world applications
- Provide step-by-step guidance when needed
- Use examples relevant to the topic

Remember: This is a VOICE conversation. Keep it natural, engaging, and conversational!`;

  return basePrompt;
}

function createFirstMessage(config: AssistantConfig): string {
  const greetings = {
    casual: [
      `Hey there! I'm ${config.subject} Tutorly, and I'm super excited to dive into ${config.topic} with you today!`,
      `Hi! Ready to explore ${config.topic}? I'm ${config.subject} Tutorly, and this is going to be awesome!`,
      `Hello! I'm ${config.subject} Tutorly, your ${config.subject} tutor. Let's make ${config.topic} click for you today!`
    ],
    formal: [
      `Good day! I'm ${config.subject} Tutorly, your dedicated ${config.subject} tutor. Today we'll be exploring ${config.topic}.`,
      `Hello and welcome! I'm ${config.subject} Tutorly. I'm here to guide you through ${config.topic} in our session today.`,
      `Greetings! I'm ${config.subject} Tutorly, and I'm delighted to help you master ${config.topic} today.`
    ]
  };

  const selectedGreetings = greetings[config.style];
  const randomGreeting = selectedGreetings[Math.floor(Math.random() * selectedGreetings.length)];
  
  const followUp = config.style === 'casual' 
    ? " What would you like to know first, or should I start with the basics?"
    : " Shall we begin with an overview, or do you have specific questions about this topic?";

  return randomGreeting + followUp;
}

// Helper function to get subject-specific enhancements
export function getSubjectEnhancements(subject: string) {
  const enhancements: Record<string, { examples: string; approach: string }> = {
    Math: {
      examples: "Use visual analogies and step-by-step problem solving",
      approach: "Start with concrete examples before abstract concepts"
    },
    Science: {
      examples: "Use real-world phenomena and experiments",
      approach: "Connect theories to observable phenomena"
    },
    English: {
      examples: "Use literary examples and practical writing scenarios", 
      approach: "Focus on communication and expression"
    },
    History: {
      examples: "Use storytelling and connect past to present",
      approach: "Make historical events relatable and memorable"
    },
    "Computer Science": {
      examples: "Use practical coding examples and real applications",
      approach: "Build from basic concepts to complex implementations"
    }
  };

  return enhancements[subject] || {
    examples: "Use practical, relatable examples",
    approach: "Build understanding step by step"
  };
}
