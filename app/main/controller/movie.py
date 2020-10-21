from flask import request, jsonify
from flask_restplus import Resource, marshal
from ..util.dto import MovieDto
from ..service.movie import *
from ..http_status import *

api = MovieDto.api
movie_model = MovieDto.movie_model
review_model = MovieDto.review_model
cast_model = MovieDto.cast_model
recommand_movie_model = MovieDto.recommand_movie_model
search_result_model = MovieDto.search_result_model


"""
receive request and get URL arguments including name, description, director
genre, year, language, country. All these searching conditions are optional
but if you want run search you need to input at least one searching condition
"""


@api.route('/')
class MoviesSearch(Resource):
	@api.doc('retrive movies')
	@api.response(200, 'success', model=search_result_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	def get(self):
		conditions = request.args
		movie_list = search_movies(dict(conditions))
		movies = {
			"movies": movie_list
		}
		if movie_list:
			return marshal(movies, search_result_model), SUCCESS
		else:
			return marshal(movies, search_result_model), NOT_FOUND


@api.route('/<mid>')
class MoviesRetrive(Resource):
	@api.doc('retrive movies')
	@api.response(200, 'success', model=search_result_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	def get(self, user, mid):
		movie = retrive_movie(user, mid)

		return movie


@api.route('/review')
class MovieReviews(Resource):
	@api.doc('review movie')
	@api.response(200, 'success', model=review_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@api.param('id', description='take movie id as parameter')
	def post(self):
		pass

