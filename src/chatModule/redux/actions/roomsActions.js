import * as types from "../constants/actionsTypes";

export function roomsRequest() {
  return {
    type: types.ROOMS.REQUEST
  };
}

export function roomsSuccess() {
  return {
    type: types.ROOMS.SUCCESS
  };
}

export function roomsFailure(err) {
  return {
    type: types.ROOMS.FAILURE,
    err
  };
}

export function setRooms(rooms) {
  return {
    type: types.ROOMS.SET_ROOMS,
    rooms
  };
}

export function setSearch(searchText) {
  return {
    type: types.ROOMS.SET_SEARCH,
    searchText
  };
}