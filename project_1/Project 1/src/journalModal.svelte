<script>
    import { createEventDispatcher } from 'svelte';
    export let open = false;
    export let book = {};

    let editedFeeling = '';
    let editedPage = '';
    let editingIndex = -1;

    let newEntryPage = '';
    let newEntryFeeling = '';
    let selectedEmotion = '';
    let showConfirmation = false;

    const dispatch = createEventDispatcher();

    // Predefined emotions for reading experiences
    const emotions = [
        { value: 'excited', label: '😄 Excited', color: '#FFD700' },
        { value: 'curious', label: '🤔 Curious', color: '#4CAF50' },
        { value: 'interested', label: '😊 Interested', color: '#2196F3' },
        { value: 'confused', label: '😵 Confused', color: '#FF9800' },
        { value: 'surprised', label: '😲 Surprised', color: '#E91E63' },
        { value: 'sad', label: '😢 Sad', color: '#607D8B' },
        { value: 'angry', label: '😠 Angry', color: '#F44336' },
        { value: 'scared', label: '😰 Scared', color: '#9C27B0' },
        { value: 'disappointed', label: '😞 Disappointed', color: '#795548' },
        { value: 'hopeful', label: '🤞 Hopeful', color: '#8BC34A' },
        { value: 'inspired', label: '✨ Inspired', color: '#FFEB3B' },
        { value: 'nostalgic', label: '😌 Nostalgic', color: '#FF7043' },
        { value: 'entertained', label: '😄 Entertained', color: '#00BCD4' },
        { value: 'thoughtful', label: '🧠 Thoughtful', color: '#3F51B5' },
        { value: 'overwhelmed', label: '😵‍💫 Overwhelmed', color: '#9E9E9E' }
    ];

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

    function handleAddEntry() {
        // Create emotions array from selected emotion
        const emotionsArray = selectedEmotion ? [selectedEmotion] : [];

        dispatch('addReadingEntry', {
            title: book.title,
            page: newEntryPage,
            feeling: newEntryFeeling,
            emotions: emotionsArray,
            date: new Date().toLocaleDateString('en-US')
        });

        newEntryPage = '';
        newEntryFeeling = '';
        selectedEmotion = '';

        showConfirmation = true;

        setTimeout(() => {
            showConfirmation = false;
        }, 3000);
    }

    function deleteEntry(index) {
        dispatch('deleteJournalEntry', {
            title: book.title,
            index
        });
    }

    // Function to get emotion data from emotion values
    function getEmotionData(emotionValue) {
        return emotions.find(emotion => emotion.value === emotionValue);
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
                    {#each book.journal.sort((a,b) => a.page - b.page) as entry, i}
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
                                    <div class="entry-content">
                                        {#if entry.emotions && entry.emotions.length > 0}
                                            <div class="emotions-container">
                                                {#each entry.emotions as emotionValue}
                                                    {#if getEmotionData(emotionValue)}
                                                        <span class="emotion-badge" style="background-color: {getEmotionData(emotionValue).color}; color: white">
                                                            {getEmotionData(emotionValue).label}
                                                        </span>
                                                    {/if}
                                                {/each}
                                            </div>
                                        {/if}
                                        <p>{entry.feeling}</p>
                                    </div>
                                    <small>{entry.date}</small>
                                    <div class="entry-actions">
                                        <button class="edit-btn" on:click={() => editEntry(i)}>Edit</button>
                                        <button class="delete-btn" on:click={() => deleteEntry(i)}>Delete</button>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                {:else}
                    <p class="no-entries">No journal entries yet. Start your reading journey! 📚</p>
                {/if}
            </div>
            
            <hr />
            
            <h2>Add New Entry</h2>
            {#if showConfirmation}
                <p class="confirmation-message">Entry submitted! 🎉</p>
            {/if}
            <form class="add-entry-form" on:submit|preventDefault={handleAddEntry}>
                <label>
                    Page:
                    <input type="number" bind:value={newEntryPage} required />
                </label>

                <label>
                    How are you feeling?
                    <select bind:value={selectedEmotion} class="emotion-select">
                        <option value="">Select an emotion (optional)</option>
                        {#each emotions as emotion}
                            <option value={emotion.value}>{emotion.label}</option>
                        {/each}
                    </select>
                </label>

                <label>
                    Journal Entry:
                    <textarea bind:value={newEntryFeeling} required placeholder="What happened in the story? How did it make you feel? Any thoughts or reflections?"></textarea>
                </label>

                <button type="submit" class="submit-btn">Add Entry</button>
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
        background-color: #313a40;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        max-width: 650px;
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
        color: white;
    }

    .modal-header button {
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #888;
        transition: color 0.2s;
    }

    .modal-header button:hover {
        color: #333;
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
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .content-box {
        background: #8497a3;
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
        margin: 0 0 10px;
        color: white;
        font-weight: 600;
    }

    .modal-content h2 {
        margin: 0 0 10px;
        color: white;
        font-weight: 600;
    }

    .entry-content {
        margin-bottom: 10px;
    }

    .emotions-container {
        margin-bottom: 8px;
    }

    .emotion-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        margin-right: 6px;
        margin-bottom: 4px;
        border: 1px solid currentColor;
    }

    .content-box p {
        margin: 8px 0;
        color: white;
        line-height: 1.4;
    }

    .content-box small {
        display: block;
        margin-top: 10px;
        color: hsl(0, 0%, 100%);
        font-size: 0.85rem;
   }

    .entry-actions {
        margin-top: 12px;
        display: flex;
        gap: 8px;
    }

    .edit-btn, .delete-btn {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
        transition: all 0.2s;
    }

    .edit-btn {
        background-color: #e3f2fd;
        color: #1976d2;
    }

    .edit-btn:hover {
        background-color: #bbdefb;
    }

    .delete-btn {
        background-color: #ffebee;
        color: #d32f2f;
    }

    .delete-btn:hover {
        background-color: #ffcdd2;
    }

    .no-entries {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 20px;
    }

    .add-entry-form {
        margin-top: 20px;
    }

    .add-entry-form label {
        display: block;
        margin-bottom: 15px;
        color: #ffffff;
        font-weight: 500;
    }

    .add-entry-form input,
    .add-entry-form textarea,
    .emotion-select {
        width: 100%;
        padding: 10px;
        margin-top: 5px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.2s;
    }

    .add-entry-form input:focus,
    .add-entry-form textarea:focus,
    .emotion-select:focus {
        outline: none;
        border-color: #007acc;
        box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.1);
    }

    .emotion-select {
        background-color: white;
        cursor: pointer;
    }

    .add-entry-form textarea {
        resize: vertical;
        min-height: 80px;
    }

    .submit-btn {
        background: #ef7f3e;
        color: #f4f3f1;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
        width: 100%;
        transition: all 0.2s;
    }

    .submit-btn:hover {
        background: #773f1f;
        transform: translateY(-1px);
    }

    .confirmation-message {
        color: #4caf50;
        font-weight: bold;
        text-align: center;
        margin-bottom: 15px;
        padding: 10px;
        background-color: #e8f5e8;
        border-radius: 6px;
        animation: fadeOut 3s forwards;
    }

    @keyframes fadeOut {
        0% { opacity: 1; }
        80% { opacity: 1; }
        100% { opacity: 0; }
    }

    hr {
        border: none;
        border-top: 1px solid #eee;
        margin: 25px 0;
    }
</style>