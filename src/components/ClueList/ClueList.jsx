import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { clueClick } from 'reducers/puzzle';

import css from './ClueList.scss';


class ClueList extends React.Component {
  render() {
    const {direction, clues, activeDirection, activeCellNumber, clueClick, cells} = this.props;
    const activeCell = cells[activeCellNumber];
    const isActive = activeDirection === direction;
    const activeClue = clues[direction][activeCell.cellClues[direction]];

    return (
      <div className={css.clueListContainer}>
        <div className={css.directionName}>
          {direction}
        </div>
        <ol className={css.clueList}>
          {_.map(clues[direction], (clue, clueNumString) => {
            const clueNum = Number(clueNumString);
            const clueClasses = classNames(css.clue, {
              [css.clue_active]: clueNum === activeClue.clueNum && isActive,
              [css.clue_selected]: clueNum === activeClue.clueNum && !isActive,
            });

            return (
              <li key={clueNum} className={clueClasses} onClick={clueClick(direction, clue.clueNum)}>
                <span className={css.clueNumber}>{clue.clueNum}</span>
                <span className={css.clueValue}>{clue.value}</span>
              </li>
            );
          })}
        </ol>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const {activeCellNumber, activeDirection, cells, clues} = state.puzzle[ownProps.puzzleName] || {};
  return {
    activeCellNumber,
    activeDirection,
    cells,
    clues,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    clueClick: puzzleName => (direction, clueNumber) => () => dispatch(clueClick(puzzleName, direction, clueNumber)),
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    clueClick: dispatchProps.clueClick(ownProps.puzzleName),
  }
};

const connectedClueList = connect(mapStateToProps, mapDispatchToProps, mergeProps)(ClueList);

export {
  connectedClueList as ClueList,
};
