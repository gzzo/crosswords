import React from 'react';
import { connect } from 'react-redux';

import {abbreviatedDirections} from 'constants/clue';

import css from './ActiveClue.scss';


class ActiveClue extends React.Component {
  render() {
    const { activeDirection, activeCellNumber, cells, clues } = this.props;
    const activeCell = cells[activeCellNumber];
    const activeClue = clues[activeDirection][activeCell.cellClues[activeDirection]];
    const abbreviatedDirection = abbreviatedDirections[activeDirection];

    return (
      <div className={css.activeClueContainer}>
        <div className={css.clueNumber}>
          {`${activeClue.clueNum}${abbreviatedDirection}`}
        </div>
        <div className={css.clueValue}>
          {activeClue.value}
        </div>
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
};

const connectedActiveClue = connect(mapStateToProps)(ActiveClue);

export {
  connectedActiveClue as ActiveClue,
};
