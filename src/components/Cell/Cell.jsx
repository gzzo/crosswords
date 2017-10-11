import React from 'react';
import classNames from 'classnames';

import css from './Cell.scss';


export class Cell extends React.Component {
  render() {
    const {open, active, selected} = this.props;
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
    });

    const tatterClasses = classNames(
      false && css.tatter
    );

    const guessClasses = classNames(css.guess, {
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
