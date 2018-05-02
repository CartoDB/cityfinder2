export const GAME_STARTED = "GAME_STARTED";
export const MAP_READY = "MAP_READY";
export const MAP_MOVED = "MAP_MOVED";
export const GAME_OVER = "GAME_OVER";

export const updateGameParams = (userName, city) => ({type: GAME_STARTED, payload: {userName: userName, city: city}});
export const updateNumMoves = (numMoves) => ({type: MAP_MOVED, payload: numMoves});
export const addBoundingBoxFilter = (boundingBoxFilter) => ({type: MAP_READY, payload: boundingBoxFilter});
