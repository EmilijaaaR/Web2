from decouple import config
import os
from datetime import timedelta


BASE_DIR = os.path.dirname(os.path.realpath(__file__))
#UPLOAD_PATH = os.path.join(app.instance_path, 'htmlfi')

class Config:
    #SQLALCHEMY_TRACK_MODIFICATIONSS=config('SQLALCHEMY_TRACK_MODIFICATIONS',cast=bool)
    #UPLOAD_FOLDER=""
    BLANK = ""


class DevConfig(Config):
    JWT_SECRET_KEY='SECRET_KEY_NEW'
    JWT_ALGORITHM = "HS256"
    SECRET_KEY="12412412412"
    SQLALCHEMY_DATABASE_URI="sqlite:///"+os.path.join(BASE_DIR,'dev.db')
    DEBUG=True
    SQLALCHEMY_ECHO=True
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    

class ProdConfig(Config):
    # SQLALCHEMY_DATABASE_URI="sqlite:///dev.db"
    # DEBUG=config('DEBUG',cast=bool)
    # SQLALCHEMY_ECHO=config('ECHO',cast=bool)
    # SQLALCHEMY_TRACK_MODIFICATIONS=config('SQLALCHEMY_TRACK_MODIFICATIONS',cast=bool)
    pass


class TestConfig(Config):
    # SQLALCHEMY_DATABASE_URI='sqlite:///test.db'
    # SQLALCHEMY_ECHO=False
    # TESTING=True
    pass