'use strict'; ///<reference path="../interfaces/Store.ts" />

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9zZWFyY2gudHMiXSwibmFtZXMiOlsiZ2V0S2V5VmFsdWUiLCJrZXlzIiwic3RvcmUiLCJrZXkiXSwibWFwcGluZ3MiOiJBQUFBLGEsQ0FFQTs7QUFFQTs7Ozs7Ozs7O0FBU0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVTyxTQUFTQSxXQUFULENBQXFCQyxJQUFyQixFQUEwQ0MsS0FBMUMsRUFBNkU7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFFbEYseUJBQWtCRCxJQUFsQiw4SEFBd0I7QUFBQSxVQUFiRSxHQUFhO0FBRXRCLFVBQUlELEtBQUssQ0FBQ0MsR0FBRCxDQUFULEVBQWdCRCxLQUFLLEdBQUdBLEtBQUssQ0FBQ0MsR0FBRCxDQUFiLENBQWhCLEtBRUs7QUFFTjtBQVJpRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVVsRixTQUFPRCxLQUFQO0FBRUQiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vaW50ZXJmYWNlcy9TdG9yZS50c1wiIC8+XG5cbi8qKlxuICogQ29udGFpbnMgbWV0aG9kcyBmb3Igc2VhcmNoaW5nIHRoZSBzdG9yYWdlIG9iamVjdCBmb3IgcGFydGljdWxhclxuICogZGF0YS5cbiAqIFxuICogQGF1dGhvciBSb2JlcnQgQ29ycG9ub2kgPHJvYmVydGNvcnBvbm9pQGdtYWlsLmNvbT5cbiAqIFxuICogQHZlcnNpb24gMC4xLjBcbiAqL1xuXG4vKipcbiAqIFNlYXJjaCB0aGUgc3RvcmFnZSBvYmplY3QgYW5kIGZpbmQgYSBkZWVwIGxldmVsIGtleS5cbiAqIFxuICogQHNpbmNlIDAuMS4wXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0ga2V5cyBUaGUga2V5IHRvIHNlYXJjaCBmb3Igc3BsaXQgaW50byBhbiBhcnJheS5cbiAqIEBwYXJhbSB7U3RvcmV9IHN0b3JlIFRoZSBzdG9yYWdlIG9iamVjdCB0byBzZWFyY2guXG4gKiBcbiAqIEByZXR1cm5zIHtTdG9yZXx1bmRlZmluZWR9IFRoZSB2YWx1ZSBpZiBmb3VuZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEtleVZhbHVlKGtleXM6IEFycmF5PHN0cmluZz4sIHN0b3JlOiBTdG9yZSk6IChTdG9yZSB8IHVuZGVmaW5lZCkge1xuXG4gIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcblxuICAgIGlmIChzdG9yZVtrZXldKSBzdG9yZSA9IHN0b3JlW2tleV07XG5cbiAgICBlbHNlIHJldHVybjtcblxuICB9XG5cbiAgcmV0dXJuIHN0b3JlO1xuXG59XG4iXX0=