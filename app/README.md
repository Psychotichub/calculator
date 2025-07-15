# 🔌 Cable Calculator - React Native App

A professional electrical cable sizing and analysis mobile application built with React Native.

## 📱 Features

- **Cable Size Calculation**: Calculate appropriate cable sizes based on electrical parameters
- **Voltage Drop Analysis**: Analyze voltage drop and safety compliance
- **Cost Estimation**: Get accurate cost estimates for cable installations
- **Single & Three Phase Support**: Different calculations and pricing for different phase systems
- **Professional UI**: Modern, intuitive interface designed for electrical engineers
- **Offline Capability**: Works without internet connection
- **Cross-platform**: Works on both iOS and Android

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Navigate to the app directory:**
   ```bash
   cd app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install iOS dependencies (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App

#### Android
```bash
npm run android
```

#### iOS (macOS only)
```bash
npm run ios
```

#### Start Metro bundler
```bash
npm start
```

## 📊 Calculation Features

### Input Parameters
- **Voltage (V)**: System voltage (110V, 230V, 400V, etc.)
- **Power (kW)**: Load power in kilowatts
- **Power Factor**: Power factor of the load (0.5 - 1.0)
- **Distance (m)**: Cable run length in meters
- **Number of Phases**: Single phase (1) or Three phase (3)
- **Voltage Drop Limit (%)**: Maximum allowed voltage drop
- **Installation Method**: Air, Conduit, Buried, or Tray
- **Ambient Temperature (°C)**: Operating temperature

### Output Results
- **Current (A)**: Calculated load current
- **Cable Size (mm²)**: Recommended cable cross-sectional area
- **Voltage Drop (%)**: Actual voltage drop percentage
- **Cost (USD)**: Total cable cost for the installation
- **Price per Meter**: Cost per meter of cable
- **Safety Status**: Safe/Warning based on voltage drop limits

## 🏗️ Project Structure

```
app/
├── src/
│   ├── screens/
│   │   ├── CableCalculatorScreen.js    # Main calculator screen
│   │   └── ResultsScreen.js           # Results display screen
│   ├── utils/
│   │   └── cableCalculator.js         # Calculation logic
│   └── App.js                         # Main app component
├── package.json                       # Dependencies and scripts
├── metro.config.js                    # Metro bundler config
├── babel.config.js                    # Babel configuration
└── README.md                         # This file
```

## 🔧 Technical Details

### Dependencies
- **React Native**: 0.72.6
- **React Navigation**: For screen navigation
- **React Native Picker Select**: For dropdown inputs
- **React Native Safe Area Context**: For safe area handling

### Key Components

#### CableCalculator Class
- Handles all cable sizing calculations
- Supports both single-phase and three-phase systems
- Includes derating factors for temperature and installation method
- Provides economic analysis and safety recommendations

#### CableCalculatorScreen
- Main input form with validation
- Real-time calculation
- Professional UI with proper keyboard handling

#### ResultsScreen
- Detailed results display
- Safety status indicators
- Economic analysis
- Professional recommendations

## 📱 App Screenshots

### Calculator Screen
- Clean, professional interface
- Input validation
- Loading states
- Reset functionality

### Results Screen
- Comprehensive results display
- Safety status with color coding
- Economic analysis
- Professional recommendations

## 🎯 Use Cases

### Electrical Engineers
- Quick cable sizing on-site
- Professional calculations for projects
- Cost estimation for bids

### Electricians
- Field calculations
- Safety compliance checking
- Material planning

### Students
- Learning electrical calculations
- Understanding cable sizing principles
- Practice with real-world scenarios

## 🔒 Safety Features

- **Voltage Drop Monitoring**: Ensures compliance with safety standards
- **Current Capacity Checking**: Validates cable selection
- **Temperature Derating**: Accounts for ambient temperature effects
- **Installation Method Factors**: Considers installation conditions

## 💰 Pricing

The app includes different pricing for:
- **Single Phase Cables**: Standard pricing
- **Three Phase Cables**: Premium pricing (typically higher)

## 🚀 Deployment

### Building for Production

#### Android
```bash
npm run build:android
```

#### iOS
```bash
npm run build:ios
```

### App Store Deployment
1. Configure app signing certificates
2. Update app metadata in respective stores
3. Submit for review

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For technical support or feature requests, please contact the development team.

---

**Built with ❤️ for the electrical engineering community** 