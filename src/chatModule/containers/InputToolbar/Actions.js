/**
 * InputToolbar
 * the Component which show Actions area
 *
 * @zack
 */

import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ViewPropTypes,
  Text,
  TouchableOpacity,
  ActionSheetIOS
} from "react-native";
import PropTypes from "prop-types";

import Icon from "@expo/vector-icons/FontAwesome";

class Actions extends Component {
  constructor(props) {
    super(props);
    this.onActionsPress = this.onActionsPress.bind(this);
  }

  onActionsPress() {
    const options = Object.keys(this.props.options);
    const cancelButtonIndex = Object.keys(this.props.options).length - 1;
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        tintColor: this.props.optionTintColor
      },
      buttonIndex => {
        let i = 0;
        for (let key in this.props.options) {
          if (this.props.options.hasOwnProperty(key)) {
            if (buttonIndex === i) {
              this.props.options[key](this.props);
              return;
            }
            i++;
          }
        }
      }
    );
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={this.props.onPressActionButton || this.onActionsPress}
      >
        {this.renderIcon()}
      </TouchableOpacity>
    );
  }

  // <Icon name="plus-circle" size={22} color={'red'}/>
  renderIcon() {
    if (this.props.icon) {
      return this.props.icon();
    }
    return (
      <View style={[styles.wrapper, this.props.wrapperStyle]}>
        <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center"
  }
});

Actions.contextTypes = {
  actionSheet: PropTypes.func
};

Actions.defaultProps = {
  onSend: () => {},
  options: {},
  optionTintColor: "#007AFF",
  icon: null,
  containerStyle: {},
  iconTextStyle: {},
  onPressActionButton: null
};

Actions.propTypes = {
  onSend: PropTypes.func,
  options: PropTypes.object,
  optionTintColor: PropTypes.string,
  icon: PropTypes.func,
  onPressActionButton: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  iconTextStyle: Text.propTypes.style
};

module.exports = Actions;
