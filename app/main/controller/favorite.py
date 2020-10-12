from flask import request
from flask_restplus import Resource
from ..util.dto import FavoriteListDto

api = FavoriteListDto.api
favorite_list_model = FavoriteListDto.favorite_list_model


@api.route('/wishlists')
class Favoritelist(Resource):
	@api.doc('favorite list')
	@api.response(200, 'success', model=favorite_list_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	def get(self):
		pass

