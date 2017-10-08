import _ from 'lodash';

import { directions, across, down } from 'constants/clue';


const getStepSize = (direction, width) => {
  return direction === across ? 1 : width;
};

const gridRange = (clue, direction, width) => {
  const stepSize = getStepSize(direction, width);
  return _.range(clue.clueStart, clue.clueEnd + stepSize, stepSize);
};

export const cellNumberInClue = (cellNumber, clue, direction, width) => {
  if (direction === across) {
    return cellNumber <= clue.clueEnd && cellNumber >= clue.clueStart;
  }
  return (cellNumber - clue.clueStart) % width === 0;
};

export const initializePuzzle = (puzzleObject) => {
  const { layout, answers, clues } = puzzleObject.puzzle_data;
  const { width } = puzzleObject.puzzle_meta;
  const grid = layout.map((cell, index) => ({
    open: !!cell,
    answer: answers[index],
  }));

  const cluesByNumber = {
    [across]: {},
    [down]: {}
  };

  _.each(clues, (clueList, directionLetter) => {
    _.each(clueList, clue => {
      const cell = grid[clue.clueStart];
      cell.clueStart = clue.clueNum;

      const direction = directions[directionLetter];
      cluesByNumber[direction][clue.clueNum] = clue;

      gridRange(clue, direction, width).forEach(clueNum => {
        grid[clueNum].clueNum = clue.clueNum;
      })
    });
  });

  return {
    grid,
    width,
    clues: cluesByNumber,
    activeCellNumber: 0,
    activeDirection: across,
    activeClueNumber: 1,
  };
};
