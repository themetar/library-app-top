/*
  Book object constructor
*/
class Book {
  constructor (props) {
    this.title = props.title;
    this.author = props.author;
    this.pages = props.pages;
    this.read = props.read;
  }

  set_read (value=true) {
    this.read = value;
  }
}

/*
  Library storage
*/

let library = [];

function storeLibrary() {
  try {
    localStorage.setItem('library', JSON.stringify(library));
  } catch (e) {
    alert(e.message);
  }
}

function addBookToLibrary(book) {
  library.push(book);
  storeLibrary();
}

/*
  Graphic display - Book divs
*/

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

function readHandler(event) {
  let book_div = event.target.parentNode;
  let index = parseInt(book_div.getAttribute('data-library-index'));

  library[index].set_read(event.target.checked);

  storeLibrary();
}

/*
  Add book html form event listeners
*/

/* Show and hide form */

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

document.querySelector("#book-form").addEventListener('click', function(event) {  /* when clicking on the form's container, but outside the form itself */
  if (event.target === document.querySelector("#book-form")) closeForm();
});

/* Form's events */

/* input validation */

function displayErrors (input) {
  const errorDisplay = input.nextElementSibling;

  if (!errorDisplay.classList.contains("error")) return;  // not an .error div

  if (input.validity.valid) {
    errorDisplay.classList.remove("show");
    errorDisplay.innerHTML = "";
  } else {
    errorDisplay.classList.add("show");
    errorDisplay.innerHTML = input.validationMessage;
  }
}

function inputHandler(event) {
  const input = event.target;

  displayErrors(input);
}

document.querySelectorAll('form input').forEach(input => {
  input.addEventListener("input", inputHandler);
  input.addEventListener("blur", inputHandler);
});

/* submit event */

function submitBookHandler(e) {
  e.preventDefault();

  let inputs = document.querySelectorAll('input');

  let valid = true;
  inputs.forEach(inp => valid = valid & inp.validity.valid);

  if (valid) {
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
  } else {
    for(let input of inputs) {
      if (!input.validity.valid) {
        displayErrors(input);
        break;
      }
    }
  }
}

document.querySelector('form').addEventListener('submit', submitBookHandler);

/*
  Initialize
*/

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

render();