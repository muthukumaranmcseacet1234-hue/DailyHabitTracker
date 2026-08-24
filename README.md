# Daily Habit Tracker

A simple, beginner-friendly **full-stack web application** for tracking daily habits.
You can add habits, view them, mark them as completed, delete them, and see your
progress for the day — all without the page reloading.

---

## 1. Project Description

The **Daily Habit Tracker** is a small dashboard where you can:

- Add a new habit (name, description, category)
- View all habits as clean cards
- Mark a habit as **completed**
- Delete a habit (with confirmation)
- See live stats: total habits, completed, pending, and a progress bar

The app updates instantly using JavaScript `fetch()` calls to a PHP API — the page
never fully reloads after an action.

---

## 2. Technologies Used

| Layer       | Technology                |
| ----------- | ------------------------- |
| Frontend    | HTML5, CSS3, Vanilla JS   |
| Backend/API | PHP (plain, no framework) |
| Database    | MySQL                     |
| Web Server  | Apache (provided by XAMPP)|

**No frameworks are used** — not React, Vue, Angular, Node, Express, Laravel,
Bootstrap, Tailwind, Firebase, or Supabase.

---

## 3. Folder Structure

```
DailyHabitTracker/
│
├── index.html              # Main page (the dashboard)
├── style.css               # All styling
├── script.js               # All JavaScript (fetch calls + UI updates)
│
├── api/
│   ├── db.php              # Database connection (shared by all API files)
│   ├── add_habit.php       # POST   - add a new habit
│   ├── get_habits.php      # GET    - fetch all habits
│   ├── complete_habit.php  # POST   - mark a habit completed
│   └── delete_habit.php    # POST   - delete a habit
│
└── database/
    └── habit_tracker.sql   # SQL script to create the database + table
```

---

## 4. How to Install XAMPP

XAMPP gives you Apache (PHP) and MySQL in one install.

1. Go to <https://www.apachefriends.org/download.html>
2. Download the **XAMPP** version for your operating system
   (Windows / macOS / Linux).
3. Run the installer and accept the default options.
4. On Windows, install it to `C:\xampp` (the default).
5. When the installer finishes, open the **XAMPP Control Panel**.

---

## 5. Where to Place the Project Inside htdocs

Apache (via XAMPP) serves websites from the `htdocs` folder.

1. Copy the entire **`DailyHabitTracker`** folder.
2. Paste it into:
   - **Windows:** `C:\xampp\htdocs\`
   - **macOS:**   `/Applications/XAMPP/htdocs/`
   - **Linux:**   `/opt/lampp/htdocs/`

After this you should have a path like:

```
C:\xampp\htdocs\DailyHabitTracker\index.html
```

---

## 6. How to Create the MySQL Database

You have two easy options.

### Option A — Using phpMyAdmin (recommended)

1. Open the XAMPP Control Panel and **Start Apache** and **Start MySQL**.
2. Open your browser and go to: <http://localhost/phpmyadmin>
3. Click the **Import** tab at the top.
4. Click **Choose File** and select:
   ```
   DailyHabitTracker/database/habit_tracker.sql
   ```
5. Click **Go**.

This creates the `habit_tracker` database, the `habits` table, and inserts a few
sample habits automatically.

### Option B — Creating it manually

1. In phpMyAdmin, click **SQL** at the top.
2. Paste and run:

```sql
CREATE DATABASE habit_tracker
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE habit_tracker;

CREATE TABLE habits (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    habit_name  VARCHAR(150) NOT NULL,
    description TEXT,
    category    VARCHAR(50),
    status      ENUM('pending','completed') DEFAULT 'pending',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 7. How to Import habit_tracker.sql

See **Option A** in section 6 above — the `.sql` file creates the database, the
table, and sample data in one step.

---

## 8. How to Start Apache and MySQL

1. Open the **XAMPP Control Panel**.
2. Next to **Apache**, click **Start**.
3. Next to **MySQL**, click **Start**.
4. Both should turn green, showing they are running.

---

## 9. How to Open the Project in the Browser

Once Apache and MySQL are running, open your browser and go to:

```
http://localhost/DailyHabitTracker/index.html
```

You should see the **Daily Habit Tracker** dashboard. If you imported the sample
data, a few habits will already be visible.

---

## 10. How It All Works (HTML → JavaScript → PHP API → MySQL)

Here is the step-by-step flow when, for example, you **add a habit**:

```
[ HTML form ]
       │  user types a habit name + description + category
       ▼
[ JavaScript (script.js) ]
       │  collects the form values and calls fetch()
       │  with a POST request and JSON body
       ▼
[ PHP API (api/add_habit.php) ]
       │  reads the JSON, validates the data,
       │  and runs a prepared INSERT statement
       ▼
[ MySQL database (habit_tracker.habits) ]
       │  stores the new row
       ▼
[ PHP API ]
       │  sends back a JSON response (success + new habit)
       ▼
[ JavaScript ]
       │  reads the JSON, shows a success message,
       │  and calls loadHabits() to refresh the list
       ▼
[ HTML / CSS ]
       │  new habit card appears on screen — no full page reload
```

The same pattern is used for **getting**, **completing**, and **deleting** habits:

| Action   | JavaScript fetch() | PHP file             | SQL operation        |
| -------- | ------------------ | -------------------- | -------------------- |
| Get list | GET                | get_habits.php       | SELECT               |
| Add      | POST               | add_habit.php        | INSERT               |
| Complete | POST               | complete_habit.php   | UPDATE               |
| Delete   | POST               | delete_habit.php     | DELETE               |

Every PHP API file returns **JSON**, so JavaScript can easily read the result and
update the page.

---

## Database Credentials

The connection settings are inside `api/db.php` and use the default XAMPP values:

| Setting  | Value      |
| -------- | ---------- |
| Host     | localhost  |
| User     | root       |
| Password | *(empty)*  |
| Database | habit_tracker |

If you change your MySQL password later, update it in `api/db.php`.

---

## Verification Checklist

- [x] Add habit works
- [x] Get / display habits works
- [x] Complete habit works
- [x] Delete habit works
- [x] Progress calculation works
- [x] MySQL data is stored
- [x] PHP APIs return valid JSON
- [x] No frameworks used (only HTML, CSS, JS, PHP, MySQL)

---

Built with HTML, CSS, Vanilla JavaScript, PHP, and MySQL — no frameworks.
