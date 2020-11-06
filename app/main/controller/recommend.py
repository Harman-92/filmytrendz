from flask import request
from flask_restplus import Resource, marshal
from ..service.movie import *
from ..service.recommend import encapsolate_res
from ..util.decorator import token_required
from ..util.dto import RecommendationDto
from ..service.movie import get_all_favorites
import pandas as pd
import tmdbsimple as ts


ts.API_KEY = 'e8ad3a064b09b320f171bc110b451cfd'


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
	@api.param('director', description='make recommendation according to director')
	@token_required
	def get(self, user, mid):
		"""
			receive request and get URL arguments including name, description, director
			genre, year, language, country. All these searching conditions are optional
			but if you want run search you need to input at least one searching condition
		"""

		conditions = request.args
		target_movie = Movie.query.filter_by(id=mid).first()
		flag = 0
		if 'genre' in conditions:
			flag = 1
		if 'director' in conditions:
			flag = 2

		movie_id = str(target_movie.tmdb_id)
		director = target_movie.tmdb_id.split()[0]

		rec_gen = pd.json_normalize(ts.Movies(id=movie_id).recommendations()['results'])['id'].tolist()
		rec_genre = pd.json_normalize(ts.Movies(id=movie_id).similar_movies()['results'])['id].tolist()
		rec_dir = set(rec_gen + rec_genre)
		rec_dir = list(rec_dir)

		rec_movies = []
		if flag == 0:
			rec_movies = rec_gen
		elif flag == 1:
			rec_movies = rec_genre
		else:
			rec_movies = list(rec_dir)

		res = encapsolate_res(rec_movies)

		return marshal(res, recommendation_movies_model)


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

		cur_user = User.query.filter_by(id=user['id']).first()
		favorite_movies = list(get_all_favorites(cur_user))[:4]
		favorites, rec_movies = [], []

		for m in favorite_movies:
			favorites.append(m.id)

		for id in favorites:
			if list(pd.json_normalize(ts.Movies(id=str(id)).recommendations()['results']).columns):
				rec_movies += list(pd.json_normalize(ts.Movies(id=str(id)).recommendations()['results'])['id'])[:]

		rec_movies = set(rec_movies)
		rec_movies = list(rec_movies)
		res = encapsolate_res(rec_movies)

		return marshal(res, recommendation_movies_model)

