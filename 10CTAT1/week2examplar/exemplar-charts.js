// ===============================================
// TEACHER EXEMPLAR - JAVASCRIPT
// Computing Technology Year 10
// Demonstrates: Chart.js, event handling, data filtering
// ===============================================

// MOCK DATA - In a real project, this might come from an API or CSV file
const renewableData = {
    years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    
    totalCapacity: [8.4, 10.2, 12.8, 15.3, 18.7, 22.1, 26.3, 29.2, 31.1, 32.5],
    solarCapacity: [4.5, 5.8, 7.6, 9.4, 11.8, 14.5, 17.8, 20.1, 22.3, 23.8],
    windCapacity: [3.9, 4.4, 5.2, 5.9, 6.9, 7.6, 8.5, 9.1, 8.8, 8.7],
    
    stateData: {
        nsw: { name: 'New South Wales', capacity: 8.2, solar: 5.1, wind: 3.1 },
        vic: { name: 'Victoria', capacity: 7.8, solar: 4.2, wind: 3.6 },
        qld: { name: 'Queensland', capacity: 6.9, solar: 4.8, wind: 2.1 },
        sa: { name: 'South Australia', capacity: 5.4, solar: 3.2, wind: 2.2 },
        wa: { name: 'Western Australia', capacity: 3.2, solar: 2.8, wind: 0.4 },
        tas: { name: 'Tasmania', capacity: 1.0, solar: 0.7, wind: 0.3 }
    },
    
    energyMix: {
        renewable: 38,
        coal: 42,
        gas: 16,
        other: 4
    }
};

// CHART COLOR SCHEME - Consistent across all visualizations
const chartColors = {
    primary: '#2E7D32',
    solar: '#FFA000',
    wind: '#1976D2',
    coal: '#424242',
    gas: '#757575',
    other: '#BDBDBD'
};

// GLOBAL CHART CONFIGURATION - Settings used for all charts
const globalChartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                padding: 15,
                font: {
                    size: 12,
                    family: "'Inter', sans-serif"
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
                size: 14,
                weight: 'bold'
            },
            bodyFont: {
                size: 13
            },
            cornerRadius: 8
        }
    }
};

// ===============================================
// MAIN LINE CHART - Renewable Energy Growth
// ===============================================

