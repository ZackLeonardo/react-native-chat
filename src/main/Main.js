import React from 'react';
import { Dimensions } from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';

import defaultTheme from '../base/styles/defaultTheme';
import Test from '../../example/Avatar.example';



// define REM depending on screen width
const { width } = Dimensions.get('window');
const rem = 16;

EStyleSheet.build({
    ...defaultTheme,
    $rem: width > 340 ? 18 : 16,
});


export default class Main extends React.Component {
    render() {
        return (
            <Test />
        );
    }
}
