import React, { Component } from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { Text, View } from "react-native-animatable";
import PropTypes from "prop-types";
import compose from "recompose/compose";

import { translate } from "../../../main/ran-i18n";
import CustomButton from "../../components/CustomButton";
import CustomTextInput from "../../components/CustomTextInput";

class SignupForm extends Component {
  state = {
    username: "",
    password: "",
    email: ""
  };

  hideForm = async () => {
    if (this.buttonRef && this.formRef && this.linkRef) {
      await Promise.all([
        this.buttonRef.zoomOut(200),
        this.formRef.fadeOut(300),
        this.linkRef.fadeOut(300)
      ]);
    }
  };

  render() {
    const { username, password, email } = this.state;
    const {
      isLoading,
      onLoginLinkPress,
      onSignupPress,
      translate,
      userAccount,
      emailAccount,
      passwd,
      signAccount,
      already
    } = this.props;
    const isValid = username !== "" && password !== "" && email !== "";
    return (
      <View style={styles.container}>
        <View style={styles.form} ref={ref => (this.formRef = ref)}>
          <CustomTextInput
            ref={ref => (this.emailInputRef = ref)}
            placeholder={translate(userAccount)}
            editable={!isLoading}
            returnKeyType={"next"}
            blurOnSubmit={false}
            withRef={true}
            onSubmitEditing={() => this.passwordInputRef.focus()}
            onChangeText={value => this.setState({ username: value })}
            isEnabled={!isLoading}
          />
          <CustomTextInput
            ref={ref => (this.mobileInputRef = ref)}
            placeholder={translate(emailAccount)}
            keyboardType={"email-address"}
            editable={!isLoading}
            returnKeyType={"next"}
            blurOnSubmit={false}
            withRef={true}
            onSubmitEditing={() => this.emailInputRef.focus()}
            onChangeText={value => this.setState({ email: value })}
            isEnabled={!isLoading}
          />
          <CustomTextInput
            ref={ref => (this.passwordInputRef = ref)}
            placeholder={translate(passwd)}
            editable={!isLoading}
            returnKeyType={"done"}
            secureTextEntry={true}
            withRef={true}
            onChangeText={value => this.setState({ password: value })}
            isEnabled={!isLoading}
          />
        </View>
        <View style={styles.footer}>
          <View
            ref={ref => (this.buttonRef = ref)}
            animation={"bounceIn"}
            duration={600}
            delay={400}
          >
            <CustomButton
              onPress={() => onSignupPress(username, password, email)}
              isEnabled={isValid}
              isLoading={isLoading}
              buttonStyle={styles.createAccountButton}
              textStyle={styles.createAccountButtonText}
              text={translate(signAccount)}
            />
          </View>
          <Text
            ref={ref => (this.linkRef = ref)}
            style={styles.loginLink}
            onPress={onLoginLinkPress}
            animation={"fadeIn"}
            duration={600}
            delay={400}
          >
            {translate(already)}
          </Text>
        </View>
      </View>
    );
  }
}

SignupForm.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onSignupPress: PropTypes.func.isRequired,
  onLoginLinkPress: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  userAccount: PropTypes.string,
  emailAccount: PropTypes.string,
  passwd: PropTypes.string,
  signAccount: PropTypes.string,
  already: PropTypes.string
};

SignupForm.defaultProps = {
  userAccount: "ran.login.userAccount",
  emailAccount: "ran.login.emailAccount",
  passwd: "ran.login.passwd",
  signAccount: "ran.login.signAccount",
  already: "ran.login.already"
};

const styles = EStyleSheet.create({
  container: {
    paddingHorizontal: "10%"
  },
  form: {
    marginTop: 20
  },
  footer: {
    height: 100,
    justifyContent: "center"
  },
  createAccountButton: {
    backgroundColor: "white"
  },
  createAccountButtonText: {
    color: "#3E464D",
    fontWeight: "bold"
  },
  loginLink: {
    color: "rgba(255,255,255,0.6)",
    alignSelf: "center",
    padding: 20
  }
});

export default compose(translate)(SignupForm);
