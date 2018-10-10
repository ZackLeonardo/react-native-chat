//from git: https://github.com/mmazzarolo/react-native-login-animation-example
import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

import AuthScreen from "./containers/AuthScreen";

/**
 * The root component of the application.
 * In this component I am handling the entire application state, but in a real app you should
 * probably use a state management library like Redux or MobX to handle the state (if your app gets bigger).
 */
export class LoginView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false, // Is the user authenticated?
      isLoading: false // Is the user loggingIn/signinUp?
    };
  }

  // logout={() => this.setState({ isLoggedIn: false})}
  resetStatus(isLoggedIn = false, isLoading = false) {
    this.setState({
      isLoggedIn: isLoggedIn,
      isLoading: isLoading
    });
  }

  /**
   * Two login function that waits 1000 ms and then authenticates the user succesfully.
   * In your real app they should be replaced with an API call to you backend.
   */
  _Login = (username, password) => {
    this.setState({ isLoading: true });
    if (this.props.login) {
      this.props.login(username, password);
    } else {
      this.setState({ isLoggedIn: true, isLoading: false });
      this.props.navigation.navigate("App");
    }
  };

  _Signup = (username, password, fullName) => {
    this.setState({ isLoading: true });
    if (this.props.signup) {
      this.props.signup(username, password, fullName);
    } else {
      console.log("signup func is null");
      // setTimeout(() => this.setState({ isLoggedIn: true, isLoading: false }), 1000);
    }
  };

  render() {
    return (
      <AuthScreen
        login={this._Login}
        signup={this._Signup}
        isLoggedIn={this.state.isLoggedIn}
        isLoading={this.state.isLoading}
        onLoginAnimationCompleted={() => this.setState({ isAppReady: true })}
      />
    );
  }
}

LoginView.propTypes = {
  login: PropTypes.func,
  logout: PropTypes.func,
  signup: PropTypes.func,
  children: PropTypes.node
};

export default LoginView;
