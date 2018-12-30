import React, { Component } from 'react';
import Select from 'react-select';
import projections from '../Projections'

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: 'none',
    borderTop: 'solid rgba(0,0,0, 0.05) 1px',
    borderRadius: 0,
    outline: 'none',
    boxShadow: 'none',
    ':hover': {
      border: 'none',
      borderTop: 'solid rgba(0,0,0, 0.05) 1px',
    }
  }),
}

const projectionOptions = projections.list.map((p, i) => {
  return {value: p.name, label: p.displayName}
})

const ProjectionSelect = (props) => {
  return (
    <Select
      value={props.value}
      onChange={props.onChange}

      options={projectionOptions}
      styles={customStyles}
    />
  );
}

export default ProjectionSelect;
