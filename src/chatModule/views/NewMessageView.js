import React from "react";
import PropTypes from "prop-types";
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  Platform,
  Image
} from "react-native";
import { connect } from "react-redux";

import database from "../../main/ran-db/sqlite";
import RocketChat from "../lib/rocketchat";
import UserItem from "../presentation/UserItem";
import debounce from "../utils/debounce";
import LoggedView from "./View";
import sharedStyles from "./Styles";
// import I18n from '../i18n';
import Touch from "../utils/touch";
import SearchBox from "../containers/SearchBox";

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Platform.OS === "ios" ? "#F7F8FA" : "#E1E5E8"
  },
  separator: {
    marginLeft: 60
  },
  createChannelButton: {
    marginVertical: 25
  },
  createChannelContainer: {
    height: 47,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center"
  },
  createChannelIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 18
  },
  createChannelText: {
    color: "#1D74F5",
    fontSize: 18
  }
});

@connect(state => ({
  baseUrl: state.settings.Site_Url || state.server ? state.server.server : ""
}))
/** @extends React.Component */
export default class NewMessageView extends LoggedView {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title")
    };
  };

  static propTypes = {
    navigator: PropTypes.object,
    baseUrl: PropTypes.string
    // onPressItem: PropTypes.func.isRequired
  };

  constructor(props) {
    super("NewMessageView", props);
    this.data = null;
    this.state = {
      search: []
    };
    // this.data.addListener(this.updateState);
    // props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  async componentWillMount() {
    this.data = await database.objects(
      "subscriptions",
      `WHERE t="d" ORDER BY roomUpdatedAt ASC`
    );
  }

  componentWillUnmount() {
    this.updateState.stop();
    // this.data.removeAllListeners();
  }

  async onNavigatorEvent(event) {
    if (event.type === "NavBarButtonPress") {
      if (event.id === "cancel") {
        this.props.navigator.dismissModal();
      }
    }
  }

  onSearchChangeText(text) {
    this.search(text);
  }

  onPressItem = item => {
    this.props.navigation.goBack();
    setTimeout(() => {
      this.props.navigation.state.params.onPressItem(item);
    }, 600);
  };

  updateState = debounce(() => {
    this.forceUpdate();
  }, 1000);

  search = async text => {
    const result = await RocketChat.search({ text, filterRooms: false });
    this.setState({
      search: result
    });
  };

  createChannel = () => {
    this.props.navigator.push({
      screen: "SelectedUsersView",
      title: 'I18n.t("Select_Users")',
      backButtonTitle: "",
      passProps: {
        nextAction: "CREATE_CHANNEL"
      }
    });
  };

  renderHeader = () => (
    <View>
      <SearchBox
        onChangeText={text => this.onSearchChangeText(text)}
        testID="new-message-view-search"
      />
      <Touch
        onPress={this.createChannel}
        style={styles.createChannelButton}
        testID="new-message-view-create-channel"
      >
        <View
          style={[
            sharedStyles.separatorVertical,
            styles.createChannelContainer
          ]}
        >
          <Image
            style={styles.createChannelIcon}
            source={require("../Icons/plus.imageset/plus.png")}
          />
          <Text style={styles.createChannelText}>
            {this.props.screenProps.translate(
              "ran.newMessageView.Create_Channel"
            )}
          </Text>
        </View>
      </Touch>
    </View>
  );

  renderSeparator = () => (
    <View style={[sharedStyles.separator, styles.separator]} />
  );

  renderItem = ({ item, index }) => {
    let style = {};
    if (index === 0) {
      style = sharedStyles.separatorTop;
    }
    if (
      this.state.search.length > 0 &&
      index === this.state.search.length - 1
    ) {
      style = StyleSheet.flatten([style, sharedStyles.separatorBottom]);
    }
    if (this.state.search.length === 0 && index === this.data.length - 1) {
      style = StyleSheet.flatten([style, sharedStyles.separatorBottom]);
    }
    return (
      <UserItem
        name={item.search ? item.name : item.fname}
        username={item.search ? item.username : item.name}
        onPress={() => this.onPressItem(item)}
        baseUrl={this.props.baseUrl}
        testID={`new-message-view-item-${item.name}`}
        style={style}
      />
    );
  };

  renderList = () => (
    <FlatList
      data={this.state.search.length > 0 ? this.state.search : this.data}
      extraData={this.state}
      keyExtractor={item => item._id}
      ListHeaderComponent={this.renderHeader}
      renderItem={this.renderItem}
      ItemSeparatorComponent={this.renderSeparator}
      keyboardShouldPersistTaps="always"
    />
  );

  render = () => (
    <SafeAreaView style={styles.safeAreaView} testID="new-message-view">
      {this.renderList()}
    </SafeAreaView>
  );
}
