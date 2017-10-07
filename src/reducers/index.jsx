import {combineReducers} from 'redux';
import {all} from 'redux-saga/effects';

const sampleReducer = (state = {}, action) => (state);

function* sampleRootSaga() {};

export function* rootSaga() {
  yield all([
    sampleRootSaga()
  ])
}

export const reducers = combineReducers({
  sampleReducer
});
