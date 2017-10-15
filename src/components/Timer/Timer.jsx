import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { updateTimer } from 'reducers/puzzle';
import { openModal, closeModal } from 'reducers/modal';
import { Modal } from 'components/Modal/Modal';


import css from './Timer.scss';


class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interval: null,
    }
  }

  componentWillMount() {
    this.props.openModal('start');
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  pausePuzzle = () => {
    this.props.openModal('pause');
    clearInterval(this.state.interval);
    this.setState({
      interval: null,
    });
  }

  startPuzzle = () => {
    this.setState({
      interval: setInterval(this.props.updateTimer, 1000),
    }, () => this.props.closeModal());
  }

  render() {
    const {timer} = this.props;

    const seconds = timer % 60;
    const minutes = Math.floor(timer / 60) % 60;
    const hours = Math.floor(timer / 60 / 60) % 60;

    const hoursDisplay = hours ? `${hours}:` : '';

    const display = `${hoursDisplay}${minutes}:${_.padStart(seconds, 2, '0')}`;

    return (
      <div className={css.timerContainer}>
        <div className={css.timerContent} onClick={this.pausePuzzle}>
          <div>
            {display}
          </div>
          <i className={css.pauseIcon} />
        </div>
        <Modal type="start" activeModal={this.props.activeModal} style="absolute" onClick={this.startPuzzle} />
        <Modal type="pause" activeModal={this.props.activeModal} onOutsideClick={this.startPuzzle} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const puzzle = state.puzzle[ownProps.puzzleName] || {};
  return {
    timer: puzzle.timer,
    activeModal: state.modal.activeModal,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    updateTimer: puzzleName => () => dispatch(updateTimer(puzzleName)),
    openModal: modalName => dispatch(openModal(modalName)),
    closeModal: () => dispatch(closeModal()),
  }
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    updateTimer: dispatchProps.updateTimer(ownProps.puzzleName),
  }
}

const connectedTimer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Timer);

export {
  connectedTimer as Timer,
};
