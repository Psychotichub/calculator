// Cable calculation logic ported from web app
export class CableCalculator {
  constructor() {
    // Cable data for single phase and three phase
    this.singlePhaseCableData = [
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

    this.threePhaseCableData = [
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

    // Current capacities for cable sizes (A)
    this.cableCapacities = {
      1: 16, 1.5: 20, 2.5: 27, 4: 37, 6: 47, 10: 65, 16: 85, 25: 112, 35: 138,
      50: 168, 70: 213, 95: 258, 120: 299, 150: 340, 185: 384, 240: 447
    };

    // Cable resistances per km (Ω/km)
    this.cableResistances = {
      1: 18.1, 1.5: 12.1, 2.5: 7.41, 4: 4.61, 6: 3.08, 10: 1.83, 16: 1.15, 25: 0.727,
      35: 0.524, 50: 0.387, 70: 0.268, 95: 0.193, 120: 0.153, 150: 0.124,
      185: 0.099, 240: 0.0754
    };
  }

  calculateCableSize(params) {
    const {
      voltage,
      power,
      powerFactor,
      distance,
      phases,
      voltageDropLimit,
      installationMethod,
      ambientTemp
    } = params;

    // Calculate current
    const current = (power * 1000) / (voltage * powerFactor * Math.sqrt(phases));
    
    // Apply derating factors
    const deratedCurrent = this.applyDeratingFactors(current, installationMethod, ambientTemp);
    
    // Find appropriate cable size
    const cableData = phases === 1 ? this.singlePhaseCableData : this.threePhaseCableData;
    const requiredCapacity = deratedCurrent * 1.25; // 25% safety margin
    
    let selectedCable = cableData.find(c => this.cableCapacities[c.size] >= requiredCapacity);
    if (!selectedCable) {
      selectedCable = cableData[cableData.length - 1]; // Use largest available
    }

    // Calculate voltage drop
    const voltageDrop = this.calculateVoltageDrop(current, selectedCable.size, distance, phases, voltage);
    
    // Calculate cost
    const pricePerMeter = selectedCable.price;
    const cost = distance * pricePerMeter;

    return {
      current: {
        value: current.toFixed(2),
        unit: 'A',
        description: 'Calculated current'
      },
      voltageDrop: {
        value: voltageDrop.toFixed(2),
        unit: '%',
        description: 'Voltage drop percentage',
        safety: voltageDrop <= voltageDropLimit ? 'safe' : 'warning'
      },
      cableSize: {
        value: phases === 1 ? `${selectedCable.size}` : `${selectedCable.size}`,
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
      },
      analysis: this.generateAnalysis({
        current: { value: current.toFixed(2) },
        voltageDrop: { value: voltageDrop.toFixed(2), safety: voltageDrop <= voltageDropLimit ? 'safe' : 'warning' },
        cableSize: { value: selectedCable.size },
        cost: { value: cost.toFixed(2) },
        pricePerMeter: { value: pricePerMeter.toFixed(2) }
      }, params)
    };
  }

  applyDeratingFactors(current, installationMethod, ambientTemp) {
    let deratedCurrent = current;

    // Temperature derating factors
    const tempFactors = {
      30: 1.0, 35: 0.94, 40: 0.87, 45: 0.79, 50: 0.71, 55: 0.61, 60: 0.50
    };
    const tempFactor = tempFactors[ambientTemp] || 1.0;

    // Installation method derating factors
    const methodFactors = {
      'air': 1.0,
      'conduit': 0.8,
      'buried': 0.7,
      'tray': 0.9
    };
    const methodFactor = methodFactors[installationMethod] || 1.0;

    return deratedCurrent / (tempFactor * methodFactor);
  }

  calculateVoltageDrop(current, cableSize, distance, phases, voltage) {
    const resistance = this.cableResistances[cableSize] || (1 / cableSize);
    const resistancePerMeter = resistance / 1000;

    let voltageDrop;
    if (phases === 1) {
      // Single phase: Vd = 2 * I * R * L
      voltageDrop = 2 * current * resistancePerMeter * distance;
    } else {
      // Three phase: Vd = √3 * I * R * L
      voltageDrop = Math.sqrt(3) * current * resistancePerMeter * distance;
    }

    return (voltageDrop / voltage) * 100; // Return as percentage
  }

  generateAnalysis(results, input) {
    return {
      economic: {
        costPerMeter: results.pricePerMeter.value,
        totalSavings: this.calculateSavings(results, input),
        roi: this.calculateROI(results, input)
      },
      safety: {
        voltageDropStatus: results.voltageDrop.safety,
        recommendations: this.generateSafetyRecommendations(results, input)
      },
      recommendations: this.generateGeneralRecommendations(results, input)
    };
  }

  calculateSavings(results, input) {
    const optimalCost = parseFloat(results.cost.value);
    const standardCost = input.distance * 5; // Standard cable cost
    return Math.max(0, (standardCost - optimalCost).toFixed(2));
  }

  calculateROI(results, input) {
    const investment = parseFloat(results.cost.value);
    const savings = parseFloat(this.calculateSavings(results, input));
    return investment > 0 ? ((savings / investment) * 100).toFixed(1) : 0;
  }

  generateSafetyRecommendations(results, input) {
    const recommendations = [];
    
    if (results.voltageDrop.safety === 'warning') {
      recommendations.push({
        type: 'warning',
        message: 'Voltage drop exceeds recommended limit. Consider larger cable size.'
      });
    }

    if (parseFloat(results.current.value) > 100) {
      recommendations.push({
        type: 'info',
        message: 'High current detected. Ensure proper circuit protection.'
      });
    }

    return recommendations;
  }

  generateGeneralRecommendations(results, input) {
    const recommendations = [];
    
    recommendations.push({
      type: 'success',
      message: `Selected ${results.cableSize.value}mm² cable is suitable for your application.`
    });

    if (parseFloat(results.voltageDrop.value) < 2) {
      recommendations.push({
        type: 'info',
        message: 'Excellent voltage drop performance. Cable size is well-optimized.'
      });
    }

    return recommendations;
  }

  getAvailableCableSizes(phases = 1) {
    const cableData = phases === 1 ? this.singlePhaseCableData : this.threePhaseCableData;
    return cableData.map(c => c.size);
  }

  getCablePrices(phases = 1) {
    const cableData = phases === 1 ? this.singlePhaseCableData : this.threePhaseCableData;
    const prices = {};
    cableData.forEach(c => { prices[c.size] = c.price; });
    return prices;
  }
} 