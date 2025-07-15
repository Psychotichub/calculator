import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ResultsScreen = ({ route, navigation }) => {
  const { results, inputParams } = route.params;

  const getSafetyColor = (safety) => {
    return safety === 'safe' ? '#10b981' : '#ef4444';
  };

  const getSafetyIcon = (safety) => {
    return safety === 'safe' ? '✅' : '⚠️';
  };

  const renderResultCard = (title, data, color = '#2563eb') => (
    <View style={styles.resultCard}>
      <Text style={styles.resultTitle}>{title}</Text>
      <View style={styles.resultValueContainer}>
        <Text style={[styles.resultValue, { color }]}>{data.value}</Text>
        <Text style={styles.resultUnit}>{data.unit}</Text>
      </View>
      <Text style={styles.resultDescription}>{data.description}</Text>
    </View>
  );

  const renderAnalysisSection = (title, analysis, type = 'info') => (
    <View style={styles.analysisSection}>
      <Text style={styles.analysisTitle}>{title}</Text>
      {analysis && typeof analysis === 'object' ? (
        Object.entries(analysis).map(([key, value]) => (
          <View key={key} style={styles.analysisItem}>
            <Text style={styles.analysisLabel}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</Text>
            <Text style={styles.analysisValue}>{value}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.analysisText}>{analysis}</Text>
      )}
    </View>
  );

  const renderRecommendations = (recommendations) => (
    <View style={styles.recommendationsSection}>
      <Text style={styles.recommendationsTitle}>Recommendations</Text>
      {recommendations.map((rec, index) => (
        <View key={index} style={styles.recommendationItem}>
          <Text style={styles.recommendationIcon}>
            {rec.type === 'warning' ? '⚠️' : rec.type === 'success' ? '✅' : 'ℹ️'}
          </Text>
          <Text style={styles.recommendationText}>{rec.message}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📊 Calculation Results</Text>
          <Text style={styles.headerSubtitle}>Professional cable sizing analysis</Text>
        </View>

        <View style={styles.resultsContainer}>
          {/* Main Results */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Main Results</Text>
            
            {renderResultCard('Current', results.current)}
            {renderResultCard(
              'Voltage Drop',
              results.voltageDrop,
              getSafetyColor(results.voltageDrop.safety)
            )}
            {renderResultCard('Cable Size', results.cableSize)}
            {renderResultCard('Cost', results.cost)}
            {renderResultCard('Price per Meter', results.pricePerMeter)}
          </View>

          {/* Safety Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Safety Status</Text>
            <View style={[styles.safetyCard, { borderColor: getSafetyColor(results.voltageDrop.safety) }]}>
              <Text style={styles.safetyIcon}>{getSafetyIcon(results.voltageDrop.safety)}</Text>
              <Text style={[styles.safetyText, { color: getSafetyColor(results.voltageDrop.safety) }]}>
                {results.voltageDrop.safety === 'safe' ? 'Safe' : 'Warning'}
              </Text>
              <Text style={styles.safetyDescription}>
                Voltage drop: {results.voltageDrop.value}% 
                {results.voltageDrop.safety === 'safe' 
                  ? ' (within limits)' 
                  : ' (exceeds recommended limit)'}
              </Text>
            </View>
          </View>

          {/* Economic Analysis */}
          {results.analysis?.economic && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Economic Analysis</Text>
              {renderAnalysisSection('Economic Analysis', results.analysis.economic)}
            </View>
          )}

          {/* Safety Analysis */}
          {results.analysis?.safety && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Safety Analysis</Text>
              {renderAnalysisSection('Safety Analysis', results.analysis.safety)}
            </View>
          )}

          {/* Recommendations */}
          {results.analysis?.recommendations && (
            <View style={styles.section}>
              {renderRecommendations(results.analysis.recommendations)}
            </View>
          )}

          {/* Input Parameters Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Input Parameters</Text>
            <View style={styles.inputSummary}>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Voltage:</Text>
                <Text style={styles.inputValue}>{inputParams.voltage}V</Text>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Power:</Text>
                <Text style={styles.inputValue}>{inputParams.power}kW</Text>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Distance:</Text>
                <Text style={styles.inputValue}>{inputParams.distance}m</Text>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Phases:</Text>
                <Text style={styles.inputValue}>{inputParams.phases === 1 ? 'Single' : 'Three'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back to Calculator</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#2563eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
  },
  resultsContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  resultValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  resultUnit: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 8,
  },
  resultDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  safetyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  safetyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  safetyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  safetyDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  analysisSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  analysisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  analysisLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  analysisValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    textAlign: 'right',
  },
  analysisText: {
    fontSize: 14,
    color: '#6b7280',
  },
  recommendationsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  inputSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  inputValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultsScreen; 