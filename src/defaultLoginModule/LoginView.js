//from git
import React, { Component } from "react";
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
      isLoading: false, // Is the user loggingIn/signinUp?
      isAppReady: false // Has the app completed the login animation?
    };
  }

  // logout={() => this.setState({ isLoggedIn: false, isAppReady: false })}
  resetStatus(isLoggedIn = false, isLoading = false, isAppReady = false) {
    this.setState({
      isLoggedIn: isLoggedIn,
      isLoading: isLoading,
      isAppReady: isAppReady
    });
  }

  /**
   * Two login function that waits 1000 ms and then authenticates the user succesfully.
   * In your real app they should be replaced with an API call to you backend.
   */
  _simulateLogin = (username, password) => {
    this.setState({ isLoading: true });
    if (this.props.login) {
      this.props.login(username, password);
    } else {
      console.log("login func is null");
    }
  };

  _simulateSignup = (username, password, fullName) => {
    this.setState({ isLoading: true });
    if (this.props.signup) {
      this.props.signup(username, password, fullName);
    } else {
      console.log("signup func is null");
      // setTimeout(() => this.setState({ isLoggedIn: true, isLoading: false }), 1000);
    }
  };

  /**
   * Simple routing.
   * If the user is authenticated (isAppReady) show the HomeScreen, otherwise show the AuthScreen
   */
  render() {
    if (this.state.isAppReady) {
      return this.props.children;
    } else {
      return (
        <AuthScreen
          login={this._simulateLogin}
          signup={this._simulateSignup}
          isLoggedIn={this.state.isLoggedIn}
          isLoading={this.state.isLoading}
          onLoginAnimationCompleted={() => this.setState({ isAppReady: true })}
        />
      );
    }
  }
}

LoginView.propTypes = {
  login: PropTypes.func,
  logout: PropTypes.func,
  signup: PropTypes.func,
  children: PropTypes.node
};

export default LoginView;
