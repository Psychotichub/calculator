// Simple test for cable calculator functions
import { calculateCableSize, getCableSizes, getCablePrices } from './cableCalculator';

// Test data
const testInput = {
  voltage: 400,
  power: 10,
  powerFactor: 0.8,
  distance: 100,
  phases: 3,
  voltageDropLimit: 5.0,
  installationMethod: 'air',
  ambientTemp: 30,
};

// Test the calculation function
console.log('Testing cable calculator...');

try {
  const result = calculateCableSize(testInput);
  console.log('✅ Calculation successful!');
  console.log('Results:', JSON.stringify(result, null, 2));
  
  // Test cable sizes
  const singlePhaseSizes = getCableSizes(1);
  const threePhaseSizes = getCableSizes(3);
  console.log('✅ Cable sizes retrieved:', { singlePhaseSizes, threePhaseSizes });
  
  // Test cable prices
  const singlePhasePrices = getCablePrices(1);
  const threePhasePrices = getCablePrices(3);
  console.log('✅ Cable prices retrieved:', { 
    singlePhaseCount: Object.keys(singlePhasePrices).length,
    threePhaseCount: Object.keys(threePhasePrices).length 
  });
  
} catch (error) {
  console.error('❌ Calculation failed:', error.message);
}

export { testInput }; 