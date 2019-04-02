import React from "react";

import { CoreMain, Screen } from "./ran-core";
import { TranslationProvider } from "./ran-i18n";

class AppDesk extends React.Component {
  render() {
    return (
      <TranslationProvider>
        <CoreMain {...this.props} />
      </TranslationProvider>
    );
  }
}

export { AppDesk, Screen };
