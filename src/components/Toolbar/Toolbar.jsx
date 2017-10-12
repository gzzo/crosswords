import React from 'react';

import {Dropdown} from 'components/Dropdown/Dropdown';

import css from './Toolbar.scss';

const INCOMPLETE = 'Incomplete';
const SQUARE = 'Square';
const WORD = 'Word';
const PUZZLE = 'Puzzle';
const PUZZLE_AND_TIMER = 'Puzzle & Timer';


export class Toolbar extends React.Component {
  clearOptions = [
    [INCOMPLETE, INCOMPLETE],
    [WORD, WORD],
    [PUZZLE, PUZZLE],
    [PUZZLE_AND_TIMER, PUZZLE_AND_TIMER],
  ];

  revealOptions = [
    [SQUARE, SQUARE],
    [WORD, WORD],
    [PUZZLE, PUZZLE],
  ];

  checkOptions = [
    [SQUARE, SQUARE],
    [WORD, WORD],
    [PUZZLE, PUZZLE],
  ];

  onClearClick = (option) => {

  }

  onRevealClick = (option) => {

  }

  onCheckClick = (option) => {

  }

  render() {
    return (
      <div className={css.toolbarContainer}>
        <div>
          timer
        </div>
        <div className={css.toolbarMenu}>
          <Dropdown
            onClick={this.onClearClick}
            options={this.clearOptions}
            title="Clear"
          />
          <Dropdown
            onClick={this.onRevealClick}
            options={this.revealOptions}
            title="Reveal"
          />
          <Dropdown
            onClick={this.onCheckClick}
            options={this.checkOptions}
            title="Check"
          />
        </div>
      </div>
    )
  }
}
