//from git: https://github.com/mmazzarolo/react-native-login-animation-example
import React, { Component } from "react";
import { Keyboard } from "react-native";

import AuthScreen from "./containers/AuthScreen";
import RocketChat from "../chatModule/rocketchat/rocketchat";
import { store } from "../src";
import { loginRequest } from "../chatModule/redux/actions/login";

/**
 * The root component of the application.
 * In this component I am handling the entire application state, but in a real app you should
 * probably use a state management library like Redux or MobX to handle the state (if your app gets bigger).
 */
export class LoginView extends Component {
  constructor(props) {
    super(props);

    RocketChat.connect("http://localhost:3000");

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
  _Login = async (username, password) => {
    if (username.trim() === "" || password.trim() === "") {
      // showToast(I18n.t("Email_or_password_field_is_empty"));
      console.log("Email_or_password_field_is_empty");
      return;
    }
    Keyboard.dismiss();

    store.dispatch(loginRequest({ username, password }));
    // this.setState({ isLoading: true });

    try {
      await RocketChat.loginWithPassword({ username, password });
    } catch (error) {
      console.warn("LoginView submit", error);
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
    console.log(this.props);

    return (
      <AuthScreen
        ref={ref => (this.AuthScreenRef = ref)}
        login={this._Login}
        signup={this._Signup}
        onLoginAnimationCompleted={() => {
          if (!store.getState().login.failure) {
            this.props.navigation.navigate("App");
          }
        }}
      />
    );
  }
}
// LoginView.propTypes = {
//   login: PropTypes.func,
//   logout: PropTypes.func,
//   signup: PropTypes.func,
//   children: PropTypes.node,
//   server: PropTypes.string,
//   failure: PropTypes.bool,
//   isFetching: PropTypes.bool,
//   reason: PropTypes.string,
//   error: PropTypes.string
// };

// const mapStateToProps = state => {
//   return {
//     server: state.server.server,
//     failure: state.login.failure,
//     isFetching: state.login.isFetching,
//     reason: state.login.error && state.login.error.reason,
//     error: state.login.error && state.login.error.error
//   };
// };

// const LoginViewApp = connect(mapStateToProps)(LoginView);
export default LoginView;
// export default compose(
//   connect(mapStateToProps),
//   translate
// )(LoginView);
