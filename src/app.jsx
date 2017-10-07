import React from 'react';
import {Route} from "react-router-dom";

import {Home} from 'pages/Home/Home';


export class App extends React.Component {
  render() {
    return (
      <div>
        <Route path="/home" component={Home} />
      </div>
    )
  }
}
