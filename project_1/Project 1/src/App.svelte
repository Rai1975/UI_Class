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
</script>

<main>
  <h1 class="topTitle"> HELLO WORLD </h1>

  <p class="userSum">Welcome back, {user}</p>
  <p class="userSum">Today is {date.toLocaleString()}</p>

  <button class="newCardButton" on:click={openModal}>➕ Add New Card</button>

  <Modal open={modalOpen} onClose={closeModal} />
  <BookCard />
</main>
