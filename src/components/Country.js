import React from 'react';
import * as d3 from 'd3';

const Country = (props) => {
  const path = d3.geoPath().projection(props.projection)

  return (
    <g>
      <path className='country' d={path(props.feature)} fill="#EFE9E1" stroke="#FEAB6C" strokeWidth={0.35} />
    </g>
  )
}

export default Country;
