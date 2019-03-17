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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vcHRpb25zL09wdGlvbnMudHMiXSwibmFtZXMiOlsicGtnIiwicmVxdWlyZSIsIk9wdGlvbnMiLCJvcHRpb25zIiwibmFtZSIsInByb2Nlc3MiLCJjd2QiLCJPYmplY3QiLCJhc3NpZ24iXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsR0FBRyxHQUFHQyxPQUFPLENBQUMsZ0JBQUQsQ0FBbkI7QUFFQTs7Ozs7Ozs7OztJQVFxQkMsTztBQUVuQjs7Ozs7Ozs7Ozs7QUFZQTs7Ozs7Ozs7Ozs7QUFZQTs7Ozs7Ozs7Ozs7Ozs7QUFlQTs7Ozs7Ozs7OztBQVdBOzs7QUFHQSxpQkFBWUMsT0FBWixFQUE2QjtBQUFBO0FBQUEsOENBM0NkSCxHQUFHLENBQUNJLElBMkNVO0FBQUEsNkNBL0JmQyxPQUFPLENBQUNDLEdBQVIsRUErQmU7QUFBQSxrREFoQlQsS0FnQlM7QUFBQSx1REFMTCxFQUtLO0FBRTNCQyxFQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYyxJQUFkLEVBQW9CTCxPQUFwQjtBQUVELEMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcclxuXHJcbmNvbnN0IHBrZyA9IHJlcXVpcmUoJy4vcGFja2FnZS5qc29uJyk7XHJcblxyXG4vKipcclxuICogRGVmaW5lcyB0aGUgb3B0aW9ucyBhdmFpbGFibGUgZm9yIEJvdWlsbG9uIGFsb25nIHdpdGggdGhlaXIgZGVmYXVsdCB2YWx1ZXNcclxuICogd2hpY2ggd2lsbCBiZSB1c2VkIGlmIG5vIHZhbHVlIGlzIHByb3ZpZGVkIGZvciB0aGUgb3B0aW9uLlxyXG4gKiBcclxuICogQGF1dGhvciBSb2JlcnQgQ29ycG9ub2kgPHJvYmVydGNvcnBvbm9pQGdtYWlsLmNvbT5cclxuICogXHJcbiAqIEB2ZXJzaW9uIDAuMS4wXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPcHRpb25zIHtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIG5hbWUgQm91aWxsaW9uIHdpbGwgdXNlIGZvciB0aGUgZmlsZSB0aGF0IGNvbnRhaW5zIHRoZVxyXG4gICAqIHNhdmVkIGRhdGEuXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDAuMS4wXHJcbiAgICogXHJcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9XHJcbiAgICogXHJcbiAgICogQGRlZmF1bHQgcGtnLm5hbWVcclxuICAgKi9cclxuICBuYW1lOiBzdHJpbmcgPSBwa2cubmFtZTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGxvY2F0aW9uIHdoZXJlIEJvdWlpbGxpb24gc2hvdWxkIHNhdmUgdGhlIHRleHQgZmlsZSBjb250YWluaW5nXHJcbiAgICogdGhlIHNhdmVkIGRhdGEuXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDAuMS4wXHJcbiAgICogXHJcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9XHJcbiAgICogXHJcbiAgICogQGRlZmF1bHQgcHJvY2Vzcy5jd2QoKVxyXG4gICAqL1xyXG4gIGN3ZDogc3RyaW5nID0gcHJvY2Vzcy5jd2QoKTtcclxuXHJcbiAgLyoqXHJcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHRleHQgZmlsZSB3aWxsIGJlIHdyaXR0ZW4gYXV0b21hdGljYWxseSBhZnRlclxyXG4gICAqIGV2ZXJ5IHRpbWUgZGF0YSBpcyBhZGRlZC5cclxuICAgKiBcclxuICAgKiBUaGlzIGlzIHVzZWZ1bCB0byBzb2xpZGlmeSBkYXRhIGhvd2V2ZXIgaXQgY2FuIG9jY3VyIGEgcGVyZm9ybWFuY2VcclxuICAgKiBjb3N0IHdpdGggZnJlcXVlbnQgc2F2ZXMuXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDAuMS4wXHJcbiAgICogXHJcbiAgICogQHByb3BlcnR5IHtib29sZWFufVxyXG4gICAqIFxyXG4gICAqIEBkZWZhdWx0IGZhbHNlXHJcbiAgICovXHJcbiAgYXV0b3NhdmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqXHJcbiAgICogQW4gQUVTLTI1NiBjb21wYXRpYmxlIGtleSB0byB1c2UgZm9yIGVuY3J5cHRpbiBzYXZlIGRhdGEuXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDAuMS4wXHJcbiAgICogXHJcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9XHJcbiAgICogXHJcbiAgICogQGRlZmF1bHQgJydcclxuICAgKi9cclxuICBlbmNyeXB0aW9uS2V5OiBzdHJpbmcgPSAnJztcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIGluaXRpYWxpemF0aW9uIG9wdGlvbnMgcGFzc2VkIHRvIEJvdWlsbGlvbi5cclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBPYmplY3QpIHtcclxuXHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9wdGlvbnMpO1xyXG5cclxuICB9XHJcblxyXG59Il19