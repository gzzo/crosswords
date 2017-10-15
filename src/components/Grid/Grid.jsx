import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import {Cell} from 'components/Cell/Cell';
import {cellNumberInClue} from 'utils/puzzle';

import { cellClick } from 'reducers/puzzle';

import css from './Grid.scss';


class Grid extends React.Component {
  render() {
    const {width, cells, clues, activeCellNumber, activeDirection, cellClick} = this.props;
    const activeCell = cells[activeCellNumber];
    const activeClue = clues[activeDirection][activeCell.cellClues[activeDirection]];

    console.log('render grid')

    return (
      <div className={css.gridContainer}>
        <div className={css.gridContent}>
          <div className={css.gridInnerContent}>
            {_.range(width).map(rowNumber => (
              <div className={css.gridRow} key={rowNumber}>
                {_.range(width).map((colNumber) => {
                    const cellNumber = rowNumber * width + colNumber;
                    return (
                      <Cell
                        key={cellNumber}
                        active={activeCellNumber === cellNumber}
                        selected={cellNumberInClue(cellNumber, activeClue, activeDirection, width)}
                        onClick={cellClick(cellNumber)}
                        {...cells[cellNumber]}
                      />
                    );
                  })}
              </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {width, cells, clues, activeCellNumber, activeDirection} = state.puzzle[ownProps.puzzleName] || {};
  return {
    width,
    cells,
    clues,
    activeCellNumber,
    activeDirection
  }
};

const mapDispatchToProps = dispatch => {
  return {
    cellClick: puzzleName => cellNumber => () => dispatch(cellClick(puzzleName, cellNumber)),
  }
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    cellClick: dispatchProps.cellClick(ownProps.puzzleName),
  }
}

const connectedGrid = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Grid);

export {
  connectedGrid as Grid,
}
