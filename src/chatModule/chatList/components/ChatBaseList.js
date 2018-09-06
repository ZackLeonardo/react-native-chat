import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Text, View, TouchableHighlight } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import Swipeout from "react-native-swipeout";

// import i18n from "../../base/utils/i18n";
import TopSearchBar from "../../../base/components/topSearchBar/TopSearchBar";
import IntroductionItem from "../../../base/components/introductionItem/IntroductionItem";
import { ListStyles } from "../../../base/styles/listStyles";

class MyListItem extends PureComponent {
  _handleTopPressed = (item, index) => {
    const isToped = this.props.isToped;
    if (!isToped && this.props.topPressed) {
      this.props.topPressed(item, index);
    }
    if (isToped && this.props.unTopPressed) {
      this.props.unTopPressed(item, index);
    }
  };

  _handleDeletePressed = (item, index) => {
    if (this.props.deletePressed) {
      this.props.deletePressed(item, index);
    }
  };

  _onItemPress = item => {
    if (this.props.onItemPress) {
      this.props.onItemPress(item);
    }
  };

  renderPromptNum(num) {
    const showNum = num > 999 ? 999 : num;
    return <Text style={styles.promptText}>{showNum}</Text>;
  }

  render() {
    const innerProps = this.getInnerComponentProps();
    const {
      index,
      item,
      hasSearchBar,
      isToped,
      onItemPress,
      unReadNum
    } = this.props;

    return (
      <Swipeout
        style={index === 0 && hasSearchBar ? styles.hasSearchBar : null}
        close={true}
        right={[
          {
            text: isToped
              ? i18n.t("chatBaseList:unTop")
              : i18n.t("chatBaseList:top"),
            onPress: () => {
              this._handleTopPressed(item, index);
            },
            type: "secondary"
          },
          {
            text: i18n.t("chatBaseList:delete"),
            onPress: () => {
              this._handleDeletePressed(item, index);
            },
            type: "delete"
          }
        ]}
        autoClose={true}
        onOpen={() => {}}
        onClose={() => {}}
      >
        <TouchableHighlight
          disabled={onItemPress ? false : true}
          onPress={() => this._onItemPress(item)}
        >
          <View
            style={isToped ? [styles.cell, styles.setTopStyle] : styles.cell}
          >
            <IntroductionItem
              {...item}
              {...innerProps}
              showName={false}
              avatarContainerStyle={styles.avatarContainerStyle}
              avatarStyle={styles.avatarStyle}
              textStyle={styles.avatarTextStyle}
              introInfoStyle={styles.introInfoStyle}
              mainTitleStyle={styles.mainTitleStyle}
              numberOfMainTitleLines={1}
              infoStyle={styles.infoStyle}
              numberOfInfoLines={1}
            />
            {unReadNum ? this.renderPromptNum(unReadNum) : null}
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  }

  getInnerComponentProps() {
    const {
      index,
      item,
      onItemPress,
      topPressed,
      unTopPressed,
      deletePressed,
      hasSearchBar,
      isToped,
      unReadNum,
      ...props
    } = this.props;
    return {
      ...props
    };
  }
}

MyListItem.defaultProps = {};

MyListItem.propTypes = {
  index: PropTypes.number,
  item: PropTypes.object,
  hasSearchBar: PropTypes.bool,
  isToped: PropTypes.bool,
  onItemPress: PropTypes.func,
  topPressed: PropTypes.func,
  unTopPressed: PropTypes.func,
  deletePressed: PropTypes.func,
  unReadNum: PropTypes.number
};

export default class ChatBaseList extends TopSearchBar {
  state = {
    hideBack: true
  };

  _alreadyToped = id => {
    let { cTopedIds } = this.props;
    return cTopedIds ? cTopedIds.indexOf(id) >= 0 : false;
  };

  _getItemLayout = (data, index) => {
    let ITEM_HEIGHT = EStyleSheet.value(styles.itemHeight);
    return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
  };

  renderListItem = (item, index) => {
    const isToped = this._alreadyToped(item.id);
    const innerProps = this.getInnerComponentProps();
    // console.log('_renderListItem'+ index);
    return (
      <MyListItem
        {...innerProps}
        index={index}
        item={item}
        isToped={isToped}
        // onItemPress={this.props.onItemPress}
        // topPressed={this.props.topPressed}
        // unTopPressed={this.props.unTopPressed}
        // deletePressed={this.props.deletePressed}
      />
    );
  };

  getInnerComponentProps() {
    const {
      cItems,
      cTopedIds,
      onScroll,
      searchbarPlaceholder,
      onSearch,
      ...props
    } = this.props;
    return {
      ...props
    };
  }
}

ChatBaseList.defaultProps = {};

ChatBaseList.propTypes = {
  ...TopSearchBar.propTypes,
  hasSearchBar: PropTypes.bool,
  isToped: PropTypes.bool,
  onItemPress: PropTypes.func,
  topPressed: PropTypes.func,
  unTopPressed: PropTypes.func,
  deletePressed: PropTypes.func,
  unReadNum: PropTypes.number
};

const styles = EStyleSheet.create({
  ...ListStyles
});
