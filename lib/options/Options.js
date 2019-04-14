'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var pkg = require('./package.json');
/**
 * Defines the options available for Bouillon along with their default values
 * which will be used if no value is provided for the option.
 * 
 * @author Robert Corponoi <robertcorponoi@gmail.com>
 * 
 * @version 0.1.0
 */


var Options =
/**
 * The name Bouillion will use for the file that contains the
 * saved data.
 * 
 * @since 0.1.0
 * 
 * @property {string}
 * 
 * @default pkg.name
 */

/**
 * The location where Bouiillion should save the text file containing
 * the saved data.
 * 
 * @since 0.1.0
 * 
 * @property {string}
 * 
 * @default process.cwd()
 */

/**
 * Indicates whether the text file will be written automatically after
 * every time data is added.
 * 
 * This is useful to solidify data however it can occur a performance
 * cost with frequent saves.
 * 
 * @since 0.1.0
 * 
 * @property {boolean}
 * 
 * @default false
 */

/**
 * An AES-256 compatible key to use for encryptin save data.
 * 
 * @since 0.1.0
 * 
 * @property {string}
 * 
 * @default ''
 */

/**
 * @param {Object} options The initialization options passed to Bouillion.
 */
function Options(options) {
  (0, _classCallCheck2.default)(this, Options);
  (0, _defineProperty2.default)(this, "name", pkg.name);
  (0, _defineProperty2.default)(this, "cwd", process.cwd());
  (0, _defineProperty2.default)(this, "autosave", false);
  (0, _defineProperty2.default)(this, "encryptionKey", '');
  Object.assign(this, options);
};

exports.default = Options;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vcHRpb25zL09wdGlvbnMudHMiXSwibmFtZXMiOlsicGtnIiwicmVxdWlyZSIsIk9wdGlvbnMiLCJvcHRpb25zIiwibmFtZSIsInByb2Nlc3MiLCJjd2QiLCJPYmplY3QiLCJhc3NpZ24iXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsR0FBRyxHQUFHQyxPQUFPLENBQUMsZ0JBQUQsQ0FBbkI7QUFFQTs7Ozs7Ozs7OztJQVFxQkMsTztBQUVuQjs7Ozs7Ozs7Ozs7QUFZQTs7Ozs7Ozs7Ozs7QUFZQTs7Ozs7Ozs7Ozs7Ozs7QUFlQTs7Ozs7Ozs7OztBQVdBOzs7QUFHQSxpQkFBWUMsT0FBWixFQUE2QjtBQUFBO0FBQUEsOENBM0NkSCxHQUFHLENBQUNJLElBMkNVO0FBQUEsNkNBL0JmQyxPQUFPLENBQUNDLEdBQVIsRUErQmU7QUFBQSxrREFoQlQsS0FnQlM7QUFBQSx1REFMTCxFQUtLO0FBRTNCQyxFQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYyxJQUFkLEVBQW9CTCxPQUFwQjtBQUVELEMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuY29uc3QgcGtnID0gcmVxdWlyZSgnLi9wYWNrYWdlLmpzb24nKTtcblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBvcHRpb25zIGF2YWlsYWJsZSBmb3IgQm91aWxsb24gYWxvbmcgd2l0aCB0aGVpciBkZWZhdWx0IHZhbHVlc1xuICogd2hpY2ggd2lsbCBiZSB1c2VkIGlmIG5vIHZhbHVlIGlzIHByb3ZpZGVkIGZvciB0aGUgb3B0aW9uLlxuICogXG4gKiBAYXV0aG9yIFJvYmVydCBDb3Jwb25vaSA8cm9iZXJ0Y29ycG9ub2lAZ21haWwuY29tPlxuICogXG4gKiBAdmVyc2lvbiAwLjEuMFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPcHRpb25zIHtcblxuICAvKipcbiAgICogVGhlIG5hbWUgQm91aWxsaW9uIHdpbGwgdXNlIGZvciB0aGUgZmlsZSB0aGF0IGNvbnRhaW5zIHRoZVxuICAgKiBzYXZlZCBkYXRhLlxuICAgKiBcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIFxuICAgKiBAcHJvcGVydHkge3N0cmluZ31cbiAgICogXG4gICAqIEBkZWZhdWx0IHBrZy5uYW1lXG4gICAqL1xuICBuYW1lOiBzdHJpbmcgPSBwa2cubmFtZTtcblxuICAvKipcbiAgICogVGhlIGxvY2F0aW9uIHdoZXJlIEJvdWlpbGxpb24gc2hvdWxkIHNhdmUgdGhlIHRleHQgZmlsZSBjb250YWluaW5nXG4gICAqIHRoZSBzYXZlZCBkYXRhLlxuICAgKiBcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIFxuICAgKiBAcHJvcGVydHkge3N0cmluZ31cbiAgICogXG4gICAqIEBkZWZhdWx0IHByb2Nlc3MuY3dkKClcbiAgICovXG4gIGN3ZDogc3RyaW5nID0gcHJvY2Vzcy5jd2QoKTtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHRleHQgZmlsZSB3aWxsIGJlIHdyaXR0ZW4gYXV0b21hdGljYWxseSBhZnRlclxuICAgKiBldmVyeSB0aW1lIGRhdGEgaXMgYWRkZWQuXG4gICAqIFxuICAgKiBUaGlzIGlzIHVzZWZ1bCB0byBzb2xpZGlmeSBkYXRhIGhvd2V2ZXIgaXQgY2FuIG9jY3VyIGEgcGVyZm9ybWFuY2VcbiAgICogY29zdCB3aXRoIGZyZXF1ZW50IHNhdmVzLlxuICAgKiBcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIFxuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59XG4gICAqIFxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgYXV0b3NhdmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogQW4gQUVTLTI1NiBjb21wYXRpYmxlIGtleSB0byB1c2UgZm9yIGVuY3J5cHRpbiBzYXZlIGRhdGEuXG4gICAqIFxuICAgKiBAc2luY2UgMC4xLjBcbiAgICogXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfVxuICAgKiBcbiAgICogQGRlZmF1bHQgJydcbiAgICovXG4gIGVuY3J5cHRpb25LZXk6IHN0cmluZyA9ICcnO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgaW5pdGlhbGl6YXRpb24gb3B0aW9ucyBwYXNzZWQgdG8gQm91aWxsaW9uLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9uczogT2JqZWN0KSB7XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9wdGlvbnMpO1xuXG4gIH1cblxufSJdfQ==