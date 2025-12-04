import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { getCategoryColor } from '../utils/categories.js';

Chart.register(ArcElement, Tooltip, Legend);

let pieChartInstance = null;

export function createPieChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');

    // Destroy existing chart
    if (pieChartInstance) {
        pieChartInstance.destroy();
    }

    // Prepare data
    const categories = Object.keys(data);
    const amounts = Object.values(data);
    const colors = categories.map(cat => getCategoryColor(cat));

    // Check if there's data
    if (categories.length === 0 || amounts.every(amt => amt === 0)) {
        // Show empty state
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '14px Inter, sans-serif';
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
        ctx.textAlign = 'center';
        ctx.fillText('No data to display', canvas.width / 2, canvas.height / 2);
        return null;
    }

    pieChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-card'),
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            family: 'Inter, sans-serif',
                            size: 12
                        },
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-card'),
                    titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                    bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });

    return pieChartInstance;
}

export function updatePieChart(data) {
    if (!pieChartInstance) return;

    const categories = Object.keys(data);
    const amounts = Object.values(data);
    const colors = categories.map(cat => getCategoryColor(cat));

    pieChartInstance.data.labels = categories;
    pieChartInstance.data.datasets[0].data = amounts;
    pieChartInstance.data.datasets[0].backgroundColor = colors;
    pieChartInstance.update();
}

export function destroyPieChart() {
    if (pieChartInstance) {
        pieChartInstance.destroy();
        pieChartInstance = null;
    }
}
