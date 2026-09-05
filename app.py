from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///gold_trading.db')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Import blueprints
from routes.auth import auth_bp
from routes.trading import trading_bp
from routes.portfolio import portfolio_bp
from routes.prices import prices_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(trading_bp, url_prefix='/api/trading')
app.register_blueprint(portfolio_bp, url_prefix='/api/portfolio')
app.register_blueprint(prices_bp, url_prefix='/api/prices')

@app.route('/api/health', methods=['GET'])
def health():
    return {'status': 'healthy', 'service': 'gold-trading-api'}, 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
