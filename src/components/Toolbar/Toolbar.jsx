import React from 'react';
import { connect } from 'react-redux';

import { Dropdown } from 'components/Dropdown/Dropdown';
import { Timer } from 'components/Timer/Timer';
import { MenuButton } from 'components/Buttons/MenuButton';
import {WORD, PUZZLE, INCOMPLETE, SQUARE, PUZZLE_AND_TIMER} from 'constants/scopes';

import {
  clearOption,
  checkOption,
  revealOption,
} from 'reducers/puzzle';

import css from './Toolbar.scss';



class Toolbar extends React.Component {
  clearOptions = [
    [INCOMPLETE, INCOMPLETE],
    [WORD, WORD],
    [PUZZLE, PUZZLE],
    [PUZZLE_AND_TIMER, PUZZLE_AND_TIMER],
  ];

  revealOptions = [
    [SQUARE, SQUARE],
    [WORD, WORD],
    [PUZZLE, PUZZLE],
  ];

  checkOptions = [
    [SQUARE, SQUARE],
    [WORD, WORD],
    [PUZZLE, PUZZLE],
  ];

  resetPuzzle = () => {
    this.props.clearOption(PUZZLE_AND_TIMER);
    this.props.resetPuzzle();
  }

  render() {
    const { puzzleName, solved, pausePuzzle } = this.props;
    return (
      <div className={css.toolbarContainer}>
        <Timer puzzleName={puzzleName} pausePuzzle={pausePuzzle} />
        {solved ? (
          <div className={css.toolbarMenu}>
            <MenuButton onClick={this.resetPuzzle}>
              Reset
            </MenuButton>
          </div>
        ) : (
          <div className={css.toolbarMenu}>
            <Dropdown
              onClick={this.props.clearOption}
              options={this.clearOptions}
              title="Clear"
            />
            <Dropdown
              onClick={this.props.revealOption}
              options={this.revealOptions}
              title="Reveal"
            />
            <Dropdown
              onClick={this.props.checkOption}
              options={this.checkOptions}
              title="Check"
            />
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const puzzle = state.puzzle[ownProps.puzzleName] || {};

  return {
    solved: puzzle.solved,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    clearOption: puzzleName => option => dispatch(clearOption(puzzleName, option)),
    checkOption: puzzleName => option => dispatch(checkOption(puzzleName, option)),
    revealOption: puzzleName => option => dispatch(revealOption(puzzleName, option)),
  }
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { puzzleName } = ownProps;
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    clearOption: dispatchProps.clearOption(puzzleName),
    checkOption: dispatchProps.checkOption(puzzleName),
    revealOption: dispatchProps.revealOption(puzzleName),
  }
};

const connectedToolbar = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Toolbar);

export {
  connectedToolbar as Toolbar,
};
