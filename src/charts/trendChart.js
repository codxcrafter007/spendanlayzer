import {
    Chart,
    LineElement,
    BarElement,
    PointElement,
    LineController,
    BarController,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

Chart.register(
    LineElement,
    BarElement,
    PointElement,
    LineController,
    BarController,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler
);

let trendChartInstance = null;

export function createTrendChart(canvasId, dailyData, type = 'line') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');

    // Destroy existing chart
    if (trendChartInstance) {
        trendChartInstance.destroy();
    }

    // Prepare data - sort by date
    const sortedDates = Object.keys(dailyData).sort();
    const labels = sortedDates.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    });
    const amounts = sortedDates.map(date => dailyData[date]);

    // Check if there's data
    if (labels.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '14px Inter, sans-serif';
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
        ctx.textAlign = 'center';
        ctx.fillText('No data to display', canvas.width / 2, canvas.height / 2);
        return null;
    }

    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');

    trendChartInstance = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Spending',
                data: amounts,
                backgroundColor: type === 'line'
                    ? `${primaryColor}33`
                    : primaryColor,
                borderColor: primaryColor,
                borderWidth: 2,
                fill: type === 'line',
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: primaryColor,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-card'),
                    titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                    bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return `Spent: ₹${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                        font: {
                            family: 'Inter, sans-serif',
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 0
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
                        drawBorder: false
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                        font: {
                            family: 'Inter, sans-serif',
                            size: 11
                        },
                        callback: function (value) {
                            return '₹' + value;
                        }
                    }
                }
            }
        }
    });

    return trendChartInstance;
}

export function updateTrendChart(dailyData) {
    if (!trendChartInstance) return;

    const sortedDates = Object.keys(dailyData).sort();
    const labels = sortedDates.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    });
    const amounts = sortedDates.map(date => dailyData[date]);

    trendChartInstance.data.labels = labels;
    trendChartInstance.data.datasets[0].data = amounts;
    trendChartInstance.update();
}

export function destroyTrendChart() {
    if (trendChartInstance) {
        trendChartInstance.destroy();
        trendChartInstance = null;
    }
}
