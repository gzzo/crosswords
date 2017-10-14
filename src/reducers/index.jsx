import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

import { reducer as puzzle, rootSaga as puzzleSaga } from 'reducers/puzzle';
import { reducer as modal } from 'reducers/modal';


export function* rootSaga() {
  yield all([
    puzzleSaga(),
  ]);
}

export const reducers = combineReducers({
  puzzle,
  modal,
});
