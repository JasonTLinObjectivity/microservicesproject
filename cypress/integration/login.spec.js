const randomstring = require('randomstring');

const username = randomstring.generate();
const email = `${username}@test.com`;

Cypress.conf

describe('Login', ()=>{
	it('should display the sign in form', ()=>{
		cy
		.visit('/login')
		.get('h1').contains('Log In')
		.get('form')
	});

	it('logins properly', ()=>{
		
		cy
		.visit('/register')
		.get('input[name="username"]').type(username)
		.get('input[name="email"]').type(email)
		.get('input[name="password"]').type('test')
		.get('input[type="submit"]').click();

		cy.wait(2000);
		//log out
		cy.get('.navbar-burger').click();
		cy.contains('Log Out').click();

		//login
		cy
		.visit('/login')
		.get('input[name="email"]').type(email)
		.get('input[name="password"]').type('test')
		.get('input[type="submit"]').click()

		cy.wait(2000);
		

		cy.contains('All Users');
		cy
		.get('table')
		.find('tbody > tr').last()
		.find('td').contains(username);

		cy.get('.navbar-burger').click();
		cy.get('.navbar-menu').within(()=>{
			cy
			.get('.navbar-item').contains('Status')
			.get('.navbar-item').contains('Log Out')
			.get('.navbar-item').contains('Log In').should('not.be.visible')
			.get('.navbar-item').contains('Register').should('not.be.visible');
		});

	});

});