from app import db
from datetime import datetime

class Portfolio(db.Model):
    __tablename__ = 'portfolios'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    total_gold_owned = db.Column(db.Float, default=0.0)
    total_spent = db.Column(db.Float, default=0.0)  # Total USD spent on gold
    average_buy_price = db.Column(db.Float, default=0.0)
    current_portfolio_value = db.Column(db.Float, default=0.0)
    profit_loss = db.Column(db.Float, default=0.0)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'total_gold_owned': self.total_gold_owned,
            'total_spent': self.total_spent,
            'average_buy_price': self.average_buy_price,
            'current_portfolio_value': self.current_portfolio_value,
            'profit_loss': self.profit_loss,
            'updated_at': self.updated_at.isoformat()
        }
