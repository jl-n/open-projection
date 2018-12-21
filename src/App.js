import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MapRenderer from './components/MapRenderer'
import Map from './components/Map'
import styles from './Styles'
import ky from 'ky';
import download from 'downloadjs'
import feather from 'feather-icons'
import domtoimage from 'dom-to-image';

const icon = (name, size) => {
  const iconSvg = feather.icons[name].toSvg({ width: size, class: 'icon' })
  return <span dangerouslySetInnerHTML={{__html: iconSvg}}></span>
}

const styleIcon = (colorA, colorB, size) => {
  return (
    <div className='styleIcon' style={{width: size, height: size}}>
      <svg width={size} height={size}>
        <rect fill={colorA} x='0' y='0' width={size} height={size} />
        <polygon fill={colorB} points={`0,0 0,${size} ${size},0`} />
      </svg>
    </div>
  )
}

const updateUrl = (lat, lon, style) => {
  window.history.replaceState({}, '', `/${lat}/${lon}/${style}`)
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
      searchLat: 0,
      searchLon: 0,
      currentLat: 0,
      currentLon: 0,
      style: styles[0].name,
    }

    this.svgRef = React.createRef()
    this.downloadableMap = React.createRef();

    this._inputHandler = this._inputHandler.bind(this)
    this._geolocate = this._geolocate.bind(this)
    this._download = this._download.bind(this)
    this._handleKeyPress = this._handleKeyPress.bind(this)
    this._onLocationChange = this._onLocationChange.bind(this)
    this._changeStyle = this._changeStyle.bind(this)
  }

  render() {
    const styleIcons = styles.map(s => {
      return <div onClick={() => this._changeStyle(s.name)} className='button'>{styleIcon(s.land, s.sea, 16)}</div>
    })

    // console.log(styles.filter(s => s.name === this.state.style)[0]);

    return (
      <div className="App">
        <div className="toolbar">
          <input autoFocus onKeyPress={this._handleKeyPress} onChange={this._inputHandler} />
          {styleIcons}
          <div className='button' onClick={this._geolocate}>{icon('search', 16)}</div>
          <div className='button' onClick={this._download}>{icon('download', 16)}</div>
        </div>

        <MapRenderer mapStyle={styles.filter(s => s.name === this.state.style)[0]} lon={this.state.searchLat} lat={this.state.searchLon} svgRef={this.svgRef} onLocationChange={this._onLocationChange}/>

        <div className='mapDownload'>
          <Map
            mapStyle={styles.filter(s => s.name === this.state.style)[0]}
            renderLevel={1}
            lon={this.state.currentLon}
            lat={this.state.currentLat}
            width={100}
            height={100}
            svgRef={this.downloadableMap}
          />
        </div>
      </div>
    );
  }

  _changeStyle(s) {
    console.log('style changed', s);
    updateUrl(this.state.currentLat, this.state.currentLon, s)
    this.setState(Object.assign({}, this.state, {style: s}))
  }

  _handleKeyPress(e) {
    if(e.key == 'Enter'){
      this._geolocate()
    }
  }

  _onLocationChange(lat, lon) {
    updateUrl(lat, lon, styles[0].name)
    this.setState(Object.assign({}, this.state, {currentLat: lat, currentLon: lon}))
  }

  _inputHandler(e) {
    console.log("called");
    this.setState(Object.assign({}, this.state, {searchString: e.target.value}))
  }

  _download(fileFormat) {
    console.log('Downloading...');
    const node = this.downloadableMap.current
    const svg = this.svgRef.current

    console.log(node, svg);
    if(!node) return

    if(fileFormat === 'svg') {
      const blob = new Blob([node.innerHTML], {type: 'image/svg+xml'});
      download(blob, "maps.svg", "image/svg+xml");
      return
    }

    domtoimage.toPng(node)
    .then(dataUrl => {
        download(dataUrl, 'map.png')
    })
    .catch(error => {
        console.error('oops, something went wrong!', error);
    });
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
