const randomstring = require('randomstring');

const username = randomstring.generate();
const email = `${username}@test.com`;
const password = 'greaterthanten';


describe('Register', ()=>{
	it('should display the registration form', ()=>{
		cy
		.visit('/register')
		.get('h1').contains('Register')
		.get('form')
		.get('input[disabled]')
		.get('.validation-list')
		.get('.validation-list > .error').first().contains('Username must be greater than 5 characters.');
	})

	it('should validate the password field', ()=>{
		cy
		.visit('/register')
		.get('h1').contains('Register')
		.get('form')
		.get('input[disabled]')
		.get('.validation-list > .error').contains('Password must be greater than 10 characters.')
		.get('input[name="password"]').type(password)
		.get('.validation-list')
		.get('.validation-list > .error').contains('Password must be greater than 10 characters.').should('not.be.visible')
		.get('.validation-list > .success').contains('Password must be greater than 10 characters.');

		cy.get('.navbar-burger').click()
		cy.get('.navbar-item').contains('Log In').click();
		cy.get('.navbar-item').contains('Register').click();
		cy.get('.validation-list > .error').contains('Password must be greater than 10 characters.');
	})

	it('should allow a user to register', ()=>{
		//register the user
		cy
		.visit('/register')
		.get('input[name="username"]').type(username)
		.get('input[name="email"]').type(email)
		.get('input[name="password"]').type(password)
		.get('input[type="submit"]').click();

		cy.wait(2000);

		//assert user is redirected to '/'
		cy.contains('All Users');
		cy.contains(username);
		cy.get('.navbar-burger').click();
		cy.get('.navbar-menu').within(()=> {
			cy.get('.navbar-item').contains('Status');
			cy.get('.navbar-item').contains('Log Out');
			cy.get('.navbar-item').contains('Log In').should('not.be.visible');
			cy.get('.navbar-item').contains('Register').should('not.be.visible');
		})
	})

	it('should throw an error is duplicate username', ()=>{
		cy
		.visit('/register')
		.get('input[name="username"]').type(username)
		.get('input[name="email"]').type(`${email}unique`)
		.get('input[name="password"]').type(password)
		.get('input[type="submit"]').click();

		cy.contains('All Users').should('not.be.visible');
		cy.contains('Register');
		cy.get('.navbar-burger').click();
		cy.get('.navbar-menu').within(() =>{
			cy.get('.navbar-item').contains('Status').should('not.be.visible');
			cy.get('.navbar-item').contains('Log Out').should('not.be.visible');
			cy.get('.navbar-item').contains('Log In');
			cy.get('.navbar-item').contains('Register');
		});

		cy.get('.notification.is-success').should('not.be.visible');
		cy.get('.notification.is-danger').contains('That user already exists.');
	})

	it('should throw an error is duplicate email', ()=>{
		cy
		.visit('/register')
		.get('input[name="username"]').type(`${username}unique`)
		.get('input[name="email"]').type(email)
		.get('input[name="password"]').type(password)
		.get('input[type="submit"]').click();

		cy.contains('All Users').should('not.be.visible');
		cy.contains('Register');
		cy.get('.navbar-burger').click();
		cy.get('.navbar-menu').within(() =>{
			cy.get('.navbar-item').contains('Status').should('not.be.visible');
			cy.get('.navbar-item').contains('Log Out').should('not.be.visible');
			cy.get('.navbar-item').contains('Log In');
			cy.get('.navbar-item').contains('Register');
		});

		cy.get('.notification.is-success').should('not.be.visible');
		cy.get('.notification.is-danger').contains('That user already exists.');
	})


});