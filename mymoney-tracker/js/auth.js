// auth.js

// Show signup form
function showSignup() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

// Show login form
function showLogin() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// Sign up new user
function signup() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const name = document.getElementById('signup-name').value;
    
    if (!email || !password || !name) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Update profile with name
            userCredential.user.updateProfile({
                displayName: name
            });
            showMessage('Account created! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        })
        .catch((error) => {
            showMessage(error.message, 'error');
        });
}

// Login existing user
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showMessage('Please enter email and password', 'error');
        return;
    }
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            showMessage('Login successful!', 'success');
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            showMessage(error.message, 'error');
        });
}

// Show message to user
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.style.color = type === 'error' ? 'red' : 'green';
    messageDiv.style.padding = '10px';
}

// Logout
function logout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
}

// Check if user is logged in
auth.onAuthStateChanged((user) => {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!user && currentPage !== 'index.html' && currentPage !== '') {
        // Not logged in, redirect to login
        window.location.href = 'index.html';
    } else if (user && (currentPage === 'index.html' || currentPage === '')) {
        // Already logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
});