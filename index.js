'use strict'

const fs = require('fs');
const crypto = require('crypto');
const writeFileAtomic = require('write-file-atomic');
const utils = require('./utils');

// Reset the cache.
delete require.cache[require.resolve(__filename)];

/**
 * Bouillion is a persistent storage API that accepts data as a key value
 * pair and saves it to JSON file locally.
 * 
 * All data is saved atomically which means that the file being saved over
 * when new data is saved will not be corrupted if something happens to interfere
 * with the saving process.
 * 
 * @since 0.1.0
 */
module.exports = class Bouillon {

  /**
 * @param {Object} options A set of options for initializing a new Bouillion instance.
 * @param {string} [name='bouillon-app'] The name of your application.
 * @param {string} [cwd='./path/to/application'] The directory of your application. This will be retrieved automatically if not specified.
 * @param {boolean} [autosave=false] Indicates whether boolean should autosave any newly added data to the saved JSON file.
 * @param {string} [encryptionKey] An aes-256 compatible key to use for encrypting save data.
 */
  constructor(options = {}) {

    /**
     * Creates an options object my merging user specified
     * options with the defaults.
     * 
     * @prop {Object}
     * @readonly
     */
    this._options = Object.assign({
      name: 'bouillion-app',
      cwd: utils.getCWD(),
      autosave: true,
    }, options);

    /**
     * The local storage object which will be used to store data until
     * it is saved.
     * 
     * @prop {Object}
     * @readonly
     */
    this._store = {};

  }

  /**
   * Return the value associated with the specified key.
   * 
   * Note that for performance reasons, this reads from the local storage object,
   * NOT the saved JSON file. You should write to the storage and save so that they
   * almost match unless you're sure the data is temporary.
   * 
   * To read data from the stored JSON file, use `read`.
   * 
   * @since 0.1.0
   * 
   * @param {string} key The key in the storage objects that contains the value you would like to get. If it is a nested key, it must be specified with dot notation syntax.
   * 
   * @returns {*} The value of the key which can be any data type that can be placed in an object.
   */
  get(key) {

    if (key.indexOf('.') < 0) return this._store[key];

    const keys = key.split('.');
    const _store = this._store;

    return utils.getKeyValue(keys, _store);

  }

  /**
   * Add a key and value pair to the local storage object.
   * 
   * Note that this modiifies the local storage object, you will still have to call `save`
   * to save this data to the JSON file. This can also be done automatically by setting the
   * `autostart` property of Bouillion to true but it is not recommended for users that will
   * use `set` a lot and instead is recommended that `save` be called at the end.
   * 
   * @since 0.1.0
   * 
   * @param {string} key The key that will be inserted into the storage object. To set nested key, it must be specified with dot notation syntax.
   * @param {*} value A value to set for the key. This can be any data type that can be used in an object.
   */
  set(key, value) {

    let obj = {};

    if (key.indexOf('.') < 0) {

      obj[key] = value;

      this._store = Object.assign(this._store, obj);

    } else {

      const keys = key.split('.');
      const last = keys.pop();

      let _store = this._store;

      _store = utils.getKeyValue(keys, _store);

      if (_store === undefined) throw new Error('Creation of only 1 new key per set operation is supported');

      _store[last] = value;

    }

  }

  /**
   * Encyrpt, if desired, and write a file asynchronously and atomically to the disk so that if
   * the operation is interrupted in any way the existing file will not be corrupted.
   * 
   * @since 0.1.0
   * 
   * @returns {Promise}
   */
  write() {

    return new Promise((resolve, reject) => {

      let _store = JSON.stringify(this._store);

      if (this._options.encryptionKey) {

        this._iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv('aes-256-cbc', this._options.encryptionKey, this._iv);

        _store = Buffer.concat([cipher.update(_store), cipher.final()]);

      }

      writeFileAtomic(`${this._options.cwd}/${this._options.name}.txt`, _store, (err) => {

        if (err) reject(err);
        resolve();

      });

    });

  }

  /**
   * Encrypt, if desired, and write a file synchronously and atomically to the disk so that
   * if the operation is interrupted in any way the existing file will not be corrupted.
   * 
   * Note that this is a synchronous action and is generally not recommended unless you specifically
   * know what you are doing.
   * 
   * @since 0.1.0
   */
  writeSync() {

    let _store = JSON.stringify(this._store);

    if (this._options.encryptionKey) {

      this._iv = crypto.randomBytes(16);
      let cipher = crypto.createCipheriv('aes-256-cbc', this._options.encryptionKey, this._iv);

      _store = Buffer.concat([cipher.update(_store), cipher.final()]);

    }

    writeFileAtomic.sync(`${this._options.cwd}/${this._options.name}.txt`, _store);

  }

  /**
   * Asynchronously read the JSON storage file from the disk and return the data parsed as
   * an object.
   * 
   * @since 0.1.0
   * 
   * @returns {Promise}
   */
  read() {

    return new Promise(resolve => {

      let stream = fs.createReadStream(`${this._options.cwd}/${this._options.name}.txt`);
      let response;

      stream.on('data', data => {

        if (this._options.encryptionKey) {

          let decipher = crypto.createDecipheriv('aes-256-cbc', this._options.encryptionKey, this._iv);
          response = JSON.parse(Buffer.concat([decipher.update(data), decipher.final()]));

        }

        stream.destroy();

      });

      stream.on('close', () => resolve(response));

    });

  }

  /**
   * Return the local storage object as it is.
   * 
   * This is a read-only operation and if you modify the object and pass it back to Bouillion
   * it will cause issues with other operations.
   * 
   * @since 0.1.0
   * 
   * @returns {Object}
   */
  storage() {

    return this._store;

  }

}