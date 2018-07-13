# Bouillon

Bouillon is a persistant storage soluation for Node that lets you manage your data as an object and when you're ready it will encrypt and write the file for you atomically to disk. You can work with your local copy of the data and save/read the stored version at any time.

As Bouillon saves your data atomically, you know that you'll always have a good version of your data even if there was an error while saving.

Bouillon has only one dependency and that is NPM's [`write-file-atomic`](https://www.npmjs.com/package/write-file-atomic) which is used to save the data atomically.

## **Installation**

Bouillon prefers the latest version of node but it will work with node v7.6.0 or higher for ES2015 and async function support.

```
$ npm install --save bouillon
```

## **Basic Example**

To begin using Bouillion, simply require the module, setup your desired options ([Click here for more information about Bouillon's options](documentation.md#options)), and create a new instance of Bouillon.
```js
const Bouillon = require('bouillon');

const options = {
  name: 'my-cool-node-app',
  encryptionKey: 'PfHJgpKNEKawuTHDCRmdTZKMyfvSZGnf',
};

let bouillon = new Bouillon(options);
```

From there you're free to modify the local object and save it.

```js
bouillon.set('favorite.movie', 'Iron Man');

bouillon.write()
    .then((data) => {
        // Do something after you write.
    });

// Or write synchronously.
bouillon.writeSync();
```

Check out the full [documentation](documentation.md) to learn about all the features and how to use them correctly.

## Documentation

[Click here](documentation.md) to view the full Bouillon documentation.

## Running Tests

To run the currently available Bouillon tests, simply use the command below.

```
$ npm test
```

## License

MIT