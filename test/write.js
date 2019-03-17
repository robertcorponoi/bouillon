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

describe('Writing data to a text file asynchronously', () => {

  beforeEach(() => {

    bouillon = new Bouillon(options);

    bouillon._store = mockData;

  });

  afterEach(() => {

    fs.unlinkSync(`${bouillon.options.cwd}/${bouillon.options.name}.txt`);

    bouillon = null;

  });

  it('should create an encrypted bouillon.txt file asynchronously', async () => {

    await bouillon.write();

    chai.expect(fs.existsSync(`${bouillon.options.cwd}/${bouillon.options.name}.txt`)).to.be.true;

  });

});

// Initialize different options for the writeSync so that we don't double check.
const optionsSync = { name: 'bouillonSync', cwd: './test', encryptionKey: 'PfHJgpKNEKawuTHDCRmdTZKMyfvSZGnf' };

describe('Writing data to a text file synchronously', () => {

  beforeEach(() => {

    bouillon = new Bouillon(optionsSync);

    bouillon._store = mockData;

  });

  afterEach(() => {

    fs.unlinkSync(`${bouillon.options.cwd}/${bouillon.options.name}.txt`);

    bouillon = null;

  });

  it('should create an encrypted bouillonSync.txt file synchronously', () => {

    bouillon.writeSync();

    chai.expect(fs.existsSync(`${bouillon.options.cwd}/${bouillon.options.name}.txt`)).to.be.true;

  });

});