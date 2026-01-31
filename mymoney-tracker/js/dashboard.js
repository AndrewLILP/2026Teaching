// dashboard.js

let currentUser;

// Check authentication
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        loadDashboard();
    } else {
        window.location.href = 'index.html';
    }
});

// Load dashboard data
function loadDashboard() {
    calculateMonthlyTotals();
    loadChart();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('income-date').value = today;
    document.getElementById('expense-date').value = today;
}

// Calculate monthly totals
function calculateMonthlyTotals() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    let totalIncome = 0;
    let totalExpenses = 0;
    
    db.collection('transactions')
        .where('userId', '==', currentUser.uid)
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const transaction = doc.data();
                const transactionDate = new Date(transaction.date);
                
                // Only count transactions from current month
                if (transactionDate.getMonth() === currentMonth && 
                    transactionDate.getFullYear() === currentYear) {
                    
                    if (transaction.type === 'income') {
                        totalIncome += transaction.amount;
                    } else {
                        totalExpenses += transaction.amount;
                    }
                }
            });
            
            // Update display
            document.getElementById('total-income').textContent = '$' + totalIncome.toFixed(2);
            document.getElementById('total-expenses').textContent = '$' + totalExpenses.toFixed(2);
            document.getElementById('balance').textContent = '$' + (totalIncome - totalExpenses).toFixed(2);
        });
}

// Show add income modal
function showAddIncome() {
    document.getElementById('income-modal').style.display = 'flex';
}

// Show add expense modal
function showAddExpense() {
    document.getElementById('expense-modal').style.display = 'flex';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Add income
function addIncome() {
    const amount = parseFloat(document.getElementById('income-amount').value);
    const description = document.getElementById('income-description').value;
    const date = document.getElementById('income-date').value;
    
    // Validation
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (!description) {
        alert('Please enter a description');
        return;
    }
    
    // Save to Firebase
    db.collection('transactions').add({
        userId: currentUser.uid,
        type: 'income',
        amount: amount,
        description: description,
        date: date,
        timestamp: Date.now()
    })
    .then(() => {
        // Clear form
        document.getElementById('income-amount').value = '';
        document.getElementById('income-description').value = '';
        
        // Close modal and reload
        closeModal('income-modal');
        loadDashboard();
    })
    .catch((error) => {
        alert('Error adding income: ' + error.message);
    });
}

// Add expense
function addExpense() {
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const description = document.getElementById('expense-description').value;
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;
    const taxDeductible = document.getElementById('tax-deductible').checked;
    const receiptLocation = document.getElementById('receipt-location').value;
    
    // Validation
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (!description) {
        alert('Please enter a description');
        return;
    }
    
    if (!category) {
        alert('Please choose a category');
        return;
    }
    
    // Save to Firebase
    const expenseData = {
        userId: currentUser.uid,
        type: 'expense',
        amount: amount,
        description: description,
        category: category,
        date: date,
        taxDeductible: taxDeductible,
        timestamp: Date.now()
    };
    
    // Only add receipt location if tax deductible
    if (taxDeductible) {
        expenseData.receiptLocation = receiptLocation;
    }
    
    db.collection('transactions').add(expenseData)
    .then(() => {
        // Clear form
        document.getElementById('expense-amount').value = '';
        document.getElementById('expense-description').value = '';
        document.getElementById('expense-category').value = '';
        document.getElementById('tax-deductible').checked = false;
        document.getElementById('receipt-location').value = '';
        
        // Close modal and reload
        closeModal('expense-modal');
        loadDashboard();
    })
    .catch((error) => {
        alert('Error adding expense: ' + error.message);
    });
}

// Show receipt location field when tax deductible checked
document.getElementById('tax-deductible').addEventListener('change', function() {
    const receiptSection = document.getElementById('receipt-section');
    if (this.checked) {
        receiptSection.style.display = 'block';
    } else {
        receiptSection.style.display = 'none';
    }
});

// Load chart
function loadChart() {
    const categories = [
        'Food & Drinks',
        'Transport',
        'Entertainment',
        'Clothes & Shoes',
        'Work Expenses',
        'Savings',
        'Other'
    ];
    
    const categoryTotals = {};
    categories.forEach(cat => categoryTotals[cat] = 0);
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    db.collection('transactions')
        .where('userId', '==', currentUser.uid)
        .where('type', '==', 'expense')
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const transaction = doc.data();
                const transactionDate = new Date(transaction.date);
                
                // Only count current month
                if (transactionDate.getMonth() === currentMonth && 
                    transactionDate.getFullYear() === currentYear) {
                    categoryTotals[transaction.category] += transaction.amount;
                }
            });
            
            // Create chart
            const ctx = document.getElementById('categoryChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: categories,
                    datasets: [{
                        data: Object.values(categoryTotals),
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF',
                            '#FF9F40',
                            '#C9CBCF'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        });
}