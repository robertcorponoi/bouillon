'use strict'; /// <reference path="./interfaces/Store.ts" />

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Options = _interopRequireDefault(require("./options/Options"));

var search = _interopRequireWildcard(require("./utils/search"));

var fs = require('fs');

var crypto = require('crypto');

var writeFileAtomic = require('write-file-atomic');

// Reset the modules cache.
delete require.cache[require.resolve(__filename)];
/**
 * Bouillion is a non-database persistent storage solution for Node that saves
 * data in a temporary key-value storage and then later to a file on disk.
 * 
 * The data can then be retrieved either from the temporary storage or from the
 * disk back as key-value pairs.
 * 
 * When writing data to disk, it is done atomically so no data can be lost in
 * case of a mishap.
 * 
 * @author Robert Corponoi <robertcorponoi@gmail.com>
 * 
 * @version 1.1.1
 */

var Bouillion =
/*#__PURE__*/
function () {
  /**
   * The options for this instance of Bouillon.
   * 
   * @since 1.1.0
   * 
   * @property {Options}
   * @readonly
   */

  /**
   * The local storage object which will be used to store data until it gets
   * saved.
   * 
   * @since 0.1.0
   * 
   * @property {Store}
   */

  /**
   * The initialization vector to use for encryption.
   * 
   * @since 0.1.0
   * 
   * @property {Buffer}
   */

  /**
   * @param {Options} [options]
   * @param {string} [options.name='package.json.name'] The name Bouillion will use for the file that contains the saved data.
   * @param {string} [options.cwd=process.cwd()] The location where Bouiillion should save the text file containing the saved data.
   * @param {boolean} [options.autosave=false] Indicates whether the text file will be written automatically after every time data is added.
   * @param {string} [options.encryptionKey=''] An AES-256 compatible key to use for encryptin save data.
   */
  function Bouillion() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, Bouillion);
    (0, _defineProperty2["default"])(this, "options", void 0);
    (0, _defineProperty2["default"])(this, "_store", {});
    (0, _defineProperty2["default"])(this, "iv", crypto.randomBytes(16));
    this.options = new _Options["default"](options);
  }
  /**
   * Returns the local storage object as is.
   * 
   * This is a read-only operation meaning you should not modify the object
   * and pass it back to Bouillion to avoid conflicts.
   * 
   * @since 0.1.0
   * 
   * @returns {Store}
   * 
   * @example
   * 
   * const store = bouillon.store;
   */


  (0, _createClass2["default"])(Bouillion, [{
    key: "get",

    /**
     * Returns the value associated with the specified key.
     * 
     * Note that for performance reasons, this reads from the local storage object and
     * NOT the saved JSON file. You should write the data to the storage to ensure that
     * they are both up to date.
     * 
     * To read the data from the save file, use `read` instead.
     * 
     * @since 0.1.0
     * 
     * @param {string} key The key to get the value of. If it is a nested value, use dot notation syntax to define the key.
     * 
     * @returns {*} Returns the value of the key specified.
     * 
     * @example
     * 
     * const favoriteFoods = bouillion.get('favorite.foods');
     */
    value: function get(key) {
      if (!key.includes('.') && this._store.hasOwnProperty(key)) return this._store[key];
      var keys = key.split('.');
      var _store = this._store;
      return search.getKeyValue(keys, _store);
    }
    /**
     * Add a key-value pair to the local storage object.
     * 
     * Note that this modifies the local storage object but you will still have to call
     * `save` to save the data to a file. This process can be done automatically by setting
     * the `autosave` property to `true` during initialization but at a performance cost
     * for frequence saves. It is instead just recommended to call `save` manually.
     * 
     * @since 0.1.0
     * 
     * @param {string} key The key for the value to store. If storing in a nested location use dot notation syntax.
     * @param {*} value The value to associate with the key.
     * 
     * @example
     * 
     * bouillon.set('favorite.foods.pizza', 'pepperoni');
     */

  }, {
    key: "set",
    value: function set(key, value) {
      var obj = {};

      if (!key.includes('.')) {
        obj[key] = value;
        this._store = Object.assign(this._store, obj);
      } else {
        var keys = key.split('.');
        var last = keys.pop();
        var _store = this._store;
        _store = search.getKeyValue(keys, _store);
        if (_store == undefined) throw new Error('Creation of only 1 new key per set operation is supported');
        _store[last] = value;
      }
    }
    /**
     * Write and encrypt, if an encryption key is present, a file asynchronously and atomically
     * to the disk.
     * 
     * @since 0.1.0
     * @async
     * 
     * @returns {Promise<>}
     * 
     * @example
     * 
     * await bouillon.write();
     * 
     * bouillon.write().then(() => console.log('Hello!'));
     */

  }, {
    key: "write",
    value: function write() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var _store = JSON.stringify(_this._store);

        if (_this.options.encryptionKey) {
          _this.iv = crypto.randomBytes(16);
          var cipher = crypto.createCipheriv('aes-256-cbc', _this.options.encryptionKey, _this.iv);
          _store = Buffer.concat([cipher.update(_store), cipher["final"]()]);
        }

        writeFileAtomic("".concat(_this.options.cwd, "/").concat(_this.options.name, ".txt"), _store, function (err) {
          if (err) reject(err);
          resolve();
        });
      });
    }
    /**
     * Write and encrypt, if an encryption key is present, a file synchronously and atomically
     * to the disk.
     * 
     * Note that this is a synchronous operation and is generally not recommended unless you know
     * that you need to use it in this fashion.
     * 
     * @since 0.1.0
     * 
     * @example
     * 
     * bouillon.writeSync();
     */

  }, {
    key: "writeSync",
    value: function writeSync() {
      var _store = JSON.stringify(this._store);

      if (this.options.encryptionKey) {
        this.iv = crypto.randomBytes(16);
        var cipher = crypto.createCipheriv('aes-256-cbc', this.options.encryptionKey, this.iv);
        _store = Buffer.concat([cipher.update(_store), cipher["final"]()]);
      }

      writeFileAtomic.sync("".concat(this.options.cwd, "/").concat(this.options.name, ".txt"), _store);
    }
    /**
     * Asynchronously reads the data file from disk and returns the data parsed as
     * an object.
     * 
     * @since 0.1.0
     * @async
     * 
     * @returns {Promise<Store>}
     * 
     * @example
     * 
     * const data = await bouillon.read();
     */

  }, {
    key: "read",
    value: function read() {
      var _this2 = this;

      return new Promise(function (resolve) {
        var stream = fs.createReadStream("".concat(_this2.options.cwd, "/").concat(_this2.options.name, ".txt"));
        var response;
        stream.on('data', function (data) {
          if (_this2.options.encryptionKey) {
            var decipher = crypto.createDecipheriv('aes-256-cbc', _this2.options.encryptionKey, _this2.iv);
            response = JSON.parse(Buffer.concat([decipher.update(data), decipher["final"]()]));
          }

          stream.destroy();
        });
        stream.on('close', function () {
          return resolve(response);
        });
      });
    }
  }, {
    key: "store",
    get: function get() {
      return this._store;
    }
  }]);
  return Bouillion;
}();

