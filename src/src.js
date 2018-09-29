import React from "react";
import { Dimensions } from "react-native";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { all, fork } from "redux-saga/effects";
import EStyleSheet from "react-native-extended-stylesheet";

import defaultTheme from "./base/styles/defaultTheme";
import { AppDesk } from "./main/main";
import createAppReducer from "./redux/reducers";

import { adminSaga } from "./redux/sagas";

const { width } = Dimensions.get("window");
EStyleSheet.build({
  ...defaultTheme,
  $rem: width > 340 ? 18 : 16
});

//reducers
const customReducers = {};
const appReducer = createAppReducer(customReducers);

//sagas
const customSagas = [];
const saga = function* rootSaga() {
  yield all([adminSaga(), ...customSagas].map(fork));
};

//middlewares
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

// store
const store = createStore(appReducer, applyMiddleware(...middleware));

sagaMiddleware.run(saga);

/**
 * RNChatApp props:
 * modules--stackNavigation views object
 * dataProvider--saga fetch http datasource
 * dataRXProvider--reactive datasource such as using ddp
 */
export default class RNChatApp extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppDesk modules={this.props.modules} />
      </Provider>
    );
  }
}
