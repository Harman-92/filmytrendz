from flask import request
from flask_restplus import Resource
from ..util.dto import HistoryListDto

api = HistoryListDto.api
watched_history_model = HistoryListDto.watched_history_model


@api.route('/history')
class Favoritelist(Resource):
	@api.doc('favorite list')
	@api.response(200, 'success', model=watched_history_model)
	@api.response(404, 'not found')
	@api.response(401, 'unauthorized')
	def get(self):
		pass

