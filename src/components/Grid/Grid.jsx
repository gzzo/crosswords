import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import {Cell} from 'components/Cell/Cell';


import css from './Grid.scss';


class Grid extends React.Component {
  render() {
    const {width, puzzleName} = this.props;

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
                        cellNumber={cellNumber}
                        puzzleName={puzzleName}
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
  const {width} = state.puzzle[ownProps.puzzleName] || {};
  return {
    width,
  }
};

const connectedGrid = connect(mapStateToProps)(Grid);

export {
  connectedGrid as Grid,
}
