const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const { getAllBooks, getBooksById } = require('./controllers');

app.get('/books', async (req, res) => {
  let books = getAllBooks();
  res.json({books});
});

app.get('/books/details/:id', async (req, res) => {
  let book = await getBooksById(parseInt(req.params.id));
  res.json({book,});
});

module.exports = { app };