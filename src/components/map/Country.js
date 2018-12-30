import React from 'react';
import * as d3 from 'd3';

const Country = (props) => {
  const path = d3.geoPath().projection(props.projection)

  return (
    <g>
      <path className='country' d={path(props.feature)} fill={props.fill} stroke={props.stroke} strokeWidth={0.35} />
    </g>
  )
}

export default Country;
