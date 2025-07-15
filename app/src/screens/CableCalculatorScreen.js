import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';
import { CableCalculator } from '../utils/cableCalculator';

const CableCalculatorScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    voltage: '400',
    power: '10',
    powerFactor: '0.8',
    distance: '100',
    phases: '3',
    voltageDropLimit: '5.0',
    installationMethod: 'air',
    ambientTemp: '30',
  });

  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const required = ['voltage', 'power', 'powerFactor', 'distance', 'phases', 'voltageDropLimit'];
    for (const field of required) {
      if (!formData[field] || parseFloat(formData[field]) <= 0) {
        Alert.alert('Validation Error', `Please enter a valid value for ${field}`);
        return false;
      }
    }
    return true;
  };

  const handleCalculate = async () => {
    if (!validateForm()) return;

    setIsCalculating(true);
    
    try {
      const calculator = new CableCalculator();
      const params = {
        voltage: parseFloat(formData.voltage),
        power: parseFloat(formData.power),
        powerFactor: parseFloat(formData.powerFactor),
        distance: parseFloat(formData.distance),
        phases: parseInt(formData.phases),
        voltageDropLimit: parseFloat(formData.voltageDropLimit),
        installationMethod: formData.installationMethod,
        ambientTemp: parseInt(formData.ambientTemp),
      };

      const results = calculator.calculateCableSize(params);
      
      navigation.navigate('Results', {
        results,
        inputParams: params,
      });
    } catch (error) {
      Alert.alert('Calculation Error', 'An error occurred during calculation. Please check your inputs.');
    } finally {
      setIsCalculating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      voltage: '400',
      power: '10',
      powerFactor: '0.8',
      distance: '100',
      phases: '3',
      voltageDropLimit: '5.0',
      installationMethod: 'air',
      ambientTemp: '30',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>🔌 Cable Calculator</Text>
            <Text style={styles.subtitle}>Professional electrical cable sizing and analysis</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Input Parameters</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Voltage (V)</Text>
              <TextInput
                style={styles.input}
                value={formData.voltage}
                onChangeText={(value) => handleInputChange('voltage', value)}
                keyboardType="numeric"
                placeholder="400"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Power (kW)</Text>
              <TextInput
                style={styles.input}
                value={formData.power}
                onChangeText={(value) => handleInputChange('power', value)}
                keyboardType="numeric"
                placeholder="10"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Power Factor</Text>
              <TextInput
                style={styles.input}
                value={formData.powerFactor}
                onChangeText={(value) => handleInputChange('powerFactor', value)}
                keyboardType="numeric"
                placeholder="0.8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Distance (m)</Text>
              <TextInput
                style={styles.input}
                value={formData.distance}
                onChangeText={(value) => handleInputChange('distance', value)}
                keyboardType="numeric"
                placeholder="100"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Number of Phases</Text>
              <RNPickerSelect
                value={formData.phases}
                onValueChange={(value) => handleInputChange('phases', value)}
                items={[
                  { label: 'Single Phase', value: '1' },
                  { label: 'Three Phase', value: '3' },
                ]}
                style={pickerSelectStyles}
                placeholder={{ label: 'Select phases', value: null }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Voltage Drop Limit (%)</Text>
              <TextInput
                style={styles.input}
                value={formData.voltageDropLimit}
                onChangeText={(value) => handleInputChange('voltageDropLimit', value)}
                keyboardType="numeric"
                placeholder="5.0"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Installation Method</Text>
              <RNPickerSelect
                value={formData.installationMethod}
                onValueChange={(value) => handleInputChange('installationMethod', value)}
                items={[
                  { label: 'Air', value: 'air' },
                  { label: 'Conduit', value: 'conduit' },
                  { label: 'Buried', value: 'buried' },
                  { label: 'Tray', value: 'tray' },
                ]}
                style={pickerSelectStyles}
                placeholder={{ label: 'Select method', value: null }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ambient Temperature (°C)</Text>
              <RNPickerSelect
                value={formData.ambientTemp}
                onValueChange={(value) => handleInputChange('ambientTemp', value)}
                items={[
                  { label: '30°C', value: '30' },
                  { label: '35°C', value: '35' },
                  { label: '40°C', value: '40' },
                  { label: '45°C', value: '45' },
                  { label: '50°C', value: '50' },
                  { label: '55°C', value: '55' },
                  { label: '60°C', value: '60' },
                ]}
                style={pickerSelectStyles}
                placeholder={{ label: 'Select temperature', value: null }}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.calculateButton]}
                onPress={handleCalculate}
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Calculate Cable Size</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={resetForm}
                disabled={isCalculating}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#2563eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateButton: {
    backgroundColor: '#2563eb',
  },
  resetButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  inputAndroid: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
});

export default CableCalculatorScreen; 