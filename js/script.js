let library = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.set_read = function (value=true) {
  this.read = value;
}

function addBookToLibrary(book) {
  library.push(book);
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
  
  let new_book = new Book(values.title, values.author, values.pages, values.read)
  
  library.push(new_book);
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
}

// initialize
addBookToLibrary(new Book("King Barleycorn", "Jack London", 203, true));
addBookToLibrary(new Book("The Cosmic Puppets", "Philip K. Dick", 130, true));
addBookToLibrary(new Book("Nightfall", "Isaac Asimov & Robert Silverberg", 376, false));


/* crude testing */

console.log(library);
render();