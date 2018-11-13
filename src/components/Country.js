import React, { Component } from 'react';
import * as d3p from 'd3-geo-projection';
import * as d3 from 'd3';

const bbox2Geojson = bbox => {
  return {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [
      [
        [
          bbox[0],
          bbox[1]
        ]
      ]
    ]
  }
}
}

const Country = (props) => {
  const centroid = d3.geoPath().projection(props.projection).centroid(props.feature);
  const path = d3.geoPath().projection(props.projection)

  const p = d3p.geoProject(bbox2Geojson(props.feature.bbox), props.projection)

  // console.log(p, "p")

  // const projected = d3p.geoProject(d.bbox, props.projection)

  // console.log(path);

  return (
    <g>
      <path className='country' d={path(props.feature)} fill="#EFE9E1" stroke="#FEAB6C" strokeWidth={0.35} />
      <text x={centroid[0]} y={centroid[1]}>{props.feature.properties.NAME}</text>
    </g>
  )
}

export default Country;
