'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var createClass = _createClass;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var defineProperty = _defineProperty;

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
  classCallCheck(this, Options);

  defineProperty(this, "name", pkg.name);

  defineProperty(this, "cwd", process.cwd());

  defineProperty(this, "autosave", false);

  defineProperty(this, "encryptionKey", '');

  Object.assign(this, options);
};

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

var fs = require('fs');

var crypto = require('crypto');

var writeFileAtomic = require('write-file-atomic');

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

    classCallCheck(this, Bouillion);

    defineProperty(this, "options", void 0);

    defineProperty(this, "_store", {});

    defineProperty(this, "iv", crypto.randomBytes(16));

    this.options = new Options(options);
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


  createClass(Bouillion, [{
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
      return getKeyValue(keys, _store);
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
        _store = getKeyValue(keys, _store);
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

module.exports = Bouillion;
