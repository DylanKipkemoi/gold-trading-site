from flask import Blueprint, request, jsonify
from app import db
from models import PriceHistory
from utils.price_service import get_current_gold_price, fetch_and_store_price
from datetime import datetime, timedelta

prices_bp = Blueprint('prices', __name__)

@prices_bp.route('/current', methods=['GET'])
def get_current_price():
    price = get_current_gold_price()
    
    if price:
        return {
            'gold_price_usd': price,
            'timestamp': datetime.utcnow().isoformat(),
            'unit': 'USD per gram'
        }, 200
    else:
        return {'error': 'Unable to fetch gold price'}, 500

@prices_bp.route('/history', methods=['GET'])
def get_price_history():
    hours = request.args.get('hours', default=24, type=int)
    start_time = datetime.utcnow() - timedelta(hours=hours)
    
    prices = PriceHistory.query.filter(
        PriceHistory.timestamp >= start_time
    ).order_by(PriceHistory.timestamp.asc()).all()
    
    return {
        'prices': [p.to_dict() for p in prices],
        'count': len(prices)
    }, 200

@prices_bp.route('/update', methods=['POST'])
def update_price():
    price = fetch_and_store_price()
    
    if price:
        return {
            'message': 'Price updated successfully',
            'gold_price_usd': price,
            'timestamp': datetime.utcnow().isoformat()
        }, 200
    else:
        return {'error': 'Unable to fetch gold price'}, 500
