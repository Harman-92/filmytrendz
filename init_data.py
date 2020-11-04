from app.main.model.model import *
from set_up import app
import xlrd
import pymysql
import pandas

df = pandas.read_csv("movie_data.csv", index_col=0)
df.dropna(axis=0, how='any', inplace=True)
# df.reset_index(inplace=True)
samples = df.head(10)
samples.to_excel("movies.xls")


with app.app_context():
	user1 = User(id=1, first_name='allen', last_name='kombasseril', mobile_no='0490519281',
	             email='kombasseril@gmail.com')
	user1.encrypt_password('venom')
	user2 = User(id=2, first_name='caitlin', last_name='dale', mobile_no='0490578628',
	             email='caitlin.jade.dale@gmail.com')
	user2.encrypt_password('bomb')
	user3 = User(id=3, first_name='venom', last_name='belly', mobile_no='0490898628',
	             email='venom567@gmail.com')
	user3.encrypt_password('thunder')

	# movie1 = Movie(name='harry potter', director='jk rowling')
	# movie2 = Movie(name='fast', director='furious')
	# movie3 = Movie(name='code 8 ', director='idk')
	# db.session.add_all([user1, user2, user3, movie1, movie2, movie3])
	#
	# db.session.commit()
	#
	# review = Review(id=1, review_text="magic movie", rating=5, movie=1, user=1)
	# db.session.add(review)
	# db.session.commit()

	book = xlrd.open_workbook("movies.xls")
	sheet = book.sheet_by_name("Sheet1")
	conn = pymysql.connect(
		host='localhost',
		user='root',
		password='112321',
		db='v5',
		port=3306,
		charset='utf8'
	)

	cursor = conn.cursor()
	query = "insert into movie (poster_path, imdb_id, tmdb_id, director, original_title," \
	        "description, genre, external_rating, year, popularity, original_language, country, actors) values " \
	        "(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

	for r in range(1, sheet.nrows):
		imdb_id = str(sheet.cell(r, 0).value)
		tmdb_id = str(sheet.cell(r, 1).value)[:-2]
		original_language = str(sheet.cell(r, 2).value)
		poster_path = str(sheet.cell(r, 3).value)
		popularity = float(sheet.cell(r, 4).value)
		original_title = str(sheet.cell(r, 5).value)
		year = int(sheet.cell(r, 6).value)
		genre = str(sheet.cell(r, 7).value)
		country = str(sheet.cell(r, 8).value)
		director = str(sheet.cell(r, 9).value)
		actors = str(sheet.cell(r, 10).value)
		description = str(sheet.cell(r, 11).value)
		external_rating = float(sheet.cell(r, 12).value)

		values = (poster_path, imdb_id, tmdb_id, director, original_title,
		          description, genre, external_rating, year, popularity, original_language, country, actors)

		cursor.execute(query, values)

	cursor.close()
	conn.commit()
	conn.close()

