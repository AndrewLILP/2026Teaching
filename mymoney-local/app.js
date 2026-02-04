// app.js - MyMoney Tracker Local Storage Version
// ================================================
// This file handles ALL the functionality for the app
// It stores data in the browser's localStorage instead of Firebase

// ============================================
// TEACHING NOTE: GLOBAL VARIABLES
// ============================================
// These variables are accessible throughout the entire file
// They store the current state of the application

let currentUser = null;              // Stores the name of who is currently using the app
let currentChart = null;             // Stores reference to the Chart.js chart (so we can update it)
let allUsers = [];                   // Array of all user names (e.g., ["Mum", "Dad", "Sarah"])

// ============================================
// TEACHING NOTE: WHAT IS localStorage?
// ============================================
// localStorage is a feature built into web browsers that lets us save data
// Think of it like a filing cabinet in the browser
// - Data stays even after you close the browser
// - Each website gets its own storage space
// - We save data using KEY-VALUE pairs (like a dictionary)
//
// Example:
//   localStorage.setItem('name', 'Sarah');  // SAVE
//   localStorage.getItem('name');            // GET (returns 'Sarah')
//   localStorage.removeItem('name');         // DELETE

// ============================================
// WHEN THE PAGE LOADS
// ============================================
// This code runs automatically when index.html loads
window.onload = function() {
    console.log('App starting...');  // TEACHING NOTE: console.log helps us debug
    loadUserList();                   // Load all existing users and show them
};

// ============================================
// FUNCTION: Load all users
// ============================================
// TEACHING NOTE: This function runs when the app starts
// It checks localStorage for existing users and displays them
function loadUserList() {
    // STEP 1: Get the list of users from localStorage
    // TEACHING NOTE: We store the list as a JSON string, so we need to parse it back to an array
    const storedUsers = localStorage.getItem('mymoney_users');
    
    if (storedUsers) {
        // TEACHING NOTE: JSON.parse converts a string back into JavaScript data
        // Example: '["Mum","Dad"]' becomes an array ["Mum", "Dad"]
        allUsers = JSON.parse(storedUsers);
    } else {
        // If no users exist yet, start with an empty array
        allUsers = [];
    }
    
    console.log('Loaded users:', allUsers);
    
    // STEP 2: Display the users on screen
    displayUserButtons();
}

// ============================================
// FUNCTION: Display user selection buttons
// ============================================
// TEACHING NOTE: This function creates a button for each user
// It uses DOM manipulation to add HTML elements dynamically
function displayUserButtons() {
    // STEP 1: Find the div where we'll put the buttons
    // TEACHING NOTE: getElementById finds an element by its ID attribute
    const userListDiv = document.getElementById('user-list');
    
    // STEP 2: Clear any existing content
    userListDiv.innerHTML = '';
    
    // STEP 3: Check if there are any users
    if (allUsers.length === 0) {
        userListDiv.innerHTML = '<p class="no-users">No profiles yet. Create one below!</p>';
        return;  // Exit the function early
    }
    
    // STEP 4: Create a button for each user
    // TEACHING NOTE: forEach is a loop that runs once for each item in the array
    allUsers.forEach(function(username) {
        // Create a new button element
        const button = document.createElement('button');
        button.className = 'user-button';
        button.textContent = username;
        
        // TEACHING NOTE: onclick tells the button what to do when clicked
        // We use an arrow function here to pass the username
        button.onclick = function() {
            selectUser(username);
        };
        
        // Add the button to the page
        userListDiv.appendChild(button);
    });
}

// ============================================
// FUNCTION: Create a new user
// ============================================
// TEACHING NOTE: This runs when someone types a name and clicks "Create Profile"
function createNewUser() {
    // STEP 1: Get the text from the input field
    const input = document.getElementById('new-username');
    const username = input.value.trim();  // trim() removes spaces from start/end
    
    // STEP 2: Validation - check if the name is valid
    if (username === '') {
        alert('Please enter a name!');
        return;  // Stop the function if name is empty
    }
    
    // STEP 3: Check if this user already exists
    // TEACHING NOTE: includes() checks if an array contains a value
    if (allUsers.includes(username)) {
        alert('This profile already exists!');
        return;
    }
    
    // STEP 4: Add the new user to our array
    allUsers.push(username);
    
    // STEP 5: Save the updated user list to localStorage
    // TEACHING NOTE: JSON.stringify converts JavaScript data to a string
    // Example: ["Mum", "Dad"] becomes '["Mum","Dad"]'
    localStorage.setItem('mymoney_users', JSON.stringify(allUsers));
    
    console.log('Created new user:', username);
    
    // STEP 6: Clear the input field and refresh the display
    input.value = '';
    displayUserButtons();
    
    // STEP 7: Automatically select the new user
    selectUser(username);
}

