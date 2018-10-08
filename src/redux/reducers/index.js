import { combineReducers } from "redux";
import i18nReducer from "../../main/ran-i18n/redux/reducers/index";
import roomsReducers from "../../chatModule/redux/reducers/roomReducers";

export default (customReducers, locale, messages) =>
  combineReducers({
    i18n: i18nReducer(locale, messages),
    rooms: roomsReducers,
    ...customReducers
  });
