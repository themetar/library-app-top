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

function makeBookDiv(book) {
  let book_div = document.createElement('div');
  let cover = book_div.appendChild(document.createElement('div'));
  
  author = document.createElement('p');
  author.innerHTML = book.author;

  title = document.createElement('p');
  title.innerHTML = book.title;

  cover.appendChild(author);
  cover.appendChild(title);

  return book_div;
}

function render() {
  let shelf = document.querySelector('#bookshelf');

  for (book of library) {
    let book_div = makeBookDiv(book);  

    shelf.appendChild(book_div);
  }
}

// initialize
addBookToLibrary(new Book("King Barleycorn", "Jack London", 203, true));
addBookToLibrary(new Book("The Cosmic Puppets", "Philip K. Dick", 130, true));
addBookToLibrary(new Book("Nightfall", "Isaac Asimov & Robert Silverberg", 376, false));


/* crude testing */

console.log(library);
render();