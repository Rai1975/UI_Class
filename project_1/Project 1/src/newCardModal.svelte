<script>
  import { createEventDispatcher } from "svelte";
  import './newCardModal.css'
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
      const url = URL.createObjectURL(file);
      element.cover = url;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch("addEntry", { ...element });
    onClose();
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