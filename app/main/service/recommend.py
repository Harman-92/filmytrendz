from app.main.model.model import Movie


def encapsolate_res(movies):
	"""
		given the list of movies' tmdb_id, look up all the movies
		and put then into a list and return them to frontend...
	"""
	movies_list = []
	for id in movies:
		m = Movie.query.filter_by(tmdb_id=id).first()
		if m:
			movies_list.append(m)

	res = {
		'movies': movies_list
	}

	return res

