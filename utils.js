"use strict"

module.exports = {
    /**
     * Iterate through an object and find the deep level key and when found,
     * assign the existing object to it and return it.
     * @private
     * @param {Array} keys - The key string split into an array.
     * @param {Object} obj - The object to search through for the key.
     * @returns {*}
     */
    findKey(keys, obj) {
        for (let i = 0, len = keys.length; i < len; ++i) {
            let curr = keys[i];

            if (curr in obj) {
                obj = obj[curr]
            }
            else {
                return;
            }
        }

        return obj;
    },

    /**
     * Return the current working directory which is going to be used
     * as a default value if a cwd isn't provided.
     * @private
     * @returns {string}
     */
    getCwd() {
        let cwd = module.parent.filename.split("\\");
        cwd.pop();
        return cwd.join("\\");
    },
}