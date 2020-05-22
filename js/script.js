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

  // remove all elements
  for (let child = shelf.lastChild; child; child = shelf.lastChild) shelf.removeChild(child);

  for (let i=0; i < library.length; i++) {
    let book_div = makeBookDiv(library[i]);  

    shelf.appendChild(book_div);
  }
}

/* Event listeners */

function addBookHandler(e) {
  e.preventDefault();

  let inputs = document.querySelectorAll('input');
  let values = {}
  const prop = {text: "value", number: "value", checkbox: "checked"};
  for(let input of inputs) {
    values[input.name] = input[prop[input.type]];
  }
  
  let new_book = new Book(values.title, values.author, values.pages, values.read)
  
  library.push(new_book);
  render();
}

document.querySelector('form').addEventListener('submit', addBookHandler);

// initialize
addBookToLibrary(new Book("King Barleycorn", "Jack London", 203, true));
addBookToLibrary(new Book("The Cosmic Puppets", "Philip K. Dick", 130, true));
addBookToLibrary(new Book("Nightfall", "Isaac Asimov & Robert Silverberg", 376, false));


/* crude testing */

console.log(library);
render();