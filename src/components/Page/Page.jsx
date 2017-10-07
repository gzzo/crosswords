import React from 'react';
import classNames from 'classnames';

import css from './Page.scss';


export class Page extends React.Component {
  render() {
    const pageClasses = classNames(css.page, this.props.className);

    return (
      <div className={pageClasses}>
        {this.props.children}
      </div>
    )
  }
}
