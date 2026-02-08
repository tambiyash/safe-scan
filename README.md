# SafeScan - Proofpoint Security Lens 🛡️

A React Native/Expo Android application that serves as a protective buffer between users and potentially dangerous web content from QR codes.

## Features

### 🔍 QR Code Scanner
- Real-time QR code scanning with animated frame
- Camera permission handling with user-friendly prompts
- Haptic feedback for scan events

### 🛡️ Threat Intelligence
- URL analysis against multiple threat databases
- Real-time threat level assessment
- Support for:
  - **Safe Links** - Verified and trusted URLs
  - **Malicious Links** - Known phishing/malware sites
  - **Simulation Links** - Security awareness training tests

### 📱 Screens

| Screen | Description |
|--------|-------------|
| **Scanner** | Main QR code scanning interface with progress indicators |
| **Analyzing** | URL analysis in progress with step-by-step feedback |
| **Simulation Detected** | Training mode - simulated phish for security awareness |
| **Success** | Positive reinforcement for catching phishing attempts |
| **Malicious Phish** | High-risk threat detection with detailed breakdown |
| **Safe Link** | Verified link display with security checks |
| **Isolated Browser** | Remote Browser Isolation preview for suspicious links |

### 🌐 Remote Browser Isolation (RBI)
Preview suspicious content in a sandboxed environment where:
- No data reaches the local device
- All interactions are blocked
- Users can safely view the content before deciding

## Tech Stack

- **React Native** with **Expo SDK 54**
- **TypeScript** for type safety
- **Expo Camera** for QR scanning
- **React Navigation** for screen management
- **Zustand** for state management
- **Expo Haptics** for tactile feedback
- **React Native Reanimated** for smooth animations

## Getting Started

### Prerequisites

- Node.js 18+
- Bun package manager
- Expo CLI
- Android Studio (for Android development)
- EAS CLI (for builds)

### Installation

```bash
# Install dependencies
bun install

# Install react-native-gesture-handler (if not already installed)
bun add react-native-gesture-handler
```

### Development

```bash
# Start the development server
bun run start

# Run on Android
bun run android

# Run on iOS (macOS only)
bun run ios
```

### Building

```bash
# Install EAS CLI globally
bun add -g eas-cli

# Login to Expo account
eas login

# Configure project (first time only)
eas build:configure

# Build for Android (APK for testing)
eas build --platform android --profile preview

# Build for production
eas build --platform android --profile production
```

## Project Structure

```
safe-scan/
├── App.tsx                 # Main app entry point
├── src/
│   ├── components/
│   │   ├── common/         # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── ProgressSteps.tsx
│   │   ├── icons/          # Custom icon components
│   │   └── scanner/        # Scanner-specific components
│   │       ├── ScannerFrame.tsx
│   │       └── ScannerOverlay.tsx
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   └── types.ts
│   ├── screens/
│   │   ├── ScannerScreen.tsx
│   │   ├── AnalyzingScreen.tsx
│   │   ├── SimulationDetectedScreen.tsx
│   │   ├── SuccessScreen.tsx
│   │   ├── MaliciousPhishScreen.tsx
│   │   ├── SafeLinkScreen.tsx
│   │   └── IsolatedBrowserScreen.tsx
│   ├── services/
│   │   └── threatIntelligence.ts  # URL analysis service
│   ├── store/
│   │   └── scanStore.ts           # Zustand state management
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   └── types/
│       └── index.ts
├── app.json               # Expo configuration
├── eas.json              # EAS Build configuration
└── babel.config.js       # Babel configuration
```

## Demo URLs for Testing

The app includes demo scenarios for testing different threat levels:

| URL Pattern | Result |
|------------|--------|
| `*training.proofpoint.com*` | Simulation/Training Mode |
| `*phish-sim*` | Simulation/Training Mode |
| `*malicious-site-example.xyz*` | Malicious Phish Detected |
| `*example-company.com*` | Safe/Verified Link |
| Any other URL | Random threat level (for demo) |

## Security Considerations

- Camera permissions are requested explicitly
- All URL analysis happens before navigation
- Isolated browser prevents direct device contact
- No sensitive data is stored locally
- All external links open in system browser or RBI

## Future Enhancements

- [ ] Integration with real threat intelligence APIs
- [ ] User authentication and profiles
- [ ] Organization-wide deployment
- [ ] Analytics dashboard
- [ ] Push notifications for threat alerts
- [ ] Offline threat database caching

## License

Proprietary - All rights reserved.

## Acknowledgments

- Design inspired by Proofpoint Security Awareness
- Built with Expo and React Native
