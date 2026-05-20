# HUVOICE AI - Production-Ready Voice AI Agent

A modern, production-ready real-time HUVOICE AI voice agent built with **Next.js**, **React**, **OpenAI**, and **ElevenLabs**. Have natural conversations with an AI that listens to your voice and responds with human-like speech.

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
## 📊 API Integration Details

### OpenAI Integration

**Endpoint:** `/api/chat`

```typescript
// Request
POST /api/chat
Content-Type: application/json

{
  "message": "What time is it?",
  "history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" }
  ]
}

// Response
{
  "success": true,
  "data": {
    "message": "It's currently 3:45 PM EDT."
  }
}
```

**Uses:** `process.env.OPENAI_API_KEY` (server-side only)

### ElevenLabs Integration (Server-Side)

**Endpoint:** `/api/text-to-speech`

```typescript
// Request from browser (NO API KEY SENT)
POST /api/text-to-speech
Content-Type: application/json

{
  "text": "Hello, this is a test.",
  "voiceId": "21m00Tcm4TlvDq8ikWAM",
  "stability": 0.5,
  "similarityBoost": 0.75
}

// Response: Audio MP3 blob
Content-Type: audio/mpeg
[Binary MP3 data]
```

**Security:** Server uses `process.env.ELEVENLABS_API_KEY` internally

### Deepgram Integration (Optional)

**Endpoint:** `/api/speech-to-text`

```typescript
// Request
POST /api/speech-to-text
Content-Type: multipart/form-data

audio: [Audio blob from Web Audio API]

// Response
{
  "success": true,
  "data": {
    "text": "What time is it?"
  }
}
```

**Uses:** `process.env.DEEPGRAM_API_KEY` (server-side) OR browser Web Speech API (fallback)

### n8n Webhook Integration (Optional)

**Endpoint:** `AI_WEBHOOK_URL`

```typescript
// Server forwards requests to your n8n workflow
POST https://your-domain.app.n8n.cloud/webhook/workflow
Content-Type: application/json

{
  "message": "What are business hours?",
  "history": [...]
}

// n8n returns:
{
  "message": "We're open 9 AM - 5 PM EST."
}
```

**Benefit:** Add custom logic, database lookups, external APIs, etc.

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
NEXT_PUBLIC_API_BASE_URL=/api
AI_WEBHOOK_URL=https://huassist2010.app.n8n.cloud/webhook/jarvis-ai
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

## 🏗️ Architecture

### Voice AI Flow

```
┌─────────────────────────────────────────────────────────┐
│                  HUVOICE AI Flow                        │
└─────────────────────────────────────────────────────────┘

1. USER SPEAKS
   └─> Browser Records Audio (Web Audio API)
   
2. SPEECH-TO-TEXT
   ├─> Deepgram API (if configured)
   └─> Browser Web Speech API (fallback)
       └─> Returns: User's Text Transcription
   
3. AI PROCESSING
   ├─> Send to n8n Webhook (if configured)
   │   └─> Custom business logic
   └─> Direct OpenAI API (fallback)
       └─> Sends: User message + conversation history
       └─> Returns: AI response text
   
4. TEXT-TO-SPEECH (Server-Side)
   ├─> Client sends: { text: "...", voiceId: "...\" }
   ├─> Server receives ELEVENLABS_API_KEY
   ├─> Server calls: ElevenLabs API (secure)
   └─> Server returns: MP3 audio blob
   
5. PLAYBACK
   └─> Browser plays audio to user
   └─> Updates conversation UI

┌─────────────────────────────────────────────────────────┐
│ KEY: Server-side proxying ensures API keys stay secure │
└─────────────────────────────────────────────────────────┘
```

### Component Architecture

