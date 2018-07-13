"use strict"

const fs = require('fs');
const crypto = require('crypto');
const writeFileAtomic = require('write-file-atomic');
const utils = require('./utils');

delete require.cache[require.resolve(__filename)];

function Bouillon(options = {}) {
  if (!options.name) throw new Error('Please specify the project name');
  this.name = options.name;

  if (!options.cwd) this.cwd = utils.getCWD();
  else this.cwd = options.cwd;

  this.autosave = options.autosave || true;
  this.encryptionKey = options.encryptionKey;

  this.store = {};
}

/**
 * Return the value associated with the specified key.
 * If the key is nested, it must be specified with dot notation syntax.
 * 
 * @since 0.1.0
 * @param {string} key The key that corresponds to the value to receive. If nested, it must be specified with dot notation syntax.
 * @returns {*}
 */
Bouillon.prototype.get = function (key) {
  if (key.indexOf('.') < 0) return this.store[key];

  const keys = key.split('.');
  const temp = this.store;

  const result = utils.getKeyValue(keys, temp);
  return result;
};

/**
 * Add a (key, value) pair to storage by placing the value at the specified key location.
 * If the key is nested, it must be specified with dot notation syntax.
 * 
 * @since 0.1.0
 * @param {string} key The key that corresponds to the value to set. If nested, it must be specified with dot notation syntax.
 */
Bouillon.prototype.set = function (key, value) {
  let obj = {};

  if (key.indexOf('.') < 0) {
    obj[key] = value;
    this.store = Object.assign(this.store, obj);
  } else {
    const keys = key.split('.');
    const last = keys.pop();
    let temp = this.store;

    temp = utils.getKeyValue(keys, temp);

    if (temp == undefined) throw new Error('Creation of only 1 new key per set operation is supported');

    temp[last] = value;
  }
};

/**
 * Encrypt and write a file asynchronously to the disk atomically so that if it is
 * interrupted the file will not be corrupted.
 * 
 * @since 0.1.0
 * @returns {Promise}
 */
Bouillon.prototype.write = function () {
  return new Promise((resolve, reject) => {
    let data = JSON.stringify(this.store);

    if (this.encryptionKey) {
      this.iv = crypto.randomBytes(16);
      let cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, this.iv);

      data = Buffer.concat([cipher.update(data), cipher.final()]);
    }

    writeFileAtomic(`${this.cwd}/${this.name}.txt`, data, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

/**
 * Encrypt and write a file synchronously to the disk atomically so that if
 * it is itnerrupted the file will not be corrupted.
 * 
 * @since 0.1.0
 */
Bouillon.prototype.writeSync = function () {
  let data = JSON.stringify(this.store);

  if (this.encryptionKey) {
    this.iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, this.iv);

    data = Buffer.concat([cipher.update(data), cipher.final()]);
  }

  writeFileAtomic.sync(`${this.cwd}/${this.name}.txt`, data);
};

/**
 * Asynchronously read the storage file on disk and return the data as JSON.
 * 
 * @since 0.1.0
 * @returns {Promise}
 */
Bouillon.prototype.read = function () {
  return new Promise(resolve => {
    let stream = fs.createReadStream(`${this.cwd}/${this.name}.txt`);
    let response;

    stream.on('data', data => {
      if (this.encryptionKey) {
        let decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, this.iv);
        response = JSON.parse(Buffer.concat([decipher.update(data), decipher.final()]));
      }

      stream.destroy();
    });

    stream.on('close', () => {
      resolve(response);
    });
  });
};

/**
 * Return the storage object as is. This operation is meant to be read-only
 * and not to be returned back to Bouillion in any way.
 * 
 * @since 0.1.0
 * @returns {Object}
 */
Bouillon.prototype.storage = function () {
  return this.store;
};

module.exports = Bouillon;