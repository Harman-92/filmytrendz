from .. import db
from app.main.model.model import Movie


def search_movies(conditions):
	movie_attr = ['name', 'description', 'genre', 'year', 'language', 'country']
	movies, keys = [], []
	for key in conditions.keys():
		if key not in movie_attr:
			keys.append(key)
	for key in keys:
		conditions.pop(key)
	if conditions:
		movies = Movie.query.filter_by(**conditions).all()
	return movies


def retrive_movie(user, mid):
	user.favorite_movies
	return

