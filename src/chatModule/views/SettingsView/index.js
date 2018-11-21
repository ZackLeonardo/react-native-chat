import React from "react";
import PropTypes from "prop-types";
import { View, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { connect } from "react-redux";
import Feather from "@expo/vector-icons/Feather";
import { compose, hoistStatics } from "recompose";

import { translate } from "../../../main/ran-i18n";
import LoggedView from "../View";
import RocketChat from "../../lib/rocketchat";
import KeyboardView from "../../presentation/KeyboardView";
import sharedStyles from "../Styles";
import RCTextInput from "../../containers/TextInput";
import scrollPersistTaps from "../../utils/scrollPersistTaps";
import Button from "../../containers/Button";
import Loading from "../../containers/Loading";
import { showErrorAlert, showToast } from "../../utils/info";
import log from "../../utils/log";
import { setUser } from "../../actions/login";

/** @extends React.Component */
class SettingsView extends LoggedView {
  static propTypes = {
    navigator: PropTypes.object,
    userLanguage: PropTypes.string,
    setUser: PropTypes.func
  };

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title"),
      headerLeft: (
        <TouchableOpacity
          style={{ marginHorizontal: 15 }}
          onPress={() => {
            navigation.toggleDrawer();
          }}
        >
          <Feather name="settings" size={20} color="#4674F1" />
        </TouchableOpacity>
      )
    };
  };

  constructor(props) {
    super("SettingsView", props);
    this.state = {
      placeholder: {},
      language: props.userLanguage ? props.userLanguage : "en",
      languages: [
        {
          label: "English",
          value: "en"
        },
        {
          label: "Simple Chinese",
          value: "cn_zh"
        }
      ],
      saving: false
    };
    // props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type === "NavBarButtonPress") {
      if (event.id === "settings") {
        this.props.navigator.toggleDrawer({
          side: "left"
        });
      }
    }
  }

  getLabel = language => {
    const { languages } = this.state;
    const l = languages.find(i => i.value === language);
    if (l && l.label) {
      return l.label;
    }
    return null;
  };

  formIsChanged = () => {
    const { language } = this.state;
    return !(this.props.userLanguage === language);
  };

  submit = async () => {
    this.setState({ saving: true });

    const { language } = this.state;
    const { userLanguage } = this.props;

    if (!this.formIsChanged()) {
      return;
    }

    const params = {};

    // language
    if (userLanguage !== language) {
      params.language = language;
    }

    try {
      await RocketChat.saveUserPreferences(params);
      this.props.setUser({ language: params.language });

      this.setState({ saving: false });
      setTimeout(() => {
        showToast(this.props.translate("ran.settingsView.Preferences_saved"));

        // if (params.language) {
        //   this.props.navigation.setTitle({
        //     title: this.props.translate("ran.common.Settings")
        //   });
        // }
      }, 300);
    } catch (e) {
      this.setState({ saving: false });
      setTimeout(() => {
        if (e && e.error) {
          return showErrorAlert(e.error, e.details);
        }
        showErrorAlert(
          this.props.translate(
            "ran.settingsView.There_was_an_error_while_action"
          ),
          this.props.translate("ran.settingsView.saving_preferences")
        );
        log("saveUserPreferences", e);
      }, 300);
    }
  };

  render() {
    console.log("render SettingsView");
    const { language, languages, placeholder } = this.state;
    return (
      <KeyboardView
        contentContainerStyle={sharedStyles.container}
        keyboardVerticalOffset={128}
      >
        <ScrollView
          contentContainerStyle={sharedStyles.containerScrollView}
          testID="settings-view-list"
          {...scrollPersistTaps}
        >
          <SafeAreaView style={sharedStyles.container} testID="settings-view">
            <RNPickerSelect
              items={languages}
              onValueChange={value => {
                this.setState({ language: value });
              }}
              value={language}
              placeholder={placeholder}
            >
              <RCTextInput
                inputRef={e => {
                  this.name = e;
                }}
                label={this.props.translate("ran.settingsView.Language")}
                placeholder={this.props.translate("ran.settingsView.Language")}
                value={this.getLabel(language)}
                testID="settings-view-language"
              />
            </RNPickerSelect>
            <View style={sharedStyles.alignItemsFlexStart}>
              <Button
                title={this.props.translate("ran.settingsView.Save_Changes")}
                type="primary"
                onPress={this.submit}
                disabled={!this.formIsChanged()}
                testID="settings-view-button"
              />
            </View>
            {/* <Loading visible={this.state.saving} /> */}
          </SafeAreaView>
        </ScrollView>
      </KeyboardView>
    );
  }
}

export default hoistStatics(
  compose(
    connect(
      state => ({
        userLanguage: state.login.user && state.login.user.language
      }),
      dispatch => ({
        setUser: params => dispatch(setUser(params))
      })
    ),
    translate
  )
)(SettingsView);
