import React from "react";
import {
  View,
  Dimensions,
  I18nManager as RNI18nManager,
  ActivityIndicator
} from "react-native";
import PropTypes from "prop-types";
import EStyleSheet from "react-native-extended-stylesheet";

import CoreMainNavigator from "./CoreMainNavigator";
import Screen from "./Screen";
import i18n from "../ran-i18n";

export default class CoreMain extends React.Component {
  state = {
    isI18nInitialized: false
  };
  render() {
    const Nav = CoreMainNavigator(this.props.modules);

    if (this.state.isI18nInitialized) {
      return <Nav />;
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

CoreMain.propTypes = {
  modules: PropTypes.object.isRequired
};

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
