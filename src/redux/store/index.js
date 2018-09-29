import { createStore, compose, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { all, fork } from "redux-saga/effects";

// import { USER_LOGOUT } from './actions/authActions';
import createAppReducer from "../reducers";
import { adminSaga } from "../sagas";

export default ({
  authProvider,
  customReducers = {},
  customSagas = [],
  dataProvider,
  dataRXProvider,
  initialState
}) => {
  //reducers
  const appReducer = createAppReducer(customReducers);

  //sagas
  const saga = function* rootSaga() {
    yield all(
      [
        adminSaga(dataProvider, authProvider, dataRXProvider),
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
