from routes.auth import auth_bp
from routes.trading import trading_bp
from routes.portfolio import portfolio_bp
from routes.prices import prices_bp

__all__ = ['auth_bp', 'trading_bp', 'portfolio_bp', 'prices_bp']
