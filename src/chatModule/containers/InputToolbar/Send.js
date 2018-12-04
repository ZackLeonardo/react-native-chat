/**
 * InputToolbar
 * the Component which show Send area
 *
 * @zack
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ViewPropTypes,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

class Send extends Component{
  render() {
    return (
      <TouchableOpacity
        style={[styles.containerStyle, this.props.containerStyle]}
        onPress={() => {
          this.props.onSend();
        }}
        accessibilityTraits='button'
      >
        <Text style={[styles.textStyle, this.props.textStyle]}>{this.props.label}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    width: 61,
    height: 44,
    justifyContent: 'flex-end',
  },
  textStyle: {
    color: '#0084ff',
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: 'transparent',
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
  },
});

Send.defaultProps = {
  text: '',
  onSend: () => {},
  label: '发送',
  containerStyle: {},
  textStyle: {},
};

Send.propTypes = {
  text: PropTypes.string,
  onSend: PropTypes.func,
  label: PropTypes.string,
  containerStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
};

module.exports = Send;
