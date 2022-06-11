import email
from sunau import Au_read
from tkinter.messagebox import NO
from flask_restx import Api, Resource, Namespace, abort, fields, reqparse
from models import PendingStatus
from models import Role, User
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
    )
import uuid
import werkzeug
import os
from datetime import datetime
from upload_util import ALLOWED_EXTENSIONS, allowed_file, get_extension
from flask import current_app
from flask import Flask, request, jsonify, make_response, send_file


auth_ns = Namespace('auth', description='A namespace for Authhentication')


# Serializers

signup_model = auth_ns.model(
    'SignUp', 
    {
        "username":fields.String(),
        "email":fields.String(),
        "password":fields.String(),
        "firstname":fields.String(),
        "lastname":fields.String(),
        "birthday":fields.Integer(),
        "address":fields.String()
    }
)

login_model = auth_ns.model(
    'Login', {
        'username':fields.String(),
        'password':fields.String(),
    }
)

user_edit_model = auth_ns.model(
    'User', 
    {
        "username":fields.String(),
        "email":fields.String(),
        "password":fields.String(),
        "firstname":fields.String(),
        "lastname":fields.String(),
        "birthday":fields.Integer(),
        "address":fields.String()
    }
)

user_model = auth_ns.model(
    'User', 
    {
        "username":fields.String(),
        "email":fields.String(),
        "firstname":fields.String(),
        "lastname":fields.String(),
        "birthday":fields.Integer(),
        "address":fields.String(),
        "pendingStatus":fields.String(description='PendingStatus', enum=PendingStatus._member_names_)
    }
)

user_verify_model = auth_ns.model(
    'verify',
    {
        "user_email": fields.String(),
        "verify": fields.Boolean()
    }
)

@auth_ns.route('/signup')
class SigunUp(Resource):
    @auth_ns.expect(signup_model)
    @auth_ns.marshal_with(user_model)
    def post(self):
        data = request.get_json()
        
        username = data.get('username')
        email = data.get('email')

        db_user = User.query.filter_by(username=username).first()
        db_email = User.query.filter_by(email=email).first()

        if db_user is not None:
            return f"User with username {username} already exists", 400

        if db_email is not None:
            return f"User with email {email} already exists", 400

        new_user = User(
            username = data.get('username'),
            email = data.get('email'),
            password = generate_password_hash(data.get('password')),
            firstname=data.get('firstname'),
            lastname=data.get('lastname'),
            birthday=data.get('birthday'),
            address=data.get('address'),
            role=Role.CUSTOMER
        )
        new_user.save()
        user = User.query.filter_by(email=new_user.email).first()
        
        return user

image_get_parser = reqparse.RequestParser()
image_get_parser.add_argument("id", type=int)

image_post_parser = reqparse.RequestParser()
image_post_parser.add_argument('file',
                    type=werkzeug.datastructures.FileStorage,
                    location='files',
                    required=True,
                    help='provide a file')

@auth_ns.route('/user/image')
class ProfileImageResource(Resource):
    #@jwt_required()
    @auth_ns.expect(image_get_parser)
    def get(self):
        id = int(request.args['id'])
        if id is None:
            return 400

        """ Download user profile image by user id"""
        user = User.query.filter_by(id=id).first()
        if user is None:
            return 400
        filename = user.username
        for ext in ALLOWED_EXTENSIONS:
            try:
                return send_file(os.path.join(current_app.config['UPLOAD_FOLDER'], secure_filename(filename + '.' + ext)), mimetype='image/gif')
            except Exception as err:
                print(err)
        return 404
    @jwt_required()
    @auth_ns.expect(image_post_parser)
    def post(self):
        """ Upload user profile image """
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        if user is None:
            return 400
        filename = user.username
        if 'file' not in request.files:
            return 404
        args = image_post_parser.parse_args()
        file = args['file']
        filename_with_ext = filename + '.' + get_extension(file.filename)
        if file.filename == '':
            return 400
        if file and allowed_file(file.filename):
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], secure_filename(filename_with_ext)))
        
        # delete old picture if exists
        for ext in ALLOWED_EXTENSIONS:
            try:
                if ext != get_extension(file.filename):
                    os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], secure_filename(filename + '.' + ext)))
            except Exception as err:
                print(err)
        
        return 200   

@auth_ns.route('/login')
class Login(Resource):
    @auth_ns.expect(login_model)
    def post(self):
        data = request.get_json()

        username =data.get('username')
        password = data.get('password')

        db_user = User.query.filter_by(username=username).first()
        
        if db_user and check_password_hash(db_user.password, password):
            access_token = create_access_token(identity=db_user.email)
            refresh_token = create_refresh_token(identity=db_user.email)
        else:
            return "Invalid email or password", 400

        return jsonify({"token": access_token, "refresh_token":refresh_token, "userData": {
            "username":db_user.username,
            "email":db_user.email,
            "firstname":db_user.firstname,
            "lastname":db_user.lastname,
            "address":db_user.address,
            "role": get_role(db_user.role)
        }})

def get_role(role):
    if role == Role.ADMIN:
        return 'ADMIN'
    if role == Role.CUSTOMER:
        return 'CUSTOMER'
    if role == Role.DELIVERER:
        return 'DELIVERER'
    

@auth_ns.route('/refresh')
class RefreshResource(Resource):
    @jwt_required(refresh=True)    
    def post(self):
        
        current_user = get_jwt_identity()
        
        new_access_token = create_access_token(identity=current_user)

        return make_response(jsonify({"access_token": new_access_token}), 200)

@auth_ns.route('/apply')
class ApplyForDeliverer(Resource):
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        user = User.query.filter_by(email = current_user).first()
        if user is None or user.role != Role.CUSTOMER:
            return 401
        
        if user.pendingStatus != PendingStatus.NONE:
            return 400

        user.apply_for_deliverer()

        return 200

@auth_ns.route('/pending-deliverers')
class PendingDeliverers(Resource):
    @jwt_required()
    @auth_ns.marshal_with(user_model)
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.filter_by(email = current_user).first()
        if(user.role != Role.ADMIN):
            return 401
        
        pending_users = User.query.filter(User.pendingStatus != PendingStatus.NONE).all()

        return pending_users

@auth_ns.route('/verify-deliverer')
class VerifyDeliverer(Resource):
    @jwt_required()
    @auth_ns.expect(user_verify_model)
    def post(self):
        data = request.get_json()
        current_user = get_jwt_identity()
        user = User.query.filter_by(email = current_user).first()
        if(user.role != Role.ADMIN):
            return 401
        
        pending_user = User.query.filter_by(email = data['user_email']).first()
        if pending_user is None:
            return 400
        
        if(data['verify'] == True):
            pending_user.approve_deliverer_application()
            # send email
        else:
            pending_user.deny_deliverer_application()
            # send email

        return 200
        

@auth_ns.route('/user')
class UserResource(Resource):
    @jwt_required()
    @auth_ns.marshal_with(user_model)
    def get(self):
        current_user = get_jwt_identity()

        user = User.query.filter_by(email = current_user).first()

        return user
    
    @jwt_required()
    @auth_ns.expect(user_edit_model)
    def put(self):
        data = request.get_json()

        current_user = get_jwt_identity()

        user = User.query.filter_by(email = current_user).first()
        
        user.update(
            data.get('lastname'),
            data.get('firstname'),
            data.get('birthday'),
            data.get('address'),
            )
        
        return jsonify({"message": f"User updated successfully"})

        