from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import User, Portfolio
from utils.price_service import get_current_gold_price

portfolio_bp = Blueprint('portfolio', __name__)

@portfolio_bp.route('/', methods=['GET'])
@jwt_required()
def get_portfolio():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return {'error': 'User not found'}, 404
    
    portfolio = user.portfolio
    if not portfolio:
        return {'error': 'Portfolio not found'}, 404
    
    # Update current values
    current_price = get_current_gold_price()
    portfolio.current_portfolio_value = portfolio.total_gold_owned * current_price
    portfolio.profit_loss = portfolio.current_portfolio_value - portfolio.total_spent
    db.session.commit()
    
    return {
        'user': user.to_dict(),
        'portfolio': portfolio.to_dict()
    }, 200

@portfolio_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_portfolio_summary():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return {'error': 'User not found'}, 404
    
    portfolio = user.portfolio
    current_price = get_current_gold_price()
    
    summary = {
        'username': user.username,
        'usd_balance': user.balance_usd,
        'gold_balance': user.balance_gold,
        'gold_price_current': current_price,
        'portfolio': portfolio.to_dict() if portfolio else None,
        'total_net_worth': user.balance_usd + (user.balance_gold * current_price)
    }
    
    return summary, 200
