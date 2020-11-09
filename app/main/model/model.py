import flask_bcrypt
from sqlalchemy import func
import datetime
from .. import db
import enum

"tablename_childtable1_childtable2 is the name format"

wishlist_movie = db.Table('wishlist_movies',
                          db.Column('wishlistid', db.Integer, db.ForeignKey('wishlist.id')),
                          db.Column('movieid', db.Integer, db.ForeignKey('movie.id')))

favorite_movie = db.Table('favoritemovie',
                          db.Column('userid', db.Integer, db.ForeignKey('user.id')),
                          db.Column('movieid', db.Integer, db.ForeignKey('movie.id')))

watched_movie = db.Table('watchedmovie',
                         db.Column('userid', db.Integer, db.ForeignKey('user.id')),
                         db.Column('movieid', db.Integer, db.ForeignKey('movie.id')))

recommend_movie = db.Table('recommendmovie',
                           db.Column('userid', db.Integer, db.ForeignKey('user.id')),
                           db.Column('movieid', db.Integer, db.ForeignKey('movie.id')))




class User(db.Model):
    """ User Model for storing user information """

    __tablename__ = 'user'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    mobile_no = db.Column(db.String(50), nullable=False)
    url = db.Column(db.String(50), default='')
    password = db.Column(db.String(100))
    reviews = db.relationship('Review', backref='by_user', lazy='dynamic')
    wish_lists = db.relationship('Wishlist', backref='of_user', lazy='dynamic')
    favorite_movies = db.relationship('Movie', secondary=favorite_movie, backref='favorite_of', lazy='dynamic')
    watched_movies = db.relationship('Movie', secondary=watched_movie, backref='watched_by', lazy='dynamic')
    recommended_movies = db.relationship('Movie', secondary=recommend_movie, backref='recommended_to', lazy='dynamic')

    def encrypt_password(self, password):
        self.password = flask_bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return flask_bcrypt.check_password_hash(self.password, password)
    #
    # def __repr__(self):
    #     return "<User '{}'>".format(self.first_name)


class BannedUser(db.Model):
    __tablename__ = 'bannedlist'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),primary_key=True)
    banned_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),primary_key=True)


class BlacklistToken(db.Model):
    """
    Token Model for storing JWT tokens
    """
    __tablename__ = 'blacklist_token'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    blacklisted_on = db.Column(db.DateTime, nullable=False)

    def __init__(self, token):
        self.token = token
        self.blacklisted_on = datetime.datetime.now()

    def __repr__(self):
        return '<id: token: {}'.format(self.token)

    @staticmethod
    def check_blacklist(auth_token):
        # check whether auth token has been blacklisted
        res = BlacklistToken.query.filter_by(token=str(auth_token)).first()
        if res:
            return True
        else:
            return False


class Movie(db.Model):
    __tablename__ = 'movie'
    id = db.Column(db.Integer, autoincrement=True,  primary_key=True)
    url = db.Column(db.String(200))
    imdb_id = db.Column(db.String(10))
    tmdb_id = db.Column(db.String(15))
    director = db.Column(db.String(400))
    title = db.Column(db.String(200))
    description = db.Column(db.String(1000))
    genre = db.Column(db.String(120))
    rating = db.Column(db.Float)
    year = db.Column(db.Integer)
    popularity = db.Column(db.Float)
    original_language = db.Column(db.String(50))
    country = db.Column(db.String(250))
    reviews = db.relationship('Review', backref='for_movie', lazy='dynamic')
    actors = db.Column(db.String(500))


class Review(db.Model):
    __tablename__ = 'review'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    title = db.Column(db.String(50))
    description = db.Column(db.String(1000))
    rating = db.Column(db.Float)
    created_date = db.Column(db.DateTime, default=func.now())
    user = db.Column(db.Integer, db.ForeignKey('user.id'))
    movie = db.Column(db.Integer, db.ForeignKey('movie.id'))


class Privacy(enum.Enum):
    PRIVATE = 'private'
    PUBLIC = 'public'


class Wishlist(db.Model):
    __tablename__ = 'wishlist'
    id = db.Column(db.Integer, autoincrement=True , primary_key=True)
    name = db.Column(db.String(50))
    user = db.Column(db.Integer, db.ForeignKey('user.id'))
    status = db.Column(db.String(50), default="public", nullable=False)
    movies = db.relationship('Movie', secondary=wishlist_movie, backref='wish_list', lazy='dynamic')
