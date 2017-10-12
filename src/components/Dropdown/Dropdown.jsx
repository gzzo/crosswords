import React from 'react';
import classNames from 'classnames';

import css from './Dropdown.scss';


export class Dropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    }
  }

  toggleOpen = (evt) => {
    document.removeEventListener('click', this.toggleOpen);

    this.setState(prevState => ({
      open: !prevState.open,
    }), () => {
      this.state.open && document.addEventListener('click', this.toggleOpen);
    });
  }

  onClick = (optionKey) => () => {
    this.props.onClick(optionKey);
  }

  render() {
    const dropdownTitleClasses = classNames(css.dropdownTitle, this.props.className, {
      [css.dropdownTitle_open]: this.state.open
    });

    const dropdownContentClasses = classNames(css.dropdownContent, {
      [css.dropdownContent_open]: this.state.open,
    });

    return (
      <div className={css.dropdownContainer}>
        <button className={dropdownTitleClasses} onClick={this.toggleOpen}>
          {this.props.title}
        </button>
        <ul className={dropdownContentClasses}>
          {this.props.options.map(option => {
            const [optionKey, optionValue] = option;

            return (
              <li className={css.dropdownItem} key={optionKey} onClick={this.onClick(optionKey)}>
                {optionValue}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
