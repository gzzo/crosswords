import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import {cellNumberInClue} from 'utils/puzzle';
import { cellClick } from 'reducers/puzzle';

import css from './Cell.scss';


class Cell extends React.Component {
  render() {
    const {open, cheated, solved, revealed, active, selected} = this.props;
    const closed = !open;

    const squareClasses = classNames(css.cell, {
      [css.cell_selected]: selected,
      [css.cell_active]: active,
      [css.cell_closed]: closed,
    });

    if (closed) {
      return <div className={squareClasses} />;
    }

    const cheatClasses = classNames({
      [css.cheat]: cheated,
      [css.revealed]: revealed,
    });

    const tatterClasses = classNames({
      [css.tatter]: revealed
    });

    const guessClasses = classNames(css.guess, {
      [css.solved]: solved,
    });


    return (
      <div className={squareClasses} onClick={this.props.cellClick}>
        <div className={cheatClasses}>
          <div className={tatterClasses} />
        </div>
        <div className={css.number}>
          {this.props.clueStart}
        </div>
        <div className={guessClasses}>
          {this.props.guess}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {cells, activeDirection, clues, activeCellNumber, width} = state.puzzle[ownProps.puzzleName] || {};
  if (state.modal.activeModal === 'start') {
    return {
      ...cells[ownProps.cellNumber],
    };
  }

  const activeCell = cells[activeCellNumber];
  const activeClue = clues[activeDirection][activeCell.cellClues[activeDirection]];
  return {
    active: activeCellNumber === ownProps.cellNumber,
    selected: cellNumberInClue(ownProps.cellNumber, activeClue, activeDirection, width),
    ...cells[ownProps.cellNumber],
  }
};

const mapDispatchToProps = dispatch => {
  return {
    cellClick: (puzzleName, cellNumber) => () => dispatch(cellClick(puzzleName, cellNumber)),
  }
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    cellClick: dispatchProps.cellClick(ownProps.puzzleName, ownProps.cellNumber),
  }
}

const connectedCell = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Cell);

export {
  connectedCell as Cell,
}