```
FRONTEND (Browser)
├── useVoiceChat Hook
│   ├── Audio Recording (Web Audio API)
│   ├── Speech Recognition (Web Speech API / Deepgram)
│   ├── Chat Requests (OpenAI / n8n)
│   └── TTS Requests (via /api/text-to-speech)
│
├── UI Components
│   ├── MicrophoneButton (recording control)
│   ├── WaveformAnimation (visual feedback)
│   ├── ConversationHistory (message display)
│   └── AIIndicator (thinking state)
│
└── State Management (Zustand)
    └── conversation.ts (messages, audio state)

BACKEND (Next.js API Routes)
├── /api/speech-to-text
│   └── Optional: Deepgram transcription
│
├── /api/chat
│   ├── Routes to: OpenAI API or n8n webhook
│   └── Returns: AI response text
│
├── /api/text-to-speech
│   ├── Receives: text + voiceId
│   ├── Uses: ELEVENLABS_API_KEY (server-only)
│   ├── Calls: ElevenLabs API
│   └── Returns: MP3 audio blob
│
└── /api/realtime
    └── Reserved for future WebSocket features
```

## 🔐 Security Architecture

### API Key Management

**CRITICAL: Never expose API keys to the browser!**

```
✅ SAFE - Server-Side Only
├── OPENAI_API_KEY
├── ELEVENLABS_API_KEY
└── DEEPGRAM_API_KEY (if not using Web Speech)

⚠️ FRONTEND (NEXT_PUBLIC_* are exposed)
├── NEXT_PUBLIC_API_BASE_URL
├── NEXT_PUBLIC_USE_ELEVENLABS
├── NEXT_PUBLIC_USE_DEEPGRAM
└── NEXT_PUBLIC_DEBUG_MODE
```

### Request Flow Security

**Text-to-Speech Example:**

```
1. Browser (safe)
   └─> POST /api/text-to-speech { text: "...", voiceId: "..." }
       └─> Does NOT include: ELEVENLABS_API_KEY

2. Server (secure)
   ├─> Reads: process.env.ELEVENLABS_API_KEY from server memory
   ├─> Calls: ElevenLabs API with key
   └─> Returns: Audio MP3 to browser
       └─> Does NOT leak: API key to browser

3. Browser receives: Safe MP3 audio file
   └─> Plays: Audio to user
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

**Step 1: Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit: HUVOICE AI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/huvoice-ai.git
git push -u origin main
```

**Step 2: Connect to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"

**Step 3: Add Environment Variables**

1. In Vercel project settings, click "Environment Variables"
2. Add each variable from `.env.local`:
   - `OPENAI_API_KEY` = your OpenAI key
   - `ELEVENLABS_API_KEY` = your ElevenLabs key
   - `ELEVENLABS_VOICE_ID` = 21m00Tcm4TlvDq8ikWAM
   - `DEEPGRAM_API_KEY` = your Deepgram key (optional)
   - `AI_WEBHOOK_URL` = your n8n webhook (optional)

3. Leave `NEXT_PUBLIC_API_BASE_URL=/api` (for Vercel)

**Step 4: Deploy**

```bash
# Vercel auto-deploys on git push
git add .
git commit -m "Update configuration"
git push

# Check deployment status at: https://vercel.com/dashboard
```

**Step 5: Verify Deployment**

1. Visit your Vercel URL (e.g., `https://huvoice-ai.vercel.app`)
2. Go to **Settings** tab
3. Check API keys are configured
4. Test: Click microphone button and try recording

### Local Development Setup

**Step 1: Install Dependencies**

```bash
cd "AI voice AGENT"
npm install
```

**Step 2: Create `.env.local`**

```bash
cp .env.example .env.local
```

**Step 3: Add Your API Keys**

Edit `.env.local` and add:
- OpenAI API key from https://platform.openai.com/api-keys
- ElevenLabs API key from https://elevenlabs.io
- Deepgram key (optional) from https://console.deepgram.com

**Step 4: Start Dev Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Step 5: Test Voice Features**

1. Go to **Assistant** page
2. Click **Settings** to verify API keys
3. Click **Microphone** button to record
4. Speak naturally: "Hello, what's your name?"
5. Wait for AI response
6. Hear voice response automatically

