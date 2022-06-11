from models import User, Role
from werkzeug.security import generate_password_hash

def add_admin(app):
    with app.app_context():    
        db_user = User.query.filter_by(username="admin").first()

        if db_user is None:
            new_user = User(
                username = 'admin',
                email = 'admin',
                password = generate_password_hash('adminadmin'),
                firstname='admin',
                lastname='admin',
                birthday=1231231231232,
                address='admin',
                role=Role.ADMIN
            )
            new_user.save()