<script>
  import BookCard from "./bookCard.svelte";
  import Modal from "./newCardModal.svelte";
  import ReadingTracker from "./readingTracker.svelte";
  const user = "Benjamin"

  const date = new Date();

  let modalOpen = false;

  function openModal() {
    modalOpen = true;
  }

  function closeModal() {
    modalOpen = false;
  }

  function addEntry(e) {
    entries = [...entries, e.detail];
  }

  function addReadingEntry(event) {
    const { title, chapter, page, feeling, date } = event.detail;

    // Find the book with the matching title
    const bookToUpdate = entries.find(book => book.title === title);

    if (bookToUpdate) {
        // Add the new journal entry to the book's journal array
        bookToUpdate.journal = [...bookToUpdate.journal, { page, feeling, date }];
        // Sort the journal entries by page number in chronological order
        bookToUpdate.journal.sort((a, b) => a.page - b.page);
        // Reassign entries to trigger reactivity
        entries = entries;
    }
}
  let entries = [
        {
            title: "1984",
            author: "George Orwell",
            cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
            journal: [
                { page: 45, feeling: "Crazy book. I think reading this book has made me see the world differently now. Big Brother is always watching!", date: "9/16/2025" },
                { page: 46, feeling: "Oh nvm, it's not that crazy", date: "9/17/2025" }
            ]
        },
        {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            cover: "https://covers.openlibrary.org/b/olid/OL35657482M-L.jpg",
            journal: []
        }
    ];

</script>

<main>
  <h1 class="topTitle"> HELLO WORLD </h1>

  <p class="userSum">Welcome back, {user}</p>
  <p class="userSum">Today is {date.toLocaleString()}</p>
  <ReadingTracker bookTitles={entries.map(entry => entry.title)} on:addReadingEntry={addReadingEntry} />

  <button class="newCardButton" on:click={openModal}>➕ Add New Book</button>

  <Modal open={modalOpen} onClose={closeModal} on:addEntry={addEntry}/>
  <div class="book-card-container">
        <h2>My Books</h2>
        <BookCard entries={entries} />
  </div>
</main>
