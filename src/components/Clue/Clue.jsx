import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { clueClick } from 'reducers/puzzle';

import css from './Clue.scss';


class Clue extends React.Component {
  render() {
    const {isActiveClue, isActiveDirection, clue} = this.props;

    const clueClasses = classNames(css.clue, {
      [css.clue_active]: isActiveClue && isActiveDirection,
      [css.clue_selected]: isActiveClue && !isActiveDirection,
    });

    return (
      <li className={clueClasses} onClick={this.props.clueClick}>
        <span className={css.clueNumber}>{clue.clueNumber}</span>
        <span className={css.clueValue}>{clue.value}</span>
      </li>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {activeCellNumber, activeDirection, cells, clues} = state.puzzle[ownProps.puzzleName] || {};
  const {clueNumber, direction} = ownProps;
  const activeCell = cells[activeCellNumber];
  const activeClueNumber = activeCell.cellClues[activeDirection];
  return {
    isActiveClue: activeClueNumber === clueNumber,
    isActiveDirection: activeDirection === direction,
    clue: clues[direction][clueNumber]
  }
};

const mapDispatchToProps = dispatch => {
  return {
    clueClick: (puzzleName, direction, clueNumber) => () => dispatch(clueClick(puzzleName, direction, clueNumber)),
  }
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    clueClick: dispatchProps.clueClick(ownProps.puzzleName, ownProps.direction, ownProps.clueNumber),
  }
};

const connectedClue = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Clue);

export {
  connectedClue as Clue,
};
