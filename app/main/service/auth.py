from flask import jsonify, make_response
from ..model.model import User
from ..service.user import TOKEN
from ..util.http_status import *
from ..model.model import BlacklistToken
from .. import db


"""
	service.auth provides three support functions for controller.auth:
	
	login()  -- help to support the login api
	signup() -- help to support the signup api
	logout() -- help to support the logout api
"""


class Auth:

    @staticmethod
    def login(data):
        """
            params: data

            json format user information data
                {
                    'email': user_email,
                    'password': password
                }

            for user login, user need to provide email and the password:
			after receiving the email and password, will do following:

			1. verify if the user exist at the database user table
			2. verify if the password is same as the database user table
			3. issue token according to id, email, firstname, lastname, mobile number

			return: resp_data
				{
		            'user_info': {
		                'id': user.id,
		                'email': user.email,
		                'first_name': user.first_name,
		                'last_name': user.last_name,
		                'mobile_no': user.mobile_no
		            },
		            'token': token,
		        }
        """

        email, password = \
            data['email'].strip(), data['password'].strip()
        user = User.query.filter_by(email=email).first()

        if not user:
            resp = make_response(jsonify({'error': 'Email does not exist'}))
            resp.status_code = SUCCESS
            return resp

        if not user.check_password(password):
            resp = make_response(jsonify({'error': 'Incorrect password'}))
            resp.status_code = SUCCESS
            return resp

        token = TOKEN.generate_token(user.id)

        resp_data = {
            'user_info': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'mobile_no': user.mobile_no,
                'url': user.url
            },
            'token': token,
        }

        return make_response(resp_data, SUCCESS)


    @staticmethod
    def logout(token):
        """
            params: token

            1. add the token into blacklist

            return: resp
                {
		            'status': 'success',
		            'message': 'logout success'
                }

        """

        black_token = BlacklistToken(token=token)

        db.session.add(black_token)
        db.session.commit()

        response_data = {
            'status': 'success',
            'message': 'logout success'
        }

        resp = make_response(jsonify(response_data))
        resp.status_code = SUCCESS

        return resp


    @staticmethod
    def signup(data):
        """
            param: data
                {
	                'id': user.id,
	                'email': user.email,
	                'first_name': user.first_name,
	                'last_name': user.last_name,
	                'mobile_no': user.mobile_no
		        }

            1. verify if the user already exist at the database user table according the email
            2. register new user according to the infomation at the database user table

            return: resp_data
                {
		            'id': user.id,
		            'email': user.email,
		            'first_name': user.first_name,
		            'last_name': user.last_name,
		            'mobile_no': user.mobile_no
		        }
        """

        email, first_name, last_name, mobile_no, password = \
            data['email'].strip(), data['first_name'].strip(), data['last_name'].strip(), data['mobile_no'].strip(), data['password'].strip()

        user = User.query.filter_by(email=email).first()

        if user:
            resp = make_response(jsonify({'error': 'User already exists'}))
            resp.status_code = SUCCESS

            return resp
        else:
            new_user = User(email=email, first_name=first_name, last_name=last_name, mobile_no=mobile_no)
            new_user.encrypt_password(password)  # store the encryption passoword

            db.session.add(new_user)
            db.session.commit()

            resp_data = {
                    'id': new_user.id,
                    'email': new_user.email,
                    'first_name': new_user.first_name,
                    'last_name': new_user.last_name,
                    'mobile_no': new_user.mobile_no
            }

            return resp_data

