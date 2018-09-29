import React from "react";
import { View, Text } from "react-native";

import RNChatApp from "./src/src";
import { Screen } from "./src/main/main";
import RoomsView from "./src/chatModule/rooms/RoomsView";
import { LoginView } from "./src/defaultLoginModule/LoginView";

class HomeScreen extends React.Component {
  render() {
    return (
      <Screen>
        <RoomsView />
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

    return <RNChatApp modules={modules} />; //<LoginView />;
  }
}
