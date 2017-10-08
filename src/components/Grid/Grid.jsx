import React from 'react';
import _ from 'lodash';

import {Cell} from 'components/Cell/Cell';

import css from './Grid.scss';


export class Grid extends React.Component {
  render() {
    const { width, cells } = this.props;
    return (
      <div className={css.gridContainer}>
        <div className={css.gridContent}>
          <div className={css.gridInnerContent}>
            {_.range(width).map(rowNumber => (
              <div className={css.gridRow} key={rowNumber}>
                {_.range(width).map((colNumber) => {
                    const cellNumber = rowNumber * width + colNumber;
                    return (
                      <Cell key={cellNumber} {...cells[cellNumber]} />
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
