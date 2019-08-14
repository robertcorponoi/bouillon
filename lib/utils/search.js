'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKeyValue = getKeyValue;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9zZWFyY2gudHMiXSwibmFtZXMiOlsiZ2V0S2V5VmFsdWUiLCJrZXlzIiwic3RvcmUiLCJrZXkiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FBSUE7Ozs7Ozs7OztBQVNBOzs7Ozs7Ozs7O0FBVU8sU0FBU0EsV0FBVCxDQUFxQkMsSUFBckIsRUFBMENDLEtBQTFDLEVBQTZFO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBRWxGLHlCQUFrQkQsSUFBbEIsOEhBQXdCO0FBQUEsVUFBYkUsR0FBYTtBQUV0QixVQUFJRCxLQUFLLENBQUNDLEdBQUQsQ0FBVCxFQUFnQkQsS0FBSyxHQUFHQSxLQUFLLENBQUNDLEdBQUQsQ0FBYixDQUFoQixLQUVLO0FBRU47QUFSaUY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFVbEYsU0FBT0QsS0FBUDtBQUVEIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXHJcblxyXG5pbXBvcnQgU3RvcmUgZnJvbSAnLi4vaW50ZXJmYWNlcy9TdG9yZSc7XHJcblxyXG4vKipcclxuICogQ29udGFpbnMgbWV0aG9kcyBmb3Igc2VhcmNoaW5nIHRoZSBzdG9yYWdlIG9iamVjdCBmb3IgcGFydGljdWxhclxyXG4gKiBkYXRhLlxyXG4gKiBcclxuICogQGF1dGhvciBSb2JlcnQgQ29ycG9ub2kgPHJvYmVydGNvcnBvbm9pQGdtYWlsLmNvbT5cclxuICogXHJcbiAqIEB2ZXJzaW9uIDAuMS4wXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIFNlYXJjaCB0aGUgc3RvcmFnZSBvYmplY3QgYW5kIGZpbmQgYSBkZWVwIGxldmVsIGtleS5cclxuICogXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBcclxuICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBrZXlzIFRoZSBrZXkgdG8gc2VhcmNoIGZvciBzcGxpdCBpbnRvIGFuIGFycmF5LlxyXG4gKiBAcGFyYW0ge1N0b3JlfSBzdG9yZSBUaGUgc3RvcmFnZSBvYmplY3QgdG8gc2VhcmNoLlxyXG4gKiBcclxuICogQHJldHVybnMge1N0b3JlfHVuZGVmaW5lZH0gVGhlIHZhbHVlIGlmIGZvdW5kLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEtleVZhbHVlKGtleXM6IEFycmF5PHN0cmluZz4sIHN0b3JlOiBTdG9yZSk6IChTdG9yZSB8IHVuZGVmaW5lZCkge1xyXG5cclxuICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XHJcblxyXG4gICAgaWYgKHN0b3JlW2tleV0pIHN0b3JlID0gc3RvcmVba2V5XTtcclxuXHJcbiAgICBlbHNlIHJldHVybjtcclxuXHJcbiAgfVxyXG5cclxuICByZXR1cm4gc3RvcmU7XHJcblxyXG59XHJcbiJdfQ==