import React from "react";
import PropTypes from "prop-types";
import { createSwitchNavigator } from "react-navigation";
import { compose, hoistStatics } from "recompose";

import { translate } from "../ran-i18n";
import CoreMainNavigator from "./CoreMainNavigator";
// import LoginView from "../../defaultLoginModule/LoginView";
// import { store } from "../../src";
// import { appInit } from "../../chatModule/actions";
// import { selectServerRequest } from "../../chatModule/redux/actions/server";
// import { iconsLoaded } from "../../chatModule/Icons";
// import { registerScreens } from "../../chatModule/views";
import { ChatModuleNavigator } from "../../chatModule";

// registerScreens(store);
// iconsLoaded();

class CoreMain extends React.Component {
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
    const Nav = CoreMainNavigator({
      Chat: {
        screen: ChatModuleNavigator
      },
      ...this.props.modules
    });

    // const AuthNav = createSwitchNavigator(
    //   {
    //     // AuthLoading: AuthLoadingScreen,
    //     App: Nav,
    //     Base: ChatModuleNavigator //() => <ChatModule /> //this.props.loginPage ? this.props.loginPage : () => <LoginView />
    //   },
    //   {
    //     initialRouteName: "App"
    //   }
    // );

    return <Nav screenProps={{ translate: this.props.translate }} />;
  }
}

CoreMain.propTypes = {
  modules: PropTypes.object.isRequired
};

export default hoistStatics(compose(translate))(CoreMain);
