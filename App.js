import React from "react";
import { View, Text } from "react-native";

import RNChatApp from "./src/src";
import { Screen } from "./src/main/main";
// import { LoginView } from "./src/defaultLoginModule/LoginView";

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

const authProvider = (type, params) => {
  // if (type === AUTH_LOGIN) {
  //     const { username, password } = params;
  //     const request = new Request('https://mydomain.com/authenticate', {
  //         method: 'POST',
  //         body: JSON.stringify({ username, password }),
  //         headers: new Headers({ 'Content-Type': 'application/json' }),
  //     })
  //     return fetch(request)
  //         .then(response => {
  //             if (response.status < 200 || response.status >= 300) {
  //                 throw new Error(response.statusText);
  //             }
  //             return response.json();
  //         })
  //         .then(({ token }) => {
  //             localStorage.setItem('token', token);
  //         });
  // }
  return Promise.resolve("ok");
};

export default class App extends React.Component {
  render() {
    const modules = {
      Home: HomeScreen,
      Setting: SettingsScreen
    };

    return (
      <RNChatApp
        // loginPage={LoginView}
        authProvider={authProvider}
        modules={modules}
      />
    );
  }
}
