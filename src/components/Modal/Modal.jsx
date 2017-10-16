import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { CODE_ENTER } from 'constants/keys';

import css from './Modal.scss';

class CloseX extends React.Component {
  render() {
    return (
      <div className={css.closeX}>
        ×
      </div>
    )
  }
}


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
          <button className={css.button} onClick={this.props.closeModal}>
            <div className={css.buttonBody}>
              Ok
            </div>
          </button>
        </div>
      </div>
    )
  }
}

class IncorrectContent extends React.Component {
  render() {
    return (
      <div>
        <CloseX />
        <header className={css.almost}>Almost there!</header>
        <div>
          You’ve filled the puzzle but have at least one error. Keep trying.
        </div>
        <button className={css.button}>
          <div className={css.buttonBody}>
            Ok
          </div>
        </button>
      </div>
    )
  }
}

class DoneContent extends React.Component {
  render() {
    return (
      <div>
        <CloseX />
        <div className={css.puzzleIcon} />
        <h2 className={css.congratulations}>Congratulations!</h2>
        <div>
          You solved a <strong>Sunday</strong> puzzle in <strong>{this.props.timer} seconds.</strong>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const puzzle =  state.puzzle[ownProps.puzzleName];

  return {
    timer: puzzle.timer,
  }
}

const connectedDoneContent = connect(mapStateToProps)(DoneContent);

const CONTENT = {
  pause: HelpContent,
  start: StartContent,
  done: connectedDoneContent,
  incorrect: IncorrectContent,
};


export class Modal extends React.Component {
  static defaultProps = {
    style: 'fixed',
  };

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = (evt) => {
    if ( this.props.activeModal !== this.props.type || evt.ctrlKey || evt.altKey || evt.metaKey) {
      return
    }

    const {keyCode} = evt;

    if (keyCode === CODE_ENTER) {
      this.props.closeModal();
    }
  }

  render() {
    const modalClasses = classNames(css.modal, css[`modal_${this.props.style}`], {
      [css.modal_open]: this.props.activeModal === this.props.type,
    });
    const overlayClasses = classNames(css.overlay, css[`overlay_${this.props.style}`]);

    const Content = CONTENT[this.props.type];

    return (
      <div className={modalClasses} onClick={this.props.overlayClick && this.props.closeModal}>
        <div className={overlayClasses} />
        <div className={css.body}>
          <Content {...this.props} />
        </div>
      </div>
    )
  }
}
