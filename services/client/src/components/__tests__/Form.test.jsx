import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import Form from '../Form';

const testdata = [
{
	formtype: 'Register',
	title: 'Register',
	formdata: {
		username: '',
		email: '',
		password: '',
	},
	handleUserFormSubmit: jest.fn(),
	handleFormChange: jest.fn(),
	isAuthenticated:false
},
{
	formtype: 'Login',
	title: 'Log In',
	formdata: {
		email:'',
		password:'',
	},
	handleUserFormSubmit: jest.fn(),
	handleFormChange: jest.fn(),
	isAuthenticated:false
},
]

describe('When not authenticated', () => {
testdata.forEach((el) => {
	const component = <Form 
	formtype={el.formtype} 
	formdata={el.formdata} 
	isAuthenticated={el.isAuthenticated}
	handleFormChange={el.handleFormChange}
	handleUserFormSubmit={el.handleUserFormSubmit}
	/>
	it(`${el.formtype} renders properly`, () => {
		const wrapper = shallow(component);
		const h1 = wrapper.find('h1');
		expect(h1.get(0).props.children).toBe(el.title);
		const formGroup = wrapper.find('.field');
		expect(formGroup.length).toBe(Object.keys(el.formdata).length)
		expect(formGroup.get(0).props.children.props.name).toBe(Object.keys(el.formdata)[0])
		expect(formGroup.get(0).props.children.props.value).toBe('');
	});

	it(`${el.formtype} Snapshot renders properly`, () => {
		const component = <Form formtype={el.formtype} formdata={el.formdata}/>
		const tree = renderer.create(component).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it(`${el.formtype} submits form properly`, () =>{
		const wrapper = shallow(component);
		const input = wrapper.find('input[type="email"]');
		expect(el.handleFormChange).toHaveBeenCalledTimes(0);
		input.simulate('change');
		expect(el.handleFormChange).toHaveBeenCalledTimes(1);

		expect(el.handleUserFormSubmit).toHaveBeenCalledTimes(0);
		wrapper.find('form').simulate('submit', el.formdata);
		expect(el.handleUserFormSubmit).toHaveBeenCalledWith(el.formdata);
		expect(el.handleUserFormSubmit).toHaveBeenCalledTimes(1);
	});
});
});

describe('When authenticated', ()=> {
	testdata.forEach((el) => {
		const component = <Form formtype={el.formtype} formdata={el.formdata} isAuthenticated={true}/>
		it(`${el.formtype} redirects properly`, () => {
			const wrapper = shallow(component);
			expect(wrapper.find('Redirect')).toHaveLength(1);
		});
	});
})

