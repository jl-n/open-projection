import React, { Component } from 'react';
// import logo from './logo.svg';
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
    const pn = window.location.pathname.split('/')
    const [lat, lon, styleName] = (pn.length === 4 ? pn.slice(1) : [0, 0, styles[0].name])

    this.state = {
      searchString: '',
      searchLat: parseInt(lat, 10),
      searchLon: parseInt(lon, 10),
      currentLat: 0,
      currentLon: 0,
      style: styles.filter(s => s.name === styleName)[0],
    }

    this.downloadableMap = React.createRef();

    this._inputHandler = this._inputHandler.bind(this)
    this._geolocate = this._geolocate.bind(this)
    this._download = this._download.bind(this)
    this._handleKeyPress = this._handleKeyPress.bind(this)
    this._onLocationChange = this._onLocationChange.bind(this)
    this._changeStyle = this._changeStyle.bind(this)
  }

  render() {
    const styleIcons = styles.map((s, key) => {
      return <div key={key} onClick={() => this._changeStyle(s)} className='button'>{styleIcon(s.land, s.sea, 16)}</div>
    })

    return (
      <div className="App">
        <div className="toolbar">
          <div className='input'>
            <input autoFocus onKeyPress={this._handleKeyPress} onChange={this._inputHandler} />
            <div className='button' onClick={this._geolocate}>{icon('search', 16)}</div>
          </div>
          {styleIcons}
          <div className='download' onClick={this._download}>{icon('download', 16)}</div>
        </div>

        <MapRenderer mapStyle={this.state.style} lat={this.state.searchLat} lon={this.state.searchLon} onLocationChange={this._onLocationChange}/>

        <div style={{display: 'none'}} className='mapDownload'>
          <Map
            mapStyle={this.state.style}
            renderLevel={1}
            lon={this.state.currentLon}
            lat={this.state.currentLat}
            width={4000}
            height={2000}
            svgRef={this.downloadableMap}
          />
        </div>
      </div>
    );
  }

  _changeStyle(s) {
    updateUrl(this.state.currentLat, this.state.currentLon, s.name)
    this.setState(Object.assign({}, this.state, {style: s}))
  }

  _handleKeyPress(e) {
    if(e.key === 'Enter'){
      this._geolocate()
    }
  }

  _onLocationChange(lat, lon) {
    updateUrl(lat, lon, this.state.style.name)
    this.setState(Object.assign({}, this.state, {currentLat: lat, currentLon: lon}))
  }

  _inputHandler(e) {
    this.setState(Object.assign({}, this.state, {searchString: e.target.value}))
  }

  _download(fileFormat) {
    console.log('Downloading...');
    const node = this.downloadableMap.current

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
      this.setState(Object.assign({}, this.state, {searchLat: 0, searchLon: 0}))
      return
    }

    request(this.state.searchString,
      (d) => this.setState(Object.assign({}, this.state, {searchLat: parseInt(d[0].lat), searchLon: parseInt(d[0].lon)}))
    )
  }
}

export default App;
