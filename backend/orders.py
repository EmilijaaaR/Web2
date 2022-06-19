from nis import cat
from os import system
from unicodedata import name
from flask_restx import Namespace, Resource, fields
from sqlalchemy import null
from models import Order, OrderItem, Product, User, Role
from flask_jwt_extended import jwt_required
from flask import Flask, request, jsonify
from flask_jwt_extended import (jwt_required, get_jwt_identity)
import threading
import datetime
sem = threading.Semaphore()

order_ns = Namespace('orders', description="A namespace for orders")

#  Serializer

order_item_model = order_ns.model(
    "OrderItem", 
    {
        "id": fields.Integer(),
        "quantity": fields.Integer(),
        "product": fields.Integer(),
        "price": fields.Float()
    }
)

get_order_model = order_ns.model(
    "Order", 
    {
        "id":fields.Integer(),
        "customer":fields.Integer(),
        "comment":fields.String(),
        "address":fields.String(),
        "time":fields.Integer(),
        "estimated_time":fields.Integer(),
        "products": fields.List(fields.Nested(order_item_model, "items"))
    }
)

create_order_item_model = order_ns.model(
    "OrderItem", 
    {
        "mealId": fields.Integer(),
        "quantity": fields.Integer()
    }
)

create_order_model = order_ns.model(
    "Order", 
    {
        "address":fields.String(),
        "comment":fields.String(),
        "items": fields.List(fields.Nested(create_order_item_model, "items"))
    }
)

add_order_semaphore = threading.Semaphore()

@order_ns.route('')
class OrdersResource(Resource):

    @order_ns.marshal_list_with(get_order_model)
    @jwt_required()
    def get(self):
        """Get orders depending on role.
        Admin: return all orders
        Deliverer: only without deliverer
        Customer: only customer orders
        """
        # check user
        current_user = get_jwt_identity()
        user = User.query.filter_by(email = current_user).first()
        if user is None:
            return 401

        if user.role == Role.ADMIN:
            return Order.query.all()
        if user.role == Role.CUSTOMER:
            return Order.query.filter_by(customer=user.id).all()
        if user.role == Role.DELIVERER:
            return Order.query.filter_by(deliverer=user.id).all()
        
        return {}

    @order_ns.marshal_with(get_order_model)    
    @order_ns.expect(create_order_model)
    @jwt_required()
    def post(self):
        # check user
        """Create a new order."""

        # check users first
        # if user is not customer return 401 code
        current_user = get_jwt_identity()
        user = User.query.filter_by(email = current_user).first()
        if(user.role != Role.CUSTOMER):
            return [0], 401
        

        data = request.get_json()

        add_order_semaphore.acquire(timeout=2)

        orders = Order.query.filter_by(customer=user.id).all()
        for order in orders:
            if(order.estimated_time > (datetime.datetime.now().timestamp() * 1000)):
                add_order_semaphore.release()
                return "You already have order that you are waiting!",400

        # check if products exists
        # now add all items
        items = data.get("items")
        for item in items:
            product = Product.query.filter_by(id=item.get("mealId")).first()
            if product is None:
                return "Product in order doesn't exists", 400
            item["price"] = product.price
        

        # first add order
        new_order = Order(
            customer=user.id,
            comment=data.get('comment'),
            address=data.get('address'),
            time=datetime.datetime.now().timestamp()*1000
        )
        
        new_order.save()
        
        # now add order items
        for item in items:
            new_order_item = OrderItem(
                product = item.get("mealId"),
                quantity = item.get("quantity"),
                order = new_order.id,
                price=item.get("price")
            )
            new_order_item.save()
        
        # release semaphore to enable another request to go
        add_order_semaphore.release()

        return new_order, 200

@order_ns.route('/pending-orders')
class PendingOrdersResource(Resource):

    @order_ns.marshal_list_with(get_order_model)
    @jwt_required()
    def get(self):
        """Get pending orders.
        """
        # check user
        current_user = get_jwt_identity()
        user = User.query.filter_by(email = current_user).first()
        if user is None:
            return 401

        if user.role == Role.DELIVERER:
            return Order.query.filter_by(deliverer=None).all()
        
        return 401

@order_ns.route('/<int:id>')
class OrderResource(Resource):
    @order_ns.marshal_with(get_order_model)
    def get(self, id):
        """Get order by id."""
        order=Order.query.get_or_404(id)

        return order

@order_ns.route('/current')
class UserOrdersResource(Resource):
    @order_ns.marshal_list_with(get_order_model)
    def get(self):
        """Get user current order that is delivering."""
        # check user
        current_user = get_jwt_identity()
        user = User.query.filter_by(email = current_user).first()
        if user is None:
            return 401
        user_orders=Order.query.filter_by(
            Order.deliverer.isnot(None),
            customer=user.id
            ).all()
        
        return user_orders

@order_ns.route('/deliver/<int:id>')
class OrderDeliverResource(Resource):
    @order_ns.marshal_with(get_order_model)
    @jwt_required()
    def put(self, id):
        """Set order deliverer and estimated delivery datetime"""

        # check is user deliverer
        current_user = get_jwt_identity()
        user = User.query.filter_by(email = current_user).first()
        if user is None or user.role != Role.DELIVERER:
            return 401

        order_to_deliver=Order.query.get_or_404(id)
        sem.acquire()

        orders = Order.query.filter_by(deliverer=user.id).all()
        for order in orders:
            if(order.estimated_time > (datetime.datetime.now().timestamp() * 1000)):
                sem.release()
                return "You already have order that you are delivering!",400

        try:
            order_to_deliver.set_deliverer(user.id)
            sem.release()
        except Exception as e:
            print(str(e))
            sem.release()
            return 400

        return order_to_deliver