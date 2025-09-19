<script>
  import { createEventDispatcher } from "svelte";
  export let open = false;
  export let onClose = () => {};

  const dispatch = createEventDispatcher();

  let element = {
    title: "",
    author: "",
    cover: "",
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      // Create a local object URL for preview
      const url = URL.createObjectURL(file);
      element.cover = url;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    // send new entry up
    dispatch("addEntry", { ...element });
    // close modal
    onClose();
    // reset form
    element = { title: "", author: "", cover: "" };
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
          Cover Image
          <input type="file" accept="image/*" on:change={handleFileChange} />
        </label>

        {#if element.cover}
          <div class="preview">
            <img src={element.cover} alt="Cover Preview" />
          </div>
        {/if}

        <button type="submit" class="submit">
          Add Book
        </button>
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

  .form input {
    width: 100%;
    padding: 8px 10px;
    margin-top: 4px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .preview {
    margin-top: 10px;
    text-align: center;
  }

  .preview img {
    max-width: 120px;
    max-height: 160px;
    border-radius: 6px;
    border: 1px solid #ccc;
    object-fit: cover;
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
