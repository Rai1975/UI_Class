<script>
  import BookCard from "./bookCard.svelte";
  import JournalModal from "./journalModal.svelte";
  import Modal from "./newCardModal.svelte";
  const user = "Benjamin"
  const date = new Date();
  let newCardModalOpen = false;
  let journalModalOpen = false;
  let selectedBook = {};
  let modalOpen = false;

  function openModal() {
    modalOpen = true;
  }

  function closeModal() {
    modalOpen = false;
  }

  function openJournalModal(event) {
    selectedBook = event.detail.entry;
    journalModalOpen = true;
  }

  function openNewCardModal() {
    newCardModalOpen = true;
  }

  function closeNewCardModal() {
    newCardModalOpen = false;
  }

  function closeJournalModal() {
      journalModalOpen = false;
  }

  // This function will now be the centralized handler for adding new entries
  function addReadingEntry(event) {
      const { title, page, feeling, emotions, date } = event.detail;
      const bookToUpdate = entries.find(book => book.title === title);
      if (bookToUpdate) {
          bookToUpdate.journal = [...bookToUpdate.journal, { page: parseInt(page), feeling, emotions: emotions || [], date}];
          bookToUpdate.journal.sort((a, b) => a.page - b.page);
          entries = entries; // Trigger reactivity
          updateStreak(); // Update streak when journal entry is added
      }
  }

  // This function handles updates from the journal modal
  function handleJournalUpdate(event) {
      const { title, journal } = event.detail;
      const bookToUpdate = entries.find(book => book.title === title);
      if (bookToUpdate) {
          bookToUpdate.journal = journal;
          entries = entries;
          updateStreak(); // Update streak when journal is updated
      }
  }

  function handleDeleteEntry(event) {
      const { title, index } = event.detail;
      const bookToUpdate = entries.find(book => book.title === title);
      if (bookToUpdate) {
          bookToUpdate.journal.splice(index, 1);
          entries = entries; // trigger reactivity
          updateStreak(); // Update streak when entry is deleted
      }
  }

  // Function to calculate current streak
  function calculateStreak(allDates) {
    if (allDates.length === 0) return 0;

    // Sort dates in descending order (most recent first)
    const sortedDates = allDates.sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    let currentDate = new Date(today);

    // Check if user has an entry today or yesterday (to allow for different time zones/late entries)
    const mostRecentEntry = new Date(sortedDates[0]);
    mostRecentEntry.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today - mostRecentEntry) / (1000 * 60 * 60 * 24));

    // If most recent entry is more than 1 day ago, streak is broken
    if (daysDiff > 1) return 0;

    // If most recent entry was yesterday, start counting from yesterday
    if (daysDiff === 1) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Count consecutive days backwards from current date
    for (const dateStr of sortedDates) {
      const entryDate = new Date(dateStr);
      entryDate.setHours(0, 0, 0, 0);

      if (entryDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (entryDate < currentDate) {
        // Gap found, break the streak
        break;
      }
    }

    return streak;
  }

  // Function to get all journal entry dates
  function getAllJournalDates() {
    const allDates = [];
    entries.forEach(book => {
      book.journal.forEach(entry => {
        // Normalize date format and avoid duplicates
        const dateStr = entry.date;
        if (dateStr && !allDates.includes(dateStr)) {
          allDates.push(dateStr);
        }
      });
    });
    return allDates;
  }

  // Reactive variable for current streak
  let currentStreak = 0;

  // Function to update streak
  function updateStreak() {
    const allDates = getAllJournalDates();
    currentStreak = calculateStreak(allDates);
  }

  // Initialize streak on component load
  $: if (entries) {
    updateStreak();
  }

  let entries = [
        {
            title: "1984",
            author: "George Orwell",
            cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
            journal: [
                { page: 45, feeling: "Crazy book. I think reading this book has made me see the world differently now. Big Brother is always watching!", date: "9/16/2025" , emotions: ['excited', 'curious']},
                { page: 46, feeling: "Oh nvm, it's not that crazy", date: "9/17/2025", emotions: ['disappointed']}
            ]
        },
        {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            cover: "https://covers.openlibrary.org/b/olid/OL35657482M-L.jpg",
            journal: []
        }
    ];
</script>

<main>
  <h1 class="topTitle">HELLO WORLD</h1>
    <p class="userSum">Welcome back, {user}</p>
    <p class="userSum">Today is {date.toLocaleString()}</p>

    <!-- Streak Display -->
    <div class="streak-container">
      <div class="streak-display">
        <span class="streak-icon">🔥</span>
        <div class="streak-info">
          <span class="streak-number">{currentStreak}</span>
          <span class="streak-label">day{currentStreak !== 1 ? 's' : ''} streak</span>
        </div>
      </div>
      {#if currentStreak > 0}
        <p class="streak-message">Keep it up! You're on a roll! 📚</p>
      {:else}
        <p class="streak-message">Start your reading journey today! ✨</p>
      {/if}
    </div>

    <button class="newCardButton" on:click={openNewCardModal}>➕ Add New Card</button>
    <Modal open={newCardModalOpen} onClose={closeNewCardModal} on:addEntry={(e) => {
        entries = [...entries, { ...e.detail, journal: [] }];
        updateStreak();
    }}/>
    <div class="book-card-container">
        <h2>My Books</h2>
        <BookCard entries={entries} on:openJournal={openJournalModal} />
    </div>
    <JournalModal
        open={journalModalOpen}
        book={selectedBook}
        on:close={closeJournalModal}
        on:addReadingEntry={addReadingEntry}
        on:updateJournal={handleJournalUpdate}
        on:deleteJournalEntry={handleDeleteEntry}
    />
</main>

<style>
  .streak-container {
    margin: 20px 0;
    padding: 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
    text-align: center;
  }

  .streak-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .streak-icon {
    font-size: 2rem;
    animation: flicker 2s ease-in-out infinite alternate;
  }

  .streak-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .streak-number {
    font-size: 2.5rem;
    font-weight: bold;
    line-height: 1;
  }

  .streak-label {
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .streak-message {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }

  @keyframes flicker {
    0% { transform: rotate(-5deg) scale(1); }
    100% { transform: rotate(5deg) scale(1.1); }
  }
</style>