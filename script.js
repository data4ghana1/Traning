// ============================================================================
// MODERN APP - COMPLETE JAVASCRIPT SCRIPT
// ============================================================================

/**
 * Application State Management
 */
const AppState = {
    user: {
        id: null,
        name: 'John Doe',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, USA',
        profession: 'Software Developer',
        avatar: '👤',
        joinDate: '2024-01-15',
        isLoggedIn: false,
        theme: 'dark'
    },
    wallet: {
        balance: 5240.50,
        cardNumber: '4829',
        expiryDate: '12/26',
        cardHolder: 'John Doe',
        currency: 'USD'
    },
    transactions: [
        { id: 1, type: 'income', description: 'Salary Deposit', amount: 2500, date: '2024-03-10', icon: '📥', status: 'completed' },
        { id: 2, type: 'expense', description: 'Grocery Store', amount: 85.50, date: '2024-03-09', icon: '🛒', status: 'completed' },
        { id: 3, type: 'expense', description: 'Gas Station', amount: 45.00, date: '2024-03-08', icon: '⛽', status: 'completed' },
        { id: 4, type: 'income', description: 'Freelance Project', amount: 350, date: '2024-03-07', icon: '💼', status: 'completed' },
        { id: 5, type: 'expense', description: 'Netflix Subscription', amount: 15.99, date: '2024-03-05', icon: '🎬', status: 'completed' }
    ],
    settings: {
        twoFactorAuth: true,
        emailNotifications: true,
        pushNotifications: false,
        autoSave: true,
        language: 'en',
        theme: 'dark'
    },
    currentSection: 'dashboard'
};

/**
 * ============================================================================
 * STORAGE MANAGEMENT
 * ============================================================================
 */

const Storage = {
    /**
     * Save data to localStorage
     */
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    },

    /**
     * Get data from localStorage
     */
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage error:', error);
            return defaultValue;
        }
    },

    /**
     * Remove data from localStorage
     */
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    },

    /**
     * Clear all localStorage
     */
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    },

    /**
     * Initialize app state from storage
     */
    loadState: () => {
        const savedUser = Storage.get('appUser');
        const savedWallet = Storage.get('appWallet');
        const savedSettings = Storage.get('appSettings');
        const savedTransactions = Storage.get('appTransactions');

        if (savedUser) AppState.user = { ...AppState.user, ...savedUser };
        if (savedWallet) AppState.wallet = { ...AppState.wallet, ...savedWallet };
        if (savedSettings) AppState.settings = { ...AppState.settings, ...savedSettings };
        if (savedTransactions) AppState.transactions = savedTransactions;
    },

    /**
     * Save app state to storage
     */
    saveState: () => {
        Storage.set('appUser', AppState.user);
        Storage.set('appWallet', AppState.wallet);
        Storage.set('appSettings', AppState.settings);
        Storage.set('appTransactions', AppState.transactions);
    }
};

/**
 * ============================================================================
 * AUTHENTICATION MODULE
 * ============================================================================
 */

const Auth = {
    /**
     * Validate email format
     */
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate password strength
     */
    isStrongPassword: (password) => {
        return password.length >= 6;
    },

    /**
     * Login user
     */
    login: (email, password) => {
        if (!Auth.isValidEmail(email)) {
            return { success: false, message: 'Invalid email format' };
        }

        if (!Auth.isStrongPassword(password)) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }

        // Simulate API call (in real app, validate against backend)
        AppState.user.email = email;
        AppState.user.isLoggedIn = true;
        AppState.user.id = Math.random().toString(36).substr(2, 9);

        // Extract name from email
        const namePart = email.split('@')[0].split('.');
        AppState.user.firstName = namePart[0].charAt(0).toUpperCase() + namePart[0].slice(1);
        AppState.user.lastName = namePart[1] ? namePart[1].charAt(0).toUpperCase() + namePart[1].slice(1) : 'User';
        AppState.user.name = `${AppState.user.firstName} ${AppState.user.lastName}`;

        Storage.saveState();
        return { success: true, message: 'Login successful' };
    },

    /**
     * Logout user
     */
    logout: () => {
        AppState.user.isLoggedIn = false;
        Storage.remove('appUser');
        Storage.remove('appWallet');
        Storage.remove('appTransactions');
        return { success: true, message: 'Logged out successfully' };
    },

    /**
     * Check if user is logged in
     */
    isLoggedIn: () => {
        return AppState.user.isLoggedIn;
    },

    /**
     * Get current user
     */
    getCurrentUser: () => {
        return AppState.user;
    }
};

