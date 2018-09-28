const REQUEST = "REQUEST";
const SUCCESS = "SUCCESS";
const FAILURE = "FAILURE";
const defaultTypes = [REQUEST, SUCCESS, FAILURE];
function createRequestTypes(base, types = defaultTypes) {
  const res = {};
  types.forEach(type => (res[type] = `${base}_${type}`));
  return res;
}

export const ROOMS = createRequestTypes("ROOMS", [
  ...defaultTypes,
  "SET_ROOMS",
  "SET_SEARCH"
]);
