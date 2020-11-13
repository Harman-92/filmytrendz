from .. import db
from ..model.model import Review, User
from flask import jsonify, make_response
from ..util.http_status import *



"""
	service.review provides supported functions for controll.review
	delete_review() -- support delete api
	update_review() -- support update api
"""


def delete_review(user_id, review_id):
	"""
		param: user_id, review_id
		- user_id is the unique id for user at the database
		- review_id is the unique id for review at the database

		1. lookup the user according to user id
		2. lookup the review according to review id
		3. delete and update state into database

		return: resp
	"""
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


def update_review(data, user_id, review_id):
	"""
		param: data, user_id, review_id
		- data, updated data for the specific review
		- user_id is the unique id for user at the database
		- review_id is the unique id for review at the database

		1. lookup the user according to user id
		2. lookup the review according to review id
		3. update the review and write into database

		return: resp
	"""
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

