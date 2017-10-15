import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { Grid } from 'components/Grid/Grid';
import { ClueList } from 'components/ClueList/ClueList';
import { ActiveClue } from 'components/ActiveClue/ActiveClue';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { Header } from 'components/Header/Header';
import { Modal } from 'components/Modal/Modal';

import { across, down } from 'constants/clue';
import {
  CODE_ARROW_DOWN,
  CODE_ARROW_LEFT,
  CODE_BACKSPACE,
  CODE_LETTER_A,
  CODE_LETTER_Z,
  CODE_TAB,
  CODE_ENTER,
} from 'constants/keys';
import {
  fetchPuzzle,
  guessCell,
  moveActiveCell,
  moveActiveClue,
  removeGuess,
} from 'reducers/puzzle';
import { updateTimer } from 'reducers/puzzle';
import { openModal, closeModal } from 'reducers/modal';
import { STATUS_404 } from 'utils/fetcher';

import css from './Puzzle.scss';


class Puzzle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interval: null,
    }
  }

  componentWillMount() {
    this.props.fetchPuzzle();
    this.props.openModal('start');
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.solved && !this.props.solved) {
      this.props.openModal('done');
      clearInterval(this.state.interval);
      this.setState({
        interval: null,
      });
    }
  }

  pausePuzzle = () => {
    document.removeEventListener("keydown", this.handleKeyDown);
    this.props.openModal('pause');
    clearInterval(this.state.interval);
    this.setState({
      interval: null,
    });
  }

  startPuzzle = () => {
    document.addEventListener("keydown", this.handleKeyDown);
    this.setState({
      interval: setInterval(this.props.updateTimer, 1000),
    }, () => this.props.closeModal());
  }

  finishPuzzle = () => {
    document.addEventListener("keydown", this.handleKeyDown);
    this.props.closeModal();
  }

  resetPuzzle = () => {
    this.setState({
      interval: setInterval(this.props.updateTimer, 1000),
    });
  }

  handleKeyDown = (evt) => {
    if (evt.ctrlKey || evt.altKey || evt.metaKey) {
      return
    }

    const {keyCode} = evt;

    if (keyCode >= CODE_ARROW_LEFT && keyCode <= CODE_ARROW_DOWN) {
      evt.preventDefault();
      this.props.moveActiveCell(evt.keyCode);
    }

    else if (keyCode === CODE_TAB || keyCode === CODE_ENTER) {
      evt.preventDefault();

      if (evt.shiftKey) {
        this.props.moveActiveClue(false);
      } else {
        this.props.moveActiveClue(true);
      }
    }

    else if (keyCode >= CODE_LETTER_A && keyCode <= CODE_LETTER_Z) {
      this.props.guessCell(evt.key);
    }

    else if (keyCode === CODE_BACKSPACE) {
      evt.preventDefault();
      this.props.removeGuess();
    }
  };

  render() {
    const { puzzleIs404, puzzleIsLoading } = this.props;
    if (puzzleIsLoading) {
      return <div>loading...</div>;
    }

    if (puzzleIs404) {
      return <div>not found...</div>;
    }

    const { puzzleName } = this.props.match.params;

    return (
      <div className={css.app}>
        <div className={css.puzzleContainer}>
          <Header puzzleName={puzzleName} />
          <div className={css.gameContainer}>
            <Toolbar puzzleName={puzzleName} pausePuzzle={this.pausePuzzle} resetPuzzle={this.resetPuzzle} />
            <div className={css.playArea}>
              <div className={css.gridContainer}>
                <ActiveClue puzzleName={puzzleName} />
                <Grid puzzleName={puzzleName} />
              </div>
              <div className={css.cluesContainer}>
                <ClueList direction={across} puzzleName={puzzleName} />
                <ClueList direction={down} puzzleName={puzzleName} />
              </div>
            </div>
          </div>
        </div>
        <Modal type="start" activeModal={this.props.activeModal} style="absolute" onClick={this.startPuzzle} />
        <Modal type="pause" activeModal={this.props.activeModal} onOutsideClick={this.startPuzzle} />
        <Modal type="done" activeModal={this.props.activeModal} onOutsideClick={this.finishPuzzle} puzzleName={puzzleName} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const puzzle =  state.puzzle[ownProps.match.params.puzzleName];
  const puzzleIsLoading = !puzzle;
  const puzzleIs404 = puzzle === STATUS_404;
  return {
    puzzleIs404,
    puzzleIsLoading,
    solved: puzzle && puzzle.solved,
    activeModal: state.modal.activeModal,
  }
};

const mapDispatchToProps = dispatch => ({
  fetchPuzzle: puzzleName => () => dispatch(fetchPuzzle(puzzleName)),
  guessCell: puzzleName => guess => dispatch(guessCell(puzzleName, guess)),
  moveActiveCell: puzzleName => move => dispatch(moveActiveCell(puzzleName, move)),
  moveActiveClue: puzzleName => move => dispatch(moveActiveClue(puzzleName, move)),
  removeGuess: puzzleName => () => dispatch(removeGuess(puzzleName)),
  updateTimer: puzzleName => () => dispatch(updateTimer(puzzleName)),
  openModal: modalName => dispatch(openModal(modalName)),
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { puzzleName } = ownProps.match.params;
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    guessCell: dispatchProps.guessCell(puzzleName),
    fetchPuzzle: dispatchProps.fetchPuzzle(puzzleName),
    moveActiveCell: dispatchProps.moveActiveCell(puzzleName),
    moveActiveClue: dispatchProps.moveActiveClue(puzzleName),
    removeGuess: dispatchProps.removeGuess(puzzleName),
    updateTimer: dispatchProps.updateTimer(puzzleName),
  }
};

const connectedPuzzle = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Puzzle);

export {
  connectedPuzzle as Puzzle,
};
