import React from 'react';
import {connect} from 'react-redux';

import {fetchPuzzle} from 'reducers/puzzle';
import {STATUS_404} from 'utils/fetcher';


class Puzzle extends React.Component {
  componentWillMount() {
    const {puzzleName} = this.props.match.params;
    this.props.fetchPuzzle(puzzleName);
  }

  render() {
    if (!this.props.puzzle) {
      return <div>loading...</div>
    }

    if (this.props.puzzle.data === STATUS_404) {
      return <div>not found...</div>
    }

    return (
      <div>puzzle</div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    puzzle: state.puzzle[ownProps.match.params.puzzleName]
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPuzzle: (name) => dispatch(fetchPuzzle(name))
  }
};

const connectedPuzzle = connect(mapStateToProps, mapDispatchToProps)(Puzzle);

export {
  connectedPuzzle as Puzzle
}
