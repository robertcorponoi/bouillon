'use strict'; /// <reference path="../interfaces/Store.ts" />

/**
 * Contains methods for searching the storage object for particular
 * data.
 * 
 * @author Robert Corponoi <robertcorponoi@gmail.com>
 * 
 * @version 0.1.0
 */

/**
 * Search the storage object and find a deep level key.
 * 
 * @since 0.1.0
 * 
 * @param {Array<string>} keys The key to search for split into an array.
 * @param {Store} store The storage object to search.
 * 
 * @returns {Store|undefined} The value if found.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKeyValue = getKeyValue;

function getKeyValue(keys, store) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;
      if (store[key]) store = store[key];else return;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return store;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9zZWFyY2gudHMiXSwibmFtZXMiOlsiZ2V0S2V5VmFsdWUiLCJrZXlzIiwic3RvcmUiLCJrZXkiXSwibWFwcGluZ3MiOiJBQUFBLGEsQ0FFQTs7QUFFQTs7Ozs7Ozs7O0FBU0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVTyxTQUFTQSxXQUFULENBQXFCQyxJQUFyQixFQUEwQ0MsS0FBMUMsRUFBNkU7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFFbEYseUJBQWtCRCxJQUFsQiw4SEFBd0I7QUFBQSxVQUFiRSxHQUFhO0FBRXRCLFVBQUlELEtBQUssQ0FBQ0MsR0FBRCxDQUFULEVBQWdCRCxLQUFLLEdBQUdBLEtBQUssQ0FBQ0MsR0FBRCxDQUFiLENBQWhCLEtBRUs7QUFFTjtBQVJpRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVVsRixTQUFPRCxLQUFQO0FBRUQiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcclxuXHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9pbnRlcmZhY2VzL1N0b3JlLnRzXCIgLz5cclxuXHJcbi8qKlxyXG4gKiBDb250YWlucyBtZXRob2RzIGZvciBzZWFyY2hpbmcgdGhlIHN0b3JhZ2Ugb2JqZWN0IGZvciBwYXJ0aWN1bGFyXHJcbiAqIGRhdGEuXHJcbiAqIFxyXG4gKiBAYXV0aG9yIFJvYmVydCBDb3Jwb25vaSA8cm9iZXJ0Y29ycG9ub2lAZ21haWwuY29tPlxyXG4gKiBcclxuICogQHZlcnNpb24gMC4xLjBcclxuICovXHJcblxyXG4vKipcclxuICogU2VhcmNoIHRoZSBzdG9yYWdlIG9iamVjdCBhbmQgZmluZCBhIGRlZXAgbGV2ZWwga2V5LlxyXG4gKiBcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqIFxyXG4gKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IGtleXMgVGhlIGtleSB0byBzZWFyY2ggZm9yIHNwbGl0IGludG8gYW4gYXJyYXkuXHJcbiAqIEBwYXJhbSB7U3RvcmV9IHN0b3JlIFRoZSBzdG9yYWdlIG9iamVjdCB0byBzZWFyY2guXHJcbiAqIFxyXG4gKiBAcmV0dXJucyB7U3RvcmV8dW5kZWZpbmVkfSBUaGUgdmFsdWUgaWYgZm91bmQuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0S2V5VmFsdWUoa2V5czogQXJyYXk8c3RyaW5nPiwgc3RvcmU6IFN0b3JlKTogKFN0b3JlIHwgdW5kZWZpbmVkKSB7XHJcblxyXG4gIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcclxuXHJcbiAgICBpZiAoc3RvcmVba2V5XSkgc3RvcmUgPSBzdG9yZVtrZXldO1xyXG5cclxuICAgIGVsc2UgcmV0dXJuO1xyXG5cclxuICB9XHJcblxyXG4gIHJldHVybiBzdG9yZTtcclxuXHJcbn0iXX0=