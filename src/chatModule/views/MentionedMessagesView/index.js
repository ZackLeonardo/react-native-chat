import React from "react";
import PropTypes from "prop-types";
import { FlatList, View, Text, SafeAreaView } from "react-native";
import { connect } from "react-redux";
import Icon from "@expo/vector-icons/Ionicons";
import i18n from "i18n-js";

import LoggedView from "../View";
import {
  openMentionedMessages,
  closeMentionedMessages
} from "../../actions/mentionedMessages";
import styles from "./styles";
import Message from "../../containers/message";
import RCActivityIndicator from "../../containers/ActivityIndicator";

@connect(
  state => ({
    messages: state.mentionedMessages.messages,
    ready: state.mentionedMessages.ready,
    user: {
      id: state.login.user && state.login.user.id,
      username: state.login.user && state.login.user.username,
      token: state.login.user && state.login.user.token
    }
  }),
  dispatch => ({
    openMentionedMessages: (rid, limit) =>
      dispatch(openMentionedMessages(rid, limit)),
    closeMentionedMessages: () => dispatch(closeMentionedMessages())
  })
)
/** @extends React.Component */
export default class MentionedMessagesView extends LoggedView {
  static propTypes = {
    rid: PropTypes.string,
    messages: PropTypes.array,
    ready: PropTypes.bool,
    user: PropTypes.object,
    openMentionedMessages: PropTypes.func,
    closeMentionedMessages: PropTypes.func
  };

  constructor(props) {
    super("MentionedMessagesView", props);
    this.state = {
      loading: true,
      loadingMore: false
    };
  }

  static navigationOptions = props => {
    const { navigation } = props;
    return {
      title: navigation.getParam("title"),
      headerBackTitle: null,
      headerBackImage: (
        <Icon
          name="ios-arrow-back"
          style={{ marginHorizontal: 15 }}
          size={22}
          color="#4674F1"
        />
      )
    };
  };

  componentDidMount() {
    this.limit = 20;
    this.load();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ready && nextProps.ready !== this.props.ready) {
      this.setState({ loading: false, loadingMore: false });
    }
  }

  componentWillUnmount() {
    this.props.closeMentionedMessages();
  }

  load = () => {
    this.props.openMentionedMessages(
      this.props.navigation.state.params.rid,
      this.limit
    );
  };

  moreData = () => {
    const { loadingMore } = this.state;
    const { messages } = this.props;
    if (messages.length < this.limit) {
      return;
    }
    if (!loadingMore) {
      this.setState({ loadingMore: true });
      this.limit += 20;
      this.load();
    }
  };

  renderEmpty = () => (
    <View style={styles.listEmptyContainer} testID="mentioned-messages-view">
      <Text>{i18n.t("ran.chat.No_mentioned_messages")}</Text>
    </View>
  );

  renderItem = ({ item }) => (
    <Message
      item={item}
      style={styles.message}
      reactions={item.reactions}
      user={this.props.user}
      customTimeFormat="MMMM Do YYYY, h:mm:ss a"
    />
  );

  render() {
    const { loading, loadingMore } = this.state;
    const { messages, ready } = this.props;

    if (ready && messages.length === 0) {
      return this.renderEmpty();
    }

    return (
      <SafeAreaView style={styles.list} testID="mentioned-messages-view">
        <FlatList
          data={messages}
          renderItem={this.renderItem}
          style={styles.list}
          keyExtractor={item => item._id}
          onEndReached={this.moreData}
          ListHeaderComponent={loading ? <RCActivityIndicator /> : null}
          ListFooterComponent={loadingMore ? <RCActivityIndicator /> : null}
        />
      </SafeAreaView>
    );
  }
}
