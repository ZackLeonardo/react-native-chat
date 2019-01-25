import React from "react";
import PropTypes from "prop-types";
import { View, SectionList, Text, Alert, SafeAreaView } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { connect } from "react-redux";
import PubSub from "pubsub-js";

import LoggedView from "../View";
import styles from "./styles";
import sharedStyles from "../Styles";
import Avatar from "../../containers/Avatar";
import Status from "../../containers/status";
import Touch from "../../utils/touch";
import database from "../../../main/ran-db/sqlite";
import RocketChat from "../../lib/rocketchat";
import { leaveRoom } from "../../actions/room";
import log from "../../utils/log";
import RoomTypeIcon from "../../containers/RoomTypeIcon";
import scrollPersistTaps from "../../utils/scrollPersistTaps";

const renderSeparator = () => <View style={styles.separator} />;

@connect(
  state => ({
    userId: state.login.user && state.login.user.id,
    username: state.login.user && state.login.user.username,
    baseUrl: state.settings.Site_Url || state.server ? state.server.server : ""
  }),
  dispatch => ({
    leaveRoom: rid => dispatch(leaveRoom(rid))
  })
)
/** @extends React.Component */
export default class RoomActionsView extends LoggedView {
  static propTypes = {
    baseUrl: PropTypes.string,
    rid: PropTypes.string,
    navigator: PropTypes.object,
    userId: PropTypes.string,
    username: PropTypes.string,
    leaveRoom: PropTypes.func
  };