### Deploy with Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build app
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
```

**Build and run:**

```bash
# Build image
docker build -t huvoice-ai .

# Run container with environment variables
docker run -p 3000:3000 \
  -e OPENAI_API_KEY="sk-..." \
  -e ELEVENLABS_API_KEY="..." \
  -e ELEVENLABS_VOICE_ID="21m00Tcm4TlvDq8ikWAM" \
  huvoice-ai

# App runs on http://localhost:3000
```

### Environment Variables for Production

**Always verify these are set in production:**

```env
# Required
OPENAI_API_KEY=sk-...            # AI responses
ELEVENLABS_API_KEY=...           # Natural voice
ELEVENLABS_VOICE_ID=21m00...    # Voice selection

# Recommended
AI_WEBHOOK_URL=https://...       # n8n automation (optional)

# Config
NEXT_PUBLIC_API_BASE_URL=/api    # Production URL
NEXT_PUBLIC_USE_ELEVENLABS=true  # Enable TTS
NEXT_PUBLIC_DEBUG_MODE=false     # No logging
```

### Troubleshooting Deployment

**Issue: "API key not configured" error**
- ✅ Verify env vars are added in Vercel/Docker
- ✅ Redeploy after changing env vars
- ✅ Check key format (no extra spaces)

**Issue: Audio not playing on mobile**
- ✅ Enable autoplay: Allow in browser settings
- ✅ Test in different browser
- ✅ Check speaker volume

**Issue: Webhook not responding**
- ✅ Verify n8n webhook URL is correct
- ✅ Test webhook URL directly: `curl -X POST <URL>`
- ✅ Fall back to direct OpenAI: remove AI_WEBHOOK_URL

**Issue: Slow responses**
- ✅ Check OpenAI rate limits
- ✅ Reduce maxTokens in settings
- ✅ Use Deepgram for faster transcription

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

- **OpenAI** for GPT-4o API - Advanced AI responses
- **ElevenLabs** for voice synthesis - Natural-sounding speech
- **Deepgram** for speech recognition - High-quality transcription
- **Vercel** for Next.js hosting - Serverless deployment
- **Tailwind Labs** for Tailwind CSS - Beautiful styling
- **Framer** for Motion - Smooth animations

## 📞 Support & Resources

**Documentation:**
- [OpenAI API Docs](https://platform.openai.com/docs)
- [ElevenLabs API Docs](https://elevenlabs.io/docs)
- [Deepgram API Docs](https://developers.deepgram.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)

**Troubleshooting:**
1. Check the troubleshooting section above
2. Review `.env.example` for missing variables
3. Check API key validity at their respective dashboards
4. Test endpoints directly with curl
5. Create a GitHub issue with error details

## 🎯 Next Steps

1. **Local Development**
   ```bash
   npm install
   cp .env.example .env.local
   # Add your API keys
   npm run dev
   ```

2. **Deploy to Vercel**
   - Push to GitHub
   - Import in Vercel
   - Add environment variables
   - Your app is live!

3. **Connect to n8n (Optional)**
   - Create n8n workflow
   - Add webhook URL to `.env.local`
   - Restart server
   - Test with conversation

## 🎉 Getting Started Checklist

- [ ] Node.js 18+ installed
- [ ] API keys obtained from platforms
- [ ] `.env.local` created and populated
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Microphone permissions granted
- [ ] Settings page shows API keys configured
- [ ] First voice conversation recorded!
- [ ] Deployed to Vercel (production)

---

## 🚀 Ready to Talk?

**Local:** `npm run dev` → [http://localhost:3000](http://localhost:3000)

**Production:** Deploy to [Vercel](https://vercel.com) → Your custom domain

**Questions?** Check the [troubleshooting section](#troubleshooting-deployment) or create an issue!

---

**Made with ❤️ for voice AI enthusiasts**
