// Cable Calculator JavaScript Implementation
// Based on the Python CableCalculatorService

class CableCalculator {
    constructor() {
        // Standard cable sizes (mm²) and their current carrying capacities (A)
        this.cableSizes = {
            "1.5": { currentCapacity: 20, resistance: 12.1 },
            "2.5": { currentCapacity: 27, resistance: 7.41 },
            "4": { currentCapacity: 37, resistance: 4.61 },
            "6": { currentCapacity: 47, resistance: 3.08 },
            "10": { currentCapacity: 65, resistance: 1.83 },
            "16": { currentCapacity: 85, resistance: 1.15 },
            "25": { currentCapacity: 112, resistance: 0.727 },
            "35": { currentCapacity: 138, resistance: 0.524 },
            "50": { currentCapacity: 168, resistance: 0.387 },
            "70": { currentCapacity: 213, resistance: 0.268 },
            "95": { currentCapacity: 258, resistance: 0.193 },
            "120": { currentCapacity: 299, resistance: 0.153 },
            "150": { currentCapacity: 340, resistance: 0.124 },
            "185": { currentCapacity: 384, resistance: 0.099 },
            "240": { currentCapacity: 447, resistance: 0.0754 },
            "300": { currentCapacity: 510, resistance: 0.0601 },
            "400": { currentCapacity: 583, resistance: 0.0470 }
        };
        
        // Installation method factors
        this.installationFactors = {
            "air": 1.0,
            "conduit": 0.8,
            "buried": 0.7,
            "tray": 0.9
        };
        
        // Ambient temperature factors
        this.temperatureFactors = {
            30: 1.0,
            35: 0.94,
            40: 0.87,
            45: 0.79,
            50: 0.71,
            55: 0.61,
            60: 0.50
        };
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const form = document.getElementById('cableForm');
        const resetBtn = document.getElementById('resetBtn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateCableSizing();
        });

