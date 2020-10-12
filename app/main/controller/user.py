from flask import request
from flask_restplus import Resource
from ..util.dto import UserDto

api = UserDto.api
user_model = UserDto.user


@api.route('/')
class User(Resource):
	@api.doc('retrive a user profile')
	@api.response(200, 'success', model=user_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@api.param('id', description='take user id as parameter')
	def get(self, user):
		pass

