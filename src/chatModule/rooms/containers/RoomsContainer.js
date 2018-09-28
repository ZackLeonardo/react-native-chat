import React, { Component } from "react";
import { View, Dimensions } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import EStyleSheet from "react-native-extended-stylesheet";

import * as roomsActions from "../../../redux/actions/chatListActions";
import Rooms from "../components/Rooms";

class RoomsContainer extends Component {
  render() {
    const chatListProps = {
      hasSearchBar: true,
      ...this.props
    };
    return (
      <View style={styles.container}>
        <Rooms {...chatListProps} />
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
    cItems: state.rooms.rooms
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(roomsActions, dispatch)
});

const ConnectApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomsContainer);

export default ConnectApp;
