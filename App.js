import React from "react";
import { View, Text } from "react-native";
import { Localization } from "expo";

import RNChatApp from "./src/src";
import zhMessages from "./src/main/ran-i18n/lang/zh";
import enMessages from "./src/main/ran-i18n/lang/en";

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Home!</Text>
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

// const authProvider = (type, params) => {
//   return Promise.resolve("ok");
// };

export default class App extends React.Component {
  render() {
    const modules = {
      Home: HomeScreen,
      Setting: SettingsScreen
    };

    const i18ns = {
      cn_zh: zhMessages,
      en: enMessages
    };
    const i18nProvider = locale => i18ns[locale];

    return (
      <RNChatApp
        // authProvider={authProvider}
        locale={Localization.locale.indexOf("zh") > -1 ? "cn_zh" : "en"}
        i18nProvider={i18nProvider}
        modules={modules}
      />
    );
  }
}
