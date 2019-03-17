'use strict'; /// <reference path="./interfaces/Store.ts" />

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Options = _interopRequireDefault(require("./options/Options"));

var _search = require("./utils/search");

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
 * @version 1.1.0
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
    (0, _classCallCheck2.default)(this, Bouillion);
    (0, _defineProperty2.default)(this, "options", void 0);
    (0, _defineProperty2.default)(this, "_store", {});
    (0, _defineProperty2.default)(this, "iv", crypto.randomBytes(16));
    this.options = new _Options.default(options);
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


  (0, _createClass2.default)(Bouillion, [{
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
      return (0, _search.getKeyValue)(keys, _store);
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
        _store = (0, _search.getKeyValue)(keys, _store);
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
          _store = Buffer.concat([cipher.update(_store), cipher.final()]);
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
        _store = Buffer.concat([cipher.update(_store), cipher.final()]);
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
            response = JSON.parse(Buffer.concat([decipher.update(data), decipher.final()]));
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

exports.default = Bouillion;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJjcnlwdG8iLCJ3cml0ZUZpbGVBdG9taWMiLCJjYWNoZSIsInJlc29sdmUiLCJfX2ZpbGVuYW1lIiwiQm91aWxsaW9uIiwib3B0aW9ucyIsInJhbmRvbUJ5dGVzIiwiT3B0aW9ucyIsImtleSIsImluY2x1ZGVzIiwiX3N0b3JlIiwiaGFzT3duUHJvcGVydHkiLCJrZXlzIiwic3BsaXQiLCJ2YWx1ZSIsIm9iaiIsIk9iamVjdCIsImFzc2lnbiIsImxhc3QiLCJwb3AiLCJ1bmRlZmluZWQiLCJFcnJvciIsIlByb21pc2UiLCJyZWplY3QiLCJKU09OIiwic3RyaW5naWZ5IiwiZW5jcnlwdGlvbktleSIsIml2IiwiY2lwaGVyIiwiY3JlYXRlQ2lwaGVyaXYiLCJCdWZmZXIiLCJjb25jYXQiLCJ1cGRhdGUiLCJmaW5hbCIsImN3ZCIsIm5hbWUiLCJlcnIiLCJzeW5jIiwic3RyZWFtIiwiY3JlYXRlUmVhZFN0cmVhbSIsInJlc3BvbnNlIiwib24iLCJkYXRhIiwiZGVjaXBoZXIiLCJjcmVhdGVEZWNpcGhlcml2IiwicGFyc2UiLCJkZXN0cm95Il0sIm1hcHBpbmdzIjoiQUFBQSxhLENBRUE7Ozs7Ozs7Ozs7Ozs7OztBQU1BOztBQUNBOztBQUxBLElBQU1BLEVBQUUsR0FBR0MsT0FBTyxDQUFDLElBQUQsQ0FBbEI7O0FBQ0EsSUFBTUMsTUFBTSxHQUFHRCxPQUFPLENBQUMsUUFBRCxDQUF0Qjs7QUFDQSxJQUFNRSxlQUFlLEdBQUdGLE9BQU8sQ0FBQyxtQkFBRCxDQUEvQjs7QUFLQTtBQUNBLE9BQU9BLE9BQU8sQ0FBQ0csS0FBUixDQUFjSCxPQUFPLENBQUNJLE9BQVIsQ0FBZ0JDLFVBQWhCLENBQWQsQ0FBUDtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7SUFjcUJDLFM7OztBQUVuQjs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7OztBQVVBOzs7Ozs7OztBQVNBOzs7Ozs7O0FBT0EsdUJBQWtDO0FBQUEsUUFB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QXhCLEVBQXVDLE1BQUksQ0FBQ3ZDLE9BQUwsQ0FBYXFCLGFBQXBELEVBQW1FLE1BQUksQ0FBQ0MsRUFBeEUsQ0FBZjtBQUVBYSxZQUFBQSxRQUFRLEdBQUdoQixJQUFJLENBQUNxQixLQUFMLENBQWdCZixNQUFNLENBQUNDLE1BQVAsQ0FBYyxDQUFDWSxRQUFRLENBQUNYLE1BQVQsQ0FBZ0JVLElBQWhCLENBQUQsRUFBd0JDLFFBQVEsQ0FBQ1YsS0FBVCxFQUF4QixDQUFkLENBQWhCLENBQVg7QUFFRDs7QUFFREssVUFBQUEsTUFBTSxDQUFDUSxPQUFQO0FBRUQsU0FaRDtBQWNBUixRQUFBQSxNQUFNLENBQUNHLEVBQVAsQ0FBVSxPQUFWLEVBQW1CO0FBQUEsaUJBQU12QyxPQUFPLENBQUNzQyxRQUFELENBQWI7QUFBQSxTQUFuQjtBQUVELE9BdEJNLENBQVA7QUF3QkQ7Ozt3QkFuTWtCO0FBRWpCLGFBQU8sS0FBSzlCLE1BQVo7QUFFRCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xyXG5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vaW50ZXJmYWNlcy9TdG9yZS50c1wiIC8+XHJcblxyXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XHJcbmNvbnN0IGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xyXG5jb25zdCB3cml0ZUZpbGVBdG9taWMgPSByZXF1aXJlKCd3cml0ZS1maWxlLWF0b21pYycpO1xyXG5cclxuaW1wb3J0IE9wdGlvbnMgZnJvbSAnLi9vcHRpb25zL09wdGlvbnMnO1xyXG5pbXBvcnQgeyBnZXRLZXlWYWx1ZSB9IGZyb20gJy4vdXRpbHMvc2VhcmNoJztcclxuXHJcbi8vIFJlc2V0IHRoZSBtb2R1bGVzIGNhY2hlLlxyXG5kZWxldGUgcmVxdWlyZS5jYWNoZVtyZXF1aXJlLnJlc29sdmUoX19maWxlbmFtZSldO1xyXG5cclxuLyoqXHJcbiAqIEJvdWlsbGlvbiBpcyBhIG5vbi1kYXRhYmFzZSBwZXJzaXN0ZW50IHN0b3JhZ2Ugc29sdXRpb24gZm9yIE5vZGUgdGhhdCBzYXZlc1xyXG4gKiBkYXRhIGluIGEgdGVtcG9yYXJ5IGtleS12YWx1ZSBzdG9yYWdlIGFuZCB0aGVuIGxhdGVyIHRvIGEgZmlsZSBvbiBkaXNrLlxyXG4gKiBcclxuICogVGhlIGRhdGEgY2FuIHRoZW4gYmUgcmV0cmlldmVkIGVpdGhlciBmcm9tIHRoZSB0ZW1wb3Jhcnkgc3RvcmFnZSBvciBmcm9tIHRoZVxyXG4gKiBkaXNrIGJhY2sgYXMga2V5LXZhbHVlIHBhaXJzLlxyXG4gKiBcclxuICogV2hlbiB3cml0aW5nIGRhdGEgdG8gZGlzaywgaXQgaXMgZG9uZSBhdG9taWNhbGx5IHNvIG5vIGRhdGEgY2FuIGJlIGxvc3QgaW5cclxuICogY2FzZSBvZiBhIG1pc2hhcC5cclxuICogXHJcbiAqIEBhdXRob3IgUm9iZXJ0IENvcnBvbm9pIDxyb2JlcnRjb3Jwb25vaUBnbWFpbC5jb20+XHJcbiAqIFxyXG4gKiBAdmVyc2lvbiAxLjEuMFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm91aWxsaW9uIHtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIG9wdGlvbnMgZm9yIHRoaXMgaW5zdGFuY2Ugb2YgQm91aWxsb24uXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDEuMS4wXHJcbiAgICogXHJcbiAgICogQHByb3BlcnR5IHtPcHRpb25zfVxyXG4gICAqIEByZWFkb25seVxyXG4gICAqL1xyXG4gIHByaXZhdGUgb3B0aW9uczogT3B0aW9ucztcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGxvY2FsIHN0b3JhZ2Ugb2JqZWN0IHdoaWNoIHdpbGwgYmUgdXNlZCB0byBzdG9yZSBkYXRhIHVudGlsIGl0IGdldHNcclxuICAgKiBzYXZlZC5cclxuICAgKiBcclxuICAgKiBAc2luY2UgMC4xLjBcclxuICAgKiBcclxuICAgKiBAcHJvcGVydHkge1N0b3JlfVxyXG4gICAqL1xyXG4gIHByaXZhdGUgX3N0b3JlOiBTdG9yZSA9IHt9O1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgaW5pdGlhbGl6YXRpb24gdmVjdG9yIHRvIHVzZSBmb3IgZW5jcnlwdGlvbi5cclxuICAgKiBcclxuICAgKiBAc2luY2UgMC4xLjBcclxuICAgKiBcclxuICAgKiBAcHJvcGVydHkge0J1ZmZlcn1cclxuICAgKi9cclxuICBwcml2YXRlIGl2OiBCdWZmZXIgPSBjcnlwdG8ucmFuZG9tQnl0ZXMoMTYpO1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge09wdGlvbnN9IFtvcHRpb25zXVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdwYWNrYWdlLmpzb24ubmFtZSddIFRoZSBuYW1lIEJvdWlsbGlvbiB3aWxsIHVzZSBmb3IgdGhlIGZpbGUgdGhhdCBjb250YWlucyB0aGUgc2F2ZWQgZGF0YS5cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuY3dkPXByb2Nlc3MuY3dkKCldIFRoZSBsb2NhdGlvbiB3aGVyZSBCb3VpaWxsaW9uIHNob3VsZCBzYXZlIHRoZSB0ZXh0IGZpbGUgY29udGFpbmluZyB0aGUgc2F2ZWQgZGF0YS5cclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmF1dG9zYXZlPWZhbHNlXSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdGV4dCBmaWxlIHdpbGwgYmUgd3JpdHRlbiBhdXRvbWF0aWNhbGx5IGFmdGVyIGV2ZXJ5IHRpbWUgZGF0YSBpcyBhZGRlZC5cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZW5jcnlwdGlvbktleT0nJ10gQW4gQUVTLTI1NiBjb21wYXRpYmxlIGtleSB0byB1c2UgZm9yIGVuY3J5cHRpbiBzYXZlIGRhdGEuXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Iob3B0aW9uczogT2JqZWN0ID0ge30pIHtcclxuXHJcbiAgICB0aGlzLm9wdGlvbnMgPSBuZXcgT3B0aW9ucyhvcHRpb25zKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBsb2NhbCBzdG9yYWdlIG9iamVjdCBhcyBpcy5cclxuICAgKiBcclxuICAgKiBUaGlzIGlzIGEgcmVhZC1vbmx5IG9wZXJhdGlvbiBtZWFuaW5nIHlvdSBzaG91bGQgbm90IG1vZGlmeSB0aGUgb2JqZWN0XHJcbiAgICogYW5kIHBhc3MgaXQgYmFjayB0byBCb3VpbGxpb24gdG8gYXZvaWQgY29uZmxpY3RzLlxyXG4gICAqIFxyXG4gICAqIEBzaW5jZSAwLjEuMFxyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zIHtTdG9yZX1cclxuICAgKiBcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIFxyXG4gICAqIGNvbnN0IHN0b3JlID0gYm91aWxsb24uc3RvcmU7XHJcbiAgICovXHJcbiAgZ2V0IHN0b3JlKCk6IFN0b3JlIHtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5fc3RvcmU7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBzcGVjaWZpZWQga2V5LlxyXG4gICAqIFxyXG4gICAqIE5vdGUgdGhhdCBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucywgdGhpcyByZWFkcyBmcm9tIHRoZSBsb2NhbCBzdG9yYWdlIG9iamVjdCBhbmRcclxuICAgKiBOT1QgdGhlIHNhdmVkIEpTT04gZmlsZS4gWW91IHNob3VsZCB3cml0ZSB0aGUgZGF0YSB0byB0aGUgc3RvcmFnZSB0byBlbnN1cmUgdGhhdFxyXG4gICAqIHRoZXkgYXJlIGJvdGggdXAgdG8gZGF0ZS5cclxuICAgKiBcclxuICAgKiBUbyByZWFkIHRoZSBkYXRhIGZyb20gdGhlIHNhdmUgZmlsZSwgdXNlIGByZWFkYCBpbnN0ZWFkLlxyXG4gICAqIFxyXG4gICAqIEBzaW5jZSAwLjEuMFxyXG4gICAqIFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSB0byBnZXQgdGhlIHZhbHVlIG9mLiBJZiBpdCBpcyBhIG5lc3RlZCB2YWx1ZSwgdXNlIGRvdCBub3RhdGlvbiBzeW50YXggdG8gZGVmaW5lIHRoZSBrZXkuXHJcbiAgICogXHJcbiAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBrZXkgc3BlY2lmaWVkLlxyXG4gICAqIFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogXHJcbiAgICogY29uc3QgZmF2b3JpdGVGb29kcyA9IGJvdWlsbGlvbi5nZXQoJ2Zhdm9yaXRlLmZvb2RzJyk7XHJcbiAgICovXHJcbiAgZ2V0KGtleTogc3RyaW5nKTogYW55IHtcclxuXHJcbiAgICBpZiAoIWtleS5pbmNsdWRlcygnLicpICYmIHRoaXMuX3N0b3JlLmhhc093blByb3BlcnR5KGtleSkpIHJldHVybiB0aGlzLl9zdG9yZVtrZXldO1xyXG5cclxuICAgIGNvbnN0IGtleXM6IEFycmF5PHN0cmluZz4gPSBrZXkuc3BsaXQoJy4nKTtcclxuXHJcbiAgICBjb25zdCBfc3RvcmU6IFN0b3JlID0gdGhpcy5fc3RvcmU7XHJcblxyXG4gICAgcmV0dXJuIGdldEtleVZhbHVlKGtleXMsIF9zdG9yZSk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWRkIGEga2V5LXZhbHVlIHBhaXIgdG8gdGhlIGxvY2FsIHN0b3JhZ2Ugb2JqZWN0LlxyXG4gICAqIFxyXG4gICAqIE5vdGUgdGhhdCB0aGlzIG1vZGlmaWVzIHRoZSBsb2NhbCBzdG9yYWdlIG9iamVjdCBidXQgeW91IHdpbGwgc3RpbGwgaGF2ZSB0byBjYWxsXHJcbiAgICogYHNhdmVgIHRvIHNhdmUgdGhlIGRhdGEgdG8gYSBmaWxlLiBUaGlzIHByb2Nlc3MgY2FuIGJlIGRvbmUgYXV0b21hdGljYWxseSBieSBzZXR0aW5nXHJcbiAgICogdGhlIGBhdXRvc2F2ZWAgcHJvcGVydHkgdG8gYHRydWVgIGR1cmluZyBpbml0aWFsaXphdGlvbiBidXQgYXQgYSBwZXJmb3JtYW5jZSBjb3N0XHJcbiAgICogZm9yIGZyZXF1ZW5jZSBzYXZlcy4gSXQgaXMgaW5zdGVhZCBqdXN0IHJlY29tbWVuZGVkIHRvIGNhbGwgYHNhdmVgIG1hbnVhbGx5LlxyXG4gICAqIFxyXG4gICAqIEBzaW5jZSAwLjEuMFxyXG4gICAqIFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBmb3IgdGhlIHZhbHVlIHRvIHN0b3JlLiBJZiBzdG9yaW5nIGluIGEgbmVzdGVkIGxvY2F0aW9uIHVzZSBkb3Qgbm90YXRpb24gc3ludGF4LlxyXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBrZXkuXHJcbiAgICogXHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBcclxuICAgKiBib3VpbGxvbi5zZXQoJ2Zhdm9yaXRlLmZvb2RzLnBpenphJywgJ3BlcHBlcm9uaScpO1xyXG4gICAqL1xyXG4gIHNldChrZXk6IHN0cmluZywgdmFsdWU6IGFueSkge1xyXG5cclxuICAgIGxldCBvYmo6IFN0b3JlID0ge307XHJcblxyXG4gICAgaWYgKCFrZXkuaW5jbHVkZXMoJy4nKSkge1xyXG5cclxuICAgICAgb2JqW2tleV0gPSB2YWx1ZTtcclxuXHJcbiAgICAgIHRoaXMuX3N0b3JlID0gT2JqZWN0LmFzc2lnbih0aGlzLl9zdG9yZSwgb2JqKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgY29uc3Qga2V5czogQXJyYXk8c3RyaW5nPiA9IGtleS5zcGxpdCgnLicpO1xyXG5cclxuICAgICAgY29uc3QgbGFzdDogc3RyaW5nID0ga2V5cy5wb3AoKSE7XHJcblxyXG4gICAgICBsZXQgX3N0b3JlOiBTdG9yZSA9IHRoaXMuX3N0b3JlO1xyXG5cclxuICAgICAgX3N0b3JlID0gZ2V0S2V5VmFsdWUoa2V5cywgX3N0b3JlKSE7XHJcblxyXG4gICAgICBpZiAoX3N0b3JlID09IHVuZGVmaW5lZCkgdGhyb3cgbmV3IEVycm9yKCdDcmVhdGlvbiBvZiBvbmx5IDEgbmV3IGtleSBwZXIgc2V0IG9wZXJhdGlvbiBpcyBzdXBwb3J0ZWQnKTtcclxuXHJcbiAgICAgIF9zdG9yZVtsYXN0XSA9IHZhbHVlO1xyXG5cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBXcml0ZSBhbmQgZW5jcnlwdCwgaWYgYW4gZW5jcnlwdGlvbiBrZXkgaXMgcHJlc2VudCwgYSBmaWxlIGFzeW5jaHJvbm91c2x5IGFuZCBhdG9taWNhbGx5XHJcbiAgICogdG8gdGhlIGRpc2suXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDAuMS4wXHJcbiAgICogQGFzeW5jXHJcbiAgICogXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8Pn1cclxuICAgKiBcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIFxyXG4gICAqIGF3YWl0IGJvdWlsbG9uLndyaXRlKCk7XHJcbiAgICogXHJcbiAgICogYm91aWxsb24ud3JpdGUoKS50aGVuKCgpID0+IGNvbnNvbGUubG9nKCdIZWxsbyEnKSk7XHJcbiAgICovXHJcbiAgd3JpdGUoKTogUHJvbWlzZTxhbnk+IHtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgbGV0IF9zdG9yZTogKHN0cmluZyB8IEJ1ZmZlcikgPSBKU09OLnN0cmluZ2lmeSh0aGlzLl9zdG9yZSk7XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVuY3J5cHRpb25LZXkpIHtcclxuXHJcbiAgICAgICAgdGhpcy5pdiA9IGNyeXB0by5yYW5kb21CeXRlcygxNik7XHJcblxyXG4gICAgICAgIGxldCBjaXBoZXI6IGFueSA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCB0aGlzLm9wdGlvbnMuZW5jcnlwdGlvbktleSwgdGhpcy5pdik7XHJcblxyXG4gICAgICAgIF9zdG9yZSA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUoX3N0b3JlKSwgY2lwaGVyLmZpbmFsKCldKTtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdyaXRlRmlsZUF0b21pYyhgJHt0aGlzLm9wdGlvbnMuY3dkfS8ke3RoaXMub3B0aW9ucy5uYW1lfS50eHRgLCBfc3RvcmUsIChlcnI6IGFueSkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoZXJyKSByZWplY3QoZXJyKTtcclxuXHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG5cclxuICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogV3JpdGUgYW5kIGVuY3J5cHQsIGlmIGFuIGVuY3J5cHRpb24ga2V5IGlzIHByZXNlbnQsIGEgZmlsZSBzeW5jaHJvbm91c2x5IGFuZCBhdG9taWNhbGx5XHJcbiAgICogdG8gdGhlIGRpc2suXHJcbiAgICogXHJcbiAgICogTm90ZSB0aGF0IHRoaXMgaXMgYSBzeW5jaHJvbm91cyBvcGVyYXRpb24gYW5kIGlzIGdlbmVyYWxseSBub3QgcmVjb21tZW5kZWQgdW5sZXNzIHlvdSBrbm93XHJcbiAgICogdGhhdCB5b3UgbmVlZCB0byB1c2UgaXQgaW4gdGhpcyBmYXNoaW9uLlxyXG4gICAqIFxyXG4gICAqIEBzaW5jZSAwLjEuMFxyXG4gICAqIFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogXHJcbiAgICogYm91aWxsb24ud3JpdGVTeW5jKCk7XHJcbiAgICovXHJcbiAgd3JpdGVTeW5jKCkge1xyXG5cclxuICAgIGxldCBfc3RvcmU6IChCdWZmZXIgfCBzdHJpbmcpID0gSlNPTi5zdHJpbmdpZnkodGhpcy5fc3RvcmUpO1xyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMuZW5jcnlwdGlvbktleSkge1xyXG5cclxuICAgICAgdGhpcy5pdiA9IGNyeXB0by5yYW5kb21CeXRlcygxNik7XHJcblxyXG4gICAgICBsZXQgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIHRoaXMub3B0aW9ucy5lbmNyeXB0aW9uS2V5LCB0aGlzLml2KTtcclxuXHJcbiAgICAgIF9zdG9yZSA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUoX3N0b3JlKSwgY2lwaGVyLmZpbmFsKCldKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgd3JpdGVGaWxlQXRvbWljLnN5bmMoYCR7dGhpcy5vcHRpb25zLmN3ZH0vJHt0aGlzLm9wdGlvbnMubmFtZX0udHh0YCwgX3N0b3JlKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBc3luY2hyb25vdXNseSByZWFkcyB0aGUgZGF0YSBmaWxlIGZyb20gZGlzayBhbmQgcmV0dXJucyB0aGUgZGF0YSBwYXJzZWQgYXNcclxuICAgKiBhbiBvYmplY3QuXHJcbiAgICogXHJcbiAgICogQHNpbmNlIDAuMS4wXHJcbiAgICogQGFzeW5jXHJcbiAgICogXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8U3RvcmU+fVxyXG4gICAqIFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogXHJcbiAgICogY29uc3QgZGF0YSA9IGF3YWl0IGJvdWlsbG9uLnJlYWQoKTtcclxuICAgKi9cclxuICByZWFkKCk6IFByb21pc2U8U3RvcmU+IHtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcblxyXG4gICAgICBsZXQgc3RyZWFtOiBhbnkgPSBmcy5jcmVhdGVSZWFkU3RyZWFtKGAke3RoaXMub3B0aW9ucy5jd2R9LyR7dGhpcy5vcHRpb25zLm5hbWV9LnR4dGApO1xyXG5cclxuICAgICAgbGV0IHJlc3BvbnNlOiBhbnk7XHJcblxyXG4gICAgICBzdHJlYW0ub24oJ2RhdGEnLCAoZGF0YTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZW5jcnlwdGlvbktleSkge1xyXG5cclxuICAgICAgICAgIGxldCBkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIHRoaXMub3B0aW9ucy5lbmNyeXB0aW9uS2V5LCB0aGlzLml2KTtcclxuXHJcbiAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UoPGFueT5CdWZmZXIuY29uY2F0KFtkZWNpcGhlci51cGRhdGUoZGF0YSksIGRlY2lwaGVyLmZpbmFsKCldKSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RyZWFtLmRlc3Ryb3koKTtcclxuXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgc3RyZWFtLm9uKCdjbG9zZScsICgpID0+IHJlc29sdmUocmVzcG9uc2UpKTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxufSJdfQ==