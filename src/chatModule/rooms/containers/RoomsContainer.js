import React, { Component } from "react";
import { View, Dimensions } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import EStyleSheet from "react-native-extended-stylesheet";
import compose from "recompose/compose";

import { translate } from "../../../main/ran-i18n";
// import * as roomsActions from "../../redux/actions/roomsActions";
import Rooms from "../components/Rooms";

class RoomsContainer extends Component {
  render() {
    const { translate } = this.props;
    const chatListProps = {
      hasSearchBar: true,
      unTopI18n: translate("ran.chat.unTop"),
      topI18n: translate("ran.chat.top"),
      deleteI18n: translate("ran.chat.delete"),
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
  // actions: bindActionCreators(roomsActions, dispatch)
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  translate
)(RoomsContainer);
