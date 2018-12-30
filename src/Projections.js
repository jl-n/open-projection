import * as d3projections from 'd3-geo-projection';

const removeRaw = (name) => {
  return !name.includes('Raw')
}

// Litrow is a crazy one

const removeCrashing = (name) => {
  return ![
    'geoBertin1953',
    'geoChamberlin',
    'geoChamberlinAfrica',
    'geoGilbert',
    'geoInterrupt',
    'geoModifiedStereographic',
    'geoModifiedStereographicAlaska',
    'geoModifiedStereographicGs48',
    'geoModifiedStereographicGs50',
    'geoModifiedStereographicMiller',
    'geoModifiedStereographicLee',
    'geoPolyhedral',
    'geoProject',
    'geoQuantize',
    'geoQuincuncial',
    'geoStitch',
    'geoTwoPointAzimuthal',
    'geoTwoPointAzimuthalUsa',
    'geoTwoPointEquidistant',
    'geoTwoPointEquidistantUsa'

  ].includes(name)
}

const projections = Object.keys(d3projections).filter(removeRaw).filter(removeCrashing).map(v => {
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
