import React from 'react';
import { connect } from 'react-redux';

import { Grid } from 'components/Grid/Grid';
import { ClueList } from 'components/ClueList/ClueList';
import { ActiveClue } from 'components/ActiveClue/ActiveClue';
import { Toolbar } from 'components/Toolbar/Toolbar';

import { across, down } from 'constants/clue';
import {
  CODE_ARROW_DOWN,
  CODE_ARROW_LEFT,
  CODE_BACKSPACE,
  CODE_LETTER_A,
  CODE_LETTER_Z,
  CODE_TAB
} from 'constants/keys';
import {
  fetchPuzzle,
  guessCell,
  moveActiveCell,
  moveActiveClue,
  removeGuess,
  cellClick,
  clueClick,
} from 'reducers/puzzle';
import { STATUS_404 } from 'utils/fetcher';

import css from './Puzzle.scss';


class Puzzle extends React.Component {
  componentWillMount() {
    this.props.fetchPuzzle();
    document.addEventListener("keydown", this.handleKeyDown);
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


    else if (keyCode === CODE_TAB) {
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
  }

  render() {
    const { puzzle, cellClick, clueClick } = this.props;
    if (!puzzle) {
      return <div>loading...</div>;
    }

    if (puzzle.data === STATUS_404) {
      return <div>not found...</div>;
    }

    const { clues, activeDirection, activeCellNumber, cells } = puzzle;
    const activeCell = cells[activeCellNumber];
    const activeClue = clues[activeDirection][activeCell.cellClues[activeDirection]];

    return (
      <div className={css.puzzleContainer}>
        <div className={css.headerContainer}>
          header
        </div>
        <Toolbar />
        <div className={css.gameContainer}>
          <div className={css.gridContainer}>
            <ActiveClue clue={activeClue} direction={activeDirection} />
            <Grid {...puzzle} cellClick={cellClick} />
          </div>
          <div className={css.cluesContainer}>
            <ClueList
              clues={clues}
              direction={across}
              activeDirection={activeDirection}
              activeCell={activeCell}
              clueClick={clueClick}
            />
            <ClueList
              clues={clues}
              direction={down}
              activeDirection={activeDirection}
              activeCell={activeCell}
              clueClick={clueClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  puzzle: state.puzzle[ownProps.match.params.puzzleName],
});

const mapDispatchToProps = dispatch => ({
  fetchPuzzle: puzzleName => () => dispatch(fetchPuzzle(puzzleName)),
  guessCell: puzzleName => guess => dispatch(guessCell(puzzleName, guess)),
  moveActiveCell: puzzleName => move => dispatch(moveActiveCell(puzzleName, move)),
  moveActiveClue: puzzleName => move => dispatch(moveActiveClue(puzzleName, move)),
  removeGuess: puzzleName => () => dispatch(removeGuess(puzzleName)),
  cellClick: puzzleName => cellNumber => () => dispatch(cellClick(puzzleName, cellNumber)),
  clueClick: puzzleName => (direction, clueNumber) => () => dispatch(clueClick(puzzleName, direction, clueNumber)),
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
    cellClick: dispatchProps.cellClick(puzzleName),
    clueClick: dispatchProps.clueClick(puzzleName),
  }
};

const connectedPuzzle = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Puzzle);

export {
  connectedPuzzle as Puzzle,
};
