from time import time
from flask import jsonify, make_response
from app.main import db
from app.main.model.model import *
from app.main.config import key
from ..http_status import *


def create_wishlist(data, user_id):
    """
    params: data, user_id
    creates a wishlist with its name and status linked to a particular user
    """
    user = User.query.filter_by(id=user_id).first()
    wishlist = Wishlist(name=data['name'], of_user=user)
    try:
        if 'status' in data.keys():
            wishlist.status = Access[data['status']]
    except KeyError:
        resp = make_response(jsonify({'error': 'Invalid Access parameter'}))
        return resp

    db.session.add(wishlist)
    db.session.commit()
    return wishlist


def delete_wishlist(wishlist_id, user_id):
    """
        params: wishlist_id, user_id
        this is the functionality to delete a wishlist linked to a user
    """
    wishlist = Wishlist.query.filter_by(id=wishlist_id).first()
    user = User.query.filter_by(id=user_id).first()

    if wishlist in user.wish_lists:

        db.session.delete(wishlist)
        db.session.commit()
        resp = make_response(jsonify({'message': 'wishlist of user deleted succesfully'}))
        resp.status_code = SUCCESS
        return resp

    else:
        resp = make_response(jsonify({'message': 'wishlist with id do not exist for user'}))
        resp.status_code = NOT_FOUND
        return resp


def update_wishlist(updated_info, wishlist_id, user_id):
    """
        params: id,updated_info,wishlish_id
        this is the function to update a wishlist linked to a user with its updated info

        update functionalities include, adding/deleting moving, updating name and status.
    """
    if 'new_list' in updated_info.keys():
        new_list = updated_info['new_list']
    else:
        new_list = []
    if 'remove_list' in updated_info.keys():
        remove_list = updated_info['remove_list']
    else:
        remove_list = []


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
            wishlist.name = updated_info['name']

        if 'status' in updated_info.keys():
            try:
                wishlist.status = Access[updated_info['status']]
            except KeyError:
                resp = make_response(jsonify({'error': 'Invalid Access parameter'}))
                return resp
        db.session.commit()
        resp = make_response(jsonify({'message': 'updated wishlist succesfully'}))
        resp.status_code = SUCCESS
        return resp

    else:
        resp = make_response(jsonify({'message': 'wishlist with id do not exist for user'}))
        resp.status_code = NOT_FOUND
        return resp


def get_wishlist(wishlist_id, user):
    """
        params: wishlist_id, user_id
        this is the function to get all information of a wishlist linked to a user.
    """
    wishlist_info = {"movies": []}
    wishlist = Wishlist.query.filter_by(id=wishlist_id).first()
    if user:
        user = User.query.filter_by(id=user['id']).first()

    if wishlist.status == Access.PRIVATE:
        if (not user) or (user and wishlist not in user.wish_lists):
            resp = make_response(jsonify({'error': 'Access to Wish list is denied'}))
            resp.status_code = SUCCESS
            return resp

    wishlist_info['name'] = wishlist.name
    wishlist_info['id'] = wishlist.id
    wishlist_info['status'] = wishlist.status.name

    for x in wishlist.movies:
        wishlist_info['movies'].append(Movie.query.filter_by(id=x.id).first())
    return wishlist_info


def get_all_wishlists(user_id):
    """
        params: user_id
        this is the function to get all information of every wishlists linked to a user with its
    """
    wishlists_info = {"wishlists": []}
    user = User.query.filter_by(id=user_id).first()

    for wishlist in user.wish_lists:
        wishlist_info = {"movies": [], 'name': wishlist.name, 'id': wishlist.id, 'status': wishlist.status.name}

        for x in wishlist.movies:
            wishlist_info['movies'].append(Movie.query.filter_by(id=x.id).first())

        wishlists_info["wishlists"].append(wishlist_info)

    return wishlists_info
