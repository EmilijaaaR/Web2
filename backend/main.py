import os
from models import Product
from exts import db
from flask import Flask, g
from flask_restx import Api 
from config import DevConfig
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from auth import auth_ns
from orders import order_ns
from products import product_ns
from flask_cors import CORS
from setup import init_app
from admin import add_admin

BASE_DIR = os.path.dirname(os.path.realpath(__file__))
authorizations = {
    'api_key' : {
        'type' : 'apiKey',
        'in' : 'header',
        'name' : 'Authorization'
    }
}

def create_app(config):
    app = init_app(config, BASE_DIR)
    # app = Flask(__name__)
    # app.config.from_object(config)
    # app.config['SQLALCHEMY_DATABASE_URI'] ="sqlite:///"+os.path.join(BASE_DIR,'dev.db')
    app.config["SECRET_KEY"] = "123124124"
    app.config['UPLOAD_FOLDER'] = os.path.join(app.instance_path, 'htmlfi')
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    CORS(app, resources={r"*": {"origins": "*"}})

    # db.init_app(app)

    migrate = Migrate(app, db)
    JWTManager(app)
    
    add_admin(app)

    api = Api(app, doc='/docs', authorizations=authorizations, security='api_key')
    
    api.add_namespace(auth_ns)
    api.add_namespace(product_ns)
    api.add_namespace(order_ns)

    # with app.app_context():
    #     db.create_all()
    #     return app
    
    def get_db():
        if 'db' not in g:
            g.db = db
        return db

    @app.shell_context_processor
    def make_shell_context():
        return {
            "db":db
        }

    
    return app