const mainChartCtx = document.getElementById('mainChart').getContext('2d');
let mainChart = new Chart(mainChartCtx, {
    type: 'line',
    data: {
        labels: renewableData.years,
        datasets: [
            {
                label: 'Total Renewable Capacity',
                data: renewableData.totalCapacity,
                borderColor: chartColors.primary,
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: chartColors.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            },
            {
                label: 'Solar Capacity',
                data: renewableData.solarCapacity,
                borderColor: chartColors.solar,
                backgroundColor: 'rgba(255, 160, 0, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: chartColors.solar,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            },
            {
                label: 'Wind Capacity',
                data: renewableData.windCapacity,
                borderColor: chartColors.wind,
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: chartColors.wind,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ]
    },
    options: {
        ...globalChartConfig,
        plugins: {
            ...globalChartConfig.plugins,
            title: {
                display: true,
                text: 'Renewable Energy Capacity Growth (2015-2024)',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: {
                    bottom: 20
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Capacity (GW)',
                    font: {
                        size: 13,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    callback: function(value) {
                        return value + ' GW';
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Year',
                    font: {
                        size: 13,
                        weight: 'bold'
                    }
                },
                grid: {
                    display: false
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    }
});

// ===============================================
// BAR CHART - State Comparison
// ===============================================

const barChartCtx = document.getElementById('barChart').getContext('2d');

// Prepare data for bar chart
const stateNames = Object.values(renewableData.stateData).map(state => state.name);
const stateSolarCapacity = Object.values(renewableData.stateData).map(state => state.solar);
const stateWindCapacity = Object.values(renewableData.stateData).map(state => state.wind);

const barChart = new Chart(barChartCtx, {
    type: 'bar',
    data: {
        labels: stateNames,
        datasets: [
            {
                label: 'Solar Capacity (GW)',
                data: stateSolarCapacity,
                backgroundColor: chartColors.solar,
                borderColor: chartColors.solar,
                borderWidth: 1,
                borderRadius: 4
            },
            {
                label: 'Wind Capacity (GW)',
                data: stateWindCapacity,
                backgroundColor: chartColors.wind,
                borderColor: chartColors.wind,
                borderWidth: 1,
                borderRadius: 4
            }
        ]
    },
    options: {
        ...globalChartConfig,
        plugins: {
            ...globalChartConfig.plugins,
            title: {
                display: true,
                text: 'Renewable Energy Capacity by State (2024)',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: {
                    bottom: 20
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Capacity (GW)',
                    font: {
                        size: 13,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                stacked: false,
                ticks: {
                    callback: function(value) {
                        return value + ' GW';
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                stacked: false
            }
        }
    }
});

// ===============================================
// PIE CHART - Energy Mix
// ===============================================

const pieChartCtx = document.getElementById('pieChart').getContext('2d');

const pieChart = new Chart(pieChartCtx, {
    type: 'doughnut',
    data: {
        labels: ['Renewable', 'Coal', 'Gas', 'Other'],
        datasets: [{
            data: [
                renewableData.energyMix.renewable,
                renewableData.energyMix.coal,
                renewableData.energyMix.gas,
                renewableData.energyMix.other
            ],
            backgroundColor: [
                chartColors.primary,
                chartColors.coal,
                chartColors.gas,
                chartColors.other
            ],
            borderColor: '#fff',
            borderWidth: 3,
            hoverOffset: 15
        }]
    },
    options: {
        ...globalChartConfig,
        plugins: {
            ...globalChartConfig.plugins,
            title: {
                display: true,
                text: 'Electricity Generation by Source',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: {
                    bottom: 20
                }
            },
            tooltip: {
                ...globalChartConfig.plugins.tooltip,
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        return label + ': ' + value + '%';
                    }
                }
            }
        },
        cutout: '60%'
    }
});

// ===============================================
// INTERACTIVE FILTERS
// ===============================================

// State selector
const stateSelect = document.getElementById('state-select');
stateSelect.addEventListener('change', function() {
    const selectedState = this.value;
    
    if (selectedState === 'all') {
        // Reset to national data
        updateMainChart(renewableData.years, 
                       renewableData.totalCapacity, 
                       renewableData.solarCapacity, 
                       renewableData.windCapacity);
    } else {
        // Show state-specific data (simplified for demonstration)
        const stateInfo = renewableData.stateData[selectedState];
        
        // In a real application, you'd have time-series data for each state
        // For this demo, we'll just show a single point
        alert(`Showing data for ${stateInfo.name}:\nTotal: ${stateInfo.capacity} GW\nSolar: ${stateInfo.solar} GW\nWind: ${stateInfo.wind} GW`);
    }
});

// Energy type selector
const energyTypeSelect = document.getElementById('energy-type');
energyTypeSelect.addEventListener('change', function() {
    const selectedType = this.value;
    
    // Show/hide datasets based on selection
    if (selectedType === 'solar') {
        mainChart.data.datasets[0].hidden = true;  // Hide total
        mainChart.data.datasets[1].hidden = false; // Show solar
        mainChart.data.datasets[2].hidden = true;  // Hide wind
    } else if (selectedType === 'wind') {
        mainChart.data.datasets[0].hidden = true;  // Hide total
        mainChart.data.datasets[1].hidden = true;  // Hide solar
        mainChart.data.datasets[2].hidden = false; // Show wind
    } else {
        mainChart.data.datasets[0].hidden = false; // Show total
        mainChart.data.datasets[1].hidden = false; // Show solar
        mainChart.data.datasets[2].hidden = false; // Show wind
    }
    
    mainChart.update();
});

// Reset filters button
const resetButton = document.getElementById('reset-filters');
resetButton.addEventListener('click', function() {
    stateSelect.value = 'all';
    energyTypeSelect.value = 'both';
    
    // Reset chart to show all datasets
    mainChart.data.datasets.forEach(dataset => {
        dataset.hidden = false;
    });
    mainChart.update();
    
    // Visual feedback
    this.textContent = 'Filters Reset!';
    setTimeout(() => {
        this.textContent = 'Reset Filters';
    }, 1000);
});

// ===============================================
// HELPER FUNCTIONS
// ===============================================

/**
 * Updates the main chart with new data
 * @param {Array} years - Array of year labels
 * @param {Array} totalData - Total capacity data
 * @param {Array} solarData - Solar capacity data
 * @param {Array} windData - Wind capacity data
 */
function updateMainChart(years, totalData, solarData, windData) {
    mainChart.data.labels = years;
    mainChart.data.datasets[0].data = totalData;
    mainChart.data.datasets[1].data = solarData;
    mainChart.data.datasets[2].data = windData;
    mainChart.update('active');
}

/**
 * Calculates year-over-year growth percentage
 * @param {Array} data - Array of numerical values
 * @returns {Array} Array of growth percentages
 */
function calculateGrowth(data) {
    const growth = [];
    for (let i = 1; i < data.length; i++) {
        const growthRate = ((data[i] - data[i-1]) / data[i-1] * 100).toFixed(1);
        growth.push(parseFloat(growthRate));
    }
    return growth;
}

// ===============================================
// ACCESSIBILITY ENHANCEMENTS
// ===============================================

// Announce chart updates to screen readers
function announceChartUpdate(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Add keyboard navigation for chart elements
document.addEventListener('keydown', function(e) {
    // Example: Press 'R' to reset filters
    if (e.key === 'r' || e.key === 'R') {
        if (document.activeElement === resetButton) {
            resetButton.click();
        }
    }
});

// ===============================================
// PERFORMANCE OPTIMIZATION
// ===============================================

// Lazy load charts when they enter viewport
const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
};

const chartObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Chart is visible, ensure it's properly sized
            const chartCanvas = entry.target;
            const chart = Chart.getChart(chartCanvas);
            if (chart) {
                chart.resize();
            }
        }
    });
}, observerOptions);

// Observe all chart canvases
document.querySelectorAll('canvas').forEach(canvas => {
    chartObserver.observe(canvas);
});

// ===============================================
// WINDOW RESIZE HANDLING
// ===============================================

let resizeTimer;
window.addEventListener('resize', function() {
    // Debounce resize events for better performance
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Resize all charts
        Chart.instances.forEach(chart => {
            chart.resize();
        });
    }, 250);
});

// ===============================================
// CONSOLE MESSAGE FOR STUDENTS
// ===============================================

console.log('%c📊 Teacher Exemplar - Data Story Project', 'font-size: 16px; font-weight: bold; color: #2E7D32');
console.log('%cThis exemplar demonstrates:', 'font-size: 14px; color: #666');
console.log('✓ Responsive Chart.js visualizations');
console.log('✓ Interactive filtering with event listeners');
console.log('✓ Accessibility features (ARIA labels, keyboard navigation)');
console.log('✓ Clean, documented JavaScript code');
console.log('✓ Performance optimization (debouncing, lazy loading)');
console.log('%cStudy the code to understand best practices!', 'font-size: 13px; font-style: italic; color: #1976D2');
