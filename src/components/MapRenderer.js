import React, { Component } from 'react';
import mapData from '../map-data/geojson';
import * as d3 from 'd3';
import * as d3projections from 'd3-geo-projection';

class MapRenderer extends Component {
  componentDidMount() {}

  render() {
    console.log(d3projections);
    var aitoff = d3projections.geoAitoff();

    // Define map projection
    let w = 1000
    let h = 1000
    var projection = aitoff
       .center([0, 0]) // set centre to further North
       .scale([w/(2*Math.PI)]) // scale to fit group width
       .translate([w/2,h/2]) // ensure centred in group

    // Define map path
    let path = d3
      .geoPath()
      .projection(aitoff)

    console.log(typeof path(mapData), mapData)

    return (
      <div className="App">
        MAP
        <svg className="container" width="1000" height="1000">
          {/* ADD: our two axes' groups, and when their DOM nodes mount, select them, and "call" (render into them) the x and y axes respectively. */}
          <g className="line">
            <path d={path(mapData)} />
          </g>
        </svg>
      </div>
    );
  }
}

export default MapRenderer;
