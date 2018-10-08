import React, { Component } from "react";
import { StyleSheet } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { Text, View } from "react-native-animatable";
import PropTypes from "prop-types";
import compose from "recompose/compose";
import { translate } from "../../../main/ran-i18n";

import CustomButton from "../../components/CustomButton";

class Opening extends Component {
  render() {
    const {
      onCreateAccountPress,
      onSignInPress,
      loginLabel,
      orLabel,
      signLabel,
      translate
    } = this.props;
    return (
      <View style={styles.container}>
        <View animation={"zoomIn"} delay={600} duration={400}>
          <CustomButton
            text={translate(signLabel)}
            onPress={onCreateAccountPress}
            buttonStyle={styles.createAccountButton}
            textStyle={styles.createAccountButtonText}
          />
        </View>
        <View
          style={styles.separatorContainer}
          animation={"zoomIn"}
          delay={700}
          duration={400}
        >
          <View style={styles.separatorLine} />
          <Text style={styles.separatorOr}>{translate(orLabel)}</Text>
          <View style={styles.separatorLine} />
        </View>
        <View animation={"zoomIn"} delay={800} duration={400}>
          <CustomButton
            text={translate(loginLabel)}
            onPress={onSignInPress}
            buttonStyle={styles.signInButton}
            textStyle={styles.signInButtonText}
          />
        </View>
      </View>
    );
  }
}

Opening.propTypes = {
  onCreateAccountPress: PropTypes.func.isRequired,
  onSignInPress: PropTypes.func.isRequired,
  loginLabel: PropTypes.string,
  orLabel: PropTypes.string,
  signLabel: PropTypes.string,
  translate: PropTypes.func.isRequired
};

Opening.defaultProps = {
  loginLabel: "ran.login.login",
  orLabel: "ran.login.or",
  signLabel: "ran.login.sign"
};

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: "10%",
    justifyContent: "center"
  },
  createAccountButton: {
    backgroundColor: "$DARKGRAY"
  },
  createAccountButtonText: {
    color: "white"
  },
  separatorContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20
  },
  separatorLine: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    height: StyleSheet.hairlineWidth,
    borderColor: "$DARKGRAY"
  },
  separatorOr: {
    color: "$DARKGRAY",
    marginHorizontal: 8
  },
  signInButton: {
    backgroundColor: "$DODERBLUE"
  },
  signInButtonText: {
    color: "white"
  }
});

export default compose(translate)(Opening);
