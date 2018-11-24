import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MapRenderer from './components/MapRenderer'

class App extends Component {

  render() {
    console.log(document.body.clientHeight);
    return (
      <div className="App">
        <div>
          <input />
          <button onClick={this._animate}>Go</button>
        </div>
        <MapRenderer />
      </div>
    );
  }
}

export default App;
