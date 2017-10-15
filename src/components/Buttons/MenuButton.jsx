import React from 'react';
import classNames from 'classnames';

import css from './MenuButton.scss';


export class MenuButton extends React.Component {
  render() {
    const buttonClasses = classNames(css.button, this.props.className);

    return (
      <button className={buttonClasses} onClick={this.props.onClick}>
        {this.props.children}
      </button>
    )
  }
}
