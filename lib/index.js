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

var Bouillion =
/*#__PURE__*/
function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJjcnlwdG8iLCJ3cml0ZUZpbGVBdG9taWMiLCJjYWNoZSIsInJlc29sdmUiLCJfX2ZpbGVuYW1lIiwiQm91aWxsaW9uIiwib3B0aW9ucyIsInJhbmRvbUJ5dGVzIiwiT3B0aW9ucyIsImtleSIsImluY2x1ZGVzIiwiX3N0b3JlIiwiaGFzT3duUHJvcGVydHkiLCJrZXlzIiwic3BsaXQiLCJzZWFyY2giLCJnZXRLZXlWYWx1ZSIsInZhbHVlIiwib2JqIiwiT2JqZWN0IiwiYXNzaWduIiwibGFzdCIsInBvcCIsInVuZGVmaW5lZCIsIkVycm9yIiwiUHJvbWlzZSIsInJlamVjdCIsIkpTT04iLCJzdHJpbmdpZnkiLCJlbmNyeXB0aW9uS2V5IiwiaXYiLCJjaXBoZXIiLCJjcmVhdGVDaXBoZXJpdiIsIkJ1ZmZlciIsImNvbmNhdCIsInVwZGF0ZSIsImN3ZCIsIm5hbWUiLCJlcnIiLCJzeW5jIiwic3RyZWFtIiwiY3JlYXRlUmVhZFN0cmVhbSIsInJlc3BvbnNlIiwib24iLCJkYXRhIiwiZGVjaXBoZXIiLCJjcmVhdGVEZWNpcGhlcml2IiwicGFyc2UiLCJkZXN0cm95Il0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQTs7QUFDQTs7QUFOQSxJQUFNQSxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUNBLElBQU1DLE1BQU0sR0FBR0QsT0FBTyxDQUFDLFFBQUQsQ0FBdEI7O0FBQ0EsSUFBTUUsZUFBZSxHQUFHRixPQUFPLENBQUMsbUJBQUQsQ0FBL0I7O0FBTUE7QUFDQSxPQUFPQSxPQUFPLENBQUNHLEtBQVIsQ0FBY0gsT0FBTyxDQUFDSSxPQUFSLENBQWdCQyxVQUFoQixDQUFkLENBQVA7QUFFQTs7Ozs7Ozs7Ozs7SUFVcUJDLFM7OztBQUVuQjs7Ozs7OztBQVFBOzs7Ozs7O0FBUUE7Ozs7OztBQU9BOzs7Ozs7O0FBT0EsdUJBQWtDO0FBQUEsUUFB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QUF3QixhQUF4QixFQUF1QyxNQUFJLENBQUN4QyxPQUFMLENBQWF1QixhQUFwRCxFQUFtRSxNQUFJLENBQUNDLEVBQXhFLENBQWY7QUFFQVksWUFBQUEsUUFBUSxHQUFHZixJQUFJLENBQUNvQixLQUFMLENBQWdCZCxNQUFNLENBQUNDLE1BQVAsQ0FBYyxDQUFDVyxRQUFRLENBQUNWLE1BQVQsQ0FBZ0JTLElBQWhCLENBQUQsRUFBd0JDLFFBQVEsU0FBUixFQUF4QixDQUFkLENBQWhCLENBQVg7QUFFRDs7QUFFREwsVUFBQUEsTUFBTSxDQUFDUSxPQUFQO0FBRUQsU0FaRDtBQWNBUixRQUFBQSxNQUFNLENBQUNHLEVBQVAsQ0FBVSxPQUFWLEVBQW1CO0FBQUEsaUJBQU14QyxPQUFPLENBQUN1QyxRQUFELENBQWI7QUFBQSxTQUFuQjtBQUVELE9BdEJNLENBQVA7QUF3QkQsSyxDQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7O0FBRUE7Ozs7Ozs7Ozs7NEJBT1E7QUFFTixXQUFLL0IsTUFBTCxHQUFjLEVBQWQ7QUFFRDs7O3dCQWxPa0I7QUFFakIsYUFBTyxLQUFLQSxNQUFaO0FBRUQiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcclxuXHJcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcclxuY29uc3QgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XHJcbmNvbnN0IHdyaXRlRmlsZUF0b21pYyA9IHJlcXVpcmUoJ3dyaXRlLWZpbGUtYXRvbWljJyk7XHJcblxyXG5pbXBvcnQgU3RvcmUgZnJvbSAnLi9pbnRlcmZhY2VzL1N0b3JlJztcclxuaW1wb3J0IE9wdGlvbnMgZnJvbSAnLi9vcHRpb25zL09wdGlvbnMnO1xyXG5pbXBvcnQgKiBhcyBzZWFyY2ggZnJvbSAnLi91dGlscy9zZWFyY2gnO1xyXG5cclxuLy8gUmVzZXQgdGhlIG1vZHVsZXMgY2FjaGUuXHJcbmRlbGV0ZSByZXF1aXJlLmNhY2hlW3JlcXVpcmUucmVzb2x2ZShfX2ZpbGVuYW1lKV07XHJcblxyXG4vKipcclxuICogQm91aWxsaW9uIGlzIGEgbm9uLWRhdGFiYXNlIHBlcnNpc3RlbnQgc3RvcmFnZSBzb2x1dGlvbiBmb3IgTm9kZSB0aGF0IHNhdmVzIGRhdGEgaW4gYSB0ZW1wb3Jhcnkga2V5LXZhbHVlIFxyXG4gKiBzdG9yYWdlIGFuZCB0aGVuIGxhdGVyIHRvIGEgZmlsZSBvbiBkaXNrLlxyXG4gKiBcclxuICogVGhlIGRhdGEgY2FuIHRoZW4gYmUgcmV0cmlldmVkIGVpdGhlciBmcm9tIHRoZSB0ZW1wb3Jhcnkgc3RvcmFnZSBvciBmcm9tIHRoZSBkaXNrIGJhY2sgYXMga2V5LXZhbHVlIHBhaXJzLlxyXG4gKiBcclxuICogV2hlbiB3cml0aW5nIGRhdGEgdG8gZGlzaywgaXQgaXMgZG9uZSBhdG9taWNhbGx5IHNvIG5vIGRhdGEgY2FuIGJlIGxvc3QgaW4gY2FzZSBvZiBhIG1pc2hhcC5cclxuICogXHJcbiAqIEBhdXRob3IgUm9iZXJ0IENvcnBvbm9pIDxyb2JlcnRjb3Jwb25vaUBnbWFpbC5jb20+XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3VpbGxpb24ge1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgb3B0aW9ucyBmb3IgdGhpcyBpbnN0YW5jZSBvZiBCb3VpbGxvbi5cclxuICAgKiBcclxuICAgKiBAcHJvcGVydHkge09wdGlvbnN9XHJcbiAgICogQHJlYWRvbmx5XHJcbiAgICovXHJcbiAgcHJpdmF0ZSBvcHRpb25zOiBPcHRpb25zO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgbG9jYWwgc3RvcmFnZSBvYmplY3Qgd2hpY2ggd2lsbCBiZSB1c2VkIHRvIHN0b3JlIGRhdGEgdW50aWwgaXQgZ2V0c1xyXG4gICAqIHNhdmVkLlxyXG4gICAqIFxyXG4gICAqIEBwcm9wZXJ0eSB7U3RvcmV9XHJcbiAgICovXHJcbiAgcHJpdmF0ZSBfc3RvcmU6IFN0b3JlID0ge307XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBpbml0aWFsaXphdGlvbiB2ZWN0b3IgdG8gdXNlIGZvciBlbmNyeXB0aW9uLlxyXG4gICAqIFxyXG4gICAqIEBwcm9wZXJ0eSB7QnVmZmVyfVxyXG4gICAqL1xyXG4gIHByaXZhdGUgaXY6IEJ1ZmZlciA9IGNyeXB0by5yYW5kb21CeXRlcygxNik7XHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7T3B0aW9uc30gW29wdGlvbnNdXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm5hbWU9J3BhY2thZ2UuanNvbi5uYW1lJ10gVGhlIG5hbWUgQm91aWxsaW9uIHdpbGwgdXNlIGZvciB0aGUgZmlsZSB0aGF0IGNvbnRhaW5zIHRoZSBzYXZlZCBkYXRhLlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5jd2Q9cHJvY2Vzcy5jd2QoKV0gVGhlIGxvY2F0aW9uIHdoZXJlIEJvdWlpbGxpb24gc2hvdWxkIHNhdmUgdGhlIHRleHQgZmlsZSBjb250YWluaW5nIHRoZSBzYXZlZCBkYXRhLlxyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuYXV0b3NhdmU9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRoZSB0ZXh0IGZpbGUgd2lsbCBiZSB3cml0dGVuIGF1dG9tYXRpY2FsbHkgYWZ0ZXIgZXZlcnkgdGltZSBkYXRhIGlzIGFkZGVkLlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5lbmNyeXB0aW9uS2V5PScnXSBBbiBBRVMtMjU2IGNvbXBhdGlibGUga2V5IHRvIHVzZSBmb3IgZW5jcnlwdGluIHNhdmUgZGF0YS5cclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBPYmplY3QgPSB7fSkge1xyXG5cclxuICAgIHRoaXMub3B0aW9ucyA9IG5ldyBPcHRpb25zKG9wdGlvbnMpO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGxvY2FsIHN0b3JhZ2Ugb2JqZWN0IGFzIGlzLlxyXG4gICAqIFxyXG4gICAqIFRoaXMgaXMgYSByZWFkLW9ubHkgb3BlcmF0aW9uIG1lYW5pbmcgeW91IHNob3VsZCBub3QgbW9kaWZ5IHRoZSBvYmplY3QgYW5kIHBhc3MgaXQgYmFjayB0byBCb3VpbGxpb24gXHJcbiAgICogdG8gYXZvaWQgY29uZmxpY3RzLlxyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zIHtTdG9yZX1cclxuICAgKiBcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIFxyXG4gICAqIGNvbnN0IHN0b3JlID0gYm91aWxsb24uc3RvcmU7XHJcbiAgICovXHJcbiAgZ2V0IHN0b3JlKCk6IFN0b3JlIHtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5fc3RvcmU7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBzcGVjaWZpZWQga2V5LlxyXG4gICAqIFxyXG4gICAqIE5vdGUgdGhhdCBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucywgdGhpcyByZWFkcyBmcm9tIHRoZSBsb2NhbCBzdG9yYWdlIG9iamVjdCBhbmQgTk9UIHRoZSBzYXZlZCBKU09OIGZpbGUuIFxyXG4gICAqIFlvdSBzaG91bGQgd3JpdGUgdGhlIGRhdGEgdG8gdGhlIHN0b3JhZ2UgdG8gZW5zdXJlIHRoYXQgdGhleSBhcmUgYm90aCB1cCB0byBkYXRlLlxyXG4gICAqIFxyXG4gICAqIFRvIHJlYWQgdGhlIGRhdGEgZnJvbSB0aGUgc2F2ZSBmaWxlLCB1c2UgYHJlYWRgIGluc3RlYWQuXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIGdldCB0aGUgdmFsdWUgb2YuIElmIGl0IGlzIGEgbmVzdGVkIHZhbHVlLCB1c2UgZG90IG5vdGF0aW9uIHN5bnRheCB0byBkZWZpbmUgdGhlIGtleS5cclxuICAgKiBcclxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlIGtleSBzcGVjaWZpZWQuXHJcbiAgICogXHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBcclxuICAgKiBjb25zdCBmYXZvcml0ZUZvb2RzID0gYm91aWxsaW9uLmdldCgnZmF2b3JpdGUuZm9vZHMnKTtcclxuICAgKi9cclxuICBnZXQoa2V5OiBzdHJpbmcpOiBhbnkge1xyXG5cclxuICAgIGlmICgha2V5LmluY2x1ZGVzKCcuJykgJiYgdGhpcy5fc3RvcmUuaGFzT3duUHJvcGVydHkoa2V5KSkgcmV0dXJuIHRoaXMuX3N0b3JlW2tleV07XHJcblxyXG4gICAgY29uc3Qga2V5czogQXJyYXk8c3RyaW5nPiA9IGtleS5zcGxpdCgnLicpO1xyXG5cclxuICAgIGNvbnN0IF9zdG9yZTogU3RvcmUgPSB0aGlzLl9zdG9yZTtcclxuXHJcbiAgICByZXR1cm4gc2VhcmNoLmdldEtleVZhbHVlKGtleXMsIF9zdG9yZSk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWRkIGEga2V5LXZhbHVlIHBhaXIgdG8gdGhlIGxvY2FsIHN0b3JhZ2Ugb2JqZWN0LlxyXG4gICAqIFxyXG4gICAqIE5vdGUgdGhhdCB0aGlzIG1vZGlmaWVzIHRoZSBsb2NhbCBzdG9yYWdlIG9iamVjdCBidXQgeW91IHdpbGwgc3RpbGwgaGF2ZSB0byBjYWxsIGBzYXZlYCB0byBzYXZlIHRoZSBkYXRhIHRvIGEgZmlsZS4gIFRoaXMgcHJvY2VzcyBcclxuICAgKiBjYW4gYmUgZG9uZSBhdXRvbWF0aWNhbGx5IGJ5IHNldHRpbmcgdGhlIGBhdXRvc2F2ZWAgcHJvcGVydHkgdG8gYHRydWVgIGR1cmluZyBpbml0aWFsaXphdGlvbiBidXQgYXQgYSBwZXJmb3JtYW5jZSBjb3N0IGZvciBmcmVxdWVudCBcclxuICAgKiBzYXZlcy4gSXQgaXMgaW5zdGVhZCBqdXN0IHJlY29tbWVuZGVkIHRvIGNhbGwgYHNhdmVgIG1hbnVhbGx5LlxyXG4gICAqIFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBmb3IgdGhlIHZhbHVlIHRvIHN0b3JlLiBJZiBzdG9yaW5nIGluIGEgbmVzdGVkIGxvY2F0aW9uIHVzZSBkb3Qgbm90YXRpb24gc3ludGF4LlxyXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBrZXkuXHJcbiAgICogXHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBcclxuICAgKiBib3VpbGxvbi5zZXQoJ2Zhdm9yaXRlLmZvb2RzLnBpenphJywgJ3BlcHBlcm9uaScpO1xyXG4gICAqL1xyXG4gIHNldChrZXk6IHN0cmluZywgdmFsdWU6IGFueSkge1xyXG5cclxuICAgIGxldCBvYmo6IFN0b3JlID0ge307XHJcblxyXG4gICAgaWYgKCFrZXkuaW5jbHVkZXMoJy4nKSkge1xyXG5cclxuICAgICAgb2JqW2tleV0gPSB2YWx1ZTtcclxuXHJcbiAgICAgIHRoaXMuX3N0b3JlID0gT2JqZWN0LmFzc2lnbih0aGlzLl9zdG9yZSwgb2JqKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgY29uc3Qga2V5czogQXJyYXk8c3RyaW5nPiA9IGtleS5zcGxpdCgnLicpO1xyXG5cclxuICAgICAgY29uc3QgbGFzdDogc3RyaW5nID0ga2V5cy5wb3AoKSE7XHJcblxyXG4gICAgICBsZXQgX3N0b3JlOiBTdG9yZSA9IHRoaXMuX3N0b3JlO1xyXG5cclxuICAgICAgX3N0b3JlID0gc2VhcmNoLmdldEtleVZhbHVlKGtleXMsIF9zdG9yZSkhO1xyXG5cclxuICAgICAgaWYgKF9zdG9yZSA9PSB1bmRlZmluZWQpIHRocm93IG5ldyBFcnJvcignQ3JlYXRpb24gb2Ygb25seSAxIG5ldyBrZXkgcGVyIHNldCBvcGVyYXRpb24gaXMgc3VwcG9ydGVkJyk7XHJcblxyXG4gICAgICBfc3RvcmVbbGFzdF0gPSB2YWx1ZTtcclxuXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogV3JpdGUgYW5kIGVuY3J5cHQsIGlmIGFuIGVuY3J5cHRpb24ga2V5IGlzIHByZXNlbnQsIGEgZmlsZSBhc3luY2hyb25vdXNseSBhbmQgYXRvbWljYWxseSB0byB0aGUgZGlzay5cclxuICAgKiBcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTw+fVxyXG4gICAqIFxyXG4gICAqIEBleGFtcGxlXHJcbiAgICogXHJcbiAgICogYXdhaXQgYm91aWxsb24ud3JpdGUoKTtcclxuICAgKiBcclxuICAgKiBib3VpbGxvbi53cml0ZSgpLnRoZW4oKCkgPT4gY29uc29sZS5sb2coJ0hlbGxvIScpKTtcclxuICAgKi9cclxuICB3cml0ZSgpOiBQcm9taXNlPGFueT4ge1xyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgICBsZXQgX3N0b3JlOiAoc3RyaW5nIHwgQnVmZmVyKSA9IEpTT04uc3RyaW5naWZ5KHRoaXMuX3N0b3JlKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZW5jcnlwdGlvbktleSkge1xyXG5cclxuICAgICAgICB0aGlzLml2ID0gY3J5cHRvLnJhbmRvbUJ5dGVzKDE2KTtcclxuXHJcbiAgICAgICAgbGV0IGNpcGhlcjogYW55ID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIHRoaXMub3B0aW9ucy5lbmNyeXB0aW9uS2V5LCB0aGlzLml2KTtcclxuXHJcbiAgICAgICAgX3N0b3JlID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShfc3RvcmUpLCBjaXBoZXIuZmluYWwoKV0pO1xyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgd3JpdGVGaWxlQXRvbWljKGAke3RoaXMub3B0aW9ucy5jd2R9LyR7dGhpcy5vcHRpb25zLm5hbWV9LnR4dGAsIF9zdG9yZSwgKGVycjogYW55KSA9PiB7XHJcblxyXG4gICAgICAgIGlmIChlcnIpIHJlamVjdChlcnIpO1xyXG5cclxuICAgICAgICByZXNvbHZlKCk7XHJcblxyXG4gICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBXcml0ZSBhbmQgZW5jcnlwdCwgaWYgYW4gZW5jcnlwdGlvbiBrZXkgaXMgcHJlc2VudCwgYSBmaWxlIHN5bmNocm9ub3VzbHkgYW5kIGF0b21pY2FsbHkgdG8gdGhlIGRpc2suXHJcbiAgICogXHJcbiAgICogTm90ZSB0aGF0IHRoaXMgaXMgYSBzeW5jaHJvbm91cyBvcGVyYXRpb24gYW5kIGlzIGdlbmVyYWxseSBub3QgcmVjb21tZW5kZWQgdW5sZXNzIHlvdSBrbm93IHRoYXQgeW91IG5lZWQgdG8gdXNlIGl0IGluIHRoaXMgZmFzaGlvbi5cclxuICAgKiBcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIFxyXG4gICAqIGJvdWlsbG9uLndyaXRlU3luYygpO1xyXG4gICAqL1xyXG4gIHdyaXRlU3luYygpIHtcclxuXHJcbiAgICBsZXQgX3N0b3JlOiAoQnVmZmVyIHwgc3RyaW5nKSA9IEpTT04uc3RyaW5naWZ5KHRoaXMuX3N0b3JlKTtcclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmVuY3J5cHRpb25LZXkpIHtcclxuXHJcbiAgICAgIHRoaXMuaXYgPSBjcnlwdG8ucmFuZG9tQnl0ZXMoMTYpO1xyXG5cclxuICAgICAgbGV0IGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCB0aGlzLm9wdGlvbnMuZW5jcnlwdGlvbktleSwgdGhpcy5pdik7XHJcblxyXG4gICAgICBfc3RvcmUgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKF9zdG9yZSksIGNpcGhlci5maW5hbCgpXSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHdyaXRlRmlsZUF0b21pYy5zeW5jKGAke3RoaXMub3B0aW9ucy5jd2R9LyR7dGhpcy5vcHRpb25zLm5hbWV9LnR4dGAsIF9zdG9yZSk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQXN5bmNocm9ub3VzbHkgcmVhZHMgdGhlIGRhdGEgZmlsZSBmcm9tIGRpc2sgYW5kIHJldHVybnMgdGhlIGRhdGEgcGFyc2VkIGFzIGFuIG9iamVjdC5cclxuICAgKiBcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTdG9yZT59XHJcbiAgICogXHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBcclxuICAgKiBjb25zdCBkYXRhID0gYXdhaXQgYm91aWxsb24ucmVhZCgpO1xyXG4gICAqL1xyXG4gIHJlYWQoKTogUHJvbWlzZTxTdG9yZT4ge1xyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuXHJcbiAgICAgIGxldCBzdHJlYW06IGFueSA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0oYCR7dGhpcy5vcHRpb25zLmN3ZH0vJHt0aGlzLm9wdGlvbnMubmFtZX0udHh0YCk7XHJcblxyXG4gICAgICBsZXQgcmVzcG9uc2U6IGFueTtcclxuXHJcbiAgICAgIHN0cmVhbS5vbignZGF0YScsIChkYXRhOiBhbnkpID0+IHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbmNyeXB0aW9uS2V5KSB7XHJcblxyXG4gICAgICAgICAgbGV0IGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgdGhpcy5vcHRpb25zLmVuY3J5cHRpb25LZXksIHRoaXMuaXYpO1xyXG5cclxuICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSg8YW55PkJ1ZmZlci5jb25jYXQoW2RlY2lwaGVyLnVwZGF0ZShkYXRhKSwgZGVjaXBoZXIuZmluYWwoKV0pKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdHJlYW0uZGVzdHJveSgpO1xyXG5cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBzdHJlYW0ub24oJ2Nsb3NlJywgKCkgPT4gcmVzb2x2ZShyZXNwb25zZSkpO1xyXG5cclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIC8vIC8qKlxyXG4gIC8vICAqIFJlbW92ZXMgYSBwaWVjZSBvZiBkYXRhIGZyb20gdGhlIHN0b3JlLlxyXG4gIC8vICAqIFxyXG4gIC8vICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBmb3IgdGhlIHZhbHVlIHRvIGRlbGV0ZS4gSWYgc3RvcmluZyBpbiBhIG5lc3RlZCBsb2NhdGlvbiB1c2UgZG90IG5vdGF0aW9uIHN5bnRheC5cclxuICAvLyAgKiBAcGFyYW0ge2Jvb2xlYW59IFtkZWxldGVLZXk9ZmFsc2VdIElmIHNldCB0byB0cnVlLCB0aGVuIHRoZSBrZXkgaXRzZWxmIHdpbGwgYmUgZGVsZXRlZC5cclxuICAvLyAgKiBcclxuICAvLyAgKiBAZXhhbXBsZVxyXG4gIC8vICAqIFxyXG4gIC8vICAqIGJvdWlsbGlvbi5jbGVhcignZmF2b3JpdGUuZm9vZHMucGl6emEnLCB0cnVlKTtcclxuICAvLyAgKi9cclxuICAvLyByZW1vdmUoa2V5OiBzdHJpbmcsIGRlbGV0ZUtleTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcblxyXG4gIC8vICAgY29uc3Qga2V5czogQXJyYXk8c3RyaW5nPiA9IGtleS5zcGxpdCgnLicpO1xyXG5cclxuICAvLyAgIGZvciAobGV0IGVudHJ5IGluIHRoaXMuX3N0b3JlKSB7XHJcblxyXG4gIC8vICAgICBmb3IgKGNvbnN0IGsgb2Yga2V5cykge1xyXG5cclxuICAvLyAgICAgICBjb25zb2xlLmxvZyhlbnRyeSwgaywgZW50cnkgPT09IGspO1xyXG5cclxuICAvLyAgICAgICBpZiAoZW50cnkgPT09IGspIHtcclxuXHJcbiAgLy8gICAgICAgICBpZiAoa2V5cy5pbmRleE9mKGspICE9PSBrZXlzLmxlbmd0aCAtMSkgY29udGludWU7XHJcblxyXG4gIC8vICAgICAgICAgZGVsZXRlIHRoaXMuX3N0b3JlW2tdO1xyXG5cclxuICAvLyAgICAgICAgIHJldHVybjtcclxuXHJcbiAgLy8gICAgICAgfVxyXG5cclxuICAvLyAgICAgfVxyXG5cclxuICAvLyAgIH1cclxuXHJcbiAgLy8gfVxyXG5cclxuICAvKipcclxuICAgKiBDbGVhcnMgYWxsIGRhdGEgZnJvbSB0aGUgc3RvcmUuXHJcbiAgICogXHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBcclxuICAgKiBib3VpbGxvbi5jbGVhcigpO1xyXG4gICAqL1xyXG4gIGNsZWFyKCkge1xyXG5cclxuICAgIHRoaXMuX3N0b3JlID0ge307XHJcblxyXG4gIH1cclxuXHJcbn1cclxuIl19