import React, { Component } from "react";
import { Linking, View, ScrollView } from "react-native";
import {
  createStackNavigator,
  StackViewTransitionConfigs,
  createDrawerNavigator,
  DrawerItems,
  SafeAreaView
} from "react-navigation";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

import OnboardingView from "./views/OnboardingView";
import RoomsListView from "./views/RoomsListView";
import NewServerView from "./views/NewServerView";
import LoginSignupView from "./views/LoginSignupView";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import ForgotPasswordView from "./views/ForgotPasswordView";
import TermsServiceView from "./views/TermsServiceView";
import PrivacyPolicyView from "./views/PrivacyPolicyView";
import NewMessageView from "./views/NewMessageView";
import SettingsView from "./views/SettingsView";
import RoomView from "./views/RoomView";
import Sidebar from "./containers/Sidebar";

import { store } from "../src";
import { appInit } from "./actions";
import { deepLinkingOpen } from "./actions/deepLinking";
import parseQuery from "./lib/methods/helpers/parseQuery";
import { connect } from "react-redux";
import { compose, hoistStatics } from "recompose";
import { translate } from "../main/ran-i18n";
// import { iconsLoaded } from "./Icons";

// iconsLoaded();

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
      return this.props.navigation.navigate("RoomsListView", {});
    } else {
      return <OnboardingView {...this.props} />;
    }
  }
}

const ChatInitView = hoistStatics(
  compose(
    connect(state => ({
      root: state.app.root
    })),
    translate
  )
)(ChatInit);

const IOS_MODAL_ROUTES = ["OnboardingView", "NewServerView"];

let dynamicModalTransition = (transitionProps, prevTransitionProps) => {
  const isModal = IOS_MODAL_ROUTES.some(
    screenName =>
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps &&
        screenName === prevTransitionProps.scene.route.routeName)
  );
  return StackViewTransitionConfigs.defaultTransitionConfig(
    transitionProps,
    prevTransitionProps,
    isModal
  );
};

const NewMessageViewStack = createStackNavigator(
  {
    RoomsListView: {
      screen: gestureHandlerRootHOC(RoomsListView),
      navigationOptions: {
        // headerBackTitle: "Cancel"
      }
    },
    NewMessageView: {
      screen: NewMessageView
    }
  },
  {
    mode: "modal"
    // headerMode: "none"
  }
);

const StackNavigator = createStackNavigator(
  {
    OnboardingView: {
      screen: ChatInitView,
      navigationOptions: {
        header: null
      }
    },
    RoomsListView: {
      screen: NewMessageViewStack,
      navigationOptions: {
        header: null
      }
    },
    Sidebar: {
      screen: Sidebar
    },
    NewServerView: {
      screen: NewServerView,
      navigationOptions: {
        header: null
      }
    },
    LoginSignupView: {
      screen: LoginSignupView
    },
    LoginView: {
      screen: LoginView
    },
    RegisterView: {
      screen: RegisterView
    },
    ForgotPasswordView: {
      screen: ForgotPasswordView
    },
    TermsServiceView: {
      screen: TermsServiceView
    },
    PrivacyPolicyView: {
      screen: PrivacyPolicyView
    },
    SettingsView: {
      screen: SettingsView
    },
    RoomView: {
      screen: () => gestureHandlerRootHOC(RoomView)
    }
  },
  {
    initialRouteName: "OnboardingView",
    transitionConfig: dynamicModalTransition
  }
);

const CustomDrawerContent = props => (
  <ScrollView>
    <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
      <DrawerItems
        {...props}
        onItemPress={navigation => {
          if (navigation.route.key === "StackNavigator") {
            props.navigation.navigate("RoomsListView");
          } else {
            props.navigation.navigate(navigation.route.key);
          }
        }}
      />
    </SafeAreaView>
  </ScrollView>
);

export const ChatModuleNavigator = createDrawerNavigator(
  {
    StackNavigator: StackNavigator,
    SettingsView: {
      screen: SettingsView
    }
  },
  {
    drawerPosition: "left",
    drawerType: "slide",
    contentComponent: CustomDrawerContent
  }
);

// import { Navigation } from "react-native-navigation";
// import { Provider } from "react-redux";
// import { gestureHandlerRootHOC } from "react-native-gesture-handler";

// import CreateChannelView from './CreateChannelView';
// import MentionedMessagesView from './MentionedMessagesView';
// import OAuthView from './OAuthView';
// import OnboardingView from "./OnboardingView";
// import PinnedMessagesView from './PinnedMessagesView';
// import ProfileView from './ProfileView';
// import RoomActionsView from './RoomActionsView';
// import RoomFilesView from './RoomFilesView';
// import RoomInfoEditView from './RoomInfoEditView';
// import RoomInfoView from './RoomInfoView';
// import RoomMembersView from './RoomMembersView';
// import RoomsListHeaderView from './RoomsListView/Header';
// import RoomsListSearchView from './RoomsListView/Search';
// import RoomsListView from "./RoomsListView";
// import SearchMessagesView from './SearchMessagesView';
// import SelectedUsersView from './SelectedUsersView';
// import Sidebar from "../containers/Sidebar";
// import SnippetedMessagesView from './SnippetedMessagesView';
// import StarredMessagesView from './StarredMessagesView';

// export const registerScreens = store => {
// Navigation.registerComponent('CreateChannelView', () => CreateChannelView, store, Provider);
// Navigation.registerComponent('ForgotPasswordView', () => ForgotPasswordView, store, Provider);

// Navigation.registerComponent('MentionedMessagesView', () => gestureHandlerRootHOC(MentionedMessagesView), store, Provider);

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

// Navigation.registerComponent('SearchMessagesView', () => gestureHandlerRootHOC(SearchMessagesView), store, Provider);
// Navigation.registerComponent('SelectedUsersView', () => SelectedUsersView, store, Provider);
// Navigation.registerComponent('SettingsView', () => SettingsView, store, Provider);
// Navigation.registerComponent("Sidebar", () => Sidebar, store, Provider);
// Navigation.registerComponent('SnippetedMessagesView', () => gestureHandlerRootHOC(SnippetedMessagesView), store, Provider);
// Navigation.registerComponent('StarredMessagesView', () => gestureHandlerRootHOC(StarredMessagesView), store, Provider);
// Navigation.registerComponent('TermsServiceView', () => TermsServiceView, store, Provider);
// };
