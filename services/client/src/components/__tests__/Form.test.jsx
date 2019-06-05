import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import Form from '../forms/Form';

const testdata = [
{
	formtype: 'Register',
	title: 'Register',
	formdata: {
		username: '',
		email: '',
		password: '',
	},
	loginUser: jest.fn(),
	isAuthenticated:false
},
{
	formtype: 'Login',
	title: 'Log In',
	formdata: {
		email:'',
		password:'',
	},
	loginUser: jest.fn(),
	isAuthenticated:false
},
]

describe('When not authenticated', () => {
testdata.forEach((el) => {
	const component = <Form 
	formtype={el.formtype} 
	formdata={el.formdata} 
	isAuthenticated={el.isAuthenticated}
	/>

	it(`${el.formtype} Form should be disabled by default`, ()=>{
		const wrapper = shallow(component);
		const input = wrapper.find('input[type="submit"]');
		expect(input.get(0).props.disabled).toEqual(true);
	});

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
		wrapper.instance().handleUserFormSubmit = jest.fn();
		wrapper.instance().validateForm = jest.fn();
		wrapper.update();
		const input = wrapper.find('input[type="email"]');
		expect(wrapper.instance().handleUserFormSubmit).toHaveBeenCalledTimes(0);
		input.simulate('change', {target: {name: 'email', value: 'test@test.com'}});
		wrapper.find('form').simulate('submit', el.formdata);
		expect(wrapper.instance().handleUserFormSubmit).toHaveBeenCalledWith(el.formdata);
		expect(wrapper.instance().handleUserFormSubmit).toHaveBeenCalledTimes(1);
		expect(wrapper.instance().validateForm).toHaveBeenCalledTimes(1);
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

