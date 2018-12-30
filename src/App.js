import React, { Component } from 'react';
import './App.css';
import 'normalize.css'
import MapRenderer from './components/MapRenderer'
import ProjectionSelect from './components/ProjectionSelect'
import styles from './Styles'
import download from 'downloadjs'
import domtoimage from 'dom-to-image';
import projections from './Projections'
import utils from './Utils'

class App extends Component {
  constructor() {
    super()
    const pn = window.location.pathname.split('/').slice(1)
    const [lat, lon, projectionName, styleName] = utils.extractUrlParams(pn)

    this.state = {
      searchString: '',
      searchLat: lat,
      searchLon: lon,
      projection:  projectionName,
      currentLat: 0,
      currentLon: 0,
      style: styles.get(styleName),
      showLabels: true,
      showGraticules: true,
      svgNode: null
    }

    this._inputHandler = this._inputHandler.bind(this)
    this._geolocate = this._geolocate.bind(this)
    this._download = this._download.bind(this)
    this._handleKeyPress = this._handleKeyPress.bind(this)
    this._onLocationChange = this._onLocationChange.bind(this)
    this._changeStyle = this._changeStyle.bind(this)
    this._changeProjection = this._changeProjection.bind(this)
    this._updateSvg = this._updateSvg.bind(this)
  }

  render() {
    const styleIcons = styles.list.map((s, key) => {
      const isSelected = s.name === this.state.style.name
      return <div key={key} onClick={() => this._changeStyle(s)} className='button'>{utils.styleIcon(s.land, s.sea, 16, isSelected)}</div>
    })

    const projectionOptions = projections.list.map((p, i) => ({value: p.name, label: p.displayName}))
    const handleProjectionChange = (selectedOption) => this._changeProjection(selectedOption.value)

    const showLabels = () => this.setState(Object.assign({}, this.state, {showLabels: !this.state.showLabels}))
    const showGraticules = () => this.setState(Object.assign({}, this.state, {showGraticules: !this.state.showGraticules}))

    const graticuleColor = this.state.showGraticules ? 'green' : 'grey'
    const labelColor = this.state.showLabels ? 'green' : 'grey'

    return (
      <div className="App">
        <div className="toolbar">
          <div className='input'>
            <input autoFocus placeholder='Type any location...' onKeyPress={this._handleKeyPress} onChange={this._inputHandler} />
            <div className='button' onClick={this._geolocate}>{utils.icon('search', 16)}</div>
          </div>
          <div className='layers'>
            <div onClick={showLabels} className='button'>{utils.icon('type', 14, labelColor)}</div>
            <div onClick={showGraticules} className='button'>{utils.icon('target', 14, graticuleColor)}</div>
          </div>
          <div className='map-styles'>
            {styleIcons}
          </div>
          <div className='projections'>
            <ProjectionSelect
              value={projectionOptions.filter(op => op.value === this.state.projection)}
              onChange={handleProjectionChange}
            />
          </div>

          <div className='download'>
              <div className='button' onClick={() => this._download('svg')}> Save SVG </div>
              <div className='button' onClick={() => this._download('png')}> Save PNG </div>
          </div>
        </div>

        <MapRenderer
          mapStyle={this.state.style}
          projection={this.state.projection}
          lat={this.state.searchLat}
          lon={this.state.searchLon}
          showLabels={this.state.showLabels}
          showGraticules={this.state.showGraticules}
          onLocationChange={this._onLocationChange}
          updateSvg={this._updateSvg}
        />
      </div>
    );
  }

  _updateSvg(s) {
    this.setState(Object.assign({}, this.state, {svgNode: s}))
  }

  _changeStyle(s) {
    utils.updateUrl(this.state.currentLat, this.state.currentLon, this.state.projection, s.name)
    this.setState(Object.assign({}, this.state, {style: s}))
  }

  _changeProjection(projectionName) {
    utils.updateUrl(this.state.currentLat, this.state.currentLon, projectionName, this.state.style.name)
    this.setState(Object.assign({}, this.state, {projection: projectionName}))
  }

  _handleKeyPress(e) {
    if(e.key === 'Enter') this._geolocate()
  }

  _onLocationChange(lat, lon) {
    utils.updateUrl(lat, lon, this.state.projection, this.state.style.name)
    this.setState(Object.assign({}, this.state, {currentLat: lat, currentLon: lon}))
  }

  _inputHandler(e) {
    this.setState(Object.assign({}, this.state, {searchString: e.target.value}))
  }

  _download(fileFormat) {
    const node = this.state.svgNode
    console.log('Downloading...', node)

    if(!node) return console.log('Svg node invalid...', node)

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

    utils.request(this.state.searchString,
      (d) => this.setState(Object.assign({}, this.state, {searchLat: parseInt(d[0].lat), searchLon: parseInt(d[0].lon)}))
    )
  }
}

export default App;
