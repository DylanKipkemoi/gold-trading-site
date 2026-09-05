from app import db
from datetime import datetime

class PriceHistory(db.Model):
    __tablename__ = 'price_history'
    
    id = db.Column(db.Integer, primary_key=True)
    gold_price_usd = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    source = db.Column(db.String(50), default='metals.live')
    
    def to_dict(self):
        return {
            'gold_price_usd': self.gold_price_usd,
            'timestamp': self.timestamp.isoformat(),
            'source': self.source
        }
