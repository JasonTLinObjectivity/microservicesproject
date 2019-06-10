#!/bin/bash

type=$1
fails=""

inspect() {
	if [ $1 -ne 0]; then
		fails="${fails} $2"
	fi
}


# run unit and integration tests
server(){
	sudo -E docker-compose up -d --build
	sudo -E docker-compose exec users python manage.py test
	inspect $? users
	sudo -E docker-compose exec users flake8 --ignore=E501 project
	sudo -E docker-compose down
}

client(){
	sudo -E docker-compose up -d --build
	sudo -E docker-compose exec client npm test -- --coverage -u
	inspect $? client
	sudo -E docker-compose down
}

e2e(){
	sudo -E docker-compose -f docker-compose-prod.yml up -d --build
	sudo -E docker-compose -f docker-compose-prod.yml exec users python manage.py recreate_db
	./node_modules/.bin/cypress run --config baseUrl=http://localhost
	inspect $? e2e
	sudo -E docker-compose -f docker-compose-prod.yml down

}

all(){
	sudo -E docker-compose up -d --build
	sudo -E docker-compose exec users python manage.py test
	inspect $? users
	sudo -E docker-compose exec users flake8 --ignore=E501 project
	sudo -E docker-compose exec client npm test -- --coverage -u
	inspect $? client
	sudo -E docker-compose down
	e2e
}


if [[ "${type}" == "server" ]]; then
	echo "\n"
	echo "Running server-side tests!\n"
	server
elif [[ "${type}" == "client" ]]; then
	echo "\n"
	echo "Running client-side tests!\n"
	client
elif [[ "${type}" == "e2e" ]]; then
	echo "\n"
	echo "Running e2e tests!\n"
	e2e
else
	echo "\n"
	echo "Running all tests!\n"
	all
fi


if [ -n "${fails}" ]; then
	echo "Tests failed: ${fails}"
	exit 1
else
	echo "Test passed!"
	exit 0
fi
