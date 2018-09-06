import React, { Component } from "react";
import { Text, View } from "react-native";

import Meteor, { createContainer } from "react-native-meteor";
import _ from "underscore";
import shallowEqual from "shallowequal";
import { store } from "../../main/App";

import ChatList from "../components/ChatList";

const cInitLimit = 20;

class ChatListContainer extends Component {
  constructor(props) {
    super(props);

    this._contentHeight = null;
    this._emptyData = [
      {
        id: "0",
        avatar: "https://img3.doubanio.com/img/fmadmin/large/31905.jpg",
        mainTitle: "并没有"
      }
    ];

    this.state = {
      cItems: _.first(this._prepareDataSource(props), cInitLimit),
      cSearchItems: _.first(props.cSearchItems, cInitLimit),
      cLimit: cInitLimit
    };

    this.addLimit = this.addLimit.bind(this);

    this.dispatchMessages(props.mItems);
    this.dispatchUpdateTimestamp(props.mLatestItems);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowEqual(this.state, nextState)) {
      return true;
    }
    if (!shallowEqual(this.props, nextProps)) {
      let preCLimit = this.state.cLimit;
      this.setState({
        cItems: _.first(this._prepareDataSource(nextProps), preCLimit),
        cSearchItems: _.first(nextProps.cSearchItems, preCLimit)
      });
      if (!shallowEqual(this.props.mItems, nextProps.mItems)) {
        this.dispatchMessages(this.props.mItems, nextProps.mItems);
        this.dispatchUpdateTimestamp(nextProps.mLatestItems);
      }
      return true;
    }
    return false;
  }

  // 先比较新旧items的变化，讲新增部分dispathc（不能处理撤回）
  async dispatchMessages(mItemsOld, mItemsNew = null) {
    console.log("dispatchMessages");
    var roomIdMessagesMap = new Map();
    if (mItemsOld && mItemsOld.length > 0) {
      if (mItemsNew && mItemsNew.length > 0) {
        let addedMItems = _.difference(mItemsNew, mItemsOld);
        addedMItems.forEach(item => {
          console.log("mItemsNew:" + JSON.stringify(item));
          if (roomIdMessagesMap.has(item.roomId)) {
            roomIdMessagesMap.get(item.roomId).push(item);
          } else {
            roomIdMessagesMap.set(item.roomId, [item]);
          }
        });
      } else {
        mItemsOld.forEach(item => {
          console.log("mItemsOld:" + JSON.stringify(item));
          if (roomIdMessagesMap.has(item.roomId)) {
            roomIdMessagesMap.get(item.roomId).push(item);
          } else {
            roomIdMessagesMap.set(item.roomId, [item]);
          }
        });
      }
    } else {
      if (mItemsNew && mItemsNew.length > 0) {
        mItemsNew.forEach(item => {
          console.log("mItemsOld:" + JSON.stringify(item));
          if (roomIdMessagesMap.has(item.roomId)) {
            roomIdMessagesMap.get(item.roomId).push(item);
          } else {
            roomIdMessagesMap.set(item.roomId, [item]);
          }
        });
      }
    }
    // console.log(roomIdMessagesMap);
    roomIdMessagesMap.forEach((value, key) => {
      if (value && value.length > 0) {
        store.dispatch({
          type: "ADD_MLIST",
          roomId: key,
          mPriItems: value
        });
      }
    });
  }

  // 更新item的最新时间
  async dispatchUpdateTimestamp(mItem) {
    if (mItem) {
      store.dispatch({
        type: "SET_SUBMTIMESTAMPASYNC",
        subMTimestamp: mItem.createdAt
      });
    }
  }

  addLimit(contentHeight = null) {
    let cLimit = this.state.cLimit;
    if (
      this._contentHeight != contentHeight &&
      cLimit < this.props.cItems.length
    ) {
      console.log("addLimit");
      let newCLimit = cLimit + cInitLimit;
      if (newCLimit > this.props.cItems.length) {
        newCLimit = this.props.cItems.length;
      }
      this.setState({
        cItems: _.first(this._prepareDataSource(this.props), newCLimit),
        cSearchItems: _.first(this.props.cSearchItems, newCLimit), // undone
        cLimit: newCLimit
      });
      this._contentHeight = contentHeight;
    }
  }

  _alreadyToped(cTopedIds, id) {
    return cTopedIds ? cTopedIds.indexOf(id) >= 0 : false;
  }

  // _arrayDataSource(list){
  //   let dataList = UTILFUNS.isJson(list) ? UTILFUNS.json2Array(list) : list;
  //   return dataList ? dataList : [];
  // }

  _createDataSource(list) {
    return list.length < 1 ? this._emptyData : list; //!list ||
  }

  _sortDataSource(cTopedIds, list) {
    compare = (a, b) => {
      if (this._alreadyToped(cTopedIds, a.id)) {
        return -1;
      }
      if (this._alreadyToped(cTopedIds, b.id)) {
        return 1;
      }
      return 0;
    };

    list.sort(compare);
    return list;
  }

  _ingoreDeletedDataSource(cDeletedIds, list) {
    if (list) {
      return list.filter(item => {
        return cDeletedIds ? cDeletedIds.indexOf(item.id) < 0 : true;
      });
    }
    return [];
  }

  _prepareDataSource(props) {
    return this._createDataSource(
      this._sortDataSource(
        props.cTopedIds,
        this._ingoreDeletedDataSource(props.cDeletedIds, props.cItems)
      )
    );
  }

  render() {
    const innerProps = this.getInnerComponentProps();
    return (
      <ChatList
        cItems={this.state.cItems}
        cSearchItems={this.state.cSearchItems}
        addLimit={this.addLimit}
        {...innerProps}
      />
    );
    // if (this.props.loadingChatPri) {
    //   return (
    //     <View>
    //       <Text>loading</Text>
    //     </View>
    //   );
    // } else {
    //   return (
    //     <ChatList
    //       cItems={this.state.cItems}
    //       cSearchItems={this.state.cSearchItems}
    //       addLimit={this.addLimit}
    //       {...innerProps}
    //       />
    //   );
    // }
  }

  getInnerComponentProps() {
    const { cItems, cSearchItems, cDeletedIds, ...props } = this.props;
    return {
      ...props
    };
  }
}

export default createContainer(props => {
  if (Meteor.status().status === "connected") {
    const mItems = Meteor.collection("stream.messagePriFromRoomIds").find(
      {},
      { fields: { _version: 0 } },
      { sort: { createdAt: -1 } }
    );
    const mLatestItems = Meteor.collection(
      "stream.messagePriFromRoomIds"
    ).findOne({}, { fields: { _version: 0 } }, { sort: { createdAt: -1 } });
    console.log("mLatestItems:" + JSON.stringify(mLatestItems));
    return {
      mItems,
      mLatestItems
    };
  }
  return {};
  // return store;
}, ChatListContainer);
