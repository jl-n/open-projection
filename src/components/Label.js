import React from 'react';

const Label = (props) => {
  const scaleFactor = props.size*0.001
  const fontStyle = `bold ${5+scaleFactor}px sans-serif` //${props.size > 20 ? 'bold' : 'normal'}
  const value = props.properties.NAME
  const xOffset = (value.length/2)*2.3+scaleFactor

  return (
    <text
      stroke='white'
      strokeWidth={0.3}
      x={props.x-xOffset}
      y={props.y}
      style={{font: fontStyle, color: '#253044'}}>

      {value}
    </text>
  )
}

export default Label;
