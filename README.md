# Jarvis AI - Production-Ready Voice AI Agent

A modern, production-ready real-time Voice AI Agent built with **Next.js**, **React**, **OpenAI**, and **ElevenLabs**. Have natural conversations with an AI that listens to your voice and responds with human-like speech.

## ✨ Features

- 🎤 **Real-time Voice Input** - Record and process voice commands instantly
- 🤖 **Intelligent AI** - Powered by OpenAI GPT-4o for human-like responses  
- 🔊 **Natural Voice Output** - ElevenLabs TTS for natural-sounding responses
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 💬 **Conversation History** - Save and manage all conversations
- ⚡ **Low Latency** - Optimized for real-time interaction
- 🎨 **Modern UI** - Beautiful glassmorphism design with Framer Motion animations
- 🔐 **Secure** - Environment variable-based API key management
- 📊 **Scalable Architecture** - Production-ready code structure
- 🌙 **Dark Mode** - Eye-friendly dark theme interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **AI/ML**: OpenAI API (GPT-4o), ElevenLabs, Deepgram
- **Audio**: Web Audio API, WebRTC
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📋 Requirements

- **Node.js** 18+ 
- **npm** or **yarn**
- **API Keys**:
  - OpenAI API Key (https://platform.openai.com/api-keys)
  - ElevenLabs API Key (https://elevenlabs.io)
  - Deepgram API Key (https://console.deepgram.com) - Optional

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Navigate to project directory
cd "AI voice AGENT"

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your API keys
nano .env.local  # or edit with your favorite editor
```

### 2. Add API Keys

Edit `.env.local` and add your actual API keys:

```env
OPENAI_API_KEY=sk-your-actual-key-here
ELEVENLABS_API_KEY=your-actual-key
DEEPGRAM_API_KEY=your-actual-key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Start Using

1. Go to the **Assistant** page
2. Click the microphone button to start talking
3. The AI will transcribe, process, and respond with voice

## 📚 Project Structure

```
ai-voice-agent/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes (backend)
│   │   ├── speech-to-text/      # Audio to text conversion
│   │   ├── chat/                # AI chat endpoint
│   │   ├── text-to-speech/      # Text to audio conversion
│   │   └── realtime/            # Real-time streaming
│   ├── assistant/               # Main voice assistant page
│   ├── history/                 # Conversation history page
│   ├── settings/                # Settings page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                      # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── ChatBubble.tsx
│   │   └── Modal.tsx
│   ├── assistant/               # Feature components
│   │   ├── MicrophoneButton.tsx
│   │   ├── VoiceVisualizer.tsx
│   │   ├── AIIndicator.tsx
│   │   ├── WaveformAnimation.tsx
│   │   └── ConversationHistory.tsx
│   └── layout/                  # Layout components
│       ├── Navbar.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── hooks/                       # Custom React hooks
│   ├── useAudioRecorder.ts
│   ├── useAudioPlayer.ts
│   └── useVoiceChat.ts
├── lib/                         # Utilities and helpers
│   ├── types.ts                # TypeScript types
│   ├── constants.ts            # App constants
│   ├── audio-utils.ts          # Audio utilities
│   └── api-client.ts           # API client
├── store/                       # Zustand state management
│   └── conversation.ts
├── public/                      # Static files
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
├── .env.example                # Environment template
└── .env.local                  # Local environment (git ignored)
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# ElevenLabs (TTS)
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Deepgram (STT - Alternative)
DEEPGRAM_API_KEY=...

# App Settings
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_DEBUG_MODE=false
```

### Voice Settings

Customize voice parameters in `/settings`:

- **Voice Selection**: Choose from 6 different voices
- **Stability**: 0-1 (higher = more consistent)
- **Similarity Boost**: 0-1 (higher = more natural)
- **Temperature**: 0-2 (higher = more creative)
- **Max Tokens**: Response length limit

## 🎯 Usage Guide

### Voice Assistant Page

1. **Microphone Button**
   - Click and hold to record
   - Release to process
   - Animated visual feedback during recording

2. **Push-to-Talk**
   - Press microphone button
   - Speak naturally
   - Release when done

3. **Text Input**
   - Type messages in the input field
   - Press Enter or click Send
   - Messages are processed immediately

4. **Controls**
   - View real-time waveform
   - See AI thinking indicators
   - Interrupt AI response
   - Access quick commands

### Conversation History

- View all previous conversations
- Click to expand and see details
- Export conversations as JSON
- Delete conversations
- Timestamps for all messages

### Settings

- Customize voice parameters
- Set appearance preferences
- Configure auto-play options
- View API configuration

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Import your repository
   - Add environment variables in project settings

3. **Deploy**
   - Vercel auto-deploys on push
   - Your app is live!

### Deploy with Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t jarvis-ai .
docker run -p 3000:3000 -e OPENAI_API_KEY=sk-... jarvis-ai
```

## 🔌 API Endpoints

### Speech-to-Text
```
POST /api/speech-to-text
- Input: Audio blob
- Output: { text: string }
```

### Chat
```
POST /api/chat
- Input: { message: string, history?: Message[] }
- Output: { message: string, tokens?: number }
```

### Text-to-Speech
```
POST /api/text-to-speech
- Input: { text: string, voiceId?: string }
- Output: Audio MP3 blob
```

## 🐛 Troubleshooting

### "Microphone not available"
- Check browser microphone permissions
- Allow access in browser settings
- Ensure browser has microphone access

### "API key not configured"
- Verify `.env.local` exists
- Check API key format
- Ensure no extra spaces

### "Audio playback error"
- Check speaker volume
- Test with different browser
- Clear browser cache

### "No response from AI"
- Verify API key validity
- Check network connection
- Review API rate limits
- Check OpenAI account balance

## 📈 Performance Tips

1. **Reduce Response Size**
   - Adjust `maxTokens` in settings
   - Use shorter prompts

2. **Optimize Audio**
   - Reduce sample rate if needed
   - Use mono audio

3. **Browser Performance**
   - Use modern browser (Chrome, Edge, Firefox)
   - Clear cache regularly
   - Close unused tabs

## 🔐 Security

- API keys stored in environment variables
- Never commit `.env.local`
- Use `.gitignore` to protect secrets
- Implement rate limiting for production
- Validate all user inputs
- Use HTTPS in production

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
```

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- [ ] Multi-language support
- [ ] Voice cloning
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Offline mode
- [ ] Custom system prompts
- [ ] Voice wake-word
- [ ] Streaming responses

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- OpenAI for GPT-4o API
- ElevenLabs for voice synthesis
- Deepgram for speech recognition
- Vercel for Next.js
- Tailwind Labs for Tailwind CSS

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Create a GitHub issue
4. Ask on community forums

## 🎉 Getting Started Checklist

- [ ] Node.js 18+ installed
- [ ] API keys obtained
- [ ] `.env.local` created
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Microphone permissions granted
- [ ] First conversation recorded!

---

**Ready to talk with your AI?** Start by running `npm run dev` and open [http://localhost:3000](http://localhost:3000)!