/**
 * ============================================================================
 * WALLET MODULE
 * ============================================================================
 */

const Wallet = {
    /**
     * Get current balance
     */
    getBalance: () => {
        return AppState.wallet.balance;
    },

    /**
     * Add funds to wallet
     */
    addFunds: (amount, description = 'Funds Added') => {
        if (!amount || isNaN(amount) || amount <= 0) {
            return { success: false, message: 'Invalid amount' };
        }

        const numAmount = parseFloat(amount);
        AppState.wallet.balance += numAmount;

        // Add transaction
        Wallet.addTransaction('income', description, numAmount);
        Storage.saveState();

        return { success: true, message: `$${numAmount.toFixed(2)} added successfully`, newBalance: AppState.wallet.balance };
    },

    /**
     * Withdraw funds from wallet
     */
    withdraw: (amount, description = 'Withdrawal') => {
        if (!amount || isNaN(amount) || amount <= 0) {
            return { success: false, message: 'Invalid amount' };
        }

        const numAmount = parseFloat(amount);

        if (numAmount > AppState.wallet.balance) {
            return { success: false, message: 'Insufficient balance' };
        }

        AppState.wallet.balance -= numAmount;

        // Add transaction
        Wallet.addTransaction('expense', description, numAmount);
        Storage.saveState();

        return { success: true, message: `$${numAmount.toFixed(2)} withdrawn successfully`, newBalance: AppState.wallet.balance };
    },

    /**
     * Transfer money to another account
     */
    transfer: (recipientEmail, amount, description = 'Transfer') => {
        if (!recipientEmail || !amount || isNaN(amount) || amount <= 0) {
            return { success: false, message: 'Invalid transfer details' };
        }

        const numAmount = parseFloat(amount);

        if (numAmount > AppState.wallet.balance) {
            return { success: false, message: 'Insufficient balance' };
        }

        AppState.wallet.balance -= numAmount;
        Wallet.addTransaction('expense', `Transfer to ${recipientEmail}`, numAmount);
        Storage.saveState();

        return { success: true, message: `$${numAmount.toFixed(2)} transferred to ${recipientEmail}`, newBalance: AppState.wallet.balance };
    },

    /**
     * Add transaction to history
     */
    addTransaction: (type, description, amount, icon = '💳') => {
        const transaction = {
            id: Date.now(),
            type: type,
            description: description,
            amount: amount,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            icon: icon,
            status: 'completed',
            timestamp: new Date().toISOString()
        };

        AppState.transactions.unshift(transaction);
        return transaction;
    },

    /**
     * Get all transactions
     */
    getTransactions: (limit = null) => {
        return limit ? AppState.transactions.slice(0, limit) : AppState.transactions;
    },

    /**
     * Get formatted balance
     */
    getFormattedBalance: () => {
        return '$' + AppState.wallet.balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Get wallet statistics
     */
    getStats: () => {
        const totalIncome = AppState.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = AppState.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            balance: AppState.wallet.balance,
            totalIncome: totalIncome,
            totalExpense: totalExpense,
            netSavings: totalIncome - totalExpense
        };
    }
};

/**
 * ============================================================================
 * USER PROFILE MODULE
 * ============================================================================
 */

const Profile = {
    /**
     * Get user profile
     */
    getProfile: () => {
        return {
            ...AppState.user,
            initials: AppState.user.firstName.charAt(0) + AppState.user.lastName.charAt(0),
            fullName: `${AppState.user.firstName} ${AppState.user.lastName}`,
            joinedDaysAgo: Profile.calculateDaysAgo(AppState.user.joinDate)
        };
    },

    /**
     * Update user profile
     */
    updateProfile: (updates) => {
        try {
            AppState.user = {
                ...AppState.user,
                ...updates
            };
            Storage.saveState();
            return { success: true, message: 'Profile updated successfully', user: AppState.user };
        } catch (error) {
            return { success: false, message: 'Error updating profile' };
        }
    },

    /**
     * Calculate days since join date
     */
    calculateDaysAgo: (joinDate) => {
        const join = new Date(joinDate);
        const now = new Date();
        const diff = Math.floor((now - join) / (1000 * 60 * 60 * 24));
        return diff;
    },

    /**
     * Get profile statistics
     */
    getStats: () => {
        return {
            transactions: AppState.transactions.length,
            totalSpent: AppState.transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0),
            memberDays: Profile.calculateDaysAgo(AppState.user.joinDate)
        };
    }
};

