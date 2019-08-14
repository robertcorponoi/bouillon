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
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return store;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9zZWFyY2gudHMiXSwibmFtZXMiOlsiZ2V0S2V5VmFsdWUiLCJrZXlzIiwic3RvcmUiLCJrZXkiXSwibWFwcGluZ3MiOiJBQUFBLGEsQ0FFQTs7QUFFQTs7Ozs7Ozs7O0FBU0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVTyxTQUFTQSxXQUFULENBQXFCQyxJQUFyQixFQUEwQ0MsS0FBMUMsRUFBNkU7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFFbEYseUJBQWtCRCxJQUFsQiw4SEFBd0I7QUFBQSxVQUFiRSxHQUFhO0FBRXRCLFVBQUlELEtBQUssQ0FBQ0MsR0FBRCxDQUFULEVBQWdCRCxLQUFLLEdBQUdBLEtBQUssQ0FBQ0MsR0FBRCxDQUFiLENBQWhCLEtBRUs7QUFFTjtBQVJpRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVVsRixTQUFPRCxLQUFQO0FBRUQiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcclxuXHJcbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2ludGVyZmFjZXMvU3RvcmUudHNcIiAvPlxyXG5cclxuLyoqXHJcbiAqIENvbnRhaW5zIG1ldGhvZHMgZm9yIHNlYXJjaGluZyB0aGUgc3RvcmFnZSBvYmplY3QgZm9yIHBhcnRpY3VsYXJcclxuICogZGF0YS5cclxuICogXHJcbiAqIEBhdXRob3IgUm9iZXJ0IENvcnBvbm9pIDxyb2JlcnRjb3Jwb25vaUBnbWFpbC5jb20+XHJcbiAqIFxyXG4gKiBAdmVyc2lvbiAwLjEuMFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBTZWFyY2ggdGhlIHN0b3JhZ2Ugb2JqZWN0IGFuZCBmaW5kIGEgZGVlcCBsZXZlbCBrZXkuXHJcbiAqIFxyXG4gKiBAc2luY2UgMC4xLjBcclxuICogXHJcbiAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0ga2V5cyBUaGUga2V5IHRvIHNlYXJjaCBmb3Igc3BsaXQgaW50byBhbiBhcnJheS5cclxuICogQHBhcmFtIHtTdG9yZX0gc3RvcmUgVGhlIHN0b3JhZ2Ugb2JqZWN0IHRvIHNlYXJjaC5cclxuICogXHJcbiAqIEByZXR1cm5zIHtTdG9yZXx1bmRlZmluZWR9IFRoZSB2YWx1ZSBpZiBmb3VuZC5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRLZXlWYWx1ZShrZXlzOiBBcnJheTxzdHJpbmc+LCBzdG9yZTogU3RvcmUpOiAoU3RvcmUgfCB1bmRlZmluZWQpIHtcclxuXHJcbiAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xyXG5cclxuICAgIGlmIChzdG9yZVtrZXldKSBzdG9yZSA9IHN0b3JlW2tleV07XHJcblxyXG4gICAgZWxzZSByZXR1cm47XHJcblxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHN0b3JlO1xyXG5cclxufVxyXG4iXX0=