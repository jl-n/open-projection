import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MapRenderer from './components/MapRenderer'

class App extends Component {
  render() {
    return (
      <div className="App">
        <MapRenderer/>
      </div>
    );
  }
}

export default App;
