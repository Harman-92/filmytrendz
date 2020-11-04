from app.main.model.model import Movie


def encapsolate_res(movies):
	movies_list = []
	for mid in movies:
		m = Movie.query.filter_by(id=mid).first()
		movies_list.append(m)

	res = {
		'movies': movies_list
	}

	return res

