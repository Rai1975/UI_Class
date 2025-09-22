<script>
    import { createEventDispatcher } from 'svelte';
    import './journalModal.css'
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
        const updatedJournal = book.journal.map((entry, i) => {
            if (i === editingIndex) {
                return {
                    ...entry,
                    feeling: editedFeeling,
                    page: editedPage
                };
            }
            return entry;
        }).sort((a, b) => a.page - b.page);

        book = { ...book, journal: updatedJournal };

        dispatch('updateJournal', {
            title: book.title,
            journal: updatedJournal
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