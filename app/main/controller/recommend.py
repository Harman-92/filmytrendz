from flask import request
from flask_restplus import Resource, marshal
from ..service.movie import *
from ..http_status import *
from ..util.decorator import token_required
from ..util.dto import RecommendationDto
from ..service.movie import get_all_favorites

api = RecommendationDto.api
recommendation_movies_model = RecommendationDto.recommendation_movies_model


"""
	recommendation for a specific movie
"""


@api.route('/<mid>')
class MoviesSearch(Resource):
	@api.doc('movie recommendations')
	@api.response(200, 'success', model=recommendation_movies_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@api.param('mid', description='take the movie id need to be recommendation')
	@api.param('genre', description='make recommendation according to genre')
	# @api.param('year', description='make recommendation according to year')
	# @api.param('language', description='make recommendation according to language')
	# @api.param('country', description='make recommendation according to country')
	# @api.param('name', description='make recommendation according to name')
	# @api.param('description', description='make recommendation according to description')
	@api.param('director', description='make recommendation according to director')
	@token_required
	def get(self, mid):
		"""
			receive request and get URL arguments including name, description, director
			genre, year, language, country. All these searching conditions are optional
			but if you want run search you need to input at least one searching condition
		"""

		target_movie = Movie.query.filter_by(id=mid).first()
		rec_movies = ['id', 'id'] # get from third party api



"""
specific user
"""


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
		# userID
		user_id = user['id']
		cur_user = User.query.filter_by(id=user['id']).first()
		# list of movie ids for favorite, last 5
		favorite_movies = list(get_all_favorites(cur_user))[:5]

		rec_movies = []

		# give me a list of id

