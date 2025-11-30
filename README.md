# MirrorMe - AI Self-Reflection & Coaching App

**MirrorMe** is an immersive AI-powered self-reflection and coaching experience designed specifically for **Meta Horizon OS** (Meta Quest 3 and compatible VR devices). Built with React Native, it combines the power of AI with VR to create a unique personal growth platform.

## ✨ Features

### 🪞 Mirror Session (Flagship Feature)
- **Immersive self-reflection** using your Quest's front-facing camera
- **AI-powered emotional feedback** and motivational guidance
- **Voice or text input** - choose your preferred mode
- **Optional AI voice responses** for a fully conversational experience
- **Session tracking** with MMKV storage

### 💬 AI Chat
- **Thoughtful conversations** with your AI companion
- **Real-time AI responses** powered by OpenAI GPT-4o-mini
- **Text-to-speech** integration for voice output
- **Chat bubble interface** optimized for VR viewing
- **Persistent chat sessions**

### ⚙️ Settings & Customization
- **Dark/Light mode** toggle (defaults to dark for VR)
- **AI voice response** control
- **Haptic feedback** settings
- **Data management** (clear history, reset onboarding)
- **Privacy-first** - all data stored locally

### 🎨 VR-Optimized Design
- **High-contrast UI** for excellent VR legibility
- **Large typography** (VR-optimized font sizes)
- **Interactive animations** with haptic feedback
- **Smooth transitions** and premium aesthetics
- **Responsive layout** for different screen sizes

## 🛠️ Tech Stack

- **React Native** 0.82.1
- **React** 19.2.0
- **TypeScript** 5.9.3
- **Zustand** - State management
- **MMKV** - Fast local storage
- **OpenAI API** - AI responses (GPT-4o-mini)
- **React Native Vision Camera** - Camera integration
- **React Native TTS** - Text-to-speech
- **React Navigation** - Navigation
- **React Native Reanimated** - Animations
- **React Native Gesture Handler** - Touch interactions

## 🚀 Getting Started

### Prerequisites

- **Meta Quest 3** or compatible Meta Horizon OS device
- **Node.js** >= 20
- **React Native development environment** set up
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd MirrorMe-Horizon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

4. **Start the Metro bundler**
   ```bash
   npm start
   ```

5. **Deploy to Meta Quest**
   ```bash
   npm run quest
   ```

### 🖥️ Running on Android Emulator (No Headset)

If you don't have a Meta Quest device, you can run the app on a standard Android Emulator to test the UI and core logic.

1. **Open Android Studio** and launch the **Virtual Device Manager**.
2. Create a new device (e.g., Pixel 6) or use an existing one.
3. Start the emulator.
4. Run the app:
   ```bash
   npm run quest
   ```
   *Note: The app will run as a standard 2D Android app. VR-specific features like the immersive environment will not be available, but you can test the Chat, Settings, and Mirror Session (using your webcam).*

## 📱 Project Structure

```
MirrorMe-Horizon/
├── src/
│   ├── components/
│   │   └── ui/            # Reusable UI components (Box, Text, Button, etc.)
│   ├── screens/           # App screens
│   │   ├── OnboardingScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── MirrorSessionScreen.tsx
│   │   ├── AIChatScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── stores/            # Zustand state stores
│   │   ├── themeStore.ts
│   │   ├── settingsStore.ts
│   │   ├── onboardingStore.ts
│   │   └── sessionStore.ts
│   ├── services/          # External services
│   │   ├── openai.ts      # OpenAI integration
│   │   ├── tts.ts         # Text-to-speech
│   │   └── storage.ts     # MMKV storage
│   ├── theme/             # Design system
│   │   └── theme.ts       # Colors, typography, spacing
│   ├── types/             # TypeScript definitions
│   ├── navigation/        # Navigation configuration
│   └── utils/             # Utilities (haptics, etc.)
├── .env                   # Environment variables (not in git)
├── App.tsx               # App entry point
└── package.json
```

## 🎮 Usage

### First Time Setup
1. On first launch, you'll see the **Onboarding** flow explaining app features
2. Grant **camera permissions** for Mirror Session
3. Navigate to **Settings** to customize your experience

### Mirror Session
1. Tap "Start Mirror Session" on the home screen
2. Your front camera will activate
3. Type or speak your thoughts
4. Receive AI-powered emotional reflection and guidance
5. End session when complete

### AI Chat
1. Tap "Start AI Chat" on the home screen  
2. Have a conversation with your AI companion
3. Messages are saved locally

## 🔐 Privacy & Data

- **All data stored locally** using encrypted MMKV storage
- **No data sent to external servers** except OpenAI API requests
- **Camera feed never saved** - only used for live mirror display
- **Your reflections stay private** on your device

## 🎨 Design Philosophy

MirrorMe follows Meta Horizon's VR design guidelines:
- **High contrast** for VR readability
- **Large touch targets** (minimum 48dp)
- **Comfortable viewing distances**
- **Minimal head-locked content**
- **Smooth, non-jarring animations**
- **Haptic feedback** for interactions

## 🐛 Troubleshooting

### Camera not working
- Ensure camera permissions are granted
- Check that no other app is using the camera

### AI responses fail
- Verify your OpenAI API key in `.env`
- Check internet connection
- Ensure you have API credits

### App crashes on launch
- Clear MMKV storage: Settings → Reset All Settings
- Reinstall the app

## 🗺️ Roadmap

- [ ] Session summaries with AI insights
- [ ] Voice input for hands-free interaction
- [ ] Mood tracking over time
- [ ] Supabase cloud sync (optional)
- [ ] Guided meditation sessions
- [ ] Journaling features

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Built with [React Native for Meta Horizon OS](https://github.com/callstack/react-native-horizonos-example/)
- Powered by [OpenAI](https://openai.com/)
- Inspired by the vision of accessible personal growth tools in VR

---

**Made with ❤️ for the Meta Horizon community**
