'use strict'

/**
 * Utility functions meant for Bouillon to help find nested keys
 * in the local storage object and for getting the default working
 * directory if none is provided in the options.
 * 
 * @since 0.1.0
 */
module.exports = {

  /**
   * Search the storage object and find a deep level key.
   * 
   * @since 0.1.0
   * 
   * @param {Array} key The key, including its parent, to search for in the storage object.
   * @param {Object} storage The local storage object from Bouillon.
   * 
   * @returns {string} The key if found in the storage object.
   */
  getKeyValue(keys, storage) {

    for (let i = 0, storeLen = keys.length; i < storeLen; ++i) {
      
      if (keys[i] in storage) storage = storage[keys[i]];

      else return;
    }

    return storage;

  }
  
}