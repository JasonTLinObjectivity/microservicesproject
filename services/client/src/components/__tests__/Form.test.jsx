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
	}
},
{
	formtype: 'Login',
	title: 'Log In',
	formdata: {
		email:'',
		password:'',
	}
}
]


testdata.forEach((el) => {
	test(`${el.formtype} renders properly`, () => {
		const component = <Form formtype={el.formtype} formdata={el.formdata}/>
		const wrapper = shallow(component);
		const h1 = wrapper.find('h1');
		expect(h1.get(0).props.children).toBe(el.title);
		const formGroup = wrapper.find('.field');
		expect(formGroup.length).toBe(Object.keys(el.formdata).length)
		expect(formGroup.get(0).props.children.props.name).toBe(Object.keys(el.formdata)[0])
		expect(formGroup.get(0).props.children.props.value).toBe('');
	});

	test(`${el.formtype} Snapshot renders properly`, () => {
		const component = <Form formtype={el.formtype} formdata={el.formdata}/>
		const tree = renderer.create(component).toJSON();
		expect(tree).toMatchSnapshot();
	});
});


