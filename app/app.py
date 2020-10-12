from flask_restplus import Api
from flask import Blueprint

from .main.controller.user import api as user_ns
from .main.controller.movie import api as movie_ns
from .main.controller.wishlist import api as wishlist_ns
from .main.controller.favorite import api as favorite_ns
from .main.controller.history import api as history_ns

blueprint = Blueprint('api', __name__)

api = Api(blueprint,
          title='Film finder flask restplus api',
          version='1.0',
          description='Nowadays, there are many ways to ensure if a movie is a prime choice for entertainment, so movie'
                      'recommended apps become more and more popular. They provide information including real opinions'
                      'and reviews, but not enough before users see their next film.'
                      '\r\n\r\n\r\n'
                      'Team V5',
          authorizations={
              "TOKEN-BASED": {
                  "type": "apiKey",
                  "name": "API-TOKEN",
                  "in": "header"
              }
          }
          )

api.add_namespace(user_ns, path='/user')
api.add_namespace(movie_ns, path='/movie')
api.add_namespace(wishlist_ns, path='/wishlist')
api.add_namespace(favorite_ns, path='/favorite')
api.add_namespace(history_ns, path='/history')

