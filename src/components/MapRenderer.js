import React, { Component } from 'react';
import _ from 'kefir'
import Between from 'between.js';
import Easing from 'easing-functions';
import { throttle, debounce } from 'throttle-debounce';
import Map from './Map'
import styles from '../Styles'

const coordinateEquals = (a, b) => {
  return a.lat == b.lat && a.lon === b.lon
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
      // this.forceUpdate()
    }

    const pn = window.location.pathname
    const [lat, lon, styleName] = pn.length > 4 ? pn.split('/').slice(1) : [0,0,styles[0].name]

    this.state = {
      lat: parseInt(lat, 10),
      lon: parseInt(lon, 10),
      style: styles.filter(s => s.name === styleName)[0],
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

  componentWillReceiveProps(props) {
    if(!coordinateEquals(props, this.state) && !coordinateEquals(props, this.props)){
      this._animate(props.lat, props.lon)
    }

    // this._animate(props.lat, props.lon)

    this._animate(props.lat, props.lon)
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Prevent unnecesary rerenders when typing into input box
    if(coordinateEquals(this.props, nextProps) && objectEquals(this.state, nextState)) {
      return false
    }

    return true
  }

  render() {
    const renderLevel = this.state.isDragging || this.state.isAnimating ? 0 : 1
    const cursor = this.state.isDragging ? 'grabbing' : 'grab'

    return (
      <div style={{cursor: cursor}}
              onMouseDown={this._mouseDownHandler}
              onMouseUp={this._mouseUpHandler}
              onMouseMove={captureEvent(debounce(10, this._mouseMoveHandler))}>
        <Map
          mapStyle={this.props.mapStyle}
          renderLevel={renderLevel}
          lon={this.state.lon}
          lat={this.state.lat}
          width={document.body.clientWidth}
          height={document.body.clientHeight}
          svgRef={this.props.svgRef}
        />
      </div>
    )
  }

  _mouseDownHandler(e) {
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

      const lon = this.state.lon-yDiff
      const lat = this.state.lat+xDiff

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
    const destination = {
      lat: destLat,
      lon: destLon
    }

    let onLocationChange = this.props.onLocationChange
    if(!coordinateEquals(this.state, destination)) {
      this.setState(Object.assign({}, this.state, {isAnimating: true}))
      const currentCoords = {
        lat: this.state.lat,
        lon: this.state.lon
      }
      const destCoords = {
        lat: destLat,
        lon: destLon
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
