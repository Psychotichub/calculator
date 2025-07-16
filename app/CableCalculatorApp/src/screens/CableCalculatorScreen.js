import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { calculateCableSize } from '../utils/cableCalculator';

const CableCalculatorScreen = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    voltage: '400',
    power: '10',
    powerFactor: '0.8',
    distance: '100',
    phases: 3,
    voltageDropLimit: '5.0',
    installationMethod: 'air',
    ambientTemp: '30',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCalculate = () => {
    setLoading(true);
    
    try {
      // Convert string values to numbers
      const inputData = {
        voltage: parseFloat(formData.voltage),
        power: parseFloat(formData.power),
        powerFactor: parseFloat(formData.powerFactor),
        distance: parseFloat(formData.distance),
        phases: parseInt(formData.phases),
        voltageDropLimit: parseFloat(formData.voltageDropLimit),
        installationMethod: formData.installationMethod,
        ambientTemp: parseInt(formData.ambientTemp),
      };

      const calculationResult = calculateCableSize(inputData);
      
      // Navigate to results screen
      onCalculate(calculationResult);
    } catch (error) {
      Alert.alert('Calculation Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      voltage: '400',
      power: '10',
      powerFactor: '0.8',
      distance: '100',
      phases: 3,
      voltageDropLimit: '5.0',
      installationMethod: 'air',
      ambientTemp: '30',
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Cable Calculator</Text>
          <Text style={styles.subtitle}>Professional electrical cable sizing tool</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Input Parameters</Text>

          {/* Voltage */}
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

          {/* Power */}
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

          {/* Power Factor */}
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

          {/* Distance */}
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

          {/* Number of Phases */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Number of Phases</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.phases}
                onValueChange={(value) => handleInputChange('phases', value)}
                style={styles.picker}
              >
                <Picker.Item label="Single Phase" value={1} />
                <Picker.Item label="Three Phase" value={3} />
              </Picker>
            </View>
          </View>

          {/* Voltage Drop Limit */}
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

          {/* Installation Method */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Installation Method</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.installationMethod}
                onValueChange={(value) => handleInputChange('installationMethod', value)}
                style={styles.picker}
              >
                <Picker.Item label="Air" value="air" />
                <Picker.Item label="Conduit" value="conduit" />
                <Picker.Item label="Buried" value="buried" />
                <Picker.Item label="Tray" value="tray" />
              </Picker>
            </View>
          </View>

          {/* Ambient Temperature */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ambient Temperature (°C)</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.ambientTemp}
                onValueChange={(value) => handleInputChange('ambientTemp', value)}
                style={styles.picker}
              >
                <Picker.Item label="30°C" value="30" />
                <Picker.Item label="35°C" value="35" />
                <Picker.Item label="40°C" value="40" />
                <Picker.Item label="45°C" value="45" />
                <Picker.Item label="50°C" value="50" />
                <Picker.Item label="55°C" value="55" />
                <Picker.Item label="60°C" value="60" />
              </Picker>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.calculateButton]}
              onPress={handleCalculate}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Calculating...' : 'Calculate'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={resetForm}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  calculateButton: {
    backgroundColor: '#2196F3',
  },
  resetButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CableCalculatorScreen; 