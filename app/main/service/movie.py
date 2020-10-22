from .. import db
from app.main.model.model import Movie, User, Wishlist, Review, favorite_movie


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
	cur_user = User.query.filter_by(id=user['id']).first()
	cur_movie = Movie.query.filter_by(id=mid).first()
	result = {}
	if cur_movie:
		is_favorite, is_watched = False, False
		if mid in cur_user.favorite_movies.all():
			is_favorite = True

		if mid in cur_user.watched_movies.all():
			is_watched = True

		wish_lists = Wishlist.query.filter_by(user=user['id']).all()
		wishlist = []
		for w in wish_lists:
			wl = dict(w)
			wl.pop('user')
			wl.pop('movies')
			wishlist.append(wl)

		review_list = Review.query.filter_by(movie=mid).all()
		reviews = []
		for r in review_list:
			redict = dict(r)
			redict.pop('user')
			redict.pop('movie')
			reviews.append(redict)

		result = {
			'movie': dict(cur_movie),
			'favorite': is_favorite,
			'watched': is_watched,
			'wishlist': wishlist,
			'reviews': reviews
		}

	return result


def favorite_movie_user(user, mid):
	cur_user = User.query.filter_by(id=user['id']).first()
	cur_movie = Movie.query.filter_by(id=mid).first()
	success = False
	if cur_movie:
		cur_user.favorite_movies.append(cur_movie)
		db.session.add(cur_user)
		db.session.commit()
		success = True

	return success


