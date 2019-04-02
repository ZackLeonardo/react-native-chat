import React from "react";
import PropTypes from "prop-types";
import Ionicons from "@expo/vector-icons/Ionicons";
import i18n from "i18n-js";

import CoreMainNavigator from "./CoreMainNavigator";
import { ChatModuleNavigator } from "../../chatModule";

class CoreMain extends React.Component {
  render() {
    if (!this.props.modules) {
      return <ChatModuleNavigator />;
    }

    const Nav = CoreMainNavigator({
      Chat: {
        screen: ChatModuleNavigator,
        navigationOptions: {
          tabBarLabel: i18n.t("ran.chat.chat"),
          tabBarIcon: ({ tintColor }) => (
            <Ionicons
              name={"ios-text"}
              size={26}
              style={{ color: tintColor }}
            />
          )
        }
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

    return <Nav />;
  }
}

CoreMain.propTypes = {
  modules: PropTypes.object
};

export default CoreMain;
