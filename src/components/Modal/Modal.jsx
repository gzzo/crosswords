import React from 'react';
import classNames from 'classnames';

import css from './Modal.scss';


class HelpContent extends React.Component {
  render() {
    return (
      <div>
        <div>
          Your game has been <strong>paused</strong>.
        </div>
        <div>
          <button className={css.button}>
            Resume
          </button>
        </div>
      </div>
    )
  }
}

const CONTENT = {
  help: HelpContent
}


export class Modal extends React.Component {
  render() {
    const modalClasses = classNames(css.modal, {
      [css.modal_open]: this.props.isOpen,
    });

    const Content = CONTENT[this.props.type];

    return (
      <div className={modalClasses} onClick={this.props.closeModal}>
        <div />
        <div className={css.body}>
          <Content />
        </div>
      </div>
    )
  }
}
