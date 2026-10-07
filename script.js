const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

let notes = JSON.parse(localStorage.getItem("quickNotes")) || [];

function saveNotes() {
    localStorage.setItem("quickNotes", JSON.stringify(notes));
}

function updateCount() {
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

function render(searchTerm = "") {
    notesList.textContent = "";

    const searchWords = searchTerm.trim().toLowerCase();

    const filteredNotes = notes.filter(function(note) {
        return note.text.toLowerCase().includes(searchWords);
    });

    if (filteredNotes.length === 0) {
        if (notes.length > 0 && searchWords !== "") {
            const noResults = document.createElement("li");
            noResults.textContent = "No notes match your search.";
            notesList.appendChild(noResults);
        }

        updateCount();
        return;
    }

    filteredNotes.forEach(function(note) {
        const listItem = document.createElement("li");
        listItem.classList.add("note-card");

        const categoryClass = `category-${note.category.toLowerCase()}`;
        listItem.classList.add(categoryClass);

        const noteText = document.createElement("p");
        noteText.classList.add("note-text");
        noteText.textContent = note.text;

        const categoryLabel = document.createElement("span");
        categoryLabel.classList.add("note-category");
        categoryLabel.textContent = note.category;

        const date = document.createElement("small");
        date.classList.add("note-date");
        date.textContent = note.createdAt;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {

            notes = notes.filter(function(item) {
                return item.id !== note.id;
            });

            saveNotes();
            render(searchInput.value);
        });

        listItem.appendChild(noteText);
        listItem.appendChild(categoryLabel);
        listItem.appendChild(date);
        listItem.appendChild(deleteButton);

        notesList.appendChild(listItem);
    });
    updateCount();
}

noteForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    if (text === "") {
        errorMessage.textContent =
            "Please type a note first.";
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        return;
    }

    const newNote = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    notes.push(newNote);
    saveNotes();
    render(searchInput.value);
    noteInput.value = "";
    errorMessage.textContent = "";
});

searchInput.addEventListener("input", function() {
    render(searchInput.value);
});

render();