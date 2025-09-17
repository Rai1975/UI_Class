<script>
    import { createEventDispatcher } from 'svelte';
    export let entries;
    const dispatch = createEventDispatcher();

    function openJournalModal(entry) {
        dispatch('openJournal', { entry });
    }
</script>

<div class="cardFlex">
    {#each entries as entry (entry.title)}
    <div class="card" on:click={() => openJournalModal(entry)}>
        <img class="cover" src={entry.cover} alt="Book Cover" />
        <div class="content">
            <h2 class="title">{entry.title}</h2>
            <p class="author">by {entry.author}</p>
            <div class="journal">
                <h3>My Latest Thought</h3>
                {#if entry.journal && entry.journal.length > 0}
                    <p>
                        <strong>Page {entry.journal[entry.journal.length - 1].page}</strong>: {entry.journal[entry.journal.length - 1].feeling}
                    </p>
                {:else}
                    <p>No entries yet.</p>
                {/if}
            </div>
        </div>
    </div>
    {/each}
</div>

<style>
    .cardFlex {
        display: flex;
        justify-content: flex-start;
        gap: 16px;
    }


  .card {
    width: 280px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 14px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    overflow: hidden;
    font-family: system-ui, sans-serif;
    transition: all 0.3s ease;
  }

  .card:hover {
    background-color: #f0f0f0;
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.15);
  }
  .cover {
    width: 100%;
    height: 240px;
    object-fit: cover;
    display: block;
  }

  .content {
    padding: 16px;
  }

  .title {
    font-size: 1.25rem;
    font-weight: bold;
    color: #222;
    margin: 0 0 4px;
  }

  .author {
    font-size: 0.9rem;
    color: #555;
    margin: 0 0 12px;
  }

  .journal {
    background: #f9f9f9;
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 12px;
  }

  .journal h3 {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0 0 6px;
    color: #444;
  }

  .journal p {
    font-size: 0.9rem;
    color: #333;
    margin: 0;
    line-height: 1.4;
  }
</style>
