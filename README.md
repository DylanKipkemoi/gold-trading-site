# Gold Trading Platform

A Python Flask-based web application for trading gold against USD with real-time pricing and portfolio management.

## Features

- **User Authentication**: Register and login securely
- **Real-time Gold Prices**: Live gold prices fetched from metals.live API
- **Buy/Sell Gold**: Execute trades with current market prices
- **Portfolio Management**: Track your gold holdings and performance
- **Transaction History**: View all past trades
- **Price Tracking**: Historical price data and analysis
- **Responsive Dashboard**: Modern, intuitive user interface

## Tech Stack

**Backend:**
- Flask (Python web framework)
- SQLAlchemy (ORM)
- Flask-JWT-Extended (Authentication)
- PostgreSQL (Database)

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript
- Axios (HTTP client)

## Installation

### Prerequisites
- Python 3.8+
- PostgreSQL (or SQLite for development)
- Node.js (optional, for frontend development)

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/DylanKipkemoi/gold-trading-site.git
cd gold-trading-site
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Initialize the database:
```bash
python
>>> from app import app, db
>>> with app.app_context():
>>>     db.create_all()
>>> exit()
```

6. Run the Flask server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Open `index.html` in your browser or serve with a local server:
```bash
python -m http.server 8000
```

Access the application at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Trading
- `POST /api/trading/buy` - Buy gold
- `POST /api/trading/sell` - Sell gold
- `GET /api/trading/history` - Get transaction history

### Portfolio
- `GET /api/portfolio/` - Get portfolio details
- `GET /api/portfolio/summary` - Get portfolio summary

### Prices
- `GET /api/prices/current` - Get current gold price
- `GET /api/prices/history` - Get price history
- `POST /api/prices/update` - Update price data

## Environment Variables

```
FLASK_ENV=development
FLASK_APP=app.py
DATABASE_URL=postgresql://user:password@localhost/gold_trading
JWT_SECRET_KEY=your-secret-key-here
REDIS_URL=redis://localhost:6379/0
GOLD_API_KEY=your-gold-price-api-key
GOLD_API_URL=https://api.metals.live/v1/spot/gold
```

## Project Structure

```
gold-trading-site/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── models/               # Database models
│   ├── user.py
│   ├── transaction.py
│   ├── portfolio.py
│   └── price_history.py
├── routes/               # API routes
│   ├── auth.py
│   ├── trading.py
│   ├── portfolio.py
│   └── prices.py
├── utils/                # Utility functions
│   └── price_service.py
└── frontend/             # Frontend files
    ├── index.html
    ├── styles.css
    └── app.js
```

## Features in Detail

### User Registration & Login
- Secure password hashing with Werkzeug
- JWT token-based authentication
- User profile management

### Trading System
- Buy gold at current market prices
- Sell gold holdings
- Automatic balance updates
- Transaction tracking and history

### Portfolio Management
- Track total gold holdings
- Calculate average buy price
- Monitor portfolio value
- Calculate profit/loss

### Price Management
- Real-time gold prices from metals.live API
- Historical price tracking
- Price history for analysis

## Contributing

Feel free to fork this repository and submit pull requests for any improvements.

## License

MIT License - see LICENSE file for details

## Contact

For questions or support, please open an issue on GitHub.
