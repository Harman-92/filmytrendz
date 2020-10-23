from flask_restplus import Namespace, fields


class UserDto:
    api = Namespace('user', description='user related operations: signup, login, logout, remove/add ban')
    user = api.model('user', {
        'id': fields.Integer,
        'email': fields.String,
        'first_name': fields.String,
        'last_name': fields.String,
        'mobile_no': fields.String
    })

    update_user = api.model('update_user', {
        'first_name': fields.String,
    })

    pass_change = api.model('pass_change', {
        'old_password': fields.String,
        'new_password': fields.String
    })

    user_ban = api.model('user_ban', {
        'id': fields.Integer
    })
    banned_user = api.model('banned_user', {
        'id': fields.String,
        'first_name': fields.String,
        'last_name': fields.String
    })
    banned_list = api.model('banned_users', {
        'banned_users': fields.List(fields.Nested(banned_user))
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
        'first_name': fields.String,
        'last_name': fields.String,
        'mobile_no': fields.String
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

    wishlist_movie_model=api.model('movie-model',{
        'id':fields.Integer,
        'name':fields.String,
    })

    wish_list_model = api.model('wish-list', {
        'id': fields.Integer,
        'name':fields.String,
        'movies': fields.List(fields.Nested(wishlist_movie_model))
    })

    wish_lists_model = api.model('wish-lists', {
        'wishlists': fields.List(fields.Nested(wish_list_model))
    })


    new_wishlist_model=api.model('new-wish-list', {
    'name' : fields.String,
    'status' : fields.String,

    })

    new_wishlist_return_model=api.model('new-wish-list-return', {
    'id':fields.Integer,
    'name' : fields.String,
    'status' : fields.String

    })

    wishlist_update_model = api.model('wish-list', {
        'new_list': fields.List(fields.Integer),
        'remove_list': fields.List(fields.Integer)
    })





class FavoriteListDto:
    api = Namespace('favorite', description='favorite list')

    favorite_list_model = api.model('favorite movie', {
        'movies': fields.List(fields.Nested(MovieDto.movie_model))
    })


class HistoryListDto:
    api = Namespace('history', description='history list')

    watched_history_model = api.model('watch history', {
        'movies': fields.List(fields.Nested(MovieDto.movie_model))
    })
