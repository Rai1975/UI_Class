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
  let settingsModalOpen = false;

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

  function openSettingsModal() {
    settingsModalOpen = true;
  }

  function closeSettingsModal() {
    settingsModalOpen = false;
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
          updateWeeklyProgress(); // Update weekly progress
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
          updateWeeklyProgress(); // Update weekly progress
      }
  }

  function handleDeleteEntry(event) {
      const { title, index } = event.detail;
      const bookToUpdate = entries.find(book => book.title === title);
      if (bookToUpdate) {
          bookToUpdate.journal.splice(index, 1);
          entries = entries; // trigger reactivity
          updateStreak(); // Update streak when entry is deleted
          updateWeeklyProgress(); // Update weekly progress
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

  // Function to get start of current week (Monday)
  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  // Function to calculate weekly progress
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
          // Count pages read this week
          const prevEntry = book.journal.find(e => e.page < entry.page);
          const pagesRead = prevEntry ? entry.page - prevEntry.page : entry.page;
          totalPagesThisWeek += Math.max(pagesRead, 1); // At least 1 page per entry
        }
      });
    });

    return {
      daysRead: thisWeekDates.size,
      pagesRead: totalPagesThisWeek
    };
  }

  // Goals management
  let goals = {
    weeklyDays: 5,
    weeklyPages: 100
  };

  function saveGoals(event) {
    goals = { ...event.detail };
    updateWeeklyProgress();
  }

  // Reactive variables
  let currentStreak = 0;
  let weeklyProgress = { daysRead: 0, pagesRead: 0 };

  // Function to update streak
  function updateStreak() {
    const allDates = getAllJournalDates();
    currentStreak = calculateStreak(allDates);
  }

  // Function to update weekly progress
  function updateWeeklyProgress() {
    weeklyProgress = calculateWeeklyProgress();
  }

  // Initialize on component load
  $: if (entries) {
    updateStreak();
    updateWeeklyProgress();
  }

  let entries = [
        {
            title: "1984",
            author: "George Orwell",
            cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
            journal: [
                { page: 45, feeling: "Crazy book. I think reading this book has made me see the world differently now. Big Brother is always watching!", date: "9/17/2025" , emotions: ['excited', 'curious']},
                { page: 46, feeling: "Oh nvm, it's not that crazy", date: "9/18/2025", emotions: ['disappointed']}
            ]
        },
        {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            cover: "https://covers.openlibrary.org/b/olid/OL35657482M-L.jpg",
            journal: []
        }
    ];

    // Temporary variables for the settings modal
  let tempWeeklyDays = goals.weeklyDays;
  let tempWeeklyPages = goals.weeklyPages;

  // Update temp values when goals change
  $: {
    tempWeeklyDays = goals.weeklyDays;
    tempWeeklyPages = goals.weeklyPages;
  }
</script>

