import React, { Component } from 'react';
import mapData from '../map-data/geojson';
import * as d3 from 'd3';
import * as d3projections from 'd3-geo-projection';
import Kefir from 'kefir'

class MapRenderer extends Component {
  constructor() {
    super()
    this.state = {x: 0, y:0}
  }

  componentDidMount() {
    this.setState(
      {x: 0, y:0},
      window.addEventListener("mousedown", e => {
          // console.log(e.pageX, "target");
          // this.setState({ x: e.pageX, y: e.pageY })
      })
    )

    const mousedownStream = Kefir.fromEvents(document.body, 'mousedown');
    const mouseupStream = Kefir.fromEvents(document.body, 'mouseup');
    const mousemoveStream = Kefir.fromEvents(document.body, 'mousemove');
    const filterStream = mousedownStream.map(v => true).merge(mouseupStream.map(v => false))
    // res.log()

    mousemoveStream.filterBy(filterStream).onValue(e => {
      this.setState({ x: e.pageX, y: e.pageY })
    })

  }

  render() {
    // console.log(d3projections);

    // Define map projection
    let w = 1000
    let h = 1000

    console.log([-this.state.x, -this.state.y/2, 0]);

    var projection = d3projections.geoCylindricalEqualArea()
       // .rotate([-120, -14, 0]) //long, lat, 0
       .rotate([-this.state.x, -this.state.y/2, 0])
       .center([0, 0]) // set centre to further North
       .scale([w/(2*Math.PI)]) // scale to fit group width
       .translate([w/2,h/2]) // ensure centred in group

    // Define map path
    let path = d3
      .geoPath()
      .projection(projection)

    return (
      <div className="App">
        MAP
        <svg className="container" width="1000" height="1000">
          <g className="line">
            <path d={path(mapData)} />
          </g>
        </svg>
      </div>
    );
  }
}

export default MapRenderer;
