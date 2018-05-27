"use strict"

const assert = require("assert");
const fs = require("fs");
const Bouillon = require("../index");

let options = {
    name: "Test",
    cwd: "./test",
    encryptionKey: "PfHJgpKNEKawuTHDCRmdTZKMyfvSZGnf"
};

const bouillon = new Bouillon(options);
bouillon.store = {
    "hello": "world",
    "favorite": {
        "game": {
            "action": "Tomb Raider",
            "top-5": ["Tomb Raider", "Stardew Valley", "Divinity Original Sin 2", "Superflight", "Monster Hunter World"]
        },
        "book": {
            "series": "The Witcher"
        },
        "tv": {
            "superhero": {
                "top": "Iron Man",
                "meh": "Captain America",
            },
        },
    },
};

describe("Storage", function () {

    describe("#get()", function () {

        it("should return the value from favorite.game.top-5", function () {
            assert.deepEqual(bouillon.get("favorite.game.top-5"), ["Tomb Raider", "Stardew Valley", "Divinity Original Sin 2", "Superflight", "Monster Hunter World"]);
        });

        it("should return Iron Man", function () {
            assert.deepEqual(bouillon.get("favorite.tv.superhero.top"), "Iron Man");
        });

        it("should return undefined", function () {
            assert.deepEqual(bouillon.get("favorite.movie"), undefined);
        });

    });

    describe("#show()", function () {

        it("should return the entire storage object", function () {
            assert.deepEqual(bouillon.show(), { "hello": "world", "favorite": { "game": { "action": "Tomb Raider", "top-5": ["Tomb Raider", "Stardew Valley", "Divinity Original Sin 2", "Superflight", "Monster Hunter World"] }, "book": { "series": "The Witcher" }, "tv": { "superhero": { "top": "Iron Man", "meh": "Captain America", }, }, }, });
        });

    });

    describe("#size()", function () {

        it("should return a size of 2", function () {
            assert.deepEqual(bouillon.size(), 2);
        });

    });

    describe("#set()", function () {

        it("should set a new top level key value pair of coffee: black", function () {
            bouillon.set("coffee", "black");
            assert.deepEqual(bouillon.store["coffee"], "black");
        });

        it("should set a new deep level key value pair of favorite.game.relaxing: Stardew Valley", function () {
            bouillon.set("favorite.game.relaxing", "Stardew Valley");
            assert.deepEqual(bouillon.store["favorite"]["game"]["relaxing"], "Stardew Valley");
        });

        it("should replace the existing top level key value pair of hello: world to hello: my darling", function () {
            bouillon.set("hello", "my darling");
            assert.deepEqual(bouillon.store["hello"], "my darling");
        });

        it("should replace the existing deep level key value pair of favorite.game.action: Tomb Raider to favorite.game.action: Uncharted", function () {
            bouillon.set("favorite.game.action", "Uncharted");
            assert.deepEqual(bouillon.store["favorite"]["game"]["action"], "Uncharted");
        });

        it("should set a new top level key value pair of friends: [Joe, Bob, Susan, Mary, Sally]", function () {
            bouillon.set("friends", ["Joe", "Bob", "Susan", "Mary", "Sally"]);
            assert.deepEqual(bouillon.store["friends"], ["Joe", "Bob", "Susan", "Mary", "Sally"]);
        });

        it("should set up a new deep level key value pair of favorite.game.friends: [Joe, Bob, Susan, Mary, Sally]", function () {
            bouillon.set("favorite.game.friends", ["Joe", "Bob", "Susan", "Mary", "Sally"]);
            assert.deepEqual(bouillon.store["favorite"]["game"]["friends"], ["Joe", "Bob", "Susan", "Mary", "Sally"]);
        });

        it("should set up a new top level key value pair of pizza: [Object]", function () {
            let obj = {
                "favorite": "chicken",
                "toppings": ["jalapenos", "banana peppers", "olives"],
                "no nos": {
                    "most gross": "mushrooms"
                }
            };
            bouillon.set("pizza", obj);
            assert.deepEqual(bouillon.store["pizza"], obj);
        });

        it("should set up a new deep level key value pair of pizza: [Object]", function () {
            let obj = {
                "favorite": "chicken",
                "toppings": ["jalapenos", "banana peppers", "olives"],
                "no nos": {
                    "most gross": "mushrooms"
                }
            };
            bouillon.set("favorite.game.food", obj);
            assert.deepEqual(bouillon.store["favorite"]["game"]["food"], obj);
        });

    });

    describe("#write()", function () {

        it("should create an encrypted store.txt file asynchronously", async () => {
            const result = await bouillon.write();
            assert(fs.existsSync(`${bouillon.cwd}/${bouillon.name}.txt`), true);
        });

    });

    describe("#read()", function () {

        it("should read the storage file as JSON", async () => {
            let response = await bouillon.read();
            assert.deepEqual(typeof(response), "object");
        });

        it("should match the JSON structure in bouillon.store", async () => {
            let response = await bouillon.read();
            assert.deepEqual(response, bouillon.store);
        });

    });

    describe("#show()", function () {

        it("should display the current local data object", function () {
            assert.deepEqual(bouillon.show(), bouillon.store);
        });

    });

    describe("#size()", function () {

        it("should return 5", function () {
            assert.deepEqual(bouillon.size(), 5);
        });

    });

});