import './styles/main.css';
import { initDB } from './db/database.js';
import {
  addExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  deleteAllExpenses,
  getExpensesByDateRange,
  getTotalByDateRange,
  getCategoryBreakdown,
  getDailyTotals,
  exportToCSV,
  getTopCategory
} from './db/expenseStore.js';
import { initTheme, toggleTheme } from './utils/theme.js';
import { getCategoryEmoji, detectCategory } from './utils/categories.js';
import { formatCurrency, formatDate, getTodayDate, getDateRange, downloadCSV, validateExpense } from './utils/helpers.js';
import { createPieChart, updatePieChart } from './charts/pieChart.js';
import { createTrendChart, updateTrendChart } from './charts/trendChart.js';

// State
let currentFilter = 'all';
let currentCategoryFilter = 'all';
let editingExpenseId = null;

// Initialize app
async function init() {
  try {
    // Initialize database
    await initDB();

    // Initialize theme
    initTheme();

    // Set default date to today
    document.getElementById('date').value = getTodayDate();

    // Setup event listeners
    setupEventListeners();

    // Load and display data
    await refreshData();

    console.log('✅ Spend Analyzer initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing app:', error);
    alert('Failed to initialize app. Please refresh the page.');
  }
}

// Setup event listeners
function setupEventListeners() {
  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', () => {
    toggleTheme();
  });

  // Expense form
  const form = document.getElementById('expenseForm');
  form.addEventListener('submit', handleFormSubmit);

  // Cancel button
  document.getElementById('cancelBtn').addEventListener('click', resetForm);

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.filter;
      refreshData();
    });
  });

  // Category filter
  document.getElementById('categoryFilter').addEventListener('change', (e) => {
    currentCategoryFilter = e.target.value;
    refreshData();
  });

  // Export button
  document.getElementById('exportBtn').addEventListener('click', handleExport);

  // Reset button
  document.getElementById('resetBtn').addEventListener('click', handleReset);

  // Auto-detect category from note
  document.getElementById('note').addEventListener('input', (e) => {
    const note = e.target.value;
    const detectedCategory = detectCategory(note);
    if (detectedCategory && !editingExpenseId) {
      document.getElementById('category').value = detectedCategory;
    }
  });
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const expense = {
    amount: parseFloat(formData.get('amount')),
    category: formData.get('category'),
    date: formData.get('date'),
    note: formData.get('note') || ''
  };

  // Validate
  const validation = validateExpense(expense);
  if (!validation.isValid) {
    alert(validation.errors.join('\n'));
    return;
  }

  try {
    if (editingExpenseId) {
      // Update existing expense
      await updateExpense(editingExpenseId, expense);
      editingExpenseId = null;
    } else {
      // Add new expense
      await addExpense(expense);
    }

    // Reset form and refresh
    resetForm();
    await refreshData();
  } catch (error) {
    console.error('Error saving expense:', error);
    alert('Failed to save expense. Please try again.');
  }
}

// Reset form
function resetForm() {
  document.getElementById('expenseForm').reset();
  document.getElementById('date').value = getTodayDate();
  document.getElementById('submitBtn').querySelector('span').textContent = 'Add Expense';
  document.getElementById('cancelBtn').style.display = 'none';
  editingExpenseId = null;
}

// Edit expense
function editExpense(id, expense) {
  editingExpenseId = id;

  document.getElementById('amount').value = expense.amount;
  document.getElementById('category').value = expense.category;
  document.getElementById('date').value = expense.date;
  document.getElementById('note').value = expense.note || '';

  document.getElementById('submitBtn').querySelector('span').textContent = 'Update Expense';
  document.getElementById('cancelBtn').style.display = 'inline-flex';

  // Scroll to form
  document.getElementById('expenseForm').scrollIntoView({ behavior: 'smooth' });
}

// Delete expense
async function handleDeleteExpense(id) {
  if (!confirm('Are you sure you want to delete this expense?')) {
    return;
  }

  try {
    await deleteExpense(id);
    await refreshData();
  } catch (error) {
    console.error('Error deleting expense:', error);
    alert('Failed to delete expense. Please try again.');
  }
}

// Export to CSV
async function handleExport() {
  try {
    const csv = await exportToCSV();
    if (!csv) {
      alert('No expenses to export');
      return;
    }

    const filename = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
  } catch (error) {
    console.error('Error exporting data:', error);
    alert('Failed to export data. Please try again.');
  }
}

