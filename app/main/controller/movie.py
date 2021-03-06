from flask import request, jsonify
from flask_restplus import Resource, marshal
from ..util.dto import MovieDto
from ..service.movie import *
from ..util.http_status import *
from ..util.decorator import token_required,token_optional
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


@api.route('')
class MoviesSearch(Resource):
	@api.doc('search movies')
	@api.response(200, 'success', model=search_result_model)
	@api.response(401, 'unauthorized')
	@api.param('favorite', description='(true/false) to get favorite movies')
	@api.param('watched', description='(true/false) to get watched movies')
	@api.param('search', description='required parameter for search keyword')
	@api.param('latest', description='(true/false) to get latest movies')
	@api.param('reviewed', description='(true/false) to get reviewed movies')
	@api.param('description', description='(true/false) optional parameter to search in movie description')
	@api.param('genre', description='search by genre. Takes list of genres as string')
	@api.param('cast', description='search in cast')
	@api.param('year_start', description='search movies released from year')
	@api.param('year_end', description='search movies released until year')
	@api.param('rating_start', description='minimum rating of the movie')
	@api.param('rating_end', description='maximum rating of the movie')
	@token_optional
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
		return marshal(movies, search_result_model), SUCCESS


@api.route('/<mid>')
class MovieRetrive(Resource):
	@api.doc('retrieve movie by id')
	@api.response(200, 'success', model=retrive_result_model)
	@token_optional
	def get(self, user, mid):
		"""
			This is for movie retrive from a specific user, mid as the parameter in the URL
			If this specific movie is found, then it will return all the movie informaion
		"""
		movie = retrieve_movie(user, int(mid))
		return marshal(movie, retrive_result_model)


@api.route('/<mid>/favorite')
class MovieFavorite(Resource):
	@api.doc('favorite a movie by id')
	@api.response(200, 'success')
	@api.response(401, 'unauthorized')
	@token_required
	def put(self, user, mid):
		"""
			user take the movie id as the part of URL, then favorite the specific movie
			If this specific movie is found, then it will be added to favorite list
		"""
		favorite_movie_user(user, mid)
		return jsonify({'favorite': 'success'}, SUCCESS)


@api.route('/<mid>/unfavorite')
class MovieUnfavorite(Resource):
	@api.doc('unfavorite a movie by id')
	@api.response(200, 'success')
	@api.response(401, 'unauthorized')
	@token_required
	def put(self, user, mid):
		"""
			user take the movie id as the part of URL, then unfavorite the specific movie
			If this specific movie is found, then it will be added to favorite list
		"""
		unfavorite_movie_user(user, mid)
		return jsonify({'favorite': 'success'}, SUCCESS)


@api.route('/<mid>/watched')
class MovieWatched(Resource):
	@api.doc('add movie to watched')
	@api.response(200, 'success')
	@api.response(401, 'unauthorized')
	@token_required
	def put(self, user, mid):
		"""
			user take the movie id as the part of URL, then watched the specific movie
			If this specific movie is found, then it will be added to watched list
		"""
		watched_movie_user(user, mid)
		return jsonify({'watched': 'success'}, SUCCESS)

	@api.doc('remove movie from watched list')
	@api.response(200, 'success')
	@api.response(401, 'unauthorized')
	@token_required
	def delete(self, user, mid):
		"""
			remove the movie from user watched list
		"""
		remove_watched_movie_user(user, mid)
		return jsonify({'remove watched': 'success'}, SUCCESS)


@api.route('/<mid>/wishlist')
class MovieWishlist(Resource):
	@api.doc('add movie to wish list')
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
	@api.doc('add review to a specific movie')
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
			return jsonify({'add review': 'success'}, SUCCESS)
		else:
			api.abort(NOT_FOUND, 'movie not found or review already added')

