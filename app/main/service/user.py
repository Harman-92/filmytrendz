from time import time
from itsdangerous import SignatureExpired, BadSignature
from itsdangerous import TimedJSONWebSignatureSerializer as JWTSerializer, JSONWebSignatureSerializer
from flask import jsonify, make_response
from sqlalchemy.orm import load_only

from app.main import db
from app.main.model.model import *
from app.main.config import key
from ..http_status import *
import datetime


def get_all_users():
    return User.query.all()


def get_user(id):
    return User.query.filter_by(id=id).first()


def ban_user(banid, id):

    user1 = User.query.filter_by(id=id).first()


    if banid['id'] and (banid['id']!=id):
        user2 = User.query.filter_by(id=banid['id']).first()
        new_block = BannedUser(user_id=user1.id, banned_user_id=user2.id)
        db.session.add(new_block)
        db.session.commit()
        resp = make_response(jsonify({'message': 'banned user added succesfully'}))
        resp.status_code = SUCCESS
        return resp

    else:

        resp = make_response(jsonify({'message': 'no access'}))
        resp.status_code = UNAUTHORIZED
        return resp


def del_ban_user(banid, user_id):


    if banid['id']:

        banned_row=BannedUser.query.filter_by(user_id=user_id,banned_user_id=banid['id']).first()
        db.session.delete(banned_row)
        db.session.commit()
        resp = make_response(jsonify({'message': 'banned user deleted succesfully'}))
        resp.status_code = SUCCESS
        return resp


    else:

        resp = make_response(jsonify({'message': 'no access'}))
        resp.status_code = UNAUTHORIZED
        return resp


def get_banned_user(userid):
    banned_users = {'banned_users': []}
    for row in BannedUser.query.filter_by(user_id=userid).all():
        banned_users['banned_users'].append(User.query.filter_by(id=row.banned_user_id).first())

    return banned_users


def update_user(updated_info, userid):
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
    user = User.query.filter_by(id=userid).first()
    oldpass = updated_info['old_password']
    newpass = updated_info['new_password']



    if not user.check_password(oldpass):
        resp = make_response(jsonify({'message': 'incorrect old password'}))
        resp.status_code = BAD_REQUEST
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


class AuthenticationToken:
    def __init__(self, secret_key, expires_in):
        self.secret_key = secret_key
        self.expires_in = expires_in
        self.serializer = JSONWebSignatureSerializer(secret_key)

    def generate_token(self, userid):
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
        try:
            payload = self.serializer.loads(token.encode())
        except SignatureExpired:
            return None
        except BadSignature:
            return None

        return payload


EXPIRE = 6000
TOKEN = AuthenticationToken(key, EXPIRE)