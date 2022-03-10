// Save to Local Storage
const STORAGE_KEY = "BOOKSHELF";
const SAVED_EVENT = "saved-book";

const saveMyShelfInLocal = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
})

const isStorageExist = () => {
    if (typeof (Storage) === 'undefined') {
        alert("Your browser does not support Web Storage. Your data cannot be save.");
        return false;
    }
    return true;
}

const loadBookshelfFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
        for (book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}