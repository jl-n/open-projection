import React, { Component } from 'react';
import feather from 'feather-icons'
import ky from 'ky';
import styles from './Styles'
import projections from './Projections'

const icon = (name, size) => {
  const iconSvg = feather.icons[name].toSvg({ width: size, class: 'icon' })
  return <span dangerouslySetInnerHTML={{__html: iconSvg}}></span>
}

const styleIcon = (colorA, colorB, size, isSelected) => {
  const style = {
    width: size,
    height: size,
    boxShadow: isSelected ? '0 0 0pt 1.5pt rgba(0,0,0,0.2)' : 'none',
  }
  return (
    <div className='styleIcon' style={style}>
      <svg width={size} height={size}>
        <rect fill={colorA} x='0' y='0' width={size} height={size} />
        <polygon fill={colorB} points={`0,0 0,${size} ${size},0`} />
      </svg>
    </div>
  )
}

const updateUrl = (lat, lon, projection, style) => {
  window.history.replaceState({}, '', `/${lat}/${lon}/${projection}/${style}`)
}

const extractUrlParams = (urlParams) => {
  const setDefault = () => {
    updateUrl(0, 0, projections.default.name, styles.default.name)
    return [0, 0, projections.default.name, styles.default.name]
  }

  const [lat, lon, projectionName, styleName] = urlParams

  if(typeof lat !== 'number'|| typeof lon !== 'number') return setDefault()
  if(!projections.isValid(projectionName))              return setDefault()
  if(!styles.isValid(styleName))                        return setDefault()

  return [parseInt(lat, 10), parseInt(lon, 10), projectionName, styleName]
}

const request = (address, callback) => {
  const constructRequest = (a) => `https://eu1.locationiq.com/v1/search.php?key=${'10bb188a4dae33'}&q=${a}&format=json`
  console.log("Making request");
  (async () => {
    console.log("WHY IS NOD");
    const json = await ky.get(constructRequest(address)).json();
    console.log(json);

    callback(json)
  })();
}

export default {
  icon: icon,
  styleIcon: styleIcon,
  updateUrl: updateUrl,
  extractUrlParams: extractUrlParams,
  request: request
}
