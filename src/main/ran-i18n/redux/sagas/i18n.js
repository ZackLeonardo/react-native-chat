import { put, takeLatest } from "redux-saga/effects";
import i18n from "i18n-js";
import {
  CHANGE_LOCALE,
  changeLocaleSuccess,
  changeLocaleFailure
} from "../actions/localeActions";

const loadMessages = function*(i18nProvider, action) {
  const locale = action.payload;

  try {
    i18n.locale = locale;
    yield put(changeLocaleSuccess(locale));
  } catch (err) {
    yield put(changeLocaleFailure(action.payload.locale, err));
  }
};

const root = function* root(i18nProvider) {
  yield takeLatest(CHANGE_LOCALE, loadMessages, i18nProvider);
};
export default root;
