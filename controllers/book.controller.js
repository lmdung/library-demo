const cloudinary = require("cloudinary");
const Book = require("../models/book.model")

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.index = async (req, res) => {
  let books = await Book.find()
  var page = parseInt(req.query.page) || 1;
  var perPage= 4;
  var start = (page -1) * perPage;
  var end = page * perPage;
  var maxPage = Math.floor(books.length/perPage) + 1;
  if (books.length % perPage === 0) {
    maxPage = books.length / perPage
  }
  res.render('books', {
    start: start,
    page: page,
    maxPage: maxPage,
    books: books.slice(start, end),
  })
}
module.exports.create = (req, res) => {
  res.render("addBook")
}
module.exports.update = async (req, res) => {
  var id = req.params.id;
  var book = await Book.findById(id);
  res.render("updateBook", {
    book: book
  })
}
module.exports.delete =(req, res) => {
  var id = req.params.id;
  Book.deleteOne({ _id: id }, function(err) {
    if (err) console.log(err);
  });
  res.redirect('back');
}

//post
module.exports.postCreate = (req, res) => {
  let bookPath = req.files.bookCover.path;
  cloudinary.uploader.upload(bookPath, function(result, error) {
    if (result) {
      req.body.bookCoverUrl = result.url;
    }
    Book.create(req.body, function(err, small) {
      if (err)  console.log(err);
    });
    res.redirect('/books')
  })
  
}
module.exports.postUpdate = (req, res) => {
  var id = req.params.id;
  Book.findById(id, function (err, doc) {
    if (err) {console.log(err)}
    doc.title = req.body.title;
    doc.save();
  });
  res.redirect('/books');
}