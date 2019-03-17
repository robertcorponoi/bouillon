'use strict'

const pkg = require('./package.json');

/**
 * Defines the options available for Bouillon along with their default values
 * which will be used if no value is provided for the option.
 * 
 * @author Robert Corponoi <robertcorponoi@gmail.com>
 * 
 * @version 0.1.0
 */
export default class Options {

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
  name: string = pkg.name;

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
  cwd: string = process.cwd();

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
  autosave: boolean = false;

  /**
   * An AES-256 compatible key to use for encryptin save data.
   * 
   * @since 0.1.0
   * 
   * @property {string}
   * 
   * @default ''
   */
  encryptionKey: string = '';

  /**
   * @param {Object} options The initialization options passed to Bouillion.
   */
  constructor(options: Object) {

    Object.assign(this, options);

  }

}