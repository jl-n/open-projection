import React, { Component } from 'react';
import * as d3 from 'd3';
import * as d3projections from 'd3-geo-projection';

import Country from './map/Country'
import Label from './map/Label'
import Graticule from './map/Graticule'
import Bathymetry from './map/Bathymetry'

import MAPDATA_LOW from '../map-data/110m';
import MAPDATA_HIGH from '../map-data/50m';
import GRATICULES from '../map-data/graticules_10';

// import BATHYMETRY_0 from '../map-data/bathymetry_J_1000';
// import BATHYMETRY_1 from '../map-data/bathymetry_H_3000';
// import BATHYMETRY_2 from '../map-data/bathymetry_G_4000';
// import BATHYMETRY_3 from '../map-data/bathymetry_F_5000';

class Map extends Component {
  constructor() {
    super()

    this._getStatePaths = this._getStatePaths.bind(this)
    this._getGraticules = this._getGraticules.bind(this)
    this._getBathymetry = this._getBathymetry.bind(this)
    this._getLabelData = this._getLabelData.bind(this)

    this.svgRef = React.createRef()
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
  }

  componentDidUpdate(props) {
    if(props.updateSvg) {
      this.props.updateSvg(this.svgRef.current)
    }
  }

  componentDidMount() {
    if(this.props.updateSvg) {
      this.props.updateSvg(this.svgRef.current)
    }
  }

  render() {
    const w = this.props.width
    const h = this.props.height
    const lon = this.props.lon
    const lat = this.props.lat
    const projection = 'geo'+this.props.projection
    const renderLevel = this.props.renderLevel
    const showLabels = this.props.showLabels
    const showGraticules = this.props.showGraticules

    this.projection = d3projections[projection]()
     .center([0, 0])
     .translate([w/2,h/2])
     .rotate([-lon,-lat, 0])
     .fitExtent([[30, 30],[w-30, h-30]], MAPDATA_LOW)

    const mapData = renderLevel === 1 ? MAPDATA_HIGH : MAPDATA_LOW
    const statePaths = this._getStatePaths(mapData)

    const graticules = (renderLevel === 1) && showGraticules ? this._getGraticules(GRATICULES) : []
    const labels = (renderLevel === 1) && showLabels ? this._getLabelData() : []

    const bathymetry = this.props.renderLevel === 0 ? [] : []//this._getBathymetry([BATHYMETRY_3])

    return (
      <div>
        <div ref={this.svgRef}>
          <svg xmlns='http://www.w3.org/2000/svg' className="container noselect" width={this.props.width} height={this.props.height}>
            <rect width={this.props.width} height={this.props.height} fill={this.props.mapStyle.sea}></rect>
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
      </div>
    );
  }

  _getStatePaths(data) {
    return data.features.map((feature, i) => {
      return <Country stroke={this.props.mapStyle.borders} strokeWidth={this.props.width/3000} fill={this.props.mapStyle.land} projection={this.projection} feature={feature} key={i} />;
    })
  }

  _getGraticules(data) {
    return data.features.map((feature, i) => {
      return <Graticule stroke={this.props.mapStyle.graticules} strokeWidth={this.props.width/2000} projection={this.projection} feature={feature} key={i} />;
    })
  }

  _getBathymetry(data) {
    return data.map((dataset, i) => {
      return dataset.features.map((feature, j) => {
        return <Bathymetry fill={this.props.mapStyle.sea} projection={this.projection} feature={feature} key={i+j} />;
      })
    })
  }

  _getLabelData() {
    // TODO: This dataset is actually already available on the natural earth repo in the /geojson directory
    // This would mean no edge cases like america label offset because of Hawaii skewing centroid
    return this.labelData.map((c, i) => {
      const projectedCoord = this.projection([c.coordinates[0], c.coordinates[1]])
      return <Label x={projectedCoord[0]} y={projectedCoord[1]} properties={c.properties} color={this.props.mapStyle.labels} size={this.props.width/230} key={i}/>
    })
  }
}

export default Map;
