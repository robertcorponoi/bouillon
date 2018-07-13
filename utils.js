'use strict'

module.exports = {
  /**
   * Search an object to find a deep level key and return it if it exists.
   * 
   * @since 0.1.0
   * @param {Array} keys The key to search for including the keys parenting it.
   * @param {Object} storage The storage object to search through for the specified key.
   * @returns {*}
   */
  getKeyValue(keys, storage) {
    for (let i = 0, storeLen = keys.length; i < storeLen; ++i) {
      if (keys[i] in storage) storage = storage[keys[i]];
      else return;
    }

    return storage;
  },

  /**
   * Get the current working directory of the project.
   * 
   * @since 0.1.0
   * @returns {string}
   */
  getCWD() {
    let dir = module.parent.filename.split('\\');
    dir.pop();

    return dir.join('\\');
  }
}