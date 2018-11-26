import React, { Component } from 'react';
import _ from 'kefir'
import Between from 'between.js';
import Easing from 'easing-functions';
import Map from './Map'

const coordinateEquals = (a, b) => {
  return a.lat == b.lat && a.lon === b.lon
}

const objectEquals = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b)
}

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
    // TODO: Refactor this to not use streams?
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

      const lon = this.state.lon-yDiff
      const lat = this.state.lat+xDiff

      this.setState(Object.assign({}, this.state, {
        lon: lon,
        lat: lat,
      }))
    })
  }

  componentWillReceiveProps(props) {
    if(!coordinateEquals(props, this.state)){
      this._animate(props.lat, props.lon)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Otherwise it rerenders unnecesarily (eg during typing into input box)
    if(coordinateEquals(this.props, nextProps) && objectEquals(this.state, nextState)) {
      return false
    }

    return true
  }

  render() {
    const renderLevel = this.state.isDragging || this.state.isAnimating ? 0 : 1
    const cursor = this.state.isDragging ? 'grabbing' : 'grab'

    return (
      <div style={{cursor: cursor}}>
        <Map
            renderLevel={renderLevel}
            lon={this.state.lon}
            lat={this.state.lat}
            width={document.body.clientWidth}
            height={document.body.clientHeight}
        />
      </div>
    )
  }

  _animate(destLat, destLon) {
    const destination = {
      lat: destLat,
      lon: destLon
    }

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
        }).on('complete', (value) => {
            this.setState(Object.assign({}, this.state, {isAnimating: false}))
        });
    }
  }
}


export default MapRenderer;
