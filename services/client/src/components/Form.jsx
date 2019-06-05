import React, { Component } from 'react';
import axios from 'axios'
import { Redirect } from 'react-router-dom';

class Form extends Component{
	constructor (props) {
		super(props);
		this.state = {
			formdata: {
				username:'',
				email:'',
				password:'',
			}
		}
		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
	}

	componentDidMount() {
		this.clearForm();
		console.log(this.state)
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.formType !== nextProps.formtype){
			this.clearForm();
		};
	}

	handleFormChange(event) {
		const obj = this.state.formdata;
		obj[event.target.name] = event.target.value;
		this.setState(obj);
	}

	handleUserFormSubmit(event) {
		event.preventDefault();
		const formType= this.props.formtype;
		const data = {
			'email': this.state.formdata.email,
			'password': this.state.formdata.password
		}

		if(formType === 'Register') {
			data.username = this.state.formdata.username;
		}
		const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${formType.toLowerCase()}`;
		axios.post(url, data)
		.then((res) => {
			this.clearForm();
			window.localStorage.setItem('authToken', res.data.auth_token);
			this.setState({isAuthenticated: true,});
			this.props.loginUser(res.data.auth_token);
		})
		.catch((err) =>{
			console.log('Hi');
		})

	}

	clearForm() {
		this.setState({
			formdata:{
				username:'',
				email:'',
				password:'',
			}
		});
	}


	render() {
	if (this.props.isAuthenticated) {
		return(
			<Redirect  to='/'/>	
		)
	}
	return(
	<div>
	{
		this.props.formtype === 'Login' &&
		<h1 className="title is-1">Log In</h1>
	}
	{
		this.props.formtype === 'Register' &&
		<h1 className="title is-1">Register</h1>
	}
	<hr/><br/>
	<form onSubmit={(event) => this.handleUserFormSubmit(event)}>
	 {
	 	this.props.formtype === 'Register' && 
	 	<div className="field">
	 		<input
	 			name="username"
	 			className="input is-medium"
	 			type="text"
	 			placeholder="Enter a username"
	 			required
	 			value={this.state.formdata.username}
	 			onChange={this.handleFormChange}
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
			value={this.state.formdata.email}
			onChange={this.handleFormChange}
		/>
	</div>
	<div className="field">
		<input
			name="password"
			className="input is-medium"
			type="password"
			placeholder="Enter a password"
			required
			value={this.state.formdata.password}
			onChange={this.handleFormChange}
		/>
	</div>
		<input
			type="submit"
			className="button is-primary is-medium is-fullwidth"
			value="Submit"
		/>
	</form>
	</div>
)}

};


export default Form;