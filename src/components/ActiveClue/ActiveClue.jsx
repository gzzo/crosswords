import React from 'react';

import {abbreviatedDirections} from 'constants/clue';

import css from './ActiveClue.scss';


export class ActiveClue extends React.Component {
  render() {
    const {clue, direction} = this.props;
    const abbreviatedDirection = abbreviatedDirections[direction];

    return (
      <div className={css.activeClueContainer}>
        <div className={css.clueNumber}>
          {`${clue.clueNum}${abbreviatedDirection}`}
        </div>
        <div className={css.clueValue}>
          {clue.value}
        </div>
      </div>
    )
  }
}
