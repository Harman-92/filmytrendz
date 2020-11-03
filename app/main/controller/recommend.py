from flask import request
from flask_restplus import Resource, marshal
from ..service.movie import *
from ..http_status import *
from ..util.decorator import token_required
from ..util.dto import RecommendationDto

api = RecommendationDto.api
recommendation_movies_model = RecommendationDto.recommendation_movies_model


"""
specific movie
"""


@api.route('/<mid>')
class MoviesSearch(Resource):
	@api.doc('movie recommendations')
	@api.response(200, 'success', model=recommendation_movies_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@token_required
	def get(self, mid):
		"""
			receive request and get URL arguments including name, description, director
			genre, year, language, country. All these searching conditions are optional
			but if you want run search you need to input at least one searching condition
			/<mid>?genre=True
		"""
		# mid from the user
		# query the db --> instance of movie



		# API


		# list of ID
		# handle the response myself
		pass



"""
specific user
"""


@api.route('/user/')
class MoviesUser(Resource):
	@api.doc('movie recommendations')
	@api.response(200, 'success', model=recommendation_movies_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@token_required
	def get(self, user):
		"""
			receive request and get URL arguments including name, description, director
			genre, year, language, country. All these searching conditions are optional
			but if you want run search you need to input at least one searching condition
			/<mid>?genre=True
		"""
		# userID
		# list of movie ids for favorite, last 5
		# list of movie ids according to reviews for this user, top 5 based on rating


		# give me a list of id
		pass