/**
 * ============================================================================
 * UI MODULE
 * ============================================================================
 */

const UI = {
    /**
     * Show toast notification
     */
    showToast: (message, type = 'success', duration = 3000) => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toast.style.animation = 'slideInUp 0.3s ease-out';

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(50px)';
            toast.style.transition = 'all 0.3s ease';

            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    /**
     * Show loading spinner
     */
    showLoading: (element) => {
        element.innerHTML = '<span class="loading">⌛</span> Loading...';
        element.disabled = true;
    },

    /**
     * Hide loading spinner
     */
    hideLoading: (element, text) => {
        element.innerHTML = text;
        element.disabled = false;
    },

    /**
     * Show modal dialog
     */
    showModal: (title, message, onConfirm, onCancel) => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 3000;
        `;

        modal.innerHTML = `
            <div style="background: var(--card-bg); border-radius: 15px; padding: 30px; max-width: 400px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <h2 style="margin-bottom: 10px; color: var(--text-primary);">${title}</h2>
                <p style="color: var(--text-secondary); margin-bottom: 30px;">${message}</p>
                <div style="display: flex; gap: 10px;">
                    <button onclick="this.closest('div').parentElement.remove()" style="flex: 1; padding: 10px; background: var(--border-color); color: var(--text-primary); border: none; border-radius: 8px; cursor: pointer;">Cancel</button>
                    <button style="flex: 1; padding: 10px; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer;">Confirm</button>
                </div>
            </div>
        `;

        const confirmBtn = modal.querySelector('button:nth-child(2)');
        confirmBtn.addEventListener('click', () => {
            onConfirm();
            modal.remove();
        });

        document.body.appendChild(modal);
    },

    /**
     * Format currency
     */
    formatCurrency: (amount) => {
        return '$' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Format date
     */
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    /**
     * Get time ago string
     */
    getTimeAgo: (date) => {
        const now = new Date();
        const then = new Date(date);
        const seconds = Math.floor((now - then) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [name, value] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / value);
            if (interval >= 1) {
                return interval === 1 ? `1 ${name} ago` : `${interval} ${name}s ago`;
            }
        }

        return 'just now';
    }
};

/**
 * ============================================================================
 * DOM MANIPULATION MODULE
 * ============================================================================
 */

const DOM = {
    /**
     * Get element by ID
     */
    id: (id) => document.getElementById(id),

    /**
     * Get elements by class
     */
    class: (className) => document.querySelectorAll(`.${className}`),

    /**
     * Get element by selector
     */
    query: (selector) => document.querySelector(selector),

    /**
     * Get all elements by selector
     */
    queryAll: (selector) => document.querySelectorAll(selector),

    /**
     * Create element
     */
    create: (tag, className = '', innerHTML = '') => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },

    /**
     * Add event listener
     */
    on: (element, event, callback) => {
        if (element) element.addEventListener(event, callback);
    },

    /**
     * Remove event listener
     */
    off: (element, event, callback) => {
        if (element) element.removeEventListener(event, callback);
    },

    /**
     * Toggle class
     */
    toggleClass: (element, className) => {
        if (element) element.classList.toggle(className);
    },

    /**
     * Add class
     */
    addClass: (element, className) => {
        if (element) element.classList.add(className);
    },

    /**
     * Remove class
     */
    removeClass: (element, className) => {
        if (element) element.classList.remove(className);
    },

    /**
     * Show element
     */
    show: (element) => {
        if (element) element.style.display = '';
    },

    /**
     * Hide element
     */
    hide: (element) => {
        if (element) element.style.display = 'none';
    },

    /**
     * Set text content
     */
    setText: (element, text) => {
        if (element) element.textContent = text;
    },

    /**
     * Set HTML content
     */
    setHTML: (element, html) => {
        if (element) element.innerHTML = html;
    },

    /**
     * Get value
     */
    getValue: (element) => {
        return element ? element.value : '';
    },

    /**
     * Set value
     */
    setValue: (element, value) => {
        if (element) element.value = value;
    }
};

/**
 * ============================================================================
 * ANIMATION MODULE
 * ============================================================================
 */

const Animation = {
    /**
     * Fade in element
     */
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.display = '';

        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    },

    /**
     * Fade out element
     */
    fadeOut: (element, duration = 300, callback) => {
        element.style.opacity = '1';
        element.style.transition = `opacity ${duration}ms ease`;

        setTimeout(() => {
            element.style.opacity = '0';

            setTimeout(() => {
                element.style.display = 'none';
                if (callback) callback();
            }, duration);
        }, 10);
    },

    /**
     * Slide in element
     */
    slideIn: (element, direction = 'up', duration = 300) => {
        const start = direction === 'up' ? 50 : -50;
        element.style.transform = `translateY(${start}px)`;
        element.style.opacity = '0';
        element.style.transition = `all ${duration}ms ease`;

        setTimeout(() => {
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        }, 10);
    },

    /**
     * Pulse element
     */
    pulse: (element, duration = 600) => {
        element.style.animation = `pulse ${duration}ms ease`;
    },

    /**
     * Bounce element
     */
    bounce: (element, duration = 600) => {
        element.style.animation = `bounce ${duration}ms ease`;
    }
};

/**
 * ============================================================================
 * PAGE NAVIGATION MODULE
 * ============================================================================
 */

const Navigation = {
    /**
     * Show page
     */
    showPage: (pageName) => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });

        // Show selected page
        const page = DOM.id(`${pageName}Page`);
        if (page) {
            page.style.display = '';
            Animation.fadeIn(page);
        }
    },

    /**
     * Show section
     */
    showSection: (sectionName) => {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active from nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected section
        const section = DOM.id(`${sectionName}Section`);
        if (section) {
            section.classList.add('active');
            AppState.currentSection = sectionName;
            Storage.saveState();
        }

        // Add active to clicked nav link
        if (event && event.target) {
            const navLink = event.target.closest('.nav-link');
            if (navLink) navLink.classList.add('active');
        }

        // Close sidebar on mobile
        const sidebar = DOM.id('sidebar');
        if (sidebar && window.innerWidth <= 768) {
            DOM.removeClass(sidebar, 'active');
        }
    }
};

/**
 * ============================================================================
 * INITIALIZATION & APP STARTUP
 * ============================================================================
 */

const App = {
    /**
     * Initialize application
     */
    init: () => {
        console.log('🚀 Initializing ModernApp...');

        // Load saved state
        Storage.loadState();

        // Check if user is logged in
        if (Auth.isLoggedIn()) {
            App.showApp();
        } else {
            App.showLoginPage();
        }

        // Setup event listeners
        App.setupEventListeners();

        // Update UI
        App.updateUI();

        console.log('✅ ModernApp initialized successfully');
    },

    /**
     * Show login page
     */
    showLoginPage: () => {
        DOM.show(DOM.id('loginPage'));
        DOM.removeClass(DOM.id('appContainer'), 'show');
    },

    /**
     * Show app
     */
    showApp: () => {
        DOM.hide(DOM.id('loginPage'));
        DOM.addClass(DOM.id('appContainer'), 'show');
        App.updateUserDisplay();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners: () => {
        // Login form
        const loginForm = DOM.id('loginForm');
        if (loginForm) {
            DOM.on(loginForm, 'submit', (e) => App.handleLogin(e));
        }

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            DOM.on(link, 'click', function() {
                const section = this.textContent.trim().toLowerCase();
                if (section.includes('dashboard')) Navigation.showSection('dashboard');
                if (section.includes('profile')) Navigation.showSection('profile');
                if (section.includes('wallet')) Navigation.showSection('wallet');
                if (section.includes('settings')) Navigation.showSection('settings');
            });
        });

        // Logout button
        const logoutBtn = DOM.query('.logout-btn');
        if (logoutBtn) {
            DOM.on(logoutBtn, 'click', () => App.handleLogout());
        }

        // Profile save button
        const saveProfileBtn = DOM.query('[onclick*="saveProfile"]');
        if (saveProfileBtn) {
            DOM.on(saveProfileBtn, 'click', () => App.saveProfile());
        }

        // Profile reset button
        const resetProfileBtn = DOM.query('[onclick*="resetProfile"]');
        if (resetProfileBtn) {
            DOM.on(resetProfileBtn, 'click', () => App.resetProfile());
        }

        // Window resize handler
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                const sidebar = DOM.id('sidebar');
                if (sidebar) DOM.removeClass(sidebar, 'active');
            }
        });
    },

    /**
     * Handle login
     */
    handleLogin: (e) => {
        e.preventDefault();

        const email = DOM.getValue(DOM.id('email'));
        const password = DOM.getValue(DOM.id('password'));

        const result = Auth.login(email, password);

        if (result.success) {
            DOM.id('loginForm').reset();
            App.showApp();
            UI.showToast(result.message, 'success');
        } else {
            UI.showToast(result.message, 'error');
        }
    },

    /**
     * Handle logout
     */
    handleLogout: () => {
        UI.showModal(
            'Confirm Logout',
            'Are you sure you want to logout?',
            () => {
                const result = Auth.logout();
                if (result.success) {
                    App.showLoginPage();
                    UI.showToast(result.message, 'success');
                }
            },
            () => {
                // Cancel
            }
        );
    },

    /**
     * Update user display
     */
    updateUserDisplay: () => {
        const profile = Profile.getProfile();

        // Update header
        DOM.setText(DOM.id('displayName'), profile.firstName);
        DOM.setText(DOM.id('userInitial'), profile.initials);
        DOM.setText(DOM.id('profileAvatar'), profile.initials);

        // Update profile section
        DOM.setText(DOM.id('profileName'), profile.fullName);
        DOM.setText(DOM.id('profileEmail'), profile.email);

        // Update form fields
        DOM.setValue(DOM.id('firstName'), profile.firstName);
        DOM.setValue(DOM.id('lastName'), profile.lastName);
        DOM.setValue(DOM.id('profileEmailInput'), profile.email);
        DOM.setValue(DOM.id('phoneNumber'), profile.phone);
        DOM.setValue(DOM.id('location'), profile.location);
        DOM.setValue(DOM.id('profession'), profile.profession);

        // Update wallet display
        const walletBalance = Wallet.getFormattedBalance();
        document.querySelectorAll('[id*="Balance"]').forEach(el => {
            DOM.setText(el, walletBalance);
        });

        // Update stats
        App.updateStats();

        // Update transactions
        App.loadTransactions();

        // Update header date
        DOM.setText(DOM.id('headerDate'), UI.formatDate(new Date()));
    },

    /**
     * Update statistics
     */
    updateStats: () => {
        const walletStats = Wallet.getStats();
        const profileStats = Profile.getStats();

        // Update stat cards if they exist
        const statCards = document.querySelectorAll('.stat-value');
        if (statCards.length >= 4) {
            DOM.setText(statCards[0], UI.formatCurrency(walletStats.balance));
            DOM.setText(statCards[1], UI.formatCurrency(walletStats.totalIncome));
            DOM.setText(statCards[2], UI.formatCurrency(walletStats.totalExpense));
            DOM.setText(statCards[3], UI.formatCurrency(walletStats.netSavings));
        }

        // Update profile stats
        const profileStatValues = document.querySelectorAll('.profile-stat-value');
        if (profileStatValues.length >= 3) {
            DOM.setText(profileStatValues[0], profileStats.transactions);
            DOM.setText(profileStatValues[1], UI.formatCurrency(profileStats.totalSpent));
            DOM.setText(profileStatValues[2], `${profileStats.memberDays} Days`);
        }
    },

    /**
     * Load transactions
     */
    loadTransactions: () => {
        const container = DOM.id('transactionsList');
        if (!container) return;

        const transactions = Wallet.getTransactions();

        if (transactions.length === 0) {
            DOM.setHTML(container, '<p style="text-align: center; color: var(--text-secondary);">No transactions yet</p>');
            return;
        }

        const html = transactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-left">
                    <div class="transaction-icon">${transaction.icon}</div>
                    <div class="transaction-info">
                        <h4>${transaction.description}</h4>
                        <p>${transaction.date}</p>
                    </div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${UI.formatCurrency(transaction.amount)}
                </div>
            </div>
        `).join('');

        DOM.setHTML(container, html);
    },

    /**
     * Save profile
     */
    saveProfile: () => {
        const updates = {
            firstName: DOM.getValue(DOM.id('firstName')),
            lastName: DOM.getValue(DOM.id('lastName')),
            email: DOM.getValue(DOM.id('profileEmailInput')),
            phone: DOM.getValue(DOM.id('phoneNumber')),
            location: DOM.getValue(DOM.id('location')),
            profession: DOM.getValue(DOM.id('profession'))
        };

        const result = Profile.updateProfile(updates);

        if (result.success) {
            App.updateUserDisplay();
            UI.showToast(result.message, 'success');
        } else {
            UI.showToast(result.message, 'error');
        }
    },

    /**
     * Reset profile
     */
    resetProfile: () => {
        const profile = Profile.getProfile();
        DOM.setValue(DOM.id('firstName'), profile.firstName);
        DOM.setValue(DOM.id('lastName'), profile.lastName);
        DOM.setValue(DOM.id('profileEmailInput'), profile.email);
        DOM.setValue(DOM.id('phoneNumber'), profile.phone);
        DOM.setValue(DOM.id('location'), profile.location);
        DOM.setValue(DOM.id('profession'), profile.profession);

        UI.showToast('Profile reset', 'success');
    },

    /**
     * Update all UI elements
     */
    updateUI: () => {
        App.updateUserDisplay();
        App.updateStats();
        App.loadTransactions();
    }
};

