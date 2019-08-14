import Store from './interfaces/Store';
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
export default class Bouillion {
    /**
     * The options for this instance of Bouillon.
     *
     * @property {Options}
     * @readonly
     */
    private options;
    /**
     * The local storage object which will be used to store data until it gets
     * saved.
     *
     * @property {Store}
     */
    private _store;
    /**
     * The initialization vector to use for encryption.
     *
     * @property {Buffer}
     */
    private iv;
    /**
     * @param {Options} [options]
     * @param {string} [options.name='package.json.name'] The name Bouillion will use for the file that contains the saved data.
     * @param {string} [options.cwd=process.cwd()] The location where Bouiillion should save the text file containing the saved data.
     * @param {boolean} [options.autosave=false] Indicates whether the text file will be written automatically after every time data is added.
     * @param {string} [options.encryptionKey=''] An AES-256 compatible key to use for encryptin save data.
     */
    constructor(options?: Object);
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
    readonly store: Store;
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
    get(key: string): any;
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
    set(key: string, value: any): void;
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
    write(): Promise<any>;
    /**
     * Write and encrypt, if an encryption key is present, a file synchronously and atomically to the disk.
     *
     * Note that this is a synchronous operation and is generally not recommended unless you know that you need to use it in this fashion.
     *
     * @example
     *
     * bouillon.writeSync();
     */
    writeSync(): void;
    /**
     * Asynchronously reads the data file from disk and returns the data parsed as an object.
     *
     * @returns {Promise<Store>}
     *
     * @example
     *
     * const data = await bouillon.read();
     */
    read(): Promise<Store>;
    /**
     * Clears all data from the store.
     *
     * @example
     *
     * bouillon.clear();
     */
    clear(): void;
}
