from flask_restplus import Api
from flask import Blueprint
from .controller.auth import api as auth_ns
from .controller.user import api as user_ns
from .controller.movie import api as movie_ns
from .controller.wishlist import api as wishlist_ns
from .controller.recommend import api as recommendation_ns
from .controller.review import api as review_ns

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
              "apiKey": {
                  "type": "apiKey",
                  "name": "Authorization",
                  "in": "header"
              }
          },
          security='apiKey'
          )

api.add_namespace(auth_ns, path='/')
api.add_namespace(user_ns, path='/user')
api.add_namespace(movie_ns, path='/movie')
api.add_namespace(wishlist_ns, path='/wishlist')
api.add_namespace(recommendation_ns, path='/recommend')
api.add_namespace(review_ns, path='/review')
