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

describe('Setting data to the storage object', () => {

  beforeEach(() => {

    bouillon = new Bouillon(options);

    bouillon._store = mockData;

  });

  afterEach(() => bouillon = null);

  it('should set a new top level key of coffee:black', () => {

    bouillon.set('coffee', 'black');

    chai.expect(bouillon._store['coffee']).to.equal('black');

  });

  it('should set a new key value pair under `game` with relaxing:Stardew Valley', () => {

    bouillon.set('favorites.game.relaxing', 'Stardew Valley');

    chai.expect(bouillon._store['favorites']['game']['relaxing']).to.equal('Stardew Valley');

  });

  it('should replace the key value pair of hello:world to hello:my darling', () => {

    bouillon.set('hello', 'my darling');

    chai.expect(bouillon._store['hello']).to.equal('my darling');

  });

  it('should replace the existing deep level key value pair of favorite.game.action: Tomb Raider to favorite.game.action: Uncharted', () => {
    
    bouillon.set('favorites.game.action', 'Uncharted');
    
    chai.expect(bouillon._store['favorites']['game']['action']).to.equal('Uncharted');

  });

  it('should set a new top level key value pair of friends: [Joe, Bob, Susan, Mary, Sally]', () => {
    
    bouillon.set('friends', ['Joe', 'Bob', 'Susan', 'Mary', 'Sally']);
    
    chai.expect(bouillon._store['friends']).to.deep.equal(['Joe', 'Bob', 'Susan', 'Mary', 'Sally']);

  });

  it('should set up a new deep level key value pair of favorite.game.friends: [Joe, Bob, Susan, Mary, Sally]', () => {
    
    bouillon.set('favorites.game.friends', ['Joe', 'Bob', 'Susan', 'Mary', 'Sally']);
    
    chai.expect(bouillon._store['favorites']['game']['friends']).to.deep.equal(['Joe', 'Bob', 'Susan', 'Mary', 'Sally']);

  });

  it('should set up a new top level key value pair of pizza: [Object]', () => {

    let obj = {
      'favorite': 'chicken',
      'toppings': ['jalapenos', 'banana peppers', 'olives'],
      'no nos': {
        'most gross': 'mushrooms'
      }
    };

    bouillon.set('pizza', obj);

    chai.expect(bouillon._store['pizza']).to.deep.equal(obj);

  });

  it('should set up a new deep level key value pair of pizza: [Object]', () => {

    let obj = {
      'favorite': 'chicken',
      'toppings': ['jalapenos', 'banana peppers', 'olives'],
      'no nos': {
        'most gross': 'mushrooms'
      }
    };

    bouillon.set('favorites.game.food', obj);

    chai.expect(bouillon._store['favorites']['game']['food']).to.deep.equal(obj);
    
  });

});