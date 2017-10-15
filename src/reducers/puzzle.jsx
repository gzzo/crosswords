import { call, put, takeLatest, all } from 'redux-saga/effects';

import { puzzleFetcher } from 'utils/fetcher';
import {
  initializePuzzle,
  getGuessCellNumber,
  getMoveCellNumber,
  getMoveClueNumber,
  getRemoveGuessCellNumber,
  getOtherDirection,
  getClickClueNumber,
  getCheckCells,
  getRevealCells,
  getClearCells,
  isPuzzleSolved
} from 'utils/puzzle';
import {PUZZLE_AND_TIMER} from 'constants/scopes';
import { STATUS_404 } from 'utils/fetcher';


const FETCH_PUZZLE = 'puzzle/FETCH_PUZZLE';
const FETCH_PUZZLE_RECEIVE = 'puzzle/FETCH_PUZZLE_RECEIVE';

const GUESS_CELL = 'puzzle/GUESS_CELL';
const MOVE_ACTIVE_CELL = 'puzzle/MOVE_ACTIVE_CELL';
const MOVE_ACTIVE_CLUE = 'puzzle/MOVE_ACTIVE_CLUE';
const REMOVE_GUESS = 'puzzle/REMOVE_GUESS';
const CELL_CLICK = 'puzzle/CELL_CLICK';
const CLUE_CLICK = 'puzzle/CLUE_CLICK';
const REVEAL_OPTION = 'puzzle/REVEAL_OPTION';
const CHECK_OPTION = 'puzzle/CHECK_OPTION';
const CLEAR_OPTION = 'puzzle/CLEAR_OPTION';
const UPDATE_TIMER = 'puzzle/UPDATE_TIMER';


export function updateTimer(puzzleName) {
  return {
    type: UPDATE_TIMER,
    puzzleName,
  }
}

export function revealOption(puzzleName, option) {
  return {
    type: REVEAL_OPTION,
    puzzleName,
    option,
  }
}

export function checkOption(puzzleName, option) {
  return {
    type: CHECK_OPTION,
    puzzleName,
    option,
  }
}

export function clearOption(puzzleName, option) {
  return {
    type: CLEAR_OPTION,
    puzzleName,
    option,
  }
}

export function clueClick(puzzleName, direction, clueNumber) {
  return {
    type: CLUE_CLICK,
    puzzleName,
    direction,
    clueNumber,
  }
}

export function cellClick(puzzleName, cellNumber) {
  return {
    type: CELL_CLICK,
    puzzleName,
    cellNumber,
  }
}

export function removeGuess(puzzleName) {
  return {
    type: REMOVE_GUESS,
    puzzleName,
  }
}

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
      if (action.response === STATUS_404) {
        return {
          ...state,
          [action.puzzleName]: STATUS_404,
        }
      }

      const puzzleObject = action.response[0];
      return {
        ...state,
        [action.puzzleName]: {
          ...initializePuzzle(puzzleObject),
        },
      };
    }

    case GUESS_CELL: {
      const {cells, activeCellNumber, activeDirection, clues, width, filledCells, availableCells} = state[action.puzzleName];
      const activeCell = cells[activeCellNumber];
      const nextCellNumber = getGuessCellNumber(activeCellNumber, activeDirection,  cells, clues, width);

      let newCells = cells;
      let newFilledCells = filledCells;
      if (!activeCell.solved) {
        newCells = [
          ...cells.slice(0, activeCellNumber),
          {
            ...activeCell,
            guess: action.guess.toUpperCase(),
          },
          ...cells.slice(activeCellNumber + 1)
        ];
      }

      if (!activeCell.guess) {
        newFilledCells = filledCells + 1;
      }

      return {
        ...state,
        [action.puzzleName]: {
          ...state[action.puzzleName],
          cells: newCells,
          activeCellNumber: nextCellNumber,
          filledCells: newFilledCells,
          solved: newFilledCells === availableCells && isPuzzleSolved(cells),
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

    case REMOVE_GUESS: {
      const {cells, activeCellNumber, activeDirection, clues, width, filledCells} = state[action.puzzleName];
      const nextCellNumber = getRemoveGuessCellNumber(activeCellNumber, activeDirection,  cells, clues, width);
      const cellToRemove = cells[nextCellNumber];

      let newCells = cells;
      if (!cellToRemove.solved) {
        newCells = [
          ...cells.slice(0, nextCellNumber),
          {
            ...cellToRemove,
            guess: undefined,
          },
          ...cells.slice(nextCellNumber + 1)
        ];
      }

      return {
        ...state,
        [action.puzzleName]: {
          ...state[action.puzzleName],
          cells: newCells,
          activeCellNumber: nextCellNumber,
          filledCells: cellToRemove.solved ? filledCells : filledCells - 1,
        }
      }
    }

    case CELL_CLICK: {
      const {activeCellNumber, activeDirection} = state[action.puzzleName];
      const newDirection = action.cellNumber === activeCellNumber ? getOtherDirection(activeDirection) : activeDirection;
      return {
        ...state,
        [action.puzzleName]: {
          ...state[action.puzzleName],
          activeCellNumber: action.cellNumber,
          activeDirection: newDirection,
        }
      }
    }

    case CLUE_CLICK: {
      const {cells, clues, width} = state[action.puzzleName];
      const nextCellNumber = getClickClueNumber(cells, clues, width, action.direction, action.clueNumber);

      return {
        ...state,
        [action.puzzleName]: {
          ...state[action.puzzleName],
          activeDirection: action.direction,
          activeCellNumber: nextCellNumber,
        }
      }
    }

    case CHECK_OPTION: {
      const {cells, clues, activeCellNumber, activeDirection, width} = state[action.puzzleName];
      const newCells = getCheckCells(cells, clues, width, activeCellNumber, activeDirection, action.option);

      return {
        ...state,
        [action.puzzleName]: {
          ...state[action.puzzleName],
          cells: newCells,
        }
      }
    }

    case REVEAL_OPTION: {
      const {cells, clues, activeCellNumber, activeDirection, width, availableCells} = state[action.puzzleName];
      const newCells = getRevealCells(cells, clues, width, activeCellNumber, activeDirection, action.option);
      const newFilledCells = newCells.filter(cell => cell.guess).length;

      return {
        ...state,
        [action.puzzleName]: {
          ...state[action.puzzleName],
          cells: newCells,
          filledCells: newFilledCells,
          solved: newFilledCells === availableCells && isPuzzleSolved(cells),
        }
      }
    }

    case CLEAR_OPTION: {
      if (action.option === PUZZLE_AND_TIMER) {
        return {
          ...state,
          [action.puzzleName]: {
            ...initializePuzzle(state[action.puzzleName].raw),
          }
        }
      }

      const {cells, clues, activeCellNumber, activeDirection, width} = state[action.puzzleName];
      const newCells = getClearCells(cells, clues, width, activeCellNumber, activeDirection, action.option);

      return {
        ...state,
        [action.puzzleName]: {
          ...state[action.puzzleName],
          cells: newCells,
          filledCells: newCells.filter(cell => cell.guess).length,
        }
      }
    }

    case UPDATE_TIMER: {
      const {timer} = state[action.puzzleName];

      return {
        ...state,
        [action.puzzleName]: {
          ...state[action.puzzleName],
          timer: timer + 1,
        }
      }
    }

    default: {
      return state;
    }
  }
}
