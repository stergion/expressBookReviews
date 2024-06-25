const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    let username = req.body.username
    let password = req.body.password

    if(!username || !password) {
        return res.status(400).json({ message: "Username or password is missing." });
    }

    if (isValid(username)) {
        return res.status(400).json({ message: "User already exists." });
    }

    users.push({"username": username, "password": password});
    return res.status(201).json({ message: `User ${username} was created successfully.` });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.send(JSON.stringify(books));
});

public_users.get('/async/', function (req, res) {
    let get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books)))
    });

    get_books.then(() => {
        console.log("Books sent successfully");
    }).catch((err) => {
        console.log("Error: ", err);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.send(JSON.stringify(book));
});
public_users.get('/async/isbn/:isbn', function (req, res) {
    let book = books[req.params.isbn];

    let get_book = new Promise((resolve, reject) => {
        if (!book) {
            reject(res.status(404).json({ message: "Book not found" }));
        }
        resolve(res.send(JSON.stringify(book)));
    });

    get_book.then(() => {
        console.log("Book sent successfully");
    }).catch((err) => {
        console.log("Error: ", err);
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let books_found = {};
    for (let isbn in books) {
        if (books[isbn].author === req.params.author) {
            books_found[isbn] = books[isbn];
        }
    }

    if (!books_found) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.send(JSON.stringify(books_found));
});

public_users.get('/async/author/:author', function (req, res) {
    let books_found = {};
    
    let get_books = new Promise((resolve, reject) => {
        for (let isbn in books) {
            if (books[isbn].author === req.params.author) {
                books_found[isbn] = books[isbn];
            }
        }

        if (!books_found) {
            reject(res.status(404).json({ message: "Book not found" }));
        }
        resolve(res.send(JSON.stringify(books_found)));
    });

    get_books.then(() => {
        console.log("Books sent successfully");
    }).catch((err) => {
        console.log("Error: ", err);
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let books_found = {};
    for (let isbn in books) {
        if (books[isbn].title === req.params.title) {
            books_found[isbn] = books[isbn];
        }
    }

    if (!books_found) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.send(JSON.stringify(books_found));
});

public_users.get('/async/title/:title', function (req, res) {
    let books_found = {};
    
    let get_books = new Promise((resolve, reject) => {
        for (let isbn in books) {
            if (books[isbn].title === req.params.title) {
                books_found[isbn] = books[isbn];
            }
        }
        if (!books_found) {
            reject(res.status(404).json({ message: "Book not found" }));
        }
        resolve(res.send(JSON.stringify(books_found)));
    });

    get_books.then(() => {
        console.log("Books sent successfully");
    }).catch((err) => {
        console.log("Error: ", err);
    });
});
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.send(JSON.stringify(book.reviews));
});

module.exports.general = public_users;
