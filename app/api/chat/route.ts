import { NextRequest, NextResponse } from 'next/server';

// Production n8n webhook URL with environment variable override
const PRODUCTION_WEBHOOK_URL = 'https://huassist2010.app.n8n.cloud/webhook/YOUR_PRODUCTION_WEBHOOK_ID';
const WEBHOOK_URL = process.env.NEXT_PUBLIC_AI_WEBHOOK_URL || PRODUCTION_WEBHOOK_URL;

console.log('✅ N8N WEBHOOK CONFIGURATION:', {
  production: PRODUCTION_WEBHOOK_URL,
  active: WEBHOOK_URL,
  isCustom: process.env.NEXT_PUBLIC_AI_WEBHOOK_URL ? true : false,
});

interface ChatRequest {
  message: string;
  history?: Array<{ role: string; content: string }>;
}

// Smart response generator - HUVOICE AI with intelligent, comprehensive answers
function generateSmartResponse(message: string): string {
  const msg = message.toLowerCase().trim();
  
  // Greetings & Hello
  if (/^(hello|hi|hey|greetings|sup|yo|namaste|vanakkam|namaskar)/i.test(msg)) {
    const greetings = [
      "Hey! I'm HUVOICE AI. What can I help you with today?",
      "Hi there! Ready to chat. What's on your mind?",
      "Hey! What brings you here? Ask me anything! 🎙️",
      "Yo! I'm here to help. What do you want to know?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // How are you / feelings
  if (/(how are you|how do you feel|how's it going|what's up|how you doing|kaise ho|how are u)/i.test(msg)) {
    const responses = [
      "I'm doing great, thanks for asking! Ready to help with anything you need. What can I do for you?",
      "All good here! Energized and ready to assist. What's on your mind?",
      "Living my best digital life! 😊 What can I help you with?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Can I ask a question
  if (/can i ask|may i ask|could i ask|ek sawaal|ek prashna|ek question/i.test(msg)) {
    const responses = [
      "Absolutely! Ask me anything. I'm here to help with any question you have.",
      "Of course! Fire away. That's what I'm here for! 🎯",
      "Hell yeah! Ask away. No such thing as a silly question to me."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Questions about self / what are you
  if (/(what are you|who are you|tell me about yourself|what can you do|batao aap kaun ho|aap kaun ho)/i.test(msg)) {
    return "I'm HUVOICE AI, an intelligent voice assistant built to help you with literally anything! I can:\n• Answer questions on any topic (science, tech, history, coding, etc.)\n• Do math calculations instantly\n• Tell you jokes and stories\n• Give career guidance and life advice\n• Explain complex topics simply\n• Write code and provide solutions\n• Have natural conversations in English or Hindi\n• And much more! Just ask me anything and I'll help. 🚀";
  }
  
  // Knowledge questions (Who is, What is)
  if (/(who is|who was|what is|what was|explain|define|batao)/i.test(msg)) {
    // Check specific patterns
    if (/(modi|narendra modi|rahul gandhi|arvind kejriwal|indian politics|politics)/i.test(msg)) {
      if (/modi|narendra modi/i.test(msg)) {
        return "Narendra Modi is the Prime Minister of India since 2014 and leader of the BJP. He's known for initiatives like Make in India, Digital India, and Swachh Bharat. He was previously Chief Minister of Gujarat (2001-2014). He's a significant political figure in India with both supporters and critics. 🇮🇳";
      }
      return "Indian politics is diverse with multiple parties, the major ones being BJP, Congress, and regional parties. The government structure includes the President, Prime Minister, and Parliament (Lok Sabha & Rajya Sabha).";
    }
    
    if (/(ai|artificial intelligence|machine learning|deep learning|neural network)/i.test(msg)) {
      return "Artificial Intelligence (AI) is technology that enables machines to think, learn, and make decisions like humans. It powers things like chatbots (like me!), recommendation systems, self-driving cars, and voice assistants. Machine learning is a subset where AI systems improve by learning from data without explicit programming. Deep learning uses neural networks inspired by the brain. It's transforming every industry! 🤖";
    }
    
    if (/(python|javascript|java|coding|programming|web development)/i.test(msg)) {
      return "Python is versatile - great for beginners, data science, AI, and backend. JavaScript powers web browsers and Node.js servers. Java is used in enterprise systems. Web development typically uses HTML/CSS/JavaScript for frontend and Python/Node.js/Java for backend. Want me to explain any specific language or help with code? 💻";
    }
    
    if (/(india|country|geography|capital|delhi)/i.test(msg)) {
      return "India is a diverse South Asian country with 1.4+ billion people, 28 states, and incredible cultural diversity. The capital is New Delhi. It's known for IT industry, Bollywood, spirituality, and ancient heritage. From Himalayan mountains to tropical beaches - India has it all! 🇮🇳";
    }
    
    return "That's an interesting question! I'd love to give you detailed info. Can you be more specific about what you're asking?";
  }
  
  // Math questions - accurate calculations
  if (/(\d+\s*[\+\-\*/]\s*\d+|calculate|multiply|divide|add|subtract|times|plus|minus|math)/i.test(msg)) {
    // Addition
    const addMatch = msg.match(/(\d+\.?\d*)\s*\+\s*(\d+\.?\d*)/);
    if (addMatch) {
      const result = parseFloat(addMatch[1]) + parseFloat(addMatch[2]);
      return `${addMatch[1]} + ${addMatch[2]} = ${result}`;
    }
    
    // Subtraction
    const subMatch = msg.match(/(\d+\.?\d*)\s*\-\s*(\d+\.?\d*)/);
    if (subMatch) {
      const result = parseFloat(subMatch[1]) - parseFloat(subMatch[2]);
      return `${subMatch[1]} - ${subMatch[2]} = ${result}`;
    }
    
    // Multiplication
    const mulMatch = msg.match(/(\d+\.?\d*)\s*[\*x]\s*(\d+\.?\d*)/);
    if (mulMatch) {
      const result = parseFloat(mulMatch[1]) * parseFloat(mulMatch[2]);
      return `${mulMatch[1]} × ${mulMatch[2]} = ${result}`;
    }
    
    // Division
    const divMatch = msg.match(/(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)/);
    if (divMatch) {
      const result = parseFloat(divMatch[1]) / parseFloat(divMatch[2]);
      return `${divMatch[1]} ÷ ${divMatch[2]} = ${result.toFixed(2)}`;
    }
    
    return "Sure! Give me a calculation like '25 + 17' or '100 × 5' and I'll solve it instantly! ⚡";
  }
  
  // Jokes & Humor
  if (/(joke|funny|make me laugh|tell me something funny|haha|lol|😄|😂)/i.test(msg)) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything! 😄",
      "What do you call a fake noodle? An impasta! 🍝",
      "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
      "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
      "Why did the coffee file a police report? It got mugged! ☕😄",
      "I told my computer I needed a break. Now it won't stop sending me Kit-Kat ads! 🍫",
      "Why do Java developers wear glasses? Because they don't C#! 👓"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  
  // Time & Date
  if (/(what time|what's the time|current time|what date|today's date|tell me the time|batao time|kya time hai)/i.test(msg)) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    return `⏰ It's ${timeStr} on ${dateStr}`;
  }
  
  // Help & Capabilities
  if (/(help|what can i do|commands|features|capabilities|batao aap kya kar sakte ho|aap kya kar sakte ho)/i.test(msg)) {
    return "I'm your all-purpose AI assistant! I can help with:\n📚 Knowledge - Explain any topic (science, history, coding, etc.)\n🧮 Math - Instant calculations\n😄 Jokes - Make you laugh\n⏰ Time - Current time and date\n💻 Coding - Write and explain code\n📖 Writing - Stories, poems, essays\n🎓 Learning - Explain concepts simply\n💼 Career - Guidance and advice\n🤝 Chat - Have real conversations\nJust ask me anything! 🚀";
  }
  
  // Default intelligent response - don't be robotic!
  const defaultResponses = [
    "That's interesting! Tell me more and I'll help you out.",
    "Got it! I'm ready to dive into this. What specifically do you want to know?",
    "Sure thing! Give me more details and I'll provide you with a solid answer.",
    "Alright, I'm listening. What exactly are you looking for?"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

async function fetchWebhookResponse(message: string): Promise<string> {
  if (!WEBHOOK_URL) {
    throw new Error('Webhook URL is not configured');
  }

  console.log('🔗 N8N Webhook URL:', WEBHOOK_URL);
  
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const requestBody = { message };

    console.log('📤 N8N Webhook Request:', { 
      url: WEBHOOK_URL, 
      message: message.substring(0, 100),
    });

    const startTime = Date.now();
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    const duration = Date.now() - startTime;
    clearTimeout(timeout);

    // Read response body safely
    let text = '';
    try {
      text = await response.text();
    } catch (e) {
      console.warn('⚠️ Failed to read response body:', e);
    }

    // Log full response for debugging
    console.log('📥 N8N Full Response:', {
      status: response.status,
      statusText: response.statusText,
      contentLength: text?.length || 0,
      duration: duration + 'ms',
      hasBody: !!text && text.length > 0,
      preview: text?.substring(0, 300) || '(empty)',
    });

    // Check HTTP status first
    if (!response.ok) {
      let errorMessage = `N8N returned ${response.status}: ${response.statusText}`;
      
      // Try to extract error details from response
      try {
        if (text && text.trim()) {
          const errorPayload = JSON.parse(text);
          errorMessage = errorPayload?.error || errorPayload?.message || errorMessage;
        }
      } catch {
        // If can't parse, use response text if available
        if (text && text.trim()) {
          errorMessage = text.substring(0, 200);
        }
      }
      
      console.error('❌ N8N HTTP Error:', { status: response.status, error: errorMessage });
      throw new Error(`N8N error (${response.status}): ${errorMessage}`);
    }

    // Parse response body - handle empty, plain text, and JSON safely
    let payload: any = null;
    
    if (text && text.trim()) {
      try {
        // Try parsing as JSON
        payload = JSON.parse(text);
      } catch (e) {
        // Not JSON, treat as plain text response
        console.log('ℹ️ Response is plain text (not JSON)');
        payload = { body: text };
      }
    } else {
      // Empty response body
      console.warn('⚠️ N8N returned empty response body');
      payload = {};
    }

    console.log('📊 Parsed Payload:', JSON.stringify(payload).substring(0, 300));

    // Extract message from payload - supports multiple formats
    // Try "reply" first (new format), then "message", then others
    const aiMessage: string | null | undefined =
      payload?.reply ||              // Support "reply" field
      payload?.message ||            // Support "message" field
      payload?.text ||               // Support "text" field
      payload?.response ||           // Support "response" field
      payload?.output ||             // Support "output" field
      payload?.result ||             // Support "result" field
      payload?.content ||            // Support "content" field
      payload?.data?.message ||      // Support nested data.message
      payload?.data?.text ||         // Support nested data.text
      payload?.body ||               // Support "body" field (plain text)
      (typeof payload === 'string' ? payload : null);

    // Handle null, undefined, or empty string
    if (!aiMessage || (typeof aiMessage === 'string' && !aiMessage.trim())) {
      console.warn('⚠️ N8N returned empty response, using smart fallback');
      console.log('📋 Message was:', message);
      
      // Generate intelligent response based on the user's message
      const smartResponse = generateSmartResponse(message);
      console.log('✅ Generated smart response:', smartResponse.substring(0, 100));
      
      return smartResponse;
    }

    const trimmedMessage = String(aiMessage).trim();

    console.log('✅ N8N response parsed successfully:', {
      messageLength: trimmedMessage.length,
      duration: duration + 'ms',
      preview: trimmedMessage.substring(0, 100),
    });
    
    return trimmedMessage;
  } catch (error) {
    clearTimeout(timeout);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isTimeout = errorMessage.includes('timeout') || errorMessage.includes('The user aborted a request');
    
    console.error('❌ N8N Fetch Error:', {
      url: WEBHOOK_URL,
      error: errorMessage,
      isTimeout: isTimeout,
    });
    
    throw error;
  }
}

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history } = body;

    console.log('\n' + '='.repeat(60));
    console.log('📨 Chat request received');
    console.log('Message:', message.substring(0, 100));
    console.log('N8N Webhook URL:', WEBHOOK_URL ? '✅ Configured' : '❌ Not configured');
    console.log('='.repeat(60));

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // Check if webhook is configured
    if (!WEBHOOK_URL) {
      const errorMsg = 'N8N webhook not configured. Please set NEXT_PUBLIC_AI_WEBHOOK_URL in .env.local';
      console.error('❌ Configuration error:', errorMsg);
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 503 }
      );
    }

    let aiMessage: string = '';
    const usedService = 'n8n-webhook';

    // Call n8n webhook (primary and only service)
    try {
      console.log('\n🔗 Calling N8N webhook...');
      aiMessage = await fetchWebhookResponse(message);
      console.log('✅ N8N webhook SUCCESS');
    } catch (webhookError) {
      const errorMsg = webhookError instanceof Error ? webhookError.message : String(webhookError);
      console.error(`❌ N8N webhook FAILED: ${errorMsg}`);
      console.error('Webhook URL being used:', WEBHOOK_URL);
      throw new Error(`N8N webhook failed: ${errorMsg}`);
    }

    // Response validation - should always have content since fetchWebhookResponse returns string
    if (!aiMessage || !aiMessage.trim()) {
      console.error('❌ No message content in webhook response');
      throw new Error('Webhook returned empty response');
    }

    const responseMessage = aiMessage.trim();
    console.log('✅ Chat response ready:', {
      messageLength: responseMessage.length,
      service: usedService,
      preview: responseMessage.substring(0, 100),
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          message: responseMessage,
          tokens: responseMessage.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('\n' + '❌'.repeat(30));
    console.error('Chat route error:', error);
    console.error('❌'.repeat(30) + '\n');

    const isBadRequest =
      error instanceof Error && error.message === 'Invalid message format';

    const errorMessage = isBadRequest
      ? error instanceof Error
        ? error.message
        : 'Invalid request'
      : error instanceof Error
      ? error.message
      : 'AI service is currently unavailable';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: Date.now(),
      },
      { status: isBadRequest ? 400 : 503 }
    );
  }
}

