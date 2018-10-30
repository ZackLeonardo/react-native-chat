import React from "react";
import {
  View,
  I18nManager as RNI18nManager,
  ActivityIndicator
} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

import { CoreMain, Screen } from "./ran-core";
import i18n, { TranslationProvider } from "./ran-i18n";
import { store } from "../src";
import { appInit } from "../chatModule/redux/actions";

class AppDesk extends React.Component {
  constructor(props) {
    super(props);

    store.dispatch(appInit());
    this.state = {
      isI18nInitialized: true
    };
  }

  render() {
    if (this.state.isI18nInitialized) {
      return (
        <TranslationProvider>
          <CoreMain {...this.props} />
        </TranslationProvider>
      );
    }

    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  // componentWillMount() {
  //   i18n
  //     .init()
  //     .then(() => {
  //       const RNDir = RNI18nManager.isRTL ? "RTL" : "LTR";

  //       // RN doesn't always correctly identify native
  //       // locale direction, so we force it here.
  //       if (i18n.dir !== RNDir) {
  //         const isLocaleRTL = i18n.dir === "RTL";

  //         RNI18nManager.forceRTL(isLocaleRTL);

  //         // RN won't set the layout direction if we
  //         // don't restart the app's JavaScript.
  //         Expo.Updates.reloadFromCache();
  //       }

  //       this.setState({ isI18nInitialized: true });
  //     })
  //     .catch(error => console.warn(error));
  // }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export { AppDesk, Screen };