        resetBtn.addEventListener('click', () => {
            this.resetForm();
        });
    }

    calculateCurrent(voltage, powerKw, powerFactor, phases = 3) {
        if (phases === 1) {
            // Single phase: I = P / (V * pf)
            return (powerKw * 1000) / (voltage * powerFactor);
        } else {
            // Three phase: I = P / (√3 * V * pf)
            return (powerKw * 1000) / (Math.sqrt(3) * voltage * powerFactor);
        }
    }

    calculateVoltageDrop(current, resistance, distance, phases = 3) {
        if (phases === 1) {
            // Single phase: Vd = 2 * I * R * L / 1000
            return 2 * current * resistance * distance / 1000;
        } else {
            // Three phase: Vd = √3 * I * R * L / 1000
            return Math.sqrt(3) * current * resistance * distance / 1000;
        }
    }

    calculatePowerLoss(current, resistance, distance, phases = 3) {
        if (phases === 1) {
            // Single phase: P_loss = 2 * I² * R * L / 1000
            return 2 * Math.pow(current, 2) * resistance * distance / 1000;
        } else {
            // Three phase: P_loss = 3 * I² * R * L / 1000
            return 3 * Math.pow(current, 2) * resistance * distance / 1000;
        }
    }

    validateInputParameters(voltage, powerKw, powerFactor, distance) {
        const errors = [];
        
        if (voltage <= 0) {
            errors.push("Voltage must be positive");
        }
        
        if (powerKw <= 0) {
            errors.push("Power must be positive");
        }
        
        if (powerFactor <= 0 || powerFactor > 1) {
            errors.push("Power factor must be between 0 and 1");
        }
        
        if (distance <= 0) {
            errors.push("Distance must be positive");
        }
        
        if (distance > 10000) {
            errors.push("Distance seems too large (>10km). Please verify.");
        }
        
        return errors;
    }

    async calculateCableSizing() {
        // Get form values
        const formData = new FormData(document.getElementById('cableForm'));
        const voltage = parseFloat(formData.get('voltage'));
        const powerKw = parseFloat(formData.get('power'));
        const powerFactor = parseFloat(formData.get('powerFactor'));
        const distance = parseFloat(formData.get('distance'));
        const phases = parseInt(formData.get('phases'));
        const voltageDropLimit = parseFloat(formData.get('voltageDropLimit'));
        const installationMethod = formData.get('installationMethod');
        const ambientTemp = parseInt(formData.get('ambientTemp'));

        // Validate inputs
        const validationErrors = this.validateInputParameters(voltage, powerKw, powerFactor, distance);
        if (validationErrors.length > 0) {
            this.showError(validationErrors.join('<br>'));
            return;
        }

        // Show loading state
        this.showLoading();

        try {
            // Send request to server API
            const response = await fetch('/api/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    voltage,
                    power: powerKw,
                    powerFactor,
                    distance,
                    phases,
                    voltageDropLimit,
                    installationMethod,
                    ambientTemp
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Calculation failed');
            }

            const data = await response.json();
            
            if (data.success) {
                // Display results from server
                this.displayServerResults(data.results, data.analysis);
            } else {
                throw new Error(data.error || 'Calculation failed');
            }

        } catch (error) {
            console.error('API Error:', error);
            this.showError(`Server error: ${error.message}`);
        }
    }

    generateEconomicAnalysis(result, distance) {
        const costPerMeter = this.estimateCableCost(result.recommendedCableSize);
        const totalCost = costPerMeter * distance;
        
        // Annual power loss calculation (assuming continuous operation)
        const annualPowerLossKwh = result.powerLoss * 8760 / 1000;
        const annualLossCost = annualPowerLossKwh * 0.1; // $0.1 per kWh
        
        return {
            cableCostPerMeter: costPerMeter,
            totalCableCost: totalCost,
            annualPowerLossKwh: annualPowerLossKwh,
            annualLossCost: annualLossCost,
            paybackPeriodYears: this.calculatePaybackPeriod(totalCost, annualLossCost)
        };
    }

    estimateCableCost(cableSize) {
        const sizeValue = parseFloat(cableSize.replace(" mm²", ""));
        const baseCost = 2.0; // Base cost per meter
        const sizeFactor = sizeValue * 0.1; // Cost increases with size
        return baseCost + sizeFactor;
    }

    calculatePaybackPeriod(initialCost, annualSavings) {
        if (annualSavings <= 0) {
            return Infinity;
        }
        return initialCost / annualSavings;
    }

    generateRecommendations(result) {
        const recommendations = [];
        
        if (!result.isSafe) {
            recommendations.push({
                type: 'danger',
                message: 'WARNING: Calculated configuration may not be safe. Consider larger cable size or shorter distance.'
            });
        }
        
        if (result.voltageDrop > 3.0) {
            recommendations.push({
                type: 'warning',
                message: 'Consider using a larger cable size to reduce voltage drop.'
            });
        }
        
        if (result.safetyFactor < 1.5) {
            recommendations.push({
                type: 'warning',
                message: 'Safety factor is low. Consider increasing cable size for better safety margin.'
            });
        }
        
        if (result.powerLoss > 1000) {
            recommendations.push({
                type: 'warning',
                message: 'High power loss detected. Consider using larger cable to improve efficiency.'
            });
        }
        
        if (result.voltageDrop < 1.0) {
            recommendations.push({
                type: 'success',
                message: 'Cable size may be oversized. Consider smaller cable for cost optimization.'
            });
        }
        
        return recommendations;
    }

    displayResults(result, economicAnalysis, recommendations) {
        const resultsContainer = document.getElementById('results');
        const analysisSection = document.getElementById('analysisSection');
        
        // Display main results
        resultsContainer.innerHTML = `
            <div class="result-item">
                <h3><i class="fas fa-cable"></i> Recommended Cable Size</h3>
                <div class="result-value">${result.recommendedCableSize}</div>
                <div class="result-unit">Cable Size</div>
                <div class="result-description">Optimal cable size for your application</div>
            </div>
            
            <div class="result-item">
                <h3><i class="fas fa-tachometer-alt"></i> Current</h3>
                <div class="result-value">${result.current.toFixed(2)}</div>
                <div class="result-unit">Amperes</div>
                <div class="result-description">Calculated current for your load</div>
            </div>
            
            <div class="result-item">
                <h3><i class="fas fa-bolt"></i> Voltage Drop</h3>
                <div class="result-value">${result.voltageDrop.toFixed(2)}%</div>
                <div class="result-unit">Percentage</div>
                <div class="result-description">Voltage drop across the cable</div>
            </div>
            
            <div class="result-item">
                <h3><i class="fas fa-fire"></i> Power Loss</h3>
                <div class="result-value">${result.powerLoss.toFixed(2)}</div>
                <div class="result-unit">Watts</div>
                <div class="result-description">Power loss in the cable</div>
            </div>
            
            <div class="result-item">
                <h3><i class="fas fa-shield-alt"></i> Safety Factor</h3>
                <div class="result-value">${result.safetyFactor.toFixed(2)}</div>
                <div class="result-unit">Ratio</div>
                <div class="result-description">Safety margin of the cable</div>
                <div class="safety-indicator ${result.isSafe ? 'safety-safe' : 'safety-danger'}">
                    ${result.isSafe ? 'SAFE' : 'UNSAFE'}
                </div>
            </div>
        `;
        
        // Display economic analysis
        const economicContainer = document.getElementById('economicAnalysis');
        economicContainer.innerHTML = `
            <div class="analysis-item">
                <span class="analysis-label">Cable Cost per Meter</span>
                <span class="analysis-value">$${economicAnalysis.cableCostPerMeter.toFixed(2)}</span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Total Cable Cost</span>
                <span class="analysis-value">$${economicAnalysis.totalCableCost.toFixed(2)}</span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Annual Power Loss</span>
                <span class="analysis-value">${economicAnalysis.annualPowerLossKwh.toFixed(2)} kWh</span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Annual Loss Cost</span>
                <span class="analysis-value">$${economicAnalysis.annualLossCost.toFixed(2)}</span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Payback Period</span>
                <span class="analysis-value">${economicAnalysis.paybackPeriodYears === Infinity ? 'N/A' : economicAnalysis.paybackPeriodYears.toFixed(1)} years</span>
            </div>
        `;
        
        // Display safety analysis
        const safetyContainer = document.getElementById('safetyAnalysis');
        safetyContainer.innerHTML = `
            <div class="analysis-item">
                <span class="analysis-label">Calculated Current</span>
                <span class="analysis-value">${result.details.calculatedCurrent.toFixed(2)} A</span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Derated Current</span>
                <span class="analysis-value">${result.details.deratedCurrent.toFixed(2)} A</span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Cable Capacity</span>
                <span class="analysis-value">${result.details.cableCurrentCapacity} A</span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Installation Factor</span>
                <span class="analysis-value">${result.details.installationFactor}</span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Temperature Factor</span>
                <span class="analysis-value">${result.details.temperatureFactor}</span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Total Derating</span>
                <span class="analysis-value">${result.details.totalDerating.toFixed(3)}</span>
            </div>
        `;
        
        // Display recommendations
        const recommendationsContainer = document.getElementById('recommendations');
        if (recommendations.length === 0) {
            recommendationsContainer.innerHTML = `
                <div class="recommendation-item success">
                    <i class="fas fa-check-circle"></i>
                    All parameters are within acceptable ranges. No specific recommendations needed.
                </div>
            `;
        } else {
            recommendationsContainer.innerHTML = recommendations.map(rec => `
                <div class="recommendation-item ${rec.type}">
                    <i class="fas fa-${rec.type === 'danger' ? 'exclamation-triangle' : rec.type === 'warning' ? 'exclamation-circle' : 'check-circle'}"></i>
                    ${rec.message}
                </div>
            `).join('');
        }
        
        // Show analysis section
        analysisSection.style.display = 'block';
    }

    displayServerResults(results, analysis) {
        const resultsContainer = document.getElementById('results');
        const analysisSection = document.getElementById('analysisSection');
        
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        // Create results HTML from server data
        let resultsHTML = '';
        
        // Display each result from server
        Object.entries(results).forEach(([key, result]) => {
            const safetyClass = result.safety ? `safety-${result.safety}` : '';
            const safetyIndicator = result.safety ? 
                `<div class="safety-indicator ${safetyClass}">${result.safety === 'safe' ? 'Safe' : 'Warning'}</div>` : '';
            
            resultsHTML += `
                <div class="result-item">
                    <h3>${this.formatResultTitle(key)}</h3>
                    <div class="result-value">${result.value}</div>
                    <div class="result-unit">${result.unit}</div>
                    <div class="result-description">${result.description}</div>
                    ${safetyIndicator}
                </div>
            `;
        });
        
        resultsContainer.innerHTML = resultsHTML;
        
        // Display analysis if available
        if (analysis) {
            this.displayServerAnalysis(analysis);
            analysisSection.classList.remove('hidden');
        }
    }

    formatResultTitle(key) {
        const titles = {
            current: 'Current',
            voltageDrop: 'Voltage Drop',
            cableSize: 'Cable Size',
            cost: 'Estimated Cost'
        };
        return titles[key] || key.charAt(0).toUpperCase() + key.slice(1);
    }

    displayServerAnalysis(analysis) {
        // Economic Analysis
        const economicContainer = document.getElementById('economicAnalysis');
        if (analysis.economic) {
            economicContainer.innerHTML = `
                <div class="analysis-item">
                    <span class="analysis-label">Cost per Meter:</span>
                    <span class="analysis-value">$${analysis.economic.costPerMeter}</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">Total Savings:</span>
                    <span class="analysis-value">$${analysis.economic.totalSavings}</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">ROI:</span>
                    <span class="analysis-value">${analysis.economic.roi}%</span>
                </div>
            `;
        }

        // Safety Analysis
        const safetyContainer = document.getElementById('safetyAnalysis');
        if (analysis.safety) {
            let safetyHTML = `
                <div class="analysis-item">
                    <span class="analysis-label">Voltage Drop Status:</span>
                    <span class="analysis-value safety-${analysis.safety.voltageDropStatus}">${analysis.safety.voltageDropStatus}</span>
                </div>
            `;
            
            if (analysis.safety.recommendations) {
                analysis.safety.recommendations.forEach(rec => {
                    safetyHTML += `
                        <div class="recommendation-item ${rec.type}">
                            <i class="fas fa-${this.getRecommendationIcon(rec.type)}"></i>
                            ${rec.message}
                        </div>
                    `;
                });
            }
            safetyContainer.innerHTML = safetyHTML;
        }

        // General Recommendations
        const recommendationsContainer = document.getElementById('recommendations');
        if (analysis.recommendations) {
            let recommendationsHTML = '';
            analysis.recommendations.forEach(rec => {
                recommendationsHTML += `
                    <div class="recommendation-item ${rec.type}">
                        <i class="fas fa-${this.getRecommendationIcon(rec.type)}"></i>
                        ${rec.message}
                    </div>
                `;
            });
            recommendationsContainer.innerHTML = recommendationsHTML;
        }
    }

    getRecommendationIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            danger: 'times-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    showLoading() {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner"></i>
                <p>Calculating cable sizing...</p>
            </div>
        `;
    }

    showError(message) {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>Error:</strong><br>
                ${message}
            </div>
        `;
    }

    resetForm() {
        document.getElementById('cableForm').reset();
        document.getElementById('results').innerHTML = `
            <div class="no-results">
                <i class="fas fa-calculator"></i>
                <p>Enter parameters and click Calculate to see results</p>
            </div>
        `;
        document.getElementById('analysisSection').classList.add('hidden');
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CableCalculator();
}); 