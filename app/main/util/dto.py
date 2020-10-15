from flask_restplus import Namespace, fields


class UserDto:
	api = Namespace('user', description='user related operations: signup, login, logout')
	user = api.model('user', {
		'id': fields.Integer,
		'email': fields.String,
		'name': fields.String
	})


class AuthDto:
	api = Namespace('auth', description='user authentication operations')

	user_login_auth = api.model('auth_login_info', {
		'email': fields.String,
		'password': fields.String
	})

	user_signup_auth = api.model('auth_signup_info', {
		'email': fields.String,
		'password': fields.String,
		'name': fields.String
	})


class MovieDto:
	api = Namespace('movie', description='movie related operations')

	review_model = api.model('review', {
		'id': fields.Integer,
		'review_text': fields.String,
		'rating': fields.Float,
		'create_date': fields.DateTime
	})

	cast_model = api.model('cast', {
		'id': fields.Integer,
		'name': fields.String
	})

	movie_model = api.model('movie', {
		'id': fields.Integer,
		'director': fields.String,
		'name': fields.String,
		'description': fields.String,
		'genre': fields.String,
		'year': fields.Integer,
		'language': fields.String,
		'country': fields.String,
		'casts': fields.List(fields.Nested(cast_model)),
		'reviews': fields.List(fields.Nested(review_model))
	})

	search_result_model = api.model('movie-list', {
		'movies': fields.List(fields.Nested(movie_model))
	})

	recommand_movie_model = api.model('movie-recommandations', {
		'movies_by_genre': fields.List(fields.Nested(movie_model)),
		'movies_by_director': fields.List(fields.Nested(movie_model))
	})


class WishListDto:
	api = Namespace('wishlist', description='wish list')

	wish_list_model = api.model('wish-list', {
		'id': fields.Integer,
		'movies': fields.List(fields.Nested(MovieDto.movie_model))
	})

	wish_lists_model = api.model('wish-lists', {
		'wishlists': fields.List(fields.Nested(wish_list_model))
	})


class FavoriteListDto:
	api = Namespace('favorite', description='favorite list')

	favorite_list_model = api.model('favoriate movie', {
		'movies': fields.List(fields.Nested(MovieDto.movie_model))
	})


class HistoryListDto:
	api = Namespace('history', description='history list')

	watched_history_model = api.model('watch history', {
		'movies': fields.List(fields.Nested(MovieDto.movie_model))
	})

