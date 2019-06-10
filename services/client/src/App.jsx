import React, { Component } from 'react';
import axios from 'axios';
import UsersList from './components/UsersList';
import AddUser from './components/AddUser';
import About from './components/About.jsx';
import NavBar from './components/NavBar';
import Form from './components/forms/Form';
import Logout from './components/Logout';
import UserStatus from './components/UserStatus';
import Footer from './components/Footer';
import Exercises from './components/Exercises';
import { Route, Switch} from 'react-router-dom';
import Message from './components/Message';


class App extends Component {
	constructor() {
		super();

		this.state = {
			users: [],
			title: 'Testdriven.io',
			isAuthenticated: false,
			messageName: null,
			messageType: null,
		};

		this.logoutUser = this.logoutUser.bind(this);
		this.loginUser = this.loginUser.bind(this);
		this.createMessage = this.createMessage.bind(this);
		this.removeMessage = this.removeMessage.bind(this);
	}

	componentDidMount(){
		this.getUsers();
	}

	componentWillMount(){
		if(window.localStorage.getItem('authToken')){
			this.setState({isAuthenticated: true})
		}
	}

	getUsers() {
		axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
		.then((res) => { this.setState( { users: res.data.data.users} ); })
		.catch((err) => {console.log(err);});
	}

	loginUser(token) {
		window.localStorage.setItem('authToken', token);
		this.setState({ isAuthenticated: true});
		this.getUsers();
		this.createMessage('Welcome!', 'success');
	}

	logoutUser() {
		window.localStorage.clear();
		this.setState({ isAuthenticated: false});
	}

	createMessage(name, type) {
		this.setState({
			messageName: name,
			messageType: type,
		});

		let timeout = 3000;

		setTimeout(()=>{
			this.removeMessage();
		}, timeout);
	};

	removeMessage() {
		this.setState({
			messageName: null,
			messageType: null,
		});
	};

	render() {
	return (
	<div>
	<NavBar title={this.state.title} isAuthenticated={this.state.isAuthenticated}/>
	<section className="section">
		<div className="container">
			{this.state.messageName && this.state.messageType && 
				<Message
					messageName={this.state.messageName}
					messageType={this.state.messageType}
					removeMessage={this.removeMessage}
				/>
			}
			<div className="columns">
				<div className="column is-half">
				<br/>
				<Switch>
				<Route exact path='/' render = {() => (
				 <Exercises
				 isAuthenticated={this.state.isAuthenticated}
				 />
				)}/>
				<Route exact path='/all-users' render = {()=> (
					<UsersList users={this.state.users}/>
				)}/>
				<Route exact path='/about' component={About}/>
				<Route exact path='/register' render={() => (
					<Form
						formtype={'Register'}
						isAuthenticated={this.state.isAuthenticated}
						loginUser={this.loginUser}
						createMessage={this.createMessage}
					/>
				)}/>
				<Route exact path='/login' render={() => (
					<Form
						formtype={'Login'}
						isAuthenticated={this.state.isAuthenticated}
						loginUser={this.loginUser}
						createMessage={this.createMessage}
					/>
				)}/>
				<Route exact path='/logout' render={() => (
					<Logout
					logoutUser={this.logoutUser}
					isAuthenticated={this.state.isAuthenticated}
					loginUser={this.loginUser}
					/>
				)}/>
				<Route exact path='/status' render={() => (
					<UserStatus isAuthenticated={this.state.isAuthenticated}/>
				)}/>
				</Switch>
				</div>
			</div>
		</div>
	</section>
	<Footer/>
	</div>
		)
	}
};

export default App;