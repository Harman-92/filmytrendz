from flask import jsonify, make_response
from app.main.model.model import User
from app.main.service.user import TOKEN
from ..http_status import *
from ..model.model import BlacklistToken
from .. import db


class Auth:

    @staticmethod
    def login(data):
        """ for user login, user need to provide email and the password """

        email, password = \
            data['email'].strip(), data['password'].strip()
        user = User.query.filter_by(email=email).first()

        if not user:
            resp = make_response(jsonify({'message': 'user does not exist'}))
            resp.status_code = UNAUTHORIZED
            return resp
        if not user.check_password(password):
            resp = make_response(jsonify({'message': 'incorrect password'}))
            resp.status_code = UNAUTHORIZED
            return resp

        # after successfully verify the user backend api will issue token
        token = TOKEN.generate_token(user.id)
        resp_data = {
            'user_info': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'mobile_no': user.mobile_no
            },
            'token': token,
        }
        return make_response(resp_data, SUCCESS)

    @staticmethod
    def logout(token):
        """ logout, add the token to the black list """

        black_token = BlacklistToken(token=token)
        db.session.add(black_token)
        db.session.commit()
        response_data = {
            'status': 'success',
            'message': 'logout success'
        }
        resp = make_response(jsonify(response_data))
        resp.status_code = 200
        return resp

    @staticmethod
    def signup(data):
        """sign up with email name and password"""

        email, first_name, last_name, mobile_no, password = \
            data['email'].strip(), data['first_name'].strip(), data['last_name'].strip(), data['mobile_no'].strip(), data['password'].strip()

        user = User.query.filter_by(email=email).first()

        if user:
            resp = make_response(jsonify({'message': 'user does not exist'}))
            resp.status_code = BAD_REQUEST
            return resp
        else:
            new_user = User(email=email, first_name=first_name, last_name=last_name, mobile_no=mobile_no )
            new_user.encrypt_password(password)
            db.session.add(new_user)
            db.session.commit()
            resp_data = {
                    'id': new_user.id,
                    'email': new_user.email,
                    'first_name': new_user.first_name,
                    'last_name':new_user.last_name,
                    'mobile_no':new_user.mobile_no
            }
            return resp_data

