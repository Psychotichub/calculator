# SmartElectro Cable Calculator

A professional electrical cable sizing and analysis tool built with Node.js, Express, and modern web technologies.

## Features

- **Cable Sizing Calculations**: Accurate cable size recommendations based on electrical parameters
- **Voltage Drop Analysis**: Calculate voltage drop percentages and ensure compliance
- **Economic Analysis**: Cost estimation and ROI calculations
- **Safety Recommendations**: Professional safety analysis and recommendations
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Calculations**: Fast server-side processing with API endpoints

## Prerequisites

- Node.js (version 14.0.0 or higher)
- npm (comes with Node.js)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cable-calculator.git
   cd cable-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit the `.env` file with your MongoDB configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   CURRENCY=USD
   MONGODB_URI=mongodb://localhost:27017
   DB_NAME=your_database_name
   CABLE_PRICE_COLLECTION=materials
   ```

4. **Database Setup**
   
   Ensure your MongoDB database has a collection with cable pricing data in this format:
   ```json
   {
     "materialName": "Cable N2XH 3x1.5mm",
     "unit": "m",
     "materialPrice": 0.91,
     "laborPrice": 1.03,
     "date": "2025-01-04T03:55:42.970Z"
   }
   ```

5. **Standard Cable Sizes**
   
   The calculator uses standard cable sizes: **1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240 mm²**
   
   - Cable sizes are selected based on current capacity requirements
   - Voltage drop calculations use accurate resistance values for each size
   - Pricing is retrieved from your database for available sizes
   - Fallback to standard sizes if database is unavailable

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### POST /api/calculate
Calculate cable sizing and analysis.

**Request Body:**
```json
{
  "voltage": 400,
  "power": 10,
  "powerFactor": 0.8,
  "distance": 100,
  "phases": 3,
  "voltageDropLimit": 5.0,
  "installationMethod": "air",
  "ambientTemp": 30
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "current": {
      "value": "18.04",
      "unit": "A",
      "description": "Calculated current"
    },
    "voltageDrop": {
      "value": "2.34",
      "unit": "%",
      "description": "Voltage drop percentage",
      "safety": "safe"
    },
    "cableSize": {
      "value": 6,
      "unit": "mm²",
      "description": "Recommended cable size"
    },
    "cost": {
      "value": "450.00",
      "unit": "USD",
      "description": "Estimated cable cost"
    }
  },
  "analysis": {
    "economic": {
      "costPerMeter": "4.50",
      "totalSavings": "50.00",
      "roi": "12.5"
    },
    "safety": {
      "voltageDropStatus": "safe",
      "recommendations": []
    },
    "recommendations": [
      {
        "type": "success",
        "message": "Cable size is optimal for the application."
      }
    ]
  }
}
```

### GET /api/health
Health check endpoint with database status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development",
  "database": "connected"
}
```

### GET /api/prices
Get all available cable prices from database.

**Response:**
```json
{
  "success": true,
  "prices": {
    "1.5": 1.94,
    "2.5": 2.5,
    "4": 3.2
  },
  "currency": "USD"
}
```

### GET /api/cable-sizes
Get all available cable sizes from database.

**Response:**
```json
{
  "success": true,
  "sizes": [1.5, 2.5, 4, 6, 10, 16, 25],
  "count": 7
}
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3000 | No |
| `NODE_ENV` | Environment mode | development | No |
| `CURRENCY` | Currency for cost calculations | USD | No |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017 | Yes |
| `DB_NAME` | Database name | cable_calculator | Yes |
| `CABLE_PRICE_COLLECTION` | Collection name for cable prices | materials | Yes |

## Project Structure

```
cable-calculator/
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── html/
│   │   └── index.html
│   └── js/
│       └── script.js
├── server.js
├── package.json
├── env.example
└── README.md
```

## Features

### Cable Sizing Algorithm
- Current calculation for single and three-phase systems
- Voltage drop calculation with compliance checking
- Cable size selection based on current capacity using standard sizes: 1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240 mm²
- Temperature and installation method derating

### Economic Analysis
- Cable cost estimation
- Power loss cost calculation
- ROI and payback period analysis
- Cost optimization recommendations

### Safety Analysis
- Voltage drop compliance checking
- Current capacity safety margins
- Temperature derating considerations
- Installation method factors

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue on GitHub or contact the development team.

## Changelog

### Version 1.0.0
- Initial release
- Basic cable sizing calculations
- Economic analysis
- Safety recommendations
- Responsive web interface
- RESTful API endpoints 