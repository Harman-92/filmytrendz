from app.main.model.model import Movie, Review


def encapsolate_res(movies,director=None):
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
		movie_res = Movie.query.filter(Movie.tmdb_id.in_(movies) and Movie.director.like(f'%{director}%'))
	else:
		movie_res = Movie.query.filter(Movie.tmdb_id.in_(movies))

	for m in movie_res:
		movies_list.append(m)	


	res = {
		'movies': movies_list
	}

	return res


def get_best_reviews(id):
	"""
		param: user id

		return: res
		- list of movie objects
	"""
	reviews = Review.query.filter(Review.user == user['id'], Review.rating >= 3).order_by(Review.id.desc())
	id_list = [x.movie for x in reviews]
	res = []
	if id_list:
		res = Movie.query.filter(Movie.tmdb_id.in_(movies).limit(4))

	return res