  constructor(props) {
    super("RoomActionsView", props);
    this.rooms = [];
    this.roomsToken = null;
    [this.room] = this.rooms;
    this.state = {
      room: this.room,
      onlineMembers: [],
      allMembers: [],
      member: {}
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

    const [members, member] = await Promise.all([
      this.updateRoomMembers(),
      this.updateRoomMember()
    ]);
    this.setState({ ...members, ...member });
  }

  removeListener = token => {
    if (token) {
      PubSub.unsubscribe(token);
    }
  };

  componentWillUnmount() {
    this.removeListener(this.roomsToken);
  }

  onPressTouchable = item => {
    if (item.route) {
      this.props.navigation.navigate(item.route, {
        title: item.name,
        ...item.params
      });
    }
    if (item.event) {
      return item.event();
    }
  };

  get canAddUser() {
    // Invite user
    const { rid, t } = this.room;
    const { allMembers } = this.state;
    // TODO: same test joined
    const userInRoom = !!allMembers.find(
      m => m.username === this.props.username
    );
    const permissions = RocketChat.hasPermission(
      [
        "add-user-to-joined-room",
        "add-user-to-any-c-room",
        "add-user-to-any-p-room"
      ],
      rid
    );

    if (userInRoom && permissions["add-user-to-joined-room"]) {
      return true;
    }
    if (t === "c" && permissions["add-user-to-any-c-room"]) {
      return true;
    }
    if (t === "p" && permissions["add-user-to-any-p-room"]) {
      return true;
    }
    return false;
  }
  get canViewMembers() {
    const { rid, t, broadcast } = this.state.room;
    if (broadcast) {
      const viewBroadcastMemberListPermission = "view-broadcast-member-list";
      const permissions = RocketChat.hasPermission(
        [viewBroadcastMemberListPermission],
        rid
      );
      if (!permissions[viewBroadcastMemberListPermission]) {
        return false;
      }
    }
    return t === "c" || t === "p";
  }
  get sections() {
    const { rid, t, blocker, notifications } = this.room;
    const { onlineMembers } = this.state;

    const sections = [
      {
        data: [
          {
            icon: "ios-star",
            name: this.props.screenProps.translate("ran.chat.Room_Info"),
            route: "RoomInfoView",
            params: { rid },
            testID: "room-actions-info"
          }
        ],
        renderItem: this.renderRoomInfo
      },
      {
        data: [
          {
            icon: "ios-call",
            name: this.props.screenProps.translate("ran.chat.Voice_call"),
            disabled: true,
            testID: "room-actions-voice"
          },
          {
            icon: "ios-videocam",
            name: this.props.screenProps.translate("ran.chat.Video_call"),
            disabled: true,
            testID: "room-actions-video"
          }
        ],
        renderItem: this.renderItem
      },
      {
        data: [
          {
            icon: "ios-attach",
            name: this.props.screenProps.translate("ran.chat.Files"),
            route: "RoomFilesView",
            params: { rid },
            testID: "room-actions-files"
          },
          {
            icon: "ios-at",
            name: this.props.screenProps.translate("ran.chat.Mentions"),
            route: "MentionedMessagesView",
            params: { rid },
            testID: "room-actions-mentioned"
          },
          {
            icon: "ios-star",
            name: this.props.screenProps.translate("ran.chat.Starred"),
            route: "StarredMessagesView",
            params: { rid },
            testID: "room-actions-starred"
          },
          {
            icon: "ios-search",
            name: this.props.screenProps.translate("ran.chat.Search"),
            route: "SearchMessagesView",
            params: { rid },
            testID: "room-actions-search"
          },
          {
            icon: "ios-share",
            name: this.props.screenProps.translate("ran.chat.Share"),
            disabled: true,
            testID: "room-actions-share"
          },
          {
            icon: "ios-pin",
            name: this.props.screenProps.translate("ran.chat.Pinned"),
            route: "PinnedMessagesView",
            params: { rid },
            testID: "room-actions-pinned"
          },
          {
            icon: "ios-code",
            name: this.props.screenProps.translate("ran.chat.Snippets"),
            route: "SnippetedMessagesView",
            params: { rid },
            testID: "room-actions-snippeted"
          },
          {
            icon: `ios-notifications${notifications ? "" : "-off"}`,
            name: this.props.screenProps.translate(
              `ran.chat.${notifications ? "Disable" : "Enable"}_notifications`
            ),
            event: () => this.toggleNotifications(),
            testID: "room-actions-notifications"
          }
        ],
        renderItem: this.renderItem
      }
    ];

    if (t === "d") {
      sections.push({
        data: [
          {
            icon: "block",
            name: this.props.screenProps.translate(
              `ran.chat.${blocker ? "Unblock" : "Block"}_user`
            ),
            type: "danger",
            event: () => this.toggleBlockUser(),
            testID: "room-actions-block-user"
          }
        ],
        renderItem: this.renderItem
      });
    } else if (t === "c" || t === "p") {
      const actions = [];

      if (this.canViewMembers) {
        actions.push({
          icon: "ios-people",
          name: this.props.screenProps.translate("ran.chat.Members"),
          description:
            onlineMembers.length === 1
              ? this.props.screenProps.translate("ran.chat.One_online_member")
              : onlineMembers.length +
                this.props.screenProps.translate("ran.chat.N_online_members"),
          route: "RoomMembersView",
          params: { rid, members: onlineMembers },
          testID: "room-actions-members"
        });
      }

      if (this.canAddUser) {
        actions.push({
          icon: "ios-person-add",
          name: this.props.screenProps.translate("ran.chat.Add_user"),
          route: "SelectedUsersView",
          params: {
            nextAction: "ADD_USER",
            rid
          },
          testID: "room-actions-add-user"
        });
      }
      sections[2].data = [...actions, ...sections[2].data];
      sections.push({
        data: [
          {
            icon: "block",
            name: this.props.screenProps.translate("ran.chat.Leave_channel"),
            type: "danger",
            event: () => this.leaveChannel(),
            testID: "room-actions-leave-channel"
          }
        ],
        renderItem: this.renderItem
      });
    }
    return sections;
  }

  updateRoomMembers = async () => {
    const { t } = this.state.room;

    if (!this.canViewMembers) {
      return {};
    }

    if (t === "c" || t === "p") {
      let onlineMembers = [];
      let allMembers = [];
      try {
        const onlineMembersCall = RocketChat.getRoomMembers(
          this.state.room.rid,
          false
        );
        const allMembersCall = RocketChat.getRoomMembers(
          this.state.room.rid,
          true
        );
        const [onlineMembersResult, allMembersResult] = await Promise.all([
          onlineMembersCall,
          allMembersCall
        ]);
        onlineMembers = onlineMembersResult.records;
        allMembers = allMembersResult.records;
        return { onlineMembers, allMembers };
      } catch (error) {
        return {};
      }
    }
  };

  updateRoomMember = async () => {
    if (this.state.room.t !== "d") {
      return {};
    }
    try {
      const member = await RocketChat.getRoomMember(
        this.state.room.rid,
        this.props.userId
      );
      return { member };
    } catch (e) {
      log("RoomActions updateRoomMember", e);
      return {};
    }
  };

  updateRoom = async () => {
    const { rid } = this.props.navigation.state.params;
    this.rooms = await database.objects(
      "subscriptions",
      `WHERE rid == "${rid}"`
    );
    [this.room] = this.rooms;
    this.setState({ room: this.room });
  };

  toggleBlockUser = async () => {
    const { rid, blocker } = this.state.room;
    const { member } = this.state;
    try {
      RocketChat.toggleBlockUser(rid, member._id, !blocker);
    } catch (e) {
      log("toggleBlockUser", e);
    }
  };

  leaveChannel = () => {
    const { room } = this.state;
    Alert.alert(
      this.props.screenProps.translate("ran.chat.Are_you_sure_question_mark"),
      this.props.screenProps.translate(
        "ran.chat.Are_you_sure_you_want_to_leave_the_room"
      ) + `${room.t === "d" ? room.fname : room.name}`,
      [
        {
          text: this.props.screenProps.translate("ran.chat.Cancel"),
          style: "cancel"
        },
        {
          text: this.props.screenProps.translate("ran.chat.Yes_action_leave"),
          style: "destructive",
          onPress: () => this.props.leaveRoom(room.rid)
        }
      ]
    );
  };

  toggleNotifications = () => {
    const { room } = this.state;
    try {
      RocketChat.saveNotificationSettings(
        room.rid,
        "mobilePushNotifications",
        room.notifications ? "nothing" : "default"
      );
    } catch (e) {
      log("toggleNotifications", e);
    }
  };

  renderRoomInfo = ({ item }) => {
    const { room, member } = this.state;
    const { name, t, topic } = room;
    return this.renderTouchableItem(
      [
        <Avatar
          key="avatar"
          text={name}
          size={50}
          style={styles.avatar}
          type={t}
          baseUrl={this.props.baseUrl}
        >
          {t === "d" ? (
            <Status style={sharedStyles.status} id={member._id} />
          ) : null}
        </Avatar>,
        <View key="name" style={styles.roomTitleContainer}>
          {room.t === "d" ? (
            <Text style={styles.roomTitle}>{room.fname}</Text>
          ) : (
            <View style={styles.roomTitleRow}>
              <RoomTypeIcon type={room.t} />
              <Text style={styles.roomTitle}>{room.name}</Text>
            </View>
          )}
          <Text
            style={styles.roomDescription}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {t === "d" ? `@${name}` : topic}
          </Text>
        </View>,
        <Icon
          key="icon"
          name="ios-arrow-forward"
          size={20}
          style={styles.sectionItemIcon}
          color="#ccc"
        />
      ],
      item
    );
  };

  renderTouchableItem = (subview, item) => (
    <Touch
      onPress={() => this.onPressTouchable(item)}
      underlayColor="#FFFFFF"
      activeOpacity={0.5}
      accessibilityLabel={item.name}
      accessibilityTraits="button"
      testID={item.testID}
    >
      <View
        style={[
          styles.sectionItem,
          item.disabled && styles.sectionItemDisabled
        ]}
      >
        {subview}
      </View>
    </Touch>
  );

  renderItem = ({ item }) => {
    const subview =
      item.type === "danger"
        ? [
            <MaterialIcon
              key="icon"
              name={item.icon}
              size={20}
              style={[styles.sectionItemIcon, styles.textColorDanger]}
            />,
            <Text
              key="name"
              style={[styles.sectionItemName, styles.textColorDanger]}
            >
              {item.name}
            </Text>
          ]
        : [
            <Icon
              key="left-icon"
              name={item.icon}
              size={24}
              style={styles.sectionItemIcon}
            />,
            <Text key="name" style={styles.sectionItemName}>
              {item.name}
            </Text>,
            item.description ? (
              <Text key="description" style={styles.sectionItemDescription}>
                {item.description}
              </Text>
            ) : null,
            <Icon
              key="right-icon"
              name="ios-arrow-forward"
              size={20}
              style={styles.sectionItemIcon}
              color="#ccc"
            />
          ];
    return this.renderTouchableItem(subview, item);
  };

  renderSectionSeparator = data => {
    if (data.trailingItem) {
      return (
        <View
          style={[
            styles.sectionSeparator,
            data.leadingSection && styles.sectionSeparatorBorder
          ]}
        />
      );
    }
    if (!data.trailingSection) {
      return <View style={styles.sectionSeparatorBorder} />;
    }
    return null;
  };

  render() {
    console.log("render RoomActionsView");

    return (
      <SafeAreaView style={styles.container} testID="room-actions-view">
        <SectionList
          style={styles.container}
          stickySectionHeadersEnabled={false}
          sections={this.room ? this.sections : []}
          extraData={this.state.room}
          SectionSeparatorComponent={this.renderSectionSeparator}
          ItemSeparatorComponent={renderSeparator}
          keyExtractor={item => item.name}
          testID="room-actions-list"
          {...scrollPersistTaps}
        />
      </SafeAreaView>
    );
  }
}