// ============================================
// FUNCTION: Select a user (log in)
// ============================================
// TEACHING NOTE: This runs when someone clicks on a user button
function selectUser(username) {
    console.log('User selected:', username);
    
    // STEP 1: Save who is currently using the app
    currentUser = username;
    
    // STEP 2: Hide the user selection screen
    document.getElementById('user-selection-screen').style.display = 'none';
    
    // STEP 3: Show the main app
    document.getElementById('main-app').style.display = 'block';
    
    // STEP 4: Display the username in the navbar
    document.getElementById('current-user-display').textContent = 'Hello, ' + username;
    
    // STEP 5: Load this user's data and display it
    loadDashboard();
}

// ============================================
// FUNCTION: Switch user (log out)
// ============================================
// TEACHING NOTE: This lets you go back to the user selection screen
function switchUser() {
    // STEP 1: Clear the current user
    currentUser = null;
    
    // STEP 2: Hide the main app
    document.getElementById('main-app').style.display = 'none';
    
    // STEP 3: Show the user selection screen
    document.getElementById('user-selection-screen').style.display = 'block';
    
    // STEP 4: Destroy the chart if it exists
    // TEACHING NOTE: This prevents memory leaks
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }
}

// ============================================
// FUNCTION: Load dashboard data
// ============================================
// TEACHING NOTE: This function loads all the data for the current user
// It runs when a user logs in
function loadDashboard() {
    console.log('Loading dashboard for:', currentUser);
    
    // STEP 1: Set today's date as default in the forms
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('income-date').value = today;
    document.getElementById('expense-date').value = today;
    
    // STEP 2: Calculate and display the monthly totals
    calculateMonthlyTotals();
    
    // STEP 3: Load and display the spending chart
    loadChart();
    
    // STEP 4: Show recent transactions
    displayRecentTransactions();
}

// ============================================
// FUNCTION: Get user's data from localStorage
// ============================================
// TEACHING NOTE: Each user's data is stored under a unique key
// Key format: 'mymoney_data_USERNAME'
// Example: 'mymoney_data_Sarah'
function getUserData() {
    // STEP 1: Create the storage key for this user
    const storageKey = 'mymoney_data_' + currentUser;
    
    // STEP 2: Get the data from localStorage
    const dataString = localStorage.getItem(storageKey);
    
    // STEP 3: If data exists, parse it. Otherwise return empty array
    if (dataString) {
        return JSON.parse(dataString);
    } else {
        return [];  // New user has no transactions yet
    }
}

// ============================================
// FUNCTION: Save user's data to localStorage
// ============================================
// TEACHING NOTE: This function overwrites the user's data in localStorage
function saveUserData(transactions) {
    const storageKey = 'mymoney_data_' + currentUser;
    
    // TEACHING NOTE: We save the entire array of transactions
    localStorage.setItem(storageKey, JSON.stringify(transactions));
    
    console.log('Saved data for', currentUser);
}

// ============================================
// FUNCTION: Add income
// ============================================
// TEACHING NOTE: This runs when someone clicks "Add Income" in the modal
function addIncome() {
    // STEP 1: Get values from the form inputs
    const amount = parseFloat(document.getElementById('income-amount').value);
    const description = document.getElementById('income-description').value;
    const date = document.getElementById('income-date').value;
    
    // STEP 2: Validation - check if data is valid
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (!description) {
        alert('Please enter a description');
        return;
    }
    
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    // STEP 3: Create a transaction object
    // TEACHING NOTE: An object stores related data together
    const transaction = {
        type: 'income',
        amount: amount,
        description: description,
        date: date,
        timestamp: Date.now()  // Current time in milliseconds (for sorting)
    };
    
    console.log('Adding income:', transaction);
    
    // STEP 4: Get existing transactions
    const transactions = getUserData();
    
    // STEP 5: Add the new transaction to the array
    transactions.push(transaction);
    
    // STEP 6: Save back to localStorage
    saveUserData(transactions);
    
    // STEP 7: Clear the form
    document.getElementById('income-amount').value = '';
    document.getElementById('income-description').value = '';
    
    // STEP 8: Close the modal
    closeModal('income-modal');
    
    // STEP 9: Refresh the dashboard to show the new income
    loadDashboard();
}

