import _ from 'lodash';

import { directions, across, down } from 'constants/clue';


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

  _.each(clues, (clueList, direction) => {
    _.each(clueList, clue => {
      const cell = grid[clue.clueStart];
      cell.clueNum = clue.clueNum;

      cluesByNumber[directions[direction]][clue.clueNum] = clue;
    });
  });

  return {
    grid,
    width,
    clues: cluesByNumber,
  };
};
