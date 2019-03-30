import React, { Component } from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { Text, View } from "react-native-animatable";
import PropTypes from "prop-types";
import i18n from "i18n-js";

import CustomButton from "../../components/CustomButton";
import CustomTextInput from "../../components/CustomTextInput";

class LoginForm extends Component {
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
    const { username, password } = this.state;
    const {
      isLoading,
      onSignupLinkPress,
      onLoginPress,
      userAccount,
      passwd,
      login,
      notYet
    } = this.props;
    const isValid = username !== "" && password !== "";
    return (
      <View style={styles.container}>
        <View
          style={styles.form}
          ref={ref => {
            this.formRef = ref;
          }}
        >
          <CustomTextInput
            name={"username"}
            ref={ref => (this.emailInputRef = ref)}
            placeholder={i18n.t(userAccount)}
            editable={!isLoading}
            returnKeyType={"next"}
            blurOnSubmit={false}
            withRef={true}
            onSubmitEditing={() => this.passwordInputRef.focus()}
            onChangeText={value => this.setState({ username: value })}
            isEnabled={!isLoading}
          />
          <CustomTextInput
            name={"password"}
            ref={ref => (this.passwordInputRef = ref)}
            placeholder={i18n.t(passwd)}
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
              onPress={() => onLoginPress(username, password)}
              isEnabled={isValid}
              isLoading={isLoading}
              buttonStyle={styles.loginButton}
              textStyle={styles.loginButtonText}
              text={i18n.t(login)}
            />
          </View>
          <Text
            ref={ref => (this.linkRef = ref)}
            style={styles.signupLink}
            onPress={onSignupLinkPress}
            animation={"fadeIn"}
            duration={600}
            delay={400}
          >
            {i18n.t(notYet)}
          </Text>
        </View>
      </View>
    );
  }
}

LoginForm.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onLoginPress: PropTypes.func.isRequired,
  onSignupLinkPress: PropTypes.func.isRequired,
  userAccount: PropTypes.string,
  passwd: PropTypes.string,
  login: PropTypes.string,
  notYet: PropTypes.string
};

LoginForm.defaultProps = {
  userAccount: "ran.login.userAccount",
  passwd: "ran.login.passwd",
  login: "ran.login.login",
  notYet: "ran.login.notYet"
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
  loginButton: {
    backgroundColor: "white"
  },
  loginButtonText: {
    color: "#3E464D",
    fontWeight: "bold"
  },
  signupLink: {
    color: "rgba(255,255,255,0.6)",
    alignSelf: "center",
    padding: 20
  }
});

export default LoginForm;
