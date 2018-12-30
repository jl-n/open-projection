import React from 'react';

const Label = (props) => {
  const size = props.size
  const fontStyle = `bold ${size}px sans-serif` //${props.size > 20 ? 'bold' : 'normal'}
  const value = props.properties.NAME
  const xOffset = (value.length/2)*2.3+size

  return (
    <text
      stroke='white'
      strokeWidth={0.3}
      x={props.x-xOffset}
      y={props.y}
      fill={props.color}
      style={{font: fontStyle, color: props.color}}>

      {value}
    </text>
  )
}

export default Label;
