import React from "react";

import { CoreMain } from "./ran-core";
export { Screen } from "./ran-core";

export default class Main extends React.Component {
  render() {
    const Nav = CoreMain(this.props.modules);

    return <Nav />;
  }
}
