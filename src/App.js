import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MapRenderer from './components/MapRenderer'
import ky from 'ky';
import download from 'downloadjs'
import feather from 'feather-icons'

const icon = (name, size) => {
  const iconSvg = feather.icons[name].toSvg({ width: size, class: 'icon' })
  return <span dangerouslySetInnerHTML={{__html: iconSvg}}></span>
}

const themeIcon = (colorA, colorB, size) => {
  
}

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
    this._download = this._download.bind(this)

    this.svgRef = React.createRef()
  }

  render() {
    return (
      <div className="App">
        <div className="toolbar">
          <input autoFocus onKeyPress={this.handleKeyPress} onChange={this._inputHandler} />
          <div className='button' onClick={this._geolocate}>{icon('search', 16)}</div>
          <div className='button' onClick={this._download}>{icon('download', 16)}</div>
          <div></div>
        </div>
        <MapRenderer lon={this.state.lat} lat={this.state.lon} svgRef={this.svgRef}/>
      </div>
    );
  }

  _handleKeyPress(e) {
    if(e.key == 'Enter'){
      this._geolocate()
    }
  }

  _inputHandler(e) {
    console.log("called");
    this.setState(Object.assign({}, this.state, {searchString: e.target.value}))
  }

  _download() {
    console.log('hit download');
    if(!this.svgRef.current) return

    const svg = this.svgRef.current.innerHTML
    const blob = new Blob([svg], {type: 'image/svg+xml'});
    download(blob, "maps.svg", "image/svg+xml");
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
