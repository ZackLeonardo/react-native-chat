import React, { Component } from "react";
import { Linking } from "react-native";
import { createStackNavigator } from "react-navigation";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

import OnboardingView from "./views/OnboardingView";
import RoomsListView from "./views/RoomsListView";
import NewServerView from "./views/NewServerView";
import LoginSignupView from "./views/LoginSignupView";
import Sidebar from "./containers/Sidebar";

import { store } from "../src";
import { appInit } from "./actions";
import { deepLinkingOpen } from "./actions/deepLinking";
import parseQuery from "./lib/methods/helpers/parseQuery";
import { connect } from "react-redux";

const handleOpenURL = ({ url }) => {
  if (url) {
    url = url.replace(/rocketchat:\/\/|https:\/\/go.rocket.chat\//, "");
    const regex = /^(room|auth)\?/;
    if (url.match(regex)) {
      url = url.replace(regex, "");
      const params = parseQuery(url);
      store.dispatch(deepLinkingOpen(params));
    }
  }
};

class ChatInit extends Component {
  constructor(props) {
    super(props);

    store.dispatch(appInit());
    Linking.getInitialURL()
      .then(url => handleOpenURL({ url }))
      .catch(e => console.warn(e));
    Linking.addEventListener("url", handleOpenURL);
  }

  render() {
    if (this.props.root === "inside") {
      return this.props.navigation.navigate("RoomsListView");
    } else {
      return <OnboardingView {...this.props} />;
    }
  }
}

const mapStateToProps = state => {
  return {
    root: state.app.root
  };
};

const ChatInitView = connect(mapStateToProps)(ChatInit);

export const ChatStackNavigator = createStackNavigator(
  {
    OnboardingView: {
      screen: ChatInitView
    },
    RoomsListView: {
      screen: gestureHandlerRootHOC(RoomsListView)
    },
    Sidebar: {
      screen: Sidebar
    },
    NewServerView: {
      screen: NewServerView
    },
    LoginSignupView: {
      screen: LoginSignupView
    }
  },
  {
    initialRouteName: "OnboardingView",
    headerMode: "none",
    mode: "modal"
  }
);

// import { Navigation } from "react-native-navigation";
// import { Provider } from "react-redux";
// import { gestureHandlerRootHOC } from "react-native-gesture-handler";

// import CreateChannelView from './CreateChannelView';
// import ForgotPasswordView from './ForgotPasswordView';
// import LoginView from './LoginView';
// import MentionedMessagesView from './MentionedMessagesView';
// import NewMessageView from './NewMessageView';
// import OAuthView from './OAuthView';
// import OnboardingView from "./OnboardingView";
// import PinnedMessagesView from './PinnedMessagesView';
// import PrivacyPolicyView from './PrivacyPolicyView';
// import ProfileView from './ProfileView';
// import RegisterView from './RegisterView';
// import RoomActionsView from './RoomActionsView';
// import RoomFilesView from './RoomFilesView';
// import RoomInfoEditView from './RoomInfoEditView';
// import RoomInfoView from './RoomInfoView';
// import RoomMembersView from './RoomMembersView';
// import RoomsListHeaderView from './RoomsListView/Header';
// import RoomsListSearchView from './RoomsListView/Search';
// import RoomsListView from "./RoomsListView";
// import RoomView from './RoomView';
// import SearchMessagesView from './SearchMessagesView';
// import SelectedUsersView from './SelectedUsersView';
// import SettingsView from './SettingsView';
// import Sidebar from "../containers/Sidebar";
// import SnippetedMessagesView from './SnippetedMessagesView';
// import StarredMessagesView from './StarredMessagesView';
// import TermsServiceView from './TermsServiceView';

// export const registerScreens = store => {
// Navigation.registerComponent('CreateChannelView', () => CreateChannelView, store, Provider);
// Navigation.registerComponent('ForgotPasswordView', () => ForgotPasswordView, store, Provider);

// Navigation.registerComponent('LoginView', () => LoginView, store, Provider);
// Navigation.registerComponent('MentionedMessagesView', () => gestureHandlerRootHOC(MentionedMessagesView), store, Provider);
// Navigation.registerComponent('NewMessageView', () => NewMessageView, store, Provider);

// Navigation.registerComponent('OAuthView', () => OAuthView, store, Provider);
// Navigation.registerComponent(
//   "OnboardingView",
//   () => OnboardingView,
//   store,
//   Provider
// );
// Navigation.registerComponent('PinnedMessagesView', () => gestureHandlerRootHOC(PinnedMessagesView), store, Provider);
// Navigation.registerComponent('PrivacyPolicyView', () => PrivacyPolicyView, store, Provider);
// Navigation.registerComponent('ProfileView', () => ProfileView, store, Provider);
// Navigation.registerComponent('RegisterView', () => RegisterView, store, Provider);
// Navigation.registerComponent('RoomActionsView', () => RoomActionsView, store, Provider);
// Navigation.registerComponent('RoomFilesView', () => gestureHandlerRootHOC(RoomFilesView), store, Provider);
// Navigation.registerComponent('RoomInfoEditView', () => RoomInfoEditView, store, Provider);
// Navigation.registerComponent('RoomInfoView', () => RoomInfoView, store, Provider);
// Navigation.registerComponent('RoomMembersView', () => RoomMembersView, store, Provider);
// Navigation.registerComponent('RoomsListHeaderView', () => RoomsListHeaderView, store, Provider);
// Navigation.registerComponent('RoomsListSearchView', () => RoomsListSearchView, store, Provider);
// Navigation.registerComponent(
//   "RoomsListView",
//   () => gestureHandlerRootHOC(RoomsListView),
//   store,
//   Provider
// );
// Navigation.registerComponent('RoomView', () => gestureHandlerRootHOC(RoomView), store, Provider);
// Navigation.registerComponent('SearchMessagesView', () => gestureHandlerRootHOC(SearchMessagesView), store, Provider);
// Navigation.registerComponent('SelectedUsersView', () => SelectedUsersView, store, Provider);
// Navigation.registerComponent('SettingsView', () => SettingsView, store, Provider);
// Navigation.registerComponent("Sidebar", () => Sidebar, store, Provider);
// Navigation.registerComponent('SnippetedMessagesView', () => gestureHandlerRootHOC(SnippetedMessagesView), store, Provider);
// Navigation.registerComponent('StarredMessagesView', () => gestureHandlerRootHOC(StarredMessagesView), store, Provider);
// Navigation.registerComponent('TermsServiceView', () => TermsServiceView, store, Provider);
// };
