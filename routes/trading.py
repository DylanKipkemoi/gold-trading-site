from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import User, Transaction, Portfolio
from utils.price_service import get_current_gold_price
from datetime import datetime

trading_bp = Blueprint('trading', __name__)

@trading_bp.route('/buy', methods=['POST'])
@jwt_required()
def buy_gold():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return {'error': 'User not found'}, 404
    
    data = request.get_json()
    quantity = data.get('quantity')  # in grams
    
    if not quantity or quantity <= 0:
        return {'error': 'Invalid quantity'}, 400
    
    current_price = get_current_gold_price()
    total_cost = quantity * current_price
    
    if user.balance_usd < total_cost:
        return {'error': 'Insufficient balance'}, 400
    
    # Create transaction
    transaction = Transaction(
        user_id=user_id,
        transaction_type='buy',
        quantity=quantity,
        price_per_unit=current_price,
        total_amount=total_cost,
        status='completed'
    )
    
    # Update user balances
    user.balance_usd -= total_cost
    user.balance_gold += quantity
    
    # Update portfolio
    portfolio = user.portfolio
    if not portfolio:
        portfolio = Portfolio(user_id=user_id)
        db.session.add(portfolio)
    
    portfolio.total_gold_owned += quantity
    portfolio.total_spent += total_cost
    portfolio.average_buy_price = portfolio.total_spent / portfolio.total_gold_owned
    portfolio.current_portfolio_value = portfolio.total_gold_owned * current_price
    portfolio.profit_loss = portfolio.current_portfolio_value - portfolio.total_spent
    
    db.session.add(transaction)
    db.session.commit()
    
    return {
        'message': 'Gold purchased successfully',
        'transaction': transaction.to_dict(),
        'user': user.to_dict(),
        'portfolio': portfolio.to_dict()
    }, 201

@trading_bp.route('/sell', methods=['POST'])
@jwt_required()
def sell_gold():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return {'error': 'User not found'}, 404
    
    data = request.get_json()
    quantity = data.get('quantity')
    
    if not quantity or quantity <= 0:
        return {'error': 'Invalid quantity'}, 400
    
    if user.balance_gold < quantity:
        return {'error': 'Insufficient gold balance'}, 400
    
    current_price = get_current_gold_price()
    total_revenue = quantity * current_price
    
    # Create transaction
    transaction = Transaction(
        user_id=user_id,
        transaction_type='sell',
        quantity=quantity,
        price_per_unit=current_price,
        total_amount=total_revenue,
        status='completed'
    )
    
    # Update user balances
    user.balance_gold -= quantity
    user.balance_usd += total_revenue
    
    # Update portfolio
    portfolio = user.portfolio
    if portfolio:
        portfolio.total_gold_owned -= quantity
        portfolio.current_portfolio_value = portfolio.total_gold_owned * current_price
        portfolio.profit_loss = portfolio.current_portfolio_value - portfolio.total_spent
    
    db.session.add(transaction)
    db.session.commit()
    
    return {
        'message': 'Gold sold successfully',
        'transaction': transaction.to_dict(),
        'user': user.to_dict(),
        'portfolio': portfolio.to_dict() if portfolio else None
    }, 201

@trading_bp.route('/history', methods=['GET'])
@jwt_required()
def get_transaction_history():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.created_at.desc()).all()
    
    return {
        'transactions': [t.to_dict() for t in transactions],
        'count': len(transactions)
    }, 200
