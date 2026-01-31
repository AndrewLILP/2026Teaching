let currentUser;

// Check authentication
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        
        // Load appropriate page data
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'transactions.html') {
            loadTransactions();
        } else if (currentPage === 'tax.html') {
            loadTaxItems();
        }
    } else {
        window.location.href = 'index.html';
    }
});

// Load all transactions
function loadTransactions() {
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = '<p>Loading...</p>';
    
    db.collection('transactions')
        .where('userId', '==', currentUser.uid)
        .orderBy('timestamp', 'desc')
        .get()
        .then((snapshot) => {
            if (snapshot.empty) {
                transactionsList.innerHTML = '<p>No transactions yet. Add some from the dashboard!</p>';
                return;
            }
            
            transactionsList.innerHTML = '';
            
            snapshot.forEach((doc) => {
                const transaction = doc.data();
                const item = document.createElement('div');
                item.className = 'transaction-item';
                
                const sign = transaction.type === 'income' ? '+' : '-';
                const amountClass = transaction.type === 'income' ? 'income' : 'expense';
                
                item.innerHTML = `
                    <div>
                        <strong>${transaction.description}</strong><br>
                        <small>${transaction.date} | ${transaction.category || 'Income'}</small>
                    </div>
                    <div class="${amountClass}">
                        ${sign}$${transaction.amount.toFixed(2)}
                    </div>
                `;
                
                transactionsList.appendChild(item);
            });
        })
        .catch((error) => {
            transactionsList.innerHTML = '<p>Error loading transactions: ' + error.message + '</p>';
        });
}

// Load tax deductible items
function loadTaxItems() {
    const taxItemsList = document.getElementById('tax-items-list');
    taxItemsList.innerHTML = '<p>Loading...</p>';
    
    let totalDeductible = 0;
    
    db.collection('transactions')
        .where('userId', '==', currentUser.uid)
        .where('type', '==', 'expense')
        .where('taxDeductible', '==', true)
        .orderBy('timestamp', 'desc')
        .get()
        .then((snapshot) => {
            if (snapshot.empty) {
                taxItemsList.innerHTML = '<p>No tax deductible expenses yet.</p>';
                document.getElementById('total-deductible').textContent = '$0.00';
                return;
            }
            
            taxItemsList.innerHTML = '';
            
            snapshot.forEach((doc) => {
                const transaction = doc.data();
                totalDeductible += transaction.amount;
                
                const item = document.createElement('div');
                item.className = 'tax-item';
                
                item.innerHTML = `
                    <strong>${transaction.description}</strong><br>
                    <div style="margin: 10px 0;">$${transaction.amount.toFixed(2)}</div>
                    <small>Date: ${transaction.date}</small><br>
                    <small>Category: ${transaction.category}</small><br>
                    ${transaction.receiptLocation ? `<small>📄 Receipt: ${transaction.receiptLocation}</small>` : ''}
                `;
                
                taxItemsList.appendChild(item);
            });
            
            document.getElementById('total-deductible').textContent = '$' + totalDeductible.toFixed(2);
        })
        .catch((error) => {
            taxItemsList.innerHTML = '<p>Error loading tax items: ' + error.message + '</p>';
        });
}

// Logout function
function logout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
}