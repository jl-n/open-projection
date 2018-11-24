import React, { Component } from 'react';
import * as d3 from 'd3';
import * as d3projections from 'd3-geo-projection';
import _ from 'kefir'

import Country from './Country'
import Label from './Label'
import Graticule from './Graticule'
import Bathymetry from './Bathymetry'

import MAPDATA_LOW from '../map-data/110m';
import MAPDATA_HIGH from '../map-data/50m';
import GRATICULES from '../map-data/graticules_10';

import BATHYMETRY_0 from '../map-data/bathymetry_J_1000';
import BATHYMETRY_1 from '../map-data/bathymetry_H_3000';
import BATHYMETRY_2 from '../map-data/bathymetry_G_4000';
import BATHYMETRY_3 from '../map-data/bathymetry_F_5000';

class MapRenderer extends Component {
  constructor() {
    super()
    this.state = {
      x: 0,
      y: 0,
      isDragging: false,
      isAnimating: false,
      destination: [0, 0]
    }
  }

  componentWillMount() {
    const getLabelData = (data) => {
     return data.features.map(feature => {
       return {
         size: d3.geoPath().area(feature),
         coordinates: d3.geoPath().centroid(feature),
         properties: feature.properties
       }
     })
    }

    this.labelData = getLabelData(MAPDATA_HIGH)

    this.projection = d3projections.geoCylindricalEqualArea()
       // .rotate([-120, -14, 0]) //long, lat, 0
       .parallel(45)
       .center([0, 0]) // set centre to further North
       // .scale([w/(2*Math.PI)]) // scale to fit group width
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

      const x = this.state.x+xDiff
      const y = this.state.y-yDiff

      this.setState({
        x: x,
        y: y,
        destination: [x, y],
        isDragging: this.state.isDragging
      })
    })
  }

  render() {
    const w = this.props.width
    const h = this.props.height

    this.projection
       .scale([w/(2*Math.PI)*1.4]) // scale to fit group width
       .translate([w/2,h/2]) // ensure centred in group


    // this.setState(Object.assign({}, {isAnimating: true, destination: [20, 60]}, this.state))

    this.projection.rotate([-this.state.x, -this.state.y/2, 0])
    const mapData = this.state.isDragging || this.state.isAnimating ? MAPDATA_LOW : MAPDATA_HIGH

    const statePaths = this._getStatePaths(mapData);
    const graticules = this.state.isDragging ? [] : this._getGraticules(GRATICULES)
    const bathymetry = this.state.isDragging ? [] : this._getBathymetry([BATHYMETRY_3])
    const labels = this.state.isDragging ? [] : this._getLabelData()

    return (
      <div className="App">

        <svg className="container noselect" width={this.props.width} height={this.props.height}>
          <g className="line">
            {statePaths}
          </g>
          <g>
            {bathymetry}
          </g>
          <g>
            {graticules}
          </g>
          <g>
            {labels}
          </g>
        </svg>
      </div>
    );
  }

  _getStatePaths(data) {
    return data.features.map((feature, i) => {
      return <Country projection={this.projection} feature={feature} key={i} />;
    })
  }

  _getGraticules(data) {
    return data.features.map((feature, i) => {
      return <Graticule projection={this.projection} feature={feature} key={i} />;
    })
  }

  _getBathymetry(data) {
    function flatten(arr) {
      return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
      }, []);
    }

    return data.map((dataset, i) => {
      return dataset.features.map((feature, j) => {
        return <Bathymetry projection={this.projection} feature={feature} key={i+j} />;
      })
    })
  }

  _getLabelData() {
    return this.labelData.map((c, i) => {
      const projectedCoord = this.projection([c.coordinates[0], c.coordinates[1]])
      return <Label x={projectedCoord[0]} y={projectedCoord[1]} properties={c.properties} size={c.size} key={i}/>
    })
  }
}

export default MapRenderer;
