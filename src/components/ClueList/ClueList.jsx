import React from 'react';
import _ from 'lodash';

import css from './ClueList.scss';


export class ClueList extends React.Component {
  render() {
    const {directionName, clues} = this.props;

    return (
      <div className={css.clueListContainer}>
        <div className={css.directionName}>
          {directionName}
        </div>
        <ol className={css.clueList}>
          {_.map(clues, (clue, clueNum) => (
            <li key={clueNum} className={css.clue} value={clue.clueNum}>
              {clue.value}
            </li>
          ))}
        </ol>
      </div>
    )
  }
}
