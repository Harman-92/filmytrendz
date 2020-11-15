from time import time
from itsdangerous import SignatureExpired, BadSignature
from itsdangerous import TimedJSONWebSignatureSerializer as JWTSerializer, JSONWebSignatureSerializer
from flask import jsonify, make_response
from ..model.model import *
from ..config import key
from ..util.http_status import *

"""
	service.user provides supported functions for the controller.user
"""


def ban_user(banid, id):
	"""
		param: banid, id
		- banid is the unique id for banned list at the database
		- id is the unique id for banned list at the database
	"""

	user1 = User.query.filter_by(id=id).first()

	if 'id' in banid.keys() and (banid['id'] != id):
		user2 = User.query.filter_by(id=banid['id']).first()

		new_block = BannedUser(user_id=user1.id, banned_user_id=user2.id)
		db.session.add(new_block)
		db.session.commit()

		resp = make_response(jsonify({'message': 'banned user added succesfully'}))
		resp.status_code = SUCCESS

		return resp
	else:
		resp = make_response(jsonify({'error': 'Unable to ban the user'}))
		resp.status_code = UNAUTHORIZED

		return resp


def del_ban_user(banid, user_id):
	"""
		params: userid ,banid
		return: this function lets the logged in user ban the user with id as banid.
	"""

	banned_row = BannedUser.query.filter_by(user_id=user_id, banned_user_id=banid).first()
	db.session.delete(banned_row)
	db.session.commit()

	resp = make_response(jsonify({'message': 'banned user deleted succesfully'}))
	resp.status_code = SUCCESS

	return resp


def get_banned_user(userid):
	"""
		params: userid
		return: this function returns users the logged in user has banned.
	"""
	banned_users = {'banned_users': []}
	for row in BannedUser.query.filter_by(user_id=userid).all():
		banned_users['banned_users'].append(User.query.filter_by(id=row.banned_user_id).first())

	return banned_users


def update_user(updated_info, userid):
	"""
		params: userid , updated_info
		return: this function updates the user info in our database with updated user info
	"""
	user = User.query.filter_by(id=userid).first()

	for key, value in updated_info.items():

		if key == 'id':
			continue
		else:
			setattr(user, key, value)

	db.session.add(user)
	db.session.commit()

	return user


def update_password(updated_info, userid):
	"""
		params: userid , updated_info
		return: this function updates the user info in our database with updated user password
	"""
	user = User.query.filter_by(id=userid).first()
	oldpass = updated_info['old_password']
	newpass = updated_info['new_password']

	if not user.check_password(oldpass):
		resp = make_response(jsonify({'error': 'Old Password Incorrect'}))
		resp.status_code = SUCCESS
		return resp
	else:
		user.encrypt_password(newpass)
		db.session.add(user)
		db.session.commit()

		resp = make_response(jsonify({'message': 'password changed sucessfully'}))
		resp.status_code = SUCCESS
		return resp


def save_changes(data):
	db.session.add(data)
	db.session.commit()


def get_all_users():
	return User.query.all()


def get_user(id):
	"""
		function to retrieve user information from the database
	"""
	return User.query.filter_by(id=id).first()


class AuthenticationToken:
	def __init__(self, secret_key, expires_in):
		self.secret_key = secret_key
		self.expires_in = expires_in
		self.serializer = JSONWebSignatureSerializer(secret_key)

	def generate_token(self, userid):
		"""
			params: userid:
			return: returns a token for the user for a session
		"""
		serializer = JWTSerializer(
			secret_key=key,
			expires_in=self.expires_in
		)
		payload = {
			'id': userid,
			'time': time()

		}

		token = self.serializer.dumps(payload)

		return token.decode()

	def validate_token(self, token):
		"""
			params: token
			return: validates whether a token is valid for a logged in user
		"""
		try:
			payload = self.serializer.loads(token.encode())
		except SignatureExpired:
			return None
		except BadSignature:
			return None

		return payload


"""
	EXPIRE is the fixed time period for a token, after this EXPIRE the token
	will be NOT valid, 6000 means 6000 seconds, which is a proper expire duration.
"""
EXPIRE = 6000
TOKEN = AuthenticationToken(key, EXPIRE)
