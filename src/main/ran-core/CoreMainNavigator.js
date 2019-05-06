import { createAppContainer, createBottomTabNavigator } from "react-navigation";

const CoreMainNavigator = modules => {
  const RootNavigator = createAppContainer(createBottomTabNavigator(modules));

  return RootNavigator;
};

export default CoreMainNavigator;
