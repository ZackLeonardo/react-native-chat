import React from "react";
import {
  View,
  Dimensions,
  I18nManager as RNI18nManager,
  ActivityIndicator
} from "react-native";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import Expo from "expo";

import EStyleSheet from "react-native-extended-stylesheet";
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware
} from "react-navigation-redux-helpers";

import i18n from "./base/utils/i18n";
import defaultTheme from "./base/styles/defaultTheme";

import Main from "./main";

const { width } = Dimensions.get("window");
EStyleSheet.build({
  ...defaultTheme,
  $rem: width > 340 ? 18 : 16
});

const AppReducer = () => {};

const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav
);

// store
const store = createStore(AppReducer, applyMiddleware(middleware));

export default class RNChatApp extends React.Component {
  state = {
    isI18nInitialized: false
  };

  render() {
    if (this.state.isI18nInitialized) {
      return (
        <Provider store={store}>
          <Main modules={this.props.modules} />
        </Provider>
      );
    }

    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  componentWillMount() {
    i18n
      .init()
      .then(() => {
        const RNDir = RNI18nManager.isRTL ? "RTL" : "LTR";

        // RN doesn't always correctly identify native
        // locale direction, so we force it here.
        if (i18n.dir !== RNDir) {
          const isLocaleRTL = i18n.dir === "RTL";

          RNI18nManager.forceRTL(isLocaleRTL);

          // RN won't set the layout direction if we
          // don't restart the app's JavaScript.
          Expo.Updates.reloadFromCache();
        }

        this.setState({ isI18nInitialized: true });
      })
      .catch(error => console.warn(error));
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
