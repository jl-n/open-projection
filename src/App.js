import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MapRenderer from './components/MapRenderer'
import ky from 'ky';

const request = (address, callback) => {
  const constructRequest = (a) => `https://eu1.locationiq.com/v1/search.php?key=${'10bb188a4dae33'}&q=${a}&format=json`
  console.log("Making request");
  (async () => {
    console.log("WHY IS NOD");
    const json = await ky.get(constructRequest(address)).json();
    console.log(json);

    callback(json)
  })();
}

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
    this.svgRef = React.createRef()
  }

  render() {
    return (
      <div className="App">
        <div className="toolbar">
          <input onChange={this._inputHandler} />
          <button onClick={this._geolocate}>Go</button>

          <a download="your_file_namess.svg" href={this._generateDownloadableSvg()}>Download</a>

        </div>
        <MapRenderer lon={this.state.lat} lat={this.state.lon} svgRef={this.svgRef}/>
      </div>
    );
  }

  _inputHandler(e) {
    console.log("called");
    this.setState(Object.assign({}, this.state, {searchString: e.target.value}))
  }

  _generateDownloadableSvg(name) {
    console.log(this.svgRef);
    return `data:application/octet-stream;base64,${this.svgRef.current ? btoa(this.svgRef.current.innerHTML): ''}`
  }

  _geolocate(e) {
    if(this.state.searchString.length === 0) {
      this.setState(Object.assign({}, this.state, {lat: 0, lon: 0}))
      return
    }

    request(this.state.searchString,
      (d) => this.setState(Object.assign({}, this.state, {lat: parseInt(d[0].lat), lon: parseInt(d[0].lon)}))
    )
  }
}

export default App;
