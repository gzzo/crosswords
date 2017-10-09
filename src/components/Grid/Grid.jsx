import React from 'react';
import _ from 'lodash';

import {Cell} from 'components/Cell/Cell';
import {cellNumberInClue} from 'utils/puzzle';

import css from './Grid.scss';


export class Grid extends React.Component {
  render() {
    const { width, grid, clues, activeCellNumber, activeDirection} = this.props;
    const activeCell = grid[activeCellNumber];
    const activeClue = clues[activeDirection][activeCell.cellClues[activeDirection]];

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
                        {...grid[cellNumber]}
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
