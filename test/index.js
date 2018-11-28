'use strict'

const fs = require('fs');
const assert = require('assert');
const Bouillon = require('../index');

const options = {
  name: 'mocha-test',
  cwd: './test',
  encryptionKey: 'PfHJgpKNEKawuTHDCRmdTZKMyfvSZGnf'
};

const bouillon = new Bouillon(options);

// Set a default store so that the test has simulated data to work with.
bouillon._store = {
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

describe('Bouillon', () => {

  describe('#get()', () => {

    it('should return "world"', () => {
      assert.deepEqual(bouillon.get('hello'), 'world');
    });

    it('should return "The Witcher"', () => {
      assert.deepEqual(bouillon.get('favorites.book'), { series: 'The Witcher' });
    });

    it('should return "Iron Man"', () => {
      assert.deepEqual(bouillon.get('favorites.tv.superhero.top'), 'Iron Man');
    });

  });

  describe('#set()', () => {

    it('should set a new top level key of coffee:black', () => {
      bouillon.set('coffee', 'black');
      assert.deepEqual(bouillon._store['coffee'], 'black');
    });

    it('should set a new key value pair under "game" with relaxing:Stardew Valley', () => {
      bouillon.set('favorites.game.relaxing', 'Stardew Valley');
      assert.deepEqual(bouillon._store['favorites']['game']['relaxing'], 'Stardew Valley');
    });

    it('should replace the key value pair of hello:world to hello:my darling', () => {
      bouillon.set('hello', 'my darling');
      assert.deepEqual(bouillon._store['hello'], 'my darling');
    });

    it('should replace the existing deep level key value pair of favorite.game.action: Tomb Raider to favorite.game.action: Uncharted', () => {
      bouillon.set('favorites.game.action', 'Uncharted');
      assert.deepEqual(bouillon._store['favorites']['game']['action'], 'Uncharted');
    });

    it('should set a new top level key value pair of friends: [Joe, Bob, Susan, Mary, Sally]', () => {
      bouillon.set('friends', ['Joe', 'Bob', 'Susan', 'Mary', 'Sally']);
      assert.deepEqual(bouillon._store['friends'], ['Joe', 'Bob', 'Susan', 'Mary', 'Sally']);
    });

    it('should set up a new deep level key value pair of favorite.game.friends: [Joe, Bob, Susan, Mary, Sally]', () => {
      bouillon.set('favorites.game.friends', ['Joe', 'Bob', 'Susan', 'Mary', 'Sally']);
      assert.deepEqual(bouillon._store['favorites']['game']['friends'], ['Joe', 'Bob', 'Susan', 'Mary', 'Sally']);
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
      assert.deepEqual(bouillon._store['pizza'], obj);
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
      assert.deepEqual(bouillon._store['favorites']['game']['food'], obj);
    });

  });

  describe('#write()', () => {

    it('should create an encrypted mocha-test.txt file asynchronously', async () => {
      const write = await bouillon.write();

      assert(fs.existsSync(`${bouillon._options.cwd}/${bouillon._options.name}.txt`), true);
    });

  });

  describe('#writeSync()', () => {

    it('should create an encrypted mocha-test.txt file synchronously', () => {
      const write = bouillon.writeSync();

      assert(fs.existsSync(`${bouillon._options.cwd}/${bouillon._options.name}.txt`), true);
    });

  });

  describe('#read()', () => {

    it('should read the storage file as JSON', async () => {
      const response = await bouillon.read();
      assert.deepEqual(typeof (response), 'object');
    });

    it('should match the JSON structure of bouillon._store', async () => {
      const response = await bouillon.read();
      assert.deepEqual(response, bouillon._store);
      fs.unlinkSync(`${bouillon._options.cwd}/${bouillon._options.name}.txt`);
    });

  });

  describe('#store', () => {

    it('should display the current local data object and match bouillon._store', () => {
      assert.deepEqual(bouillon.store, bouillon._store);
    });

  });

});