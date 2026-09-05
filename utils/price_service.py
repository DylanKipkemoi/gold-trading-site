import requests
import os
from app import db
from models import PriceHistory
from datetime import datetime

GOLD_API_URL = os.getenv('GOLD_API_URL', 'https://api.metals.live/v1/spot/gold')

def get_current_gold_price():
    """
    Fetch current gold price from external API
    Returns price in USD per gram
    """
    try:
        response = requests.get(GOLD_API_URL, timeout=5)
        if response.status_code == 200:
            data = response.json()
            # API returns price per troy ounce, convert to per gram
            price_per_oz = data.get('gold', 0)
            price_per_gram = price_per_oz / 31.1035  # 1 troy ounce = 31.1035 grams
            return round(price_per_gram, 2)
    except Exception as e:
        print(f"Error fetching gold price: {str(e)}")
    
    return None

def fetch_and_store_price():
    """
    Fetch gold price and store in database
    """
    price = get_current_gold_price()
    
    if price:
        price_history = PriceHistory(
            gold_price_usd=price,
            timestamp=datetime.utcnow(),
            source='metals.live'
        )
        db.session.add(price_history)
        db.session.commit()
        return price
    
    return None
