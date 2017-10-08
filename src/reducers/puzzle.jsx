import { call, put, takeLatest, all } from 'redux-saga/effects';

import { puzzleFetcher } from 'utils/fetcher';
import { initializePuzzle } from 'utils/puzzle';

const FETCH_PUZZLE = 'puzzle/FETCH_PUZZLE';
const FETCH_PUZZLE_RECEIVE = 'puzzle/FETCH_PUZZLE_RECEIVE';

const GUESS_CELL = 'puzzle/GUESS_CELL';


export function guessCell(puzzleName, guess) {
  return {
    type: GUESS_CELL,
    puzzleName,
    guess
  }
}

export function fetchPuzzle(puzzleName) {
  return {
    type: FETCH_PUZZLE,
    puzzleName,
  };
}
{}
function fetchPuzzleReceive(puzzleName, response) {
  return {
    type: FETCH_PUZZLE_RECEIVE,
    puzzleName,
    response,
  };
}

function* fetchPuzzleRequest(action) {
  const response = yield call(puzzleFetcher, `/puzzles/${action.puzzleName}.json`);
  yield put(fetchPuzzleReceive(action.puzzleName, response));
}

function* watchPuzzle() {
  yield takeLatest(FETCH_PUZZLE, fetchPuzzleRequest);
}

export function* rootSaga() {
  yield all([
    watchPuzzle(),
  ]);
}

export function reducer(state = {}, action) {
  switch (action.type) {
    case FETCH_PUZZLE_RECEIVE: {
      const puzzleObject = action.response[0];
      return {
        ...state,
        [action.puzzleName]: {
          ...initializePuzzle(puzzleObject),
        },
      };
    }

    case GUESS_CELL: {
      const {grid, activeCellNumber} = state[action.puzzleName];
      const activeCell = grid[activeCellNumber];
      return {
        ...state,
        [action.puzzleName]: {
          ...state[action.puzzleName],
          grid: [
            ...grid.slice(0, activeCellNumber),
            {
              ...activeCell,
              guess: action.guess.toUpperCase(),
            },
            ...grid.slice(activeCellNumber + 1)
          ]
        }
      }
    }

    default: {
      return state;
    }
  }
}
