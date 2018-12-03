// import { ListView as OldList } from "realm/react-native";
import React from "react";
import {
  ScrollView,
  ListView as OldList2,
  ImageBackground,
  FlatList
} from "react-native";
import moment from "moment";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import shallowequal from "shallowequal";

import Separator from "./Separator";
import styles from "./styles";
import Typing from "../../containers/Typing";
import database from "../../../main/ran-db/sqlite";
import scrollPersistTaps from "../../utils/scrollPersistTaps";
import throttle from "../../utils/throttle";

const DEFAULT_SCROLL_CALLBACK_THROTTLE = 100;

// export class DataSource extends OldList.DataSource {
//   getRowData(sectionIndex: number, rowIndex: number): any {
//     const sectionID = this.sectionIdentities[sectionIndex];
//     const rowID = this.rowIdentities[sectionIndex][rowIndex];
//     return this._getRowData(this._dataBlob, sectionID, rowID);
//   }
//   _calculateDirtyArrays() {
//     // eslint-disable-line
//     return false;
//   }
// }

// const ds = new DataSource({
//   rowHasChanged: (r1, r2) =>
//     r1._id !== r2._id ||
//     r1._updatedAt.toISOString() !== r2._updatedAt.toISOString()
// });

export class List extends React.Component {
  static propTypes = {
    onEndReached: PropTypes.func,
    renderFooter: PropTypes.func,
    renderRow: PropTypes.func,
    room: PropTypes.string,
    end: PropTypes.bool
  };
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
    // this.dataSource = ds.cloneWithRows(this.data);
  }
  async componentDidMount() {
    let data = await database.objects(
      "messages",
      `WHERE rid="${this.props.room}" ORDER BY ts ASC`
    );

    this.setState({
      data: data
    });
    // this.data.addListener(this.updateState);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowequal(this.state.data, nextState) ||
      this.props.end !== nextProps.end
    );
  }
  componentWillUnmount() {
    // this.data.removeAllListeners();
    // this.updateState.stop();
  }
  // updateState = throttle(() => {
  //   // this.setState({
  //   this.dataSource = this.dataSource.cloneWithRows(this.data);
  //   // LayoutAnimation.easeInEaseOut();
  //   this.forceUpdate();
  //   // });
  // }, 1000);

  render() {
    console.log("1123");

    console.log(this.state.data);

    return (
      <FlatList
        style={styles.list}
        data={this.state.data}
        keyExtractor={item => item._id}
        onEndReachedThreshold={100}
        ListFooterComponent={this.props.renderFooter}
        ListHeaderComponent={() => <Typing />}
        onEndReached={() =>
          this.props.onEndReached(this.state.data[this.state.data.length - 1])
        }
        // dataSource={this.dataSource}
        renderItem={({ item, index }) => this.props.renderRow(item, index)}
        initialListSize={1}
        pageSize={20}
        testID="room-view-messages"
        {...scrollPersistTaps}
      />
      // <ListView
      // 	enableEmptySections
      // 	style={styles.list}
      // 	data={this.data}
      // 	keyExtractor={item => item._id}
      // 	onEndReachedThreshold={100}
      // 	renderFooter={this.props.renderFooter}
      // 	renderHeader={() => <Typing />}
      // 	onEndReached={() => this.props.onEndReached(this.data[this.data.length - 1])}
      // 	dataSource={this.dataSource}
      // 	renderRow={(item, previousItem) => this.props.renderRow(item, previousItem)}
      // 	initialListSize={1}
      // 	pageSize={20}
      // 	testID='room-view-messages'
      // 	{...scrollPersistTaps}
      // />
    );
  }
}

@connect(state => ({
  lastOpen: state.room.lastOpen
}))
export class ListView extends OldList2 {
  constructor(props) {
    super(props);
    this.state = {
      curRenderedRowsCount: 10
      // highlightedRow: ({}: Object)
    };
  }

  getInnerViewNode() {
    return this.refs.listView.getInnerViewNode();
  }

  scrollTo(...args) {
    this.refs.listView.scrollTo(...args);
  }

  setNativeProps(props) {
    this.refs.listView.setNativeProps(props);
  }
  // static DataSource = DataSource;
  render() {
    const bodyComponents = [];

    // const stickySectionHeaderIndices = [];

    // const { renderSectionHeader } = this.props;

    const header = this.props.renderHeader ? this.props.renderHeader() : null;
    const footer = this.props.renderFooter ? this.props.renderFooter() : null;
    // let totalIndex = header ? 1 : 0;

    const { data } = this.props;
    let count = 0;

    for (
      let i = 0;
      i < this.state.curRenderedRowsCount && i < data.length;
      i += 1, count += 1
    ) {
      const message = data[i];
      const previousMessage = data[i + 1];
      bodyComponents.push(this.props.renderRow(message, previousMessage));

      if (!previousMessage) {
        bodyComponents.push(
          <Separator key={message.ts.toISOString()} ts={message.ts} />
        );
        continue; // eslint-disable-line
      }

      const showUnreadSeparator =
        this.props.lastOpen &&
        moment(message.ts).isAfter(this.props.lastOpen) &&
        moment(previousMessage.ts).isBefore(this.props.lastOpen);
      const showDateSeparator = !moment(message.ts).isSame(
        previousMessage.ts,
        "day"
      );

      if (showUnreadSeparator || showDateSeparator) {
        bodyComponents.push(
          <Separator
            key={message.ts.toISOString()}
            ts={showDateSeparator ? message.ts : null}
            unread={showUnreadSeparator}
          />
        );
      }
    }

    const { ...props } = this.props;
    if (!props.scrollEventThrottle) {
      props.scrollEventThrottle = DEFAULT_SCROLL_CALLBACK_THROTTLE;
    }
    if (props.removeClippedSubviews === undefined) {
      props.removeClippedSubviews = true;
    }
    /* $FlowFixMe(>=0.54.0 site=react_native_fb,react_native_oss) This comment
     * suppresses an error found when Flow v0.54 was deployed. To see the error
     * delete this comment and run Flow. */
    Object.assign(props, {
      onScroll: this._onScroll,
      /* $FlowFixMe(>=0.53.0 site=react_native_fb,react_native_oss) This
       * comment suppresses an error when upgrading Flow's support for React.
       * To see the error delete this comment and run Flow. */
      // stickyHeaderIndices: this.props.stickyHeaderIndices.concat(stickySectionHeaderIndices,),

      // Do not pass these events downstream to ScrollView since they will be
      // registered in ListView's own ScrollResponder.Mixin
      onKeyboardWillShow: undefined,
      onKeyboardWillHide: undefined,
      onKeyboardDidShow: undefined,
      onKeyboardDidHide: undefined
    });

    const image = data.length === 0 ? { uri: "message_empty" } : null;
    return [
      <ImageBackground
        key="listview-background"
        source={image}
        style={styles.imageBackground}
      />,
      <ScrollView
        key="listview-scroll"
        ref={this._setScrollComponentRef}
        onContentSizeChange={this._onContentSizeChange}
        onLayout={this._onLayout}
        {...props}
      >
        {header}
        {bodyComponents}
        {footer}
      </ScrollView>
    ];
  }
}
// ListView.DataSource = DataSource;