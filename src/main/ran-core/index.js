import React from "react";

import CoreMain from "./CoreMain";
import Screen from "./Screen";

class AppDeskNav extends React.Component {
  render() {
    const Nav = CoreMain(this.props.modules);

    return <Nav />;
  }
}

export { AppDeskNav, Screen };
