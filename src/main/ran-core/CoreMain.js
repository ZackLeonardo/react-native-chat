import React from "react";
import PropTypes from "prop-types";
import { createSwitchNavigator } from "react-navigation";

import CoreMainNavigator from "./CoreMainNavigator";
import LoginView from "../../defaultLoginModule/LoginView";

export default class CoreMain extends React.Component {
  render() {
    const Nav = CoreMainNavigator(this.props.modules);

    const AuthNav = createSwitchNavigator(
      {
        // AuthLoading: AuthLoadingScreen,
        App: Nav,
        Auth: this.props.loginPage ? this.props.loginPage : () => <LoginView />
      },
      {
        initialRouteName: "App"
      }
    );

    return <AuthNav />;
  }
}

CoreMain.propTypes = {
  modules: PropTypes.object.isRequired
};
