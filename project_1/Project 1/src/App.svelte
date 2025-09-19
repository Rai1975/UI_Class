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
  let showSuccessMessage = false;

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

  // Goals management - now with enabled/disabled toggles
  let goals = {
    weeklyDays: 5,
    weeklyPages: 100,
    trackDays: true,
    trackPages: true
  };

  function saveGoals(event) {
    goals = { ...event.detail };
    updateWeeklyProgress();

    // Show success message
    showSuccessMessage = true;
    setTimeout(() => {
      showSuccessMessage = false;
    }, 3000); // Hide after 3 seconds
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
  let tempTrackDays = goals.trackDays;
  let tempTrackPages = goals.trackPages;

  // Update temp values when goals change
  $: {
    tempWeeklyDays = goals.weeklyDays;
    tempWeeklyPages = goals.weeklyPages;
    tempTrackDays = goals.trackDays;
    tempTrackPages = goals.trackPages;
  }
</script>

<main>
  <div class="header-container">
    <div class="header-content">
      <h1 class="userSum">Welcome back, {user}</h1>
      <div class="header-right">
        <p class="date-text">
          Today is {date.toLocaleDateString("en-US", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "2-digit"
          }).replace(/\//g, "-")}
        </p>
        <button class="settings-button" on:click={openSettingsModal} title="Settings">⚙️</button>
      </div>
    </div>
  </div>


  <!-- Enhanced Streak Display with Goals -->
  <div class="streak-container">
    <div class="streak-display">
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

  {#if goals.trackDays || goals.trackPages}
    <div class="goals-progress">
      <h3>This Week's Progress</h3>
      <div class="progress-grid" class:single-goal={!goals.trackDays || !goals.trackPages}>
        {#if goals.trackDays}
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
        {/if}

        {#if goals.trackPages}
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
        {/if}
      </div>
    </div>
  {/if}

  <!-- Success Message -->
  {#if showSuccessMessage}
    <div class="success-message">
      <span class="success-icon">✅</span>
      <span class="success-text">Goals updated successfully!</span>
    </div>
  {/if}

  <!-- Settings Modal -->
  {#if settingsModalOpen}
    <div class="modal-overlay" on:click={closeSettingsModal}>
      <div class="settings-modal" on:click|stopPropagation>
        <div class="modal-header">
          <h2>📊 Reading Goals</h2>
          <button class="close-button" on:click={closeSettingsModal}>&times;</button>
        </div>
        <form on:submit|preventDefault={() => {
          saveGoals({
            detail: {
              weeklyDays: tempWeeklyDays,
              weeklyPages: tempWeeklyPages,
              trackDays: tempTrackDays,
              trackPages: tempTrackPages
            }
          });
          closeSettingsModal();
        }}>
          <div class="goal-setting">
            <div class="goal-header">
              <label class="goal-toggle">
                <input
                  type="checkbox"
                  bind:checked={tempTrackDays}
                  class="goal-checkbox"
                />
                <span class="goal-icon">📅</span>
                <span class="goal-label">Track reading days</span>
              </label>
            </div>
            {#if tempTrackDays}
              <div class="goal-input-section">
                <label>
                  <span class="goal-sublabel">Days per week goal:</span>
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
            {:else}
              <p class="goal-disabled">Reading days tracking is disabled</p>
            {/if}
          </div>

          <div class="goal-setting">
            <div class="goal-header">
              <label class="goal-toggle">
                <input
                  type="checkbox"
                  bind:checked={tempTrackPages}
                  class="goal-checkbox"
                />
                <span class="goal-icon">📖</span>
                <span class="goal-label">Track pages read</span>
              </label>
            </div>
            {#if tempTrackPages}
              <div class="goal-input-section">
                <label>
                  <span class="goal-sublabel">Pages per week goal:</span>
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
            {:else}
              <p class="goal-disabled">Pages tracking is disabled</p>
            {/if}
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
      <BookCard entries={entries} on:openJournal={openJournalModal}/>

      <div class="add-card" on:click={openNewCardModal}>
        <div class="add-icon">+</div>
      </div>
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