import React from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import EStyleSheet from "react-native-extended-stylesheet";
import shallowEqual from "shallowequal";

import { ListStyles } from "../../base/styles/listStyles";
import ChatBaseList from "./ChatBaseList";

export default class ChatList extends ChatBaseList {
  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowEqual(this.props, nextProps)) {
      return true;
    }
    if (!shallowEqual(this.state, nextState)) {
      return true;
    }
    return false;
  }

  // componentDidUpdate(){
  //   let SEARCHBAR_HEIGHT = EStyleSheet.value(styles.searchbarHeight);
  //   this.chatListRef.scrollToOffset({animated: true, offset: SEARCHBAR_HEIGHT})
  //
  // }

  _getItemLayout = (data, index) => {
    let ITEM_HEIGHT = EStyleSheet.value(styles.itemHeight);
    let SEARCHBAR_HEIGHT = EStyleSheet.value(styles.searchbarHeight);
    if (index === 0) {
      return { length: ITEM_HEIGHT + SEARCHBAR_HEIGHT, offset: 0, index };
    }
    if (index === 1) {
      return {
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT + SEARCHBAR_HEIGHT,
        index
      };
    }
    return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
  };

  renderItem(item, index) {
    // console.log("renderItem: " + index);
    return (
      <View>
        {index === 0 ? this.renderSearchbar() : null}
        {this.renderListItem(item, index)}
      </View>
    );
  }

  renderLoadMore() {
    return (
      <TouchableOpacity style={{ alignItems: "center" }}>
        <Text>test</Text>
      </TouchableOpacity>
    );
  }

  _onScroll = e => {
    if (this.props.onScroll) {
      this.props.onScroll(e);
    } else {
      const offsetY = e.nativeEvent.contentOffset.y;
      const contentHeight = e.nativeEvent.contentSize.height;
      const layoutHeight = e.nativeEvent.layoutMeasurement.height;

      if (
        contentHeight - offsetY <= layoutHeight &&
        layoutHeight < contentHeight
      ) {
        this.props.addLimit(contentHeight);
      }
    }
  };

  render() {
    console.log("render ChatList");
    const { cItems, cTopedIds } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          ref={ref => (this.chatListRef = ref)}
          data={cItems}
          extraData={cTopedIds}
          renderItem={({ item, index }) => this.renderItem(item, index)}
          keyExtractor={item => item.id}
          onScroll={this._onScroll}
          scrollEventThrottle={160}
          windowSize={10}
          initialNumToRender={40}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={10}
          onEndReached={false}
          getItemLayout={this._getItemLayout}
        />
      </View>
    );
  }

  // getInnerComponentProps() {
  //   const { cItems, cTopedIds, ...props } = this.props;
  //   return {
  //     ...props
  //   };
  // }
}

ChatList.defaultProps = {};

ChatList.propTypes = {
  ...ChatBaseList.propTypes,
  cItems: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onScroll: PropTypes.func
};

const styles = EStyleSheet.create({
  ...ListStyles
});
