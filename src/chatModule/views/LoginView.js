import React from "react";
import PropTypes from "prop-types";
import { Keyboard, Text, ScrollView, View, SafeAreaView } from "react-native";
import { connect } from "react-redux";
// import { Answers } from "react-native-fabric";

import RocketChat from "../lib/rocketchat";
import KeyboardView from "../presentation/KeyboardView";
import TextInput from "../containers/TextInput";
import Button from "../containers/Button";
import Loading from "../containers/Loading";
import styles from "./Styles";
import scrollPersistTaps from "../utils/scrollPersistTaps";
import { showToast } from "../utils/info";
import { COLOR_BUTTON_PRIMARY } from "../constants/colors";
import LoggedView from "./View";

@connect(
  state => ({
    server: state.server.server,
    failure: state.login.failure,
    isFetching: state.login.isFetching,
    reason: state.login.error && state.login.error.reason,
    error: state.login.error && state.login.error.error
  }),
  () => ({
    loginSubmit: params => RocketChat.loginWithPassword(params)
  })
)
/** @extends React.Component */
export default class LoginView extends LoggedView {
  static propTypes = {
    navigation: PropTypes.object,
    loginSubmit: PropTypes.func.isRequired,
    login: PropTypes.object,
    server: PropTypes.string,
    error: PropTypes.string,
    Accounts_EmailOrUsernamePlaceholder: PropTypes.string,
    Accounts_PasswordPlaceholder: PropTypes.string,
    failure: PropTypes.bool,
    isFetching: PropTypes.bool,
    reason: PropTypes.string
  };

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title"),
      headerBackTitle: null
    };
  };

  constructor(props) {
    super("LoginView", props);
    this.state = {
      username: "",
      password: ""
    };
  }

  submit = async () => {
    const { username, password, code } = this.state;
    if (username.trim() === "" || password.trim() === "") {
      showToast(
        this.props.screenProps.translate(
          "ran.loginView.Email_or_password_field_is_empty"
        )
      );
      return;
    }
    Keyboard.dismiss();

    try {
      await this.props.loginSubmit({ username, password, code });
      // Answers.logLogin("Email", true);
    } catch (error) {
      console.warn("LoginView submit", error);
    }
  };

  register = () => {
    this.props.navigation.navigate("RegisterView", {
      title: this.props.server
    });
  };

  forgotPassword = () => {
    this.props.navigation.navigate("ForgotPasswordView", {
      title: this.props.screenProps.translate("ran.loginView.Forgot_Password")
    });
  };

  renderTOTP = () => {
    if (/totp/gi.test(this.props.error)) {
      return (
        <TextInput
          inputRef={ref => (this.codeInput = ref)}
          label={this.props.screenProps.translate("ran.loginView.Code")}
          onChangeText={code => this.setState({ code })}
          placeholder={this.props.screenProps.translate("ran.loginView.Code")}
          keyboardType="numeric"
          returnKeyType="done"
          autoCapitalize="none"
          onSubmitEditing={this.submit}
        />
      );
    }
    return null;
  };

  render() {
    const { translate } = this.props.screenProps;
    return (
      <KeyboardView
        contentContainerStyle={styles.container}
        keyboardVerticalOffset={128}
        key="login-view"
      >
        <ScrollView
          {...scrollPersistTaps}
          contentContainerStyle={styles.containerScrollView}
        >
          <SafeAreaView style={styles.container} testID="login-view">
            <Text style={[styles.loginText, styles.loginTitle]}>Login</Text>
            <TextInput
              label={translate("ran.common.Username")}
              placeholder={
                this.props.Accounts_EmailOrUsernamePlaceholder ||
                translate("ran.common.Username")
              }
              keyboardType="email-address"
              returnKeyType="next"
              iconLeft="at"
              onChangeText={username => this.setState({ username })}
              onSubmitEditing={() => {
                this.password.focus();
              }}
              testID="login-view-email"
            />

            <TextInput
              inputRef={e => {
                this.password = e;
              }}
              label={translate("ran.loginView.Password")}
              placeholder={
                this.props.Accounts_PasswordPlaceholder ||
                translate("ran.loginView.Password")
              }
              returnKeyType="done"
              iconLeft="key-variant"
              secureTextEntry
              onSubmitEditing={this.submit}
              onChangeText={password => this.setState({ password })}
              testID="login-view-password"
            />

            {this.renderTOTP()}

            <View style={styles.alignItemsFlexStart}>
              <Button
                title={translate("ran.loginView.Login")}
                type="primary"
                onPress={this.submit}
                testID="login-view-submit"
              />
              <Text
                style={[styles.loginText, { marginTop: 10 }]}
                testID="login-view-register"
                onPress={() => this.register()}
              >
                {translate("ran.loginView.New_in_RocketChat_question_mark")}{" "}
                &nbsp;
                <Text style={{ color: COLOR_BUTTON_PRIMARY }}>
                  {translate("ran.common.Sign_Up")}
                </Text>
              </Text>
              <Text
                style={[styles.loginText, { marginTop: 20, fontSize: 13 }]}
                onPress={() => this.forgotPassword()}
                testID="login-view-forgot-password"
              >
                {translate("ran.loginView.Forgot_password")}
              </Text>
            </View>

            {this.props.failure ? (
              <Text style={styles.error}>{this.props.reason}</Text>
            ) : null}
            <Loading visible={this.props.isFetching} />
          </SafeAreaView>
        </ScrollView>
      </KeyboardView>
    );
  }
}