<main>
  <div class="header-container">
    <div class="header-content">
      <button class="settings-button" on:click={openSettingsModal} title="Settings">
        ⚙️
      </button>
    </div>
    <h1 class="userSum">Welcome back, {user}</h1>
    <p class="userSum">
      Today is {date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "2-digit"
      }).replace(/\//g, "-")}
    </p>
  </div>

  <!-- Enhanced Streak Display with Goals -->
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

    <!-- Weekly Goals Progress -->
    <div class="goals-progress">
      <h3>This Week's Progress</h3>
      <div class="progress-grid">
        <div class="progress-item">
          <div class="progress-header">
            <span class="progress-icon">📅</span>
            <span class="progress-title">Reading Days</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: {Math.min((weeklyProgress.daysRead / goals.weeklyDays) * 100, 100)}%"></div>
          </div>
          <div class="progress-text">
            {weeklyProgress.daysRead}/{goals.weeklyDays} days
            {#if weeklyProgress.daysRead >= goals.weeklyDays}
              <span class="goal-achieved">🎉</span>
            {/if}
          </div>
        </div>

        <div class="progress-item">
          <div class="progress-header">
            <span class="progress-icon">📖</span>
            <span class="progress-title">Pages Read</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: {Math.min((weeklyProgress.pagesRead / goals.weeklyPages) * 100, 100)}%"></div>
          </div>
          <div class="progress-text">
            {weeklyProgress.pagesRead}/{goals.weeklyPages} pages
            {#if weeklyProgress.pagesRead >= goals.weeklyPages}
              <span class="goal-achieved">🎉</span>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>

  <button class="newCardButton" on:click={openNewCardModal}>➕ Add New Book</button>

  <!-- Settings Modal -->
  {#if settingsModalOpen}
    <div class="modal-overlay" on:click={closeSettingsModal}>
      <div class="settings-modal" on:click|stopPropagation>
        <div class="modal-header">
          <h2>📊 Reading Goals</h2>
          <button class="close-button" on:click={closeSettingsModal}>&times;</button>
        </div>
        <form on:submit|preventDefault={() => {
          saveGoals({ detail: { weeklyDays: tempWeeklyDays, weeklyPages: tempWeeklyPages } });
          closeSettingsModal();
        }}>
          <div class="goal-setting">
            <label>
              <span class="goal-icon">📅</span>
              <span class="goal-label">Days per week goal:</span>
              <input
                type="number"
                min="1"
                max="7"
                bind:value={tempWeeklyDays}
                class="goal-input"
              />
            </label>
            <p class="goal-description">How many days per week do you want to read?</p>
          </div>

          <div class="goal-setting">
            <label>
              <span class="goal-icon">📖</span>
              <span class="goal-label">Pages per week goal:</span>
              <input
                type="number"
                min="1"
                max="1000"
                bind:value={tempWeeklyPages}
                class="goal-input"
              />
            </label>
            <p class="goal-description">How many pages do you want to read per week?</p>
          </div>

          <div class="modal-actions">
            <button type="button" class="cancel-button" on:click={closeSettingsModal}>Cancel</button>
            <button type="submit" class="save-button">Save Goals</button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <Modal open={newCardModalOpen} onClose={closeNewCardModal} on:addEntry={(e) => {
      entries = [...entries, { ...e.detail, journal: [] }];
      updateStreak();
      updateWeeklyProgress();
  }}/>

  <div class="book-card-container">
      <h2 class='topTitle'>My Books</h2>
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
  .header-container {
    position: relative;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .settings-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
    opacity: 0.7;
  }

  .settings-button:hover {
    background-color: rgba(0, 0, 0, 0.05);
    opacity: 1;
    transform: rotate(90deg);
  }

  .streak-container {
    margin: 20px 0;
    padding: 20px;
    background: #a27162;
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
    margin: 0 0 20px 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .goals-progress {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 15px;
    margin-top: 15px;
  }

  .goals-progress h3 {
    margin: 0 0 15px 0;
    font-size: 1.1rem;
    opacity: 0.9;
  }

  .progress-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  .progress-item {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 12px;
  }

  .progress-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .progress-icon {
    font-size: 1rem;
  }

  .progress-title {
    font-size: 0.85rem;
    font-weight: 500;
  }

  .progress-bar {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    height: 8px;
    margin-bottom: 8px;
    overflow: hidden;
  }

  .progress-fill {
    background: #ef7f3e;
    height: 100%;
    border-radius: 10px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .goal-achieved {
    animation: bounce 0.6s ease;
  }

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

  .settings-modal {
    background: #313a40;
    border-radius: 12px;
    padding: 25px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
  }

  .modal-header h2 {
    margin: 0;
    color: #f4f3f1;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    padding: 5px;
  }

  .close-button:hover {
    color: #333;
  }

  .goal-setting {
    margin-bottom: 25px;
  }

  .goal-setting label {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    color: #f4f3f1;
    font-weight: 500;
  }

  .goal-icon {
    font-size: 1.2rem;
  }

  .goal-label {
    flex: 1;
  }

  .goal-input {
    padding: 8px 12px;
    border: 2px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    width: 80px;
    text-align: center;
  }

  .goal-input:focus {
    outline: none;
    border-color: #667eea;
  }

  .goal-description {
    margin: 0;
    font-size: 0.85rem;
    color: #f4f3f1;
    font-style: italic;
  }

  .modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding-top: 15px;
    border-top: 1px solid #eee;
  }

  .cancel-button, .save-button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .cancel-button {
    background: #f5f5f5;
    color: #666;
  }

  .cancel-button:hover {
    background: #e0e0e0;
  }

  .save-button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
  }

  .save-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  @keyframes flicker {
    0% { transform: rotate(-5deg) scale(1); }
    100% { transform: rotate(5deg) scale(1.1); }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }

  @media (max-width: 600px) {
    .progress-grid {
      grid-template-columns: 1fr;
    }
  }
</style>