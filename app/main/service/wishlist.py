from time import time
from flask import jsonify, make_response
from app.main import db
from app.main.model.model import *
from app.main.config import key
from ..http_status import *


def create_wishlist(data,user_id):
    wishlist_name, status = \
        data['name'], data['status']
    user = User.query.filter_by(id=user_id).first()
    if status == 'public':
        wishlist=Wishlist(name=wishlist_name, of_user=user)
    else:
        wishlist = Wishlist(name=wishlist_name, of_user=user, status=Privacy.PRIVATE)
    db.session.add(wishlist)
    db.session.commit()

    return wishlist


def delete_wishlist(wishlist_id,user_id):

    wishlist = Wishlist.query.filter_by(id=wishlist_id).first()
    user = User.query.filter_by(id=user_id).first()

    if wishlist in user.wish_lists:

        db.session.delete(wishlist)
        db.session.commit()
        resp = make_response(jsonify({'message': 'banned user deleted succesfully'}))
        resp.status_code = SUCCESS
        return resp

    else:
        resp = make_response(jsonify({'message': 'wishlist with id do not exist for user'}))
        resp.status_code = NOT_FOUND
        return resp

def update_wishlist(updated_info,wishlist_id,user_id):
    new_list=updated_info['new_list']
    remove_list = updated_info['remove_list']
    wishlist = Wishlist.query.filter_by(id=wishlist_id).first()

    user = User.query.filter_by(id=user_id).first()


    if wishlist in user.wish_lists:
        for x in new_list:
            movie = Movie.query.filter_by(id=x).first()
            wishlist.movies.append(movie)

        for x in remove_list:
            movie = Movie.query.filter_by(id=x).first()
            wishlist.movies.remove(movie)

        if 'name' in updated_info.keys():
            wishlist.name=updated_info['name']

        db.session.commit()
        resp = make_response(jsonify({'message': 'updated wishlist succesfully'}))
        resp.status_code = SUCCESS
        return resp

    else:
        resp = make_response(jsonify({'message': 'wishlist with id do not exist for user'}))
        resp.status_code = NOT_FOUND
        return resp

def get_wishlist(wishlist_id,user_id):
    wishlist_info = {"movies":[]}

    wishlist = Wishlist.query.filter_by(id=wishlist_id).first()

    user = User.query.filter_by(id=user_id).first()

    wishlist_info['name'] = wishlist.name
    wishlist_info['id'] = wishlist.id

    if wishlist in user.wish_lists:
        for x in wishlist.movies:

            wishlist_info['movies'].append(Movie.query.filter_by(id=x.id).first())

        return wishlist_info

    else:

        return wishlist_info





