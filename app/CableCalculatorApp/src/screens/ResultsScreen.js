import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const ResultsScreen = ({ results, onBack }) => {
  const renderResultCard = (title, data, color = '#2196F3') => (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.resultRow}>
        <Text style={styles.resultValue}>{data.value}</Text>
        <Text style={styles.resultUnit}>{data.unit}</Text>
      </View>
      <Text style={styles.resultDescription}>{data.description}</Text>
      {data.safety && (
        <View style={[
          styles.safetyBadge,
          { backgroundColor: data.safety === 'safe' ? '#4CAF50' : '#FF9800' }
        ]}>
          <Text style={styles.safetyText}>
            {data.safety === 'safe' ? '✓ Safe' : '⚠ Warning'}
          </Text>
        </View>
      )}
    </View>
  );

  const renderAnalysisSection = (title, analysis, color = '#2196F3') => (
    <View style={[styles.analysisCard, { borderLeftColor: color }]}>
      <Text style={styles.analysisTitle}>{title}</Text>
      {typeof analysis === 'object' ? (
        Object.entries(analysis).map(([key, value]) => (
          <View key={key} style={styles.analysisRow}>
            <Text style={styles.analysisLabel}>{key}:</Text>
            <Text style={styles.analysisValue}>{value}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.analysisValue}>{analysis}</Text>
      )}
    </View>
  );

  const renderRecommendations = (recommendations) => (
    <View style={[styles.analysisCard, { borderLeftColor: '#FF9800' }]}>
      <Text style={styles.analysisTitle}>Recommendations</Text>
      {recommendations.map((rec, index) => (
        <View key={index} style={styles.recommendationRow}>
          <Text style={styles.recommendationText}>• {rec}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calculation Results</Text>
        <Text style={styles.subtitle}>Cable sizing analysis complete</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsContainer}>
          {/* Main Results */}
          <Text style={styles.sectionTitle}>Main Results</Text>
          
          {renderResultCard('Current', results.results.current, '#4CAF50')}
          {renderResultCard('Voltage Drop', results.results.voltageDrop, '#FF9800')}
          {renderResultCard('Cable Size', results.results.cableSize, '#2196F3')}
          {renderResultCard('Total Cost', results.results.cost, '#9C27B0')}
          {renderResultCard('Price per Meter', results.results.pricePerMeter, '#607D8B')}

          {/* Economic Analysis */}
          <Text style={styles.sectionTitle}>Economic Analysis</Text>
          {renderAnalysisSection('Cost Breakdown', results.analysis.economic, '#9C27B0')}

          {/* Safety Analysis */}
          <Text style={styles.sectionTitle}>Safety Analysis</Text>
          {renderAnalysisSection('Safety Status', results.analysis.safety, '#FF9800')}

          {/* Recommendations */}
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {renderRecommendations(results.analysis.recommendations)}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={onBack}
        >
          <Text style={styles.buttonText}>New Calculation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  scrollView: {
    flex: 1,
  },
  resultsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginRight: 5,
  },
  resultUnit: {
    fontSize: 16,
    color: '#666',
  },
  resultDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  safetyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  safetyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  analysisCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  analysisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  analysisLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  analysisValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  recommendationRow: {
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultsScreen; 