// ============================================
// FUNCTION: Add expense
// ============================================
// TEACHING NOTE: Similar to addIncome but with more fields
function addExpense() {
    // STEP 1: Get values from form
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const description = document.getElementById('expense-description').value;
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;
    const taxDeductible = document.getElementById('tax-deductible').checked;
    const receiptLocation = document.getElementById('receipt-location').value;
    
    // STEP 2: Validation
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
    
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    // STEP 3: Create transaction object
    const transaction = {
        type: 'expense',
        amount: amount,
        description: description,
        category: category,
        date: date,
        taxDeductible: taxDeductible,
        timestamp: Date.now()
    };
    
    // TEACHING NOTE: Only add receipt location if tax deductible
    if (taxDeductible && receiptLocation) {
        transaction.receiptLocation = receiptLocation;
    }
    
    console.log('Adding expense:', transaction);
    
    // STEP 4: Save to localStorage
    const transactions = getUserData();
    transactions.push(transaction);
    saveUserData(transactions);
    
    // STEP 5: Clear form
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-description').value = '';
    document.getElementById('expense-category').value = '';
    document.getElementById('tax-deductible').checked = false;
    document.getElementById('receipt-location').value = '';
    document.getElementById('receipt-section').style.display = 'none';
    
    // STEP 6: Close modal and refresh
    closeModal('expense-modal');
    loadDashboard();
}

// ============================================
// FUNCTION: Calculate monthly totals
// ============================================
// TEACHING NOTE: This calculates income, expenses, and balance for the current month
function calculateMonthlyTotals() {
    // STEP 1: Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth();  // 0-11 (January = 0)
    const currentYear = now.getFullYear();
    
    // STEP 2: Initialize counters
    let totalIncome = 0;
    let totalExpenses = 0;
    
    // STEP 3: Get all transactions for this user
    const transactions = getUserData();
    
    // STEP 4: Loop through transactions and add up totals
    // TEACHING NOTE: We only count transactions from the current month
    transactions.forEach(function(transaction) {
        // Parse the date string into a Date object
        const transactionDate = new Date(transaction.date);
        
        // Check if this transaction is from the current month
        if (transactionDate.getMonth() === currentMonth && 
            transactionDate.getFullYear() === currentYear) {
            
            // Add to the appropriate total
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else if (transaction.type === 'expense') {
                totalExpenses += transaction.amount;
            }
        }
    });
    
    // STEP 5: Calculate balance
    const balance = totalIncome - totalExpenses;
    
    // STEP 6: Display the totals on screen
    // TEACHING NOTE: toFixed(2) formats numbers to 2 decimal places (e.g., 45.5 becomes 45.50)
    document.getElementById('total-income').textContent = '$' + totalIncome.toFixed(2);
    document.getElementById('total-expenses').textContent = '$' + totalExpenses.toFixed(2);
    document.getElementById('balance').textContent = '$' + balance.toFixed(2);
    
    console.log('Monthly totals - Income:', totalIncome, 'Expenses:', totalExpenses, 'Balance:', balance);
}

