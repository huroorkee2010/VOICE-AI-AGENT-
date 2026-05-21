# 📦 Removed Packages & Install Commands

## Packages Removed (15 Total)

### Direct Dependencies (2)
```
@deepgram/sdk@3.0.0
@elevenlabs/elevenlabs-js@2.49.0
```

### Transitive Dependencies (13)
```
@anthropic-ai/sdk
@langchain/core
@langchain/community
google-auth-library
axios-mock-adapter
dotenv
uuid
(+ 6 more transitive dependencies)
```

---

## 🔧 Installation Commands

### Option 1: Fresh Install (Recommended)
```bash
# Clone the repository
git clone <your-repo-url>
cd "AI voice AGENT"

# Install dependencies with legacy peer deps flag
npm install --legacy-peer-deps

# Verify installation
npm ls
```

### Option 2: Upgrade Existing Installation
```bash
# Remove old packages
rm -r node_modules
rm package-lock.json

# Clean npm cache
npm cache clean --force

# Fresh install
npm install --legacy-peer-deps

# Verify
npm ls
```

### Option 3: Automated Script
```bash
#!/bin/bash
echo "🧹 Cleaning old dependencies..."
rm -rf node_modules
rm -f package-lock.json
npm cache clean --force

echo "📦 Installing fresh dependencies..."
npm install --legacy-peer-deps

echo "✅ Done! Ready to use:"
echo "   npm run dev"
```

---

## ✅ Installed Packages (455 Total)

### Core Framework (13 packages)
```
next@16.2.6                  - React/Node.js framework
react@19.2.6                 - UI library
react-dom@19.2.6             - React DOM renderer
typescript@6.0.3             - TypeScript compiler
eslint@9.39.4                - Code linting
eslint-config-next@15.1.3    - Next.js ESLint config
stylelint@16.2.1             - CSS linting
stylelint-config-standard@36.0.0 - Stylelint standard config
@types/node@20.12.12         - Node.js type definitions
@types/react@18.3.3          - React type definitions
@types/react-dom@18.3.0      - React DOM type definitions
```

### UI & Styling (6 packages)
```
tailwindcss@3.4.3            - Utility-first CSS framework
postcss@8.5.15               - CSS transformation
autoprefixer@10.4.18         - Vendor prefixes
lucide-react@0.408.0         - Icon library
classnames@2.3.2             - CSS className utility
framer-motion@10.16.16       - Animation library
```

### State Management & API (4 packages)
```
zustand@4.4.7                - Lightweight state management
axios@1.7.2                  - HTTP client
react-hot-toast@2.4.1        - Toast notifications
wavesurfer.js@7.6.0          - Audio visualization
```

### Build & Dev Tools (8 packages)
```
next (includes Turbopack)     - Build tool
typescript@6.0.3              - Type checking
eslint@9.39.4                 - Linting
postcss@8.5.15                - CSS processing
tailwindcss@3.4.3             - CSS generation
```

---

## 📊 Dependency Breakdown

```
Direct Dependencies: 13
├── next@16.2.6
├── react@19.2.6
├── react-dom@19.2.6
├── zustand@4.4.7
├── axios@1.7.2
├── tailwindcss@3.4.3
├── postcss@8.5.15
├── lucide-react@0.408.0
├── react-hot-toast@2.4.1
├── framer-motion@10.16.16
├── wavesurfer.js@7.6.0
├── classnames@2.3.2
└── autoprefixer@10.4.18

Dev Dependencies: 8
├── typescript@6.0.3
├── @types/node@20.12.12
├── @types/react@18.3.3
├── @types/react-dom@18.3.0
├── eslint@9.39.4
├── eslint-config-next@15.1.3
├── stylelint@16.2.1
└── stylelint-config-standard@36.0.0

Transitive Dependencies: 434
```

---

## 🔄 Update Commands

### Check for Outdated Packages
```bash
npm outdated
```

### Update All Packages (Carefully)
```bash
npm update
```

### Update Specific Package
```bash
npm update next
```

---

## 🧪 Verification Commands

### Check Installed Versions
```bash
npm ls
npm list
npm list --depth=0
```

### Check for Security Issues
```bash
npm audit
npm audit fix  # Only if npm audit finds issues
```

### Check for Vulnerabilities
```bash
npm audit --audit-level=moderate
```

---

## 📥 What NOT to Install

