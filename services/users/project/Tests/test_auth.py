# services/users/project/Test/test_auth.py

import json
import unittest

from project import db
from project.api.models import User
from project.Tests.base import BaseTestCase
from project.Tests.utils import add_user
from flask import current_app

class TestAuthBlueprint(BaseTestCase):
	def test_user_registration(self):
		with self.client:
			response = self.client.post(
				'auth/register',
				data=json.dumps({
					'username': 'justatest',
					'email': 'test@test.com',
					'password': '123456',
				}),
				content_type='application/json'
			)
			data = json.loads(response.data.decode())
			self.assertTrue(data['status'] == 'success')
			self.assertTrue(data['message'] == 'Successfully registered.')
			self.assertTrue(data['auth_token'])
			self.assertTrue(response.content_type == 'application/json')
			self.assertEqual(response.status_code, 201)


	def test_user_registration_duplicate_email(self):
		add_user('test', 'test@test.com', 'test')
		with self.client:
			response = self.client.post(
				'auth/register',
				data=json.dumps({
					'username':'michael',
					'email': 'test@test.com',
					'password': 'test'
				}),
				content_type='application/json'
			)
			data = json.loads(response.data.decode())
			self.assertEqual(response.status_code, 400)
			self.assertIn('fail', data['status'])
			self.assertIn('Sorry. That user already exists', data['message'])


	def test_user_registration_duplicate_username(self):
		add_user('test', 'test@test.com', 'test')
		with self.client:
			response = self.client.post(
				'auth/register',
				data=json.dumps({
					'username':'test',
					'email': 'test@test2.com',
					'password': 'test'
				}),
				content_type='application/json'
			)
			data = json.loads(response.data.decode())
			self.assertEqual(response.status_code, 400)
			self.assertIn('fail', data['status'])
			self.assertIn('Sorry. That user already exists', data['message'])


	def test_user_registration_invalid_json(self):
		with self.client:
			response = self.client.post(
				'auth/register',
				data=json.dumps({}),
				content_type='application/json'
			)
			data = json.loads(response.data.decode())
			self.assertEqual(response.status_code, 400)
			self.assertIn('Invalid payload.', data['message'])
			self.assertIn('fail', data['status'])

	def test_user_registration_invalid_json_no_username(self):
		with self.client:
			response = self.client.post(
				'auth/register',
				data=json.dumps({
						'email': 'test@test.com',
						'password': 'test'
					}),
				content_type='application/json'
			)
			data = json.loads(response.data.decode())
			self.assertEqual(response.status_code, 400)
			self.assertIn('Invalid payload.', data['message'])
			self.assertIn('fail', data['status'])


	def test_user_registration_invalid_json_no_email(self):
		with self.client:
			response = self.client.post(
				'auth/register',
				data=json.dumps({
						'username':'justatest',
						'password': 'test'
					}),
				content_type='application/json'
			)
			data = json.loads(response.data.decode())
			self.assertEqual(response.status_code, 400)
			self.assertIn('Invalid payload.', data['message'])
			self.assertIn('fail', data['status'])


	def test_user_registration_invalid_json_no_password(self):
		with self.client:
			response = self.client.post(
				'auth/register',
				data=json.dumps({
						'username':'justatest',
						'email': 'test@test.com'
					}),
				content_type='application/json'
			)
			data = json.loads(response.data.decode())
			self.assertEqual(response.status_code, 400)
			self.assertIn('Invalid payload.', data['message'])
			self.assertIn('fail', data['status'])

	def test_registered_user_login(self):
		with self.client:
			add_user('test', 'test@test.com', 'test')
			response = self.client.post(
				'auth/login',
				data=json.dumps({
						'email': 'test@test.com',
						'password': 'test'
					}),
				content_type='application/json'
				)
			data = json.loads(response.data.decode())
			self.assertIn('success', data['status'])
			self.assertTrue(data['message'] == 'Successfully logged in.')
			self.assertTrue(data['auth_token'])
			self.assertTrue(response.content_type == 'application/json')
			self.assertEqual(response.status_code, 200)


	def test_not_registered_user_login(self):
		with self.client:
			response = self.client.post(
				'auth/login',
				data=json.dumps({
						'email': 'test@test.com',
						'password': 'test'
					}),
				content_type='application/json'
				)
			data= json.loads(response.data.decode())
			self.assertTrue(data['status'] == 'fail')
			self.assertIn('User does not exist.', data['message'])
			self.assertTrue(response.content_type == 'application/json')
			self.assertEqual(response.status_code, 404)

	def test_registered_user_logout(self):
		add_user('test', 'test@test.com', 'test')
		with self.client:
			resp_login = self.client.post(
				'auth/login',
				data=json.dumps({
						'email': 'test@test.com',
						'password': 'test'
					}),
				content_type='application/json'
				)
			# valid token logout
			token = json.loads(resp_login.data.decode())['auth_token']
			response = self.client.get(
				'auth/logout',
				headers={'Authorization': f'Bearer {token}'}
			)
			data = json.loads(response.data.decode())
			self.assertTrue(data['status'] == 'success')
			self.assertIn('Successfully logged out.', data['message'])
			self.assertEqual(response.status_code, 200)


	def test_invalid_logout_expired_token(self):
		add_user('test', 'test@test.com', 'test')
		current_app.config['TOKEN_EXPIRATION_SECONDS'] = -1
		with self.client:
			resp_login = self.client.post(
				'auth/login',
				data=json.dumps({
						'email': 'test@test.com',
						'password': 'test'
					}),
				content_type='application/json'
				)
			# invalid token logout
			token = json.loads(resp_login.data.decode())['auth_token']
			response = self.client.get(
				'auth/logout',
				headers={'Authorization': f'Bearer {token}'}
			)
			data = json.loads(response.data.decode())
			self.assertTrue(data['status'] == 'fail')
			self.assertIn('Signature expired. Please log in again', data['message'])
			self.assertEqual(response.status_code, 401)


	def test_invalid_logout(self):
		with self.client:
			response = self.client.get(
				'auth/logout',
				headers={'Authorization': 'Bearer invalid'}
				)
			data = json.loads(response.data.decode())
			self.assertTrue(data['status'] == 'fail')
			self.assertTrue('Invalid token. Please log in again.', data['message'])
			self.assertEqual(response.status_code, 401)


	def test_user_status(self):
		add_user('test', 'test@test.com', 'test')
		with self.client:
			resp_login = self.client.post(
				'auth/login',
				data=json.dumps({
					'email': 'test@test.com',
					'password': 'test'
					}),
				content_type='application/json'
				)
			token= json.loads(resp_login.data.decode())['auth_token']
			response = self.client.get(
				'auth/status',
				headers={'Authorization' : f'Bearer {token}'}
				)
			data = json.loads(response.data.decode())
			#self.assertIn('Success.', data['message'])
			self.assertTrue(data['data'] is not None)
			self.assertTrue(data['data']['username'] == 'test')
			self.assertTrue(data['data']['email'] == 'test@test.com')
			self.assertTrue(data['data']['active'] == True)
			self.assertEqual(response.status_code, 200)


	def test_invalid_status(self):
		with self.client:
			response = self.client.get(
				'auth/status',
				headers={'Authorization': 'Bearer invalid'}
				)
			data = json.loads(response.data.decode())
			self.assertTrue(data['status'] == 'fail')
			self.assertIn('Invalid token. Please log in again', data['message'])
			self.assertEqual(response.status_code, 401)



if __name__ == '__main__':
	unittest.main()