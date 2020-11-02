
from flask import request
from flask_restplus import Resource, marshal
from ..util.dto import ReviewDto
from app.main.service.review import *
from ..util.decorator import token_required
import json
from ..http_status import *


api = ReviewDto.api


@api.route('/<rid>')
class Review(Resource):

    @api.doc('delete review')
    @api.response(200, 'success')
    @api.response(400, 'invalid')
    @api.response(401, 'unauthorized')
    @token_required
    def delete(self, user,rid):

        user_id = user['id']

        if user_id:

            response = delete_review(rid, user_id)
            return response

        else:
            api.abort(400, 'invalid operation')

    @api.doc('delete review')
    @api.response(200, 'success')
    @api.response(400, 'invalid')
    @api.response(401, 'unauthorized')
    @token_required
    def post(self,user,rid):

        user_id = user['id']

        if user_id:
            data = json.loads(request.get_data())
            response = update_review(data, rid, user_id)
            return response

        else:
            api.abort(400, 'invalid operation')


