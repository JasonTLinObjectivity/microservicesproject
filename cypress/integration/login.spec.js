const randomstring = require('randomstring');

const username = randomstring.generate();
const email = `${username}@test.com`;
const password = 'greaterthanten';

describe('Login', ()=>{
	it('should display the sign in form', ()=>{
		cy
		.visit('/login')
		.get('h1').contains('Log In')
		.get('form')
		.get('input[disabled]')
		.get('.validation-list')
		.get('.validation-list > .error').first().contains('Email is required.')
	});

	it('logins properly', ()=>{
		
		cy
		.visit('/register')
		.get('input[name="username"]').type(username)
		.get('input[name="email"]').type(email)
		.get('input[name="password"]').type(password)
		.get('input[type="submit"]').click();

		cy.wait(2000);
		//log out
		cy.get('.navbar-burger').click();
		cy.contains('Log Out').click();

		//login
		cy
		.visit('/login')
		.get('input[name="email"]').type(email)
		.get('input[name="password"]').type(password)
		.get('input[type="submit"]').click()

		cy.wait(2000);
		

		cy.contains('All Users');
		cy
		.get('table')
		.find('tbody > tr').last()
		.find('td').contains(username);

		cy.get('.notification.is-success').contains('Welcome!');
		cy.get('.navbar-burger').click();

		cy.get('.navbar-burger').click();
		cy.get('.navbar-menu').within(()=>{
			cy
			.get('.navbar-item').contains('Status')
			.get('.navbar-item').contains('Log Out')
			.get('.navbar-item').contains('Log In').should('not.be.visible')
			.get('.navbar-item').contains('Register').should('not.be.visible');
		});

	});

	it('should throw an error is credentials are incorrect', ()=>{
		cy
		.visit('/login')
		.get('input[name="email"]').type('incorrect@email.com')
		.get('input[name="password"]').type(password)
		.get('input[type="submit"]').click();

		cy.contains('All Users').should('not.be.visible');
		cy.contains('Log In');

		cy.get('.navbar-burger').click();
		cy.get('.navbar-menu').within(()=>{
			cy
			.get('.navbar-item').contains('Status').should('not.be.visible')
			.get('.navbar-item').contains('Log Out').should('not.be.visible')
			.get('.navbar-item').contains('Log In')
			.get('.navbar-item').contains('Register');
		});

		cy
		.visit('/login')
		.get('input[name="email"]').type(email)
		.get('input[name="password"]').type('incorrectpassword')
		.get('input[type="submit"]').click();


		cy.contains('All Users').should('not.be.visible');
		cy.contains('Log In');

		cy.get('.navbar-burger').click();
		cy.get('.navbar-menu').within(()=>{
			cy
			.get('.navbar-item').contains('Status').should('not.be.visible')
			.get('.navbar-item').contains('Log Out').should('not.be.visible')
			.get('.navbar-item').contains('Log In')
			.get('.navbar-item').contains('Register');
		});


	})

});