import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { Clue } from 'components/Clue/Clue';


import css from './ClueList.scss';


class ClueList extends React.Component {
  constructor(props) {
    super(props);
    this.clues = {};
  }

  componentDidUpdate() {
    if (this.list && this.props.activeClueNumber) {
      this.list.scrollTop = this.clues[this.props.activeClueNumber].offsetTop - this.list.offsetTop;
    }
  }

  render() {
    console.log(this.props)
    const {direction, clues, puzzleName} = this.props;

    return (
      <div className={css.clueListContainer}>
        <div className={css.directionName}>
          {direction}
        </div>
        <ol className={css.clueList} ref={list => { this.list = list}}>
          {_.map(clues, (clue, clueNumberString) => {
            const clueNumber = Number(clueNumberString);
            return (
              <Clue
                key={clueNumber}
                puzzleName={puzzleName}
                clueNumber={clueNumber}
                direction={direction}
                clueRef={clue => {this.clues[clueNumber] = clue}}
              />
            )
          })}
        </ol>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const {clues, activeCellNumber, cells} = state.puzzle[ownProps.puzzleName] || {};
  const {direction} = ownProps;
  if (state.modal.activeModal === 'start') {
    return {
      clues: clues[direction]
    };
  }

  const activeCell = cells[activeCellNumber];
  return {
    activeClueNumber: clues[direction][activeCell.cellClues[direction]].clueNumber,
    clues: clues[direction],
  }
};

const connectedClueList = connect(mapStateToProps)(ClueList);

export {
  connectedClueList as ClueList,
};
