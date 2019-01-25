import React from "react";
import PropTypes from "prop-types";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { connect } from "react-redux";
import PubSub from "pubsub-js";
import moment from "moment";
import Icon from "@expo/vector-icons/Ionicons";

import LoggedView from "../View";
import Status from "../../containers/status";
import Avatar from "../../containers/Avatar";
import styles from "./styles";
import sharedStyles from "../Styles";
import database from "../../../main/ran-db/sqlite";
import RocketChat from "../../lib/rocketchat";

import log from "../../utils/log";
import RoomTypeIcon from "../../containers/RoomTypeIcon";
import { iconsMap } from "../../Icons";

const PERMISSION_EDIT_ROOM = "edit-room";

const camelize = str => str.replace(/^(.)/, (match, chr) => chr.toUpperCase());
const getRoomTitle = room =>
  room.t === "d" ? (
    <Text testID="room-info-view-name" style={styles.roomTitle}>
      {room.fname}
    </Text>
  ) : (
    [
      <View style={styles.roomTitleRow}>
        <RoomTypeIcon type={room.t} key="room-info-type" />
        <Text
          testID="room-info-view-name"
          style={styles.roomTitle}
          key="room-info-name"
        >
          {room.name}
        </Text>
      </View>
    ]
  );

@connect(state => ({
  baseUrl: state.settings.Site_Url || state.server ? state.server.server : "",
  userId: state.login.user && state.login.user.id,
  activeUsers: state.activeUsers,
  Message_TimeFormat: state.settings.Message_TimeFormat,
  roles: state.roles
}))
/** @extends React.Component */
export default class RoomInfoView extends LoggedView {
  static propTypes = {
    navigator: PropTypes.object,
    rid: PropTypes.string,
    userId: PropTypes.string,
    baseUrl: PropTypes.string,
    activeUsers: PropTypes.object,
    Message_TimeFormat: PropTypes.string,
    roles: PropTypes.object
  };

  constructor(props) {
    super("RoomInfoView", props);
    this.roomsToken = null;
    this.state = {
      room: {},
      roomUser: {},
      roles: []
    };
  }

