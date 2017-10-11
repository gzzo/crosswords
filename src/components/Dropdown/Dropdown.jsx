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
    evt.stopPropagation();
    window.removeEventListener('click', this.toggleOpen);

    this.setState({
      open: !this.state.open,
    }, () => {
      window.addEventListener('click', this.toggleOpen);
    });
  }

  render() {
    const dropdownContentClasses = classNames(css.dropdownContent, {
      [css.dropdownContent_open]: this.state.open,
    });

    return (
      <div className={css.dropdownContainer}>
        <div onClick={this.toggleOpen} ref={div => this.title = div}>
          {this.props.title}
        </div>
        <div className={dropdownContentClasses}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
