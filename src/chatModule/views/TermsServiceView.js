import React from "react";
import PropTypes from "prop-types";
import { WebView, SafeAreaView } from "react-native";
import { connect } from "react-redux";
import { compose, hoistStatics } from "recompose";

import { translate } from "../../main/ran-i18n";
import styles from "./Styles";
import LoggedView from "./View";

/** @extends React.Component */
class TermsServiceView extends LoggedView {
  static propTypes = {
    termsService: PropTypes.string
  };

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title")
    };
  };

  constructor(props) {
    super("TermsServiceView", props);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <WebView
          originWhitelist={["*"]}
          source={{ html: this.props.termsService, baseUrl: "" }}
        />
      </SafeAreaView>
    );
  }
}

export default hoistStatics(
  compose(
    connect(state => ({
      termsService: state.settings.Layout_Terms_of_Service
    })),
    translate
  )
)(TermsServiceView);
