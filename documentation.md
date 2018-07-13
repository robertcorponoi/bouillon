# Installation

Bouillon requires **node 7.6.0** or greater for ES2015 and async support.

```
$ npm install --save bouillon
```

# Initialization

Like any other module, to use Bouillion in your project you have to require it. After requiring it, you have to initialize it with a set of options with at the `name` option set.

The list of initialization options are as shown:

| Type    | Option        | Description          | Default | Required |
| ------- | ------------- | -------------------- | ------- | -------- |
| string  | name          | Name of your project | null    | yes
| string  | cwd           | Your project's directory or the directory where you would like to save the data | Your current project's working directory. | no |
| boolean | autosave      | Whether to save the data to the file automatically after setting any data | false | no |
| string  | encryptionKey | An aes-256 compatible key to use for encrypting saved data |null | no |

**Note:** Using an encryption key is highly recommended so the data is not saved as plain text.

Using the most basic configuration we can initialize an instance of bouillion.

```js
const Bouillon = require('bouillon');

let options = {
    name: 'my-awesome-app',
};

let bouillon = new Bouillon(options);
```

# API

## **get(key)**

`get(key)` will check the local data object for the specified key and return the value if the key exists. For deep searches, you can input a key with dot notation, for example example: `bouillon.get('favorite.movies.action')` will instruct bouillon to search for the nested action key. If the specified key does not exist, bouillion will simply return `undefined`.

| Type   | Option | Description                                               | Default |
| ------ | ------ | --------------------------------------------------------- | ------ |
| string | key    | The key to search for using dot notation for a nested key | null    |

Using the following sample storage,

```js
{
    hello: world,
    favorite: {
        movie: {
            action: 'Indiana Jones'
        }
    }
}
```
 
 Getting a top level value:

 ```js
 bouillon.get('hello'); 
 // => 'world'
```

Getting a deep nested value

```js
bouillion.get('favorite.movie.action'); 
// => 'Indiana Jones'
```

---

## **set(key, value)**

`set(key, value)` will insert a key and value at at the specified position in the object. If you want to set a deep nested key, use dot notation to specify the path to the key like in the `get()`.

| Type   | Option | Description                                               | Default |
| ------ | ------ | --------------------------------------------------------- | ------ |
| string | key    | The key to insert or update, if nested use dot notation | null    |
| Mixed  | value  | The value to add for the specified key                  | null

Using the following sample storage,

```js
{
    hello: world,
    favorite: {
        movie: {
            action: 'Indiana Jones'
        }
    }
}
```
 
Set a top level key to a different value:

 ```js
 bouillon.set('hello', 'my darling!');
```

Which causes the object to now look like:

```js
{
    hello: 'my darling!',
    favorite: {
        movie: {
            action: 'Indiana Jones'
        }
    }
}
```

If you would like to set a deep nested key, such as adding other movies to our favorite movies, use the following:

```js
bouillon.set('favorite.movie.comedy', ['Marley and Me', 'Bridesmaids', 'Dinner for Schmucks']);
```

Which causes the object to now look like:

```js
{
    hello: 'my darling!',
    favorite: {
        movie: {
            action: 'Indiana Jones',
            comedy: ['Marley and Me', 'Bridesmaids', 'Dinner for Schmucks']
        }
    }
}
```

---

## **write()**

`write()` takes the current storage object and writes it to disk in the path specified by `options.cwd` or in your projects directory by default. This version of write returns a promise so you must use `.then()` or call it in an `async` function.

Example using `.then()`:

```js
bouillon.write()
    .then(() => {
        // No data is returned but you can do something after it writes if you please.
    })
    .catch((err) => {
        console.log(err);
    });
```

Using it in an `async` fashion accomplishes the same task it just looks cleaner:

```js
await bouillon.write().catch((err) => console.log(err));
```

---

## **writeSync()**

`writeSync()` is the same as `write()` except that it is a synchronous action.

Example:

```js
bouillon.writeSync();
```

---

## **read()**

`read()` is an asynchronous action that returns the data in a JSON parsed format as it is saved on the drive.

Example using `.then()`:

```js
bouillon.read()
    .then((data) => {
        // Do something with the data.
    })
    .catch((err) => {
        console.log(err):
    });
```

Example using `await`:

```js
let data = await bouillon.read().catch((err) => console.log(err));
// Do something with the data.
```

---

## **show()**

`show()` simply returns the current local data object. It's the same as if you would access the store as `bouillon.store`.

---

## **size()**

`size()` returns the size of the local data object.