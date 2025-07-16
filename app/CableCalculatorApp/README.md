# Cable Calculator App

A professional electrical cable sizing and analysis tool built with React Native.

## Features

- **Cable Size Calculation**: Automatically calculates the appropriate cable size based on electrical parameters
- **Voltage Drop Analysis**: Determines voltage drop percentage and safety status
- **Cost Estimation**: Provides detailed cost breakdown and pricing information
- **Safety Recommendations**: Offers safety analysis and recommendations
- **Multi-Phase Support**: Supports both single-phase and three-phase calculations
- **Professional UI**: Clean, modern interface optimized for mobile devices

## Technical Specifications

### Compatible Versions (2025)
- React Native: `0.74.0`
- Node.js: `18.x (LTS)`
- React: `18.2.0`
- JDK: `17`
- Android Gradle Plugin: `8.0.2`
- Gradle: `8.1`

### Key Dependencies
- `@react-navigation/native`: `6.1.9` - Navigation system
- `@react-navigation/stack`: `6.3.20` - Stack navigation
- `react-native-reanimated`: `3.6.1` - Animations
- `react-native-gesture-handler`: `2.14.0` - Gesture handling
- `react-native-screens`: `3.29.0` - Screen management
- `@react-native-picker/picker`: `2.4.10` - Picker components
- `react-native-safe-area-context`: `4.8.2` - Safe area handling

## Installation & Setup

### Prerequisites
1. **Node.js 18.x (LTS)**
   - Download from: https://nodejs.org/en

2. **Java JDK 17**
   - Required for Android development
   - Ensure `JAVA_HOME` is set correctly

3. **Android Studio**
   - Install latest **Hedgehog** or **Giraffe** version
   - Set up Android SDK, NDK, and emulator

4. **React Native CLI**
   ```bash
   npm install -g react-native-cli
   ```

### Project Setup
1. **Navigate to the project directory**
   ```bash
   cd "E:/cable calculator/app/CableCalculatorApp"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Metro bundler**
   ```bash
   npx react-native start
   ```

4. **Run on Android**
   ```bash
   npx react-native run-android
   ```

## Project Structure

```
CableCalculatorApp/
├── src/
│   ├── screens/
│   │   ├── CableCalculatorScreen.js    # Main calculator interface
│   │   └── ResultsScreen.js           # Results display
│   ├── utils/
│   │   └── cableCalculator.js         # Calculation logic
│   └── navigation/
│       └── AppNavigator.js            # Navigation setup
├── App.js                             # Main app component
└── package.json                       # Dependencies
```

## Calculation Features

### Input Parameters
- **Voltage (V)**: System voltage (default: 400V)
- **Power (kW)**: Load power in kilowatts (default: 10kW)
- **Power Factor**: Electrical power factor (default: 0.8)
- **Distance (m)**: Cable length in meters (default: 100m)
- **Number of Phases**: Single or three-phase (default: 3-phase)
- **Voltage Drop Limit (%)**: Maximum allowed voltage drop (default: 5%)
- **Installation Method**: Air, conduit, buried, or tray
- **Ambient Temperature**: Operating temperature (°C)

### Output Results
- **Current**: Calculated current in amperes
- **Voltage Drop**: Percentage voltage drop with safety status
- **Cable Size**: Recommended cable size in mm²
- **Total Cost**: Estimated cable cost in USD
- **Price per Meter**: Cost per meter of cable

### Analysis Sections
- **Economic Analysis**: Cost breakdown and pricing details
- **Safety Analysis**: Voltage drop limits and safety status
- **Recommendations**: Professional recommendations and warnings

## Cable Data

The app includes comprehensive cable data for both single-phase and three-phase systems:

### Single-Phase Cables
- Sizes: 1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240 mm²
- Current capacities and resistances for each size
- Pricing data for cost estimation

### Three-Phase Cables
- Same size range with adjusted pricing
- Higher costs for three-phase installations
- Appropriate safety margins

## Development

### Running the App
1. **Start Metro bundler**
   ```bash
   npx react-native start
   ```

2. **Run on Android device/emulator**
   ```bash
   npx react-native run-android
   ```

3. **Run on iOS (macOS only)**
   ```bash
   npx react-native run-ios
   ```

### Debugging
- Use React Native Debugger or Flipper for debugging
- Metro bundler provides hot reloading for development
- Check console logs for calculation details

### Building for Production
1. **Android APK**
   ```bash
   cd android && ./gradlew assembleRelease
   ```

2. **iOS Archive** (macOS only)
   - Open in Xcode and archive

## Troubleshooting

### Common Issues
1. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`
2. **Android build errors**: Clean project with `cd android && ./gradlew clean`
3. **Dependency conflicts**: Check version compatibility in package.json

### Performance Optimization
- The app uses in-memory calculations for fast performance
- No external API calls required
- Optimized for mobile devices

## License

This project is part of the SmartElectro Cable Calculator suite.

## Support

For technical support or feature requests, please refer to the main project documentation.
