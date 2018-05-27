# Bouillon

[add gitter] [add npm tag] [add build] [add coverage]

Bouillon is a persistant storage option that lets you manage your data as an object and encrypts and stores it in a directory of your choosing. You can work with a local copy of your data and save/read the stored version at any time. 

Bouillon saves your data atomically so that you always have a good version of your data even if something went wrong while saving and it has support for auto-saving if you're confident about your changes to your local object and don't want to worry about saving.

Bouillon has only one dependency and that is NPM's [`write-file-atomic`](https://www.npmjs.com/package/write-file-atomic) which is used to save the data atomically.

## Installation

Bouillon prefers the latest version of node but it will work with node v7.6.0 or higher for ES2015 and async function support.

```
$ npm install --save bouillon
```

## Basic Example

To start using Bouillon, simply start by requiring the module, setting your desired [options](documentation.md#options), and creating a new instance of the class.

```js
const Bouillon = require("bouillon");

let options = {
    name: "my-cool-node-app",
    encryptionKey: "PfHJgpKNEKawuTHDCRmdTZKMyfvSZGnf",
};

let bouillon = new Bouillon(options);
```

From there you're free to modify the local object and save it.

```js
bouillon.set("favorite.movie", "Iron Man");

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