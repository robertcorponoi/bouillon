'use strict'

const fs = require('fs');
const chai = require('chai');
const Bouillon = require('../index.js');

let bouillon;

// Initialize Bouillon so that it saves in the test directory.
const options = { name: 'bouillon', cwd: './test', encryptionKey: 'PfHJgpKNEKawuTHDCRmdTZKMyfvSZGnf' };

// Create a default set of data that we can work with.
const mockData = {
  'hello': 'world',
  'favorites': {
    'game': {
      'action': 'Tomb Raider',
      'top-5': ['Tomb Raider', 'Stardew Valley', 'Divinity Original Sin 2', 'Superflight', 'Monster Hunter World']
    },
    'book': {
      'series': 'The Witcher'
    },
    'tv': {
      'superhero': {
        'top': 'Iron Man',
        'meh': 'Captain America'
      }
    }
  }
};

describe('Reading data from the text file', () => {

  beforeEach(() => {
    
    bouillon = new Bouillon(options);

    bouillon._store = mockData;

  });

  afterEach(() => {
    
    fs.unlinkSync(`${bouillon.options.cwd}/${bouillon.options.name}.txt`);

    bouillon = null;

  });

  it('should read the file as an object', async () => {

    bouillon.writeSync();

    const response = await bouillon.read();

    chai.expect(typeof (response)).to.equal('object');

  });

  it('should match the structure of the storage object', async () => {

    bouillon.writeSync();

    const response = await bouillon.read();

    chai.expect(response).to.deep.equal(bouillon._store);

  });

});