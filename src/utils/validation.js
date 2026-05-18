/**
 * @param {import('mongoose').Error.ValidationError} error
 * @returns {string}
 */
function formatMongooseValidation(error) {
  if (!error || error.name !== 'ValidationError') {
    return 'Invalid data'
  }
  const messages = Object.values(error.errors).map((e) => e.message)
  return messages.length ? messages.join('; ') : 'Invalid data'
}

module.exports = {
  formatMongooseValidation
}
