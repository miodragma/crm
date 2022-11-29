export const filterByAscAndDesc = (data, order, property) => {
  return data.sort((a, b) => {
    if (order === 'DESCENDING') {
      return a[property].toLowerCase() > b[property].toLowerCase() ? -1 : 1
    }
    return a[property].toLowerCase() < b[property].toLowerCase() ? -1 : 1
  })
}
