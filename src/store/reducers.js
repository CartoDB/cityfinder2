import { GAME_STARTED, GAME_OVER, MAP_MOVED, MAP_READY } from "./actions"

const initialState = {
  userName: "",
  city: {name: "", country: "", coordinates: "", id: 0},
  numMoves: 0,
  boundingBoxFilter: null
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case GAME_STARTED:
      return {...state, userName: action.payload.userName, city: action.payload.city};
    case MAP_MOVED:
      return {...state, numMoves: action.payload};
    case MAP_READY:
      return {...state, boundingBoxFilter: action.payload};
    case GAME_OVER:
      return state;  // TODO
    default:
      return state;
  }
}

export default rootReducer;
