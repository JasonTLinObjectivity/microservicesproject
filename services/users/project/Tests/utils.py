# services/users/project/Tests/util.py

from project import db
from project.api.models import User
import json


def add_user(username, email, password):
    user = User(username=username, email=email, password=password)
    db.session.add(user)
    db.session.commit()
    return user


def add_user_with_token(test, token, username, password):
    if not(username and password):
        post_data = json.dumps({})
    elif not username:
        post_data = json.dumps({
            'email': 'michael@mherman.org',
            'password': 'greaterthaneight'
        })
    elif not password:
        post_data = json.dumps({
            'username': 'michael',
                        'email': 'michael@mherman.org',
        })
    else:
        post_data = json.dumps(
            {
                'username': 'michael',
                'email': 'michael@mherman.org',
                'password': 'greaterthaneight'
            }
        )

    response = test.client.post(
        '/users',
        data=post_data,
        content_type='application/json',
        headers={'Authorization': f'Bearer {token}'}
    )
    return response


def login(test, active, admin):
    user = add_user('test', 'test@test.com', 'test')
    user.admin = admin
    user.active = active
    db.session.commit()
    resp_login = test.client.post(
        '/auth/login',
        data=json.dumps({'email': 'test@test.com',
                         'password': 'test'
                         }),
        content_type='application/json'
    )
    token = json.loads(resp_login.data.decode())['auth_token']
    return token
