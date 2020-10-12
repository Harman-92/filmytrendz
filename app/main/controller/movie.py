from flask import request
from flask_restplus import Resource
from ..util.dto import MovieDto

api = MovieDto.api
movie_model = MovieDto.movie_model
review_model = MovieDto.review_model
cast_model = MovieDto.cast_model
recommand_movie_model = MovieDto.recommand_movie_model
search_result_model = MovieDto.search_result_model


@api.route('/')
class Movies(Resource):
	@api.doc('retrive movies')
	@api.response(200, 'success', model=search_result_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	def get(self):
		pass


@api.route('/review')
class MovieReviews(Resource):
	@api.doc('review movie')
	@api.response(200, 'success', model=review_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	@api.param('id', description='take movie id as parameter')
	def post(self):
		pass

