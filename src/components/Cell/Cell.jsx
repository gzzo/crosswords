import React from 'react';
import classNames from 'classnames';

import css from './Cell.scss';


export class Cell extends React.Component {
  render() {
    const squareClasses = classNames(css.cell, {
      [css.cell_closed]: !this.props.open
    });

    if (!this.props.open) {
      return <div className={squareClasses} />;
    }

    const cheatClasses = classNames({
    });

    const tatterClasses = classNames(
      false && css.tatter
    )

    const guessClasses = classNames(css.guess, {
    });


    return (
      <div className={squareClasses}>
        <div className={cheatClasses}>
          <div className={tatterClasses} />
        </div>
        <div className={css.number}>

        </div>
        <div className={guessClasses}>
          {this.props.answer}
        </div>
      </div>
    );
  }
}
