import _ from 'lodash';

import { directions, across, down } from 'constants/clue';
import { CODE_ARROW_RIGHT, CODE_ARROW_LEFT, CODE_ARROW_DOWN, CODE_ARROW_UP } from 'constants/keys';


const getStepSize = (direction, width) => {
  return direction === across ? 1 : width;
};

const clueRange = (clue, direction, width) => {
  const stepSize = getStepSize(direction, width);
  return _.range(clue.clueStart, clue.clueEnd + stepSize, stepSize);
};

export const cellNumberInClue = (cellNumber, clue, direction, width) => {
  const inRange = cellNumber <= clue.clueEnd && cellNumber >= clue.clueStart;
  if (direction === across) {
    return inRange;
  }
  return inRange && (cellNumber - clue.clueStart) % width === 0;
};

export const getNextCellNumber = (activeCellNumber, activeDirection, cells, clues, width) => {
  const stepSize = getStepSize(activeDirection, width);
  const activeCell = cells[activeCellNumber];
  const activeClue = clues[activeDirection][activeCell.cellClues[activeDirection]];

  for (let i = activeCellNumber + stepSize; i <= activeClue.clueEnd; i += stepSize) {
    const candidateCell = cells[i];
    if (!candidateCell.guess) {
      return i;
    }
  }

  for (let i = activeClue.clueStart; i < activeCellNumber; i += stepSize) {
    const candidateCell = cells[i];
    if (!candidateCell.guess) {
      return i;
    }
  }

  return activeClue.clueEnd;
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

  _.each(clues, (clueList, directionLetter) => {
    _.each(clueList, clue => {
      const cell = cells[clue.clueStart];
      cell.clueStart = clue.clueNum;

      const direction = directions[directionLetter];
      cluesByNumber[direction][clue.clueNum] = clue;

      clueRange(clue, direction, width).forEach(clueNum => {
        cells[clueNum].cellClues[direction] = clue.clueNum;
      })
    });
  });

  return {
    cells,
    width,
    clues: cluesByNumber,
    activeCellNumber: 0,
    activeDirection: across,
  };
};
