import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MapRenderer from './components/MapRenderer'
import ky from 'ky';


class App extends Component {
  constructor() {
    super()
    this.state = {
      searchString: '',
      lon: 0,
      lat: 0,
    }

    this._inputHandler = this._inputHandler.bind(this)
    this._geolocate = this._geolocate.bind(this)
  }

  render() {
    console.log(this.state, "STATE");
    return (
      <div className="App">
        <div>
          <input onChange={this._inputHandler} />
          <button onClick={this._geolocate}>Go</button>
        </div>
        <MapRenderer lon={this.state.lat} lat={this.state.lon} />
      </div>
    );
  }

  _inputHandler(e) {
    this.setState(Object.assign({}, this.state, {searchString: e.target.value}))
  }

  _geolocate() {
    if(this.state.searchString.length === 0) {
      this.setState(Object.assign({}, this.state, {lat: 0, lon: 0}))
      return
    }

    this._request(this.state.searchString)
  }

  _request(address) {
    const constructRequest = (a) => `https://eu1.locationiq.com/v1/search.php?key=${'10bb188a4dae33'}&q=${a}&format=json`
    console.log("requesting 1");
    (async () => {
      console.log("WHY IS NOD");
    	const json = await ky.get(constructRequest(address)).json();
    	console.log(json);
      this.setState(Object.assign({}, this.state, {lat: json[0].lat, lon: json[0].lon}))
    })();
  }
}

export default App;
