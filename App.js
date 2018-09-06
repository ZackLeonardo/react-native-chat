import React from "react";
import { View, Text } from "react-native";

import Main from "./src";
import { Screen } from "./src/main";
import Test from "./example/ChatList.example";

class HomeScreen extends React.Component {
  render() {
    return (
      <Screen>
        <Test />
      </Screen>
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

    return <Main modules={modules} />;
  }
}
