<script>
    import { createEventDispatcher } from 'svelte';
    import './bookCard.css'
    import NewCardModal from './newCardModal.svelte';
    export let entries;
    let newCardModalOpen = false;
    let currentStreak;
    let weeklyProgress;

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

    function getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    function updateWeeklyProgress() {
        weeklyProgress = calculateWeeklyProgress();
    }

        function calculateWeeklyProgress() {
        const startOfWeek = getStartOfWeek(new Date());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const thisWeekDates = new Set();
        let totalPagesThisWeek = 0;

        entries.forEach(book => {
            book.journal.forEach(entry => {
                const entryDate = new Date(entry.date);
                if (entryDate >= startOfWeek && entryDate <= endOfWeek) {
                    thisWeekDates.add(entry.date);
                    const prevEntry = book.journal.find(e => e.page < entry.page);
                    const pagesRead = prevEntry ? entry.page - prevEntry.page : entry.page;
                    totalPagesThisWeek += Math.max(pagesRead, 1);
                }
            });
        });
        return {
            daysRead: thisWeekDates.size,
            pagesRead: totalPagesThisWeek
        };
    }

    function calculateStreak(allDates) {
        if (allDates.length === 0) return 0;
        const sortedDates = allDates.sort((a, b) => new Date(b) - new Date(a));
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let currentDate = new Date(today);
        const mostRecentEntry = new Date(sortedDates[0]);
        mostRecentEntry.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today - mostRecentEntry) / (1000 * 60 * 60 * 24));
        if (daysDiff > 1) return 0;
        if (daysDiff === 1) {
            currentDate.setDate(currentDate.getDate() - 1);
        }
        for (const dateStr of sortedDates) {
            const entryDate = new Date(dateStr);
            entryDate.setHours(0, 0, 0, 0);
            if (entryDate.getTime() === currentDate.getTime()) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (entryDate < currentDate) {
                break;
            }
        }
        return streak;
    }

    function getAllJournalDates() {
        const allDates = [];
        entries.forEach(book => {
            book.journal.forEach(entry => {
                const dateStr = entry.date;
                if (dateStr && !allDates.includes(dateStr)) {
                    allDates.push(dateStr);
                }
            });
        });
        return allDates;
    }

    function openNewCardModal() {
        newCardModalOpen = true;
    }

    function closeNewCardModal() {
        newCardModalOpen = false;
    }

    function updateStreak() {
        const allDates = getAllJournalDates();
        currentStreak = calculateStreak(allDates);
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
    <div class="add-card" on:click={openNewCardModal}>
        <div class="add-icon">+</div>
    </div>
</div>

<NewCardModal
  open={newCardModalOpen}
  onClose={closeNewCardModal}
  on:addEntry={(e) => {
    // forward to parent so the app-level entries are updated and persisted
    dispatch('addBook', { entry: { ...e.detail, journal: [] } });
    newCardModalOpen = false;
  }}
/>