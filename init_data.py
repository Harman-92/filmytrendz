
from app.main.model.model import *
from set_up import app


with app.app_context():




    user1= User(id=1, first_name='allen', last_name='kombasseril',mobile_no='0490519281', email='kombasseril@gmail.com')
    user1.encrypt_password('venom')
    user2 = User(id=2, first_name='caitlin', last_name='dale', mobile_no='0490578628',
                 email='caitlin.jade.dale@gmail.com')
    user2.encrypt_password('ass')
    user3 = User(id=3, first_name='venom', last_name='belly', mobile_no='0490898628',
                 email='venom567@gmail.com')
    user3.encrypt_password('tities')
    db.session.add_all([user1, user2,user3])
    db.session.commit()

