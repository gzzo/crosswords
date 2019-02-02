import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Home } from 'pages/Home/Home';
import { Puzzle } from 'pages/Puzzle/Puzzle';

import './App.scss'

export class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/puzzle/:puzzleCategory/:puzzleName" component={Puzzle} />
        <Route path="/" component={Home} />
      </Switch>
    );
  }
}
