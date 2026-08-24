/* =============================================================
   Daily Habit Tracker - script.js
   Vanilla JavaScript only.
   Talks to the PHP API using fetch() and updates the page
   without reloading.
   ============================================================= */

(function () {
    "use strict";

    /* ----- API base URL -----
       Because every PHP file lives in the "api" folder next to
       index.html, we use a relative path so it works on any host. */
    const API = "api";

    /* ----- Shortcut helpers for the elements we use a lot ----- */
    const $ = (id) => document.getElementById(id);

    const els = {
        totalCount:      $("totalCount"),
        completedCount:  $("completedCount"),
        pendingCount:    $("pendingCount"),
        percentValue:    $("percentValue"),
        progressFill:    $("progressFill"),
        habitForm:       $("habitForm"),
        habitName:       $("habitName"),
        description:     $("description"),
        category:        $("category"),
        submitBtn:       $("submitBtn"),
        formMessage:     $("formMessage"),
        listMessage:     $("listMessage"),
        habitsList:      $("habitsList"),
        todayDate:       $("todayDate")
    };

    /* =========================================================
       1. Show today's date in the header
       ========================================================= */
    function showTodayDate() {
        const today = new Date();
        const options = {
            weekday: "long",
            year:    "numeric",
            month:   "long",
            day:     "numeric"
        };
        els.todayDate.textContent = today.toLocaleDateString(undefined, options);
    }

    /* =========================================================
       2. Fetch all habits from the PHP API and display them
       ========================================================= */
    async function loadHabits() {
        showListMessage("Loading habits...", "");

        try {
            const response = await fetch(`${API}/get_habits.php`, { method: "GET" });
            const data     = await response.json();

            if (data.success) {
                renderHabits(data.habits);
            } else {
                renderHabits([]);
                showListMessage(data.message || "Could not load habits.", "error");
            }
        } catch (error) {
            renderHabits([]);
            showListMessage(
                "Could not reach the server. Is Apache running?",
                "error"
            );
        }
    }

    /* =========================================================
       3. Draw the habit cards and update the dashboard stats
       ========================================================= */
    function renderHabits(habits) {
        // Clear the current list
        els.habitsList.innerHTML = "";

        if (habits.length === 0) {
            showListMessage("No habits yet. Add your first habit above!", "");
            updateStats(habits);
            return;
        }

        // Build a card for each habit
        habits.forEach(function (habit) {
            const card = document.createElement("div");
            card.className = "habit-card" +
                (habit.status === "completed" ? " completed-card" : "");

            // Format the created date to be easier to read
            const createdText = formatDate(habit.created_at);

            // Build the HTML inside the card
            card.innerHTML = `
                <h3>${escapeHtml(habit.habit_name)}</h3>
                <p class="habit-description">
                    ${habit.description ? escapeHtml(habit.description) : "No description"}
                </p>
                <span class="badge ${escapeHtml(habit.category)}">${escapeHtml(habit.category)}</span>
                <span class="status-tag ${habit.status}">${habit.status}</span>
                <p class="habit-meta">Created: ${createdText}</p>
                <div class="habit-actions">
                    <button class="btn btn-complete"
                            data-id="${habit.id}"
                            ${habit.status === "completed" ? "disabled" : ""}>
                        Complete
                    </button>
                    <button class="btn btn-delete" data-id="${habit.id}">
                        Delete
                    </button>
                </div>
            `;

            els.habitsList.appendChild(card);
        });

        // Clear the loading message
        showListMessage("", "");

        // Attach click handlers to the new buttons
        attachCardEvents();

        // Refresh the stats and progress bar
        updateStats(habits);
    }

    /* =========================================================
       4. Attach events to the Complete / Delete buttons
       ========================================================= */
    function attachCardEvents() {
        // Complete buttons
        const completeButtons = els.habitsList.querySelectorAll(".btn-complete");
        completeButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                const id = parseInt(btn.getAttribute("data-id"), 10);
                completeHabit(id, btn);
            });
        });

        // Delete buttons
        const deleteButtons = els.habitsList.querySelectorAll(".btn-delete");
        deleteButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                const id = parseInt(btn.getAttribute("data-id"), 10);
                deleteHabit(id);
            });
        });
    }

    /* =========================================================
       5. Add a new habit (form submit)
       ========================================================= */
    async function addHabit(event) {
        event.preventDefault();

        // Collect the values from the form
        const habitData = {
            habit_name:   els.habitName.value,
            description:  els.description.value,
            category:     els.category.value
        };

        // Simple front-end validation (the PHP side checks again too)
        if (!habitData.habit_name || !habitData.category) {
            showFormMessage("Please fill in the habit name and choose a category.", "error");
            return;
        }

        // Disable the button while we wait
        els.submitBtn.disabled = true;
        els.submitBtn.textContent = "Adding...";

        try {
            const response = await fetch(`${API}/add_habit.php`, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(habitData)
            });

            const data = await response.json();

            if (data.success) {
                showFormMessage(data.message, "success");
                els.habitForm.reset();
                loadHabits(); // refresh the list from the server
            } else {
                showFormMessage(data.message || "Could not add habit.", "error");
            }
        } catch (error) {
            showFormMessage("Could not reach the server. Is Apache running?", "error");
        } finally {
            els.submitBtn.disabled = false;
            els.submitBtn.textContent = "Add Habit";
        }
    }

    /* =========================================================
       6. Mark a habit as completed
       ========================================================= */
    async function completeHabit(id, button) {
        button.disabled = true;
        button.textContent = "Updating...";

        try {
            const response = await fetch(`${API}/complete_habit.php`, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ id: id })
            });

            const data = await response.json();

            if (data.success) {
                loadHabits(); // refresh everything
            } else {
                showListMessage(data.message || "Could not complete habit.", "error");
                button.disabled = false;
                button.textContent = "Complete";
            }
        } catch (error) {
            showListMessage("Could not reach the server. Is Apache running?", "error");
            button.disabled = false;
            button.textContent = "Complete";
        }
    }

    /* =========================================================
       7. Delete a habit (after confirmation)
       ========================================================= */
    async function deleteHabit(id) {
        // Ask the user to confirm before deleting
        const confirmed = confirm("Are you sure you want to delete this habit?");
        if (!confirmed) return;

        try {
            const response = await fetch(`${API}/delete_habit.php`, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ id: id })
            });

            const data = await response.json();

            if (data.success) {
                loadHabits(); // refresh the list
            } else {
                showListMessage(data.message || "Could not delete habit.", "error");
            }
        } catch (error) {
            showListMessage("Could not reach the server. Is Apache running?", "error");
        }
    }

    /* =========================================================
       8. Update the dashboard stats and progress bar
       ========================================================= */
    function updateStats(habits) {
        const total     = habits.length;
        const completed = habits.filter(h => h.status === "completed").length;
        const pending   = total - completed;
        const percent   = total === 0 ? 0 : Math.round((completed / total) * 100);

        els.totalCount.textContent     = total;
        els.completedCount.textContent = completed;
        els.pendingCount.textContent   = pending;
        els.percentValue.textContent   = percent + "%";
        els.progressFill.style.width   = percent + "%";
    }

    /* =========================================================
       Helper: show a message under the form
       ========================================================= */
    function showFormMessage(text, type) {
        els.formMessage.textContent = text;
        els.formMessage.className   = "message " + (type || "");
    }

    /* =========================================================
       Helper: show a message above the habit list
       ========================================================= */
    function showListMessage(text, type) {
        els.listMessage.textContent = text;
        els.listMessage.className   = "message " + (type || "");
    }

    /* =========================================================
       Helper: format a date string nicely
       ========================================================= */
    function formatDate(dateString) {
        if (!dateString) return "Unknown";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString(undefined, {
            year: "numeric", month: "short", day: "numeric"
        });
    }

    /* =========================================================
       Helper: escape HTML so user input cannot break the page
       (prevents simple XSS from habit names/descriptions)
       ========================================================= */
    function escapeHtml(text) {
        if (text === null || text === undefined) return "";
        const div = document.createElement("div");
        div.textContent = String(text);
        return div.innerHTML;
    }

    /* =========================================================
       9. Start the app when the page loads
       ========================================================= */
    document.addEventListener("DOMContentLoaded", function () {
        showTodayDate();
        loadHabits();
        els.habitForm.addEventListener("submit", addHabit);
    });

})();
