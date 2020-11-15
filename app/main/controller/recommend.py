from flask import request
from flask_restplus import Resource, marshal
from ..service.movie import *
from ..service.recommend import recommend_user, recommend_movie
from ..util.decorator import token_required
from ..util.dto import RecommendationDto


api = RecommendationDto.api
recommendation_movies_model = RecommendationDto.recommendation_movies_model


"""
	There are two recommendation api:
	1. make recommendation according to a specific movie
	2. make recommendation for a specific user
"""


@api.route('/<mid>')
class MoviesSearch(Resource):
	@api.doc('movie recommendations')
	@api.response(200, 'success', model=recommendation_movies_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@api.param('genre', description='make recommendation according to genre')
	@api.param('director', description='make recommendation according to director')
	def get(self, mid):
		"""
			make recommendation for a specific movie according to movie genre and director
		"""

		conditions = request.args
		target_movie = Movie.query.filter_by(id=int(mid)).first()

		if not target_movie:
			api.abort(404, 'the movie does not exist')

		res = recommend_user(conditions, target_movie)

		return marshal(res, recommendation_movies_model)


@api.route('/user')
class MoviesUser(Resource):
	@api.doc('movie recommendations')
	@api.response(200, 'success', model=recommendation_movies_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@token_required
	def get(self, user):
		"""
			this will generate the recommendations for a specific user according to
			the user favorites and user top ratings for some movies.
		"""

		res = recommend_movie(user)

		return marshal(res, recommendation_movies_model)