exports["default"] = Bouillion;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJjcnlwdG8iLCJ3cml0ZUZpbGVBdG9taWMiLCJjYWNoZSIsInJlc29sdmUiLCJfX2ZpbGVuYW1lIiwiQm91aWxsaW9uIiwib3B0aW9ucyIsInJhbmRvbUJ5dGVzIiwiT3B0aW9ucyIsImtleSIsImluY2x1ZGVzIiwiX3N0b3JlIiwiaGFzT3duUHJvcGVydHkiLCJrZXlzIiwic3BsaXQiLCJzZWFyY2giLCJnZXRLZXlWYWx1ZSIsInZhbHVlIiwib2JqIiwiT2JqZWN0IiwiYXNzaWduIiwibGFzdCIsInBvcCIsInVuZGVmaW5lZCIsIkVycm9yIiwiUHJvbWlzZSIsInJlamVjdCIsIkpTT04iLCJzdHJpbmdpZnkiLCJlbmNyeXB0aW9uS2V5IiwiaXYiLCJjaXBoZXIiLCJjcmVhdGVDaXBoZXJpdiIsIkJ1ZmZlciIsImNvbmNhdCIsInVwZGF0ZSIsImN3ZCIsIm5hbWUiLCJlcnIiLCJzeW5jIiwic3RyZWFtIiwiY3JlYXRlUmVhZFN0cmVhbSIsInJlc3BvbnNlIiwib24iLCJkYXRhIiwiZGVjaXBoZXIiLCJjcmVhdGVEZWNpcGhlcml2IiwicGFyc2UiLCJkZXN0cm95Il0sIm1hcHBpbmdzIjoiQUFBQSxhLENBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUE7O0FBQ0E7O0FBTEEsSUFBTUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxJQUFNQyxNQUFNLEdBQUdELE9BQU8sQ0FBQyxRQUFELENBQXRCOztBQUNBLElBQU1FLGVBQWUsR0FBR0YsT0FBTyxDQUFDLG1CQUFELENBQS9COztBQUtBO0FBQ0EsT0FBT0EsT0FBTyxDQUFDRyxLQUFSLENBQWNILE9BQU8sQ0FBQ0ksT0FBUixDQUFnQkMsVUFBaEIsQ0FBZCxDQUFQO0FBRUE7Ozs7Ozs7Ozs7Ozs7OztJQWNxQkMsUzs7O0FBRW5COzs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7O0FBU0E7Ozs7Ozs7QUFP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QkFBSWdCLFFBQVEsR0FBRzdDLE1BQU0sQ0FBQzhDLGdCQUFQLENBQXdCLGFBQXhCLEVBQXVDLE1BQUksQ0FBQ3hDLE9BQUwsQ0FBYXVCLGFBQXBELEVBQW1FLE1BQUksQ0FBQ0MsRUFBeEUsQ0FBZjtBQUVBWSxZQUFBQSxRQUFRLEdBQUdmLElBQUksQ0FBQ29CLEtBQUwsQ0FBZ0JkLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLENBQUNXLFFBQVEsQ0FBQ1YsTUFBVCxDQUFnQlMsSUFBaEIsQ0FBRCxFQUF3QkMsUUFBUSxTQUFSLEVBQXhCLENBQWQsQ0FBaEIsQ0FBWDtBQUVEOztBQUVETCxVQUFBQSxNQUFNLENBQUNRLE9BQVA7QUFFRCxTQVpEO0FBY0FSLFFBQUFBLE1BQU0sQ0FBQ0csRUFBUCxDQUFVLE9BQVYsRUFBbUI7QUFBQSxpQkFBTXhDLE9BQU8sQ0FBQ3VDLFFBQUQsQ0FBYjtBQUFBLFNBQW5CO0FBRUQsT0F0Qk0sQ0FBUDtBQXdCRDs7O3dCQW5Na0I7QUFFakIsYUFBTyxLQUFLL0IsTUFBWjtBQUVEIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXHJcblxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9pbnRlcmZhY2VzL1N0b3JlLnRzXCIgLz5cclxuXHJcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcclxuY29uc3QgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XHJcbmNvbnN0IHdyaXRlRmlsZUF0b21pYyA9IHJlcXVpcmUoJ3dyaXRlLWZpbGUtYXRvbWljJyk7XHJcblxyXG5pbXBvcnQgT3B0aW9ucyBmcm9tICcuL29wdGlvbnMvT3B0aW9ucyc7XHJcbmltcG9ydCAqIGFzIHNlYXJjaCBmcm9tICcuL3V0aWxzL3NlYXJjaCc7XHJcblxyXG4vLyBSZXNldCB0aGUgbW9kdWxlcyBjYWNoZS5cclxuZGVsZXRlIHJlcXVpcmUuY2FjaGVbcmVxdWlyZS5yZXNvbHZlKF9fZmlsZW5hbWUpXTtcclxuXHJcbi8qKlxyXG4gKiBCb3VpbGxpb24gaXMgYSBub24tZGF0YWJhc2UgcGVyc2lzdGVudCBzdG9yYWdlIHNvbHV0aW9uIGZvciBOb2RlIHRoYXQgc2F2ZXNcclxuICogZGF0YSBpbiBhIHRlbXBvcmFyeSBrZXktdmFsdWUgc3RvcmFnZSBhbmQgdGhlbiBsYXRlciB0byBhIGZpbGUgb24gZGlzay5cclxuICogXHJcbiAqIFRoZSBkYXRhIGNhbiB0aGVuIGJlIHJldHJpZXZlZCBlaXRoZXIgZnJvbSB0aGUgdGVtcG9yYXJ5IHN0b3JhZ2Ugb3IgZnJvbSB0aGVcclxuICogZGlzayBiYWNrIGFzIGtleS12YWx1ZSBwYWlycy5cclxuICogXHJcbiAqIFdoZW4gd3JpdGluZyBkYXRhIHRvIGRpc2ssIGl0IGlzIGRvbmUgYXRvbWljYWxseSBzbyBubyBkYXRhIGNhbiBiZSBsb3N0IGluXHJcbiAqIGNhc2Ugb2YgYSBtaXNoYXAuXHJcbiAqIFxyXG4gKiBAYXV0aG9yIFJvYmVydCBDb3Jwb25vaSA8cm9iZXJ0Y29ycG9ub2lAZ21haWwuY29tPlxyXG4gKiBcclxuICogQHZlcnNpb24gMS4xLjFcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvdWlsbGlvbiB7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBvcHRpb25zIGZvciB0aGlzIGluc3RhbmNlIG9mIEJvdWlsbG9uLlxyXG4gICAqIFxyXG4gICAqIEBzaW5jZSAxLjEuMFxyXG4gICAqIFxyXG4gICAqIEBwcm9wZXJ0eSB7T3B0aW9uc31cclxuICAgKiBAcmVhZG9ubHlcclxuICAgKi9cclxuICBwcml2YXRlIG9wdGlvbnM6IE9wdGlvbnM7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBsb2NhbCBzdG9yYWdlIG9iamVjdCB3aGljaCB3aWxsIGJlIHVzZWQgdG8gc3RvcmUgZGF0YSB1bnRpbCBpdCBnZXRzXHJcbiAgICogc2F2ZWQuXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDAuMS4wXHJcbiAgICogXHJcbiAgICogQHByb3BlcnR5IHtTdG9yZX1cclxuICAgKi9cclxuICBwcml2YXRlIF9zdG9yZTogU3RvcmUgPSB7fTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGluaXRpYWxpemF0aW9uIHZlY3RvciB0byB1c2UgZm9yIGVuY3J5cHRpb24uXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDAuMS4wXHJcbiAgICogXHJcbiAgICogQHByb3BlcnR5IHtCdWZmZXJ9XHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpdjogQnVmZmVyID0gY3J5cHRvLnJhbmRvbUJ5dGVzKDE2KTtcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtPcHRpb25zfSBbb3B0aW9uc11cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubmFtZT0ncGFja2FnZS5qc29uLm5hbWUnXSBUaGUgbmFtZSBCb3VpbGxpb24gd2lsbCB1c2UgZm9yIHRoZSBmaWxlIHRoYXQgY29udGFpbnMgdGhlIHNhdmVkIGRhdGEuXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmN3ZD1wcm9jZXNzLmN3ZCgpXSBUaGUgbG9jYXRpb24gd2hlcmUgQm91aWlsbGlvbiBzaG91bGQgc2F2ZSB0aGUgdGV4dCBmaWxlIGNvbnRhaW5pbmcgdGhlIHNhdmVkIGRhdGEuXHJcbiAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5hdXRvc2F2ZT1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHRleHQgZmlsZSB3aWxsIGJlIHdyaXR0ZW4gYXV0b21hdGljYWxseSBhZnRlciBldmVyeSB0aW1lIGRhdGEgaXMgYWRkZWQuXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmVuY3J5cHRpb25LZXk9JyddIEFuIEFFUy0yNTYgY29tcGF0aWJsZSBrZXkgdG8gdXNlIGZvciBlbmNyeXB0aW4gc2F2ZSBkYXRhLlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IE9iamVjdCA9IHt9KSB7XHJcblxyXG4gICAgdGhpcy5vcHRpb25zID0gbmV3IE9wdGlvbnMob3B0aW9ucyk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgbG9jYWwgc3RvcmFnZSBvYmplY3QgYXMgaXMuXHJcbiAgICogXHJcbiAgICogVGhpcyBpcyBhIHJlYWQtb25seSBvcGVyYXRpb24gbWVhbmluZyB5b3Ugc2hvdWxkIG5vdCBtb2RpZnkgdGhlIG9iamVjdFxyXG4gICAqIGFuZCBwYXNzIGl0IGJhY2sgdG8gQm91aWxsaW9uIHRvIGF2b2lkIGNvbmZsaWN0cy5cclxuICAgKiBcclxuICAgKiBAc2luY2UgMC4xLjBcclxuICAgKiBcclxuICAgKiBAcmV0dXJucyB7U3RvcmV9XHJcbiAgICogXHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBcclxuICAgKiBjb25zdCBzdG9yZSA9IGJvdWlsbG9uLnN0b3JlO1xyXG4gICAqL1xyXG4gIGdldCBzdG9yZSgpOiBTdG9yZSB7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3N0b3JlO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGtleS5cclxuICAgKiBcclxuICAgKiBOb3RlIHRoYXQgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMsIHRoaXMgcmVhZHMgZnJvbSB0aGUgbG9jYWwgc3RvcmFnZSBvYmplY3QgYW5kXHJcbiAgICogTk9UIHRoZSBzYXZlZCBKU09OIGZpbGUuIFlvdSBzaG91bGQgd3JpdGUgdGhlIGRhdGEgdG8gdGhlIHN0b3JhZ2UgdG8gZW5zdXJlIHRoYXRcclxuICAgKiB0aGV5IGFyZSBib3RoIHVwIHRvIGRhdGUuXHJcbiAgICogXHJcbiAgICogVG8gcmVhZCB0aGUgZGF0YSBmcm9tIHRoZSBzYXZlIGZpbGUsIHVzZSBgcmVhZGAgaW5zdGVhZC5cclxuICAgKiBcclxuICAgKiBAc2luY2UgMC4xLjBcclxuICAgKiBcclxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgdG8gZ2V0IHRoZSB2YWx1ZSBvZi4gSWYgaXQgaXMgYSBuZXN0ZWQgdmFsdWUsIHVzZSBkb3Qgbm90YXRpb24gc3ludGF4IHRvIGRlZmluZSB0aGUga2V5LlxyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUga2V5IHNwZWNpZmllZC5cclxuICAgKiBcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIFxyXG4gICAqIGNvbnN0IGZhdm9yaXRlRm9vZHMgPSBib3VpbGxpb24uZ2V0KCdmYXZvcml0ZS5mb29kcycpO1xyXG4gICAqL1xyXG4gIGdldChrZXk6IHN0cmluZyk6IGFueSB7XHJcblxyXG4gICAgaWYgKCFrZXkuaW5jbHVkZXMoJy4nKSAmJiB0aGlzLl9zdG9yZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSByZXR1cm4gdGhpcy5fc3RvcmVba2V5XTtcclxuXHJcbiAgICBjb25zdCBrZXlzOiBBcnJheTxzdHJpbmc+ID0ga2V5LnNwbGl0KCcuJyk7XHJcblxyXG4gICAgY29uc3QgX3N0b3JlOiBTdG9yZSA9IHRoaXMuX3N0b3JlO1xyXG5cclxuICAgIHJldHVybiBzZWFyY2guZ2V0S2V5VmFsdWUoa2V5cywgX3N0b3JlKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGQgYSBrZXktdmFsdWUgcGFpciB0byB0aGUgbG9jYWwgc3RvcmFnZSBvYmplY3QuXHJcbiAgICogXHJcbiAgICogTm90ZSB0aGF0IHRoaXMgbW9kaWZpZXMgdGhlIGxvY2FsIHN0b3JhZ2Ugb2JqZWN0IGJ1dCB5b3Ugd2lsbCBzdGlsbCBoYXZlIHRvIGNhbGxcclxuICAgKiBgc2F2ZWAgdG8gc2F2ZSB0aGUgZGF0YSB0byBhIGZpbGUuIFRoaXMgcHJvY2VzcyBjYW4gYmUgZG9uZSBhdXRvbWF0aWNhbGx5IGJ5IHNldHRpbmdcclxuICAgKiB0aGUgYGF1dG9zYXZlYCBwcm9wZXJ0eSB0byBgdHJ1ZWAgZHVyaW5nIGluaXRpYWxpemF0aW9uIGJ1dCBhdCBhIHBlcmZvcm1hbmNlIGNvc3RcclxuICAgKiBmb3IgZnJlcXVlbmNlIHNhdmVzLiBJdCBpcyBpbnN0ZWFkIGp1c3QgcmVjb21tZW5kZWQgdG8gY2FsbCBgc2F2ZWAgbWFudWFsbHkuXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDAuMS4wXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IGZvciB0aGUgdmFsdWUgdG8gc3RvcmUuIElmIHN0b3JpbmcgaW4gYSBuZXN0ZWQgbG9jYXRpb24gdXNlIGRvdCBub3RhdGlvbiBzeW50YXguXHJcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzb2NpYXRlIHdpdGggdGhlIGtleS5cclxuICAgKiBcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIFxyXG4gICAqIGJvdWlsbG9uLnNldCgnZmF2b3JpdGUuZm9vZHMucGl6emEnLCAncGVwcGVyb25pJyk7XHJcbiAgICovXHJcbiAgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XHJcblxyXG4gICAgbGV0IG9iajogU3RvcmUgPSB7fTtcclxuXHJcbiAgICBpZiAoIWtleS5pbmNsdWRlcygnLicpKSB7XHJcblxyXG4gICAgICBvYmpba2V5XSA9IHZhbHVlO1xyXG5cclxuICAgICAgdGhpcy5fc3RvcmUgPSBPYmplY3QuYXNzaWduKHRoaXMuX3N0b3JlLCBvYmopO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICBjb25zdCBrZXlzOiBBcnJheTxzdHJpbmc+ID0ga2V5LnNwbGl0KCcuJyk7XHJcblxyXG4gICAgICBjb25zdCBsYXN0OiBzdHJpbmcgPSBrZXlzLnBvcCgpITtcclxuXHJcbiAgICAgIGxldCBfc3RvcmU6IFN0b3JlID0gdGhpcy5fc3RvcmU7XHJcblxyXG4gICAgICBfc3RvcmUgPSBzZWFyY2guZ2V0S2V5VmFsdWUoa2V5cywgX3N0b3JlKSE7XHJcblxyXG4gICAgICBpZiAoX3N0b3JlID09IHVuZGVmaW5lZCkgdGhyb3cgbmV3IEVycm9yKCdDcmVhdGlvbiBvZiBvbmx5IDEgbmV3IGtleSBwZXIgc2V0IG9wZXJhdGlvbiBpcyBzdXBwb3J0ZWQnKTtcclxuXHJcbiAgICAgIF9zdG9yZVtsYXN0XSA9IHZhbHVlO1xyXG5cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBXcml0ZSBhbmQgZW5jcnlwdCwgaWYgYW4gZW5jcnlwdGlvbiBrZXkgaXMgcHJlc2VudCwgYSBmaWxlIGFzeW5jaHJvbm91c2x5IGFuZCBhdG9taWNhbGx5XHJcbiAgICogdG8gdGhlIGRpc2suXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDAuMS4wXHJcbiAgICogQGFzeW5jXHJcbiAgICogXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8Pn1cclxuICAgKiBcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIFxyXG4gICAqIGF3YWl0IGJvdWlsbG9uLndyaXRlKCk7XHJcbiAgICogXHJcbiAgICogYm91aWxsb24ud3JpdGUoKS50aGVuKCgpID0+IGNvbnNvbGUubG9nKCdIZWxsbyEnKSk7XHJcbiAgICovXHJcbiAgd3JpdGUoKTogUHJvbWlzZTxhbnk+IHtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgbGV0IF9zdG9yZTogKHN0cmluZyB8IEJ1ZmZlcikgPSBKU09OLnN0cmluZ2lmeSh0aGlzLl9zdG9yZSk7XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVuY3J5cHRpb25LZXkpIHtcclxuXHJcbiAgICAgICAgdGhpcy5pdiA9IGNyeXB0by5yYW5kb21CeXRlcygxNik7XHJcblxyXG4gICAgICAgIGxldCBjaXBoZXI6IGFueSA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCB0aGlzLm9wdGlvbnMuZW5jcnlwdGlvbktleSwgdGhpcy5pdik7XHJcblxyXG4gICAgICAgIF9zdG9yZSA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUoX3N0b3JlKSwgY2lwaGVyLmZpbmFsKCldKTtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdyaXRlRmlsZUF0b21pYyhgJHt0aGlzLm9wdGlvbnMuY3dkfS8ke3RoaXMub3B0aW9ucy5uYW1lfS50eHRgLCBfc3RvcmUsIChlcnI6IGFueSkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoZXJyKSByZWplY3QoZXJyKTtcclxuXHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG5cclxuICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogV3JpdGUgYW5kIGVuY3J5cHQsIGlmIGFuIGVuY3J5cHRpb24ga2V5IGlzIHByZXNlbnQsIGEgZmlsZSBzeW5jaHJvbm91c2x5IGFuZCBhdG9taWNhbGx5XHJcbiAgICogdG8gdGhlIGRpc2suXHJcbiAgICogXHJcbiAgICogTm90ZSB0aGF0IHRoaXMgaXMgYSBzeW5jaHJvbm91cyBvcGVyYXRpb24gYW5kIGlzIGdlbmVyYWxseSBub3QgcmVjb21tZW5kZWQgdW5sZXNzIHlvdSBrbm93XHJcbiAgICogdGhhdCB5b3UgbmVlZCB0byB1c2UgaXQgaW4gdGhpcyBmYXNoaW9uLlxyXG4gICAqIFxyXG4gICAqIEBzaW5jZSAwLjEuMFxyXG4gICAqIFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogXHJcbiAgICogYm91aWxsb24ud3JpdGVTeW5jKCk7XHJcbiAgICovXHJcbiAgd3JpdGVTeW5jKCkge1xyXG5cclxuICAgIGxldCBfc3RvcmU6IChCdWZmZXIgfCBzdHJpbmcpID0gSlNPTi5zdHJpbmdpZnkodGhpcy5fc3RvcmUpO1xyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMuZW5jcnlwdGlvbktleSkge1xyXG5cclxuICAgICAgdGhpcy5pdiA9IGNyeXB0by5yYW5kb21CeXRlcygxNik7XHJcblxyXG4gICAgICBsZXQgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIHRoaXMub3B0aW9ucy5lbmNyeXB0aW9uS2V5LCB0aGlzLml2KTtcclxuXHJcbiAgICAgIF9zdG9yZSA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUoX3N0b3JlKSwgY2lwaGVyLmZpbmFsKCldKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgd3JpdGVGaWxlQXRvbWljLnN5bmMoYCR7dGhpcy5vcHRpb25zLmN3ZH0vJHt0aGlzLm9wdGlvbnMubmFtZX0udHh0YCwgX3N0b3JlKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBc3luY2hyb25vdXNseSByZWFkcyB0aGUgZGF0YSBmaWxlIGZyb20gZGlzayBhbmQgcmV0dXJucyB0aGUgZGF0YSBwYXJzZWQgYXNcclxuICAgKiBhbiBvYmplY3QuXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDAuMS4wXHJcbiAgICogQGFzeW5jXHJcbiAgICogXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8U3RvcmU+fVxyXG4gICAqIFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogXHJcbiAgICogY29uc3QgZGF0YSA9IGF3YWl0IGJvdWlsbG9uLnJlYWQoKTtcclxuICAgKi9cclxuICByZWFkKCk6IFByb21pc2U8U3RvcmU+IHtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcblxyXG4gICAgICBsZXQgc3RyZWFtOiBhbnkgPSBmcy5jcmVhdGVSZWFkU3RyZWFtKGAke3RoaXMub3B0aW9ucy5jd2R9LyR7dGhpcy5vcHRpb25zLm5hbWV9LnR4dGApO1xyXG5cclxuICAgICAgbGV0IHJlc3BvbnNlOiBhbnk7XHJcblxyXG4gICAgICBzdHJlYW0ub24oJ2RhdGEnLCAoZGF0YTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZW5jcnlwdGlvbktleSkge1xyXG5cclxuICAgICAgICAgIGxldCBkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIHRoaXMub3B0aW9ucy5lbmNyeXB0aW9uS2V5LCB0aGlzLml2KTtcclxuXHJcbiAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UoPGFueT5CdWZmZXIuY29uY2F0KFtkZWNpcGhlci51cGRhdGUoZGF0YSksIGRlY2lwaGVyLmZpbmFsKCldKSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RyZWFtLmRlc3Ryb3koKTtcclxuXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgc3RyZWFtLm9uKCdjbG9zZScsICgpID0+IHJlc29sdmUocmVzcG9uc2UpKTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxufVxyXG4iXX0=