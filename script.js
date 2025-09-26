// filepath: c:\Users\raini\Downloads\september-study-hub\script.js

document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentSections = document.querySelectorAll('.content-section');
    const leavesContainer = document.getElementById('leaves-container');
    let leavesInterval = null;

    // --- Falling Leaves Animation ---
    function createLeaf() {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.style.left = Math.random()*100 + 'vw';
        leaf.style.animationDuration = (4+Math.random()*3) + 's';
        leaf.style.opacity = 0.7 + Math.random()*0.3;
        leaf.style.fontSize = (16+Math.random()*24) + 'px';
        leaf.textContent = ['🍁','🍂','🍃'][Math.floor(Math.random()*3)];
        leavesContainer.appendChild(leaf);
        setTimeout(()=>leaf.remove(), 7000);
    }

    function startLeaves() {
        if (!leavesInterval) {
            leavesInterval = setInterval(createLeaf, 700);
        }
    }
    function stopLeaves() {
        clearInterval(leavesInterval);
        leavesInterval = null;
        leavesContainer.innerHTML = '';
    }

    // --- Sidebar Navigation ---
    sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        sidebarLinks.forEach(l => l.classList.remove('active'));
        contentSections.forEach(sec => sec.classList.remove('active'));

        link.classList.add('active');
        const targetId = link.getAttribute('href').replace('#', '');
        document.getElementById(targetId).classList.add('active');

        if (targetId === 'pomodoro') {
        startLeaves();
        } else {
        stopLeaves();
        }
    });
    });


    // Start leaves if Pomodoro is the default active page
    if (document.getElementById('pomodoro').classList.contains('active')) {
        startLeaves();
    }

    // --- Pomodoro / Stopwatch / Clock ---
    let pomodoroMode = 'pomodoro';
    let pomodoroInterval = null;
    let pomodoroTime = 25 * 60;
    let stopwatchTime = 0;
    let stopwatchInterval = null;
    let stopwatchRunning = false;
    let laps = [];

    const pomodoroDisplay = document.getElementById('pomodoro-time');
    const progressCircle = document.getElementById('pomodoro-progress');
    const liveClock = document.getElementById('live-clock');
    const clockCircle = document.getElementById('clock-circle');
    const stopwatchLaps = document.getElementById('stopwatch-laps');

    function updatePomodoroDisplay() {
        let min = Math.floor(pomodoroTime / 60);
        let sec = pomodoroTime % 60;
        pomodoroDisplay.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
        // Progress circle (simple fill)
        let percent = (pomodoroTime / (25 * 60)) * 100;
        progressCircle.style.background = `conic-gradient(#ff9966 ${percent}%, #f2e6d4 ${percent}% 100%)`;
    }

    function updateStopwatchDisplay() {
        let min = Math.floor(stopwatchTime / 60);
        let sec = stopwatchTime % 60;
        pomodoroDisplay.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    function updateLiveClock() {
        const now = new Date();
        liveClock.textContent = now.toLocaleTimeString();
    }

    function switchPomodoroMode(mode) {
        pomodoroMode = mode;
        document.getElementById('mode-pomodoro').classList.toggle('active', mode === 'pomodoro');
        document.getElementById('mode-stopwatch').classList.toggle('active', mode === 'stopwatch');
        document.getElementById('mode-clock').classList.toggle('active', mode === 'clock');
        document.getElementById('stopwatch-controls').style.display = mode === 'stopwatch' ? '' : 'none';
        document.getElementById('pomodoro-controls').style.display = mode === 'pomodoro' ? '' : 'none';
        progressCircle.style.display = (mode === 'pomodoro' || mode === 'stopwatch') ? '' : 'none';
        clockCircle.style.display = (mode === 'clock') ? '' : 'none';

        if (pomodoroInterval) clearInterval(pomodoroInterval);
        if (stopwatchInterval) clearInterval(stopwatchInterval);

        if (mode === 'pomodoro') {
            pomodoroTime = 25 * 60;
            updatePomodoroDisplay();
            pomodoroDisplay.style.display = '';
            liveClock.textContent = '';
        } else if (mode === 'stopwatch') {
            stopwatchTime = 0;
            updateStopwatchDisplay();
            stopwatchLaps.innerHTML = '';
            laps = [];
            pomodoroDisplay.style.display = '';
            liveClock.textContent = '';
        } else if (mode === 'clock') {
            pomodoroDisplay.style.display = 'none';
            updateLiveClock();
            pomodoroInterval = setInterval(updateLiveClock, 1000);
        }
    }

    document.getElementById('mode-pomodoro').onclick = () => switchPomodoroMode('pomodoro');
    document.getElementById('mode-stopwatch').onclick = () => switchPomodoroMode('stopwatch');
    document.getElementById('mode-clock').onclick = () => switchPomodoroMode('clock');

    // --- Pomodoro controls ---
    document.getElementById('start-pomodoro').onclick = () => {
        if (pomodoroMode === 'pomodoro') {
            if (pomodoroInterval) return;
            pomodoroInterval = setInterval(() => {
                if (pomodoroTime > 0) {
                    pomodoroTime--;
                    updatePomodoroDisplay();
                } else {
                    clearInterval(pomodoroInterval);
                    pomodoroInterval = null;
                    new Audio('https://cdn.pixabay.com/audio/2022/10/16/audio_12c6b6b8e2.mp3').play();
                    alert('Pomodoro complete! Take a break 🍂');
                }
            }, 1000);
        }
    };

    document.getElementById('pause-pomodoro').onclick = () => {
        if (pomodoroMode === 'pomodoro' && pomodoroInterval) {
            clearInterval(pomodoroInterval);
            pomodoroInterval = null;
        }
    };

    document.getElementById('reset-pomodoro').onclick = () => {
        if (pomodoroMode === 'pomodoro') {
            if (pomodoroInterval) clearInterval(pomodoroInterval);
            pomodoroTime = 25 * 60;
            updatePomodoroDisplay();
            pomodoroInterval = null;
        }
    };

    // --- Stopwatch controls ---
    document.getElementById('start-stopwatch').onclick = () => {
        if (pomodoroMode === 'stopwatch') {
            if (stopwatchRunning) return;
            stopwatchRunning = true;
            stopwatchInterval = setInterval(() => {
                stopwatchTime++;
                updateStopwatchDisplay();
            }, 1000);
        }
    };

    document.getElementById('lap-stopwatch').onclick = () => {
        if (pomodoroMode === 'stopwatch' && stopwatchRunning) {
            laps.push(stopwatchTime);
            const li = document.createElement('li');
            let min = Math.floor(stopwatchTime / 60);
            let sec = stopwatchTime % 60;
            li.textContent = `Lap ${laps.length}: ${min}:${sec < 10 ? '0' : ''}${sec}`;
            stopwatchLaps.appendChild(li);
        }
    };

    document.getElementById('reset-stopwatch').onclick = () => {
        if (pomodoroMode === 'stopwatch') {
            if (stopwatchInterval) clearInterval(stopwatchInterval);
            stopwatchTime = 0;
            updateStopwatchDisplay();
            stopwatchLaps.innerHTML = '';
            laps = [];
            stopwatchRunning = false;
        }
    };

    updatePomodoroDisplay();


    // --- Notes ---
    const notesInput = document.getElementById('notes-input');
    const notesList = document.getElementById('notes-list');
    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        notesList.innerHTML = notes.map((n, i) =>
            `<div class="card"><div>${n}</div>
            <button onclick="(function(){let notes=JSON.parse(localStorage.getItem('notes')||'[]');notes.splice(${i},1);localStorage.setItem('notes',JSON.stringify(notes));location.reload();})()">Delete</button></div>`
        ).join('');
    }
    document.querySelectorAll('.notes-toolbar button').forEach(btn => {
        btn.onclick = () => document.execCommand(btn.dataset.cmd, false, null);
    });
    document.getElementById('save-note').onclick = () => {
        let notes = JSON.parse(localStorage.getItem('notes') || '[]');
        if (notesInput.innerHTML.trim()) {
            notes.push(notesInput.innerHTML);
            localStorage.setItem('notes', JSON.stringify(notes));
            notesInput.innerHTML = '';
            loadNotes();
        }
    };
    loadNotes();

    // --- Journal ---
    const journalDate = document.getElementById('journal-date');
    const journalEntry = document.getElementById('journal-entry');
    function loadJournal() {
        const date = journalDate.value || new Date().toISOString().slice(0,10);
        const journals = JSON.parse(localStorage.getItem('journals') || '{}');
        journalEntry.value = journals[date] || '';
    }
    journalDate.value = new Date().toISOString().slice(0,10);
    journalDate.onchange = loadJournal;
    document.getElementById('save-journal').onclick = () => {
        const date = journalDate.value;
        let journals = JSON.parse(localStorage.getItem('journals') || '{}');
        journals[date] = journalEntry.value;
        localStorage.setItem('journals', JSON.stringify(journals));
        alert('Journal saved!');
    };
    loadJournal();

    // --- To-Do List ---
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const todoDeadlineDate = document.getElementById('todo-deadline-date');
    const todoDeadlineTime = document.getElementById('todo-deadline-time');
    const todoAllDay = document.getElementById('todo-allday');
    const todoPriority = document.getElementById('todo-priority');
    const todoProgress = document.getElementById('todo-progress');

    todoAllDay.onchange = () => {
        todoDeadlineTime.style.display = todoAllDay.checked ? 'none' : '';
    };

    function loadTodos() {
        let todos = JSON.parse(localStorage.getItem('todos') || '[]');
        const now = Date.now();

        // Auto-delete completed >24h ago or missed deadline >24h ago
        todos = todos.filter(t => {
            if (t.progress === 'Done' && t.completedAt && now - t.completedAt < 24*60*60*1000) return true;
            if (t.progress === 'Done' && t.completedAt && now - t.completedAt >= 24*60*60*1000) return false;
            if (t.deadline && t.progress !== 'Done') {
                const deadlineTime = new Date(t.deadline).getTime();
                if (now > deadlineTime + 24*60*60*1000) return false;
            }
            return true;
        });
        localStorage.setItem('todos', JSON.stringify(todos));

        todoList.innerHTML = todos.map((t, i) => {
            let deadlineStr = t.deadline
                ? (t.allday
                    ? `Deadline: ${new Date(t.deadline).toLocaleDateString()} (All Day)`
                    : `Deadline: ${new Date(t.deadline).toLocaleString()}`)
                : 'No deadline';
            let addedStr = `Added: ${new Date(t.addedAt).toLocaleString()}`;
            return `
            <li>
                <div>
                    <input type="checkbox" ${t.progress === 'Done' ? 'checked' : ''} onchange="(function(){
                        let todos=JSON.parse(localStorage.getItem('todos')||'[]');
                        todos[${i}].progress = todos[${i}].progress === 'Done' ? 'Not Started' : 'Done';
                        if(todos[${i}].progress === 'Done') todos[${i}].completedAt = Date.now();
                        else todos[${i}].completedAt = null;
                        localStorage.setItem('todos',JSON.stringify(todos));
                        location.reload();
                    })()">
                    <span style="${t.progress === 'Done' ? 'text-decoration:line-through;color:#bbb;' : ''}">${t.text}</span>
                    <span class="todo-priority ${t.priority}">${t.priority}</span>
                    <span class="todo-progress" style="background:${
                        t.progress === 'Not Started' ? '#f5f5f5' :
                        t.progress === 'In Progress' ? '#fffde7' :
                        '#e8f5e9'
                    };color:${
                        t.progress === 'Not Started' ? '#757575' :
                        t.progress === 'In Progress' ? '#fbc02d' :
                        '#388e3c'
                    };">${t.progress}</span>
                </div>
                <div class="todo-meta">
                    <span>${addedStr}</span>
                    <span>${deadlineStr}</span>
                </div>
                <div class="todo-actions">
                    <button onclick="(function(){
                        let todos=JSON.parse(localStorage.getItem('todos')||'[]');
                        todos.splice(${i},1);
                        localStorage.setItem('todos',JSON.stringify(todos));
                        location.reload();
                    })()">🗑️ Delete</button>
                    <button onclick="(function(){
                        let todos=JSON.parse(localStorage.getItem('todos')||'[]');
                        todos[${i}].progress = 'In Progress';
                        todos[${i}].completedAt = null;
                        localStorage.setItem('todos',JSON.stringify(todos));
                        location.reload();
                    })()">⏳ In Progress</button>
                </div>
            </li>
            `;
        }).join('');
    }

    document.getElementById('add-todo').onclick = () => {
        let todos = JSON.parse(localStorage.getItem('todos') || '[]');
        const text = todoInput.value.trim();
        const addedAt = Date.now();
        let deadline = null;
        if (todoDeadlineDate.value) {
            if (todoAllDay.checked) {
                deadline = new Date(todoDeadlineDate.value + 'T23:59:59').toISOString();
            } else if (todoDeadlineTime.value) {
                deadline = new Date(todoDeadlineDate.value + 'T' + todoDeadlineTime.value).toISOString();
            }
        }
        const allday = todoAllDay.checked;
        const priority = todoPriority.value;
        const progress = todoProgress.value;
        if (text) {
            todos.push({
                text,
                addedAt,
                deadline,
                allday,
                priority,
                progress,
                completedAt: progress === 'Done' ? Date.now() : null
            });
            localStorage.setItem('todos', JSON.stringify(todos));
            todoInput.value = '';
            todoDeadlineDate.value = '';
            todoDeadlineTime.value = '';
            todoAllDay.checked = false;
            todoPriority.value = 'Medium';
            todoProgress.value = 'Not Started';
            loadTodos();
        }
    };

    loadTodos();

    // --- Habit Tracker ---
    const habitInput = document.getElementById('habit-input');
    const habitGrid = document.getElementById('habit-grid');
    const habitReward = document.getElementById('habit-reward');
    const habitMotivation = document.getElementById('habit-motivation');
    const habitMetrics = document.getElementById('habit-metrics');
    const downloadHabitsBtn = document.getElementById('download-habits');

    function getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    function getCurrentWeekDates() {
        const week = [];
        const start = getWeekStart(new Date());
        for (let i = 0; i < 7; i++) {
            let d = new Date(start);
            d.setDate(start.getDate() + i);
            week.push(d.toISOString().slice(0, 10));
        }
        return week;
    }

    function getLastWeekDates() {
        const week = [];
        const today = new Date();
        const start = getWeekStart(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7));
        for (let i = 0; i < 7; i++) {
            let d = new Date(start);
            d.setDate(start.getDate() + i);
            week.push(d.toISOString().slice(0, 10));
        }
        return week;
    }

    function loadHabits() {
        const habits = JSON.parse(localStorage.getItem('habits') || '[]');
        const weekDays = getCurrentWeekDates();

        // Only show current week in UI
        let html = `<table class="habit-table"><tr><th>Habit</th>`;
        for (let i = 0; i < 7; i++) {
            html += `<th>${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</th>`;
        }
        html += `<th>Delete</th></tr>`;
        habits.forEach((h, hi) => {
            html += `<tr><td>${h.name}</td>`;
            for (let i = 0; i < 7; i++) {
                let dayStr = weekDays[i];
                html += `<td>
                    <input type="checkbox" ${h.days && h.days[dayStr] ? 'checked' : ''} onchange="(function(){
                        let habits=JSON.parse(localStorage.getItem('habits')||'[]');
                        if(!habits[${hi}].days) habits[${hi}].days = {};
                        habits[${hi}].days['${dayStr}']=!habits[${hi}].days['${dayStr}'];
                        localStorage.setItem('habits',JSON.stringify(habits));
                        location.reload();
                    })()">
                </td>`;
            }
            html += `<td>
                <button class="habit-delete-btn" onclick="(function(){
                    let habits=JSON.parse(localStorage.getItem('habits')||'[]');
                    habits.splice(${hi},1);
                    localStorage.setItem('habits',JSON.stringify(habits));
                    location.reload();
                })()">🗑️</button>
            </td></tr>`;
        });
        html += `</table>`;
        habitGrid.innerHTML = html;

        // --- Metrics ---
        // This week
        let total = 0, completed = 0;
        habits.forEach(h => {
            weekDays.forEach(dayStr => {
                total++;
                if (h.days && h.days[dayStr]) completed++;
            });
        });
        let percent = total ? Math.round((completed / total) * 100) : 0;

        // Last week
        const lastWeekDays = getLastWeekDates();
        let lastTotal = 0, lastCompleted = 0;
        habits.forEach(h => {
            lastWeekDays.forEach(dayStr => {
                lastTotal++;
                if (h.days && h.days[dayStr]) lastCompleted++;
            });
        });
        let lastPercent = lastTotal ? Math.round((lastCompleted / lastTotal) * 100) : 0;
        let diff = percent - lastPercent;

        // Overall
        let allDays = [];
        habits.forEach(h => {
            if (h.days) allDays = allDays.concat(Object.keys(h.days));
        });
        allDays = [...new Set(allDays)];
        let overallTotal = habits.length * allDays.length;
        let overallCompleted = 0;
        habits.forEach(h => {
            allDays.forEach(dayStr => {
                if (h.days && h.days[dayStr]) overallCompleted++;
            });
        });
        let overallPercent = overallTotal ? Math.round((overallCompleted / overallTotal) * 100) : 0;

        // Streaks (best and current, all habits done for a day)
        function getStreaks() {
            let streak = 0, best = 0;
            let days = allDays.sort();
            let prevDate = null;
            let currentStreak = 0;
            for (let i = 0; i < days.length; i++) {
                let day = days[i];
                let allDone = habits.every(h => h.days && h.days[day]);
                if (allDone) {
                    if (prevDate && (new Date(day) - new Date(prevDate) === 24*60*60*1000)) {
                        currentStreak++;
                    } else {
                        currentStreak = 1;
                    }
                    if (currentStreak > best) best = currentStreak;
                } else {
                    currentStreak = 0;
                }
                prevDate = day;
            }
            // Current streak for this week
            let today = weekDays[weekDays.length-1];
            let curStreak = 0;
            for (let i = weekDays.length-1; i >= 0; i--) {
                let day = weekDays[i];
                let allDone = habits.every(h => h.days && h.days[day]);
                if (allDone) curStreak++;
                else break;
            }
            return {best, current: curStreak};
        }
        let streaks = getStreaks();

        habitMetrics.innerHTML = `
            <div>This Week: <span>${percent}%</span></div>
            <div>Change vs. Last Week: <span style="color:${diff>=0?'#56ab2f':'#d32f2f'}">${diff>0?'+':''}${diff}%</span></div>
            <div>Overall: <span>${overallPercent}%</span></div>
            <div>Best Streak: <span>${streaks.best} days</span></div>
            <div>Current Streak: <span>${streaks.current} days</span></div>
        `;

        // --- Motivation ---
        let message = '';
        if (percent === 100) {
            message = "🌟 Amazing! You completed all your habits this week!";
        } else if (percent >= 70) {
            message = "👏 Great job! Keep up the good work!";
        } else if (percent >= 40) {
            message = "👍 You're making progress. Stay consistent!";
        } else if (percent > 0) {
            message = "💡 Every step counts. Try to do a bit more next week!";
        } else {
            message = "🍂 Let's get started! Small steps lead to big changes.";
        }
        habitReward.innerHTML = `Weekly Completion: <b>${percent}%</b>`;
        habitMotivation.innerHTML = `<div class="habit-motivation-msg">${message}</div>`;
    }

    // --- Download Habit Data as CSV ---
    downloadHabitsBtn.onclick = () => {
        const habits = JSON.parse(localStorage.getItem('habits') || '[]');
        let allDays = [];
        habits.forEach(h => {
            if (h.days) allDays = allDays.concat(Object.keys(h.days));
        });
        allDays = [...new Set(allDays)].sort();
        let csv = ['Habit,' + allDays.join(',')];
        habits.forEach(h => {
            let row = [h.name];
            allDays.forEach(day => {
                row.push(h.days && h.days[day] ? '✔️' : '');
            });
            csv.push(row.join(','));
        });
        const blob = new Blob([csv.join('\n')], {type: 'text/csv'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'habit-tracker.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    document.getElementById('add-habit').onclick = () => {
        let habits = JSON.parse(localStorage.getItem('habits') || '[]');
        if (habitInput.value.trim()) {
            habits.push({name: habitInput.value, days:{}});
            localStorage.setItem('habits', JSON.stringify(habits));
            habitInput.value = '';
            loadHabits();
        }
    };
    loadHabits();

    // --- Calendar with Navigation, Views, Events, Notifications ---
    const calendarView = document.getElementById('calendar-view');
    const calendarDetails = document.getElementById('calendar-details');
    const calendarMonth = document.getElementById('calendar-month');
    const calendarYear = document.getElementById('calendar-year');
    const calendarViewMode = document.getElementById('calendar-view-mode');
    const prevPeriodBtn = document.getElementById('prev-period');
    const nextPeriodBtn = document.getElementById('next-period');
    const addEventGlobalBtn = document.getElementById('add-event-global');
    const eventForm = document.getElementById('calendar-event-form');
    const eventTitle = document.getElementById('event-title');
    const eventType = document.getElementById('event-type');
    const eventAllDay = document.getElementById('event-allday');
    const eventTime = document.getElementById('event-time');
    const notificationList = document.getElementById('notification-list');
    const addNotificationBtn = document.getElementById('add-notification-btn');
    const saveEventBtn = document.getElementById('save-event');
    const cancelEventBtn = document.getElementById('cancel-event');
    let selectedDate = null;
    let editingEventIdx = null;

    let calendarEvents = JSON.parse(localStorage.getItem('calendarEvents') || '{}');

    let now = new Date();
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear();
    let currentViewMode = 'month';
    let currentDay = now.getDate();

    function saveCalendarEvents() {
        localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
    }

    function populateMonthYearSelectors() {
        calendarMonth.innerHTML = '';
        calendarYear.innerHTML = '';
        const months = [
            'January','February','March','April','May','June',
            'July','August','September','October','November','December'
        ];
        months.forEach((m, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = m;
            if (i === currentMonth) opt.selected = true;
            calendarMonth.appendChild(opt);
        });
        const thisYear = new Date().getFullYear();
        for (let y = thisYear - 5; y <= thisYear + 5; y++) {
            const opt = document.createElement('option');
            opt.value = y;
            opt.textContent = y;
            if (y === currentYear) opt.selected = true;
            calendarYear.appendChild(opt);
        }
    }
    populateMonthYearSelectors();

    calendarViewMode.onchange = () => {
        currentViewMode = calendarViewMode.value;
        renderCalendar();
        calendarDetails.innerHTML = '';
    };
    calendarMonth.onchange = () => {
        currentMonth = parseInt(calendarMonth.value);
        renderCalendar();
        calendarDetails.innerHTML = '';
    };
    calendarYear.onchange = () => {
        currentYear = parseInt(calendarYear.value);
        renderCalendar();
        calendarDetails.innerHTML = '';
    };
    prevPeriodBtn.onclick = () => {
        if (currentViewMode === 'month') {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
        } else if (currentViewMode === 'week' || currentViewMode === 'day') {
            let d = new Date(currentYear, currentMonth, currentDay);
            d.setDate(d.getDate() - (currentViewMode === 'week' ? 7 : 1));
            currentYear = d.getFullYear();
            currentMonth = d.getMonth();
            currentDay = d.getDate();
        } else if (currentViewMode === 'year') {
            currentYear--;
        }
        calendarMonth.value = currentMonth;
        calendarYear.value = currentYear;
        renderCalendar();
        calendarDetails.innerHTML = '';
    };
    nextPeriodBtn.onclick = () => {
        if (currentViewMode === 'month') {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        } else if (currentViewMode === 'week' || currentViewMode === 'day') {
            let d = new Date(currentYear, currentMonth, currentDay);
            d.setDate(d.getDate() + (currentViewMode === 'week' ? 7 : 1));
            currentYear = d.getFullYear();
            currentMonth = d.getMonth();
            currentDay = d.getDate();
        } else if (currentViewMode === 'year') {
            currentYear++;
        }
        calendarMonth.value = currentMonth;
        calendarYear.value = currentYear;
        renderCalendar();
        calendarDetails.innerHTML = '';
    };

    addEventGlobalBtn.onclick = () => {
        selectedDate = `${currentYear}-${(currentMonth+1).toString().padStart(2,'0')}-${currentDay.toString().padStart(2,'0')}`;
        openEventForm(selectedDate);
    };

    function renderCalendar() {
        if (currentViewMode === 'month') renderMonthView();
        else if (currentViewMode === 'week') renderWeekView();
        else if (currentViewMode === 'day') renderDayView();
        else if (currentViewMode === 'year') renderYearView();
    }

    function renderMonthView() {
        const today = new Date();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth+1, 0).getDate();
        let html = `<table class="calendar-table"><tr>`;
        ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d=>html+=`<th>${d}</th>`);
        html += '</tr><tr>';
        for (let i=0; i<firstDay; i++) html+='<td></td>';
        for (let d=1; d<=daysInMonth; d++) {
            let dateStr = `${currentYear}-${(currentMonth+1).toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`;
            let hasEvent = calendarEvents[dateStr] && calendarEvents[dateStr].length > 0;
            html += `<td class="calendar-day${d===today.getDate()&&currentMonth===today.getMonth()&&currentYear===today.getFullYear()?' today':''}${hasEvent?' has-event':''}" data-date="${dateStr}">${d}</td>`;
            if ((firstDay+d)%7===0) html+='</tr><tr>';
        }
        html += '</tr></table>';
        calendarView.innerHTML = html;
        document.querySelectorAll('.calendar-day').forEach(cell => {
            cell.onclick = () => {
                let date = cell.dataset.date;
                selectedDate = date;
                currentDay = parseInt(date.split('-')[2]);
                showDayDetails(date);
            };
        });
    }

    function renderWeekView() {
        let d = new Date(currentYear, currentMonth, currentDay);
        let weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        let html = `<div class="calendar-view-week"><h2>Week of ${weekStart.toLocaleDateString()}</h2><div class="calendar-event-list">`;
        for (let i=0; i<7; i++) {
            let day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);
            let dateStr = `${day.getFullYear()}-${(day.getMonth()+1).toString().padStart(2,'0')}-${day.getDate().toString().padStart(2,'0')}`;
            html += `<div><b>${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i]} ${day.getDate()}</b>`;
            let events = calendarEvents[dateStr] || [];
            if (events.length) {
                events.forEach(ev => {
                    html += `
                        <div class="calendar-event ${ev.type}">
                            <span class="event-type">${ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}</span>
                            ${ev.allday ? '<span class="event-time">All Day</span>' : `<span class="event-time">${ev.time}</span>`}
                            <span class="event-title">${ev.title}</span>
                        </div>
                    `;
                });
            }
            html += `</div>`;
        }
        html += `</div></div>`;
        calendarView.innerHTML = html;
    }

    function renderDayView() {
        let dateStr = `${currentYear}-${(currentMonth+1).toString().padStart(2,'0')}-${currentDay.toString().padStart(2,'0')}`;
        let events = calendarEvents[dateStr] || [];
        let html = `<div class="calendar-view-day"><h2>${dateStr}</h2><div class="calendar-event-list">`;
        if (events.length) {
            events.forEach(ev => {
                html += `
                    <div class="calendar-event ${ev.type}">
                        <span class="event-type">${ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}</span>
                        ${ev.allday ? '<span class="event-time">All Day</span>' : `<span class="event-time">${ev.time}</span>`}
                        <span class="event-title">${ev.title}</span>
                    </div>
                `;
            });
        } else {
            html += `<div style="margin:8px 0;">No events for this day.</div>`;
        }
        html += `</div></div>`;
        calendarView.innerHTML = html;
    }

    function renderYearView() {
        let html = `<div class="calendar-view-year"><h2>${currentYear}</h2><div class="calendar-event-list">`;
        for (let m=0; m<12; m++) {
            html += `<div><b>${calendarMonth.options[m].text}</b>`;
            for (let d=1; d<=31; d++) {
                let dateStr = `${currentYear}-${(m+1).toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`;
                let events = calendarEvents[dateStr] || [];
                if (events.length) {
                    html += `<div style="margin-left:12px;">${d}: `;
                    events.forEach(ev => {
                        html += `
                            <span class="calendar-event ${ev.type}">
                                <span class="event-type">${ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}</span>
                                ${ev.allday ? '<span class="event-time">All Day</span>' : `<span class="event-time">${ev.time}</span>`}
                                <span class="event-title">${ev.title}</span>
                            </span>
                        `;
                    });
                    html += `</div>`;
                }
            }
            html += `</div>`;
        }
        html += `</div></div>`;
        calendarView.innerHTML = html;
    }

    function showDayDetails(date) {
        let events = calendarEvents[date] || [];
        let details = `<b>${date}</b><br>`;
        if (events.length) {
            details += `<div class="calendar-event-list">`;
            events.forEach((ev, idx) => {
                details += `
                    <div class="calendar-event ${ev.type}">
                        <span class="event-type">${ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}</span>
                        ${ev.allday ? '<span class="event-time">All Day</span>' : `<span class="event-time">${ev.time}</span>`}
                        <span class="event-title">${ev.title}</span>
                        ${ev.notifications && ev.notifications.length ? `<span style="margin-left:8px;color:#56ab2f;">🔔 ${ev.notifications.join(', ')}</span>` : ''}
                        <button class="delete-event-btn" data-idx="${idx}" title="Delete">🗑️</button>
                    </div>
                `;
            });
            details += `</div>`;
        } else {
            details += `<div style="margin:8px 0;">No events for this day.</div>`;
        }
        details += `<button id="add-event-btn";">Add Event/Task/Reminder</button>`;
        calendarDetails.innerHTML = details;

        // Delete event
        document.querySelectorAll('.delete-event-btn').forEach(btn => {
            btn.onclick = () => {
                let idx = parseInt(btn.getAttribute('data-idx'));
                calendarEvents[date].splice(idx, 1);
                if (calendarEvents[date].length === 0) delete calendarEvents[date];
                saveCalendarEvents();
                showDayDetails(date);
                renderCalendar();
            };
        });

        // Add event
        document.getElementById('add-event-btn').onclick = () => {
            openEventForm(date);
        };
    }

    function openEventForm(date) {
        eventForm.style.display = '';
        eventTitle.value = '';
        eventType.value = 'event';
        eventAllDay.checked = false;
        eventTime.value = '';
        eventTime.style.display = '';
        editingEventIdx = null;
        renderNotificationInputs([]);
        document.getElementById('calendar-event-form-title').textContent = `Add Event for ${date}`;
        eventForm.scrollIntoView({behavior: "smooth"});
    }

    eventAllDay.onchange = () => {
        eventTime.style.display = eventAllDay.checked ? 'none' : '';
    };

    function renderNotificationInputs(notifications) {
        notificationList.innerHTML = '';
        notifications.forEach((time, idx) => {
            const div = document.createElement('div');
            div.className = 'notification-item';
            div.innerHTML = `
                <input type="time" value="${time}" class="notification-time" />
                <button type="button" class="remove-notification-btn" title="Remove">✖</button>
            `;
            div.querySelector('.remove-notification-btn').onclick = () => {
                notifications.splice(idx, 1);
                renderNotificationInputs(notifications);
            };
            div.querySelector('.notification-time').onchange = (e) => {
                notifications[idx] = e.target.value;
            };
            notificationList.appendChild(div);
        });
        addNotificationBtn.disabled = notifications.length >= 5;
    }
    let currentNotifications = [];
    addNotificationBtn.onclick = () => {
        if (currentNotifications.length < 5) {
            currentNotifications.push('');
            renderNotificationInputs(currentNotifications);
        }
    };

    saveEventBtn.onclick = () => {
        if (!selectedDate) return;
        let title = eventTitle.value.trim();
        let type = eventType.value;
        let allday = eventAllDay.checked;
        let time = allday ? '' : eventTime.value;
        let notifications = [];
        document.querySelectorAll('.notification-time').forEach(input => {
            if (input.value) notifications.push(input.value);
        });
        if (!title || (!allday && !time)) {
            alert('Please enter a title and time (or select All Day).');
            return;
        }
        if (!calendarEvents[selectedDate]) calendarEvents[selectedDate] = [];
        calendarEvents[selectedDate].push({title, type, allday, time, notifications});
        saveCalendarEvents();
        eventForm.style.display = 'none';
        showDayDetails(selectedDate);
        renderCalendar();
        currentNotifications = [];
    };

    cancelEventBtn.onclick = () => {
        eventForm.style.display = 'none';
        currentNotifications = [];
    };

    renderCalendar();

    // --- Flashcards with Decks ---
    const deckNameInput = document.getElementById('flashcard-deck-name');
    const addDeckBtn = document.getElementById('add-flashcard-deck');
    const decksList = document.getElementById('flashcard-decks-list');
    const deckSection = document.getElementById('flashcard-deck-section');
    const currentDeckNameSpan = document.getElementById('current-deck-name');
    const deleteDeckBtn = document.getElementById('delete-flashcard-deck');
    const closeDeckBtn = document.getElementById('close-flashcard-deck');
    const flashcardQuestion = document.getElementById('flashcard-question');
    const flashcardAnswer = document.getElementById('flashcard-answer');
    const addCardBtn = document.getElementById('add-flashcard');
    const deckCardsGrid = document.getElementById('flashcard-deck-cards-grid');
    const reviewSummary = document.getElementById('flashcard-review-summary');

    let flashcardDecks = JSON.parse(localStorage.getItem('flashcardDecks') || '{}');
    let currentDeck = null;

    // Track review state per card in the current deck
    let cardReviewState = []; // [{flipped:bool, answer:null|'correct'|'wrong'}]

    function saveDecks() {
        localStorage.setItem('flashcardDecks', JSON.stringify(flashcardDecks));
    }

    function renderDecks() {
        decksList.innerHTML = '';
        const keys = Object.keys(flashcardDecks);
        if (!keys.length) {
            decksList.innerHTML = '<div class="card" style="margin:10px 0;">No decks yet.</div>';
            return;
        }
        keys.forEach(deck => {
            const deckDiv = document.createElement('div');
            deckDiv.className = 'flashcard-deck-list-item';
            deckDiv.innerHTML = `
                <span class="deck-name">${deck}</span>
                <button class="open-deck-btn">Open</button>
                <button class="delete-deck-btn" title="Delete deck">🗑️</button>
            `;
            deckDiv.querySelector('.open-deck-btn').onclick = () => openDeck(deck);
            deckDiv.querySelector('.delete-deck-btn').onclick = () => {
                if (confirm(`Delete deck "${deck}" and all its cards?`)) {
                    delete flashcardDecks[deck];
                    saveDecks();
                    renderDecks();
                    if (currentDeck === deck) {
                        deckSection.style.display = 'none';
                        currentDeck = null;
                    }
                }
            };
            decksList.appendChild(deckDiv);
        });
    }

    addDeckBtn.onclick = () => {
        const name = deckNameInput.value.trim();
        if (name && !flashcardDecks[name]) {
            flashcardDecks[name] = [];
            saveDecks();
            renderDecks();
            deckNameInput.value = '';
        }
    };

    function openDeck(deck) {
        currentDeck = deck;
        currentDeckNameSpan.textContent = deck;
        deckSection.style.display = '';
        cardReviewState = (flashcardDecks[deck] || []).map(() => ({flipped: false, answer: null}));
        renderDeckCardsGrid();
    }

    closeDeckBtn.onclick = () => {
        deckSection.style.display = 'none';
        currentDeck = null;
    };

    deleteDeckBtn.onclick = () => {
        if (currentDeck && confirm(`Delete deck "${currentDeck}" and all its cards?`)) {
            delete flashcardDecks[currentDeck];
            saveDecks();
            renderDecks();
            deckSection.style.display = 'none';
            currentDeck = null;
        }
    };

    addCardBtn.onclick = () => {
        if (!currentDeck) return;
        const q = flashcardQuestion.value.trim();
        const a = flashcardAnswer.value.trim();
        if (q && a) {
            flashcardDecks[currentDeck].push({q, a});
            saveDecks();
            flashcardQuestion.value = '';
            flashcardAnswer.value = '';
            cardReviewState.push({flipped: false, answer: null});
            renderDeckCardsGrid();
        }
    };

    function renderDeckCardsGrid() {
        const cards = flashcardDecks[currentDeck] || [];
        if (!cards.length) {
            deckCardsGrid.innerHTML = '<div class="card" style="margin:10px 0;">No cards in this deck.</div>';
            reviewSummary.classList.remove('active');
            reviewSummary.innerHTML = '';
            return;
        }
        deckCardsGrid.innerHTML = '';
        cards.forEach((fc, idx) => {
            const state = cardReviewState[idx] || {flipped: false, answer: null};
            // Card container
            const cardContainer = document.createElement('div');
            cardContainer.className = 'flashcard'; // match CSS

            // Card inner
            const cardInner = document.createElement('div');
            cardInner.className = 'flashcard-inner';

            // Front + Back
            cardInner.innerHTML = `
                <div class="front">${fc.q}</div>
                <div class="back">${fc.a}</div>
            `;

            // Flip logic
            cardContainer.onclick = () => {
                state.flipped = !state.flipped;
                cardContainer.classList.toggle('flipped', state.flipped);
                actions.style.visibility = state.flipped ? 'visible' : 'hidden';
            };

            cardContainer.appendChild(cardInner);

            // Actions (always below the card)
            const actions = document.createElement('div');
            actions.className = 'flashcard-grid-actions-below';
            actions.style.visibility = state.flipped ? 'visible' : 'hidden';
            actions.innerHTML = `
                <button class="flashcard-grid-btn correct${state.answer==='correct'?' selected':''}">Correct</button>
                <button class="flashcard-grid-btn wrong${state.answer==='wrong'?' selected':''}">Wrong</button>
                <button class="flashcard-grid-btn delete">🗑️</button>
            `;
            actions.querySelector('.correct').onclick = () => {
                state.answer = 'correct';
                renderDeckCardsGrid();
            };
            actions.querySelector('.wrong').onclick = () => {
                state.answer = 'wrong';
                renderDeckCardsGrid();
            };
            actions.querySelector('.delete').onclick = () => {
                if (confirm('Delete this card?')) {
                    flashcardDecks[currentDeck].splice(idx, 1);
                    cardReviewState.splice(idx, 1);
                    saveDecks();
                    renderDeckCardsGrid();
                }
            };

            cardContainer.appendChild(actions);

            deckCardsGrid.appendChild(cardContainer);
        });
        updateReviewSummary();
    }

    function updateReviewSummary() {
        const cards = flashcardDecks[currentDeck] || [];
        if (!cards.length) {
            reviewSummary.classList.remove('active');
            reviewSummary.innerHTML = '';
            return;
        }
        let correct = 0, wrong = 0, unmarked = 0;
        let toReview = [];
        cardReviewState.forEach((state, idx) => {
            if (state.answer === 'correct') correct++;
            else if (state.answer === 'wrong') {
                wrong++;
                toReview.push(cards[idx].q);
            }
            else unmarked++;
        });
        let percent = Math.round((correct / cards.length) * 100);
        let msg = '';
        if (wrong === 0 && unmarked === 0) {
            msg = `🎉 Great job! You got all cards correct.`;
        } else if (wrong > 0) {
            msg = `🔁 Review recommended for: <b>${toReview.map(q=>`"${q}"`).join(', ')}</b>`;
        } else if (unmarked > 0) {
            msg = `⏳ Mark all cards as correct or wrong to get a review recommendation.`;
        }
        reviewSummary.classList.add('active');
        reviewSummary.innerHTML = `
            <div>Score: <b>${correct}/${cards.length} (${percent}%)</b></div>
            <div>${msg}</div>
        `;
    }

    renderDecks();

    // --- Lo-Fi Music Player ---
    const musicList = [
        "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1",
        "https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1",
        "https://www.youtube.com/embed/7NOSDKb0HlU?autoplay=1"
    ];
    let musicIndex = 0;
    const musicIframe = document.getElementById('music-iframe');
    document.getElementById('play-music').onclick = () => {
        musicIframe.src = musicList[musicIndex];
    };
    document.getElementById('next-music').onclick = () => {
        musicIndex = (musicIndex+1) % musicList.length;
        musicIframe.src = musicList[musicIndex];
    };
    document.getElementById('prev-music').onclick = () => {
        musicIndex = (musicIndex-1+musicList.length) % musicList.length;
        musicIframe.src = musicList[musicIndex];
    };
});

