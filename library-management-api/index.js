// index.js
const express = require('express');
const bodyParser = require('body-parser');
const { readBooks, writeBooks } = require('./books');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Library Management System API!');
});

// Create a new book
app.post('/books', (req, res) => {
    const { book_id, title, author, genre, year, copies } = req.body;

    if (!book_id || !title || !author || !genre || !year || !copies) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const books = readBooks();
    if (books.some(book => book.book_id === book_id)) {
        return res.status(400).json({ error: 'Book ID already exists' });
    }

    const newBook = { book_id, title, author, genre, year, copies };
    books.push(newBook);
    writeBooks(books);

    res.status(201).json(newBook);
});

// Retrieve all books
app.get('/books', (req, res) => {
    const books = readBooks();
    res.json(books);
});

// Retrieve a specific book by ID
app.get('/books/:id', (req, res) => {
    const { id } = req.params;
    const books = readBooks();
    const book = books.find(book => book.book_id === id);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
});

// Update a book by ID
app.put('/books/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const books = readBooks();
    const bookIndex = books.findIndex(book => book.book_id === id);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const updatedBook = { ...books[bookIndex], ...updates };
    books[bookIndex] = updatedBook;
    writeBooks(books);

    res.json(updatedBook);
});

// Delete a book by ID
app.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    const books = readBooks();
    const newBooks = books.filter(book => book.book_id !== id);

    if (books.length === newBooks.length) {
        return res.status(404).json({ error: 'Book not found' });
    }

    writeBooks(newBooks);
    res.json({ message: 'Book deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
