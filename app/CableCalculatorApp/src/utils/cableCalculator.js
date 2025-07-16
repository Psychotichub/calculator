// Cable Calculator Utility Functions
// Based on the server.js calculation logic

// Cable data for different phases
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
    { size: 1, price: 3.20 },
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

// Cable current capacities (A)
const cableCapacities = {
    1: 16, 1.5: 20, 2.5: 27, 4: 37, 6: 47, 10: 65, 16: 85, 25: 112, 35: 138,
    50: 168, 70: 213, 95: 258, 120: 299, 150: 340, 185: 384, 240: 447
};

// Cable resistances per km (Ω/km)
const cableResistances = {
    1: 18.1, 1.5: 12.1, 2.5: 7.41, 4: 4.61, 6: 3.08, 10: 1.83, 16: 1.15, 25: 0.727,
    35: 0.524, 50: 0.387, 70: 0.268, 95: 0.193, 120: 0.153, 150: 0.124,
    185: 0.099, 240: 0.0754
};

export const calculateCableSize = (input) => {
    const {
        voltage,
        power,
        powerFactor,
        distance,
        phases,
        voltageDropLimit,
        installationMethod,
        ambientTemp
    } = input;

    // Validate input parameters
    if (!voltage || !power || !powerFactor || !distance || !phases || !voltageDropLimit) {
        throw new Error('Missing required parameters');
    }

    // Calculate current
    const current = (power * 1000) / (voltage * powerFactor * Math.sqrt(phases));
    
    // Find the smallest cable size that can handle the current (with 25% margin)
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

    return {
        success: true,
        results,
        analysis: generateAnalysis(results, input)
    };
};

function calculateVoltageDrop(current, cableSize, distance, phases, voltage) {
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

function generateAnalysis(results, input) {
    const analysis = {
        economic: generateEconomicAnalysis(results, input),
        safety: generateSafetyAnalysis(results, input),
        recommendations: generateRecommendations(results, input)
    };
    return analysis;
}

function generateEconomicAnalysis(results, input) {
    const cost = parseFloat(results.cost.value);
    const distance = input.distance;
    const costPerMeter = cost / distance;
    
    return {
        totalCost: `$${results.cost.value}`,
        costPerMeter: `$${costPerMeter.toFixed(2)}`,
        costBreakdown: `Distance: ${distance}m × $${results.pricePerMeter.value}/m = $${results.cost.value}`,
        savings: calculateSavings(results, input),
        roi: calculateROI(results, input)
    };
}

function generateSafetyAnalysis(results, input) {
    const voltageDrop = parseFloat(results.voltageDrop.value);
    const limit = input.voltageDropLimit;
    const isSafe = voltageDrop <= limit;
    
    return {
        status: isSafe ? 'Safe' : 'Warning',
        voltageDropPercentage: `${results.voltageDrop.value}%`,
        limit: `${limit}%`,
        margin: `${(limit - voltageDrop).toFixed(2)}%`,
        recommendations: generateSafetyRecommendations(results, input)
    };
}

function generateRecommendations(results, input) {
    const recommendations = [];
    
    // General recommendations
    recommendations.push(...generateGeneralRecommendations(results, input));
    
    // Safety recommendations
    recommendations.push(...generateSafetyRecommendations(results, input));
    
    return recommendations;
}

function calculateSavings(results, input) {
    // Placeholder for savings calculation
    return 'Calculate based on alternative cable options';
}

function calculateROI(results, input) {
    // Placeholder for ROI calculation
    return 'Calculate based on energy savings';
}

function generateSafetyRecommendations(results, input) {
    const recommendations = [];
    const voltageDrop = parseFloat(results.voltageDrop.value);
    const limit = input.voltageDropLimit;
    
    if (voltageDrop > limit) {
        recommendations.push('⚠️ Voltage drop exceeds limit - consider larger cable size');
        recommendations.push('🔧 Check installation method and ambient temperature');
        recommendations.push('📏 Consider reducing cable length if possible');
    } else if (voltageDrop > limit * 0.8) {
        recommendations.push('⚠️ Voltage drop approaching limit - monitor closely');
        recommendations.push('📊 Consider future load increases');
    } else {
        recommendations.push('✅ Voltage drop within safe limits');
        recommendations.push('💡 Good design for current requirements');
    }
    
    return recommendations;
}

function generateGeneralRecommendations(results, input) {
    const recommendations = [];
    const current = parseFloat(results.current.value);
    const cableSize = parseFloat(results.cableSize.value);
    
    recommendations.push(`🔌 Current: ${results.current.value}A`);
    recommendations.push(`📏 Cable Size: ${results.cableSize.value}mm²`);
    recommendations.push(`💰 Total Cost: $${results.cost.value}`);
    
    if (current > 100) {
        recommendations.push('⚡ High current application - ensure proper protection');
    }
    
    if (cableSize >= 95) {
        recommendations.push('🔧 Large cable size - consider installation method');
    }
    
    return recommendations;
}

export const getCableSizes = (phases = 1) => {
    const cableData = phases === 1 ? singlePhaseCableData : threePhaseCableData;
    return cableData.map(c => c.size);
};

export const getCablePrices = (phases = 1) => {
    const cableData = phases === 1 ? singlePhaseCableData : threePhaseCableData;
    const prices = {};
    cableData.forEach(c => { prices[c.size] = c.price; });
    return prices;
}; 