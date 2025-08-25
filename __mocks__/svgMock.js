const React = require('react')
function SvgMock(props) {
  return React.createElement('svg', props)
}
SvgMock.displayName = 'SvgMock'
module.exports = SvgMock
module.exports.ReactComponent = SvgMock
