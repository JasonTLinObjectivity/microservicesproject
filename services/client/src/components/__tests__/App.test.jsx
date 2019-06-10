import React from 'react';
import { shallow, mount } from 'enzyme';
import App from '../../App'
import { MemoryRouter as Router} from 'react-router-dom';
import AceEditor from 'react-ace';
jest.mock('react-ace');

beforeAll(()=>{
	global.localStrong = {
		getItem: () => 'someToken'
	};
});


test('App renders without crashing', () => {
	const wrapper = shallow(<App/>);
});

test('App will call call componentWIllMount', () =>{
	const onWillMount = jest.fn();
	App.prototype.componentWillMount = onWillMount;
	const wrapper = mount(<Router><App/></Router>);
	expect(onWillMount).toHaveBeenCalledTimes(1);
})