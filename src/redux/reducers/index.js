import { combineReducers } from "redux";
import chatListReducers from "./chatListReducers";

export default customReducers =>
  combineReducers({
    chatList: chatListReducers,
    ...customReducers
  });
