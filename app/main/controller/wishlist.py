from flask import request
from flask_restplus import Resource
from ..util.dto import WishListDto

api = WishListDto.api
wish_list_model = WishListDto.wish_list_model
wish_lists_model = WishListDto.wish_lists_model


@api.route('/wishlists')
class Wishlist(Resource):
	@api.doc('wish lists')
	@api.response(200, 'success', model=wish_lists_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	def get(self):
		pass

