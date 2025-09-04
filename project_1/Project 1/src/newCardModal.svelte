<script>
  import { createEventDispatcher } from "svelte";
  export let open = false;
  export let onClose = () => {};

  const dispatch = createEventDispatcher();

  let element = {
    title: "",
    author: "",
    cover: "",
    journal: ""
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch("addEntry", { ...element }); // send new entry up
    onClose(); // close modal after submit
    element = { title: "", author: "", cover: "", journal: "" }; // reset form
  }

</script>

{#if open}
  <div class="overlay" on:click={onClose}>
    <div class="modal" on:click|stopPropagation>
      <header>
        <h2>Add a New Book</h2>
        <button class="close" on:click={onClose}>&times;</button>
      </header>

      <form class="form" on:submit={handleSubmit}>
        <label>
          Title
          <input type="text" bind:value={element.title} placeholder="Book title" />
        </label>
        <label>
          Author
          <input type="text" bind:value={element.author} placeholder="Book author" />
        </label>
        <label>
          Cover URL
          <input type="url" bind:value={element.cover} placeholder="https://..." />
        </label>
        <label>
          Journal Entry
          <textarea bind:value={element.journal} placeholder="Write your thoughts..."></textarea>
        </label>

        <button type="submit" class="submit">Add Book</button>
      </form>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 14px;
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
    padding: 20px;
    width: 400px;
    max-width: 90%;
    font-family: system-ui, sans-serif;
    animation: fadeIn 0.3s ease;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  header h2 {
    font-size: 1.2rem;
    margin: 0;
    color: #333;
  }

  .close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
  }

  .form label {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 10px;
    color: #444;
  }

  .form input,
  .form textarea {
    width: 100%;
    padding: 8px 10px;
    margin-top: 4px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .form textarea {
    resize: vertical;
    min-height: 80px;
  }

  .submit {
    margin-top: 12px;
    width: 100%;
    padding: 10px;
    background: #007acc;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
  }

  .submit:hover {
    background: #005fa3;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
</style>
