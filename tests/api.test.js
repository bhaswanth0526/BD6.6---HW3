let request = require('supertest');
let { app } = require('../index.js');
let { getAllBooks, getBooksById } = require('../controllers');
let http = require('http');

jest.mock('../controllers', () => ({
  ...jest.requireActual('../controllers'),
  getAllBooks: jest.fn(),
  getBooksById: jest.fn(),
}));

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3000, done)
});

afterAll((done) => {
  server.close(done);
});

describe('Controllers Function Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all books', () => {
    let mockBooks = [
      {
          'bookId': 1,
          'title': 'To Kill a Mockingbird',
          'author': 'Harper Lee',
          'genre': 'Fiction'
      },
      {
          'bookId': 2,
          'title': '1984',
          'author': 'George Orwell',
          'genre': 'Dystopian'
      },
      {
          'bookId': 3,
          'title': 'The Great Gatsby',
          'author': 'F. Scott Fitzgerald',
          'genre': 'Classic'
      }
    ];

    getAllBooks.mockReturnValue(mockBooks);
    let result = getAllBooks();
    expect(result).toEqual(mockBooks);
    expect(result.length).toBe(3);
  });
});

describe('API Endpoints tests', () => {
  it('GET /books should get all books', async () => {
    const res = await request(server).get('/books');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      books: [
        {
            'bookId': 1,
            'title': 'To Kill a Mockingbird',
            'author': 'Harper Lee',
            'genre': 'Fiction'
        },
        {
            'bookId': 2,
            'title': '1984',
            'author': 'George Orwell',
            'genre': 'Dystopian'
        },
        {
            'bookId': 3,
            'title': 'The Great Gatsby',
            'author': 'F. Scott Fitzgerald',
            'genre': 'Classic'
        }
      ]
    });
    expect(res.body.books.length).toBe(3);
  });

  it('GET /books/details/:id should get a book by ID', async () => {
    const mockBook = {
      'bookId': 1,
      'title': 'To Kill a Mockingbird',
      'author': 'Harper Lee',
      'genre': 'Fiction'
    };

    getBooksById.mockResolvedValue(mockBook);
    const res = await request(server).get('/books/details/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      book: mockBook
    });
  });
});