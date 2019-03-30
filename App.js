import React from "react";
import { View, Text } from "react-native";
import { Localization } from "expo";
import i18n from "i18n-js";

import RNChatApp from "./src/src";
import cn_zh from "./src/main/ran-i18n/lang/zh";
import en from "./src/main/ran-i18n/lang/en";

i18n.fallbacks = true;
i18n.translations = { cn_zh, en };
i18n.locale = Localization.locale.indexOf("zh") > -1 ? "cn_zh" : "en";

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
  render() {
    const modules = {
      Home: HomeScreen,
      Setting: SettingsScreen
    };

    return <RNChatApp modules={modules} />;
  }
}
