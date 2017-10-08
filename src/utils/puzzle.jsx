export const generateGrid = (puzzleObject) => {
  const { layout, answers } = puzzleObject.puzzle_data;
  const { width } = puzzleObject.puzzle_meta;
  const cells = layout.map((cell, index) => ({
    open: !!cell,
    answer: answers[index],
  }));

  return {
    cells,
    width,
  };
};
