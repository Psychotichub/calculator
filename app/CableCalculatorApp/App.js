import React, { useState } from 'react';
import CableCalculatorScreen from './src/screens/CableCalculatorScreen';
import ResultsScreen from './src/screens/ResultsScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('calculator');
  const [results, setResults] = useState(null);

  const navigateToResults = (calculationResults) => {
    setResults(calculationResults);
    setCurrentScreen('results');
  };

  const navigateToCalculator = () => {
    setCurrentScreen('calculator');
    setResults(null);
  };

  if (currentScreen === 'results') {
    return <ResultsScreen results={results} onBack={navigateToCalculator} />;
  }

  return <CableCalculatorScreen onCalculate={navigateToResults} />;
};

export default App; 