import { all, takeEvery } from "redux-saga/effects";

function* testfun(action) {}

const test = function* test() {
  console.log("test");
  yield takeEvery("ADD_USERSASYNC", testfun);
};

export default () =>
  function* admin() {
    yield all([test()]);
  };
