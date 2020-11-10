from datetime import datetime
from .. import db
from app.main.model.model import Movie, User, Wishlist, Review


"""
	service.movie provides supported functions for controll.movie:
"""


def search_movies(user, conditions):
	"""
		param: user, conditions
		- user is a dictionary object containing id and username
		- conditions is a object containing search keywords and search conditions

		movie searching function, given name, descripton, genre, year, language
		and country as the searching conditions. All of them are optional.

		There are four cases:

		case 1: /movie?favorite=true
		case 2: /movie?watched=true
		case 3: /movie?search=keyword&name=true&description=true...
		case 4: /movie?latest=true

		return: movies
		- all the movie objects according to search conditions
	"""

	cur_user = User.query.filter_by(id=user['id']).first()
	movies = []

	if 'favorite' in conditions:
		movies = get_all_favorites(cur_user)

	if 'watched' in conditions:
		movies = get_all_watched(cur_user)

	if 'latest' in conditions:
		movies = get_all_latest_movies()

	if 'search' in conditions:
		movies = get_all_keywords_movies(conditions)

	return movies


def get_all_favorites(user):
	movies = user.favorite_movies.all()

	return movies


def get_all_watched(user):
	movies = user.watched_movies.all()

	return movies


def get_all_latest_movies():
	"""
		At this stage, for getting all the latest movies, it will return
		all the movies published within the recent three years.
	"""
	cur_year = int(datetime.now().year)

	movies_1 = Movie.query.filter_by(year=cur_year).all()
	movies_2 = Movie.query.filter_by(year=cur_year-1).all()
	movies_3 = Movie.query.filter_by(year=cur_year-2).all()

	movies = movies_1 + movies_2 + movies_3

	return movies


def get_all_keywords_movies(conditions):
	"""
		param: conditions

		given conditions, search according to the keywords

		1. take the keyword as the name, do the search
		2. take the keyword as the description, do the search
		3. filter movies according to start year and end year

		return: list of movies
	"""
	concopy = conditions
	keywords = concopy['search']
	concopy.pop('search')

	"""
		filter_1 = {
			'name': keywords,
			'description': keywords,
		}
	"""

	result_1_1 = set(Movie.query.filter_by(name=keywords).all())
	result_1_2 = set(Movie.query.filter_by(description=keywords).all())
	result_1 = result_1_1 | result_1_2

	"""
		filter_2:
		This filter is for 'year' range from the user, there will be start of
		the year and end of the year, it will find the movies which are meet:
		year_start <= year <= year_end
	"""

	result_2_1, result_2_2 = set(), set()

	if 'year_start' in conditions and 'year_end' in conditions:
		result_2_1 = set(Movie.query.filter(Movie.year >= conditions['year_start']))
		result_2_2 = set(Movie.query.filter(Movie.year <= conditions['year_end']))
	result_2 = result_2_1 & result_2_2

	return list(result_1 & result_2)


def retrieve_movie(user, mid):
	"""
		param: user, mid
		- user is a dictiony object containing user id and user name
		- mid is the movie id user want to retrieve

		given mid, retrive the specific movie according to the movie id for
		the specific user, the user information comes from the token.

		look up the specific user and the specific movie according to ids.
		There are five parts information need to be returned:
		1. movie basic information
		2. if the movie is favorited
		3. if the movie is watched
		4. wishlists this movies in
		5. reviews related this movie

		return: result
		- all movie information
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
			'movie': cur_movie,
			'favorite': is_favorite,
			'watched': is_watched,
			'wishlist': wishlist,
			'reviews': reviews
		}

	return result


def favorite_movie_user(user, mid):
	"""
		given movie id, favorite the movie for the specific user
	"""
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
	"""
		user may want to add the movie to his specific wishlist, which
		given movie id and wishlist ids, then make the add operation
	"""
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
	"""
		param: user, mid, review_data

		user may want to add reviews to the specific movie, which
		given movie id and the new review data from user.
	"""
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

