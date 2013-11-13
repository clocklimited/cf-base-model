module.exports = window.Backbone.Model.extend({ parse: parse, toJSON: toJSON })

var clone = require('lodash.clonedeep')

/*
 * Process a parsed JSON response from an API. Casts properties back to
 * their desired type (e.g Date ISO string -> Date object)
 */
function parse(response) {
  if (response.results) return this.schemata.cast(response.results)
  return this.schemata.cast(response)
}

/*
 * Serialise the current state of the object's attributes.
 * This creates a deep clone, so if the result of toJSON() is modified
 * it does not affect the object that was toJSON()'d. This calls .toJSON()
 * on any attributes that have the method so that only model attributes
 * are serialized, as opposed to whole backbone model instances.
 */
function toJSON() {

  // Create a fresh object to house the
  // cloned attribute properties
  var attributes = {}

  // Go through each attribute
  Object.keys(this.attributes).forEach(function (key) {

    var value = this.attributes[key]

    // Check if we have some nested object with a toJSON method
    if ((value) && (typeof value.toJSON === 'function')) {
      // Execute toJSON to get the attribute's value
      attributes[key] = value.toJSON()
    } else {
      // Otherwise clone the attribute
      attributes[key] = clone(value)
    }

  }.bind(this))

  return attributes

}