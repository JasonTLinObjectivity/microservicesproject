import React from 'react';
import { Redirect } from 'react-router-dom';

const Form = (props) => {
	if (props.isAuthenticated) {
		return(
			<Redirect  to='/'/>	
		)
	}
	return(
	<div>
	{
		props.formtype === 'Login' &&
		<h1 className="title is-1">Log In</h1>
	}
	{
		props.formtype === 'Register' &&
		<h1 className="title is-1">Register</h1>
	}
	<hr/><br/>
	<form onSubmit={(event) => props.handleUserFormSubmit(event)}>
	 {
	 	props.formtype === 'Register' && 
	 	<div className="field">
	 		<input
	 			name="username"
	 			className="input is-medium"
	 			type="text"
	 			placeholder="Enter a username"
	 			required
	 			value={props.formdata.username}
	 			onChange={props.handleFormChange}
	 		/>
	 	</div>
	}
	<div className="field">
		<input
			name="email"
			className="input is-medium"
			type="email"
			placeholder="Enter an email address"
			required
			value={props.formdata.email}
			onChange={props.handleFormChange}
		/>
	</div>
	<div className="field">
		<input
			name="password"
			className="input is-medium"
			type="password"
			placeholder="Enter a password"
			required
			value={props.formdata.password}
			onChange={props.handleFormChange}
		/>
	</div>
		<input
			type="submit"
			className="button is-primary is-medium is-fullwidth"
			value="Submit"
		/>
	</form>
	</div>
)};


export default Form;