import React from "react";
import {
  Text,
  View,
  ActivityIndicator,
  I18nManager as RNI18nManager
} from "react-native";
import Expo from "expo";
import i18n from "../src/base/utils/i18n";
import EStyleSheet from "react-native-extended-stylesheet";

import Avatar from "../src/base/components/avatar/Avatar";

export default class Test extends React.Component {
  state = {
    isI18nInitialized: false
  };

  _onAvatarPress = () => {
    this.avatarRef.layout(this.avatarRef).then(layout => {
      console.log(layout);
    });
  };

  render() {
    const avatarProps = {
      avatar: "https://img3.doubanio.com/img/fmadmin/large/31905.jpg",
      // name: 'واحد اثنان ثلاثة اربعة خمسة ستة سبعة ثمانية وتسعين',//'1234567890',//'一二三四五六七八九十',
      defaultName: i18n.t("lists:to-do"),
      showName: true,
      // avatarContainerStyle: {
      //     width: 100,
      //     height: 100,
      // },
      avatarStyle: styles.avatarStyle
    };

    if (this.state.isI18nInitialized) {
      return (
        <View style={styles.container}>
          <Text>avatar show bellow.</Text>
          <Avatar
            ref={ref => (this.avatarRef = ref)}
            {...avatarProps}
            onAvatarPress={this._onAvatarPress}
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  componentDidMount() {
    i18n
      .init()
      .then(() => {
        const RNDir = RNI18nManager.isRTL ? "RTL" : "LTR";

        // RN doesn't always correctly identify native
        // locale direction, so we force it here.
        if (i18n.dir !== RNDir) {
          const isLocaleRTL = i18n.dir === "RTL";

          RNI18nManager.forceRTL(isLocaleRTL);

          // RN won't set the layout direction if we
          // don't restart the app's JavaScript.
          Expo.Updates.reloadFromCache();
        }

        this.setState({ isI18nInitialized: true });
      })
      .catch(error => console.warn(error));
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  avatarStyle: {
    width: "5rem",
    height: "5rem"
  }
});
