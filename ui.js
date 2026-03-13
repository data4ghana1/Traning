/**
 * Authentication Management
 */

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
}

function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
}

function clearUser() {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
}

function requireLogin(redirectPath = 'pages/login.html') {
    if (!isLoggedIn()) {
        window.location.href = redirectPath;
    }
}