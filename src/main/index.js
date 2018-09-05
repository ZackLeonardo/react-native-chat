import React from "react";
import { Text, View } from "react-native";
import { CoreMain, Screen } from "./ran-core";

class HomeScreen extends React.Component {
  render() {
    return (
      <Screen>
        <Text>Home!</Text>
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

const modules = {
  Home: HomeScreen,
  Setting: SettingsScreen
};

export default CoreMain(modules);
