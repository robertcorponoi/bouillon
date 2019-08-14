// 'use strict'

// const chai = require('chai');
// const Bouillon = require('../index.js');

// let bouillon;

// // Initialize Bouillon so that it saves in the test directory.
// const options = { name: 'bouillon', cwd: './test', encryptionKey: 'PfHJgpKNEKawuTHDCRmdTZKMyfvSZGnf' };

// describe('Removing items from the storage', () => {

//   beforeEach(() => {

//     bouillon = new Bouillon(options);

//     bouillon._store = {
//       'hello': 'world',
//       'favorites': {
//         'game': {
//           'action': 'Tomb Raider',
//           'top-5': ['Tomb Raider', 'Stardew Valley', 'Divinity Original Sin 2', 'Superflight', 'Monster Hunter World']
//         },
//         'book': {
//           'series': 'The Witcher'
//         },
//         'tv': {
//           'superhero': {
//             'top': 'Iron Man',
//             'meh': 'Captain America'
//           }
//         }
//       }
//     };

//   });

//   afterEach(() => bouillon = null);

//   it('should remove a top level key', () => {

//     bouillon.remove('favorites');

//     chai.expect(bouillon._store).to.deep.equal({
//       'hello': 'world',
//     });

//   });

//   it('should remove a nested key', () => {

//     bouillon.remove('favorites.game.action');

//     chai.expect(bouillon._store).to.deep.equal({
//       'hello': 'world',
//       'favorites': {
//         'game': {
//           'top-5': ['Tomb Raider', 'Stardew Valley', 'Divinity Original Sin 2', 'Superflight', 'Monster Hunter World']
//         },
//         'book': {
//           'series': 'The Witcher'
//         },
//         'tv': {
//           'superhero': {
//             'top': 'Iron Man',
//             'meh': 'Captain America'
//           }
//         }
//       }
//     });

//   });

// });