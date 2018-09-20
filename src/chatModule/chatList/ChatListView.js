import React, { Component } from "react";

import ScrollableTabScreen from "../../base/components/scrollableTabScreen/ScrollableTabScreen";
import ChatListContainer from "./containers/ChatListContainer";

export default class ChatListView extends Component {
  state = {
    tabLabels: ["聊天"]
  };

  setTabLabel = (idx, label) => {
    let tabLabels = this.state.tabLabels;
    if (tabLabels[idx] !== label) {
      tabLabels[idx] = label;
      this.setState({
        tabLabels: tabLabels
      });
    }
  };

  getInnerComponentProps() {
    const { ...props } = this.props;
    return {
      ...props
    };
  }

  render() {
    console.log("render ChatListView");
    const chatListViewProps = this.getInnerComponentProps();
    return (
      <ScrollableTabScreen tabLabels={this.state.tabLabels}>
        <ChatListContainer
          key="chatListView"
          setTabLabel={this.setTabLabel}
          {...chatListViewProps}
        />
      </ScrollableTabScreen>
    );
  }
}
