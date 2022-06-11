from email.policy import default
from itertools import product
from sqlalchemy import ForeignKey, true
from exts import db
from enum import Enum
import datetime
import random

class Role(Enum):
    ADMIN = 1
    DELIVERER = 2
    CUSTOMER = 3

class PendingStatus(Enum):
    NONE = 1
    PEDNING = 2
    APPROVED = 3
    DENIED = 4

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.Enum(Role))
    username = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(25), nullable=False, unique=True)
    password = db.Column(db.Text(), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    firstname = db.Column(db.String(50), nullable=False)
    birthday = db.Column(db.BigInteger, nullable=False)
    address = db.Column(db.String(50), nullable=False)
    pendingStatus = db.Column(db.Enum(PendingStatus), nullable=False, default=PendingStatus.NONE)

    def _repr_(self):
        return f'<User {self.username}>'

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self, lastname, firstname, birthday, address):
        self.lastname = lastname
        self.firstname = firstname
        self.birthday = birthday
        self.address = address
        db.session.commit()
    
    def apply_for_deliverer(self):
        self.pendingStatus = PendingStatus.PEDNING
        db.session.commit()

    def approve_deliverer_application(self):
        self.pendingStatus = PendingStatus.APPROVED
        self.role = Role.DELIVERER
        db.session.commit()

    def deny_deliverer_application(self):
        self.pendingStatus = PendingStatus.DENIED
        db.session.commit()

class Product(db.Model):
    id=db.Column(db.Integer(), primary_key=True)
    name=db.Column(db.String(), nullable=False)
    ingredients=db.Column(db.Text(), nullable=False)
    price = db.Column(db.DECIMAL(12,2), nullable=False)

    def __reprt__(self):
        return f'<Product {self.name}>'


    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
        
    def update(self, name, ingredients, price):
        self.name = name
        self.ingredients = ingredients
        self.price = price
        
        db.session.commit()

class Order(db.Model):
    id=db.Column(db.Integer(), primary_key=True)
    customer = db.Column(db.Integer, db.ForeignKey(User.id), nullable=True)
    deliverer = db.Column(db.Integer, db.ForeignKey(User.id), nullable=True)
    time=db.Column(db.BigInteger, nullable=False)
    estimated_time=db.Column(db.BigInteger, nullable=True)
    comment = db.Column(db.String(100), nullable=True)
    address = db.Column(db.String(70), nullable=False)
    products = db.relationship("OrderItem")

    def __reprt__(self):
        return f'<Order {self.id}>'

    def save(self):
        db.session.add(self)
        db.session.commit()
        
    
    def set_deliverer(self, deliverer):
        """ Sets deliverer if is not set, otherwise throws exception """
        if self.deliverer:
            raise Exception("This order is already taken by another deliverer.")

        self.deliverer = deliverer
        timenow = datetime.datetime.now()
        timenow += datetime.timedelta(
            minutes=random.randint(20,120)
            )
        self.estimated_time = timenow.timestamp() * 1000
        db.session.commit()
        
class OrderItem(db.Model):
    id=db.Column(db.Integer(), primary_key=True)
    quantity=db.Column(db.Integer(), nullable=False)
    product=db.Column(db.ForeignKey(Product.id), nullable=False)
    order=db.Column(db.ForeignKey(Order.id), nullable=False)
    price=db.Column(db.DECIMAL(12,2), nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()
        