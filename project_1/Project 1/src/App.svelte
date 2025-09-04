<script>
  import BookCard from "./bookCard.svelte";
  import Modal from "./newCardModal.svelte";
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

  let entries = [{
    title: "1984",
    author: "George Orwell",
    cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    journal: "Crazy book. I think reading this book has made me see the world differently now. Big Brother is always watching!"
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://covers.openlibrary.org/b/olid/OL35657482M-L.jpg",
    journal: "Great read, not as crazy as 1984 though."
  }];

</script>

<main>
  <h1 class="topTitle"> HELLO WORLD </h1>

  <p class="userSum">Welcome back, {user}</p>
  <p class="userSum">Today is {date.toLocaleString()}</p>

  <button class="newCardButton" on:click={openModal}>➕ Add New Card</button>

  <Modal open={modalOpen} onClose={closeModal} on:addEntry={addEntry}/>
  <BookCard entries={entries} />
</main>
