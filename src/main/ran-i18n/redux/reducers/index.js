import { combineReducers } from "redux";
import localeReducer from "./localeReducer";
import loading from "./loadingReducer";

export default initialLocale =>
  combineReducers({
    locale: localeReducer(initialLocale),
    loading
  });

export const getLocale = state => state.locale;
