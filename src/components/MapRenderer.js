import React, { Component } from 'react';
import Country from './Country'
import MAPDATA_LOW from '../map-data/110m';
import MAPDATA_HIGH from '../map-data/50m';
import * as d3 from 'd3';
import * as d3projections from 'd3-geo-projection';
import _ from 'kefir'

class MapRenderer extends Component {
  constructor() {
    super()
    this.state = {
      x: 0,
      y: 0,
      isDragging: false
    }

    console.log(d3);

    // Define map projection
    let w = 1000
    let h = 1000

    this.projection = d3projections.geoCylindricalEqualArea()
       // .rotate([-120, -14, 0]) //long, lat, 0
       .parallel(45)
       .center([0, 0]) // set centre to further North
       .scale([w/(1*Math.PI)]) // scale to fit group width
       .translate([w/2,h/2]) // ensure centred in group
  }

  componentDidMount() {
    const mousedownStream = _.fromEvents(document.body, 'mousedown');
    const mouseupStream = _.fromEvents(document.body, 'mouseup');
    const mousemoveStream = _.fromEvents(document.body, 'mousemove');
    const filterStream = mousedownStream.map(v => true).merge(mouseupStream.map(v => false))

    mousedownStream.onValue(v => this.setState(Object.assign(this.state, {isDragging: true})))
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
      //console.log(xDiff, yDiff);

      this.setState({
        x: this.state.x+xDiff,
        y:this.state.y-yDiff,
        isDragging: this.state.isDragging
      })
    })
  }

  render() {
    // console.log(d3projections);
    this.projection.rotate([-this.state.x, -this.state.y/2, 0])

    // Define map path

    const generateStatePaths = (data) => {
      return data.features.map((feature, i) => {
        return <Country projection={this.projection} feature={feature} key={i} />;
      })
    }

    let statePaths = generateStatePaths(this.state.isDragging ? MAPDATA_LOW : MAPDATA_HIGH);

    return (
      <div className="App">
        <svg className="container" width="1000" height="1000">
          <g className="line">
            {statePaths}
          </g>
        </svg>
      </div>
    );
  }
}

export default MapRenderer;
