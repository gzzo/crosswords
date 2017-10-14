import React from 'react';
import moment from 'moment';

import css from './Header.scss';


export class Header extends React.Component {
  render() {
    const {printDate, title, author, editor} = this.props;
    const date = moment(printDate);

    return (
      <div className={css.headerContainer}>
        <div className={css.title}>
          <span className={css.dayName}>
            {date.format('dddd')}{' '}
          </span>
          {date.format('LL')}
        </div>
        <div className={css.subtitle}>
          <span>
            "{title}"
          </span>
          <span className={css.subtitleItem}>
            By {author}
          </span>
          <span className={css.subtitleItem}>
            Edited by {editor}
          </span>
        </div>
      </div>
    );
  }
}
