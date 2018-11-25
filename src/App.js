import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MapRenderer from './components/MapRenderer'

class App extends Component {
  constructor() {
    super()
    this.state = {
      lon: 0,
      lat: 0,
    }
  }

  render() {
    const animate = () => {
      this.setState({lon: 80, lat: 80})
    }

    // setTimeout(animate, 1000)

    return (
      <div className="App">
        <div>
          <input />
          <input />
          <button onClick={animate}>Go</button>
        </div>
        <MapRenderer lon={this.state.lat} lat={this.state.lon} />
      </div>
    );
  }
}

export default App;
