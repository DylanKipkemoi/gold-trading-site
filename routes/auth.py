from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return {'error': 'Missing required fields'}, 400
    
    if User.query.filter_by(username=data['username']).first():
        return {'error': 'Username already exists'}, 409
    
    if User.query.filter_by(email=data['email']).first():
        return {'error': 'Email already exists'}, 409
    
    user = User(
        username=data['username'],
        email=data['email'],
        balance_usd=1000.0  # Initial balance
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    
    return {
        'message': 'User created successfully',
        'user': user.to_dict(),
        'access_token': access_token
    }, 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return {'error': 'Missing username or password'}, 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not user.check_password(data['password']):
        return {'error': 'Invalid username or password'}, 401
    
    access_token = create_access_token(identity=user.id)
    
    return {
        'message': 'Login successful',
        'user': user.to_dict(),
        'access_token': access_token
    }, 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return {'error': 'User not found'}, 404
    
    return user.to_dict(), 200
