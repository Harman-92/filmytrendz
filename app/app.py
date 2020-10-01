from flask_restplus import Api
from flask import Blueprint

blueprint = Blueprint('api', __name__)

api = Api(blueprint,
          title='Film finder flask restplus api',
          version='1.0',
          description='film finder',
          authorizations={
              "TOKEN-BASED": {
                  "type": "apiKey",
                  "name": "API-TOKEN",
                  "in": "header"
              }
          }
          )

# api.add_namespace(user_ns, path='/user')
# There will be more namespace
