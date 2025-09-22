<script>
    import { createEventDispatcher } from 'svelte';
    import './SettingsModal.css'
    const dispatch = createEventDispatcher();

    export let open;
    export let goals;

    let tempWeeklyDays = goals.weeklyDays;
    let tempWeeklyPages = goals.weeklyPages;
    let tempTrackDays = goals.trackDays;
    let tempTrackPages = goals.trackPages;

    function saveGoals() {
        dispatch('saveGoals', {
            weeklyDays: tempWeeklyDays,
            weeklyPages: tempWeeklyPages,
            trackDays: tempTrackDays,
            trackPages: tempTrackPages
        });
        dispatch('close');
    }
</script>

{#if open}
    <div class="modal-overlay" on:click={() => dispatch('close')}>
        <div class="settings-modal" on:click|stopPropagation>
            <div class="modal-header">
                <h2>📊 Reading Goals</h2>
                <button class="close-button" on:click={() => dispatch('close')}>&times;</button>
            </div>
            <form on:submit|preventDefault={saveGoals}>
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
                    <button type="button" class="cancel-button" on:click={() => dispatch('close')}>Cancel</button>
                    <button type="submit" class="save-button">Save Goals</button>
                </div>
            </form>
        </div>
    </div>
{/if}