from flask import request
from flask_restplus import Resource
from ..util.dto import ReviewDto
from ..service.review import *
from ..util.decorator import token_required
import json
from ..util.http_status import *


api = ReviewDto.api


"""
    review api:
    delete -- help user to delete a review
    update -- help user to update a review
"""


@api.route('/<rid>')
class Review(Resource):
    @api.doc('delete review')
    @api.response(200, 'success')
    @api.response(400, 'invalid')
    @api.response(401, 'unauthorized')
    @token_required
    def delete(self, user, rid):
        """
            delete a review with the review id
        """
        user_id = user['id']

        if user_id:
            response = delete_review(rid, user_id)

            return response
        else:
            api.abort(BAD_REQUEST, 'invalid operation')


    @api.doc('update review')
    @api.response(200, 'success')
    @api.response(400, 'invalid')
    @api.response(401, 'unauthorized')
    @token_required
    def post(self, user, rid):
        """
			update review with the review id
        """
        user_id = user['id']

        if user_id:
            data = json.loads(request.get_data())
            response = update_review(data, rid, user_id)

            return response
        else:
            api.abort(BAD_REQUEST, 'invalid operation')

