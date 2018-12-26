import React, { Component } from 'react';
import Between from 'between.js';
import { debounce } from 'throttle-debounce';
import Map from './Map'
import styles from '../Styles'

const coordinateEquals = (a, b) => {
  return a.lat === b.lat && a.lon === b.lon
}

const objectEquals = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b)
}

const captureEvent = (handler) => {
  return (e) => {
    e.persist()
    return handler(e)
  }
}

class MapRenderer extends Component {
  constructor() {
    super()
    window.onresize = () => {
      this.forceUpdate()
    }

    this.state = {
      lat: 0,
      lon: 0,
      style: styles[0],
      isDragging: false,
      isAnimating: false,
      lastCusorPos: {
        x: null,
        y: null
      },
    }

    this._mouseDownHandler = this._mouseDownHandler.bind(this)
    this._mouseUpHandler = this._mouseUpHandler.bind(this)
    this._mouseMoveHandler = this._mouseMoveHandler.bind(this)
  }

  componentDidMount() {
    this.setState(Object.assign({}, this.state, {lat: this.props.lat, lon: this.props.lon}))
  }

  componentWillReceiveProps(props) {
    if(!coordinateEquals(props, this.state) && !coordinateEquals(props, this.props)){
      this._animate(props.lat, props.lon)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Prevent unnecesary rerenders when typing into input box
    if(objectEquals(this.props, nextProps) && objectEquals(this.state, nextState)) {
      return false
    }
    return true
  }

  render() {
    const renderLevel = this.state.isDragging || this.state.isAnimating ? 0 : 1
    const cursor = this.state.isDragging ? 'grabbing' : 'grab'
    const downloadableMap = (
      <div className='mapDownload'>
        <Map
          mapStyle={this.state.style}
          renderLevel={1}
          projection={this.props.projection}
          lon={this.state.currentLon}
          lat={this.state.currentLat}
          width={4000}
          height={2000}
          updateSvg={this.props.updateSvg}
        />
      </div>
    )

    return (
      <div style={{cursor: cursor}}
              onMouseDown={this._mouseDownHandler}
              onMouseUp={this._mouseUpHandler}
              onMouseMove={captureEvent(debounce(10, this._mouseMoveHandler))}>

        <Map
          mapStyle={this.props.mapStyle}
          renderLevel={renderLevel}
          projection={this.props.projection}
          lat={this.state.lat}
          lon={this.state.lon}
          width={document.body.clientWidth}
          height={document.body.clientHeight}
        />

        {renderLevel === 1 ? downloadableMap : ''}
      </div>
    )
  }

  _mouseDownHandler(e) {
    console.log(e);
    const newState = {
      isDragging: true,
      lastCusorPos: {
        x: e.pageX,
        y: e.pageY
      }
    }
    this.setState(Object.assign({}, this.state, newState))
  }

  _mouseUpHandler(e) {
    const newState = {
      isDragging: false,
      lastCusorPos: {
        x: null,
        y: null
      }
    }
    this.setState(Object.assign({}, this.state, newState))
  }

  _mouseMoveHandler(e) {
    if(this.state.isDragging) {
      const xDiff = e.pageX - this.state.lastCusorPos.x
      const yDiff = e.pageY - this.state.lastCusorPos.y

      const lon = this.state.lon-xDiff
      const lat = this.state.lat+yDiff

      this.props.onLocationChange(lat, lon, this.props.mapStyle.name)

      this.setState(Object.assign({}, this.state, {
        lon: lon,
        lat: lat,
        lastCusorPos: {
          x: e.pageX,
          y: e.pageY
        }
      }))
    }
  }

  _animate(destLat, destLon) {
    let onLocationChange = this.props.onLocationChange
    const destCoords = {
      lat: destLat,
      lon: destLon
    }

    if(!coordinateEquals(this.state, destCoords)) {
      this.setState(Object.assign({}, this.state, {isAnimating: true}))
      const currentCoords = {
        lat: this.state.lat,
        lon: this.state.lon
      }

      const tween = new Between(currentCoords, destCoords)
        .time(3000)
        .easing(Between.Easing.Cubic.InOut)
        .on('update', (v) => {
            if(this.state.isAnimating) {
              this.setState(Object.assign({}, this.state, {lat: v.lat, lon: v.lon}))
            } else {
              tween.pause()
            }

            if(this.state.isDragging) {
              tween.pause()
              this.setState(Object.assign({}, this.state, {isAnimating: false}))
            }
        }).on('complete', (value) => {
            onLocationChange(this.state.lat, this.state.lon)
            this.setState(Object.assign({}, this.state, {isAnimating: false}))
        });
    }
  }
}


export default MapRenderer;
