<script>
    import { createEventDispatcher } from 'svelte';
    export let entries;
    const dispatch = createEventDispatcher();

    function openJournalModal(entry) {
        dispatch('openJournal', { entry });
    }

    function editBook(entry, event) {
        event.stopPropagation(); // Prevent card click
        dispatch('editBook', { entry });
    }

    function deleteBook(entry, event) {
        event.stopPropagation(); // Prevent card click
        if (confirm(`Are you sure you want to delete "${entry.title}"? This will also delete all journal entries for this book.`)) {
            dispatch('deleteBook', { entry });
        }
    }
</script>

<div class="cardFlex">
    {#each entries as entry (entry.title)}
    <div class="card" on:click={() => openJournalModal(entry)}>
        <div class="card-actions">
            <button
                class="action-btn edit-btn"
                on:click={(e) => editBook(entry, e)}
                title="Edit book"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
            </button>
            <button
                class="action-btn delete-btn"
                on:click={(e) => deleteBook(entry, e)}
                title="Delete book"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
            </button>
        </div>

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
        position: relative;
        width: 280px;
        background: #f4f3f1;
        border: 1px solid #ddd;
        border-radius: 14px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        overflow: hidden;
        font-family: system-ui, sans-serif;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .card:hover {
        background-color: #f4f3f1;
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0,0,0,0.15);
    }

    .card:hover .card-actions {
        opacity: 1;
    }

    .card-actions {
        position: absolute;
        top: 8px;
        right: 8px;
        display: flex;
        gap: 6px;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 10;
    }

    .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        backdrop-filter: blur(4px);
    }

    .edit-btn {
        background: rgba(59, 130, 246, 0.9);
        color: white;
    }

    .edit-btn:hover {
        background: rgba(59, 130, 246, 1);
        transform: scale(1.05);
    }

    .delete-btn {
        background: rgba(239, 68, 68, 0.9);
        color: white;
    }

    .delete-btn:hover {
        background: rgba(239, 68, 68, 1);
        transform: scale(1.05);
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
        color: #313a40;
        margin: 0 0 4px;
    }

    .author {
        font-size: 0.9rem;
        color: #61727e;
        margin: 0 0 12px;
    }

    .journal {
        background: #eee7d9;
        border: 1px solid #eeeeee;
        border-radius: 10px;
        padding: 12px;
    }

    .journal h3 {
        font-size: 0.95rem;
        font-weight: 600;
        margin: 0 0 6px;
        color: #313a40;
    }

    .journal p {
        font-size: 0.9rem;
        color: #313a40;
        margin: 0;
        line-height: 1.4;
    }
</style>