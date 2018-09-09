import React, { Component } from "react";
import { View, Dimensions } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import EStyleSheet from "react-native-extended-stylesheet";

import * as ChatActions from "../../../redux/actions/chatListActions";
import ChatList from "../components/ChatList";

class ChatListContainer extends Component {
  render() {
    const chatListProps = {
      hasSearchBar: true,
      ...this.props
    };
    return (
      <View style={styles.container}>
        <ChatList {...chatListProps} />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  }
});

const mapStateToProps = state => {
  return {
    cItems: state.chatList.cItems
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ChatActions, dispatch)
});

const ConnectApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatListContainer);

export default ConnectApp;
