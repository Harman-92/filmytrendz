from flask import request
from flask_restplus import Resource, marshal
from ..util.dto import UserDto
from app.main.service.user import *
from ..util.decorator import token_required
import json
from ..http_status import *


api = UserDto.api
user_model = UserDto.user
password_model = UserDto.pass_change
ban_model = UserDto.user_ban
ban_list_model = UserDto.banned_list


@api.route('/')
class User(Resource):
	@api.doc('retrieve a user profile')
	@api.response(200, 'success', model=user_model)
	@api.response(404, 'not found')
	@api.response(400, 'invalid')
	@token_required
	def get(self,user):
		user = get_user(user['id'])
		if not user:
			api.abort(404, 'user not exist')
		else:
			return marshal(user, user_model), SUCCESS

	@api.doc('update user details')
	@api.response(200, 'success', model=user_model)
	@api.response(404, 'not found')
	@api.expect(api.model('update user info',{}))
	@api.response(400, 'invalid')
	@token_required
	def post(self, user):

		user_id = user['id']
		if user_id:
			updated_info = json.loads(request.get_data())
			user = update_user(updated_info,  user_id)
			return marshal(user, user_model), SUCCESS
		else:

			api.abort(400, 'invalid operation')


@api.route('/password')
class ChangePassword(Resource):

	@api.doc('change password for user')
	@api.expect(password_model, validate=True)
	@api.response(200, 'success')
	@api.response(400, 'invalid')
	@token_required
	def post(self, user):
		user_id = user['id']

		if user_id:

			updated_info = json.loads(request.get_data())
			response = update_password(updated_info, user_id)
			return response

		else:
			api.abort(400, 'invalid operation')


@api.route('/banneduser')
class Banneduser(Resource):

	@api.doc('get banned users')
	@api.response(200, 'success')
	@api.response(400, 'invalid')
	@token_required
	def get(self, user):
		user_id = user['id']

		if user_id:

			banned_users = get_banned_user(user_id)
			return marshal(banned_users, ban_list_model), SUCCESS

		else:
			api.abort(400, 'invalid operation')

	@api.doc('add ban user')
	@api.expect(ban_model)
	@api.response(200, 'success')
	@api.response(400, 'invalid')
	@token_required
	def put(self, user):
		user_id = user['id']

		if user_id:

			updated_info = json.loads(request.get_data())
			response = ban_user(updated_info, user_id)
			return response

		else:
			api.abort(400, 'invalid operation')

	@api.doc('delete ban user')
	@api.expect(ban_model)
	@api.response(200, 'success')
	@api.response(400, 'invalid')
	@token_required
	def delete(self, user):

		user_id = user['id']

		if user_id:

			updated_info = json.loads(request.get_data())
			response = del_ban_user(updated_info, user_id)
			return response

		else:
			api.abort(400, 'invalid operation')
