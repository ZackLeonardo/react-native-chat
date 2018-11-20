import React from "react";
import PropTypes from "prop-types";
import { createSwitchNavigator } from "react-navigation";

import CoreMainNavigator from "./CoreMainNavigator";
// import LoginView from "../../defaultLoginModule/LoginView";
// import { store } from "../../src";
// import { appInit } from "../../chatModule/actions";
// import { selectServerRequest } from "../../chatModule/redux/actions/server";
// import { iconsLoaded } from "../../chatModule/Icons";
// import { registerScreens } from "../../chatModule/views";
import { ChatNavigator } from "../../chatModule";

// registerScreens(store);
// iconsLoaded();

export default class CoreMain extends React.Component {
  // constructor(props) {
  //   super(props);

  //   store.dispatch(selectServerRequest({ server: "http://localhost:3000" }));
  //   store.dispatch(appInit());
  //   store.subscribe(this.onStoreUpdate).bind(this);
  // }

  // onStoreUpdate = () => {
  //   console.log(store.getState());

  //   const { root } = store.getState().app;

  //   if (this.currentRoot !== root) {
  //     this.currentRoot = root;
  //     if (root === "outside") {
  //       console.log("startNotLogged();");
  //     } else if (root === "inside") {
  //       console.log("startLogged();");
  //     }
  //   }
  // };

  render() {
    const Nav = CoreMainNavigator(this.props.modules);

    const AuthNav = createSwitchNavigator(
      {
        // AuthLoading: AuthLoadingScreen,
        App: Nav,
        Base: ChatNavigator //() => <ChatModule /> //this.props.loginPage ? this.props.loginPage : () => <LoginView />
      },
      {
        initialRouteName: "Base"
      }
    );

    return <AuthNav />;
  }
}

CoreMain.propTypes = {
  modules: PropTypes.object.isRequired
};
