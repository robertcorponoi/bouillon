'use strict';

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
 * Bouillion is a non-database persistent storage solution for Node that saves data in a temporary key-value 
 * storage and then later to a file on disk.
 * 
 * The data can then be retrieved either from the temporary storage or from the disk back as key-value pairs.
 * 
 * When writing data to disk, it is done atomically so no data can be lost in case of a mishap.
 * 
 * @author Robert Corponoi <robertcorponoi@gmail.com>
 */

var Bouillion = /*#__PURE__*/function () {
  /**
   * The options for this instance of Bouillon.
   * 
   * @property {Options}
   * @readonly
   */

  /**
   * The local storage object which will be used to store data until it gets
   * saved.
   * 
   * @property {Store}
   */

  /**
   * The initialization vector to use for encryption.
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
   * This is a read-only operation meaning you should not modify the object and pass it back to Bouillion 
   * to avoid conflicts.
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
     * Note that for performance reasons, this reads from the local storage object and NOT the saved JSON file. 
     * You should write the data to the storage to ensure that they are both up to date.
     * 
     * To read the data from the save file, use `read` instead.
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
     * Note that this modifies the local storage object but you will still have to call `save` to save the data to a file.  This process 
     * can be done automatically by setting the `autosave` property to `true` during initialization but at a performance cost for frequent 
     * saves. It is instead just recommended to call `save` manually.
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
     * Write and encrypt, if an encryption key is present, a file asynchronously and atomically to the disk.
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
     * Write and encrypt, if an encryption key is present, a file synchronously and atomically to the disk.
     * 
     * Note that this is a synchronous operation and is generally not recommended unless you know that you need to use it in this fashion.
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
     * Asynchronously reads the data file from disk and returns the data parsed as an object.
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
    } // /**
    //  * Removes a piece of data from the store.
    //  * 
    //  * @param {string} key The key for the value to delete. If storing in a nested location use dot notation syntax.
    //  * @param {boolean} [deleteKey=false] If set to true, then the key itself will be deleted.
    //  * 
    //  * @example
    //  * 
    //  * bouillion.clear('favorite.foods.pizza', true);
    //  */
    // remove(key: string, deleteKey: boolean = false) {
    //   const keys: Array<string> = key.split('.');
    //   for (let entry in this._store) {
    //     for (const k of keys) {
    //       console.log(entry, k, entry === k);
    //       if (entry === k) {
    //         if (keys.indexOf(k) !== keys.length -1) continue;
    //         delete this._store[k];
    //         return;
    //       }
    //     }
    //   }
    // }

    /**
     * Clears all data from the store.
     * 
     * @example
     * 
     * bouillon.clear();
     */

  }, {
    key: "clear",
    value: function clear() {
      this._store = {};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJjcnlwdG8iLCJ3cml0ZUZpbGVBdG9taWMiLCJjYWNoZSIsInJlc29sdmUiLCJfX2ZpbGVuYW1lIiwiQm91aWxsaW9uIiwib3B0aW9ucyIsInJhbmRvbUJ5dGVzIiwiT3B0aW9ucyIsImtleSIsImluY2x1ZGVzIiwiX3N0b3JlIiwiaGFzT3duUHJvcGVydHkiLCJrZXlzIiwic3BsaXQiLCJzZWFyY2giLCJnZXRLZXlWYWx1ZSIsInZhbHVlIiwib2JqIiwiT2JqZWN0IiwiYXNzaWduIiwibGFzdCIsInBvcCIsInVuZGVmaW5lZCIsIkVycm9yIiwiUHJvbWlzZSIsInJlamVjdCIsIkpTT04iLCJzdHJpbmdpZnkiLCJlbmNyeXB0aW9uS2V5IiwiaXYiLCJjaXBoZXIiLCJjcmVhdGVDaXBoZXJpdiIsIkJ1ZmZlciIsImNvbmNhdCIsInVwZGF0ZSIsImN3ZCIsIm5hbWUiLCJlcnIiLCJzeW5jIiwic3RyZWFtIiwiY3JlYXRlUmVhZFN0cmVhbSIsInJlc3BvbnNlIiwib24iLCJkYXRhIiwiZGVjaXBoZXIiLCJjcmVhdGVEZWNpcGhlcml2IiwicGFyc2UiLCJkZXN0cm95Il0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQTs7QUFDQTs7QUFOQSxJQUFNQSxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUNBLElBQU1DLE1BQU0sR0FBR0QsT0FBTyxDQUFDLFFBQUQsQ0FBdEI7O0FBQ0EsSUFBTUUsZUFBZSxHQUFHRixPQUFPLENBQUMsbUJBQUQsQ0FBL0I7O0FBTUE7QUFDQSxPQUFPQSxPQUFPLENBQUNHLEtBQVIsQ0FBY0gsT0FBTyxDQUFDSSxPQUFSLENBQWdCQyxVQUFoQixDQUFkLENBQVA7QUFFQTs7Ozs7Ozs7Ozs7SUFVcUJDLFM7QUFFbkI7Ozs7Ozs7QUFRQTs7Ozs7OztBQVFBOzs7Ozs7QUFPQTs7Ozs7OztBQU9BLHVCQUFrQztBQUFBLFFBQXRC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d0IsYUFBeEIsRUFBdUMsTUFBSSxDQUFDeEMsT0FBTCxDQUFhdUIsYUFBcEQsRUFBbUUsTUFBSSxDQUFDQyxFQUF4RSxDQUFmO0FBRUFZLFlBQUFBLFFBQVEsR0FBR2YsSUFBSSxDQUFDb0IsS0FBTCxDQUFnQmQsTUFBTSxDQUFDQyxNQUFQLENBQWMsQ0FBQ1csUUFBUSxDQUFDVixNQUFULENBQWdCUyxJQUFoQixDQUFELEVBQXdCQyxRQUFRLFNBQVIsRUFBeEIsQ0FBZCxDQUFoQixDQUFYO0FBRUQ7O0FBRURMLFVBQUFBLE1BQU0sQ0FBQ1EsT0FBUDtBQUVELFNBWkQ7QUFjQVIsUUFBQUEsTUFBTSxDQUFDRyxFQUFQLENBQVUsT0FBVixFQUFtQjtBQUFBLGlCQUFNeEMsT0FBTyxDQUFDdUMsUUFBRCxDQUFiO0FBQUEsU0FBbkI7QUFFRCxPQXRCTSxDQUFQO0FBd0JELEssQ0FFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBOztBQUVBOzs7Ozs7Ozs7OzRCQU9RO0FBRU4sV0FBSy9CLE1BQUwsR0FBYyxFQUFkO0FBRUQ7Ozt3QkFsT2tCO0FBRWpCLGFBQU8sS0FBS0EsTUFBWjtBQUVEIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXHJcblxyXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XHJcbmNvbnN0IGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xyXG5jb25zdCB3cml0ZUZpbGVBdG9taWMgPSByZXF1aXJlKCd3cml0ZS1maWxlLWF0b21pYycpO1xyXG5cclxuaW1wb3J0IFN0b3JlIGZyb20gJy4vaW50ZXJmYWNlcy9TdG9yZSc7XHJcbmltcG9ydCBPcHRpb25zIGZyb20gJy4vb3B0aW9ucy9PcHRpb25zJztcclxuaW1wb3J0ICogYXMgc2VhcmNoIGZyb20gJy4vdXRpbHMvc2VhcmNoJztcclxuXHJcbi8vIFJlc2V0IHRoZSBtb2R1bGVzIGNhY2hlLlxyXG5kZWxldGUgcmVxdWlyZS5jYWNoZVtyZXF1aXJlLnJlc29sdmUoX19maWxlbmFtZSldO1xyXG5cclxuLyoqXHJcbiAqIEJvdWlsbGlvbiBpcyBhIG5vbi1kYXRhYmFzZSBwZXJzaXN0ZW50IHN0b3JhZ2Ugc29sdXRpb24gZm9yIE5vZGUgdGhhdCBzYXZlcyBkYXRhIGluIGEgdGVtcG9yYXJ5IGtleS12YWx1ZSBcclxuICogc3RvcmFnZSBhbmQgdGhlbiBsYXRlciB0byBhIGZpbGUgb24gZGlzay5cclxuICogXHJcbiAqIFRoZSBkYXRhIGNhbiB0aGVuIGJlIHJldHJpZXZlZCBlaXRoZXIgZnJvbSB0aGUgdGVtcG9yYXJ5IHN0b3JhZ2Ugb3IgZnJvbSB0aGUgZGlzayBiYWNrIGFzIGtleS12YWx1ZSBwYWlycy5cclxuICogXHJcbiAqIFdoZW4gd3JpdGluZyBkYXRhIHRvIGRpc2ssIGl0IGlzIGRvbmUgYXRvbWljYWxseSBzbyBubyBkYXRhIGNhbiBiZSBsb3N0IGluIGNhc2Ugb2YgYSBtaXNoYXAuXHJcbiAqIFxyXG4gKiBAYXV0aG9yIFJvYmVydCBDb3Jwb25vaSA8cm9iZXJ0Y29ycG9ub2lAZ21haWwuY29tPlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm91aWxsaW9uIHtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIG9wdGlvbnMgZm9yIHRoaXMgaW5zdGFuY2Ugb2YgQm91aWxsb24uXHJcbiAgICogXHJcbiAgICogQHByb3BlcnR5IHtPcHRpb25zfVxyXG4gICAqIEByZWFkb25seVxyXG4gICAqL1xyXG4gIHByaXZhdGUgb3B0aW9uczogT3B0aW9ucztcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGxvY2FsIHN0b3JhZ2Ugb2JqZWN0IHdoaWNoIHdpbGwgYmUgdXNlZCB0byBzdG9yZSBkYXRhIHVudGlsIGl0IGdldHNcclxuICAgKiBzYXZlZC5cclxuICAgKiBcclxuICAgKiBAcHJvcGVydHkge1N0b3JlfVxyXG4gICAqL1xyXG4gIHByaXZhdGUgX3N0b3JlOiBTdG9yZSA9IHt9O1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgaW5pdGlhbGl6YXRpb24gdmVjdG9yIHRvIHVzZSBmb3IgZW5jcnlwdGlvbi5cclxuICAgKiBcclxuICAgKiBAcHJvcGVydHkge0J1ZmZlcn1cclxuICAgKi9cclxuICBwcml2YXRlIGl2OiBCdWZmZXIgPSBjcnlwdG8ucmFuZG9tQnl0ZXMoMTYpO1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge09wdGlvbnN9IFtvcHRpb25zXVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdwYWNrYWdlLmpzb24ubmFtZSddIFRoZSBuYW1lIEJvdWlsbGlvbiB3aWxsIHVzZSBmb3IgdGhlIGZpbGUgdGhhdCBjb250YWlucyB0aGUgc2F2ZWQgZGF0YS5cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuY3dkPXByb2Nlc3MuY3dkKCldIFRoZSBsb2NhdGlvbiB3aGVyZSBCb3VpaWxsaW9uIHNob3VsZCBzYXZlIHRoZSB0ZXh0IGZpbGUgY29udGFpbmluZyB0aGUgc2F2ZWQgZGF0YS5cclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmF1dG9zYXZlPWZhbHNlXSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdGV4dCBmaWxlIHdpbGwgYmUgd3JpdHRlbiBhdXRvbWF0aWNhbGx5IGFmdGVyIGV2ZXJ5IHRpbWUgZGF0YSBpcyBhZGRlZC5cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZW5jcnlwdGlvbktleT0nJ10gQW4gQUVTLTI1NiBjb21wYXRpYmxlIGtleSB0byB1c2UgZm9yIGVuY3J5cHRpbiBzYXZlIGRhdGEuXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Iob3B0aW9uczogT2JqZWN0ID0ge30pIHtcclxuXHJcbiAgICB0aGlzLm9wdGlvbnMgPSBuZXcgT3B0aW9ucyhvcHRpb25zKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBsb2NhbCBzdG9yYWdlIG9iamVjdCBhcyBpcy5cclxuICAgKiBcclxuICAgKiBUaGlzIGlzIGEgcmVhZC1vbmx5IG9wZXJhdGlvbiBtZWFuaW5nIHlvdSBzaG91bGQgbm90IG1vZGlmeSB0aGUgb2JqZWN0IGFuZCBwYXNzIGl0IGJhY2sgdG8gQm91aWxsaW9uIFxyXG4gICAqIHRvIGF2b2lkIGNvbmZsaWN0cy5cclxuICAgKiBcclxuICAgKiBAcmV0dXJucyB7U3RvcmV9XHJcbiAgICogXHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBcclxuICAgKiBjb25zdCBzdG9yZSA9IGJvdWlsbG9uLnN0b3JlO1xyXG4gICAqL1xyXG4gIGdldCBzdG9yZSgpOiBTdG9yZSB7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3N0b3JlO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGtleS5cclxuICAgKiBcclxuICAgKiBOb3RlIHRoYXQgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMsIHRoaXMgcmVhZHMgZnJvbSB0aGUgbG9jYWwgc3RvcmFnZSBvYmplY3QgYW5kIE5PVCB0aGUgc2F2ZWQgSlNPTiBmaWxlLiBcclxuICAgKiBZb3Ugc2hvdWxkIHdyaXRlIHRoZSBkYXRhIHRvIHRoZSBzdG9yYWdlIHRvIGVuc3VyZSB0aGF0IHRoZXkgYXJlIGJvdGggdXAgdG8gZGF0ZS5cclxuICAgKiBcclxuICAgKiBUbyByZWFkIHRoZSBkYXRhIGZyb20gdGhlIHNhdmUgZmlsZSwgdXNlIGByZWFkYCBpbnN0ZWFkLlxyXG4gICAqIFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSB0byBnZXQgdGhlIHZhbHVlIG9mLiBJZiBpdCBpcyBhIG5lc3RlZCB2YWx1ZSwgdXNlIGRvdCBub3RhdGlvbiBzeW50YXggdG8gZGVmaW5lIHRoZSBrZXkuXHJcbiAgICogXHJcbiAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBrZXkgc3BlY2lmaWVkLlxyXG4gICAqIFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogXHJcbiAgICogY29uc3QgZmF2b3JpdGVGb29kcyA9IGJvdWlsbGlvbi5nZXQoJ2Zhdm9yaXRlLmZvb2RzJyk7XHJcbiAgICovXHJcbiAgZ2V0KGtleTogc3RyaW5nKTogYW55IHtcclxuXHJcbiAgICBpZiAoIWtleS5pbmNsdWRlcygnLicpICYmIHRoaXMuX3N0b3JlLmhhc093blByb3BlcnR5KGtleSkpIHJldHVybiB0aGlzLl9zdG9yZVtrZXldO1xyXG5cclxuICAgIGNvbnN0IGtleXM6IEFycmF5PHN0cmluZz4gPSBrZXkuc3BsaXQoJy4nKTtcclxuXHJcbiAgICBjb25zdCBfc3RvcmU6IFN0b3JlID0gdGhpcy5fc3RvcmU7XHJcblxyXG4gICAgcmV0dXJuIHNlYXJjaC5nZXRLZXlWYWx1ZShrZXlzLCBfc3RvcmUpO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZCBhIGtleS12YWx1ZSBwYWlyIHRvIHRoZSBsb2NhbCBzdG9yYWdlIG9iamVjdC5cclxuICAgKiBcclxuICAgKiBOb3RlIHRoYXQgdGhpcyBtb2RpZmllcyB0aGUgbG9jYWwgc3RvcmFnZSBvYmplY3QgYnV0IHlvdSB3aWxsIHN0aWxsIGhhdmUgdG8gY2FsbCBgc2F2ZWAgdG8gc2F2ZSB0aGUgZGF0YSB0byBhIGZpbGUuICBUaGlzIHByb2Nlc3MgXHJcbiAgICogY2FuIGJlIGRvbmUgYXV0b21hdGljYWxseSBieSBzZXR0aW5nIHRoZSBgYXV0b3NhdmVgIHByb3BlcnR5IHRvIGB0cnVlYCBkdXJpbmcgaW5pdGlhbGl6YXRpb24gYnV0IGF0IGEgcGVyZm9ybWFuY2UgY29zdCBmb3IgZnJlcXVlbnQgXHJcbiAgICogc2F2ZXMuIEl0IGlzIGluc3RlYWQganVzdCByZWNvbW1lbmRlZCB0byBjYWxsIGBzYXZlYCBtYW51YWxseS5cclxuICAgKiBcclxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgZm9yIHRoZSB2YWx1ZSB0byBzdG9yZS4gSWYgc3RvcmluZyBpbiBhIG5lc3RlZCBsb2NhdGlvbiB1c2UgZG90IG5vdGF0aW9uIHN5bnRheC5cclxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NvY2lhdGUgd2l0aCB0aGUga2V5LlxyXG4gICAqIFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogXHJcbiAgICogYm91aWxsb24uc2V0KCdmYXZvcml0ZS5mb29kcy5waXp6YScsICdwZXBwZXJvbmknKTtcclxuICAgKi9cclxuICBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcclxuXHJcbiAgICBsZXQgb2JqOiBTdG9yZSA9IHt9O1xyXG5cclxuICAgIGlmICgha2V5LmluY2x1ZGVzKCcuJykpIHtcclxuXHJcbiAgICAgIG9ialtrZXldID0gdmFsdWU7XHJcblxyXG4gICAgICB0aGlzLl9zdG9yZSA9IE9iamVjdC5hc3NpZ24odGhpcy5fc3RvcmUsIG9iaik7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIGNvbnN0IGtleXM6IEFycmF5PHN0cmluZz4gPSBrZXkuc3BsaXQoJy4nKTtcclxuXHJcbiAgICAgIGNvbnN0IGxhc3Q6IHN0cmluZyA9IGtleXMucG9wKCkhO1xyXG5cclxuICAgICAgbGV0IF9zdG9yZTogU3RvcmUgPSB0aGlzLl9zdG9yZTtcclxuXHJcbiAgICAgIF9zdG9yZSA9IHNlYXJjaC5nZXRLZXlWYWx1ZShrZXlzLCBfc3RvcmUpITtcclxuXHJcbiAgICAgIGlmIChfc3RvcmUgPT0gdW5kZWZpbmVkKSB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0aW9uIG9mIG9ubHkgMSBuZXcga2V5IHBlciBzZXQgb3BlcmF0aW9uIGlzIHN1cHBvcnRlZCcpO1xyXG5cclxuICAgICAgX3N0b3JlW2xhc3RdID0gdmFsdWU7XHJcblxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFdyaXRlIGFuZCBlbmNyeXB0LCBpZiBhbiBlbmNyeXB0aW9uIGtleSBpcyBwcmVzZW50LCBhIGZpbGUgYXN5bmNocm9ub3VzbHkgYW5kIGF0b21pY2FsbHkgdG8gdGhlIGRpc2suXHJcbiAgICogXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8Pn1cclxuICAgKiBcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIFxyXG4gICAqIGF3YWl0IGJvdWlsbG9uLndyaXRlKCk7XHJcbiAgICogXHJcbiAgICogYm91aWxsb24ud3JpdGUoKS50aGVuKCgpID0+IGNvbnNvbGUubG9nKCdIZWxsbyEnKSk7XHJcbiAgICovXHJcbiAgd3JpdGUoKTogUHJvbWlzZTxhbnk+IHtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgbGV0IF9zdG9yZTogKHN0cmluZyB8IEJ1ZmZlcikgPSBKU09OLnN0cmluZ2lmeSh0aGlzLl9zdG9yZSk7XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVuY3J5cHRpb25LZXkpIHtcclxuXHJcbiAgICAgICAgdGhpcy5pdiA9IGNyeXB0by5yYW5kb21CeXRlcygxNik7XHJcblxyXG4gICAgICAgIGxldCBjaXBoZXI6IGFueSA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCB0aGlzLm9wdGlvbnMuZW5jcnlwdGlvbktleSwgdGhpcy5pdik7XHJcblxyXG4gICAgICAgIF9zdG9yZSA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUoX3N0b3JlKSwgY2lwaGVyLmZpbmFsKCldKTtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdyaXRlRmlsZUF0b21pYyhgJHt0aGlzLm9wdGlvbnMuY3dkfS8ke3RoaXMub3B0aW9ucy5uYW1lfS50eHRgLCBfc3RvcmUsIChlcnI6IGFueSkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoZXJyKSByZWplY3QoZXJyKTtcclxuXHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG5cclxuICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogV3JpdGUgYW5kIGVuY3J5cHQsIGlmIGFuIGVuY3J5cHRpb24ga2V5IGlzIHByZXNlbnQsIGEgZmlsZSBzeW5jaHJvbm91c2x5IGFuZCBhdG9taWNhbGx5IHRvIHRoZSBkaXNrLlxyXG4gICAqIFxyXG4gICAqIE5vdGUgdGhhdCB0aGlzIGlzIGEgc3luY2hyb25vdXMgb3BlcmF0aW9uIGFuZCBpcyBnZW5lcmFsbHkgbm90IHJlY29tbWVuZGVkIHVubGVzcyB5b3Uga25vdyB0aGF0IHlvdSBuZWVkIHRvIHVzZSBpdCBpbiB0aGlzIGZhc2hpb24uXHJcbiAgICogXHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBcclxuICAgKiBib3VpbGxvbi53cml0ZVN5bmMoKTtcclxuICAgKi9cclxuICB3cml0ZVN5bmMoKSB7XHJcblxyXG4gICAgbGV0IF9zdG9yZTogKEJ1ZmZlciB8IHN0cmluZykgPSBKU09OLnN0cmluZ2lmeSh0aGlzLl9zdG9yZSk7XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5lbmNyeXB0aW9uS2V5KSB7XHJcblxyXG4gICAgICB0aGlzLml2ID0gY3J5cHRvLnJhbmRvbUJ5dGVzKDE2KTtcclxuXHJcbiAgICAgIGxldCBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgdGhpcy5vcHRpb25zLmVuY3J5cHRpb25LZXksIHRoaXMuaXYpO1xyXG5cclxuICAgICAgX3N0b3JlID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShfc3RvcmUpLCBjaXBoZXIuZmluYWwoKV0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB3cml0ZUZpbGVBdG9taWMuc3luYyhgJHt0aGlzLm9wdGlvbnMuY3dkfS8ke3RoaXMub3B0aW9ucy5uYW1lfS50eHRgLCBfc3RvcmUpO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFzeW5jaHJvbm91c2x5IHJlYWRzIHRoZSBkYXRhIGZpbGUgZnJvbSBkaXNrIGFuZCByZXR1cm5zIHRoZSBkYXRhIHBhcnNlZCBhcyBhbiBvYmplY3QuXHJcbiAgICogXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8U3RvcmU+fVxyXG4gICAqIFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogXHJcbiAgICogY29uc3QgZGF0YSA9IGF3YWl0IGJvdWlsbG9uLnJlYWQoKTtcclxuICAgKi9cclxuICByZWFkKCk6IFByb21pc2U8U3RvcmU+IHtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcblxyXG4gICAgICBsZXQgc3RyZWFtOiBhbnkgPSBmcy5jcmVhdGVSZWFkU3RyZWFtKGAke3RoaXMub3B0aW9ucy5jd2R9LyR7dGhpcy5vcHRpb25zLm5hbWV9LnR4dGApO1xyXG5cclxuICAgICAgbGV0IHJlc3BvbnNlOiBhbnk7XHJcblxyXG4gICAgICBzdHJlYW0ub24oJ2RhdGEnLCAoZGF0YTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZW5jcnlwdGlvbktleSkge1xyXG5cclxuICAgICAgICAgIGxldCBkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIHRoaXMub3B0aW9ucy5lbmNyeXB0aW9uS2V5LCB0aGlzLml2KTtcclxuXHJcbiAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UoPGFueT5CdWZmZXIuY29uY2F0KFtkZWNpcGhlci51cGRhdGUoZGF0YSksIGRlY2lwaGVyLmZpbmFsKCldKSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RyZWFtLmRlc3Ryb3koKTtcclxuXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgc3RyZWFtLm9uKCdjbG9zZScsICgpID0+IHJlc29sdmUocmVzcG9uc2UpKTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICAvLyAvKipcclxuICAvLyAgKiBSZW1vdmVzIGEgcGllY2Ugb2YgZGF0YSBmcm9tIHRoZSBzdG9yZS5cclxuICAvLyAgKiBcclxuICAvLyAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgZm9yIHRoZSB2YWx1ZSB0byBkZWxldGUuIElmIHN0b3JpbmcgaW4gYSBuZXN0ZWQgbG9jYXRpb24gdXNlIGRvdCBub3RhdGlvbiBzeW50YXguXHJcbiAgLy8gICogQHBhcmFtIHtib29sZWFufSBbZGVsZXRlS2V5PWZhbHNlXSBJZiBzZXQgdG8gdHJ1ZSwgdGhlbiB0aGUga2V5IGl0c2VsZiB3aWxsIGJlIGRlbGV0ZWQuXHJcbiAgLy8gICogXHJcbiAgLy8gICogQGV4YW1wbGVcclxuICAvLyAgKiBcclxuICAvLyAgKiBib3VpbGxpb24uY2xlYXIoJ2Zhdm9yaXRlLmZvb2RzLnBpenphJywgdHJ1ZSk7XHJcbiAgLy8gICovXHJcbiAgLy8gcmVtb3ZlKGtleTogc3RyaW5nLCBkZWxldGVLZXk6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG5cclxuICAvLyAgIGNvbnN0IGtleXM6IEFycmF5PHN0cmluZz4gPSBrZXkuc3BsaXQoJy4nKTtcclxuXHJcbiAgLy8gICBmb3IgKGxldCBlbnRyeSBpbiB0aGlzLl9zdG9yZSkge1xyXG5cclxuICAvLyAgICAgZm9yIChjb25zdCBrIG9mIGtleXMpIHtcclxuXHJcbiAgLy8gICAgICAgY29uc29sZS5sb2coZW50cnksIGssIGVudHJ5ID09PSBrKTtcclxuXHJcbiAgLy8gICAgICAgaWYgKGVudHJ5ID09PSBrKSB7XHJcblxyXG4gIC8vICAgICAgICAgaWYgKGtleXMuaW5kZXhPZihrKSAhPT0ga2V5cy5sZW5ndGggLTEpIGNvbnRpbnVlO1xyXG5cclxuICAvLyAgICAgICAgIGRlbGV0ZSB0aGlzLl9zdG9yZVtrXTtcclxuXHJcbiAgLy8gICAgICAgICByZXR1cm47XHJcblxyXG4gIC8vICAgICAgIH1cclxuXHJcbiAgLy8gICAgIH1cclxuXHJcbiAgLy8gICB9XHJcblxyXG4gIC8vIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2xlYXJzIGFsbCBkYXRhIGZyb20gdGhlIHN0b3JlLlxyXG4gICAqIFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogXHJcbiAgICogYm91aWxsb24uY2xlYXIoKTtcclxuICAgKi9cclxuICBjbGVhcigpIHtcclxuXHJcbiAgICB0aGlzLl9zdG9yZSA9IHt9O1xyXG5cclxuICB9XHJcblxyXG59XHJcbiJdfQ==