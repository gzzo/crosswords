import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

import { reducer as puzzle, rootSaga as puzzleSaga } from 'reducers/puzzle';


export function* rootSaga() {
  yield all([
    puzzleSaga(),
  ]);
}

export const reducers = combineReducers({
  puzzle,
});
