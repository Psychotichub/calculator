# React Native Cable Calculator Setup Guide

## Quick Start

### 1. Prerequisites Check
Make sure you have the following installed:
- Node.js 18.x (LTS)
- Java JDK 17
- Android Studio with Android SDK
- React Native CLI

### 2. Project Setup
```bash
# Navigate to the project
cd "E:/cable calculator/app/CableCalculatorApp"

# Install dependencies
npm install

# Start Metro bundler
npx react-native start
```

### 3. Run the App
```bash
# In a new terminal, run on Android
npx react-native run-android

# Or for iOS (macOS only)
npx react-native run-ios
```

## Project Structure

```
CableCalculatorApp/
├── src/
│   ├── screens/
│   │   ├── CableCalculatorScreen.js    # Main calculator UI
│   │   └── ResultsScreen.js           # Results display
│   ├── utils/
│   │   ├── cableCalculator.js         # Calculation logic
│   │   └── cableCalculator.test.js    # Test file
│   └── navigation/
│       └── AppNavigator.js            # Navigation setup
├── App.js                             # Main app component
├── package.json                       # Dependencies
└── README.md                          # Detailed documentation
```

## Features Implemented

✅ **Complete calculation logic** from the original web app
✅ **Professional mobile UI** with modern design
✅ **Navigation system** between calculator and results
✅ **Input validation** and error handling
✅ **Comprehensive results display** with analysis
✅ **Compatible versions** for 2025 development

## Testing the App

1. **Start Metro bundler** (if not already running):
   ```bash
   npx react-native start
   ```

2. **Run on device/emulator**:
   ```bash
   npx react-native run-android
   ```

3. **Test calculation**:
   - Enter default values or custom parameters
   - Tap "Calculate" button
   - View results and analysis

## Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android build errors**:
   ```bash
   cd android && ./gradlew clean
   ```

3. **Dependency issues**:
   ```bash
   npm install --force
   ```

### Development Tips

- Use React Native Debugger for better debugging
- Enable hot reloading for faster development
- Check console logs for calculation details
- Test on both Android and iOS for compatibility

## Next Steps

1. **Customize the UI** - Modify colors, fonts, and layout
2. **Add more features** - Save calculations, export results
3. **Optimize performance** - Implement lazy loading if needed
4. **Add unit tests** - Expand test coverage
5. **Build for production** - Create release APK/IPA

## Support

For issues or questions, refer to:
- React Native documentation: https://reactnative.dev
- Project README.md for detailed information
- Metro bundler logs for debugging 