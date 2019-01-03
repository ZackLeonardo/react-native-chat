import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableWithoutFeedback
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import { FontAwesome } from "@expo/vector-icons";
import _ from "underscore";
import { FileSystem } from "expo";
import { compose, hoistStatics } from "recompose";

import { translate } from "../../../main/ran-i18n";
import MediaGridBrowserContainer from "./containers/MediaGridBrowserContainer";
import MediaFullScreenBrowser from "./components/MediaFullScreenBrowser";
import BackButton from "./components/BackButton";
import PhoneMediaList from "./components/PhoneMediaList";
import { loadAndCompress } from "../../utils/ImageManipulatorUtil";
import { SelectionButtonStyles } from "../../styles/SelectionButtonStyles";

const DEFAULTMEDIAGROUP = "Camera Roll"; //默认打开的相册

class MediaFullScreenBrowserScreen extends Component {
  state = {
    displayHeader: true
  };

  //navigation有自己的域，通过navigation.state控制（类似component state）
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params } = navigation.state;

    // 记录selectedDataSource的选择状态
    if (!params.dataSourceTmp) {
      params.dataSourceTmp = new Map(params.selectedDataSource);
    }

    // 显示右上角 选择按钮
    showSelectedNum = selectedItem => {
      if (selectedItem) {
        var selectedItemIds = [];
        params.dataSourceTmp.forEach((value, key, map) => {
          if (value) {
            selectedItemIds.push(key);
          }
        });
        return selectedItemIds.indexOf(selectedItem.id) + 1;
      }
    };

    // 显示发送（n）
    showSendedNum = () => {
      var senderNum = 0;
      params.dataSourceTmp.forEach((value, key, map) => {
        if (value) {
          senderNum += 1;
        }
      });
      return senderNum;
    };

    headerRightPressedToUnselect = (
      <TouchableWithoutFeedback
        onPress={() => {
          params.dataSourceTmp.set(params.selectedItem.id, 0);
          navigation.setParams({
            dataSourceTmp: params.dataSourceTmp,
            sendedNum: this.showSendedNum()
          });
        }}
      >
        <View style={styles.thumbnailSelectedNum}>
          <Text style={styles.selectedNumText}>
            {this.showSelectedNum(params.selectedItem)}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );

    headerRightPressedToSelect = (
      <TouchableWithoutFeedback
        onPress={() => {
          params.dataSourceTmp.set(params.selectedItem.id, params.selectedItem);
          navigation.setParams({
            dataSourceTmp: params.dataSourceTmp,
            sendedNum: this.showSendedNum()
          });
        }}
      >
        <FontAwesome
          name="check-circle-o"
          size={24}
          color="white"
          style={styles.thumbnailSelectionIcon}
        />
      </TouchableWithoutFeedback>
    );

    // return之后，navigation可以进行construction、render...，之前不能够调用navigation.setParams方法
    return navigation.state.params.hideHeader
      ? {
          header: null
        }
      : {
          headerLeft: (
            <BackButton
              onPress={() => {
                var newSelectedDataSource = new Map();
                params.selectedDataSource.forEach(item => {
                  if (this.showSelectedNum(item)) {
                    newSelectedDataSource.set(item.id, item);
                  }
                });
                params.updateSelectedDataSource(newSelectedDataSource);
                params.updateMiddleBtSelectedStatus(params.middleBtSelected);
                navigation.goBack();
              }}
            />
          ),
          // <Button title="❮返回" />,
          headerRight: this.showSelectedNum(params.selectedItem)
            ? this.headerRightPressedToUnselect
            : this.headerRightPressedToSelect,
          headerStyle: { backgroundColor: "#35353585" } //#35353550  rgba(53,53,53,0.5)通过最后的参数可以设置透明度
        };
  };

  _scrolledToItem(item) {
    // var shownNum = this.state.selectedItemIds.indexOf(item.id) + 1;
    this.props.navigation.setParams({
      // selectedIndex: shownNum,
      selectedItem: item
    });
  }

  // 原图
  middleButtonPressed = selected => {
    console.log("middleButtonPressed :" + selected);
    this.props.navigation.setParams({
      middleBtSelected: selected
    });
  };

  // 发送
  sendButtonPressed = () => {
    let selectedDataSource = this.props.navigation.state.params.dataSourceTmp;
    for (let datasource of selectedDataSource.values()) {
      console.log(
        "sendButtonPressed in fullScreenLayout: " + JSON.stringify(datasource)
      );

      if (datasource) {
        let uri = datasource.photo;
        let name = datasource.caption;
        let destPath = FileSystem.cacheDirectory + name;

        loadAndCompress(
          uri,
          destPath,
          name,
          0,
          function(err, response) {
            // 将图片加载到app cache中，并compress
            if (response) {
              //正常
              console.log(response);

              // var message = {
              //   id:
              //     this.props.screenProps.roomId +
              //     "-" +
              //     this.props.screenProps.myId +
              //     "-" +
              //     uuid1(),
              //   // text: 'text',
              //   image: response.uri,
              //   imageName: name,
              //   userId: this.props.screenProps.myId,
              //   roomId: this.props.screenProps.roomId,
              //   createdAtClient: new Date(),
              //   status: MESSAGESTATUS.C2IMGS_ING
              // };
              // this.props.screenProps.closeModal();
              // this.props.screenProps.onSend(message);
            } else {
              //load compress 错误
              console.log("load and compress error");
            }
          }.bind(this)
        );
      }
    }
  };

  // 设置隐藏header
  toggleHeader = () => {
    this.setState({
      displayHeader: !this.state.displayHeader
    });
    this.props.navigation.setParams({
      // selectedIndex: shownNum,
      hideHeader: !this.state.displayHeader
    });
  };

  render() {
    console.log("MediaFullScreenBrowserScreen render");
    const { params } = this.props.navigation.state;
    const { translate } = this.props.screenProps;
    let selectedMediaList = Array.from(params.selectedDataSource.values());
    return (
      <MediaFullScreenBrowser
        mediaList={selectedMediaList}
        scrolledToItem={this._scrolledToItem.bind(this)}
        selectedNum={
          _.isUndefined(params.sendedNum)
            ? selectedMediaList.length
            : params.sendedNum
        }
        rightButtonPressed={this.sendButtonPressed}
        middleButtonPressed={this.middleButtonPressed}
        middleBtSelected={params.middleBtSelected}
        toggleHeader={this.toggleHeader}
        displayHeader={this.state.displayHeader}
        leftButtonText={translate("ran.chat.Edit")}
        middleButtonText={translate("ran.chat.Original")}
        rightButtonText={translate("ran.chat.Send")}
      />
      //     <Button
      //   title="Update the title"
      //   onPress={() => this.props.navigation.setParams({rightBt: 'Updated!'})}
      // />
    );
  }
}

class MediaGridBrowserScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerLeft: (
      <BackButton
        onPress={() => {
          // params.
          navigation.goBack();
        }}
        title={screenProps.translate("ran.chat.Gallery")}
      />
    ),
    title: navigation.state.params.title,
    headerRight: (
      <Button
        title={screenProps.translate("ran.chat.Cancel")}
        color="white"
        onPress={() => {
          screenProps.closeModal();
        }}
      />
    ),
    headerStyle: { backgroundColor: "#353535" }, //#35353550  rgba(53,53,53,0.5)通过最后的参数可以设置透明度
    headerTitleStyle: { color: "white" },
    headerBackTitleStyle: { color: "white" },
    headerTintColor: "white"
  });

  // navigation中选中取消照片，需要反应到gridBrowser
  updateSelectedDataSource = newSelectedDataSource => {
    this.mediaGridBrowserContainerRef.mediaGridBrowserRef.updateSelectedDataSource(
      newSelectedDataSource
    );
  };

  // navigation MediaFullScreenBrowserScreen中原图选择情况，反馈到grid
  updateMiddleBtSelectedStatus = selected => {
    this.mediaGridBrowserContainerRef.mediaGridBrowserRef.bottomToolBarRef.setState(
      {
        selectedIndex: selected ? 0 : null
      }
    );
  };

  // 预览
  preViewButtonPressed = selectedDataSource => {
    // let selectedMediaList = Array.from(selectedDataSource.values());
    if (selectedDataSource && selectedDataSource.size) {
      this.props.navigation.navigate("MediaFullScreenBrowser", {
        selectedDataSource: selectedDataSource,
        selectedItem: selectedDataSource.values().next().value,
        updateSelectedDataSource: this.updateSelectedDataSource,
        middleBtSelected:
          this.mediaGridBrowserContainerRef.mediaGridBrowserRef.bottomToolBarRef
            .state.selectedIndex === 0
            ? true
            : false, //原图的选择要同步到预览full
        updateMiddleBtSelectedStatus: this.updateMiddleBtSelectedStatus
      });
    }
  };

  // // 原图
  // middleButtonPressed = (selected) => {
  //   console.log('middleButtonPressed :' + selected);
  // }

  // 发送
  sendButtonPressed = selectedDataSource => {
    for (let datasource of selectedDataSource.values()) {
      console.log(
        "sendButtonPressed in gridLayout: " + JSON.stringify(datasource)
      );

      let uri = datasource.photo;
      let name = datasource.caption;
      let destPath = FileSystem.cacheDirectory + name;

      if (
        this.mediaGridBrowserContainerRef.mediaGridBrowserRef.bottomToolBarRef
          .state.selectedIndex === 0
      ) {
        //选择发送原图
        var message = {
          id:
            this.props.screenProps.roomId +
            "-" +
            this.props.screenProps.myId +
            "-" +
            uuid1(),
          // text: 'text',
          image: uri,
          imageName: name,
          userId: this.props.screenProps.myId,
          roomId: this.props.screenProps.roomId,
          createdAtClient: new Date(),
          status: MESSAGESTATUS.C2IMGS_ING
        };
        this.props.screenProps.closeModal();
        this.props.screenProps.onSend(message);
      } else {
        //未选择原图
        loadAndCompress(
          uri,
          destPath,
          name,
          0,
          function(err, response) {
            // 将图片加载到app cache中，并compress
            if (response) {
              //正常
              var message = {
                id:
                  this.props.screenProps.roomId +
                  "-" +
                  this.props.screenProps.myId +
                  "-" +
                  uuid1(),
                // text: 'text',
                image: response.uri,
                imageName: name,
                userId: this.props.screenProps.myId,
                roomId: this.props.screenProps.roomId,
                createdAtClient: new Date(),
                status: MESSAGESTATUS.C2IMGS_ING
              };
              this.props.screenProps.closeModal();
              this.props.screenProps.onSend(message);
            } else {
              //load compress 错误
              console.log("load and compress error");
            }
          }.bind(this)
        );
      }
    }
  };

  render() {
    console.log("render MediaGridBrowserScreen");
    const { translate } = this.props.screenProps;

    return (
      <MediaGridBrowserContainer
        ref={ref => (this.mediaGridBrowserContainerRef = ref)}
        leftButtonPressed={this.preViewButtonPressed}
        rightButtonPressed={this.sendButtonPressed}
        updateSelectedDataSource={this.updateSelectedDataSource}
        groupName={this.props.navigation.state.params.title}
        leftButtonText={translate("ran.chat.Preview")}
        middleButtonText={translate("ran.chat.Original")}
        rightButtonText={translate("ran.chat.Send")}
        {...this.props}
      />
    );
  }
}

class MediaListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaGroupList: []
    };

    props.navigation.navigate("MediaGridBrowser", {
      title: DEFAULTMEDIAGROUP,
      setMediaGroupList: this.setMediaGroupList
    });
  }

  setMediaGroupList = mediaGroupList => {
    this.setState({
      mediaGroupList: mediaGroupList
    });
  };

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.translate("ran.chat.Gallery"),
    headerRight: (
      <Button
        title={screenProps.translate("ran.chat.Cancel")}
        color="white"
        onPress={() => {
          screenProps.closeModal ? screenProps.closeModal() : null;
        }}
      />
    ),
    headerStyle: { backgroundColor: "#353535" }, //#35353550  rgba(53,53,53,0.5)通过最后的参数可以设置透明度
    headerTitleStyle: { color: "white" },
    headerLeft: null
  });

  onPress = item => {
    console.log("==onPress==");
    const { navigate } = this.props.navigation;
    navigate("MediaGridBrowser", {
      title: item.key,
      setMediaGroupList: this.setMediaGroupList
    });
  };

  render() {
    console.log("render MediaListScreen");

    return (
      <PhoneMediaList
        phoneMediaList={this.state.mediaGroupList}
        onItemPress={this.onPress}
      />
    );
  }
}

const Nav = StackNavigator(
  {
    MediaList: { screen: MediaListScreen },
    MediaGridBrowser: { screen: MediaGridBrowserScreen },
    MediaFullScreenBrowser: { screen: MediaFullScreenBrowserScreen }
  },
  {
    headerMode: "screen"
  }
);

class MediaPicker extends Component {
  render() {
    console.log("render ImagePickerNav");

    return <Nav screenProps={this.props} />;
  }
}

export default hoistStatics(compose(translate))(MediaPicker);

const styles = StyleSheet.create({
  ...SelectionButtonStyles
});

// 对于react navigation子screen向父screen传参： 1. 父中通过state控制自己刷新和screenProps传递回掉； 2. 父中通过state控制自己刷新和navigate中state.params传递回掉；
// 在react navigation中的选择2

// 关于grid和fullscreen 选择原图 联动：
// grid-->fullscreen 可以通过navigation.setParams/params等传参数，fullscreen渲染时候把状态渲染出来；
// fullscreen-->grid 由于grid已经在stack栈中，传递props rerender，bottomToolbar中一边render，一边update return ture，会有问题；所以不传递props，直接setState。
