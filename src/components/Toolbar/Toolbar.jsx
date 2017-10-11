import React from 'react';

import {Dropdown} from 'components/Dropdown/Dropdown';

import css from './Toolbar.scss';


export class Toolbar extends React.Component {
  render() {
    return (
      <div className={css.toolbarContainer}>
        <div>
        </div>
        <div>
          <Dropdown title="Reveal">
            <div>Square</div>
            <div>Word</div>
            <div>Puzzle</div>
          </Dropdown>
        </div>
      </div>
    )
  }
}
