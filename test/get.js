'use strict'

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

describe('Retrieving data from the storage object', () => {

  beforeEach(() => {
    
    bouillon = new Bouillon(options);

    bouillon._store = mockData;

  });

  afterEach(() => bouillon = null);

  it('should return `world`', () => {

    chai.expect(bouillon.get('hello')).to.equal('world');

  });

  it('should return `The Witcher`', () => {

    chai.expect(bouillon.get('favorites.book')).to.deep.equal({ series: 'The Witcher' });

  });

  it('should return `Iron Man`', () => {

    chai.expect(bouillon.get('favorites.tv.superhero.top')).to.equal('Iron Man');

  });

});