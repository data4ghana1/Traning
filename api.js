/**
 * Main Application Controller
 */

const App = {
    init() {
        this.setupEventListeners();
        this.loadUserState();
        this.updateCartCount();
    },

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value;
                    window.location.href = `pages/products.html?search=${query}`;
                }
            });
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you for subscribing!');
                newsletterForm.reset();
            });
        }
    },

    loadUserState() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            this.updateUserDisplay(user);
        }
    },

    updateUserDisplay(user) {
        const userBtn = document.getElementById('userBtn');
        if (userBtn && user) {
            userBtn.textContent = `👤 ${user.name || 'Account'}`;
        }
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'pages/login.html';
}