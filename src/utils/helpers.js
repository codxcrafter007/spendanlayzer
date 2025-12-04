// Format currency
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
}

// Format date to readable string
export function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if today
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    }

    // Check if yesterday
    if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }

    // Otherwise return formatted date
    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(date);
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Get date range for filters
export function getDateRange(filter) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    let startDate = new Date(today);

    switch (filter) {
        case 'today':
            // Already set to today
            break;
        case 'week':
            startDate.setDate(today.getDate() - 7);
            break;
        case 'month':
            startDate.setMonth(today.getMonth() - 1);
            break;
        case 'year':
            startDate.setFullYear(today.getFullYear() - 1);
            break;
        default:
            // 'all' - set to very old date
            startDate = new Date('2000-01-01');
    }

    return { startDate, endDate };
}

// Download CSV file
export function downloadCSV(csvContent, filename = 'expenses.csv') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Validate expense data
export function validateExpense(expense) {
    const errors = [];

    if (!expense.amount || parseFloat(expense.amount) <= 0) {
        errors.push('Amount must be greater than 0');
    }

    if (!expense.category) {
        errors.push('Category is required');
    }

    if (!expense.date) {
        errors.push('Date is required');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Debounce function for performance
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
