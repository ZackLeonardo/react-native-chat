import React from "react";
import PropTypes from "prop-types";
import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { connect } from "react-redux";
import { compose, hoistStatics } from "recompose";

import { translate } from "../../main/ran-i18n";
import LoggedView from "./View";
import { forgotPasswordInit, forgotPasswordRequest } from "../actions/login";
import KeyboardView from "../presentation/KeyboardView";
import TextInput from "../containers/TextInput";
import Button from "../containers/Button";
import Loading from "../containers/Loading";
import styles from "./Styles";
import { showErrorAlert } from "../utils/info";
import scrollPersistTaps from "../utils/scrollPersistTaps";
// import I18n from '../i18n';

/** @extends React.Component */
class ForgotPasswordView extends LoggedView {
  static propTypes = {
    navigation: PropTypes.object,
    forgotPasswordInit: PropTypes.func.isRequired,
    forgotPasswordRequest: PropTypes.func.isRequired,
    login: PropTypes.object
  };

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title")
    };
  };

  constructor(props) {
    super("ForgotPasswordView", props);

    this.state = {
      email: "",
      invalidEmail: false
    };
  }

  componentDidMount() {
    this.props.forgotPasswordInit();
  }

  componentDidUpdate() {
    const { login, translate } = this.props;
    if (login.success) {
      this.props.navigation.pop();
      setTimeout(() => {
        showErrorAlert(
          translate(
            "ran.forgotPasswordView.Forgot_password_If_this_email_is_registered"
          ),
          translate("ran.common.Alert")
        );
      });
    }
  }

  validate = email => {
    /* eslint-disable no-useless-escape */
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!reg.test(email)) {
      this.setState({ invalidEmail: true });
      return;
    }
    this.setState({ email, invalidEmail: false });
  };

  resetPassword = () => {
    const { email, invalidEmail } = this.state;
    if (invalidEmail || !email) {
      return;
    }
    this.props.forgotPasswordRequest(email);
  };

  render() {
    const { translate } = this.props;
    return (
      <KeyboardView
        contentContainerStyle={styles.container}
        keyboardVerticalOffset={128}
      >
        <ScrollView
          {...scrollPersistTaps}
          contentContainerStyle={styles.containerScrollView}
        >
          <SafeAreaView style={styles.container} testID="forgot-password-view">
            <View>
              <TextInput
                inputStyle={
                  this.state.invalidEmail ? { borderColor: "red" } : {}
                }
                label={translate("ran.common.Email")}
                placeholder={translate("ran.common.Email")}
                keyboardType="email-address"
                returnKeyType="next"
                onChangeText={email => this.validate(email)}
                onSubmitEditing={() => this.resetPassword()}
                testID="forgot-password-view-email"
              />

              <View style={styles.alignItemsFlexStart}>
                <Button
                  title={translate("ran.forgotPasswordView.Reset_password")}
                  type="primary"
                  onPress={this.resetPassword}
                  testID="forgot-password-view-submit"
                />
              </View>

              {this.props.login.failure ? (
                <Text style={styles.error}>
                  {this.props.login.error.reason}
                </Text>
              ) : null}
              <Loading visible={this.props.login.isFetching} />
            </View>
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
        login: state.login
      }),
      dispatch => ({
        forgotPasswordInit: () => dispatch(forgotPasswordInit()),
        forgotPasswordRequest: email => dispatch(forgotPasswordRequest(email))
      })
    ),
    translate
  )
)(ForgotPasswordView);
