import {call, put, takeLatest, all} from 'redux-saga/effects';
import {puzzleFetcher, STATUS_404} from 'utils/fetcher';

const FETCH_PUZZLE = 'puzzle/FETCH_PUZZLE';
const FETCH_PUZZLE_RECEIVE = 'puzzle/FETCH_PUZZLE_RECEIVE';

export function fetchPuzzle(name) {
  return {
    type: FETCH_PUZZLE,
    name
  };
}

function fetchPuzzleReceive(name, response) {
  return {
    type: FETCH_PUZZLE_RECEIVE,
    name,
    response
  }
}

function* fetchPuzzleRequest(action) {
  const response = yield call(puzzleFetcher, `/puzzles/${action.name}.json`);
  yield put(fetchPuzzleReceive(action.name, response));
}

function* watchPuzzle() {
  yield takeLatest(FETCH_PUZZLE, fetchPuzzleRequest);
}

export function* rootSaga() {
  yield all([
    watchPuzzle()
  ])
}

export function reducer(state = {}, action) {
  switch (action.type) {

    case FETCH_PUZZLE_RECEIVE: {
      return {
        ...state,
        [action.name]: {
          data: action.response
        }
      }
    }

    default: {
      return state;
    }
  }
}
