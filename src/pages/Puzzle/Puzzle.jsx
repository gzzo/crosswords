import React from 'react';
import { connect } from 'react-redux';

import { Grid } from 'components/Grid/Grid';
import { fetchPuzzle } from 'reducers/puzzle';
import { STATUS_404 } from 'utils/fetcher';

import css from './Puzzle.scss';


class Puzzle extends React.Component {
  componentWillMount() {
    const { puzzleName } = this.props.match.params;
    this.props.fetchPuzzle(puzzleName);
  }

  render() {
    const { puzzle } = this.props;
    if (!puzzle) {
      return <div>loading...</div>;
    }

    if (puzzle.data === STATUS_404) {
      return <div>not found...</div>;
    }

    return (
      <div>
        <div className={css.headerContainer}>
          header
        </div>
        <div className={css.gameContainer}>
          <div className={css.gridContainer}>
            <div className={css.currentClue}>current clue</div>
            <Grid {...puzzle.grid} />
          </div>
          <div className={css.cluesContainer}>
            clues
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  puzzle: state.puzzle[ownProps.match.params.puzzleName],
});

const mapDispatchToProps = dispatch => ({
  fetchPuzzle: name => dispatch(fetchPuzzle(name)),
});

const connectedPuzzle = connect(mapStateToProps, mapDispatchToProps)(Puzzle);

export {
  connectedPuzzle as Puzzle,
};
