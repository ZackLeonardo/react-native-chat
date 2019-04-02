import React from "react";

import { CoreMain, Screen } from "./ran-core";

class AppDesk extends React.Component {
  render() {
    return <CoreMain {...this.props} />;
  }
}

export { AppDesk, Screen };
