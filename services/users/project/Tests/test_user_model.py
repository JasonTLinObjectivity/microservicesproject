import unittest

from project import db
from project.api.models import User
from project.Tests.base import BaseTestCase
from project.Tests.utils import add_user

from sqlalchemy.exc import IntegrityError

class TestUserModel(BaseTestCase):
	def test_add_user(self):
		user = add_user('justatest', 'test@test.com', 'greaterthaneight')
		self.assertTrue(user.id)
		self.assertEqual(user.username, 'justatest')
		self.assertEqual(user.email, 'test@test.com')
		self.assertTrue(user.active)
		self.assertTrue(user.password)


	def test_add_user_duplicate_username(self):
		user = add_user('justatest', 'test@test.com', 'greaterthaneight')
		with self.assertRaises(IntegrityError):
			add_user('justatest', 'test@test2.com', 'greaterthaneight')


	def test_add_user_duplicate_email(self):
		user = add_user('justatest', 'test@test.com', 'greaterthaneight')
		with self.assertRaises(IntegrityError):
			add_user('justanotertest', 'test@test.com', 'greaterthaneight')


	def test_to_json(self):
		user = add_user('justatest', 'test@test.com', 'greaterthaneight')
		self.assertTrue(isinstance(user.to_json(), dict))


	def test_passwords_are_random(self):
		user_one = add_user('justatest', 'test@test.com', 'greaterthaneight')
		user_two = add_user('justatest2', 'test@test2.com', 'greaterthaneight')
		self.assertNotEqual(user_one.password, user_two.password)

if __name__ == '__main__':
	unittest.main()
