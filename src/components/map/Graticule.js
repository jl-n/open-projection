import React from 'react';
import * as d3 from 'd3';

const Graticule = (props) => {
  const path = d3.geoPath().projection(props.projection)

  return (
    <g>
      <path className='graticule' d={path(props.feature)} fill="none" stroke="#FEAB6C" strokeWidth={1} />
    </g>
  )
}

export default Graticule;
