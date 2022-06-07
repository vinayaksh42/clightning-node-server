function* hexFormatValues(buffer) {
    for (let x of buffer) {
      const hex = x.toString(16)
      yield hex.padStart(2, '0')
    }
}

module.exports = {
    hexFormatValues
}