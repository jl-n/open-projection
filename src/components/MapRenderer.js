import React, { Component } from 'react';
import _ from 'kefir'

import Map from './Map'

class MapRenderer extends Component {
  constructor() {
    super()
    this.state = {
      lon: 0,
      lat: 0,
      isDragging: false,
      isAnimating: false,
      destination: [0, 0]
    }
  }

  componentWillMount() {
    window.onresize = () => {
      // this.forceUpdate()
    }
  }

  componentDidMount() {
    const mousedownStream = _.fromEvents(document.body, 'mousedown');
    const mouseupStream = _.fromEvents(document.body, 'mouseup');
    const mousemoveStream = _.fromEvents(document.body, 'mousemove');
    const filterStream = mousedownStream
                                .map(v => true)
                                .merge(mouseupStream.map(v => false))

    mousedownStream.onValue(v => this.setState(Object.assign(this.state, {isDragging: true, isAnimating: false})))
    mouseupStream.onValue(v => this.setState(Object.assign(this.state, {isDragging: false})))

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

      this.setState({
        lon: lon,
        lat: lat,
        destination: [lon, lat],
        isDragging: this.state.isDragging
      })
    })
  }

  render() {
    return (
      <Map renderLevel={this.state.isDragging ? 0 : 1} lon={this.state.lon} lat={this.state.lat} width={document.body.clientWidth} height={document.body.clientHeight} />
    );
  }
}

export default MapRenderer;
