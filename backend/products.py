from unicodedata import name
from flask_restx import Namespace, Resource, fields
from models import Product, User, Role
from flask_jwt_extended import jwt_required
from flask import Flask, request, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
    )

product_ns = Namespace('products', description="A namespace for Products")

#  Serializer

product_model = product_ns.model(
    "Product", 
    {
        "id":fields.Integer(required=False),
        "name":fields.String(),
        "ingredients":fields.String(),
        "price":fields.Float()
    }
)


@product_ns.route('')
class ProductsResource(Resource):

    @product_ns.marshal_list_with(product_model)
    def get(self):
        """Get all products."""
        products=Product.query.all()
        
        return products


    @product_ns.marshal_with(product_model)    
    @product_ns.expect(product_model)
    @jwt_required()
    def post(self):
        """Create a new product."""
        # check user
        current_user = get_jwt_identity()
        user = User.query.filter_by(email = current_user).first()
        if(user.role != Role.ADMIN):
            return 401

        data = request.get_json()

        new_product = Product(
            name=data.get('name'),
            ingredients=data.get('ingredients'),
            price=data.get('price')
        )
        
        new_product.save()
        
        return new_product, 201


@product_ns.route('/<int:id>')
class ProductResource(Resource):
    @product_ns.marshal_with(product_model)
    def get(self, id):
        """Get product by id."""
        product=Product.query.get_or_404(id)

        return  product


    @product_ns.marshal_with(product_model)
    @jwt_required()
    def put(self, id):
        """Update a product by id."""

        product_to_update=Product.query.get_or_404(id)
        data=request.get_json()
        product_to_update.update(data.get('name'), data.get('ingredients'), data.get('price'))

        return product_to_update


    @product_ns.marshal_with(product_model)
    @jwt_required()
    def delete(self, id):
        """Delete a product by id."""
        product_to_delete=Product.query.get_or_404(id)
        product_to_delete.delete()
        
        return product_to_delete