/**
 * ============================================================================
 * WALLET OPERATIONS (Global Functions)
 * ============================================================================
 */

window.addFunds = function() {
    const amount = prompt('Enter amount to add (e.g., 100):');
    if (amount) {
        const result = Wallet.addFunds(amount, 'Funds Added');
        if (result.success) {
            App.updateUI();
            UI.showToast(result.message, 'success');
        } else {
            UI.showToast(result.message, 'error');
        }
    }
};

window.withdraw = function() {
    const amount = prompt('Enter amount to withdraw (e.g., 100):');
    if (amount) {
        const result = Wallet.withdraw(amount, 'Withdrawal');
        if (result.success) {
            App.updateUI();
            UI.showToast(result.message, 'success');
        } else {
            UI.showToast(result.message, 'error');
        }
    }
};

window.transfer = function() {
    const recipient = prompt('Enter recipient email:');
    if (!recipient) return;

    const amount = prompt('Enter amount to transfer:');
    if (amount) {
        const result = Wallet.transfer(recipient, amount);
        if (result.success) {
            App.updateUI();
            UI.showToast(result.message, 'success');
        } else {
            UI.showToast(result.message, 'error');
        }
    }
};

window.requestMoney = function() {
    const requester = prompt('Enter email to request money from:');
    if (!requester) return;

    const amount = prompt('Enter amount to request:');
    if (amount) {
        UI.showToast(`Money request sent to ${requester}`, 'success');
    }
};

