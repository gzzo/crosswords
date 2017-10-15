import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { connect } from 'react-redux';


import css from './Timer.scss';


class Timer extends React.Component {
  render() {
    const {timer, paused} = this.props;

    const seconds = timer % 60;
    const minutes = Math.floor(timer / 60) % 60;
    const hours = Math.floor(timer / 60 / 60) % 60;
    const hoursDisplay = hours ? `${hours}:` : '';
    const display = `${hoursDisplay}${minutes}:${_.padStart(seconds, 2, '0')}`;

    const timerContentClasses = classNames(css.timerContent, {
      [css.timerContent_paused]: paused,
    });

    return (
      <div className={css.timerContainer}>
        {paused ? (
          <div className={timerContentClasses}>
            {display}
          </div>
        ) : (
          <div className={css.timerContent} onClick={this.props.pausePuzzle}>
            <div>
              {display}
            </div>
            <i className={css.pauseIcon} />
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const puzzle = state.puzzle[ownProps.puzzleName] || {};
  return {
    timer: puzzle.timer,
    paused: state.modal.activeModal === 'pause' || puzzle.solved,
  }
};

const connectedTimer = connect(mapStateToProps)(Timer);

export {
  connectedTimer as Timer,
};
