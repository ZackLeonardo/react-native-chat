import React, { Component } from "react";

import ScrollableTabScreen from "../../base/components/scrollableTabScreen/ScrollableTabScreen";
import RoomsContainer from "./containers/RoomsContainer";

export default class RoomsView extends Component {
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
    console.log("render RoomsView");
    const chatListViewProps = this.getInnerComponentProps();
    return (
      <ScrollableTabScreen tabLabels={this.state.tabLabels}>
        <RoomsContainer
          key="RoomsView"
          setTabLabel={this.setTabLabel}
          {...chatListViewProps}
        />
      </ScrollableTabScreen>
    );
  }
}
