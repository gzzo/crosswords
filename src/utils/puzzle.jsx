import _ from 'lodash';

import { directions, across, down } from 'constants/clue';
import { CODE_ARROW_RIGHT, CODE_ARROW_LEFT, CODE_ARROW_DOWN, CODE_ARROW_UP } from 'constants/keys';


const getOtherDirection = direction => {
  return direction === across ? down : across;
};

const getStepSize = (direction, width) => {
  return direction === across ? 1 : width;
};

const clueRange = (clue, direction, width) => {
  const stepSize = getStepSize(direction, width);
  return _.range(clue.clueStart, clue.clueEnd + stepSize, stepSize);
};

const getNextCellNumber = (start, end, cells, direction, width) => {
  const stepSize = getStepSize(direction, width);

  for (let i = start; i < end; i += stepSize) {
    const candidateCell = cells[i];
    if (!candidateCell.guess) {
      return i;
    }
  }
};

const getNextClueNumber = (cellNumber, direction, cells, clues, width, move) => {
  const activeCell = cells[cellNumber];
  const activeClue = clues[direction][activeCell.cellClues[direction]];

  const newClueNumber = move ? activeClue.nextClueNumber : activeClue.previousClueNumber;
  return clues[direction][newClueNumber];
};

const getNextClue = (cellNumber, direction, cells, clues, width, defaultClues, move) => {
  let newClue = getNextClueNumber(cellNumber, direction, cells, clues, width, move);
  let newDirection = direction;

  if (!newClue) {
    newDirection = getOtherDirection(newDirection);
    newClue = move ? defaultClues[newDirection].first : defaultClues[newDirection].last;
  }

  return {
    newClue,
    newDirection
  };
};

export const cellNumberInClue = (cellNumber, clue, direction, width) => {
  const inRange = cellNumber <= clue.clueEnd && cellNumber >= clue.clueStart;
  if (direction === across) {
    return inRange;
  }
  return inRange && (cellNumber - clue.clueStart) % width === 0;
};

export const getGuessCellNumber = (activeCellNumber, activeDirection, cells, clues, width) => {
  const stepSize = getStepSize(activeDirection, width);
  const activeCell = cells[activeCellNumber];
  const activeClue = clues[activeDirection][activeCell.cellClues[activeDirection]];

  const nextCellNumber = getNextCellNumber(activeCellNumber + stepSize, activeClue.clueEnd + 1, cells, activeDirection, width);
  if (nextCellNumber !== undefined) {
    return nextCellNumber;
  }

  const previousCellNumber = getNextCellNumber(activeClue.clueStart, activeCellNumber, cells, activeDirection, width);
  if (previousCellNumber !== undefined) {
    return previousCellNumber;
  }

  if (activeCellNumber === activeClue.clueEnd) {
    return activeCellNumber;
  }

  return activeCellNumber + stepSize;
};

export const getMoveClueNumber = (activeCellNumber, activeDirection, cells, clues, width, defaultClues, move) => {
  const numClues = _.keys(clues[across]).length + _.keys(clues[down]).length;

  // move to the next empty cell
  let {newClue, newDirection} = getNextClue(activeCellNumber, activeDirection, cells, clues, width, defaultClues, move);
  console.log(newClue)
  for (let i = 0; i < numClues - 1; i += 1) {
    const newCellNumber = getNextCellNumber(newClue.clueStart, newClue.clueEnd + 1, cells, newDirection, width);

    if (newCellNumber !== undefined) {
      return {
        newDirection,
        newCellNumber
      }
    }

    ({newClue, newDirection} = getNextClue(newClue.clueEnd, activeDirection, cells, clues, width, defaultClues, move));
  }

  // there are no empty cells, move to the next clue
  ({newClue, newDirection} = getNextClue(activeCellNumber, activeDirection, cells, clues, width, defaultClues, move));
  const newCellNumber = newClue.clueStart;

  return {
    newDirection: newDirection,
    newCellNumber: newCellNumber
  }
};

export const getMoveCellNumber = (activeCellNumber, activeDirection, cells, width, move) => {
  const lateralMovement = move === CODE_ARROW_LEFT || move === CODE_ARROW_RIGHT;
  const verticalMovement = move === CODE_ARROW_UP || move === CODE_ARROW_DOWN;

  if (activeDirection === across && verticalMovement) {
    return {
      newCellNumber: activeCellNumber,
      newDirection: down
    }
  } else if (activeDirection === down && lateralMovement) {
    return {
      newCellNumber: activeCellNumber,
      newDirection: across
    }
  }

  const positiveMovement = move === CODE_ARROW_DOWN || move === CODE_ARROW_RIGHT;
  const multiplier = positiveMovement ? 1 : -1;
  const multipliedStepSize = multiplier * getStepSize(activeDirection, width);

  const numModWidth = activeCellNumber % width;
  const startNumber = activeDirection === across ? activeCellNumber - numModWidth : numModWidth;
  const endNumber = activeDirection === across ? startNumber + width - 1 : startNumber + width * width - width;

  for (let i = activeCellNumber + multipliedStepSize; i >= startNumber && i <= endNumber; i += multipliedStepSize) {
    if (cells[i].open) {
      return {
        newDirection: activeDirection,
        newCellNumber: i
      }
    }
  }

  return {
    newDirection: activeDirection,
    newCellNumber: activeCellNumber
  }
};

export const initializePuzzle = (puzzleObject) => {
  const { layout, answers, clues } = puzzleObject.puzzle_data;
  const { width } = puzzleObject.puzzle_meta;
  const cells = layout.map((cell, index) => ({
    open: !!cell,
    answer: answers[index],
    cellClues: {},
  }));

  const cluesByNumber = {
    [across]: {},
    [down]: {}
  };

  const defaultClues = {
    [across]: {},
    [down]: {}
  };

  _.each(clues, (clueList, directionLetter) => {
    let previousClue;
    const direction = directions[directionLetter];

    _.each(clueList, clue => {
      const cell = cells[clue.clueStart];
      cell.clueStart = clue.clueNum;

      if (previousClue) {
        previousClue.nextClueNumber = clue.clueNum;
        clue.previousClueNumber = previousClue.clueNum;
      }

      cluesByNumber[direction][clue.clueNum] = clue;

      clueRange(clue, direction, width).forEach(clueNum => {
        cells[clueNum].cellClues[direction] = clue.clueNum;
      });

      previousClue = clue;
    });
    defaultClues[direction] = {
      first: clueList[0],
      last: clueList[clueList.length - 1]
    }
  });

  return {
    cells,
    width,
    defaultClues,
    clues: cluesByNumber,
    activeCellNumber: 0,
    activeDirection: across,
  };
};
