<script>
  // The prop passed down from the parent component
	import { createEventDispatcher } from "svelte";
	export let bookTitles = [];
	const dispatch = createEventDispatcher();

  // Reactive variables for the form inputs
  let selectedBook = '';
  let chapterNumber = '';
  let pageNumber = '';
  let feeling = '';

  // Array to store the reading entries
  let readingEntries = [];

function addEntry() {
        if (selectedBook && chapterNumber && pageNumber) {
            const newEntry = {
                title: selectedBook,
                chapter: chapterNumber,
                page: parseInt(pageNumber), // Ensure page is a number
                feeling: feeling,
                date: new Date().toLocaleDateString('en-US')
            };

            // Dispatch the full new entry
            dispatch('addReadingEntry', newEntry);

            // ... clear form
        }
    }
</script>

<style>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: sans-serif;
  }
  
  h1 {
    color: #333;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  label {
    display: flex;
    flex-direction: column;
    font-weight: bold;
    color: #555;
  }

  input, select, textarea {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: 5px;
  }

  button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  button:hover {
    background-color: #0056b3;
  }

  .entries {
    margin-top: 30px;
  }

  .entry-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
  }

  .entry-card h3 {
    margin: 0 0 5px 0;
    color: #007bff;
  }

  .entry-card p {
    margin: 0;
    color: #666;
  }

  .entry-card small {
    display: block;
    margin-top: 10px;
    color: #999;
  }
</style>

<div class="container">
  <h1>Reading Journal</h1>

  <form on:submit|preventDefault={addEntry}>
    <label>
      Book Title
      <select bind:value={selectedBook}>
        <option value="" disabled selected>Select one of your books</option>
        {#each bookTitles as title}
          <option value={title}>{title}</option>
        {/each}
      </select>
    </label>

    <label>
      Chapter Number
      <input type="number" bind:value={chapterNumber} placeholder="e.g., 2">
    </label>
    
    <label>
      Page Number
      <input type="number" bind:value={pageNumber} placeholder="e.g., 55">
    </label>

    <label>
      How do you feel?
      <textarea bind:value={feeling} rows="3" placeholder="e.g., I'm captivated by the plot twist."></textarea>
    </label>

    <button type="submit">Record Entry</button>
  </form>

  <div class="entries">
    <h2>My Reading Log</h2>
    {#if readingEntries.length === 0}
      <p>No entries recorded yet. Select a book and start reading! 📚</p>
    {:else}
      {#each readingEntries as entry}
        <div class="entry-card">
          <h3>{entry.title}</h3>
          <p>You're on chapter {entry.chapter}, page {entry.page}.</p>
          {#if entry.feeling}
            <p><strong>Feeling:</strong> {entry.feeling}</p>
          {/if}
          <small>Recorded on {entry.date}</small>
        </div>
      {/each}
    {/if}
  </div>
</div>