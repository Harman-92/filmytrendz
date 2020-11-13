from flask import request
from flask_restplus import Resource, marshal
from ..service.movie import *
from ..service.recommend import encapsolate_res , get_best_reviews
from ..util.decorator import token_required
from ..util.dto import RecommendationDto
from ..service.movie import get_all_favorites
import pandas as pd
import tmdbsimple as ts


ts.API_KEY = 'e8ad3a064b09b320f171bc110b451cfd'


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
	@api.param('mid', description='take the movie id need to be recommendation')
	@api.param('genre', description='make recommendation according to genre')
	@api.param('director', description='make recommendation according to director')
	@token_required
	def get(self, user, mid):
		"""
			make recommendation for a specific movie according to movie genre and director
		"""

		conditions = request.args
		target_movie = Movie.query.filter_by(id=mid).first()

		flag = 0
		if 'genre' in conditions:
			flag = 1
		if 'director' in conditions:
			flag = 2

		movie_id = str(target_movie.tmdb_id)
		try:
			director = target_movie.director.split()[0]
		except:
			director = None	

		rec_gen = list(pd.json_normalize(ts.Movies(id=movie_id).recommendations()['results'])['id'])
		rec_genre = list(pd.json_normalize(ts.Movies(id=movie_id).similar_movies()['results'])['id'])
		rec_dir = set(rec_gen + rec_genre)
		rec_dir = list(rec_dir)

		rec_movies = []

		if flag == 0:
			rec_movies = rec_gen
			
		elif flag == 1:
			rec_movies = rec_genre
			
		else:
			rec_movies = rec_dir
			
		if flag == 2 and director:
			res = encapsolate_res(rec_movies, director=director)
		else:
			res = encapsolate_res(rec_movies)	
		

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

		cur_user = User.query.filter_by(id=user['id']).first()
		favorite_movies = list(get_all_favorites(cur_user))[:4]
		reviewed_movies = get_best_reviews(user['id'])
		favorites, rec_movies = [], []

		for m in favorite_movies:
			favorites.append(m.tmdb_id)
		for m in reviewed_movies:
			if m.tmdb_id not in favorites:
				favorites.append(m.tmdb_id)
		if len(favorites) > 4:
			favorites = favorites[:2] + favorites[-2:]
		for id in favorites:
			temp_res = pd.json_normalize(ts.Movies(id=str(id)).recommendations()['results'])
			if list(temp_res.columns):
				rec_movies += list(temp_res['id'])

		rec_movies = set(rec_movies)
		rec_movies = list(rec_movies)

		if rec_movies:
			res = encapsolate_res(rec_movies)
		else:
			rec_movies = list(pd.json_normalize(ts.Movies().popular()['results'])['id'])
			res = encapsolate_res(rec_movies)
		return marshal(res, recommendation_movies_model)

