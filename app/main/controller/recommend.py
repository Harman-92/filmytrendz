from flask import request
from flask_restplus import Resource, marshal
from ..service.movie import *
from ..http_status import *
from ..util.decorator import token_required
from ..util.dto import RecommendationDto

api = RecommendationDto.api
recommendation_movies_model = RecommendationDto.recommendation_movies_model


@api.route('/')
class MoviesSearch(Resource):
	@api.doc('movie recommendations')
	@api.response(200, 'success', model=recommendation_movies_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@token_required
	def get(self):
		"""
			receive request and get URL arguments including name, description, director
			genre, year, language, country. All these searching conditions are optional
			but if you want run search you need to input at least one searching condition
		"""
		pass