// Reset all data
async function handleReset() {
  if (!confirm('⚠️ This will delete ALL your expenses. This action cannot be undone. Are you sure?')) {
    return;
  }

  if (!confirm('Really delete everything? This is your last chance!')) {
    return;
  }

  try {
    await deleteAllExpenses();
    await refreshData();
    alert('All data has been deleted.');
  } catch (error) {
    console.error('Error resetting data:', error);
    alert('Failed to reset data. Please try again.');
  }
}

// Refresh all data and UI
async function refreshData() {
  try {
    // Get date range based on filter
    const { startDate, endDate } = getDateRange(currentFilter);

    // Get expenses
    let expenses = await getExpensesByDateRange(startDate, endDate);

    // Apply category filter
    if (currentCategoryFilter !== 'all') {
      expenses = expenses.filter(e => e.category === currentCategoryFilter);
    }

    // Update summary cards
    await updateSummaryCards();

    // Update charts
    await updateCharts();

    // Update expense list
    renderExpenseList(expenses);

  } catch (error) {
    console.error('Error refreshing data:', error);
  }
}

// Update summary cards
async function updateSummaryCards() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);

  const monthStart = new Date(today);
  monthStart.setMonth(today.getMonth() - 1);

  // Get totals
  const todayTotal = await getTotalByDateRange(today, todayEnd);
  const weekTotal = await getTotalByDateRange(weekStart, todayEnd);
  const monthTotal = await getTotalByDateRange(monthStart, todayEnd);
  const topCat = await getTopCategory(monthStart, todayEnd);

  // Update UI
  document.getElementById('todayTotal').textContent = formatCurrency(todayTotal);
  document.getElementById('weekTotal').textContent = formatCurrency(weekTotal);
  document.getElementById('monthTotal').textContent = formatCurrency(monthTotal);
  document.getElementById('topCategory').textContent = topCat ? `${getCategoryEmoji(topCat)} ${topCat}` : '-';
}

// Update charts
async function updateCharts() {
  const { startDate, endDate } = getDateRange(currentFilter);

  // Get category breakdown
  const breakdown = await getCategoryBreakdown(startDate, endDate);

  // Apply category filter to breakdown
  let filteredBreakdown = breakdown;
  if (currentCategoryFilter !== 'all') {
    filteredBreakdown = {};
    if (breakdown[currentCategoryFilter]) {
      filteredBreakdown[currentCategoryFilter] = breakdown[currentCategoryFilter];
    }
  }

  // Update pie chart
  createPieChart('pieChart', filteredBreakdown);

  // Get daily totals
  const dailyTotals = await getDailyTotals(30);

  // Update trend chart
  createTrendChart('trendChart', dailyTotals, 'line');
}

// Render expense list
function renderExpenseList(expenses) {
  const listContainer = document.getElementById('expenseList');
  const emptyState = document.getElementById('emptyState');

  if (expenses.length === 0) {
    listContainer.innerHTML = '';
    emptyState.classList.add('show');
    return;
  }

  emptyState.classList.remove('show');

  // Sort by date (newest first)
  expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

  listContainer.innerHTML = expenses.map(expense => `
    <div class="expense-item">
      <div class="expense-info">
        <div class="expense-header">
          <span class="expense-category">${getCategoryEmoji(expense.category)}</span>
          <span class="expense-amount">${formatCurrency(expense.amount)}</span>
        </div>
        ${expense.note ? `<div class="expense-note">${expense.note}</div>` : ''}
        <div class="expense-date">${formatDate(expense.date)}</div>
      </div>
      <div class="expense-actions">
        <button class="icon-btn" onclick="window.editExpense(${expense.id}, ${JSON.stringify(expense).replace(/"/g, '&quot;')})" title="Edit">
          ✏️
        </button>
        <button class="icon-btn" onclick="window.deleteExpense(${expense.id})" title="Delete">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

// Expose functions to window for inline event handlers
window.editExpense = (id, expense) => editExpense(id, expense);
window.deleteExpense = (id) => handleDeleteExpense(id);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker registered:', registration);
      })
      .catch(error => {
        console.log('❌ Service Worker registration failed:', error);
      });
  });
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
