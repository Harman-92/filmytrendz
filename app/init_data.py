from app import app
import xlrd
import pymysql
import pandas

df = pandas.read_csv("movie_datasets/movie_data.csv", index_col=0, low_memory=False)
df.dropna(axis=0, how='any', inplace=True)
samples = df.head(50000)
samples.to_excel("movie_datasets/movies.xls")


"""
Provide your database details you would like to insert data
"""

with app.app_context():
	book = xlrd.open_workbook("movie_datasets/movies.xls")
	sheet = book.sheet_by_name("Sheet1")
	conn = pymysql.connect(
		host='127.0.0.1',
		user='root',
		password='password',
		db='v5',
		port=3306,
		charset='utf8'
	)

	cursor = conn.cursor()
	query = "insert into movie (url, imdb_id, tmdb_id, director, title," \
	        "description, genre, rating, year, popularity, original_language, country, actors) values " \
	        "(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

	for r in range(1, sheet.nrows):
		imdb_id = str(sheet.cell(r, 0).value)
		tmdb_id = str(sheet.cell(r, 1).value)[:-2]
		original_language = str(sheet.cell(r, 2).value)
		url = str(sheet.cell(r, 3).value)
		popularity = float(sheet.cell(r, 4).value)
		title = str(sheet.cell(r, 5).value)
		year = int(sheet.cell(r, 6).value)
		genre = str(sheet.cell(r, 7).value)
		country = str(sheet.cell(r, 8).value)
		director = str(sheet.cell(r, 9).value)
		actors = str(sheet.cell(r, 10).value)
		description = str(sheet.cell(r, 11).value)
		external_rating = round(float(sheet.cell(r, 12).value) / 2.0, 1)

		values = (url, imdb_id, tmdb_id, director, title,
		          description, genre, external_rating, year, popularity, original_language, country, actors)

		cursor.execute(query, values)

	cursor.close()
	conn.commit()
	conn.close()

	print('\nyou inserted 50,000 movie data into database\n')

