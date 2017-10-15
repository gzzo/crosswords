import React from 'react';
import { connect } from 'react-redux';

import { Dropdown } from 'components/Dropdown/Dropdown';
import { Timer } from 'components/Timer/Timer';
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

  render() {
    const { puzzleName } = this.props;
    return (
      <div className={css.toolbarContainer}>
        <Timer puzzleName={puzzleName} />
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
      </div>
    )
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

const connectedToolbar = connect(null, mapDispatchToProps, mergeProps)(Toolbar);

export {
  connectedToolbar as Toolbar,
};
