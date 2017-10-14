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
            <div className={css.buttonBody}>
              Resume
            </div>
          </button>
        </div>
      </div>
    )
  }
}

class StartContent extends React.Component {
  render() {
    return (
      <div>
        <div>
          Ready to get started?
        </div>
        <div>
          <button className={css.button} onClick={this.props.onClick}>
            <div className={css.buttonBody}>
              Ok
            </div>
          </button>
        </div>
      </div>
    )
  }
}

const CONTENT = {
  pause: HelpContent,
  start: StartContent,
};


export class Modal extends React.Component {
  static defaultProps = {
    style: 'fixed',
  };

  render() {
    const modalClasses = classNames(css.modal, css[`modal_${this.props.style}`], {
      [css.modal_open]: this.props.activeModal === this.props.type,
    });
    const overlayClasses = classNames(css[`overlay_${this.props.style}`]);

    const Content = CONTENT[this.props.type];

    return (
      <div className={modalClasses} onClick={this.props.onOutsideClick}>
        <div className={overlayClasses} />
        <div className={css.body}>
          <Content {...this.props} />
        </div>
      </div>
    )
  }
}
