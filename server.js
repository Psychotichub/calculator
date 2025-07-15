const express = require('express');
const path = require('path');

// Override database name to match populate script
process.env.DB_NAME = 'cableCalculator';

// --- SIMPLE IN-MEMORY CABLE DATA ---
// Edit these arrays to change available cable sizes and prices for different phases
const singlePhaseCableData = [
    { size: 1, price: 2.50 },
    { size: 1.5, price: 1.03 },
    { size: 2.5, price: 4.80 },
    { size: 4, price: 6.50 },
    { size: 6, price: 9.20 },
    { size: 10, price: 14.50 },
    { size: 16, price: 22.80 },
    { size: 25, price: 35.40 },
    { size: 35, price: 48.60 },
    { size: 50, price: 68.90 },
    { size: 70, price: 95.20 },
    { size: 95, price: 128.50 },
    { size: 120, price: 165.80 },
    { size: 150, price: 210.40 },
    { size: 185, price: 265.70 },
    { size: 240, price: 345.90 }
];

const threePhaseCableData = [
    { size: 1, price: 3.20 },      // Higher price for 3-phase
    { size: 1.5, price: 1.50 },
    { size: 2.5, price: 6.10 },
    { size: 4, price: 8.30 },
    { size: 6, price: 11.80 },
    { size: 10, price: 18.60 },
    { size: 16, price: 29.20 },
    { size: 25, price: 45.10 },
    { size: 35, price: 62.30 },
    { size: 50, price: 88.40 },
    { size: 70, price: 122.50 },
    { size: 95, price: 165.80 },
    { size: 120, price: 214.20 },
    { size: 150, price: 272.80 },
    { size: 185, price: 344.50 },
    { size: 240, price: 448.90 }
];
// -----------------------------------

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

