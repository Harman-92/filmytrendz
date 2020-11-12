from flask import request, jsonify
from flask_restplus import Resource, marshal
from ..util.dto import MovieDto
from ..service.movie import *
from ..http_status import *
from ..util.decorator import token_required
import json

api = MovieDto.api
movie_model = MovieDto.movie_model
review_model = MovieDto.review_model
recommand_movie_model = MovieDto.recommand_movie_model
search_result_model = MovieDto.search_result_model
retrive_result_model = MovieDto.retrive_result_model


"""
	Movie Api:
	search      -- search movies according to keywords
	retrieve    -- retrieve specific movie according to movie id
	favorite    -- add specific movie to favorite list
	unfavorite  -- unfavorite a movie
	watched     -- add specific movie to watched history
	review      -- add new review to a specific movie
"""


@api.route('/')
class MoviesSearch(Resource):
	@api.doc('search movies')
	@api.response(200, 'success', model=search_result_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@api.param('favorite', description='search movie with favorite list')
	@api.param('watched', description='search movie with watched list')
	@api.param('search', description='search movie with keywords')
	@api.param('latest', description='search the latest movies')
	@api.param('reviewed', description='return all reviewed movies')
	@token_required
	def get(self, user):
		"""
			receive request and get URL arguments including name, description, director
			genre, year, language, country. All these searching conditions are optional
			but if you want run search you need to input at least one searching condition

			There are four cases:

			case 1: /movie?favorite=true
			case 2: /movie?watched=true
			case 3: /movie?search=keyword&name=true&description=true...
			case 4: /movie?latest=true
			case 5: /movie?reviewed=true
		"""
		conditions = request.args
		movie_list = search_movies(user, dict(conditions))
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
	def get(self, mid, user=None):
		"""
			This is for movie retrive from a specific user, mid as the parameter in the URL
			If this specific movie is found, then it will return all the movie informaion
		"""
		movie = retrieve_movie(user, mid)
		if movie:
			return marshal(movie, retrive_result_model)
		else:
			api.abort(404, 'movie not found')


@api.route('/<mid>/favorite')
class MovieFavorite(Resource):
	@api.doc('movie favorite')
	@api.response(200, 'success')
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
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


@api.route('/<mid>/unfavorite')
class MovieUnfavorite(Resource):
	@api.doc('movie unfavorite')
	@api.response(200, 'success')
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@token_required
	def put(self, user, mid):
		"""
			user take the movie id as the part of URL, then unfavorite the specific movie
			If this specific movie is found, then it will be added to favorite list
		"""
		if unfavorite_movie_user(user, mid):
			return jsonify({'favorite': 'success'}, SUCCESS)
		else:
			api.abort(404, 'movie not found')


@api.route('/<mid>/watched')
class MovieWatched(Resource):
	@api.doc('movie watched')
	@api.response(200, 'success')
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@token_required
	def put(self, user, mid):
		"""
			user take the movie id as the part of URL, then watched the specific movie
			If this specific movie is found, then it will be added to watched list
		"""
		if watched_movie_user(user, mid):
			return jsonify({'watched': 'success'}, SUCCESS)
		else:
			api.abort(NOT_FOUND, 'movie not found')


	@api.doc('remove movie from watched list')
	@api.response(200, 'success')
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@token_required
	def delete(self, user, mid):
		"""
			remove the movie from user watched list
		"""
		if remove_watched_movie_user(user, mid):
			return jsonify({'remove watched': 'success'}, SUCCESS)
		else:
			api.abort(NOT_FOUND, 'movie not found')


@api.route('/<mid>/wishlist')
class MovieWishlist(Resource):
	@api.doc('movie watched')
	@api.response(200, 'success')
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@token_required
	def put(self, user, mid):
		"""
			user take the movie id as the part of URL, then add the specific movie
			to some wishlists. If this specific movie is found, then it will be
			added to the wishlists given from user.
		"""
		if not request.data:
			api.abort(BAD_REQUEST, 'no wishlist data found')
		data = json.loads(request.data)
		if data and add_movie_wishlist(user, mid, data):
			return jsonify({'addtowishlist': 'success'}, SUCCESS)
		else:
			""" movie or wishlist doesn't exist """
			api.abort(NOT_FOUND, 'movie or wishlist not found')


@api.route('/<mid>/review')
class MovieReview(Resource):
	@api.doc('add reviews to a specific movie')
	@api.response(200, 'success')
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@token_required
	def post(self, user, mid):
		"""
			user may want to add reviews to the specific movie, which
			given movie id and the new review data from user.
		"""
		if not request.data:
			api.abort(BAD_REQUEST, 'no review data found')
		data = json.loads(request.data)
		if data and add_review_movie(user, mid, data):
			return jsonify({'addreview': 'success'}, SUCCESS)
		else:
			api.abort(NOT_FOUND, 'movie not found')

