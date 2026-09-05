class GoldTradingApp {
    constructor() {
        this.apiUrl = 'http://localhost:5000/api';
        this.token = localStorage.getItem('token');
        this.currentUser = null;
        this.init();
    }

    init() {
        this.renderApp();
        if (this.token) {
            this.loadUserData();
        }
    }

    setAuthToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    getAuthToken() {
        return localStorage.getItem('token');
    }

    clearAuthToken() {
        this.token = null;
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    }

    renderApp() {
        const app = document.getElementById('app');
        
        if (!this.token) {
            app.innerHTML = this.renderAuthPage();
            this.attachAuthListeners();
        } else {
            app.innerHTML = this.renderDashboard();
            this.attachDashboardListeners();
            this.updatePriceData();
            setInterval(() => this.updatePriceData(), 30000); // Update every 30 seconds
        }
    }

    renderAuthPage() {
        return `
            <div class="container">
                <header>
                    <h1>💰 Gold Trading Platform</h1>
                </header>
                <div class="auth-container">
                    <div id="auth-form">
                        <h2>Login</h2>
                        <form id="login-form">
                            <div class="form-group">
                                <label>Username</label>
                                <input type="text" id="login-username" required>
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" id="login-password" required>
                            </div>
                            <button type="submit" class="btn-primary">Login</button>
                        </form>
                        <div class="toggle-auth">
                            <p>Don't have an account? <button onclick="app.toggleAuth()">Register</button></p>
                        </div>
                    </div>
                    
                    <div id="register-form" class="hidden">
                        <h2>Register</h2>
                        <form id="signup-form">
                            <div class="form-group">
                                <label>Username</label>
                                <input type="text" id="register-username" required>
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" id="register-email" required>
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" id="register-password" required>
                            </div>
                            <button type="submit" class="btn-primary">Register</button>
                        </form>
                        <div class="toggle-auth">
                            <p>Already have an account? <button onclick="app.toggleAuth()">Login</button></p>
                        </div>
                    </div>
                    <div id="message"></div>
                </div>
            </div>
        `;
    }

    renderDashboard() {
        return `
            <div class="container">
                <header>
                    <h1>💰 Gold Trading Platform</h1>
                    <div class="nav-menu">
                        <button onclick="app.showSection('dashboard')">Dashboard</button>
                        <button onclick="app.showSection('trading')">Trade</button>
                        <button onclick="app.showSection('portfolio')">Portfolio</button>
                        <button onclick="app.showSection('transactions')">History</button>
                        <button class="logout" onclick="app.logout()">Logout</button>
                    </div>
                </header>
                <div id="message"></div>
                <div id="dashboard-section">${this.renderDashboardView()}</div>
                <div id="trading-section" class="hidden">${this.renderTradingView()}</div>
                <div id="portfolio-section" class="hidden">${this.renderPortfolioView()}</div>
                <div id="transactions-section" class="hidden">${this.renderTransactionsView()}</div>
            </div>
        `;
    }

    renderDashboardView() {
        return `
            <div class="price-section">
                <h2>Gold Price</h2>
                <div class="current-price" id="current-gold-price">Loading...</div>
                <p>USD per gram</p>
            </div>
            <div class="dashboard">
                <div class="card">
                    <h3>USD Balance</h3>
                    <div class="card-value" id="usd-balance">$0.00</div>
                </div>
                <div class="card">
                    <h3>Gold Balance</h3>
                    <div class="card-value" id="gold-balance">0.00 g</div>
                </div>
                <div class="card">
                    <h3>Portfolio Value</h3>
                    <div class="card-value" id="portfolio-value">$0.00</div>
                </div>
                <div class="card">
                    <h3>Profit/Loss</h3>
                    <div class="card-value" id="profit-loss">$0.00</div>
                </div>
            </div>
        `;
    }

    renderTradingView() {
        return `
            <div class="trading-section">
                <div class="trading-card buy">
                    <h3>🔼 Buy Gold</h3>
                    <form id="buy-form">
                        <div class="form-group">
                            <label>Amount (grams)</label>
                            <input type="number" id="buy-quantity" step="0.1" min="0.1" required>
                        </div>
                        <div class="form-group">
                            <label>Price per gram: <span id="buy-price">$0.00</span></label>
                            <label>Total cost: <span id="buy-total">$0.00</span></label>
                        </div>
                        <button type="submit" class="btn-buy">Buy Gold</button>
                    </form>
                </div>
                <div class="trading-card sell">
                    <h3>🔽 Sell Gold</h3>
                    <form id="sell-form">
                        <div class="form-group">
                            <label>Amount (grams)</label>
                            <input type="number" id="sell-quantity" step="0.1" min="0.1" required>
                        </div>
                        <div class="form-group">
                            <label>Price per gram: <span id="sell-price">$0.00</span></label>
                            <label>Total proceeds: <span id="sell-total">$0.00</span></label>
                        </div>
                        <button type="submit" class="btn-sell">Sell Gold</button>
                    </form>
                </div>
            </div>
        `;
    }

    renderPortfolioView() {
        return `
            <div class="dashboard">
                <div class="card">
                    <h3>Total Gold Owned</h3>
                    <div class="card-value" id="total-gold">0.00 g</div>
                </div>
                <div class="card">
                    <h3>Average Buy Price</h3>
                    <div class="card-value" id="avg-buy-price">$0.00</div>
                </div>
                <div class="card">
                    <h3>Total Spent</h3>
                    <div class="card-value" id="total-spent">$0.00</div>
                </div>
                <div class="card">
                    <h3>Current Value</h3>
                    <div class="card-value" id="current-value">$0.00</div>
                </div>
                <div class="card">
                    <h3>Profit/Loss</h3>
                    <div class="card-value" id="portfolio-profit">$0.00</div>
                </div>
            </div>
        `;
    }

    renderTransactionsView() {
        return `
            <div class="transactions-section">
                <h3>Transaction History</h3>
                <table class="transaction-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Quantity (g)</th>
                            <th>Price/Unit</th>
                            <th>Total</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody id="transactions-tbody">
                        <tr><td colspan="5" style="text-align: center;">Loading...</td></tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    showSection(section) {
        document.querySelectorAll('[id$="-section"]').forEach(el => {
            el.classList.add('hidden');
        });
        document.getElementById(section + '-section').classList.remove('hidden');
        
        if (section === 'portfolio') {
            this.loadPortfolioData();
        } else if (section === 'transactions') {
            this.loadTransactions();
        }
    }

    toggleAuth() {
        document.getElementById('login-form').classList.toggle('hidden');
        document.getElementById('register-form').classList.toggle('hidden');
    }

    attachAuthListeners() {
        document.getElementById('login-form')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signup-form')?.addEventListener('submit', (e) => this.handleRegister(e));
    }

    attachDashboardListeners() {
        document.getElementById('buy-form')?.addEventListener('submit', (e) => this.handleBuyGold(e));
        document.getElementById('sell-form')?.addEventListener('submit', (e) => this.handleSellGold(e));
        
        document.getElementById('buy-quantity')?.addEventListener('input', () => this.updateBuyCost());
        document.getElementById('sell-quantity')?.addEventListener('input', () => this.updateSellProceeds());
    }

    async handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await axios.post(`${this.apiUrl}/auth/login`, {
                username,
                password
            });
            this.setAuthToken(response.data.access_token);
            this.currentUser = response.data.user;
            this.showMessage('Login successful!', 'success');
            setTimeout(() => this.renderApp(), 500);
        } catch (error) {
            this.showMessage(error.response?.data?.error || 'Login failed', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await axios.post(`${this.apiUrl}/auth/register`, {
                username,
                email,
                password
            });
            this.setAuthToken(response.data.access_token);
            this.currentUser = response.data.user;
            this.showMessage('Registration successful!', 'success');
            setTimeout(() => this.renderApp(), 500);
        } catch (error) {
            this.showMessage(error.response?.data?.error || 'Registration failed', 'error');
        }
    }

    async loadUserData() {
        try {
            const response = await axios.get(`${this.apiUrl}/auth/me`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            this.currentUser = response.data;
            this.updateDashboard();
        } catch (error) {
            this.logout();
        }
    }

    async updatePriceData() {
        try {
            const response = await axios.get(`${this.apiUrl}/prices/current`);
            const price = response.data.gold_price_usd;
            document.getElementById('current-gold-price').textContent = `$${price.toFixed(2)}`;
            document.getElementById('buy-price').textContent = `$${price.toFixed(2)}`;
            document.getElementById('sell-price').textContent = `$${price.toFixed(2)}`;
            this.updateBuyCost();
            this.updateSellProceeds();
        } catch (error) {
            console.error('Error fetching price:', error);
        }
    }

    updateBuyCost() {
        const quantity = parseFloat(document.getElementById('buy-quantity')?.value || 0);
        const price = parseFloat(document.getElementById('buy-price')?.textContent.replace('$', '') || 0);
        const total = quantity * price;
        document.getElementById('buy-total').textContent = `$${total.toFixed(2)}`;
    }

    updateSellProceeds() {
        const quantity = parseFloat(document.getElementById('sell-quantity')?.value || 0);
        const price = parseFloat(document.getElementById('sell-price')?.textContent.replace('$', '') || 0);
        const total = quantity * price;
        document.getElementById('sell-total').textContent = `$${total.toFixed(2)}`;
    }

    async handleBuyGold(e) {
        e.preventDefault();
        const quantity = parseFloat(document.getElementById('buy-quantity').value);

        try {
            const response = await axios.post(`${this.apiUrl}/trading/buy`, { quantity }, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            this.currentUser = response.data.user;
            this.updateDashboard();
            document.getElementById('buy-quantity').value = '';
            this.showMessage('Gold purchased successfully!', 'success');
        } catch (error) {
            this.showMessage(error.response?.data?.error || 'Purchase failed', 'error');
        }
    }

    async handleSellGold(e) {
        e.preventDefault();
        const quantity = parseFloat(document.getElementById('sell-quantity').value);

        try {
            const response = await axios.post(`${this.apiUrl}/trading/sell`, { quantity }, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            this.currentUser = response.data.user;
            this.updateDashboard();
            document.getElementById('sell-quantity').value = '';
            this.showMessage('Gold sold successfully!', 'success');
        } catch (error) {
            this.showMessage(error.response?.data?.error || 'Sale failed', 'error');
        }
    }

    async loadPortfolioData() {
        try {
            const response = await axios.get(`${this.apiUrl}/portfolio/`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const portfolio = response.data.portfolio;
            document.getElementById('total-gold').textContent = `${portfolio.total_gold_owned.toFixed(2)} g`;
            document.getElementById('avg-buy-price').textContent = `$${portfolio.average_buy_price.toFixed(2)}`;
            document.getElementById('total-spent').textContent = `$${portfolio.total_spent.toFixed(2)}`;
            document.getElementById('current-value').textContent = `$${portfolio.current_portfolio_value.toFixed(2)}`;
            document.getElementById('portfolio-profit').textContent = `$${portfolio.profit_loss.toFixed(2)}`;
        } catch (error) {
            this.showMessage('Error loading portfolio', 'error');
        }
    }

    async loadTransactions() {
        try {
            const response = await axios.get(`${this.apiUrl}/trading/history`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const tbody = document.getElementById('transactions-tbody');
            
            if (response.data.transactions.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No transactions yet</td></tr>';
                return;
            }

            tbody.innerHTML = response.data.transactions.map(t => `
                <tr>
                    <td><span class="type-${t.type}">${t.type.toUpperCase()}</span></td>
                    <td>${t.quantity.toFixed(2)}</td>
                    <td>$${t.price_per_unit.toFixed(2)}</td>
                    <td>$${t.total_amount.toFixed(2)}</td>
                    <td>${new Date(t.created_at).toLocaleDateString()}</td>
                </tr>
            `).join('');
        } catch (error) {
            this.showMessage('Error loading transactions', 'error');
        }
    }

    updateDashboard() {
        if (this.currentUser) {
            document.getElementById('usd-balance').textContent = `$${this.currentUser.balance_usd.toFixed(2)}`;
            document.getElementById('gold-balance').textContent = `${this.currentUser.balance_gold.toFixed(2)} g`;
        }
    }

    showMessage(msg, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.className = type;
        messageDiv.textContent = msg;
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = '';
        }, 3000);
    }

    logout() {
        this.clearAuthToken();
        this.currentUser = null;
        this.renderApp();
    }
}

const app = new GoldTradingApp();
