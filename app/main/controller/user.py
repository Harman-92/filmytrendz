from flask import request
from flask_restplus import Resource, marshal
from ..util.dto import UserDto
from ..service.user import *
from ..util.decorator import token_required
import json
from ..util.http_status import *

api = UserDto.api
user_model = UserDto.user
password_model = UserDto.pass_change
ban_model = UserDto.user_ban
ban_list_model = UserDto.banned_list

"""
    user api
    retrieve   -- retrieve a user profile
    update     -- update a user profile
    password   -- modify the password
    banneduser -- retrieve banned user, add user to banned list, delete
"""


@api.route('')
class User(Resource):
    @api.doc('retrieve the user profile')
    @api.response(200, 'success', model=user_model)
    @api.response(401, 'unauthorized')
    @token_required
    def get(self, user):
        """
            This is to retrive information of a specific user, user as the parameter in the URL
            If this  user is found, then it will return all the user informaion.
        """
        user = get_user(user['id'])

        return marshal(user, user_model), SUCCESS


    @api.doc('update user details')
    @api.response(200, 'success', model=user_model)
    @api.expect(api.model('update user info', {}))
    @api.response(401, 'unauthorized')
    @token_required
    def post(self, user):
        """
            interface for user to modify/update the profiles
        """
        user_id = user['id']
        updated_info = json.loads(request.get_data())
        user = update_user(updated_info, user_id)

        return marshal(user, user_model), SUCCESS


@api.route('/password')
class ChangePassword(Resource):
    @api.doc('change password for user')
    @api.expect(password_model, validate=True)
    @api.response(200, 'success')
    @api.response(401, 'unauthorized')
    @token_required
    def post(self, user):
        """
            This is to give functionality of changing password to the logged in user,
        """
        user_id = user['id']
        updated_info = json.loads(request.get_data())
        response = update_password(updated_info, user_id)

        return response


@api.route('/banneduser')
class Banneduser(Resource):
    @api.doc('get banned users')
    @api.response(200, 'success')
    @api.response(401, 'unauthorized')
    @token_required
    def get(self, user):
        """
            This is to view all the users a logged in user has marked banned
        """
        user_id = user['id']
        banned_users = get_banned_user(user_id)

        return marshal(banned_users, ban_list_model), SUCCESS

    @api.doc('ban a user')
    @api.expect(ban_model)
    @api.response(200, 'success')
    @api.response(401, 'unauthorized')
    @token_required
    def put(self, user):
        """
            logged in user can add users to his banned list
        """
        user_id = user['id']
        updated_info = json.loads(request.get_data())
        response = ban_user(updated_info, user_id)

        return response


@api.route('/banneduser/<id>')
class Banneduser(Resource):
    @api.doc('delete banned user')
    @api.expect(ban_model)
    @api.response(200, 'success')
    @api.response(401, 'unauthorized')
    @token_required
    def delete(self, user, id):
        """
            user can delete another user from their list of banned users
        """
        user_id = user['id']
        response = del_ban_user(id, user_id)

        return response
