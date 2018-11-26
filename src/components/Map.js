import React, { Component } from 'react';
import * as d3 from 'd3';
import * as d3projections from 'd3-geo-projection';

import Country from './Country'
import Label from './Label'
import Graticule from './Graticule'
import Bathymetry from './Bathymetry'

import MAPDATA_LOW from '../map-data/110m';
import MAPDATA_HIGH from '../map-data/50m';
import GRATICULES from '../map-data/graticules_10';

// import BATHYMETRY_0 from '../map-data/bathymetry_J_1000';
// import BATHYMETRY_1 from '../map-data/bathymetry_H_3000';
// import BATHYMETRY_2 from '../map-data/bathymetry_G_4000';
// import BATHYMETRY_3 from '../map-data/bathymetry_F_5000';

class Map extends Component {

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
       // .parallel(45)
       .center([0, 0]) // set centre to further North
       // .scale([w/(2*Math.PI)]) // scale to fit group width
  }

  render() {
    const w = this.props.width
    const h = this.props.height
    const lon = this.props.lon
    const lat = this.props.lat
    // const projection = this.props.projection

    this.projection
       .scale([w/(2*Math.PI)*1.4]) // scale to fit group width
       .translate([w/2,h/2]) // ensure centred in group
    this.projection.rotate([-lat,-lon, 0])

    const mapData = this.props.renderLevel === 0 ? MAPDATA_LOW : MAPDATA_HIGH
    const statePaths = this._getStatePaths(mapData)
    const graticules = this.props.renderLevel === 0 ? [] : this._getGraticules(GRATICULES)
    const bathymetry = []//this.props.renderLevel === 0 ? [] : this._getBathymetry([BATHYMETRY_3])
    const labels = this.props.renderLevel === 0 ? [] : this._getLabelData()

    return (
      <div className="App">
        <svg className="container noselect" width={this.props.width} height={this.props.height}>
          <rect width={this.props.width} height={this.props.height} fill={'#76CFF0'}></rect>
          <g className="countries">
            {statePaths}
          </g>
          <g className="bathymetry">
            {bathymetry}
          </g>
          <g className="graticules">
            {graticules}
          </g>
          <g className="labels">
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
    // TODO: This dataset is actually already available on the natural earth repo in the /geojson directory
    // This would mean no edge cases like america label offset because of Hawaii skewing centroid
    return this.labelData.map((c, i) => {
      const projectedCoord = this.projection([c.coordinates[0], c.coordinates[1]])
      return <Label x={projectedCoord[0]} y={projectedCoord[1]} properties={c.properties} size={c.size} key={i}/>
    })
  }
}

export default Map;
