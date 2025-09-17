<script>
  import BookCard from "./bookCard.svelte";
    import JournalModal from "./journalModal.svelte";
  import Modal from "./newCardModal.svelte";
  const user = "Benjamin"
  const date = new Date();

  let newCardModalOpen = false;
  let journalModalOpen = false;
  let selectedBook = {};

  let modalOpen = false;

  function openModal() {
    modalOpen = true;
  }

  function closeModal() {
    modalOpen = false;
  }

  function openJournalModal(event) {
    selectedBook = event.detail.entry;
    journalModalOpen = true;
  }

  function openNewCardModal() {
    newCardModalOpen = true;
  }

  function closeNewCardModal() {
    newCardModalOpen = false;
  }


  function closeJournalModal() {
      journalModalOpen = false;
  }

  function addEntry(e) {
    entries = [...entries, e.detail];
  }

  // This function will now be the centralized handler for adding new entries
  function addReadingEntry(event) {
      const { title, page, feeling, date } = event.detail;

      const bookToUpdate = entries.find(book => book.title === title);

      if (bookToUpdate) {
          bookToUpdate.journal = [...bookToUpdate.journal, { page: parseInt(page), feeling, date }];
          bookToUpdate.journal.sort((a, b) => a.page - b.page);
          entries = entries; // Trigger reactivity
      }
  }

  // This function handles updates from the journal modal
  function handleJournalUpdate(event) {
      const { title, journal } = event.detail;
      const bookToUpdate = entries.find(book => book.title === title);
      if (bookToUpdate) {
          bookToUpdate.journal = journal;
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
  <h1 class="topTitle">HELLO WORLD</h1>
    <p class="userSum">Welcome back, {user}</p>
    <p class="userSum">Today is {date.toLocaleString()}</p>

    <button class="newCardButton" on:click={openNewCardModal}>➕ Add New Card</button>

    <Modal open={newCardModalOpen} onClose={closeNewCardModal} on:addEntry={(e) => {
        entries = [...entries, { ...e.detail, journal: [] }];
    }}/>

    <div class="book-card-container">
        <h2>My Books</h2>
        <BookCard entries={entries} on:openJournal={openJournalModal} />
    </div>

    <JournalModal
        open={journalModalOpen}
        book={selectedBook}
        on:close={closeJournalModal}
        on:addReadingEntry={addReadingEntry}
        on:updateJournal={handleJournalUpdate}
    />
</main>
