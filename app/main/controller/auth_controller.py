from flask import request
from flask_restplus import Resource
import json

from app.main.service.auth import Auth
from ..util.dto import AuthDto
from ..util.decorator import token_required

api = AuthDto.api
auth_login_model = AuthDto.user_login_auth
auth_signup_model = AuthDto.user_signup_auth


@api.route('/signup')
class UsersignUp(Resource):
    @api.expect(auth_signup_model, validate=True)
    @api.doc(
        description="signup with email, password, name"
    )
    @api.response(201, 'success')
    @api.response(400, 'badrequest')
    def post(self):
        user_info = json.loads(request.data)
        return Auth.signup(data=user_info)


@api.route('/login')
class UserLogin(Resource):
    @api.expect(auth_login_model, validate=True)
    @api.doc(
        description="Login with email and password"
    )
    @api.response(201, 'success')
    @api.response(401, 'unauthorized')
    def post(self):
        user_info = json.loads(request.data)
        return Auth.login(data=user_info)


@api.route('/logout')
class UserLogout(Resource):
    @api.doc(description="Logout the session")
    @api.response(201, 'success')
    @api.response(401, 'unauthorized')
    @token_required
    def post(self):
        token = request.headers.get('token')
        return Auth.logout(token)

