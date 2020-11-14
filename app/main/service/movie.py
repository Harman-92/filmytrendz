from datetime import datetime
from .. import db
from ..model.model import Movie, User, Wishlist, Review, BannedUser


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

	movies = []
	cur_user = None
	if user:
		cur_user = User.query.filter_by(id=user['id']).first()
	if 'favorite' in conditions:
		movies = get_all_favorites(cur_user)

	elif 'watched' in conditions:
		movies = get_all_watched(cur_user)

	elif 'latest' in conditions:
		movies = get_all_latest_movies()

	elif 'reviewed' in conditions:
		movies = get_all_reviewed_movies(cur_user)

	elif 'search' in conditions:
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
	LIMIT = 20
	movies = Movie.query.filter_by(year=cur_year).limit(LIMIT).all()
	while len(movies)<LIMIT:
		cur_year -= 1
		movies += Movie.query.filter_by(year=cur_year).limit(LIMIT).all()

	return movies


def get_all_reviewed_movies(cur_user):
	movies = []
	movie_ids = []
	reviews = Review.query.filter_by(user=cur_user.id).all()
	for r in reviews:
		if r.movie not in movie_ids:
			movies.append(Movie.query.filter_by(id=r.movie).first())
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
	keyword = '%{}%'.format(concopy['search'])
	concopy.pop('search')
	LIMIT = 10

	"""
		filter_1 = {
			'name': keywords,
			'description': keywords,
		}
	"""

	result_1 = set(Movie.query.filter(Movie.title.like(keyword)).limit(LIMIT).all())
	result_2 = set()
	if 'description' in conditions:
		result_2 = set(Movie.query.filter(Movie.description.like(keyword)).limit(LIMIT).all())

	"""
		filter_2:
		This filter is for 'year' range from the user, there will be start of
		the year and end of the year, it will find the movies which are meet:
		year_start <= year <= year_end
	"""

	result_3 = set()

	if 'year_start' in conditions and 'year_end' in conditions:
		result_3 = set(Movie.query.filter(Movie.year >= conditions['year_start']).filter(Movie.year <= conditions['year_end']).limit(LIMIT).all())

	result_4 = set()

	if 'rating_start' in conditions and 'rating_end' in conditions:
		result_4 = set(Movie.query.filter(Movie.rating >= conditions['rating_start']).filter(Movie.rating <= conditions['rating_end']).limit(LIMIT).all())

	result_5 = set()

	if 'cast' in conditions:
		result_5 = set(Movie.query.filter(Movie.actors.like(keyword)).limit(LIMIT).all())

	result_6 = set()
	if 'genre' in conditions:
		result_6 = set(Movie.query.filter(Movie.genre.in_(tuple(conditions['genre'].split(',')))).limit(LIMIT).all())

	return list(result_1 | result_2 | result_3 | result_4 | result_5 | result_6)


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
	cur_user = None
	banned_user_ids = []
	if user:
		cur_user = User.query.filter_by(id=user['id']).first()
		for b in BannedUser.query.filter_by(user_id=user['id']).all():
			banned_user_ids.append(b.banned_user_id)
	cur_movie = Movie.query.filter_by(id=mid).first()
	result = {}
	if cur_movie:
		is_favorite, is_watched = False, False
		wishlist = []
		if user:
			for fav_movie in cur_user.favorite_movies.all():
				if fav_movie.id == mid:
					is_favorite = True

			for watched_movie in cur_user.watched_movies.all():
				if watched_movie.id == mid:
					is_watched = True

			wish_lists = Wishlist.query.filter_by(user=user['id']).all()
			for w in wish_lists:
				for m in w.movies.all():
					if m.id == mid:
						wishlist.append(w.id)

		review_list = Review.query.filter_by(movie=mid).all()
		reviews = []
		for r in review_list:
			if r.by_user.id not in banned_user_ids:
				review = {
					'userId': r.by_user.id,
					'url': r.by_user.url,
					'name': r.by_user.first_name+' '+r.by_user.last_name,
					'title': r.title,
					'description': r.description,
					'id': r.id,
					'rating': r.rating,
					'createdDate': r.created_date
				}
				reviews.append(review)

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


def unfavorite_movie_user(user, mid):
	"""

	"""
	cur_user = User.query.filter_by(id=user['id']).first()
	cur_movie = Movie.query.filter_by(id=mid).first()
	success = False

	"""
		favorite_movies is a relationship table at the database, so in order
		to label a movie as favorite, this table need to be updated.
	"""
	if cur_movie:
		cur_user.favorite_movies.remove(cur_movie)
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


def remove_watched_movie_user(user, mid):
	"""
		user label the specific movie as watched movie, which will be
		removed from the watched movies relationship table
	"""
	cur_user = User.query.filter_by(id=user['id']).first()
	cur_movie = Movie.query.filter_by(id=mid).first()
	success = False

	if cur_movie:
		cur_user.watched_movies.remove(cur_movie)
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

