#!/bin/bash

fails=""

inspect() {
	if [ $1 -ne 0]; then
		fails="${fails} $2"
	fi
}


# run unit and integration tests
sudo -E docker-compose up -d --build
sudo -E docker-compose exec users python manage.py test
inspect $? users
sudo -E docker-compose exec users flake8 --ignore=E501 project
inspect $? users-lint
sudo -E docker-compose exec client npm test -- --coverage
inspect $? client
sudo -E docker-compose down

if [ -n "${fails}"]; then
	echo "Tests failed: ${fails}"
	exit 1
else
	echo "Test passed!"
	exit 0
fi