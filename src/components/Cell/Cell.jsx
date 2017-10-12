import React from 'react';
import classNames from 'classnames';

import css from './Cell.scss';


export class Cell extends React.Component {
  render() {
    const {open, active, selected, cheated, solved, revealed} = this.props;
    const closed = !open;

    const squareClasses = classNames(css.cell, {
      [css.cell_selected]: selected,
      [css.cell_active]: active,
      [css.cell_closed]: closed,
    });

    if (closed) {
      return <div className={squareClasses} />;
    }

    const cheatClasses = classNames({
      [css.cheat]: cheated,
      [css.revealed]: revealed,
    });

    const tatterClasses = classNames({
      [css.tatter]: revealed
    });

    const guessClasses = classNames(css.guess, {
      [css.solved]: solved,
    });


    return (
      <div className={squareClasses} onClick={this.props.onClick}>
        <div className={cheatClasses}>
          <div className={tatterClasses} />
        </div>
        <div className={css.number}>
          {this.props.clueStart}
        </div>
        <div className={guessClasses}>
          {this.props.guess}
        </div>
      </div>
    );
  }
}
