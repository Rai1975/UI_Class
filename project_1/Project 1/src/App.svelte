<script>
    import BookCard from "./bookCard.svelte";
    import JournalModal from "./journalModal.svelte";
    import NewCardModal from "./newCardModal.svelte";
    import SettingsModal from "./SettingsModal.svelte";

    const user = "Benjamin";
    const date = new Date();
    let newCardModalOpen = false;
    let journalModalOpen = false;
    let settingsModalOpen = false;
    let showSuccessMessage = false;
    let selectedBook = {};

    let goals = {
        weeklyDays: 5,
        weeklyPages: 100,
        trackDays: true,
        trackPages: true
    };

    let entries = [
        {
            title: "1984",
            author: "George Orwell",
            cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
            journal: [
                { page: 45, feeling: "Crazy book. I think reading this book has made me see the world differently now. Big Brother is always watching!", date: "9/20/2025" , emotions: ['excited', 'curious']},
                { page: 46, feeling: "Oh nvm, it's not that crazy", date: "9/21/2025", emotions: ['disappointed']}
            ]
        },
        {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            cover: "https://covers.openlibrary.org/b/olid/OL35657482M-L.jpg",
            journal: []
        }
    ];

    let currentStreak = 0;
    let weeklyProgress = { daysRead: 0, pagesRead: 0 };

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

    function getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    function calculateWeeklyProgress() {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setHours(0, 0, 0, 0);
        sevenDaysAgo.setDate(today.getDate() - 6);

        const thisWeekDates = new Set();
        let totalPagesThisWeek = 0;

        entries.forEach(book => {
            book.journal.forEach(entry => {
                const entryDate = new Date(entry.date);
                if (entryDate >= sevenDaysAgo && entryDate <= today) {
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

    function openJournalModal(event) {
        selectedBook = event.detail.entry;
        journalModalOpen = true;
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

    function handleJournalUpdate(event) {
      const { title, journal } = event.detail;
      const bookToUpdate = entries.find(book => book.title === title);
      if (bookToUpdate) {
          bookToUpdate.journal = journal;
          entries = [...entries]; // trigger reactivity

          // 🔑 also update selectedBook so the modal sees changes live
          if (selectedBook.title === title) {
              selectedBook = { ...bookToUpdate };
          }

          updateStreak();
          updateWeeklyProgress();
      }
  }

    function addReadingEntry(event) {
      const { title, page, feeling, emotions, date } = event.detail;
      const bookToUpdate = entries.find(book => book.title === title);
      if (bookToUpdate) {
          bookToUpdate.journal = [
              ...bookToUpdate.journal,
              { page: parseInt(page), feeling, emotions: emotions || [], date }
          ].sort((a, b) => a.page - b.page);
          entries = [...entries];

          if (selectedBook.title === title) {
              selectedBook = { ...bookToUpdate };
          }

          updateStreak();
          updateWeeklyProgress();
      }
  }

  function handleDeleteEntry(event) {
      const { title, index } = event.detail;
      const bookToUpdate = entries.find(book => book.title === title);
      if (bookToUpdate) {
          bookToUpdate.journal = bookToUpdate.journal.filter((_, i) => i !== index);
          entries = [...entries];

          if (selectedBook.title === title) {
              selectedBook = { ...bookToUpdate };
          }

          updateStreak();
          updateWeeklyProgress();
      }
  }

  function handleSaveGoals(event) {
      goals = { ...event.detail };
      updateWeeklyProgress();
      showSuccessMessage = true;
      setTimeout(() => {
          showSuccessMessage = false;
      }, 3000);
    }

  function updateStreak() {
      const allDates = getAllJournalDates();
      currentStreak = calculateStreak(allDates);
  }

  function updateWeeklyProgress() {
      weeklyProgress = calculateWeeklyProgress();
  }

  $: if (entries) {
      updateStreak();
      updateWeeklyProgress();
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

    {#if showSuccessMessage}
        <div class="success-message">
            <span class="success-icon">✅</span>
            <span class="success-text">Goals updated successfully!</span>
        </div>
    {/if}

    <SettingsModal
        open={settingsModalOpen}
        goals={goals}
        on:saveGoals={handleSaveGoals}
        on:close={closeSettingsModal}
    />

    <div class="book-card-container">
        <h2 class='topTitle'>My Books</h2>
        <BookCard
          entries={entries}
          currentStreak={currentStreak}
          weeklyProgress={weeklyProgress}
          on:openJournal={openJournalModal}
          on:addBook={(e) => {
            entries = [...entries, e.detail.entry];
            updateStreak();
            updateWeeklyProgress();
          }}
        />
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