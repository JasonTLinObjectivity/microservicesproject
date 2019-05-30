# services/users/project/__init__.py

from flask import Flask, jsonify
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

api = Api(app)

# set config
app_settings = os.getenv('APP_SETTINGS')
app.config.from_object(app_settings) 

# instatiate the database
db = SQLAlchemy(app)

# model
class User(db.Model):
	__tablename__ = 'users'
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	username = db.Column(db.String(128), nullable=False)
	email = db.Column(db.String(128), nullable=False)
	active = db.Column(db.Boolean(), default=True, nullable=False)

	def __init__(self, username, email):
		self.username = username
		self.email = email



class UsersPing(Resource):
	def get(self):
		return {
			'status': 'success',
			'message':'pong!'
		}


api.add_resource(UsersPing, '/users/ping')


