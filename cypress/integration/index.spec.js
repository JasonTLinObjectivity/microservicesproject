describe('Index', ()=>{
	it('should display page correctly if a user is not logged in', ()=> {
		cy
		.visit('/')
		.get('h1').contains('All Users')
		.get('.navbar-burger').click()
		.get('a').contains('Status').should('not.be.visible')
		.get('a').contains('Log Out').should('not.be.visible')
		.get('a').contains('Register')
		.get('a').contains('Log In')
		.get('notification.is-success').should('not.be.visible');
	});
});