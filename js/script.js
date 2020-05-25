function storeLibrary() {
  try {
    localStorage.setItem('library', JSON.stringify(library));
  } catch (e) {
    alert(e.message);
  }
}

let library = [];

function addBookToLibrary(book) {
  library.push(book);
  storeLibrary();
}

let stored_library = localStorage.getItem('library');

if (stored_library) {
  library = JSON.parse(stored_library).map(function (b) { return new Book(b); });
} else {
  // initialize
  addBookToLibrary(new Book({title: "King Barleycorn",    author: "Jack London",                      pages: 203, read: true}));
  addBookToLibrary(new Book({title: "The Cosmic Puppets", author: "Philip K. Dick",                   pages: 130, read: true}));
  addBookToLibrary(new Book({title: "Nightfall",          author: "Isaac Asimov & Robert Silverberg", pages: 376, read: false}));

  // store
  storeLibrary();
}

function Book(props) {
  this.title = props.title;
  this.author = props.author;
  this.pages = props.pages;
  this.read = props.read;
}

Book.prototype.set_read = function (value=true) {
  this.read = value;
}

function makeBookDiv(book, i) {
  let book_div = document.createElement('div');
  let cover = book_div.appendChild(document.createElement('div'));
  
  let author = document.createElement('p');
  author.innerHTML = book.author;

  let title = document.createElement('p');
  title.innerHTML = book.title;

  cover.appendChild(author);
  cover.appendChild(title);

  let read_box = document.createElement('input');
  read_box.type = "checkbox";
  read_box.checked = book.read;
  read_box.id = `read-${i}`;
  book_div.appendChild(read_box);
  read_box.addEventListener('change', readHandler);

  let label = document.createElement('label');
  label.appendChild(document.createTextNode('read'));
  label.setAttribute('for', read_box.id);
  book_div.appendChild(label);

  let remove_btn = document.createElement('button');
  remove_btn.appendChild(document.createTextNode('remove'));
  book_div.appendChild(remove_btn);

  remove_btn.addEventListener('click', removeBookHandler);

  book_div.setAttribute('data-library-index', i.toString());

  /* css classes */
  book_div.classList.add('book');
  cover.classList.add('cover');
  title.classList.add('title');
  author.classList.add('author');

  return book_div;
}

function render() {
  let shelf = document.querySelector('#bookshelf');

  // remove all elements
  for (let child = shelf.lastChild; child; child = shelf.lastChild) shelf.removeChild(child);

  for (let i=0; i < library.length; i++) {
    let book_div = makeBookDiv(library[i], i);
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
  
  let new_book = new Book(values)
  
  addBookToLibrary(new_book);
  render();
  closeForm();
  this.reset();
}

document.querySelector('form').addEventListener('submit', addBookHandler);

function removeBookHandler(e) {
  let index = e.target.parentNode.getAttribute('data-library-index');
  index = parseInt(index);

  let r = confirm("Remove " + library[index].title + " from library? Are you sure?")
  
  if (r) {
    library.splice(index, 1);
    storeLibrary();
    render();
  }
}

function openForm(event) {
  document.querySelector("#book-form").classList.remove('closed');
  document.body.classList.add('with-modal');
}

function closeForm(event) {
  document.querySelector("#book-form").classList.add('closed');
  document.body.classList.remove('with-modal');
}

document.querySelector("#open-btn").addEventListener('click', openForm);
document.querySelector(".close-btn").addEventListener('click', closeForm);

document.querySelector("#book-form").addEventListener('click', function(event) {
  if (event.target === document.querySelector("#book-form")) closeForm();
});

function readHandler(event) {
  let book_div = event.target.parentNode;
  let index = parseInt(book_div.getAttribute('data-library-index'));

  library[index].set_read(event.target.checked);

  storeLibrary();
}

render();