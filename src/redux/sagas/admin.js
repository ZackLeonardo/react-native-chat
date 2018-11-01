import { all } from "redux-saga/effects";
import rocketSagas from "../../chatModule/redux/sagas";
// import auth from "./auth";
// import callback from "./callback";
// import fetch from "./fetch";
// import error from "./error";
// import i18n from "./i18n";
// import notification from "./notification";
// import redirection from "./redirection";
// import accumulate from "./accumulate";
// import refresh from "./refresh";
// import undo from "./undo";
// import recordForm from "./recordForm";

export default (dataProvider, authProvider, dataRXProvider) =>
  function* admin() {
    yield all([rocketSagas()]);
  };
