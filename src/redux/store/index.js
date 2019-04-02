import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { all, fork } from "redux-saga/effects";
import i18n from "i18n-js";

// import { USER_LOGOUT } from './actions/authActions';
import createAppReducer from "../reducers";
import { adminSaga } from "../sagas";
import defaultI18nProvider from "../../main/ran-i18n/defaultI18nProvider";

export default ({
  customReducers = {},
  customSagas = [],
  authProvider,
  i18nProvider = defaultI18nProvider,
  dataProvider,
  dataRXProvider,
  initialState,
  locale = "en"
}) => {
  //reducers
  i18n.fallbacks = true;
  i18n.translations = i18nProvider;
  i18n.locale = locale;
  const appReducer = createAppReducer(customReducers, locale);

  //sagas
  const saga = function* rootSaga() {
    yield all(
      [
        adminSaga(dataProvider, authProvider, dataRXProvider, i18nProvider),
        ...customSagas
      ].map(fork)
    );
  };

  //middlewares
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];

  // store
  const store = createStore(
    appReducer,
    initialState,
    applyMiddleware(...middlewares)
  );

  sagaMiddleware.run(saga);

  return store;
};