window.showSection = function(sectionName) {
    Navigation.showSection(sectionName);
};

window.logout = function() {
    App.handleLogout();
};

window.saveProfile = function() {
    App.saveProfile();
};

window.resetProfile = function() {
    App.resetProfile();
};

window.saveSettings = function() {
    UI.showToast('Settings saved successfully!', 'success');
};

window.showToast = function(message, type) {
    UI.showToast(message, type);
};

/**
 * ============================================================================
 * STARTUP
 * ============================================================================
 */

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Handle visibility change (pause/resume when tab changes)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('App paused');
    } else {
        console.log('App resumed');
        Storage.loadState();
    }
});

// Save state before unload
window.addEventListener('beforeunload', () => {
    Storage.saveState();
});

// Console logging helper
window.logAppState = () => {
    console.table(AppState);
};

window.logUser = () => {
    console.table(Auth.getCurrentUser());
};

window.logWallet = () => {
    console.table({
        balance: Wallet.getBalance(),
        formattedBalance: Wallet.getFormattedBalance(),
        stats: Wallet.getStats()
    });
};

window.logTransactions = () => {
    console.table(Wallet.getTransactions());
};

// Export modules for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppState,
        Storage,
        Auth,
        Wallet,
        Profile,
        UI,
        DOM,
        Animation,
        Navigation,
        App
    };
}