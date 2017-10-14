import React from 'react';
import _ from 'lodash';

import css from './Timer.scss';


export class Timer extends React.Component {
  render() {
    const {timer} = this.props;

    const seconds = timer % 60;
    const minutes = Math.floor(timer / 60) % 60;
    const hours = Math.floor(timer / 60 / 60) % 60;

    const hoursDisplay = hours ? `${hours}:` : '';

    const display = `${hoursDisplay}${minutes}:${_.padStart(seconds, 2, '0')}`;

    return (
      <div className={css.timerContainer}>
        <div className={css.timerContent} onClick={this.props.pausePuzzle}>
          <div>
            {display}
          </div>
          <i className={css.pauseIcon} />
        </div>
      </div>
    )
  }
}
