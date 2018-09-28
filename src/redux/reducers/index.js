import { combineReducers } from "redux";
import roomsReducers from "../../chatModule/redux/reducers/roomReducers";

export default customReducers =>
  combineReducers({
    rooms: roomsReducers,
    ...customReducers
  });
