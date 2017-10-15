import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { Clue } from 'components/Clue/Clue';


import css from './ClueList.scss';


class ClueList extends React.Component {
  render() {
    const {direction, clues, puzzleName} = this.props;

    return (
      <div className={css.clueListContainer}>
        <div className={css.directionName}>
          {direction}
        </div>
        <ol className={css.clueList}>
          {_.map(clues, (clue, clueNumberString) => {
            const clueNumber = Number(clueNumberString);
            return (
              <Clue
                key={clueNumber}
                puzzleName={puzzleName}
                clueNumber={clueNumber}
                direction={direction}
              />
            )
          })}
        </ol>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const {clues} = state.puzzle[ownProps.puzzleName] || {};
  const {direction} = ownProps;
  return {
    clues: clues[direction],
  }
};

const connectedClueList = connect(mapStateToProps)(ClueList);

export {
  connectedClueList as ClueList,
};
