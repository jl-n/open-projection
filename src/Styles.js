const styles = [
  {
    name: 'namria',
    land: '#E6E8E9',
    sea: '#C4D4E0',
    labels: 'black',
    borders: '#B90700',
    graticules: '#B90700',
    icon: {
      top: '#E6E8E9',
      bottom: '#C4D4E0',
    }
  },
  {
    name: 'contrast',
    land: 'white',
    sea: 'white',
    labels: 'black',
    borders: 'black',
    graticules: 'black',
    icon: {
      top: 'white',
      bottom: 'black',
    }
  },
  {
    name: 'brownie',
    land: 'brown',
    sea: 'blue',
    labels: 'white',
    borders: 'orange',
    graticules: 'orange',
    icon: {
      top: 'brown',
      bottom: 'blue',
    }
  },
  {
    name: 'orangeface',
    land: 'orange',
    sea: 'red',
    labels: 'white',
    borders: 'brown',
    graticules: 'brown',
    icon: {
      top: 'orange',
      bottom: 'red',
    }
  },
]

export default {
  list: styles,
  default: styles[0],
  isValid: (name) => {
    return styles.filter((p) => p.name === name).length > 0
  },
  get: (name) => {
    return styles.filter(s => name === s.name)[0]
  }
}
