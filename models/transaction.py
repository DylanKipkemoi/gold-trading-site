from app import db
from datetime import datetime
from enum import Enum

class TransactionType(Enum):
    BUY = 'buy'
    SELL = 'sell'

class Transaction(db.Model):
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    transaction_type = db.Column(db.String(10), nullable=False)  # 'buy' or 'sell'
    quantity = db.Column(db.Float, nullable=False)  # Amount of gold in grams or ounces
    price_per_unit = db.Column(db.Float, nullable=False)  # Gold price at time of transaction
    total_amount = db.Column(db.Float, nullable=False)  # Total USD amount
    status = db.Column(db.String(20), default='completed')  # completed, pending, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.transaction_type,
            'quantity': self.quantity,
            'price_per_unit': self.price_per_unit,
            'total_amount': self.total_amount,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }
