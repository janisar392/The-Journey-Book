import React from 'react';
import { shallow, configure } from 'enzyme';
import Login from "../components/login/Login";

it('should render the login component',()=>{
    const wrapper = shallow(<Login/>);
    expect(shallow(<Login />).find('form.login').exists()).toBe(true)

});
describe('User name input', () => {
    it('User name entering should respond to change event and change the state of the Login Component', () =>
    {
        const wrapper = shallow(<Login />);
        wrapper.find('#userName').simulate('change', {target: {name: 'userName', value:
                    'Hasindu'}});
        expect(wrapper.state('userName')).toEqual('Hasindu');
    })
})
describe('Password input', () => {
    it('Password entering should respond to change event and change the state of the Login Component', () =>
    {
        const wrapper = shallow(<Login />);
        wrapper.find('#password').simulate('change', {target: {name: 'password', value:
                    'Hasindu'}});
        expect(wrapper.state('password')).toEqual('Hasindu');
    })
})
