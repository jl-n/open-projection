import React, { Component } from 'react';

const Label = (props) => {
  return <text stroke='white' strokeWidth='0.3' x={props.x} y={props.y} style={{font: 'bold 10px sans-serif', color: '#253044'}}>{props.value}</text>
}

export default Label;
