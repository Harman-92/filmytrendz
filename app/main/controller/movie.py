from flask import request, jsonify
from flask_restplus import Resource, marshal
from ..util.dto import MovieDto
from ..service.movie import *
from ..http_status import *
from ..util.decorator import token_required

api = MovieDto.api
movie_model = MovieDto.movie_model
review_model = MovieDto.review_model
cast_model = MovieDto.cast_model
recommand_movie_model = MovieDto.recommand_movie_model
search_result_model = MovieDto.search_result_model
retrive_result_model = MovieDto.retrive_result_model


@api.route('/')
class MoviesSearch(Resource):
	@api.doc('retrive movies')
	@api.response(200, 'success', model=search_result_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@token_required
	def get(self):
		"""
		receive request and get URL arguments including name, description, director
		genre, year, language, country. All these searching conditions are optional
		but if you want run search you need to input at least one searching condition
		"""
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
class MovieRetrive(Resource):
	@api.doc('retrive movies')
	@api.response(200, 'success', model=retrive_result_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@api.param('mid', description='take movie id as parameter')
	@token_required
	def get(self, user, mid):
		"""
			This is for movie retrive from a specific user, mid as the parameter in the URL
			If this specific movie is found, then it will return all the movie informaion
		"""
		movie = retrive_movie(user, mid)
		if movie:
			return marshal(movie, retrive_result_model)
		else:
			api.abort(404, 'movie not found')


@api.route('/<mid>/favorite')
class MovieFavorite(Resource):
	@api.doc('review movie')
	@api.response(200, 'success')
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@api.param('mid', description='take movie id as parameter')
	@token_required
	def put(self, user, mid):
		"""
			user take the movie id as the part of URL, then favorite the specific movie
			If this specific movie is found, then it will be added to favorite list
		"""
		if favorite_movie_user(user, mid):
			return jsonify({'favorite': 'success'}, SUCCESS)
		else:
			api.abort(404, 'movie not found')