  static navigationOptions = props => {
    const { screenProps } = props;
    return {
      title: screenProps.translate("ran.chat.Details"),
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

  async componentDidMount() {
    await this.updateRoom();
    if (!this.roomsToken) {
      this.roomsToken = PubSub.subscribe("subscriptions", this.updateRoom);
    }

    // get user of room
    if (this.state.room) {
      if (this.state.room.t === "d") {
        try {
          const roomUser = await RocketChat.getRoomMember(
            this.state.room.rid,
            this.props.userId
          );
          this.setState({ roomUser });
          const username = this.state.room.name;

          const activeUser = this.props.activeUsers[roomUser._id];
          if (!activeUser || !activeUser.utcOffset) {
            // get full user data looking for utcOffset
            // will be catched by .on('users) and saved on activeUsers reducer
            this.getFullUserData(username);
          }

          // get all users roles
          // needs to be changed by a better method
          const allUsersRoles = await RocketChat.getUserRoles();
          const userRoles = allUsersRoles.find(
            user => user.username === username
          );
          if (userRoles) {
            this.setState({ roles: userRoles.roles || [] });
          }
        } catch (e) {
          log("RoomInfoView.componentDidMount", e);
        }
      } else {
        const permissions = RocketChat.hasPermission(
          [PERMISSION_EDIT_ROOM],
          this.state.room.rid
        );
        if (permissions[PERMISSION_EDIT_ROOM]) {
          this.props.navigator.setButtons({
            rightButtons: [
              {
                id: "edit",
                icon: iconsMap.create,
                testID: "room-info-view-edit-button"
              }
            ]
          });
        }
      }
    }
  }

  removeListener = token => {
    if (token) {
      PubSub.unsubscribe(token);
    }
  };

  componentWillUnmount() {
    this.removeListener(this.roomsToken);
  }

  onNavigatorEvent(event) {
    if (event.type === "NavBarButtonPress") {
      if (event.id === "edit") {
        this.props.navigator.push({
          screen: "RoomInfoEditView",
          title: this.props.screenProps.translate("ran.chat.Room_Info_Edit"),
          backButtonTitle: "",
          passProps: {
            rid: this.props.rid
          }
        });
      }
    }
  }

  getFullUserData = async username => {
    try {
      const result = await RocketChat.subscribe("fullUserData", username);
      this.sub = result;
    } catch (e) {
      log("getFullUserData", e);
    }
  };

  isDirect = () => this.state.room.t === "d";

  updateRoom = async () => {
    const { rid } = this.props.navigation.state.params;
    this.rooms = await database.objects(
      "subscriptions",
      `WHERE rid = "${rid}"`
    );
    const [room] = this.rooms;
    this.setState({ room });
  };

  renderItem = (key, room) => (
    <View style={styles.item}>
      <Text style={styles.itemLabel}>
        {this.props.screenProps.translate(`ran.chat.${camelize(key)}`)}
      </Text>
      <Text
        style={[styles.itemContent, !room[key] && styles.itemContent__empty]}
        testID={`room-info-view-${key}`}
      >
        {room[key]
          ? room[key]
          : this.props.screenProps.translate(`ran.chat.No_${key}_provided`)}
      </Text>
    </View>
  );

  renderRoles = () =>
    this.state.roles.length > 0 ? (
      <View style={styles.item}>
        <Text style={styles.itemLabel}>
          {this.props.screenProps.translate("ran.chat.Roles")}
        </Text>
        <View style={styles.rolesContainer}>
          {this.state.roles.map(role => (
            <View style={styles.roleBadge} key={role}>
              <Text>{this.props.roles[role]}</Text>
            </View>
          ))}
        </View>
      </View>
    ) : null;

  renderTimezone = userId => {
    if (this.props.activeUsers[userId]) {
      const { utcOffset } = this.props.activeUsers[userId];

      if (!utcOffset) {
        return null;
      }
      return (
        <View style={styles.item}>
          <Text style={styles.itemLabel}>
            {this.props.screenProps.translate("ran.chat.Timezone")}
          </Text>
          <Text style={styles.itemContent}>
            {moment()
              .utcOffset(utcOffset)
              .format(this.props.Message_TimeFormat)}{" "}
            (UTC {utcOffset})
          </Text>
        </View>
      );
    }
    return null;
  };

  renderAvatar = (room, roomUser) => (
    <Avatar
      text={room.name}
      size={100}
      style={styles.avatar}
      type={room.t}
      baseUrl={this.props.baseUrl}
    >
      {room.t === "d" ? (
        <Status
          style={[sharedStyles.status, styles.status]}
          id={roomUser._id}
        />
      ) : null}
    </Avatar>
  );

  renderBroadcast = () => (
    <View style={styles.item}>
      <Text style={styles.itemLabel}>
        {this.props.screenProps.translate("ran.chat.Broadcast_Channel")}
      </Text>
      <Text style={styles.itemContent} testID="room-info-view-broadcast">
        {this.props.screenProps.translate(
          "ran.chat.Broadcast_channel_Description"
        )}
      </Text>
    </View>
  );

  render() {
    const { room, roomUser } = this.state;
    if (!room) {
      return <View />;
    }
    return (
      <ScrollView style={styles.scroll}>
        <SafeAreaView style={styles.container} testID="room-info-view">
          <View style={styles.avatarContainer}>
            {this.renderAvatar(room, roomUser)}
            <View style={styles.roomTitleContainer}>{getRoomTitle(room)}</View>
          </View>
          {!this.isDirect() ? this.renderItem("description", room) : null}
          {!this.isDirect() ? this.renderItem("topic", room) : null}
          {!this.isDirect() ? this.renderItem("announcement", room) : null}
          {this.isDirect() ? this.renderRoles() : null}
          {this.isDirect() ? this.renderTimezone(roomUser._id) : null}
          {room.broadcast ? this.renderBroadcast() : null}
        </SafeAreaView>
      </ScrollView>
    );
  }
}
