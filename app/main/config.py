import os

"""
    DB Connection URl
    To connect to local db replace below local_db with your own db url
    'mysql+pymysql://username:password@host:port/database'
"""

local_db = 'mysql+pymysql://root:password@127.0.0.1:3306/v5'
mysql_aws_db = 'mysql+pymysql://admin:frontendbackend@v5-team.c4nceu0tb2ci.us-east-2.rds.amazonaws.com:3306/v5'
basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'my_secret_key')
    DEBUG = False


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = mysql_aws_db
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    RESTPLUS_MASK_SWAGGER = False


class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = mysql_aws_db
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    RESTPLUS_MASK_SWAGGER = False


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = mysql_aws_db
    RESTPLUS_MASK_SWAGGER = False


config_by_name = dict(
    development=DevelopmentConfig,
    test=TestingConfig,
    production=ProductionConfig
)

key = Config.SECRET_KEY

