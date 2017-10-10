import { call, put, takeLatest, all } from 'redux-saga/effects';

import { puzzleFetcher } from 'utils/fetcher';
import { initializePuzzle, getGuessCellNumber, getMoveCellNumber, getMoveClueNumber } from 'utils/puzzle';

const FETCH_PUZZLE = 'puzzle/FETCH_PUZZLE';
const FETCH_PUZZLE_RECEIVE = 'puzzle/FETCH_PUZZLE_RECEIVE';

const GUESS_CELL = 'puzzle/GUESS_CELL';
const MOVE_ACTIVE_CELL = 'puzzle/MOVE_ACTIVE_CELL';
const MOVE_ACTIVE_CLUE = 'puzzle/MOVE_ACTIVE_CLUE';


export function moveActiveClue(puzzleName, move) {
  return {
    type: MOVE_ACTIVE_CLUE,
    puzzleName,
    move
  }
}

export function moveActiveCell(puzzleName, move) {
  return {
    type: MOVE_ACTIVE_CELL,
    puzzleName,
    move
  }
}

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
      const {cells, activeCellNumber, activeDirection, clues, width} = state[action.puzzleName];
      const activeCell = cells[activeCellNumber];
      const nextCellNumber = getGuessCellNumber(activeCellNumber, activeDirection,  cells, clues, width);

      return {
        ...state,
        [action.puzzleName]: {
          ...state[action.puzzleName],
          cells: [
            ...cells.slice(0, activeCellNumber),
            {
              ...activeCell,
              guess: action.guess.toUpperCase(),
            },
            ...cells.slice(activeCellNumber + 1)
          ],
          activeCellNumber: nextCellNumber,
        }
      }
    }

    case MOVE_ACTIVE_CELL: {
      const {activeDirection, activeCellNumber, cells, width} = state[action.puzzleName];
      const {newDirection, newCellNumber} = getMoveCellNumber(activeCellNumber, activeDirection,
        cells, width, action.move);

      return {
        ...state,
        [action.puzzleName]: {
          ...state[action.puzzleName],
          activeDirection: newDirection,
          activeCellNumber: newCellNumber,
        }
      }
    }

    case MOVE_ACTIVE_CLUE: {
      const {activeDirection, activeCellNumber, cells, width, clues, defaultClues} = state[action.puzzleName];
      const {newDirection, newCellNumber} = getMoveClueNumber(activeCellNumber, activeDirection,
        cells, clues, width, defaultClues, action.move);

      return {
        ...state,
        [action.puzzleName]: {
          ...state[action.puzzleName],
          activeDirection: newDirection,
          activeCellNumber: newCellNumber,
        }
      }
    }

    default: {
      return state;
    }
  }
}
