import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import _ from 'kefir'
import Between from 'between.js';
import Easing from 'easing-functions';
import Map from './Map'

class MapRenderer extends Component {
  constructor() {
    super()
    window.onresize = () => {
      // this.forceUpdate()
    }

    this.state = {
      lon: 0,
      lat: 0,
      isDragging: false,
      isAnimating: false,
    }
  }

  componentDidMount() {
    const mousedownStream = _.fromEvents(document.body, 'mousedown');
    const mouseupStream = _.fromEvents(document.body, 'mouseup');
    const mousemoveStream = _.fromEvents(document.body, 'mousemove');
    const filterStream = mousedownStream
                                .map(v => true)
                                .merge(mouseupStream.map(v => false))

    mousedownStream.onValue(v => this.setState(Object.assign({}, this.state, {isDragging: true, isAnimating: false})))
    mouseupStream.onValue(v => this.setState(Object.assign({}, this.state, {isDragging: false})))

    mousemoveStream.filterBy(filterStream).slidingWindow(2, 2).onValue(a => {
      const xDiff = a[0].pageX - a[1].pageX
      const yDiff = a[0].pageY - a[1].pageY

      /*
      Small bug - because the beginning value of the .slidingWindow() function is the last mouse
      position of the last drag, there is an initial jump. We need to ignore the first value in this case.
      It is not clear how to do this right now, so a temporary fix is to ignore setting the state if
      the diff is too big (so it jumps if the next drag starts close but not exactly where the last one ended).
      */
      if(xDiff > 30 || yDiff > 30) return

      const lon = this.state.lon+xDiff
      const lat = this.state.lat-yDiff

      this.setState(Object.assign({}, this.state, {
        lon: lon,
        lat: lat,
      }))
    })
  }

  componentWillReceiveProps(props) {
    this._animate(props.lat, props.lon)
  }

  render() {
    const renderMap = (renderLevel, lon, lat) => {
      return (
        <Map
            renderLevel={renderLevel}
            lon={lon}
            lat={lat}
            width={document.body.clientWidth}
            height={document.body.clientHeight}
        />
      )
    }

    if(this.state.isDragging || this.state.isAnimating) {
      return renderMap(0, this.state.lon, this.state.lat)
    }

    return renderMap(1, this.state.lon, this.state.lat)
  }

  _animate(destLat, destLon) {
    this.setState(Object.assign({}, this.state, {isAnimating: true}))

    new Between({ lat: this.state.lat, lon: this.state.lon }, { lat: destLat, lon: destLon }).time(3000).easing(Between.Easing.Cubic.InOut)
      .on('update', (v) => {
          if(this.state.isAnimating) {
            this.setState(Object.assign({}, this.state, {lat: v.lat, lon: v.lon}))
          }
      }).on('complete', (value) => {
          this.setState(Object.assign({}, this.state, {isAnimating: false}))
      });
  }
}


export default MapRenderer;
