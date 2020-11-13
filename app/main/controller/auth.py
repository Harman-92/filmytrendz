from flask import request
from flask_restplus import Resource
import json
from ..service.auth import Auth
from ..util.dto import AuthDto
from ..util.decorator import token_required

"""
	Authentication Api:
	signup -- provide the api for user to signup with the application
	login  -- provide the api for user to login the application, and will get a token
	logout -- provide the api for user to logout the application, revoke the token
"""

api = AuthDto.api
auth_login_model = AuthDto.user_login_auth
auth_signup_model = AuthDto.user_signup_auth


@api.route('signup')
class UsersignUp(Resource):
    @api.expect(auth_signup_model, validate=True)
    @api.doc(
        description="signup with email, password, names"
    )
    @api.response(200, 'success')
    @api.response(400, 'badrequest')
    def post(self):
        user_info = json.loads(request.data)
        return Auth.signup(data=user_info)


@api.route('login')
class UserLogin(Resource):
    @api.expect(auth_login_model, validate=True)
    @api.doc(
        description="login with email and password"
    )
    @api.response(200, 'success')
    @api.response(401, 'unauthorized')
    def post(self):
        user_info = json.loads(request.data)
        return Auth.login(data=user_info)


@api.route('logout')
class UserLogout(Resource):
    @api.doc(description="logout")
    @api.response(201, 'success')
    @api.response(401, 'unauthorized')
    @token_required
    def post(self, user):
        token = request.headers.get('Authorization')
        return Auth.logout(token)
