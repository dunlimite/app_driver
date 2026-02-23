/**
 * @format
 */

import 'react-native';
import React from 'react';
// import App from '../App';
import Profile from '../src/pages/Profile';
import Login from '../src/pages/Login';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<Login />);
});
