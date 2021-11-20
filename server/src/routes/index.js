const express = require('express');

const router  = express.Router();

const { register } = require('../controllers/register');
const { getUsers, deleteUser } = require('../controllers/users');
const { login } = require('../controllers/login');
const { addBook, getBooks, getBook, deleteBook, updateBook } = require('../controllers/books');
const { addTransaction, updateTransaction, getTransactions, getTransaction, validationSubscribe, payment } = require('../controllers/transactions');
const { updateProfile, getProfile } = require('../controllers/profile');
const { addBookPlaylist, getBookPlaylists, deleteBookList } = require('../controllers/bookPlaylists');
const { checkUser } = require('../controllers/checkUser');

const { token } = require('../middlewares/token');
const { uploadFiles } = require('../middlewares/uploadFiles');
const {updateFiles} = require('../middlewares/updateFiles');

//login
router.post('/login',login);

//register
router.post('/register',register);


//users
router.get('/users',getUsers);
router.delete('/user/:id',deleteUser);

//Book
router.post('/book',token,uploadFiles("bookFile","bookCover"),addBook);
router.get('/books',getBooks);
router.get('/book/:id',getBook);
router.put('/book/:id',token,updateFiles("bookFile","bookCover"),updateBook);
router.delete('/book/:id',token,deleteBook);

//transaction
router.post('/transaction',token,uploadFiles("proofTransaction"),addTransaction);
router.put('/transaction/:id',token,updateTransaction);
router.get('/transactions',getTransactions);
router.get('/transaction/:id',getTransaction);
router.get('/validation-subscribe',token,validationSubscribe);

//profile
router.put('/profile',token,uploadFiles("image"),updateProfile)
router.get('/profile',token,getProfile);

// BookPlaylist
router.post('/playlist',token,addBookPlaylist);
router.get('/playlists',token,getBookPlaylists);
router.post('/delete-my-playlist',token,deleteBookList);

// Check User
router.get('/check-user',token,checkUser);

// Payment
router.get('/payment',token,payment);

module.exports = router;