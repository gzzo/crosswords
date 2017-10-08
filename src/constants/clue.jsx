import _ from 'lodash';

export const across = 'across';
export const down = 'down';

export const directions = {
  A: across,
  D: down
};

export const abbreviatedDirections = _.invert(directions);
