import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MapRenderer from './components/MapRenderer'

class App extends Component {
  componentWillMount() {
    window.onresize = () => {
      // this.forceUpdate()
    }
  }

  render() {
    console.log(document.body.clientHeight);
    return (
      <div className="App">
        <div>
          <input />
          <button onClick={this._animate}>Go</button>
        </div>
        <MapRenderer animateX={20} animateY={40} width={document.body.clientWidth} height={document.body.clientHeight}/>
      </div>
    );
  }
}

export default App;
