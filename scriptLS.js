// Book Class: Represents a Book

class Book {

  constructor(title, author, isbn){

    this.title = title;

    this.author = author;

    this.isbn = isbn;

  }

}

// UI Class: Handle UI Tasks

class UI {

  static displayBooks(){

    const books = Store.getBooks();
// Stergem DUMY data - cand folosim Local Storage
//   const StoredBooks = [
//     {
//       title: "Book One",
//       author: 'John Doe',
//       isbn: "3434434"
//     },
//     {
//       title: "Book Two",
//       author: 'Jane Doe',
//       isbn: "45545"
//     }
//   ];

//   const books = StoredBooks;

  books.forEach((book) => UI.addBookToList(book));

}

  static addBookToList(book){

    const list = document.querySelector('#book-list');

    const row =  document.createElement('tr');

    row.innerHTML =`

        <td>${book.title}</td>

        <td>${book.author}</td>

        <td>${book.isbn}</td>

        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;
   
    list.appendChild(row);

  }

  static deleteBook(el){
    if(el.classList.contains('delete')){
        el.parentElement.parentElement.remove();
    }
  }
  
  static showAlert(message, className){
      // we want to create in JS a div like : <div class="alert alert-success">Whatever message</div>
    const div = document.createElement('div');
    div.className = (`alert alert-${className}`);
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    //Make vanish in 3 sec
    setTimeout(function() { document.querySelector('.alert').remove()}, 2000);
    
  }

  static clearFields(){
    document.querySelector('#title').value ="";
    document.querySelector('#author').value ="";
    document.querySelector('#isbn').value ="";
  }
}

// Store Class: Handles Storage

 class Store {
     static getBooks () {
        let books;
        if(localStorage.getItem('books') === null){
            books =[];
        } else {
            books = JSON.parse(localStorage.getItem('books')); // JSON.parse - transforma un STRING intr-un ARRAY OF OBJECTS
        }

        return books;
     }
     static addBook (book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books)) // JSON.stringify - transforma un ARRAY CU OBIECTE intr-un STRING, deoarece LocalStorage primeste doar stringuri
     }
    
     static removeBook (isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
     }
 }

// Event: Display Books

document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e)=>{

    // Prevent actual submit
    e.preventDefault();
    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;


    // validate
    if(title === '' || author === "" || isbn === ''){
        UI.showAlert('Please fiil all fields', 'danger');
    } else {
        // Instantiate book
    const book = new Book(title, author, isbn);
    console.log(book);
    // Add book to UI
    UI.addBookToList(book);
    
    // Add book to LocalStore
    
    Store.addBook(book);


    // Show success message
    UI.showAlert('Book Added', 'success');

    // clear fields
    UI.clearFields();
    }
    
})
// Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", (e) => {

    // remove book from UI
    UI.deleteBook(e.target);

    // Remove book from LocalStorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
        // explicatii: cu e.target - ajungem la X, apoi mergem la parintele lui: td, apoi mergem mai sus la previous Element <td>isbn</td>; apoi luam valoare cu textContent !!!


    // Show success message
    UI.showAlert('Book Deleted', 'warning');
})
