from .. import db


"tablename_childtable1_childtable2 is the name format"

wishlist_movie = db.Table('wishlistmovie',
                        db.Column('wishlistid',db.Integer,db.ForeignKey('wishlist.id')),
                        db.Column('movieid',db.Integer,db.ForeignKey('movie.id')))

favorite_movie_user = db.Table('favoritemovieuser',
                        db.Column('userid',db.Integer,db.ForeignKey('user.id')),
                        db.Column('movieid',db.Integer,db.ForeignKey('movie.id')))

watched_movie_user=db.Table('watchedmovieuser',
                        db.Column('userid',db.Integer,db.ForeignKey('user.id')),
                        db.Column('movieid',db.Integer,db.ForeignKey('movie.id')))

recommend_movie_user=db.Table('recommendmovieuser',
                        db.Column('userid',db.Integer,db.ForeignKey('user.id')),
                        db.Column('movieid',db.Integer,db.ForeignKey('movie.id')))

cast_movie=db.Table('castmovie',
                        db.Column('castid',db.Integer,db.ForeignKey('cast.id')),
                        db.Column('movieid',db.Integer,db.ForeignKey('movie.id')))


class User(db.Model):
    """ User Model for storing user information """
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100))
    user_reviews = db.relationship('Reviews', backref='by_user', lazy='dynamic')
    wish_lists = db.relationship('Wishlist', backref='of_user', lazy='dynamic')
    favorite_movies = db.relationship('Movie', secondary=favorite_movie_user, backref='favorite_of', lazy='dynamic')
    watched_movies = db.relationship('Movie', secondary=watched_movie_user, backref='watched_by', lazy='dynamic')
    recommended_movies = db.relationship('Movie', secondary=recommend_movie_user, backref='recommended_to', lazy='dynamic')

    def encrypt_password(self, password):
        self.password = flask_bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return flask_bcrypt.check_password_hash(self.password, password)





class Movie(db.Model):
    __tablename__ = 'movie'
    id = db.Column(db.Integer, primary_key=True)
    director = db.Column(db.String(50) )
    name = db.Column(db.String(50))
    description= db.Column(db.String(1000))
    genre = db.Column(db.String(50))
    year = db.Column(db.Integer)
    language = db.Column(db.String(50))
    country = db.Column(db.String(50))
    reviews = db.relationship('Reviews', backref='for_movie', lazy='dynamic')
    cast = db.relationship('Cast', secondary=cast_movie, backref='acted_in', lazy='dynamic')


class Reviews(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    review_text = db.Column(db.String(1000))
    rating = db.Column(db.Integer)
    created_date = db.Column(db.DateTime, default=func.now())
    user = db.Column(db.Integer,db.ForeignKey('user.id'))
    movie =db.Column(db.Integer,db.ForeignKey('movie.id'))

class Wishlist(db.Model):
    __tablename__ = 'wishlist'
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(50))
    user = db.Column(db.Integer,db.ForeignKey('user.id'))
    status = db.Column(db.String(50))
    movies = db.relationship('Movie', secondary=wishlist_movie, backref='wish_list', lazy='dynamic')



class Cast(db.Model):
    __tablename__ = 'cast'
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(50))