// API endpoint for cable calculations
app.post('/api/calculate', (req, res) => {
    try {
        const {
            voltage,
            power,
            powerFactor,
            distance,
            phases,
            voltageDropLimit,
            installationMethod,
            ambientTemp
        } = req.body;

        // Validate input parameters
        if (!voltage || !power || !powerFactor || !distance || !phases || !voltageDropLimit) {
            return res.status(400).json({
                error: 'Missing required parameters'
            });
        }

        // Perform cable calculations
        const current = (power * 1000) / (voltage * powerFactor * Math.sqrt(phases));
        
        // Find the smallest cable size that can handle the current (with 25% margin)
        const cableCapacities = {
            1: 16, 1.5: 20, 2.5: 27, 4: 37, 6: 47, 10: 65, 16: 85, 25: 112, 35: 138,
            50: 168, 70: 213, 95: 258, 120: 299, 150: 340, 185: 384, 240: 447
        };
        const requiredCapacity = current * 1.25;
        
        // Select cable data based on number of phases
        const cableData = phases === 1 ? singlePhaseCableData : threePhaseCableData;
        let cableSize = cableData.find(c => cableCapacities[c.size] >= requiredCapacity);
        if (!cableSize) cableSize = cableData[cableData.length - 1]; // fallback to largest

        // Get price from database for the selected cable size
        const pricePerMeter = cableSize.price;
        const cost = distance * pricePerMeter;
        
        // Calculate voltage drop based on the selected cable size
        const voltageDrop = calculateVoltageDrop(current, cableSize.size, distance, phases, voltage);

        // Determine safety status
        const safetyStatus = voltageDrop <= voltageDropLimit ? 'safe' : 'warning';

        const results = {
            current: {
                value: current.toFixed(2),
                unit: 'A',
                description: 'Calculated current'
            },
            voltageDrop: {
                value: voltageDrop.toFixed(2),
                unit: '%',
                description: 'Voltage drop percentage',
                safety: safetyStatus
            },
            cableSize: {
                value: phases === 1 ? `${cableSize.size}` : `${cableSize.size}`,
                unit: 'mm²',
                description: `Recommended cable size (${phases === 1 ? '3-core' : '5-core'} cable & earth must be same size or half size)`
            },
            cost: {
                value: cost.toFixed(2),
                unit: 'USD',
                description: 'Estimated cable cost'
            },
            pricePerMeter: {
                value: pricePerMeter.toFixed(2),
                unit: 'USD',
                description: 'Price per meter'
            }
        };

        res.json({
            success: true,
            results,
            analysis: generateAnalysis(results, req.body)
        });

    } catch (error) {
        console.error('Calculation error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// API endpoint to get all available cable prices
app.get('/api/prices', (req, res) => {
    const { phase = 'single' } = req.query; // Default to single phase
    const cableData = phase === 'three' ? threePhaseCableData : singlePhaseCableData;
    
    const prices = {};
    cableData.forEach(c => { prices[c.size] = c.price; });
    res.json({ 
        success: true, 
        prices, 
        currency: 'USD',
        phase: phase === 'three' ? 'three-phase' : 'single-phase'
    });
});

// API endpoint to get available cable sizes
app.get('/api/cable-sizes', (req, res) => {
    const { phase = 'single' } = req.query; // Default to single phase
    const cableData = phase === 'three' ? threePhaseCableData : singlePhaseCableData;
    
    const sizes = cableData.map(c => c.size);
    res.json({ 
        success: true, 
        sizes, 
        count: sizes.length,
        phase: phase === 'three' ? 'three-phase' : 'single-phase'
    });
});

// Helper functions
function calculateVoltageDrop(current, cableSize, distance, phases, voltage) {
    // Cable resistance per km (Ω/km) for standard cable sizes
    const cableResistances = {
        1: 18.1, 1.5: 12.1, 2.5: 7.41, 4: 4.61, 6: 3.08, 10: 1.83, 16: 1.15, 25: 0.727,
        35: 0.524, 50: 0.387, 70: 0.268, 95: 0.193, 120: 0.153, 150: 0.124,
        185: 0.099, 240: 0.0754
    };

    const resistance = cableResistances[cableSize] || (1 / cableSize); // Fallback calculation
    const resistancePerMeter = resistance / 1000; // Convert to per meter

    let voltageDrop;
    if (phases === 1) {
        // Single phase: Vd = 2 * I * R * L / 1000
        voltageDrop = 2 * current * resistancePerMeter * distance;
    } else {
        // Three phase: Vd = √3 * I * R * L / 1000
        voltageDrop = Math.sqrt(3) * current * resistancePerMeter * distance;
    }

    return (voltageDrop / voltage) * 100; // Return as percentage
}

function calculateCost(cableSize, distance) {
    // Simplified cost calculation
    const basePrice = parseFloat(process.env.CABLE_BASE_PRICE) || 2.5; // USD per meter
    const sizeMultiplier = 1 + (cableSize - 1) * 0.3;
    return distance * basePrice * sizeMultiplier;
}

function generateAnalysis(results, input) {
    const analysis = {
        economic: {
            costPerMeter: results.pricePerMeter.value,
            totalSavings: calculateSavings(results, input),
            roi: calculateROI(results, input)
        },
        safety: {
            voltageDropStatus: results.voltageDrop.safety,
            recommendations: generateSafetyRecommendations(results, input)
        },
        recommendations: generateGeneralRecommendations(results, input)
    };

    return analysis;
}

function calculateSavings(results, input) {
    // Simplified savings calculation
    const optimalCost = parseFloat(results.cost.value);
    const standardCost = input.distance * 5; // Standard cable cost
    return Math.max(0, (standardCost - optimalCost).toFixed(2));
}

function calculateROI(results, input) {
    // Simplified ROI calculation
    const investment = parseFloat(results.cost.value);
    const savings = parseFloat(calculateSavings(results, input));
    return investment > 0 ? ((savings / investment) * 100).toFixed(1) : 0;
}

function generateSafetyRecommendations(results, input) {
    const recommendations = [];
    
    if (results.voltageDrop.safety === 'warning') {
        recommendations.push({
            type: 'warning',
            message: 'Voltage drop exceeds recommended limit. Consider larger cable size.'
        });
    }

    if (input.ambientTemp > 45) {
        recommendations.push({
            type: 'warning',
            message: 'High ambient temperature detected. Consider temperature derating.'
        });
    }

    if (input.distance > 200) {
        recommendations.push({
            type: 'info',
            message: 'Long distance installation. Consider voltage drop compensation.'
        });
    }

    return recommendations;
}

function generateGeneralRecommendations(results, input) {
    const recommendations = [];

    if (results.cableSize.value <= 2.5) {
        recommendations.push({
            type: 'success',
            message: 'Cable size is optimal for the application.'
        });
    }

    if (input.powerFactor < 0.85) {
        recommendations.push({
            type: 'warning',
            message: 'Low power factor detected. Consider power factor correction.'
        });
    }

    if (input.phases === 3 && input.power > 50) {
        recommendations.push({
            type: 'info',
            message: 'High power three-phase system. Consider professional installation.'
        });
    }

    return recommendations;
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        // In-memory data, no explicit connection test needed
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            database: 'in-memory data'
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: 'The requested resource was not found'
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 SmartElectro Cable Calculator Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Access the application at: http://localhost:${PORT}`);
    
    if (process.env.NODE_ENV === 'development') {
        console.log(`🔧 API Health Check: http://localhost:${PORT}/api/health`);
    }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    // In-memory data, no explicit forceDisconnect needed
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    console.log('🛑 Received SIGINT, shutting down gracefully...');
    // In-memory data, no explicit forceDisconnect needed
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

module.exports = app; 