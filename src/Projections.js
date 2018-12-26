import * as d3projections from 'd3-geo-projection';

const compatibleProjections = (name) => {
  return !name.includes('Raw')
}

const projections = Object.keys(d3projections).filter(compatibleProjections).map(v => {
  return {
    name: v.replace(/geo/g, ''),
    displayName: v.replace(/geo/g, '').replace(/([A-Z])/g, ' $1').trim()
  }
})

export default {
  list: projections,
  default: projections[0],
  isValid: (name) => {
    return projections.filter((p) => p.name === name).length > 0
  },
  get: (name) => {
    return projections.filter(p => name === p.name)[0]
  }
}
