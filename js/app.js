/**
 * Python OOP & UML Trainer - Master Application Controller
 * Handles Practice Mode, Leitner Spaced Repetition, Exam Simulation,
 * Interactive Diagram Hotspots, Keyboard Shortcuts, and Gamification.
 */
(function() {
  let storage;
  let sfx;
  let diagrams;

  let state = {
    mode: 'practice', // 'practice', 'spaced', 'exam', 'stats'
    filterType: 'all', // 'all', 'errors', 'unseen', 'bookmarks', 'topic:X', 'type:Y'
    currentTopic: 'all',
    currentType: 'all',
    currentTaskIdx: 0,
    filteredTaskIds: [],
    
    // Active task state
    selectedTf: null,
    selectedBugLines: [],
    selectedHotspotId: null,

    // Exam state
    examTasks: [],
    examCurrentIdx: 0,
    examAnswers: {},
    examTimerInterval: null,
    examSecondsLeft: 0,
    examTotalSeconds: 0
  };

  /* ==========================================================================
     CONFRETTI ENGINE (Zero External Dependencies)
     ========================================================================== */
  function fireConfetti() {
    if (!storage.data.settings.animationsEnabled) return;
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#22c55e', '#38bdf8', '#a855f7', '#f59e0b', '#ec4899', '#f8fafc'];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width * 0.5 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 1.2) * 12,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        life: 1.0
      });
    }

    let frame = 0;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.vRot;
        p.life -= 0.016;

        if (p.life > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive && frame < 90) {
        frame++;
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    render();
  }

  /* ==========================================================================
     TASK FILTERING & NAVIGATION
     ========================================================================== */
  function updateFilteredTasks() {
    const all = window.TASK_DATABASE.TASKS;
    const activeTasks = all.filter(t => !storage.isTrash(t.id));

    if (state.filterType === 'errors') {
      state.filteredTaskIds = activeTasks
        .filter(t => {
          const stats = storage.getTaskStats(t.id);
          return stats.incorrect > 0 || (stats.attempts > 0 && stats.box <= 2);
        })
        .map(t => t.id);
    } else if (state.filterType === 'unseen') {
      state.filteredTaskIds = activeTasks
        .filter(t => storage.getTaskStats(t.id).attempts === 0)
        .map(t => t.id);
    } else if (state.filterType === 'bookmarks') {
      state.filteredTaskIds = activeTasks
        .filter(t => storage.isBookmarked(t.id))
        .map(t => t.id);
    } else if (state.filterType === 'spaced') {
      // Sort tasks by Leitner box: Box 1 first, then 2, 3, 4, 5
      state.filteredTaskIds = [...activeTasks]
        .sort((a, b) => {
          const boxA = storage.getTaskStats(a.id).box || 1;
          const boxB = storage.getTaskStats(b.id).box || 1;
          return boxA - boxB;
        })
        .map(t => t.id);
    } else {
      // Standard topic and type filter
      state.filteredTaskIds = activeTasks
        .filter(t => {
          const matchTopic = state.currentTopic === 'all' || t.topic.toString() === state.currentTopic.toString();
          const matchType = state.currentType === 'all' || t.type === state.currentType;
          return matchTopic && matchType;
        })
        .map(t => t.id);
    }

    if (state.currentTaskIdx >= state.filteredTaskIds.length) {
      state.currentTaskIdx = 0;
    }
  }

  function getActiveTask() {
    if (state.filteredTaskIds.length === 0) return null;
    const taskId = state.filteredTaskIds[state.currentTaskIdx];
    return window.TASK_DATABASE.TASKS.find(t => t.id === taskId);
  }

  /* ==========================================================================
     HEADER, STATS & RANK BAR RENDERING
     ========================================================================== */
  function renderHeaderStats() {
    const metrics = storage.getGlobalMetrics(window.TASK_DATABASE.TASKS);
    const rankInfo = storage.getRank();
    const nextRank = storage.getNextRankProgress();

    // XP & Streak
    document.getElementById('xp-counter').textContent = `${storage.data.xp} XP`;
    document.getElementById('streak-counter').textContent = storage.data.streak;
    document.getElementById('user-rank-badge').textContent = `${rankInfo.badge} ${rankInfo.title}`;

    // Trash Count
    const trashBadge = document.getElementById('trash-count-badge');
    if (trashBadge) trashBadge.textContent = storage.data.hidden.length;

    // Progress Bar
    const percentEl = document.getElementById('progress-percent');
    const barEl = document.getElementById('progress-bar-fill');
    const textEl = document.getElementById('progress-text');
    if (percentEl) percentEl.textContent = `${metrics.percent}%`;
    if (barEl) barEl.style.width = `${metrics.percent}%`;
    if (textEl) textEl.textContent = `${metrics.solvedCount} von ${metrics.total} gemeistert`;

    // Audio Icon
    const soundIcon = document.getElementById('sound-icon');
    if (soundIcon) soundIcon.textContent = storage.data.settings.soundEnabled ? '🔊' : '🔇';
  }

  /* ==========================================================================
     MATRIX & TOPIC BUTTONS
     ========================================================================== */
  function renderMatrix() {
    const grid = document.getElementById('matrix-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const allTasks = window.TASK_DATABASE.TASKS;
    const activeTask = getActiveTask();

    allTasks.forEach(task => {
      if (storage.isTrash(task.id)) return;

      const stats = storage.getTaskStats(task.id);
      const isCurrent = activeTask && activeTask.id === task.id;

      const btn = document.createElement('button');
      btn.dataset.id = task.id;
      btn.textContent = task.id;
      btn.className = `matrix-btn h-7 rounded text-[10px] font-mono font-bold flex items-center justify-center border transition `;

      if (stats.attempts === 0) {
        btn.classList.add('bg-slate-900', 'text-slate-400', 'border-slate-800');
      } else if (stats.box >= 2) {
        btn.classList.add('bg-emerald-500/20', 'text-emerald-300', 'border-emerald-500/40');
      } else {
        btn.classList.add('bg-rose-500/20', 'text-rose-300', 'border-rose-500/40');
      }

      if (isCurrent) {
        btn.classList.add('ring-2', 'ring-white', 'scale-110', 'font-black');
      }

      btn.addEventListener('click', () => {
        sfx.playClick();
        state.filterType = 'all';
        state.currentTopic = 'all';
        state.currentType = 'all';
        updateFilterUI();
        updateFilteredTasks();
        state.currentTaskIdx = state.filteredTaskIds.indexOf(task.id);
        renderCurrentTask();
      });

      grid.appendChild(btn);
    });
  }

  function updateFilterUI() {
    // Topics
    document.querySelectorAll('.topic-btn').forEach(btn => {
      const top = btn.dataset.topic;
      const isActive = state.filterType === 'all' && state.currentTopic.toString() === top.toString();
      if (isActive) {
        btn.className = 'topic-btn w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-between';
      } else {
        btn.className = 'topic-btn w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800/80 transition flex items-center justify-between';
      }
    });

    // Special Filter Tabs
    document.querySelectorAll('.special-filter-btn').forEach(btn => {
      const f = btn.dataset.filter;
      const isActive = state.filterType === f;
      if (isActive) {
        btn.classList.add('bg-brand-500', 'text-slate-950', 'font-bold');
        btn.classList.remove('bg-slate-800', 'text-slate-400');
      } else {
        btn.classList.remove('bg-brand-500', 'text-slate-950', 'font-bold');
        btn.classList.add('bg-slate-800', 'text-slate-400');
      }
    });
  }

  /* ==========================================================================
     ACTIVE TASK RENDERER
     ========================================================================== */
  function renderCurrentTask() {
    updateFilteredTasks();
    renderHeaderStats();
    renderMatrix();

    const workspace = document.getElementById('task-workspace');
    const hintBox = document.getElementById('hint-box');
    const feedbackBox = document.getElementById('feedback-box');
    hintBox.classList.add('hidden');
    feedbackBox.classList.add('hidden');

    const task = getActiveTask();
    if (!task) {
      workspace.innerHTML = `
        <div class="text-center py-16 space-y-4">
          <span class="text-5xl">✨</span>
          <h3 class="text-xl font-bold text-white">Keine Aufgaben in diesem Filter</h3>
          <p class="text-xs text-slate-400 max-w-md mx-auto">
            Entweder hast du alle Problemfragen erfolgreich gemeistert oder es liegen keine Aufgaben für die aktuelle Auswahl vor.
          </p>
          <button id="reset-filter-btn" class="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition">
            Alle Filter zurücksetzen
          </button>
        </div>
      `;
      document.getElementById('reset-filter-btn')?.addEventListener('click', () => {
        state.filterType = 'all';
        state.currentTopic = 'all';
        state.currentType = 'all';
        updateFilterUI();
        state.currentTaskIdx = 0;
        renderCurrentTask();
      });
      return;
    }

    // Reset interaction buffers
    state.selectedTf = null;
    state.selectedBugLines = [];
    state.selectedHotspotId = null;

    const stats = storage.getTaskStats(task.id);
    const topicMeta = window.TASK_DATABASE.TOPICS[task.topic] || { title: `Thema ${task.topic}`, icon: "📚" };

    // Update Badges
    document.getElementById('current-task-badge').textContent = `Aufgabe ${task.id} (${state.currentTaskIdx + 1}/${state.filteredTaskIds.length})`;
    document.getElementById('current-topic-badge').textContent = `${topicMeta.icon} ${topicMeta.title}`;
    document.getElementById('current-type-badge').textContent = task.type.toUpperCase();
    
    // Leitner Box Pill
    const boxPill = document.getElementById('task-box-pill');
    boxPill.className = `box-pill box-pill-${stats.box || 1}`;
    boxPill.textContent = `Fach ${stats.box || 1} / 5`;

    // Bookmark icon
    const bookmarkBtn = document.getElementById('bookmark-task-btn');
    bookmarkBtn.textContent = storage.isBookmarked(task.id) ? '⭐' : '☆';

    // Titles & Prompts
    document.getElementById('task-title').textContent = task.title;
    document.getElementById('task-prompt').textContent = task.prompt;
    document.getElementById('hint-text').textContent = task.hint;

    // Interactive Body
    const area = document.getElementById('interactive-area');
    area.innerHTML = '';

    if (task.type === 'tf') {
      area.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-2">
          <button id="tf-true-btn" class="py-4 px-6 rounded-2xl border-2 border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-base flex items-center justify-center gap-3 transition">
            <span class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs">✓</span>
            <span>Wahr (W / 1)</span>
          </button>
          <button id="tf-false-btn" class="py-4 px-6 rounded-2xl border-2 border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-base flex items-center justify-center gap-3 transition">
            <span class="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center text-xs">✗</span>
            <span>Falsch (F / 2)</span>
          </button>
        </div>
      `;
      const tBtn = document.getElementById('tf-true-btn');
      const fBtn = document.getElementById('tf-false-btn');

      const setTf = (val) => {
        sfx.playClick();
        state.selectedTf = val;
        if (val === true) {
          tBtn.className = 'py-4 px-6 rounded-2xl border-2 border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20';
          fBtn.className = 'py-4 px-6 rounded-2xl border-2 border-slate-700 bg-slate-800/80 text-slate-400 font-bold text-base flex items-center justify-center gap-3 opacity-60';
        } else {
          fBtn.className = 'py-4 px-6 rounded-2xl border-2 border-rose-500 bg-rose-500/20 text-rose-300 font-bold text-base flex items-center justify-center gap-3 shadow-lg shadow-rose-500/20';
          tBtn.className = 'py-4 px-6 rounded-2xl border-2 border-slate-700 bg-slate-800/80 text-slate-400 font-bold text-base flex items-center justify-center gap-3 opacity-60';
        }
      };

      tBtn.addEventListener('click', () => setTf(true));
      fBtn.addEventListener('click', () => setTf(false));

    } else if (task.type === 'cloze') {
      let codeHtml = task.codeTemplate;
      Object.keys(task.gaps).forEach(gapKey => {
        const inp = `<input type="text" autocomplete="off" spellcheck="false" data-gap="${gapKey}" class="cloze-input" style="width: ${Math.max(6, task.gaps[gapKey].length + 2)}ch">`;
        codeHtml = codeHtml.replace(`{{${gapKey}}}`, inp);
      });

      area.innerHTML = `
        <div class="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-sm leading-relaxed overflow-x-auto text-slate-200">
          <pre class="whitespace-pre-wrap">${codeHtml}</pre>
        </div>
        <p class="text-xs text-slate-400 mt-2">💡 Tipp: Springe mit der Tab-Taste zur nächsten Lücke und drücke Enter zum Prüfen.</p>
      `;

      const firstInp = area.querySelector('.cloze-input');
      if (firstInp) setTimeout(() => firstInp.focus(), 60);

      area.querySelectorAll('.cloze-input').forEach(inp => {
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') checkAnswer();
        });
      });

    } else if (task.type === 'bughunt') {
      const req = task.bugIndices.length;
      let lines = task.codeLines.map((line, idx) => `
        <div class="bug-line px-3 py-1.5 flex items-center gap-3 font-mono text-xs sm:text-sm" data-line="${idx}">
          <span class="text-slate-600 select-none w-5 text-right font-mono">${idx + 1}</span>
          <span class="text-slate-200 whitespace-pre">${escapeHtml(line)}</span>
        </div>
      `).join('');

      area.innerHTML = `
        <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Klicke auf die Zeilen mit Fehlern:</span>
          <span id="bug-counter-status" class="font-bold text-amber-400">0 von ${req} Zeilen markiert</span>
        </div>
        <div class="rounded-xl bg-slate-950 border border-slate-800 p-2 overflow-x-auto divide-y divide-slate-900/50">
          ${lines}
        </div>
      `;

      area.querySelectorAll('.bug-line').forEach(lineEl => {
        lineEl.addEventListener('click', () => {
          sfx.playClick();
          const lineIdx = parseInt(lineEl.dataset.line, 10);
          if (state.selectedBugLines.includes(lineIdx)) {
            state.selectedBugLines = state.selectedBugLines.filter(i => i !== lineIdx);
            lineEl.classList.remove('selected');
          } else {
            if (state.selectedBugLines.length < req) {
              state.selectedBugLines.push(lineIdx);
              lineEl.classList.add('selected');
            } else {
              const first = state.selectedBugLines.shift();
              area.querySelector(`[data-line="${first}"]`)?.classList.remove('selected');
              state.selectedBugLines.push(lineIdx);
              lineEl.classList.add('selected');
            }
          }
          document.getElementById('bug-counter-status').textContent = `${state.selectedBugLines.length} von ${req} Zeilen markiert`;
        });
      });

    } else if (task.type === 'diagram_click') {
      // Interactive SVG Hotspots
      let svgMarkup = '';
      if (task.diagramType === 'class_diagram') {
        svgMarkup = diagrams.renderClassDiagram(task.diagramConfig);
      } else if (task.diagramType === 'memory_pointer') {
        svgMarkup = diagrams.renderMemoryPointerModel(task.diagramConfig);
      } else if (task.diagramType === 'relationship') {
        svgMarkup = diagrams.renderRelationshipDiagram(task.diagramConfig);
      } else if (task.diagramType === 'use_case') {
        svgMarkup = diagrams.renderUseCaseDiagram(task.diagramConfig);
      }

      area.innerHTML = `
        <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center">
          ${svgMarkup}
        </div>
        <p class="text-xs text-slate-400 mt-2 text-center">👆 Klicke direkt im Diagramm auf das gesuchte Element und drücke auf "Antwort prüfen".</p>
      `;

      area.querySelectorAll('.diagram-hotspot').forEach(el => {
        el.addEventListener('click', () => {
          sfx.playClick();
          area.querySelectorAll('.diagram-hotspot').forEach(h => h.classList.remove('selected'));
          el.classList.add('selected');
          state.selectedHotspotId = el.dataset.hotspotId;
        });
      });

    } else if (task.type === 'write') {
      area.innerHTML = `
        <div class="space-y-3">
          <textarea id="code-writer-textarea" rows="7" spellcheck="false" class="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition">${task.starterCode}</textarea>
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span>Drücke <code>Tab</code> für 4 Leerzeichen.</span>
            <button id="insert-starter-btn" class="text-slate-400 hover:text-white underline">Code zurücksetzen</button>
          </div>
        </div>
      `;

      const textarea = document.getElementById('code-writer-textarea');
      textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = this.selectionStart;
          const end = this.selectionEnd;
          this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
          this.selectionStart = this.selectionEnd = start + 4;
        }
      });

      document.getElementById('insert-starter-btn')?.addEventListener('click', () => {
        textarea.value = task.starterCode;
        textarea.focus();
      });
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ==========================================================================
     ANSWER VALIDATION & CORRECTION
     ========================================================================== */
  function checkAnswer() {
    const task = getActiveTask();
    if (!task) return;

    const feedbackBox = document.getElementById('feedback-box');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackDesc = document.getElementById('feedback-desc');

    let isCorrect = false;
    let feedbackText = "";

    if (task.type === 'tf') {
      if (state.selectedTf === null) {
        alert("Bitte wähle Wahr oder Falsch aus!");
        return;
      }
      isCorrect = (state.selectedTf === task.answer);
      feedbackText = task.explanation;

    } else if (task.type === 'cloze') {
      const inputs = document.querySelectorAll('.cloze-input');
      let allCorrect = true;
      inputs.forEach(inp => {
        const gapKey = inp.dataset.gap;
        const userVal = inp.value.trim().toLowerCase();
        const expected = task.gaps[gapKey].trim().toLowerCase();
        if (userVal === expected) {
          inp.classList.remove('incorrect');
          inp.classList.add('correct');
        } else {
          inp.classList.remove('correct');
          inp.classList.add('incorrect');
          allCorrect = false;
        }
      });
      isCorrect = allCorrect;
      feedbackText = isCorrect ? "Exzellent ausgefüllt! Genau so ist die Syntax." : "Noch nicht ganz richtig. Überprüfe die rot markierten Felder.";

    } else if (task.type === 'bughunt') {
      const selected = [...state.selectedBugLines].sort();
      const expected = [...task.bugIndices].sort();
      if (selected.length === 0) {
        alert("Bitte markiere die Zeilen mit Fehlern.");
        return;
      }
      document.querySelectorAll('.bug-line').forEach(lineEl => {
        const idx = parseInt(lineEl.dataset.line, 10);
        lineEl.classList.remove('correct-bug', 'wrong-pick');
        if (selected.includes(idx)) {
          if (expected.includes(idx)) lineEl.classList.add('correct-bug');
          else lineEl.classList.add('wrong-pick');
        }
      });
      isCorrect = (selected.length === expected.length && selected.every((v, i) => v === expected[i]));
      feedbackText = task.explanation;

    } else if (task.type === 'diagram_click') {
      if (!state.selectedHotspotId) {
        alert("Bitte klicke zuerst auf ein Element im Diagramm!");
        return;
      }
      isCorrect = (state.selectedHotspotId === task.targetHotspotId);
      const clickedEl = document.querySelector(`[data-hotspot-id="${state.selectedHotspotId}"]`);
      if (clickedEl) {
        clickedEl.classList.remove('selected');
        clickedEl.classList.add(isCorrect ? 'correct-hit' : 'wrong-hit');
      }
      feedbackText = task.explanation;

    } else if (task.type === 'write') {
      const textarea = document.getElementById('code-writer-textarea');
      const code = textarea.value.trim();
      const missing = task.expectedKeywords.filter(kw => !code.toLowerCase().includes(kw.toLowerCase()));
      isCorrect = (missing.length === 0);
      if (isCorrect) {
        feedbackText = `Großartig! Alle wesentlichen Sprachbausteine wurden korrekt umgesetzt.\n\nMusterlösung:\n${task.solutionCode}`;
      } else {
        feedbackText = `Dein Code erfüllt noch nicht alle Kriterien. Es fehlt z. B.: '${missing[0]}'. Klicke auf 'Musterlösung' für den exakten Vergleich.`;
      }
    }

    // Record to storage
    const oldRank = storage.getRank().title;
    const res = storage.recordResult(task.id, isCorrect);
    const newRank = storage.getRank().title;

    feedbackBox.classList.remove('hidden', 'bg-emerald-500/10', 'border-emerald-500/30', 'text-emerald-200', 'bg-rose-500/10', 'border-rose-500/30', 'text-rose-200');

    if (isCorrect) {
      sfx.playCorrect();
      fireConfetti();
      if (newRank !== oldRank) {
        setTimeout(() => sfx.playLevelUp(), 300);
      }
      feedbackBox.classList.add('bg-emerald-500/10', 'border-emerald-500/30', 'text-emerald-200');
      feedbackTitle.innerHTML = `<span class="text-emerald-400 text-lg">✓</span> <span>Richtig gelöst! (+${res.xpEarned} XP) • Wandert in Fach ${res.stats.box}</span>`;
      feedbackDesc.innerHTML = `<p>${escapeHtml(feedbackText)}</p>`;
    } else {
      sfx.playIncorrect();
      // Screen shake
      if (storage.data.settings.animationsEnabled) {
        document.getElementById('task-workspace')?.classList.add('shake');
        setTimeout(() => document.getElementById('task-workspace')?.classList.remove('shake'), 400);
      }
      feedbackBox.classList.add('bg-rose-500/10', 'border-rose-500/30', 'text-rose-200');
      feedbackTitle.innerHTML = `<span class="text-rose-400 text-lg">✗</span> <span>Leider noch nicht korrekt • Zurück in Fach 1</span>`;
      feedbackDesc.innerHTML = `<p>${escapeHtml(feedbackText)}</p>`;
    }

    renderHeaderStats();
    renderMatrix();
  }

  /* ==========================================================================
     SPACED REPETITION (KARTEIKASTEN) DASHBOARD
     ========================================================================== */
  function renderSpacedDashboard() {
    const container = document.getElementById('spaced-boxes-container');
    if (!container) return;
    const metrics = storage.getGlobalMetrics(window.TASK_DATABASE.TASKS);
    container.innerHTML = '';

    const boxLabels = [
      { box: 1, name: "Fach 1: Neu & Problemfälle", desc: "Wird am häufigsten wiederholt", color: "border-rose-500/40 bg-rose-500/10 text-rose-300" },
      { box: 2, name: "Fach 2: Einmal gewusst", desc: "Wiederholung in 2 Tagen", color: "border-amber-500/40 bg-amber-500/10 text-amber-300" },
      { box: 3, name: "Fach 3: Sicher", desc: "Wiederholung in 4 Tagen", color: "border-blue-500/40 bg-blue-500/10 text-blue-300" },
      { box: 4, name: "Fach 4: Sehr sicher", desc: "Wiederholung in 7 Tagen", color: "border-purple-500/40 bg-purple-500/10 text-purple-300" },
      { box: 5, name: "Fach 5: Gemeistert!", desc: "Klausurfest im Langzeitgedächtnis", color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" }
    ];

    boxLabels.forEach(item => {
      const count = metrics.boxCounts[item.box] || 0;
      const card = document.createElement('div');
      card.className = `p-4 rounded-2xl border ${item.color} flex items-center justify-between transition hover:scale-[1.02] cursor-pointer`;
      card.innerHTML = `
        <div>
          <h4 class="font-bold text-sm text-white">${item.name}</h4>
          <p class="text-xs opacity-75 mt-0.5">${item.desc}</p>
        </div>
        <div class="text-right">
          <span class="text-2xl font-black font-mono">${count}</span>
          <span class="text-[10px] block opacity-75">Karten</span>
        </div>
      `;
      card.addEventListener('click', () => {
        sfx.playClick();
        state.filterType = 'spaced';
        document.getElementById('nav-mode-practice').click();
      });
      container.appendChild(card);
    });
  }

  /* ==========================================================================
     STATISTICS DASHBOARD
     ========================================================================== */
  function renderStatsDashboard() {
    const metrics = storage.getGlobalMetrics(window.TASK_DATABASE.TASKS);
    document.getElementById('stats-total-xp').textContent = `${storage.data.xp} XP`;
    document.getElementById('stats-streak').textContent = `${storage.data.bestStreak} (Aktuell: ${storage.data.streak})`;
    document.getElementById('stats-solved-count').textContent = `${metrics.solvedCount} / ${metrics.total}`;
    document.getElementById('stats-accuracy-rate').textContent = `${metrics.percent}%`;

    // Topic breakdown
    const topicContainer = document.getElementById('stats-topic-list');
    topicContainer.innerHTML = '';
    Object.keys(metrics.topicMetrics).forEach(topId => {
      const m = metrics.topicMetrics[topId];
      const topMeta = window.TASK_DATABASE.TOPICS[topId] || { title: `Thema ${topId}`, icon: "📚" };
      const percent = m.total > 0 ? Math.round((m.solved / m.total) * 100) : 0;

      const row = document.createElement('div');
      row.className = 'p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5';
      row.innerHTML = `
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-slate-200">${topMeta.icon} ${topMeta.title}</span>
          <span class="font-mono text-slate-400">${m.solved} / ${m.total} (${percent}%)</span>
        </div>
        <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div class="h-2 rounded-full ${percent >= 70 ? 'bg-emerald-500' : percent >= 40 ? 'bg-amber-500' : 'bg-rose-500'}" style="width: ${percent}%"></div>
        </div>
      `;
      topicContainer.appendChild(row);
    });
  }

  /* ==========================================================================
     EXAM SIMULATION LOGIC
     ========================================================================== */
  function startExam() {
    const all = window.TASK_DATABASE.TASKS.filter(t => !storage.isTrash(t.id));
    const sizeRadio = document.querySelector('input[name="exam-size"]:checked');
    const count = parseInt(sizeRadio ? sizeRadio.value : "25", 10);
    const examCount = Math.min(count, all.length);

    const minutesMap = { 15: 20, 25: 45, 40: 75 };
    const minutes = minutesMap[examCount] || 45;

    const shuffled = [...all].sort(() => 0.5 - Math.random());
    state.examTasks = shuffled.slice(0, examCount);
    state.examCurrentIdx = 0;
    state.examAnswers = {};
    state.examTotalSeconds = minutes * 60;
    state.examSecondsLeft = minutes * 60;

    document.getElementById('exam-setup-card').classList.add('hidden');
    document.getElementById('exam-result-card').classList.add('hidden');
    document.getElementById('exam-active-card').classList.remove('hidden');

    clearInterval(state.examTimerInterval);
    updateExamTimer();
    state.examTimerInterval = setInterval(() => {
      state.examSecondsLeft--;
      updateExamTimer();
      if (state.examSecondsLeft <= 0) {
        clearInterval(state.examTimerInterval);
        finishExam();
      }
    }, 1000);

    renderExamTask();
  }

  function updateExamTimer() {
    const mins = Math.floor(state.examSecondsLeft / 60);
    const secs = state.examSecondsLeft % 60;
    const el = document.getElementById('exam-timer');
    el.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function renderExamTask() {
    const task = state.examTasks[state.examCurrentIdx];
    const total = state.examTasks.length;
    document.getElementById('exam-question-progress').textContent = `Frage ${state.examCurrentIdx + 1} von ${total}`;

    const container = document.getElementById('exam-task-box');
    container.innerHTML = `
      <div>
        <span class="px-2.5 py-0.5 rounded bg-slate-800 text-[11px] font-bold text-slate-300">
          Thema ${task.topic}
        </span>
        <h2 class="text-lg font-bold text-white mt-1">${escapeHtml(task.title)}</h2>
        <p class="text-sm text-slate-300 mt-2">${escapeHtml(task.prompt)}</p>
      </div>
      <div id="exam-interactive-slot" class="pt-4 border-t border-slate-800"></div>
    `;

    const slot = document.getElementById('exam-interactive-slot');
    const saved = state.examAnswers[state.examCurrentIdx];

    if (task.type === 'tf') {
      slot.innerHTML = `
        <div class="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <button id="exam-tf-t" class="py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 text-white font-bold text-sm">Wahr</button>
          <button id="exam-tf-f" class="py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 text-white font-bold text-sm">Falsch</button>
        </div>
      `;
      const tBtn = document.getElementById('exam-tf-t');
      const fBtn = document.getElementById('exam-tf-f');

      const setTf = (val) => {
        state.examAnswers[state.examCurrentIdx] = val;
        if (val === true) {
          tBtn.className = 'py-3 px-4 rounded-xl border-2 border-brand-500 bg-brand-500/20 text-brand-300 font-bold text-sm';
          fBtn.className = 'py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 font-bold text-sm';
        } else {
          fBtn.className = 'py-3 px-4 rounded-xl border-2 border-rose-500 bg-rose-500/20 text-rose-300 font-bold text-sm';
          tBtn.className = 'py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 font-bold text-sm';
        }
      };
      if (saved !== undefined) setTf(saved);
      tBtn.addEventListener('click', () => setTf(true));
      fBtn.addEventListener('click', () => setTf(false));

    } else if (task.type === 'cloze') {
      let html = task.codeTemplate;
      Object.keys(task.gaps).forEach(gapKey => {
        const val = (saved && saved[gapKey]) || '';
        const inp = `<input type="text" data-gap="${gapKey}" value="${val}" class="exam-cloze-input cloze-input" style="width: ${Math.max(6, task.gaps[gapKey].length + 2)}ch">`;
        html = html.replace(`{{${gapKey}}}`, inp);
      });
      slot.innerHTML = `<div class="rounded-xl bg-slate-950 p-4 font-mono text-sm text-slate-200"><pre class="whitespace-pre-wrap">${html}</pre></div>`;
      slot.querySelectorAll('.exam-cloze-input').forEach(inp => {
        inp.addEventListener('input', () => {
          if (!state.examAnswers[state.examCurrentIdx]) state.examAnswers[state.examCurrentIdx] = {};
          state.examAnswers[state.examCurrentIdx][inp.dataset.gap] = inp.value.trim();
        });
      });
    } else {
      // General fallback
      slot.innerHTML = `<p class="text-xs text-slate-400 italic">Beantworte diese Frage gedanklich oder in deiner IDE.</p>`;
    }
  }

  function finishExam() {
    clearInterval(state.examTimerInterval);
    let correct = 0;
    state.examTasks.forEach((task, idx) => {
      const ans = state.examAnswers[idx];
      let isC = false;
      if (task.type === 'tf') isC = (ans === task.answer);
      else if (task.type === 'cloze' && ans) {
        isC = Object.keys(task.gaps).every(k => (ans[k] || '').toLowerCase() === task.gaps[k].toLowerCase());
      }
      if (isC) {
        correct++;
        storage.recordResult(task.id, true);
      }
    });

    const total = state.examTasks.length;
    const percent = Math.round((correct / total) * 100);

    let grade = "5,0 (Mangelhaft)";
    let badgeClass = "bg-rose-500/20 text-rose-400 border border-rose-500/40";
    if (percent >= 92) { grade = "Note 1,0 (Sehr gut)"; badgeClass = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"; }
    else if (percent >= 81) { grade = "Note 2,0 (Gut)"; badgeClass = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"; }
    else if (percent >= 67) { grade = "Note 3,0 (Befriedigend)"; badgeClass = "bg-blue-500/20 text-blue-400 border border-blue-500/40"; }
    else if (percent >= 50) { grade = "Note 4,0 (Ausreichend)"; badgeClass = "bg-amber-500/20 text-amber-400 border border-amber-500/40"; }

    document.getElementById('exam-active-card').classList.add('hidden');
    document.getElementById('exam-result-card').classList.remove('hidden');

    const badge = document.getElementById('exam-grade-badge');
    badge.textContent = grade;
    badge.className = `inline-block px-6 py-3 rounded-2xl text-2xl font-black mb-2 shadow-2xl ${badgeClass}`;
    document.getElementById('exam-summary-text').textContent = `Du hast ${correct} von ${total} Aufgaben richtig gelöst (${percent}%).`;
  }

  /* ==========================================================================
     INITIALIZATION & EVENT BINDINGS
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    storage = new window.TrainerStorage();
    sfx = new window.SoundEngine(storage);
    diagrams = new window.DiagramEngine();

    updateFilterUI();
    renderCurrentTask();

    // Navigation Tabs
    const views = {
      practice: document.getElementById('practice-view'),
      spaced: document.getElementById('spaced-view'),
      exam: document.getElementById('exam-view'),
      stats: document.getElementById('stats-view')
    };

    const navBtns = {
      practice: document.getElementById('nav-mode-practice'),
      spaced: document.getElementById('nav-mode-spaced'),
      exam: document.getElementById('nav-mode-exam'),
      stats: document.getElementById('nav-mode-stats')
    };

    function switchView(targetMode) {
      sfx.playClick();
      state.mode = targetMode;
      Object.keys(views).forEach(m => {
        if (views[m]) views[m].classList.toggle('hidden', m !== targetMode);
      });
      Object.keys(navBtns).forEach(m => {
        if (navBtns[m]) {
          if (m === targetMode) {
            navBtns[m].className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-500 text-slate-950 shadow';
          } else {
            navBtns[m].className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition';
          }
        }
      });

      if (targetMode === 'practice') renderCurrentTask();
      if (targetMode === 'spaced') renderSpacedDashboard();
      if (targetMode === 'stats') renderStatsDashboard();
    }

    Object.keys(navBtns).forEach(m => {
      navBtns[m]?.addEventListener('click', () => switchView(m));
    });

    // Special Filter Buttons (Errors, Unseen, Bookmarks)
    document.querySelectorAll('.special-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sfx.playClick();
        state.filterType = btn.dataset.filter;
        state.currentTaskIdx = 0;
        updateFilterUI();
        renderCurrentTask();
      });
    });

    // Topic Filters
    document.querySelectorAll('.topic-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sfx.playClick();
        state.filterType = 'all';
        state.currentTopic = btn.dataset.topic;
        state.currentTaskIdx = 0;
        updateFilterUI();
        renderCurrentTask();
      });
    });

    // Bookmark Toggle
    document.getElementById('bookmark-task-btn')?.addEventListener('click', () => {
      const task = getActiveTask();
      if (!task) return;
      sfx.playClick();
      const isBookmarked = storage.toggleBookmark(task.id);
      document.getElementById('bookmark-task-btn').textContent = isBookmarked ? '⭐' : '☆';
    });

    // Previous / Next Buttons
    document.getElementById('prev-btn')?.addEventListener('click', () => {
      sfx.playClick();
      if (state.currentTaskIdx > 0) {
        state.currentTaskIdx--;
        renderCurrentTask();
      }
    });

    document.getElementById('next-btn')?.addEventListener('click', () => {
      sfx.playClick();
      if (state.currentTaskIdx < state.filteredTaskIds.length - 1) {
        state.currentTaskIdx++;
        renderCurrentTask();
      }
    });

    // Check Answer
    document.getElementById('check-btn')?.addEventListener('click', checkAnswer);

    // Hint & Solution
    document.getElementById('hint-btn')?.addEventListener('click', () => {
      sfx.playClick();
      document.getElementById('hint-box')?.classList.toggle('hidden');
    });

    document.getElementById('solution-btn')?.addEventListener('click', () => {
      sfx.playClick();
      const task = getActiveTask();
      if (!task) return;
      const box = document.getElementById('feedback-box');
      const title = document.getElementById('feedback-title');
      const desc = document.getElementById('feedback-desc');

      box.classList.remove('hidden', 'bg-emerald-500/10', 'border-emerald-500/30', 'text-emerald-200', 'bg-rose-500/10', 'border-rose-500/30', 'text-rose-200');
      box.classList.add('bg-slate-800', 'border-slate-700', 'text-slate-200');
      title.innerHTML = `<span class="text-sky-400">📖</span> <span>Musterlösung & Erklärung:</span>`;
      
      let html = `<p>${escapeHtml(task.explanation)}</p>`;
      if (task.solutionCode) {
        html = `<pre class="bg-slate-950 p-2.5 rounded font-mono text-xs text-brand-300 border border-slate-800 mb-2">${escapeHtml(task.solutionCode)}</pre>` + html;
      }
      desc.innerHTML = html;
    });

    // Trash Button (Hide Current)
    document.getElementById('hide-current-btn')?.addEventListener('click', () => {
      const task = getActiveTask();
      if (!task) return;
      sfx.playClick();
      storage.toggleTrash(task.id);
      renderCurrentTask();
    });

    // Sound Toggle
    document.getElementById('sound-btn')?.addEventListener('click', () => {
      storage.data.settings.soundEnabled = !storage.data.settings.soundEnabled;
      storage.save();
      document.getElementById('sound-icon').textContent = storage.data.settings.soundEnabled ? '🔊' : '🔇';
      if (storage.data.settings.soundEnabled) sfx.playClick();
    });

    // Settings Modal
    const settingsModal = document.getElementById('settings-modal');
    document.getElementById('settings-btn')?.addEventListener('click', () => {
      sfx.playClick();
      settingsModal?.classList.remove('hidden');
    });
    document.getElementById('close-settings-modal')?.addEventListener('click', () => {
      settingsModal?.classList.add('hidden');
    });

    // JSON Export / Import
    document.getElementById('export-json-btn')?.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(storage.exportJSON());
      const a = document.createElement('a');
      a.href = dataStr;
      a.download = `oop_trainer_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    });

    document.getElementById('import-json-btn')?.addEventListener('click', () => {
      const raw = prompt("Füge hier den JSON-Inhalt deiner Sicherung ein:");
      if (raw && storage.importJSON(raw)) {
        alert("Daten erfolgreich wiederhergestellt!");
        renderHeaderStats();
        renderCurrentTask();
      }
    });

    // Exam Events
    document.getElementById('start-exam-btn')?.addEventListener('click', startExam);
    document.getElementById('finish-exam-btn')?.addEventListener('click', finishExam);
    document.getElementById('exam-prev-btn')?.addEventListener('click', () => {
      if (state.examCurrentIdx > 0) {
        state.examCurrentIdx--;
        renderExamTask();
      }
    });
    document.getElementById('exam-next-btn')?.addEventListener('click', () => {
      if (state.examCurrentIdx < state.examTasks.length - 1) {
        state.examCurrentIdx++;
        renderExamTask();
      }
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (state.mode === 'practice') {
        if (e.target.tagName === 'TEXTAREA' || (e.target.tagName === 'INPUT' && e.key !== 'Enter')) return;
        if (e.key === 'Enter') checkAnswer();
        else if (e.key === 't' || e.key === 'T') document.getElementById('hint-btn')?.click();
        else if (e.key === 'l' || e.key === 'L') document.getElementById('solution-btn')?.click();
        else if (e.key === 'w' || e.key === 'W' || e.key === '1') document.getElementById('tf-true-btn')?.click();
        else if (e.key === 'f' || e.key === 'F' || e.key === '2') document.getElementById('tf-false-btn')?.click();
        else if (e.key === 'ArrowRight' && e.altKey) document.getElementById('next-btn')?.click();
        else if (e.key === 'ArrowLeft' && e.altKey) document.getElementById('prev-btn')?.click();
      }
    });
  });
})();
