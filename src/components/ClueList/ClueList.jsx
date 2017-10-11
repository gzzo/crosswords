import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import css from './ClueList.scss';


export class ClueList extends React.Component {
  render() {
    const {direction, clues, activeDirection, activeCell, clueClick} = this.props;
    const isActive = activeDirection === direction;
    const activeClue = clues[direction][activeCell.cellClues[direction]];

    return (
      <div className={css.clueListContainer}>
        <div className={css.directionName}>
          {direction}
        </div>
        <ol className={css.clueList}>
          {_.map(clues[direction], (clue, clueNumString) => {
            const clueNum = Number(clueNumString);
            const clueClasses = classNames(css.clue, {
              [css.clue_active]: clueNum === activeClue.clueNum && isActive,
              [css.clue_selected]: clueNum === activeClue.clueNum && !isActive,
            });

            return (
              <li key={clueNum} className={clueClasses} onClick={clueClick(direction, clue.clueNum)}>
                <span className={css.clueNumber}>{clue.clueNum}</span>
                <span className={css.clueValue}>{clue.value}</span>
              </li>
            );
          })}
        </ol>
      </div>
    )
  }
}
