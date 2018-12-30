import React from 'react';
import * as d3 from 'd3';

const Bathymetry = (props) => {
  const path = d3.geoPath().projection(props.projection)
  //rgba(117, 193, 240, 0.63)

  return (
    <g>
      <path className='bathymetry' d={path(props.feature)} fill={props.fill} stroke="#FEAB6C" strokeWidth={0} />
    </g>
  )
}

export default Bathymetry;
