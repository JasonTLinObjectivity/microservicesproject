
const register = (username, email) => {
	cy
	.visit('/register')
	.get('input[name="username"]').type(username)
	.get('input[name="email"]').type(email)
	.get('input[name="password"]').type('test')
	.get('input[name="submit"]').click();

	cy.wait(500);
}