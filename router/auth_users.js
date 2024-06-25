const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

/**
 * This function checks if the user exists in the list of registered users.
 * 
 * @param {string} username 
 * @returns {boolean} 
 */
const isValid = (username) => { //returns boolean
    let user = users.find(user => user.username === username);

    return !!user;
};

const authenticatedUser = (username, password) => { //returns boolean
    let user = users.find(user => user.username === username && user.password === password);

    return !!user;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username or password is missing." });
    }

    if (!isValid(username)) {
        return res.status(400).json({ message: "User does not exist." });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT access token
    let accessToken = jwt.sign(
        { username: username },
        process.env.AUTH_SECRET,
        { expiresIn: 60 * 60 }
    );

    // Store access token and username in session
    req.session.authorization = {
        accessToken,
        username
    };

    return res.status(200).send("User logged in successfully.");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let book = books[req.params.isbn];
    let review = req.query.review;

    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }

    if (!review) {
        return res.status(400).json({ message: "Review is missing." });
    }

    book.reviews[req.session.authorization.username] = review;

    return res.status(200).json({ message: "Review added successfully." });
    
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    } 

    delete book.reviews[req.session.authorization.username];

    res.status(200).json({ message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
