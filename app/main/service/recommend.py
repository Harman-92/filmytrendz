from sqlalchemy import and_, or_
from ..service.movie import *
import pandas as pd
import tmdbsimple as ts
import random


ts.API_KEY = 'e8ad3a064b09b320f171bc110b451cfd'


def encapsolate_res(movies, director=None):
	"""
		param: movies
		- movies is a list of movies' tmdb_id

		given the list of movies' tmdb_id, look up all the movies
		and put then into a list and return them to frontend...

		return: res
		- list of movie objects
	"""
	movies_list = []
	if director:
		movie_res = Movie.query.filter(and_(Movie.tmdb_id.in_(movies), Movie.director.like(f'%{director}%')))
	else:
		movie_res = Movie.query.filter(Movie.tmdb_id.in_(movies))

	for m in movie_res:
		movies_list.append(m)

	res = {
		'movies': movies_list
	}

	return res


def get_best_reviews(id, movies):
	"""
		param: id, movies
		- id is the user id
		- movies is a list of movie id
		return: res
		- list of movie objects
	"""
	reviews = Review.query.filter(and_(Review.user == id, Review.rating >= 3)).order_by(Review.id.desc())
	id_list = [x.movie for x in reviews]
	res = []
	if id_list:
		res = Movie.query.filter(Movie.tmdb_id.in_(movies)).limit(4)

	return res


def recommend_user(conditions, target_movie):
	"""
		Make recommendation for a specific movie accoring to movie attributes
		params: conditions, target_movie
		- conditions: make recommendation based on genre or director
		- target_movie: is the specific movie need to be recommended

		return: a list of recommendation movies
	"""
	GENRE, DIRECTOR = 1, 2

	flag = 0
	if 'genre' in conditions:
		flag = GENRE
	if 'director' in conditions:
		flag = DIRECTOR

	movie_id = str(target_movie.tmdb_id)
	try:
		director = target_movie.director.split()[0]
	except:
		director = None

	# Get general recommendations for a movie
	try:
		rec_gen = list((pd.json_normalize(ts.Movies(id=movie_id).recommendations()['results']))['id'])
	except:
		rec_gen = []

	# Get recommendations based on genre
	try:
		rec_genre = list((pd.json_normalize(ts.Movies(id=movie_id).similar_movies()['results']))['id'])
	except:
		rec_genre = []

	rec_dir = set(rec_gen + rec_genre)
	rec_dir = list(rec_dir)

	rec_movies = []

	if flag == 0:
		rec_movies = rec_gen

	elif flag == GENRE:
		rec_movies = rec_genre

	else:
		rec_movies = rec_dir

	if flag == DIRECTOR and director:
		res = encapsolate_res(rec_movies, director=director)
	else:
		res = encapsolate_res(rec_movies)

	return res


def recommend_movie(user):
	"""
		Make recommendation for specific user according his/her favorite list
		- param: user
		return: a list of recommendation movies
	"""
	cur_user = User.query.filter_by(id=user['id']).first()
	favorite_movies = list(get_all_favorites(cur_user))[-4:]
	movies = []
	for m in favorite_movies:
		movies.append(m.tmdb_id)
	reviewed_movies = get_best_reviews(user['id'], movies)
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
		if not temp_res.empty:
			rec_movies += list(temp_res['id'])

	if rec_movies:
		rec_movies = set(rec_movies)
		rec_movies = list(rec_movies)
		random.shuffle(rec_movies)
		rec_movies = rec_movies[:20]
		res = encapsolate_res(rec_movies)
	else:
		rec_movies = list(pd.json_normalize(ts.Movies().popular()['results'])['id'])
		random.shuffle(rec_movies)
		res = encapsolate_res(rec_movies)

	return res

