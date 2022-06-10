import os
from exts import db
from flask import Flask


def init_app(config, BASE_DIR):
    app = Flask(__name__)
    app.config.from_object(config)
    app.config['SQLALCHEMY_DATABASE_URI'] ="sqlite:///"+os.path.join(BASE_DIR,'dev.db')
    db.init_app(app)
    
    
    with app.app_context():
        db.create_all()
        return app