// ============================================
// FUNCTION: Load chart
// ============================================
// TEACHING NOTE: This creates a pie chart showing spending by category
function loadChart() {
    // STEP 1: Define all possible categories
    const categories = [
        'Food & Drinks',
        'Transport',
        'Entertainment',
        'Clothes & Shoes',
        'Work Expenses',
        'Savings',
        'Other'
    ];
    
    // STEP 2: Create an object to store totals for each category
    // TEACHING NOTE: This creates {category: 0} for each category
    const categoryTotals = {};
    categories.forEach(function(cat) {
        categoryTotals[cat] = 0;
    });
    
    // STEP 3: Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // STEP 4: Get all transactions and calculate category totals
    const transactions = getUserData();
    
    transactions.forEach(function(transaction) {
        // Only count expenses from this month
        if (transaction.type === 'expense') {
            const transactionDate = new Date(transaction.date);
            
            if (transactionDate.getMonth() === currentMonth && 
                transactionDate.getFullYear() === currentYear) {
                
                // Add to the category total
                categoryTotals[transaction.category] += transaction.amount;
            }
        }
    });
    
    console.log('Category totals:', categoryTotals);
    
    // STEP 5: Destroy old chart if it exists
    // TEACHING NOTE: We must destroy the old chart before creating a new one
    if (currentChart) {
        currentChart.destroy();
    }
    
    // STEP 6: Create the chart
    // TEACHING NOTE: Chart.js needs a <canvas> element to draw on
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    currentChart = new Chart(ctx, {
        type: 'pie',  // Other options: 'bar', 'line', 'doughnut'
        data: {
            labels: categories,  // Labels for each slice
            datasets: [{
                // TEACHING NOTE: Object.values() converts an object to an array of its values
                data: Object.values(categoryTotals),
                backgroundColor: [
                    '#FF6384',  // Red-pink
                    '#36A2EB',  // Blue
                    '#FFCE56',  // Yellow
                    '#4BC0C0',  // Teal
                    '#9966FF',  // Purple
                    '#FF9F40',  // Orange
                    '#C9CBCF'   // Grey
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
}

// ============================================
// FUNCTION: Display recent transactions
// ============================================
// TEACHING NOTE: Shows the last 10 transactions
function displayRecentTransactions() {
    const transactionsDiv = document.getElementById('recent-transactions-list');
    
    // STEP 1: Get all transactions
    const transactions = getUserData();
    
    // STEP 2: Check if there are any transactions
    if (transactions.length === 0) {
        transactionsDiv.innerHTML = '<p class="no-data">No transactions yet. Add some above!</p>';
        return;
    }
    
    // STEP 3: Sort by timestamp (newest first)
    // TEACHING NOTE: sort() rearranges the array
    const sorted = transactions.sort(function(a, b) {
        return b.timestamp - a.timestamp;  // Descending order
    });
    
    // STEP 4: Take only the first 10
    const recent = sorted.slice(0, 10);
    
    // STEP 5: Clear existing content
    transactionsDiv.innerHTML = '';
    
    // STEP 6: Create HTML for each transaction
    recent.forEach(function(transaction) {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        
        // Determine sign and color class
        const sign = transaction.type === 'income' ? '+' : '-';
        const amountClass = transaction.type === 'income' ? 'income' : 'expense';
        
        // Build the HTML
        item.innerHTML = `
            <div class="transaction-details">
                <strong>${transaction.description}</strong><br>
                <small>${transaction.date} | ${transaction.category || 'Income'}</small>
            </div>
            <div class="transaction-amount ${amountClass}">
                ${sign}$${transaction.amount.toFixed(2)}
            </div>
        `;
        
        transactionsDiv.appendChild(item);
    });
}

// ============================================
// MODAL FUNCTIONS
// ============================================
// TEACHING NOTE: Modals are popup windows that appear over the main content

function showAddIncome() {
    document.getElementById('income-modal').style.display = 'flex';
}

function showAddExpense() {
    document.getElementById('expense-modal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// ============================================
// TAX DEDUCTIBLE CHECKBOX
// ============================================
// TEACHING NOTE: This shows/hides the receipt location field
document.addEventListener('DOMContentLoaded', function() {
    const taxCheckbox = document.getElementById('tax-deductible');
    
    if (taxCheckbox) {
        taxCheckbox.addEventListener('change', function() {
            const receiptSection = document.getElementById('receipt-section');
            
            if (this.checked) {
                receiptSection.style.display = 'block';
            } else {
                receiptSection.style.display = 'none';
            }
        });
    }
});

// ============================================
// TEACHING NOTE: DATA STRUCTURE SUMMARY
// ============================================
// 
// localStorage structure:
// ----------------------
// 'mymoney_users' = '["Mum", "Dad", "Sarah"]'
// 'mymoney_data_Mum' = '[{transaction1}, {transaction2}, ...]'
// 'mymoney_data_Dad' = '[{transaction1}, {transaction2}, ...]'
// 'mymoney_data_Sarah' = '[{transaction1}, {transaction2}, ...]'
//
// Each transaction object looks like:
// {
//     type: 'income' or 'expense',
//     amount: 150.50,
//     description: 'Woolworths pay',
//     date: '2026-02-04',
//     timestamp: 1738637234567,
//     category: 'Food & Drinks' (only for expenses),
//     taxDeductible: true/false (only for expenses),
//     receiptLocation: 'shoebox' (optional, only if tax deductible)
// }