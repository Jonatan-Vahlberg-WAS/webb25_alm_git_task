function getFullTextSearch(query, useRegex = false, regexField = null) {
  if (useRegex && regexField) {
    return {
      [regexField]: {
        $regex: query,
        $options: 'i'
      }
    }
  }

  return {
    $text: {
      $search: query
    }
  }
}

module.exports = {
  getFullTextSearch
}
