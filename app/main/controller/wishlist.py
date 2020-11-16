from flask import request
from flask_restplus import Resource, marshal
from ..util.dto import WishListDto
from ..util.decorator import token_required, token_optional
from ..service.wishlist import *
import json
from ..util.http_status import *


api = WishListDto.api
wish_list_model = WishListDto.wish_list_model
new_wishlist_model = WishListDto.new_wishlist_model
new_wishlist_return_model = WishListDto.new_wishlist_return_model
wishlist_update_model = WishListDto.wishlist_update_model
wish_lists_model = WishListDto.wish_lists_model


@api.route('')
class Wishlist(Resource):

	@api.doc('add a new wish list')
	@api.response(200, 'Success')
	@api.expect(new_wishlist_model)
	@api.response(400, 'unauthorized')
	@token_required
	def put(self, user):
		"""
			This is a functionality to add new wishlist for the logged in user.
		"""
		user_id = user['id']
		info = json.loads(request.get_data())
		wishlist = create_wishlist(info, user_id)
		if not wishlist:
			resp = make_response(jsonify({'message': 'please enter valid status'}))
			resp.status_code = BAD_REQUEST
			return resp
		else:
			return marshal(wishlist, new_wishlist_return_model), SUCCESS

	@api.doc('get all wish lists of user')
	@api.response(200, 'success', model=wish_lists_model)
	@api.response(401, 'unauthorized')
	@token_required
	def get(self, user):
		"""
			This is the functionality to add new wishlist for the logged in user.
		"""
		user_id = user['id']
		wishlist = get_all_wishlists(user_id)
		return marshal(wishlist, wish_lists_model), SUCCESS


@api.route('/<id>')
class Wishlist(Resource):

	@api.doc('get wish list of user by id')
	@api.response(200, 'success', model=wish_list_model)
	@api.response(401, 'unauthorized')
	@token_optional
	def get(self, user, id):
		"""
			This is the functionality to get all information of a wishlist given its id
		"""
		response = get_wishlist(id, user)
		if type(response) == dict:
			return marshal(response, wish_list_model), SUCCESS
		else:
			return response

	@api.doc('delete a wish list by id')
	@api.response(200, 'Success')
	@api.response(400, 'unauthorized')
	@token_required
	def delete(self, user, id):
		"""
			This is the functionality to delete a wishlist linked to a user
		"""
		user_id = user['id']

		if user_id:

			response = delete_wishlist(id, user_id)
			return response

		else:
			api.abort(BAD_REQUEST, 'invalid operation')

	@api.doc('update wish list')
	@api.expect(wishlist_update_model)
	@api.response(200, 'success')
	@api.response(401, 'unauthorized')
	@token_required
	def post(self, user, id):
		"""
			This is the functionality to update a wishlist linked to a user
		"""
		user_id = user['id']
		updated_info = json.loads(request.get_data())
		response = update_wishlist(updated_info, id, user_id)
		return response

