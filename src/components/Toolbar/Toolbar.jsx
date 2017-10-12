import React from 'react';

import {Dropdown} from 'components/Dropdown/Dropdown';
import {WORD, PUZZLE, INCOMPLETE, SQUARE, PUZZLE_AND_TIMER} from 'constants/scopes';

import css from './Toolbar.scss';



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

  render() {
    return (
      <div className={css.toolbarContainer}>
        <div>
          timer
        </div>
        <div className={css.toolbarMenu}>
          <Dropdown
            onClick={this.props.clearOption}
            options={this.clearOptions}
            title="Clear"
          />
          <Dropdown
            onClick={this.props.revealOption}
            options={this.revealOptions}
            title="Reveal"
          />
          <Dropdown
            onClick={this.props.checkOption}
            options={this.checkOptions}
            title="Check"
          />
        </div>
      </div>
    )
  }
}
