class NavigationActionsClass {
  setNavigator(navigation) {
    this.navigation = navigation;
  }

  push = action => this.navigation && this.navigation.dispatch(action);

  pop = action => this.navigation && this.navigation.pop(action);

  popToRoot = action => this.navigation && this.navigation.popToRoot(action);

  resetTo = action => this.navigation && this.navigation.resetTo(action);

  toggleDrawer = action =>
    this.navigation && this.navigation.toggleDrawer(action);

  dismissModal = action =>
    this.navigation && this.navigation.dismissModal(action);
}

export const NavigationActions = new NavigationActionsClass();
