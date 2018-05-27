"use strict"

const writeFileAtomic = require("write-file-atomic");
const fs = require("fs");
const crypto = require("crypto");
const utils = require("./utils");

delete require.cache[require.resolve(__filename)];

/**
 * Simple JSON storage API for working with persistent data in various types of Node applications.
 * @param {Object} options 
 */
function Storage(options) {
    if (!options.name) throw new Error("Please specify the project name.");
    this.name = options.name;

    if (!options.cwd) this.cwd = utils.getCwd();
    else this.cwd = options.cwd;

    this.autosave = options.autosave || true;
    this.encryptionKey = options.encryptionKey;

    this.store = {};
}

/**
 * Return the value of a specified key accessed by dot notation syntax.
 * @public
 * @param {string} key - The key that correspondgs to the value you want to retrieve. This follows dot notation syntax.
 * @returns {*}
 */
Storage.prototype.get = function (key) {
    if (key.indexOf(".") < 0) return this.store[key];

    let keys = key.split(".");
    let temp = this.store;

    return utils.findKey(keys, temp);
};

/**
 * Add a single key value pair anywhere in the storage by specifying it's location by dot notation.
 * @public
 * @param {string} key - Where the key should go. This follows the dot notation syntax and with no dots it will be put top level.
 * @param {*} value - Any value for the corresponding key.
 */
Storage.prototype.set = function (key, value) {
    let obj = {};

    if (key.indexOf(".") < 0) {
        obj[key] = value;
        this.store = Object.assign(this.store, obj);
    }
    else {
        let keys = key.split(".");
        let last = keys.pop();
        let temp = this.store;

        temp = utils.findKey(keys, temp);
        if (temp == undefined) throw new Error("Creation of only 1 new key per set is supported.");
        temp[last] = value;
    }
};

/**
 * Asynchronously and atomically write the storage to a text file
 * with encryption if a key provided and return a promise upon completion.
 * @public
 * @returns {Promise}
 */
Storage.prototype.write = function () {
    return new Promise((resolve, reject) => {
        let data = JSON.stringify(this.store);

        if (this.encryptionKey) {
            this.iv = crypto.randomBytes(16);
            let cipher = crypto.createCipheriv("aes-256-cbc", this.encryptionKey, this.iv);
            data = Buffer.concat([cipher.update(data), cipher.final()]);
        }

        writeFileAtomic(`${this.cwd}/${this.name}.txt`, data, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

/**
 * Synchronously and atomically write the storage
 * to a text file with encryption if a key is provided.
 * @public
 */
Storage.prototype.writeSync = function () {
    let data = JSON.stringify(this.store);

    if (this.encryptionKey) {
        this.iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv("aes-256-cbc", this.encryptionKey, this.iv);
        data = Buffer.concat([cipher.update(data), cipher.final()]);
    }

    writeFileAtomic.sync(`${this.cwd}/${this.name}.txt`, data)
};

/**
 * Asynchronously read the text file that contains the storage
 * and return a promise with the JSON data contained within it.
 * @public
 * @returns {Promise}
 */
Storage.prototype.read = function () {
    return new Promise(resolve => {
        const stream = fs.createReadStream(`${this.cwd}/${this.name}.txt`);
        let response;

        stream.on("data", data => {
            if (this.encryptionKey) {
                let decipher = crypto.createDecipheriv("aes-256-cbc", this.encryptionKey, this.iv);
                response = (JSON.parse(Buffer.concat([decipher.update(data), decipher.final()])));
            }
            stream.destroy();
        });
        stream.on("close", () => {
            resolve(response);
        });
    });;
};

/**
 * Return the entire storage object for viewing.
 * This is meant to be a read-only operation not to be modified and synched back.
 * @public
 * @returns {Object}
 */
Storage.prototype.show = function () {
    return this.store;
};

/**
 * Return the size of the current storage object.
 * Currently this does not return deep elements only top level ones.
 * @public
 * @returns {number}
 */
Storage.prototype.size = function () {
    return Object.keys(this.store).length;
};

module.exports = Storage;