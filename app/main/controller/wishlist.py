from flask import request
from flask_restplus import Resource, marshal
from ..util.dto import WishListDto
from ..util.decorator import token_required
from app.main.service.wishlist import *
import json
from ..http_status import *


api = WishListDto.api
wish_list_model = WishListDto.wish_list_model
new_wishlist_model = WishListDto.new_wishlist_model
new_wishlist_return_model = WishListDto.new_wishlist_return_model
wishlist_update_model= WishListDto.wishlist_update_model
wish_lists_model=WishListDto.wish_lists_model

@api.route('/')
class Wishlist(Resource):

	@api.doc('adding new wishlist')
	@api.response(200, 'Success')
	@api.expect(new_wishlist_model)
	@api.response(400, 'unauthorized')
	@token_required
	def put(self, user):
		user_id = user['id']

		if user_id:
			info = json.loads(request.get_data())
			wishlist = create_wishlist(info, user_id)
			if wishlist=={}:
				resp = make_response(jsonify({'message': 'please enter valid status'}))
				resp.status_code = BAD_REQUEST
				return resp
			else:

				return marshal(wishlist, new_wishlist_return_model), SUCCESS

		else:
			api.abort(400, 'invalid operation')

	@api.doc('get all wishlists of user')
	@api.response(200, 'Success')
	@api.response(400, 'unauthorized')
	@token_required
	def get(self,user):
		user_id = user['id']

		if user_id:

			wishlist = get_all_wishlists(user_id)
			return marshal(wishlist, wish_lists_model), SUCCESS
		else:

			api.abort(400, 'invalid operation')




@api.route('/<id>')
class Wishlist(Resource):

	@api.doc('get wishlist of user')
	@api.response(200, 'success')
	@api.response(400, 'invalid')
	@token_required
	def get(self, user, id):

		user_id = user['id']

		if user_id:

			wishlist = get_wishlist(id, user_id)
			return marshal(wishlist, wish_list_model), SUCCESS
		else:

			api.abort(400, 'invalid operation')

	@api.doc('deleting new wishlist')
	@api.response(200, 'Success')
	@api.response(400, 'unauthorized')
	@token_required
	def delete(self, user, id):
		user_id = user['id']


		if user_id:

			response = delete_wishlist(id, user_id)
			return response

		else:
			api.abort(400, 'invalid operation')

	@api.doc('update wishlist of user')
	@api.expect(wishlist_update_model)
	@api.response(200, 'success')
	@api.response(400, 'invalid')
	@token_required
	def post(self, user, id):
		user_id = user['id']

		if user_id:

			updated_info = json.loads(request.get_data())

			response = update_wishlist(updated_info, id, user_id)
			return response

		else:
			api.abort(400, 'invalid operation')

