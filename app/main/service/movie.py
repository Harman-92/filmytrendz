from .. import db
from app.main.model.model import Movie, User, Wishlist, Review, favorite_movie


def search_movies(conditions):
	"""
		movie searching function, given name, descripton, genre, year, language
		and country as the searching conditions. All of them are optional.
	"""
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
	"""
		given mid, retrive the specific movie according to the movie id for
		the specific user, the user information comes from the token.
	"""

	"""
		look up the specific user and the specific movie according to ids.
		There are five parts information need to be returned: 
		1. movie basic information
		2. if the movie is favorited
		3. if the movie is watched
		4. wishlists this movies in
		5. reviews related this movie
	"""
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
			'movie': [dict(cur_movie), ],
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
	""" 
		favorite_movies is a relationship table at the database, so in order
		to label a movie as favorite, this table need to be updated.
	"""
	if cur_movie:
		cur_user.favorite_movies.append(cur_movie)
		db.session.add(cur_user)
		db.session.commit()
		success = True

	return success


def watched_movie_user(user, mid):
	"""
		user label the specific movie as watched movie, which will be
		added into the watched movies relationship table
	"""
	cur_user = User.query.filter_by(id=user['id']).first()
	cur_movie = Movie.query.filter_by(id=mid).first()
	success = False

	if cur_movie:
		cur_user.watched_movies.append(cur_movie)
		db.session.add(cur_user)
		db.session.commit()
		success = True

	return success


def add_movie_wishlist(user, mid, listwishlist):
	cur_user = User.query.filter_by(id=user['id']).first()
	cur_movie = Movie.query.filter_by(id=mid).first()
	success = False
	if cur_movie:
		for wishlistid in listwishlist:
			"""
				wish_lists is a relationship table at the database, call cur_user.wish_lists
				will generate the standard SQL statements, here we want to insert a new record
			"""
			if Wishlist.query.filter_by(id=wishlistid).first():
				statement = cur_user.wish_lists.insert()\
					.values(userid=cur_user.id, wishlistid=wishlistid, movieid=cur_movie.id)
				db.session.execute(statement)
				success = True
			else:
				success = False
				break
		if success:
			db.session.commit()

	return success


def add_review_movie(user, mid, review_data):
	cur_user = User.query.filter_by(id=user['id']).first()
	cur_movie = Movie.query.filter_by(id=mid).first()
	success = False
	if cur_movie:
		"""
			build a new review according to the review data from user
			and update the reviews-movie relationship table
		"""
		review = Review(**review_data)
		review.user = cur_user.id
		review.movie = cur_movie.id
		cur_movie.reviews.append(review)
		db.session.add(review)
		db.session.commit()
		db.session.add(cur_movie)
		db.session.commit()
		success = True

	return success


def recommend_specific_movie(user, mid, args):
	pass
