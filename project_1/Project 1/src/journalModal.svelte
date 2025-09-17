<script>
    import { createEventDispatcher } from 'svelte';
    export let open = false;
    export let book = {};

    let editedFeeling = '';
    let editedPage = '';
    let editingIndex = -1;

    let newEntryPage = '';
    let newEntryFeeling = '';

    const dispatch = createEventDispatcher();

    function close() {
        dispatch('close');
        editingIndex = -1;
    }

    function editEntry(index) {
        editingIndex = index;
        editedFeeling = book.journal[index].feeling;
        editedPage = book.journal[index].page;
    }

    function saveEdit() {
        if (editingIndex !== -1) {
            book.journal[editingIndex].feeling = editedFeeling;
            book.journal[editingIndex].page = editedPage;
            
            // Re-sort the journal entries after editing a page number
            book.journal.sort((a, b) => a.page - b.page);

            dispatch('updateJournal', {
                title: book.title,
                journal: book.journal
            });
            editingIndex = -1;
        }
    }
</script>

{#if open}
    <div class="modal-overlay" on:click={close}>
        <div class="modal-content" on:click|stopPropagation>
            <div class="modal-header">
                <h2>Journal for: {book.title}</h2>
                <button on:click={close}>&times;</button>
            </div>
            
            <div class="timeline">
                {#if book.journal && book.journal.length > 0}
                    {#each book.journal as entry, i}
                        <div class="timeline-item">
                            <div class="dot"></div>
                            <div class="content-box">
                                {#if editingIndex === i}
                                    <form on:submit|preventDefault={saveEdit}>
                                        <label>Page: <input type="number" bind:value={editedPage} /></label>
                                        <label>Entry: <textarea bind:value={editedFeeling}></textarea></label>
                                        <button type="submit">Save</button>
                                    </form>
                                {:else}
                                    <h4>Page {entry.page}</h4>
                                    <p>{entry.feeling}</p>
                                    <small>{entry.date}</small>
                                    <button on:click={() => editEntry(i)}>Edit</button>
                                {/if}
                            </div>
                        </div>
                    {/each}
                {:else}
                    <p>No journal entries yet.</p>
                {/if}
            </div>
            
            <hr />
            
            <h3>Add New Entry</h3>
            <form class="add-entry-form" on:submit|preventDefault={() => dispatch('addReadingEntry', {
                title: book.title,
                page: newEntryPage,
                feeling: newEntryFeeling,
                date: new Date().toLocaleDateString('en-US')
            })}>
                <label>Page: <input type="number" bind:value={newEntryPage} required /></label>
                <label>Journal Entry: <textarea bind:value={newEntryFeeling} required></textarea></label>
                <button type="submit">Add Entry</button>
            </form>
        </div>
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .modal-content {
        background-color: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ddd;
        padding-bottom: 15px;
        margin-bottom: 20px;
    }
    .modal-header h2 {
        margin: 0;
    }
    .modal-header button {
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #888;
    }

    .timeline {
        position: relative;
        padding: 10px 0 10px 20px;
        border-left: 2px solid #ccc;
    }

    .timeline-item {
        position: relative;
        margin-bottom: 30px;
    }

    .timeline-item:last-child {
        margin-bottom: 0;
    }

    .dot {
        position: absolute;
        top: 0;
        left: -29px;
        width: 16px;
        height: 16px;
        background-color: #007acc;
        border-radius: 50%;
        border: 3px solid white;
    }

    .content-box {
        background: #f9f9f9;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        position: relative;
    }

    .content-box::before {
        content: '';
        position: absolute;
        left: -14px;
        top: 15px;
        width: 0;
        height: 0;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-right: 8px solid #f9f9f9;
    }

    .content-box h4 {
        margin: 0 0 5px;
        color: #333;
    }
    .content-box p {
        margin: 0;
        color: #555;
    }
    .content-box small {
        display: block;
        margin-top: 10px;
        color: #888;
    }

    .add-entry-form label {
        display: block;
        margin-bottom: 10px;
    }
    .add-entry-form input,
    .add-entry-form textarea {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
    }
</style>