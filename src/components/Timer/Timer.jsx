import React from 'react';
import _ from 'lodash';

import css from './Timer.scss';


export class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true,
    }
  }

  componentWillMount() {
    this.interval = setInterval(this.props.updateTimer, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  togglePause = () => {
    if (this.state.active) {
      this.setState({
        active: false,
      }, () => clearInterval(this.interval));
    } else {
      this.setState({
        active: true,
      }, () => this.interval = setInterval(this.props.updateTimer, 1000));
    }
  }

  render() {
    const {timer} = this.props;

    const seconds = timer % 60;
    const minutes = Math.floor(timer / 60) % 60;
    const hours = Math.floor(timer / 60 / 60) % 60;

    const hoursDisplay = hours ? `${hours}:` : '';

    const display = `${hoursDisplay}${minutes}:${_.padStart(seconds, 2, '0')}`;

    return (
      <div className={css.timerContainer}>
        <div className={css.timerContent} onClick={this.togglePause}>
          <div>
            {display}
          </div>
          <i className={css.pauseIcon} />
        </div>
      </div>
    )
  }
}
