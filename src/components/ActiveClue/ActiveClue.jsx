import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {abbreviatedDirections} from 'constants/clue';

import css from './ActiveClue.scss';


class ActiveClue extends React.Component {
  render() {
    const { activeDirection, activeCellNumber, cells, clues, obscured } = this.props;
    const activeCell = cells[activeCellNumber];
    const activeClue = clues[activeDirection][activeCell.cellClues[activeDirection]];
    const abbreviatedDirection = abbreviatedDirections[activeDirection];

    const containerClasses = classNames(css.activeClueContainer, {
      [css.activeClueContainer_obscured]: obscured
    });

    if (obscured) {
      return <div className={containerClasses} />
    }

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
    obscured: state.modal.activeModal === 'start',
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