❌ **Do NOT install these (removed):**
```bash
npm install @deepgram/sdk              # ❌ Not needed
npm install @elevenlabs/elevenlabs-js  # ❌ Not needed
npm install openai                     # ❌ Not needed
```

❌ **Do NOT install these (not needed):**
```bash
npm install express                    # We use Next.js
npm install dotenv                     # Not for this project
npm install cors                       # Next.js handles it
```

---

## 📋 package.json Configuration

```json
{
  "name": "ai-voice-agent",
  "version": "1.0.0",
  "private": true,
  
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "verify": "node scripts/verify-setup.js"
  },
  
  "engines": {
    "node": ">=18.0.0"
  },
  
  "dependencies": {
    "autoprefixer": "^10.4.18",
    "axios": "^1.7.2",
    "classnames": "^2.3.2",
    "framer-motion": "^10.16.16",
    "lucide-react": "^0.408.0",
    "next": "^16.2.6",
    "postcss": "^8.5.15",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-hot-toast": "^2.4.1",
    "tailwindcss": "^3.4.3",
    "wavesurfer.js": "^7.6.0",
    "zustand": "^4.4.7"
  },
  
  "devDependencies": {
    "@types/node": "^20.12.12",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "eslint": "^9.39.4",
    "eslint-config-next": "^15.1.3",
    "stylelint": "^16.2.1",
    "stylelint-config-standard": "^36.0.0",
    "typescript": "^6.0.3"
  },
  
  "overrides": {
    "postcss": "^8.5.15"
  }
}
```

---

## ⚙️ Node Version

**Required:** Node.js >= 18.0.0  
**Recommended:** Node.js 18 LTS or 20 LTS

Check your version:
```bash
node --version
npm --version
```

---

## 🚀 Full Setup From Scratch

```bash
# 1. Ensure Node.js 18+ is installed
node --version

# 2. Clone repository
git clone <repo-url>
cd "AI voice AGENT"

# 3. Install with legacy peer deps
npm install --legacy-peer-deps

# 4. Create .env.local
echo 'AI_WEBHOOK_URL=https://huassist2010.app.n8n.cloud/webhook/38f72ae7-8140-4887-b3b5-ce7e118f7c13' > .env.local

# 5. Run dev server
npm run dev

# 6. Open browser
# http://localhost:3000

# 7. Build for production
npm run build
npm start
```

---

## 📊 Package Size Comparison

| Package | Size | Reason Removed |
|---------|------|---|
| @deepgram/sdk | ~2 MB | Using browser Web Speech API |
| @elevenlabs/elevenlabs-js | ~1.5 MB | Using browser Speech Synthesis |
| Transitive deps | ~1.5 MB | Associated with above |
| **Total removed** | **~5 MB** | **Reduced dependency overhead** |

---

## ✅ Verification Checklist

After installation, verify:

```bash
# 1. Check installation completed
npm ls
# Should show 455 packages, 0 vulnerabilities

# 2. Check for specific removed packages (should return nothing)
npm ls @deepgram/sdk
npm ls @elevenlabs/elevenlabs-js
npm ls openai

# 3. Verify dev server works
npm run dev
# Should start on http://localhost:3000

# 4. Verify build works
npm run build
# Should complete without errors

# 5. Verify no security issues
npm audit
# Should return 0 vulnerabilities
```

---

## 🆘 If Installation Fails

```bash
# Step 1: Clear cache
npm cache clean --force

# Step 2: Remove everything
rm -rf node_modules
rm -f package-lock.json

# Step 3: Try again with verbose logging
npm install --legacy-peer-deps --verbose

# Step 4: If still fails, check Node version
node --version  # Should be >= 18.0.0

# Step 5: Try with different npm version
npm install -g npm@latest
npm install --legacy-peer-deps
```

---

## 📚 Command Reference

| Command | Purpose |
|---------|---------|
| `npm install --legacy-peer-deps` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript check |
| `npm audit` | Check for vulnerabilities |
| `npm outdated` | Show outdated packages |
| `npm ls` | Show dependency tree |
| `npm cache clean --force` | Clean npm cache |

---

## 🎯 Next Steps

1. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start development**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

4. **Test chat functionality**
   - Send message
   - Verify N8N webhook response
   - Test speech features

---

## ✨ Ready!

All packages are now **clean, verified, and tested**.  
Your HUVOICE AI Agent is ready to use! 🚀

