import React from 'react';
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
  startTimer,
  stopTimer,
} from 'reducers/puzzle';
import { openModal, closeModal } from 'reducers/modal';
import { STATUS_404 } from 'utils/fetcher';

import css from './Puzzle.scss';


class Puzzle extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchPuzzle();
    this.props.openModal('start');
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    this.pausePuzzle()
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  componentDidUpdate(prevProps) {
    if (this.props.solved && !prevProps.solved) {
      this.pausePuzzle();
      this.props.openModal('done');
    } else if (this.props.filled && !prevProps.filled) {
      this.pausePuzzle();
      this.props.openModal('incorrect');
    }
  }

  openPauseModal = () => {
    this.pausePuzzle();
    this.props.openModal('pause');
  }

  pausePuzzle = () => {
    this.props.stopTimer();
  }

  startPuzzle = () => {
    this.props.startTimer();
    this.props.closeModal();
  }

  finishPuzzle = () => {
    this.props.closeModal();
  }

  resetPuzzle = () => {
    this.props.startTimer();
  }

  handleKeyDown = (evt) => {
    if (evt.ctrlKey || evt.altKey || evt.metaKey) {
      return
    }

    const {keyCode} = evt;

    if (this.props.activeModal) {
      return;
    }

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
    const { puzzleIs404, puzzleIsLoading, puzzleName } = this.props;
    if (puzzleIsLoading) {
      return null;
    }

    if (puzzleIs404) {
      return <div>not found...</div>;
    }

    return (
      <div>
        <div className={css.puzzleContainer}>
          <Header puzzleName={puzzleName} />
          <div className={css.gameContainer}>
            <Toolbar puzzleName={puzzleName} openPauseModal={this.openPauseModal} resetPuzzle={this.resetPuzzle} />
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
        <Modal type="start" activeModal={this.props.activeModal} style="absolute" closeModal={this.startPuzzle} />
        <Modal type="pause" activeModal={this.props.activeModal} closeModal={this.startPuzzle} overlayClick />
        <Modal type="done" activeModal={this.props.activeModal} closeModal={this.finishPuzzle} puzzleName={puzzleName} overlayClick />
        <Modal type="incorrect" activeModal={this.props.activeModal} closeModal={this.startPuzzle} overlayClick />
      </div>
    );
  }
}

const getFullPuzzleName = (category, name) => {
  return `${category}/${name}`
}

const mapStateToProps = (state, ownProps) => {
  const { puzzleCategory, puzzleName } = ownProps.match.params;
  const fullPuzzleName = getFullPuzzleName(puzzleCategory, puzzleName)
  const puzzle =  state.puzzle[fullPuzzleName];
  const puzzleIsLoading = !puzzle;
  const puzzleIs404 = puzzle === STATUS_404;
  return {
    puzzleIs404,
    puzzleIsLoading,
    puzzleName: fullPuzzleName,
    solved: puzzle && puzzle.solved,
    filled: puzzle && (puzzle.availableCells === puzzle.filledCells),
    activeModal: state.modal.activeModal,
  }
};

const mapDispatchToProps = dispatch => ({
  fetchPuzzle: puzzleName => () => dispatch(fetchPuzzle(puzzleName)),
  guessCell: puzzleName => guess => dispatch(guessCell(puzzleName, guess)),
  moveActiveCell: puzzleName => move => dispatch(moveActiveCell(puzzleName, move)),
  moveActiveClue: puzzleName => move => dispatch(moveActiveClue(puzzleName, move)),
  removeGuess: puzzleName => () => dispatch(removeGuess(puzzleName)),
  openModal: modalName => dispatch(openModal(modalName)),
  closeModal: () => dispatch(closeModal()),
  startTimer: puzzleName => () => dispatch(startTimer(puzzleName)),
  stopTimer: puzzleName => () => dispatch(stopTimer(puzzleName)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { puzzleCategory, puzzleName } = ownProps.match.params;
  const fullPuzzleName = getFullPuzzleName(puzzleCategory, puzzleName)
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    guessCell: dispatchProps.guessCell(fullPuzzleName),
    fetchPuzzle: dispatchProps.fetchPuzzle(fullPuzzleName),
    moveActiveCell: dispatchProps.moveActiveCell(fullPuzzleName),
    moveActiveClue: dispatchProps.moveActiveClue(fullPuzzleName),
    removeGuess: dispatchProps.removeGuess(fullPuzzleName),
    startTimer: dispatchProps.startTimer(fullPuzzleName),
    stopTimer: dispatchProps.stopTimer(fullPuzzleName),
  }
};

const connectedPuzzle = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Puzzle);

export {
  connectedPuzzle as Puzzle,
};
