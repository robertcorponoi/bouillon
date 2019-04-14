'use strict'; /// <reference path="./interfaces/Store.ts" />

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJjcnlwdG8iLCJ3cml0ZUZpbGVBdG9taWMiLCJjYWNoZSIsInJlc29sdmUiLCJfX2ZpbGVuYW1lIiwiQm91aWxsaW9uIiwib3B0aW9ucyIsInJhbmRvbUJ5dGVzIiwiT3B0aW9ucyIsImtleSIsImluY2x1ZGVzIiwiX3N0b3JlIiwiaGFzT3duUHJvcGVydHkiLCJrZXlzIiwic3BsaXQiLCJzZWFyY2giLCJnZXRLZXlWYWx1ZSIsInZhbHVlIiwib2JqIiwiT2JqZWN0IiwiYXNzaWduIiwibGFzdCIsInBvcCIsInVuZGVmaW5lZCIsIkVycm9yIiwiUHJvbWlzZSIsInJlamVjdCIsIkpTT04iLCJzdHJpbmdpZnkiLCJlbmNyeXB0aW9uS2V5IiwiaXYiLCJjaXBoZXIiLCJjcmVhdGVDaXBoZXJpdiIsIkJ1ZmZlciIsImNvbmNhdCIsInVwZGF0ZSIsImZpbmFsIiwiY3dkIiwibmFtZSIsImVyciIsInN5bmMiLCJzdHJlYW0iLCJjcmVhdGVSZWFkU3RyZWFtIiwicmVzcG9uc2UiLCJvbiIsImRhdGEiLCJkZWNpcGhlciIsImNyZWF0ZURlY2lwaGVyaXYiLCJwYXJzZSIsImRlc3Ryb3kiXSwibWFwcGluZ3MiOiJBQUFBLGEsQ0FFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNQTs7QUFDQTs7QUFMQSxJQUFNQSxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUNBLElBQU1DLE1BQU0sR0FBR0QsT0FBTyxDQUFDLFFBQUQsQ0FBdEI7O0FBQ0EsSUFBTUUsZUFBZSxHQUFHRixPQUFPLENBQUMsbUJBQUQsQ0FBL0I7O0FBS0E7QUFDQSxPQUFPQSxPQUFPLENBQUNHLEtBQVIsQ0FBY0gsT0FBTyxDQUFDSSxPQUFSLENBQWdCQyxVQUFoQixDQUFkLENBQVA7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0lBY3FCQyxTOzs7QUFFbkI7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7QUFTQTs7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LGFBQWpCLEVBQWdDO0FBRTlCLGdCQUFJaUIsUUFBUSxHQUFHOUMsTUFBTSxDQUFDK0MsZ0JBQVAsQ0FBd0IsYUFBeEIsRUFBdUMsTUFBSSxDQUFDekMsT0FBTCxDQUFhdUIsYUFBcEQsRUFBbUUsTUFBSSxDQUFDQyxFQUF4RSxDQUFmO0FBRUFhLFlBQUFBLFFBQVEsR0FBR2hCLElBQUksQ0FBQ3FCLEtBQUwsQ0FBZ0JmLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLENBQUNZLFFBQVEsQ0FBQ1gsTUFBVCxDQUFnQlUsSUFBaEIsQ0FBRCxFQUF3QkMsUUFBUSxDQUFDVixLQUFULEVBQXhCLENBQWQsQ0FBaEIsQ0FBWDtBQUVEOztBQUVESyxVQUFBQSxNQUFNLENBQUNRLE9BQVA7QUFFRCxTQVpEO0FBY0FSLFFBQUFBLE1BQU0sQ0FBQ0csRUFBUCxDQUFVLE9BQVYsRUFBbUI7QUFBQSxpQkFBTXpDLE9BQU8sQ0FBQ3dDLFFBQUQsQ0FBYjtBQUFBLFNBQW5CO0FBRUQsT0F0Qk0sQ0FBUDtBQXdCRDs7O3dCQW5Na0I7QUFFakIsYUFBTyxLQUFLaEMsTUFBWjtBQUVEIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2ludGVyZmFjZXMvU3RvcmUudHNcIiAvPlxuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5jb25zdCBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbmNvbnN0IHdyaXRlRmlsZUF0b21pYyA9IHJlcXVpcmUoJ3dyaXRlLWZpbGUtYXRvbWljJyk7XG5cbmltcG9ydCBPcHRpb25zIGZyb20gJy4vb3B0aW9ucy9PcHRpb25zJztcbmltcG9ydCAqIGFzIHNlYXJjaCBmcm9tICcuL3V0aWxzL3NlYXJjaCc7XG5cbi8vIFJlc2V0IHRoZSBtb2R1bGVzIGNhY2hlLlxuZGVsZXRlIHJlcXVpcmUuY2FjaGVbcmVxdWlyZS5yZXNvbHZlKF9fZmlsZW5hbWUpXTtcblxuLyoqXG4gKiBCb3VpbGxpb24gaXMgYSBub24tZGF0YWJhc2UgcGVyc2lzdGVudCBzdG9yYWdlIHNvbHV0aW9uIGZvciBOb2RlIHRoYXQgc2F2ZXNcbiAqIGRhdGEgaW4gYSB0ZW1wb3Jhcnkga2V5LXZhbHVlIHN0b3JhZ2UgYW5kIHRoZW4gbGF0ZXIgdG8gYSBmaWxlIG9uIGRpc2suXG4gKiBcbiAqIFRoZSBkYXRhIGNhbiB0aGVuIGJlIHJldHJpZXZlZCBlaXRoZXIgZnJvbSB0aGUgdGVtcG9yYXJ5IHN0b3JhZ2Ugb3IgZnJvbSB0aGVcbiAqIGRpc2sgYmFjayBhcyBrZXktdmFsdWUgcGFpcnMuXG4gKiBcbiAqIFdoZW4gd3JpdGluZyBkYXRhIHRvIGRpc2ssIGl0IGlzIGRvbmUgYXRvbWljYWxseSBzbyBubyBkYXRhIGNhbiBiZSBsb3N0IGluXG4gKiBjYXNlIG9mIGEgbWlzaGFwLlxuICogXG4gKiBAYXV0aG9yIFJvYmVydCBDb3Jwb25vaSA8cm9iZXJ0Y29ycG9ub2lAZ21haWwuY29tPlxuICogXG4gKiBAdmVyc2lvbiAxLjEuMFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3VpbGxpb24ge1xuXG4gIC8qKlxuICAgKiBUaGUgb3B0aW9ucyBmb3IgdGhpcyBpbnN0YW5jZSBvZiBCb3VpbGxvbi5cbiAgICogXG4gICAqIEBzaW5jZSAxLjEuMFxuICAgKiBcbiAgICogQHByb3BlcnR5IHtPcHRpb25zfVxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIHByaXZhdGUgb3B0aW9uczogT3B0aW9ucztcblxuICAvKipcbiAgICogVGhlIGxvY2FsIHN0b3JhZ2Ugb2JqZWN0IHdoaWNoIHdpbGwgYmUgdXNlZCB0byBzdG9yZSBkYXRhIHVudGlsIGl0IGdldHNcbiAgICogc2F2ZWQuXG4gICAqIFxuICAgKiBAc2luY2UgMC4xLjBcbiAgICogXG4gICAqIEBwcm9wZXJ0eSB7U3RvcmV9XG4gICAqL1xuICBwcml2YXRlIF9zdG9yZTogU3RvcmUgPSB7fTtcblxuICAvKipcbiAgICogVGhlIGluaXRpYWxpemF0aW9uIHZlY3RvciB0byB1c2UgZm9yIGVuY3J5cHRpb24uXG4gICAqIFxuICAgKiBAc2luY2UgMC4xLjBcbiAgICogXG4gICAqIEBwcm9wZXJ0eSB7QnVmZmVyfVxuICAgKi9cbiAgcHJpdmF0ZSBpdjogQnVmZmVyID0gY3J5cHRvLnJhbmRvbUJ5dGVzKDE2KTtcblxuICAvKipcbiAgICogQHBhcmFtIHtPcHRpb25zfSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm5hbWU9J3BhY2thZ2UuanNvbi5uYW1lJ10gVGhlIG5hbWUgQm91aWxsaW9uIHdpbGwgdXNlIGZvciB0aGUgZmlsZSB0aGF0IGNvbnRhaW5zIHRoZSBzYXZlZCBkYXRhLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuY3dkPXByb2Nlc3MuY3dkKCldIFRoZSBsb2NhdGlvbiB3aGVyZSBCb3VpaWxsaW9uIHNob3VsZCBzYXZlIHRoZSB0ZXh0IGZpbGUgY29udGFpbmluZyB0aGUgc2F2ZWQgZGF0YS5cbiAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5hdXRvc2F2ZT1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHRleHQgZmlsZSB3aWxsIGJlIHdyaXR0ZW4gYXV0b21hdGljYWxseSBhZnRlciBldmVyeSB0aW1lIGRhdGEgaXMgYWRkZWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5lbmNyeXB0aW9uS2V5PScnXSBBbiBBRVMtMjU2IGNvbXBhdGlibGUga2V5IHRvIHVzZSBmb3IgZW5jcnlwdGluIHNhdmUgZGF0YS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IE9iamVjdCA9IHt9KSB7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBuZXcgT3B0aW9ucyhvcHRpb25zKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxvY2FsIHN0b3JhZ2Ugb2JqZWN0IGFzIGlzLlxuICAgKiBcbiAgICogVGhpcyBpcyBhIHJlYWQtb25seSBvcGVyYXRpb24gbWVhbmluZyB5b3Ugc2hvdWxkIG5vdCBtb2RpZnkgdGhlIG9iamVjdFxuICAgKiBhbmQgcGFzcyBpdCBiYWNrIHRvIEJvdWlsbGlvbiB0byBhdm9pZCBjb25mbGljdHMuXG4gICAqIFxuICAgKiBAc2luY2UgMC4xLjBcbiAgICogXG4gICAqIEByZXR1cm5zIHtTdG9yZX1cbiAgICogXG4gICAqIEBleGFtcGxlXG4gICAqIFxuICAgKiBjb25zdCBzdG9yZSA9IGJvdWlsbG9uLnN0b3JlO1xuICAgKi9cbiAgZ2V0IHN0b3JlKCk6IFN0b3JlIHtcblxuICAgIHJldHVybiB0aGlzLl9zdG9yZTtcblxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGtleS5cbiAgICogXG4gICAqIE5vdGUgdGhhdCBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucywgdGhpcyByZWFkcyBmcm9tIHRoZSBsb2NhbCBzdG9yYWdlIG9iamVjdCBhbmRcbiAgICogTk9UIHRoZSBzYXZlZCBKU09OIGZpbGUuIFlvdSBzaG91bGQgd3JpdGUgdGhlIGRhdGEgdG8gdGhlIHN0b3JhZ2UgdG8gZW5zdXJlIHRoYXRcbiAgICogdGhleSBhcmUgYm90aCB1cCB0byBkYXRlLlxuICAgKiBcbiAgICogVG8gcmVhZCB0aGUgZGF0YSBmcm9tIHRoZSBzYXZlIGZpbGUsIHVzZSBgcmVhZGAgaW5zdGVhZC5cbiAgICogXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIGdldCB0aGUgdmFsdWUgb2YuIElmIGl0IGlzIGEgbmVzdGVkIHZhbHVlLCB1c2UgZG90IG5vdGF0aW9uIHN5bnRheCB0byBkZWZpbmUgdGhlIGtleS5cbiAgICogXG4gICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUga2V5IHNwZWNpZmllZC5cbiAgICogXG4gICAqIEBleGFtcGxlXG4gICAqIFxuICAgKiBjb25zdCBmYXZvcml0ZUZvb2RzID0gYm91aWxsaW9uLmdldCgnZmF2b3JpdGUuZm9vZHMnKTtcbiAgICovXG4gIGdldChrZXk6IHN0cmluZyk6IGFueSB7XG5cbiAgICBpZiAoIWtleS5pbmNsdWRlcygnLicpICYmIHRoaXMuX3N0b3JlLmhhc093blByb3BlcnR5KGtleSkpIHJldHVybiB0aGlzLl9zdG9yZVtrZXldO1xuXG4gICAgY29uc3Qga2V5czogQXJyYXk8c3RyaW5nPiA9IGtleS5zcGxpdCgnLicpO1xuXG4gICAgY29uc3QgX3N0b3JlOiBTdG9yZSA9IHRoaXMuX3N0b3JlO1xuXG4gICAgcmV0dXJuIHNlYXJjaC5nZXRLZXlWYWx1ZShrZXlzLCBfc3RvcmUpO1xuXG4gIH1cblxuICAvKipcbiAgICogQWRkIGEga2V5LXZhbHVlIHBhaXIgdG8gdGhlIGxvY2FsIHN0b3JhZ2Ugb2JqZWN0LlxuICAgKiBcbiAgICogTm90ZSB0aGF0IHRoaXMgbW9kaWZpZXMgdGhlIGxvY2FsIHN0b3JhZ2Ugb2JqZWN0IGJ1dCB5b3Ugd2lsbCBzdGlsbCBoYXZlIHRvIGNhbGxcbiAgICogYHNhdmVgIHRvIHNhdmUgdGhlIGRhdGEgdG8gYSBmaWxlLiBUaGlzIHByb2Nlc3MgY2FuIGJlIGRvbmUgYXV0b21hdGljYWxseSBieSBzZXR0aW5nXG4gICAqIHRoZSBgYXV0b3NhdmVgIHByb3BlcnR5IHRvIGB0cnVlYCBkdXJpbmcgaW5pdGlhbGl6YXRpb24gYnV0IGF0IGEgcGVyZm9ybWFuY2UgY29zdFxuICAgKiBmb3IgZnJlcXVlbmNlIHNhdmVzLiBJdCBpcyBpbnN0ZWFkIGp1c3QgcmVjb21tZW5kZWQgdG8gY2FsbCBgc2F2ZWAgbWFudWFsbHkuXG4gICAqIFxuICAgKiBAc2luY2UgMC4xLjBcbiAgICogXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBmb3IgdGhlIHZhbHVlIHRvIHN0b3JlLiBJZiBzdG9yaW5nIGluIGEgbmVzdGVkIGxvY2F0aW9uIHVzZSBkb3Qgbm90YXRpb24gc3ludGF4LlxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NvY2lhdGUgd2l0aCB0aGUga2V5LlxuICAgKiBcbiAgICogQGV4YW1wbGVcbiAgICogXG4gICAqIGJvdWlsbG9uLnNldCgnZmF2b3JpdGUuZm9vZHMucGl6emEnLCAncGVwcGVyb25pJyk7XG4gICAqL1xuICBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcblxuICAgIGxldCBvYmo6IFN0b3JlID0ge307XG5cbiAgICBpZiAoIWtleS5pbmNsdWRlcygnLicpKSB7XG5cbiAgICAgIG9ialtrZXldID0gdmFsdWU7XG5cbiAgICAgIHRoaXMuX3N0b3JlID0gT2JqZWN0LmFzc2lnbih0aGlzLl9zdG9yZSwgb2JqKTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGNvbnN0IGtleXM6IEFycmF5PHN0cmluZz4gPSBrZXkuc3BsaXQoJy4nKTtcblxuICAgICAgY29uc3QgbGFzdDogc3RyaW5nID0ga2V5cy5wb3AoKSE7XG5cbiAgICAgIGxldCBfc3RvcmU6IFN0b3JlID0gdGhpcy5fc3RvcmU7XG5cbiAgICAgIF9zdG9yZSA9IHNlYXJjaC5nZXRLZXlWYWx1ZShrZXlzLCBfc3RvcmUpITtcblxuICAgICAgaWYgKF9zdG9yZSA9PSB1bmRlZmluZWQpIHRocm93IG5ldyBFcnJvcignQ3JlYXRpb24gb2Ygb25seSAxIG5ldyBrZXkgcGVyIHNldCBvcGVyYXRpb24gaXMgc3VwcG9ydGVkJyk7XG5cbiAgICAgIF9zdG9yZVtsYXN0XSA9IHZhbHVlO1xuXG4gICAgfVxuXG4gIH1cblxuICAvKipcbiAgICogV3JpdGUgYW5kIGVuY3J5cHQsIGlmIGFuIGVuY3J5cHRpb24ga2V5IGlzIHByZXNlbnQsIGEgZmlsZSBhc3luY2hyb25vdXNseSBhbmQgYXRvbWljYWxseVxuICAgKiB0byB0aGUgZGlzay5cbiAgICogXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAYXN5bmNcbiAgICogXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPD59XG4gICAqIFxuICAgKiBAZXhhbXBsZVxuICAgKiBcbiAgICogYXdhaXQgYm91aWxsb24ud3JpdGUoKTtcbiAgICogXG4gICAqIGJvdWlsbG9uLndyaXRlKCkudGhlbigoKSA9PiBjb25zb2xlLmxvZygnSGVsbG8hJykpO1xuICAgKi9cbiAgd3JpdGUoKTogUHJvbWlzZTxhbnk+IHtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIGxldCBfc3RvcmU6IChzdHJpbmcgfCBCdWZmZXIpID0gSlNPTi5zdHJpbmdpZnkodGhpcy5fc3RvcmUpO1xuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVuY3J5cHRpb25LZXkpIHtcblxuICAgICAgICB0aGlzLml2ID0gY3J5cHRvLnJhbmRvbUJ5dGVzKDE2KTtcblxuICAgICAgICBsZXQgY2lwaGVyOiBhbnkgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgdGhpcy5vcHRpb25zLmVuY3J5cHRpb25LZXksIHRoaXMuaXYpO1xuXG4gICAgICAgIF9zdG9yZSA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUoX3N0b3JlKSwgY2lwaGVyLmZpbmFsKCldKTtcblxuICAgICAgfVxuXG4gICAgICB3cml0ZUZpbGVBdG9taWMoYCR7dGhpcy5vcHRpb25zLmN3ZH0vJHt0aGlzLm9wdGlvbnMubmFtZX0udHh0YCwgX3N0b3JlLCAoZXJyOiBhbnkpID0+IHtcblxuICAgICAgICBpZiAoZXJyKSByZWplY3QoZXJyKTtcblxuICAgICAgICByZXNvbHZlKCk7XG5cbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZSBhbmQgZW5jcnlwdCwgaWYgYW4gZW5jcnlwdGlvbiBrZXkgaXMgcHJlc2VudCwgYSBmaWxlIHN5bmNocm9ub3VzbHkgYW5kIGF0b21pY2FsbHlcbiAgICogdG8gdGhlIGRpc2suXG4gICAqIFxuICAgKiBOb3RlIHRoYXQgdGhpcyBpcyBhIHN5bmNocm9ub3VzIG9wZXJhdGlvbiBhbmQgaXMgZ2VuZXJhbGx5IG5vdCByZWNvbW1lbmRlZCB1bmxlc3MgeW91IGtub3dcbiAgICogdGhhdCB5b3UgbmVlZCB0byB1c2UgaXQgaW4gdGhpcyBmYXNoaW9uLlxuICAgKiBcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIFxuICAgKiBAZXhhbXBsZVxuICAgKiBcbiAgICogYm91aWxsb24ud3JpdGVTeW5jKCk7XG4gICAqL1xuICB3cml0ZVN5bmMoKSB7XG5cbiAgICBsZXQgX3N0b3JlOiAoQnVmZmVyIHwgc3RyaW5nKSA9IEpTT04uc3RyaW5naWZ5KHRoaXMuX3N0b3JlKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZW5jcnlwdGlvbktleSkge1xuXG4gICAgICB0aGlzLml2ID0gY3J5cHRvLnJhbmRvbUJ5dGVzKDE2KTtcblxuICAgICAgbGV0IGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCB0aGlzLm9wdGlvbnMuZW5jcnlwdGlvbktleSwgdGhpcy5pdik7XG5cbiAgICAgIF9zdG9yZSA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUoX3N0b3JlKSwgY2lwaGVyLmZpbmFsKCldKTtcblxuICAgIH1cblxuICAgIHdyaXRlRmlsZUF0b21pYy5zeW5jKGAke3RoaXMub3B0aW9ucy5jd2R9LyR7dGhpcy5vcHRpb25zLm5hbWV9LnR4dGAsIF9zdG9yZSk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBBc3luY2hyb25vdXNseSByZWFkcyB0aGUgZGF0YSBmaWxlIGZyb20gZGlzayBhbmQgcmV0dXJucyB0aGUgZGF0YSBwYXJzZWQgYXNcbiAgICogYW4gb2JqZWN0LlxuICAgKiBcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBhc3luY1xuICAgKiBcbiAgICogQHJldHVybnMge1Byb21pc2U8U3RvcmU+fVxuICAgKiBcbiAgICogQGV4YW1wbGVcbiAgICogXG4gICAqIGNvbnN0IGRhdGEgPSBhd2FpdCBib3VpbGxvbi5yZWFkKCk7XG4gICAqL1xuICByZWFkKCk6IFByb21pc2U8U3RvcmU+IHtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblxuICAgICAgbGV0IHN0cmVhbTogYW55ID0gZnMuY3JlYXRlUmVhZFN0cmVhbShgJHt0aGlzLm9wdGlvbnMuY3dkfS8ke3RoaXMub3B0aW9ucy5uYW1lfS50eHRgKTtcblxuICAgICAgbGV0IHJlc3BvbnNlOiBhbnk7XG5cbiAgICAgIHN0cmVhbS5vbignZGF0YScsIChkYXRhOiBhbnkpID0+IHtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmVuY3J5cHRpb25LZXkpIHtcblxuICAgICAgICAgIGxldCBkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIHRoaXMub3B0aW9ucy5lbmNyeXB0aW9uS2V5LCB0aGlzLml2KTtcblxuICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSg8YW55PkJ1ZmZlci5jb25jYXQoW2RlY2lwaGVyLnVwZGF0ZShkYXRhKSwgZGVjaXBoZXIuZmluYWwoKV0pKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgc3RyZWFtLmRlc3Ryb3koKTtcblxuICAgICAgfSk7XG5cbiAgICAgIHN0cmVhbS5vbignY2xvc2UnLCAoKSA9PiByZXNvbHZlKHJlc3BvbnNlKSk7XG5cbiAgICB9KTtcblxuICB9XG5cbn1cbiJdfQ==