/* ── STATE ── */
  let tasks = JSON.parse(localStorage.getItem('taskr-tasks') || '[]');
  let filter = 'all';

  /* ── INIT ── */
  const dateLabel = document.getElementById('date-label');
  dateLabel.textContent = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  /* ── SAVE ── */
  function save() {
    localStorage.setItem('taskr-tasks', JSON.stringify(tasks));
  }

  /* ── ADD TASK ── */
  function addTask() {
    const input = document.getElementById('add-input');
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    const priority = document.getElementById('priority-select').value;
    tasks.unshift({ id: Date.now(), text, done: false, priority });
    save(); render(); input.value = ''; input.focus();
  }

  document.getElementById('add-btn').addEventListener('click', addTask);
  document.getElementById('add-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });

  /* ── TOGGLE ── */
  function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    save(); render();
  }

  /* ── DELETE ── */
  function deleteTask(id) {
    const el = document.querySelector(`[data-id="${id}"]`);
    if (el) {
      el.classList.add('removing');
      setTimeout(() => {
        tasks = tasks.filter(t => t.id !== id);
        save(); render();
      }, 280);
    }
  }

  /* ── EDIT ── */
  function startEdit(id) {
    const el = document.querySelector(`[data-id="${id}"]`);
    const textEl = el.querySelector('.task-text');
    const editEl = el.querySelector('.task-edit');
    textEl.classList.add('hidden');
    editEl.classList.add('active');
    editEl.focus();
    editEl.onblur = () => finishEdit(id);
    editEl.onkeydown = e => { if (e.key === 'Enter') editEl.blur(); };
  }

  function finishEdit(id) {
    const el = document.querySelector(`[data-id="${id}"]`);
    if (!el) return;
    const editEl = el.querySelector('.task-edit');
    const val = editEl.value.trim();
    if (val) {
      tasks = tasks.map(t => t.id === id ? { ...t, text: val } : t);
      save();
    }
    render();
  }

  /* ── FILTER ── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });

  /* ── CLEAR DONE ── */
  document.getElementById('clear-done-btn').addEventListener('click', () => {
    tasks = tasks.filter(t => !t.done);
    save(); render();
  });

  /* ── RENDER ── */
  function render() {
    const list = document.getElementById('task-list');
    const total = tasks.length;
    const done  = tasks.filter(t => t.done).length;

    // count badge
    document.getElementById('task-count').textContent =
      `${total - done} remaining`;

    // progress
    const wrap = document.getElementById('progress-wrap');
    if (total > 0) {
      const pct = Math.round((done / total) * 100);
      wrap.style.display = 'block';
      document.getElementById('progress-fill').style.width = pct + '%';
      document.getElementById('progress-pct').textContent = pct + '%';
    } else {
      wrap.style.display = 'none';
    }

    // filter tasks
    let visible = tasks;
    if (filter === 'active') visible = tasks.filter(t => !t.done);
    else if (filter === 'done') visible = tasks.filter(t => t.done);
    else if (filter === 'high') visible = tasks.filter(t => t.priority === 'high');

    document.getElementById('list-label').textContent =
      `${visible.length} task${visible.length !== 1 ? 's' : ''}`;

    // render items
    if (visible.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">✦</span>
          <p>${filter === 'all' ? 'No tasks yet. Add one above!' :
             filter === 'done' ? 'Nothing completed yet.' :
             filter === 'high' ? 'No high priority tasks.' :
             'All done! Great work.'}</p>
        </div>`;
      return;
    }

    list.innerHTML = visible.map(t => `
      <div class="task-item ${t.done ? 'done' : ''}" data-id="${t.id}">
        <div class="task-check ${t.done ? 'checked' : ''}"
          onclick="toggleTask(${t.id})"></div>
        <div class="task-body" ondblclick="startEdit(${t.id})">
          <span class="task-text">${escHtml(t.text)}</span>
          <input class="task-edit" value="${escHtml(t.text)}" maxlength="120"/>
        </div>
        <div class="priority-dot p-${t.priority}" title="${t.priority} priority"></div>
        <button class="delete-btn" onclick="deleteTask(${t.id})" title="Delete">✕</button>
      </div>
    `).join('');
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  render();
