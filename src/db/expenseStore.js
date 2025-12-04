import { getDB } from './database.js';

// Create a new expense
export async function addExpense(expense) {
    const db = getDB();
    const id = await db.add('expenses', {
        ...expense,
        createdAt: new Date().toISOString()
    });
    return id;
}

// Get all expenses
export async function getAllExpenses() {
    const db = getDB();
    return await db.getAll('expenses');
}

// Get expense by ID
export async function getExpenseById(id) {
    const db = getDB();
    return await db.get('expenses', id);
}

// Update expense
export async function updateExpense(id, updates) {
    const db = getDB();
    const expense = await db.get('expenses', id);
    if (!expense) {
        throw new Error('Expense not found');
    }

    const updatedExpense = {
        ...expense,
        ...updates,
        updatedAt: new Date().toISOString()
    };

    await db.put('expenses', updatedExpense);
    return updatedExpense;
}

// Delete expense
export async function deleteExpense(id) {
    const db = getDB();
    await db.delete('expenses', id);
}

// Delete all expenses
export async function deleteAllExpenses() {
    const db = getDB();
    const tx = db.transaction('expenses', 'readwrite');
    await tx.objectStore('expenses').clear();
    await tx.done;
}

// Get expenses by date range
export async function getExpensesByDateRange(startDate, endDate) {
    const db = getDB();
    const allExpenses = await db.getAll('expenses');

    return allExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= endDate;
    });
}

// Get expenses by category
export async function getExpensesByCategory(category) {
    const db = getDB();
    return await db.getAllFromIndex('expenses', 'category', category);
}

// Get total by date range
export async function getTotalByDateRange(startDate, endDate) {
    const expenses = await getExpensesByDateRange(startDate, endDate);
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
}

// Get category breakdown
export async function getCategoryBreakdown(startDate = null, endDate = null) {
    const db = getDB();
    let expenses;

    if (startDate && endDate) {
        expenses = await getExpensesByDateRange(startDate, endDate);
    } else {
        expenses = await db.getAll('expenses');
    }

    const breakdown = {};
    expenses.forEach(expense => {
        const category = expense.category;
        if (!breakdown[category]) {
            breakdown[category] = 0;
        }
        breakdown[category] += parseFloat(expense.amount);
    });

    return breakdown;
}

// Get daily totals for trend chart
export async function getDailyTotals(days = 30) {
    const db = getDB();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const expenses = await getExpensesByDateRange(startDate, endDate);

    const dailyTotals = {};
    expenses.forEach(expense => {
        const date = expense.date;
        if (!dailyTotals[date]) {
            dailyTotals[date] = 0;
        }
        dailyTotals[date] += parseFloat(expense.amount);
    });

    return dailyTotals;
}

// Export expenses to CSV
export async function exportToCSV() {
    const expenses = await getAllExpenses();

    if (expenses.length === 0) {
        return null;
    }

    // CSV header
    let csv = 'Date,Category,Amount,Note\n';

    // CSV rows
    expenses.forEach(expense => {
        const row = [
            expense.date,
            expense.category,
            expense.amount,
            expense.note ? `"${expense.note.replace(/"/g, '""')}"` : ''
        ].join(',');
        csv += row + '\n';
    });

    return csv;
}

// Get top spending category
export async function getTopCategory(startDate = null, endDate = null) {
    const breakdown = await getCategoryBreakdown(startDate, endDate);

    if (Object.keys(breakdown).length === 0) {
        return null;
    }

    let topCategory = null;
    let maxAmount = 0;

    for (const [category, amount] of Object.entries(breakdown)) {
        if (amount > maxAmount) {
            maxAmount = amount;
            topCategory = category;
        }
    }

    return topCategory;
}
