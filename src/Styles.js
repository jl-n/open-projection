const styles = [
  {
    name: 'namria',
    land: '#E6E8E9',
    sea: '#C4D4E0',
    labels: 'black',
    borders: '#B90700',
  },
  {
    name: 'brownie',
    land: 'brown',
    sea: 'blue',
    labels: 'white',
    borders: 'orange'
  },
  {
    name: 'orangeface',
    land: 'orange',
    sea: 'red',
    labels: 'white',
    borders: 'brown'
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
