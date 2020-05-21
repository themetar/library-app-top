let library = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.set_read = function (value=true) {
  this.read = read;
}

function addBookToLibrary(book) {
  library.push(book);
}

// initialize
addBookToLibrary(new Book("King Barleycorn", "Jack London", 203, true));

/* crude testing */

console.log(library);