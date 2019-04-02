import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage
} from "react-native";
import { Localization } from "expo";
import i18n from "i18n-js";
import Ionicons from "@expo/vector-icons/Ionicons";

import RNChatApp from "./src/src";
import cn_zh from "./src/main/ran-i18n/lang/zh";
import en from "./src/main/ran-i18n/lang/en";

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{i18n.t("ran.chat.name")}</Text>
      </View>
    );
  }
}

class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Settings!</Text>
      </View>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isI18nInitialized: false
    };
  }

  async componentDidMount() {
    const locale = await AsyncStorage.getItem("locale");
    if (locale) {
      this.setState({ locale: locale });
    } else {
      this.setState({
        locale: Localization.locale.indexOf("zh") > -1 ? "cn_zh" : "en"
      });
    }
    this.setState({ isI18nInitialized: true });
  }

  render() {
    const modules = {
      Home: HomeScreen,
      Setting: SettingsScreen
    };

    if (this.state.isI18nInitialized) {
      return (
        <RNChatApp
          locale={this.state.locale}
          i18nProvider={{ cn_zh, en }}
          modules={modules}
        />
      );
    }

    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
