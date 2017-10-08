import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import css from './ClueList.scss';


export class ClueList extends React.Component {
  render() {
    const {directionName, clues, activeDirection, activeClueNumber} = this.props;
    const isActive = activeDirection === directionName;
    console.log(activeDirection, activeClueNumber, directionName, isActive)

    return (
      <div className={css.clueListContainer}>
        <div className={css.directionName}>
          {directionName}
        </div>
        <ol className={css.clueList}>
          {_.map(clues, (clue, clueNumString) => {
            const clueNum = Number(clueNumString);
            const clueClasses = classNames(css.clue, {
              [css.clue_active]: clueNum === activeClueNumber && isActive,
              [css.clue_selected]: clueNum === activeClueNumber && !isActive,
            });

            console.log(typeof clueNum, typeof activeClueNumber)
            return (
              <li key={clueNum} className={clueClasses}>
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
