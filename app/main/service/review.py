from datetime import datetime
from .. import db
from app.main.model.model import Review, User
from flask import jsonify, make_response
from ..http_status import *

def delete_review(user_id,review_id):
    user = User.query.filter_by(id=user_id).first()
    review = Review.query.filter_by(id=review_id).first()

    if user and (review in user.reviews):

        db.session.delete(review)
        db.session.commit()

        resp = make_response(jsonify({'message': 'banned user deleted succesfully'}))
        resp.status_code = SUCCESS
        return resp

    else:

        resp = make_response(jsonify({'message': 'no access'}))
        resp.status_code = UNAUTHORIZED
        return resp


def update_review(data,user_id,review_id):
    user = User.query.filter_by(id=user_id).first()
    review = Review.query.filter_by(id=review_id).first()

    if user and (review in user.reviews):

        for key, value in data.items():
            if data[key]:
                if key == 'id':
                    continue
                if key == 'review_text':
                    review.review_text = data[key]
                elif key == 'rating':
                    review.rating = float(data[key])
                else:
                    setattr(review, key, value)

        db.session.add(review)
        db.session.commit()

        resp = make_response(jsonify({'message': 'review updated succesfully'}))
        resp.status_code = SUCCESS
        return resp

    else:

        resp = make_response(jsonify({'message': 'no access'}))
        resp.status_code = UNAUTHORIZED
        return resp




