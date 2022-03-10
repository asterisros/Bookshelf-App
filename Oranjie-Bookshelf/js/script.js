const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener(RENDER_EVENT, function () {

    const uncompletedReadingBooks = document.getElementById("incompleteBookshelfList");
    uncompletedReadingBooks.innerHTML = "";
    const completedReadingBooks = document.getElementById("completeBookshelfList");
    completedReadingBooks.innerHTML = "";

    for (bookItem of books) {
        const bookElement = putBookToShelf(bookItem);
        if (bookItem.isCompleted == false) {
            uncompletedReadingBooks.append(bookElement);
        }
        else {
            completedReadingBooks.append(bookElement);
        }
    }
})

document.addEventListener("DOMContentLoaded", function () {
    // submit book to shelf: currently reading
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function (event) {
        alert("Book Added to Shelf");
        event.preventDefault();
        addNewBook();
    })
    // find the Book by its Title
    const searchBookByTitle = document.getElementById("searchBook");
    searchBookByTitle.addEventListener("click", function (event) {
        event.preventDefault();
        searchBook();
    })
    // load saved book in bookshelf
    if (isStorageExist()) {
        loadBookshelfFromStorage();
    }
})

// function add Book object
const addNewBook = () => {
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const bookId = generateBookId();
    const bookObject = generateBookObject(bookId, bookTitle, bookAuthor, bookYear, false);

    const checkForm = document.getElementById("inputBookIsComplete");

    if (checkForm.checked) {
        const bookObject = generateBookObject(bookId, bookTitle, bookAuthor, bookYear, true);
        books.push(bookObject);
    }
    else {
        books.push(bookObject);
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveMyShelfInLocal();
}
// function generate id for each book added
const generateBookId = () => {
    return +new Date();
}
// function generate book object
const generateBookObject = (id, title, author, year, isCompleted) => {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}
// function add new book to shelf
const putBookToShelf = (bookObject) => {

    const bookTitle = document.createElement("h3");
    bookTitle.innerHTML = bookObject.title;
    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = "Author: " + bookObject.author;
    const bookYear = document.createElement("p");
    bookYear.innerText = "Year: " + bookObject.year;

    if (bookObject.isCompleted) {
        const markAsCurrentlyRead = document.createElement("button");
        markAsCurrentlyRead.classList.add("orange-gradient");
        markAsCurrentlyRead.innerText = "Mark as Currently Read"
        markAsCurrentlyRead.addEventListener("click", function () {
            markBookAsCurrentlyRead(bookObject.id);
        })
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("red");
        deleteButton.innerText = "Delete From Shelf";
        deleteButton.addEventListener("click", function () {
            const confirmationToDelete = confirm('Are you sure you want to delete this book?');
            if (confirmationToDelete) {
                deleteBook(bookObject.id);
            }
            else {
                return false;
            }
        })
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("action");
        buttonContainer.append(markAsCurrentlyRead, deleteButton);

        const bookObjectContainer = document.createElement("article");
        bookObjectContainer.classList.add("book_item");
        bookObjectContainer.append(bookTitle, bookAuthor, bookYear, buttonContainer);

        bookObjectContainer.setAttribute("id", `${bookObject.id}`);

        return bookObjectContainer;
    }
    else {

        const markAsRead = document.createElement("button");
        markAsRead.classList.add("green");
        markAsRead.innerText = "Mark as Read";
        markAsRead.addEventListener("click", function () {
            markBookAsRead(bookObject.id);
        })
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("red");
        deleteButton.innerText = "Delete From Shelf";
        deleteButton.addEventListener("click", function () {
            const confirmationToDelete = confirm('Are you sure you want to delete this book?');
            if (confirmationToDelete) {
                deleteBook(bookObject.id);
            }
            else {
                return false;
            }
        })
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("action");
        buttonContainer.append(markAsRead, deleteButton);

        const bookObjectContainer = document.createElement("article");
        bookObjectContainer.classList.add("book_item");
        bookObjectContainer.append(bookTitle, bookAuthor, bookYear, buttonContainer);

        bookObjectContainer.setAttribute("id", `${bookObject.id}`);

        return bookObjectContainer;
    }
}

// function mark book as read
const markBookAsRead = (bookID) => {
    const bookTarget = findBook(bookID);
    if (bookTarget == null) {
        return;
    }
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveMyShelfInLocal();
}

// function mark book as currently read
const markBookAsCurrentlyRead = (bookID) => {
    const bookTarget = findBook(bookID);
    if (bookTarget == null) {
        return;
    }
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveMyShelfInLocal();
}

const findBook = (bookID) => {
    for (bookItem of books) {
        if (bookItem.id == bookID) {
            return bookItem;
        }
    }
    return null;
}

// function delete book
const deleteBook = (bookID) => {
    const bookTarget = findBookIndex(bookID);
    if (bookTarget === -1) {
        return;
    }
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveMyShelfInLocal();
}

// function find book index
const findBookIndex = (bookID) => {
    for (index in books) {
        if (books[index].id === bookID) {
            return index;
        }
    }
    return -1;
}

// function find book by Title
const searchBook = () => {
    const searchBookByTitle = document.getElementById("searchBookTitle");
    const filterBook = searchBookByTitle.value.toUpperCase();
    const bookItemTitle = document.getElementsByTagName("h3");

    for (let i = 0; i < bookItemTitle.length; i++) {
        const bookItem = bookItemTitle[i].textContent || bookItemTitle[i].innerText;

        if (bookItem.toUpperCase().indexOf(filterBook) > -1) {
            bookItemTitle[i].closest(".book_item").style.display = "";
        }
        else {
            bookItemTitle[i].closest(".book_item").style.display = "none";
        }
    }
}

// menu dropdown for mobile version
const dropdown = document.querySelector(".toggle-menu");
const navigation = document.querySelector("nav ul");

dropdown.addEventListener("click", () => {
    navigation.classList.toggle('dropdown');
})