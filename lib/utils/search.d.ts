import Store from '../interfaces/Store';
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
export declare function getKeyValue(keys: Array<string>, store: Store): (Store | undefined);
