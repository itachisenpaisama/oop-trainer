/**
 * Python OOP & UML Trainer - Master Application Controller (v3.2.0)
 * Masterclass Architecture: Centered ergonomic stage, matrix drawer modal,
 * tactile controls, instant feedback, Leitner 5-box algorithm, and IHK simulator.
 */
(function() {
  let storage;
  let sfx;
  let diagrams;

  let state = {
    mode: 'practice', // 'practice', 'spaced', 'exam', 'stats'
    filterType: 'all', // 'all', 'errors', 'bookmarks', 'spaced'
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
     MODAL CONTROLLER (Bulletproof helper)
     ========================================================================== */
  function openModal(modalEl) {
    if (!modalEl) return;
    sfx?.playClick();
    modalEl.classList.remove('hidden');
    modalEl.style.display = 'flex';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('hidden');
    modalEl.style.display = 'none';
  }

  /* ==========================================================================
     CONFETTI PARTICLE BURST
     ========================================================================== */
  function fireConfetti() {
    if (!storage?.data?.settings?.animationsEnabled) return;
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#10b981', '#38bdf8', '#a855f7', '#f59e0b', '#ec4899', '#f8fafc'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.width * 0.5 + (Math.random() - 0.5) * 160,
        y: canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 1.2) * 11,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 8,
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
        p.vy += 0.35;
        p.rotation += p.vRot;
        p.life -= 0.018;

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

      if (alive && frame < 75) {
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
          return stats.incorrect > 0 || (stats.attempts > 0 && stats.box === 1);
        })
        .map(t => t.id);
    } else if (state.filterType === 'bookmarks') {
      state.filteredTaskIds = activeTasks
        .filter(t => storage.isBookmarked(t.id))
        .map(t => t.id);
    } else if (state.filterType === 'spaced') {
      state.filteredTaskIds = [...activeTasks]
        .sort((a, b) => {
          const boxA = storage.getTaskStats(a.id).box || 1;
          const boxB = storage.getTaskStats(b.id).box || 1;
          return boxA - boxB;
        })
        .map(t => t.id);
    } else {
      // 'all' - filter by selected topic and type
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
     STATS & UI BADGE UPDATES
     ========================================================================== */
  function renderHeaderStats() {
    const allTasks = window.TASK_DATABASE.TASKS;
    const metrics = storage.getGlobalMetrics(allTasks);
    const rankInfo = storage.getRank();

    // Top Header
    const xpEl = document.getElementById('xp-counter');
    if (xpEl) xpEl.textContent = `${storage.data.xp} XP`;

    const streakEl = document.getElementById('streak-counter');
    if (streakEl) streakEl.textContent = storage.data.streak;

    const rankBadgeEl = document.getElementById('user-rank-badge');
    if (rankBadgeEl) rankBadgeEl.textContent = `${rankInfo.badge} ${rankInfo.title}`;

    // Header Progress Bar
    const barEl = document.getElementById('progress-bar-fill');
    if (barEl) barEl.style.width = `${metrics.percent}%`;

    const progTextEl = document.getElementById('progress-text');
    if (progTextEl) progTextEl.textContent = `${metrics.solvedCount} / ${metrics.total} gemeistert (${metrics.percent}%)`;

    // Filter badges count
    const errorCountEl = document.getElementById('filter-error-count');
    if (errorCountEl) errorCountEl.textContent = metrics.errorCount;

    const bookmarkCount = allTasks.filter(t => storage.isBookmarked(t.id)).length;
    const bookmarkCountEl = document.getElementById('filter-bookmark-count');
    if (bookmarkCountEl) bookmarkCountEl.textContent = bookmarkCount;

    // Sound Icon
    const soundIconEl = document.getElementById('sound-icon');
    if (soundIconEl) {
      if (storage.data.settings.soundEnabled) {
        soundIconEl.innerHTML = `<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
      } else {
        soundIconEl.innerHTML = `<svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      }
    }
  }

  function renderMatrix() {
    const grid = document.getElementById('matrix-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const allTasks = window.TASK_DATABASE.TASKS;
    const activeTask = getActiveTask();
    const matrixModal = document.getElementById('matrix-modal');

    allTasks.forEach(task => {
      if (storage.isTrash(task.id)) return;

      const stats = storage.getTaskStats(task.id);
      const isCurrent = activeTask && activeTask.id === task.id;

      const btn = document.createElement('button');
      btn.textContent = task.id;
      btn.dataset.id = task.id;
      btn.className = `btn-tactile h-8 rounded-lg text-xs font-mono font-bold flex items-center justify-center border transition `;

      if (stats.attempts === 0) {
        btn.classList.add('bg-slate-900', 'text-slate-400', 'border-slate-800');
      } else if (stats.box >= 2) {
        btn.classList.add('bg-emerald-500/20', 'text-emerald-300', 'border-emerald-500/40');
      } else {
        btn.classList.add('bg-rose-500/20', 'text-rose-300', 'border-rose-500/40');
      }

      if (isCurrent) {
        btn.classList.add('ring-2', 'ring-emerald-400', 'bg-emerald-500', 'text-slate-950', 'scale-105', 'font-black');
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
        closeModal(matrixModal);
      });

      grid.appendChild(btn);
    });
  }

  function updateFilterUI() {
    // Quick filter pills
    document.querySelectorAll('.special-filter-btn').forEach(btn => {
      const f = btn.dataset.filter;
      const isActive = state.filterType === f;
      if (isActive) {
        btn.className = 'special-filter-btn px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 transition text-center shadow font-semibold';
      } else {
        btn.className = 'special-filter-btn px-3 py-1 rounded-lg text-slate-400 hover:text-white transition text-center font-semibold';
      }
    });

    // Horizontal Topic list
    document.querySelectorAll('.topic-btn').forEach(btn => {
      const top = btn.dataset.topic;
      const isActive = state.filterType === 'all' && state.currentTopic.toString() === top.toString();
      if (isActive) {
        btn.className = 'topic-btn whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 transition shadow-sm';
      } else {
        btn.className = 'topic-btn whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition border border-transparent';
      }
    });
  }

  /* ==========================================================================
     ACTIVE TASK RENDERER (ZERO DOM DESTRUCTION)
     ========================================================================== */
  function renderCurrentTask() {
    updateFilteredTasks();
    renderHeaderStats();
    renderMatrix();

    const activeContainer = document.getElementById('task-active-container');
    const emptyContainer = document.getElementById('task-empty-container');
    const hintBox = document.getElementById('hint-box');
    const feedbackBox = document.getElementById('feedback-box');

    if (hintBox) hintBox.classList.add('hidden');
    if (feedbackBox) feedbackBox.classList.add('hidden');

    const task = getActiveTask();
    if (!task) {
      // Toggle views gracefully without overwriting HTML!
      if (activeContainer) activeContainer.classList.add('hidden');
      if (emptyContainer) emptyContainer.classList.remove('hidden');
      return;
    }

    if (activeContainer) activeContainer.classList.remove('hidden');
    if (emptyContainer) emptyContainer.classList.add('hidden');

    // Reset temporary interaction selections
    state.selectedTf = null;
    state.selectedBugLines = [];
    state.selectedHotspotId = null;

    const stats = storage.getTaskStats(task.id);
    const topicMeta = window.TASK_DATABASE.TOPICS[task.topic] || { title: `Thema ${task.topic}`, icon: "📚" };

    // Badges
    const badgeTaskEl = document.getElementById('current-task-badge');
    if (badgeTaskEl) badgeTaskEl.textContent = `Aufgabe ${task.id} (${state.currentTaskIdx + 1}/${state.filteredTaskIds.length})`;

    const badgeTopicEl = document.getElementById('current-topic-badge');
    if (badgeTopicEl) badgeTopicEl.textContent = `${topicMeta.icon} ${topicMeta.title}`;

    const badgeTypeEl = document.getElementById('current-type-badge');
    if (badgeTypeEl) badgeTypeEl.textContent = task.type.toUpperCase();

    // Box Pill
    const boxPill = document.getElementById('task-box-pill');
    if (boxPill) {
      boxPill.className = `box-pill box-pill-${stats.box || 1}`;
      boxPill.textContent = `Fach ${stats.box || 1} / 5`;
    }

    // Bookmark Star
    const bookmarkBtn = document.getElementById('bookmark-task-btn');
    const bookmarkStarIcon = document.getElementById('bookmark-star-icon');
    if (bookmarkStarIcon) {
      if (storage.isBookmarked(task.id)) {
        bookmarkStarIcon.setAttribute('fill', '#f59e0b');
        bookmarkStarIcon.setAttribute('stroke', '#f59e0b');
        bookmarkBtn.className = 'p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 transition';
      } else {
        bookmarkStarIcon.setAttribute('fill', 'none');
        bookmarkStarIcon.setAttribute('stroke', 'currentColor');
        bookmarkBtn.className = 'p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition';
      }
    }

    // Title & Prompt
    document.getElementById('task-title').textContent = task.title;
    document.getElementById('task-prompt').textContent = task.prompt;
    document.getElementById('hint-text').textContent = task.hint;

    // Interactive Area
    const area = document.getElementById('interactive-area');
    area.innerHTML = '';

    if (task.type === 'tf') {
      area.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto py-2">
          <button id="tf-true-btn" class="btn-tactile py-3.5 px-4 rounded-xl border-2 border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-3 transition">
            <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Wahr</span> <span class="kbd-cap">W / 1</span>
          </button>
          <button id="tf-false-btn" class="btn-tactile py-3.5 px-4 rounded-xl border-2 border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-3 transition">
            <svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            <span>Falsch</span> <span class="kbd-cap">F / 2</span>
          </button>
        </div>
      `;
      const tBtn = document.getElementById('tf-true-btn');
      const fBtn = document.getElementById('tf-false-btn');

      const setTf = (val) => {
        sfx.playClick();
        state.selectedTf = val;
        if (val === true) {
          tBtn.className = 'btn-tactile py-3.5 px-4 rounded-xl border-2 border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold text-sm flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20';
          fBtn.className = 'btn-tactile py-3.5 px-4 rounded-xl border-2 border-slate-800 bg-slate-900 text-slate-400 font-bold text-sm flex items-center justify-center gap-3 opacity-60';
        } else {
          fBtn.className = 'btn-tactile py-3.5 px-4 rounded-xl border-2 border-rose-500 bg-rose-500/20 text-rose-300 font-bold text-sm flex items-center justify-center gap-3 shadow-lg shadow-rose-500/20';
          tBtn.className = 'btn-tactile py-3.5 px-4 rounded-xl border-2 border-slate-800 bg-slate-900 text-slate-400 font-bold text-sm flex items-center justify-center gap-3 opacity-60';
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
        <div class="rounded-xl bg-[#03060c] border border-slate-800/90 p-4 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-200 shadow-inner">
          <pre class="whitespace-pre-wrap">${codeHtml}</pre>
        </div>
        <p class="text-[11px] text-slate-400 mt-2">💡 Springe mit <span class="kbd-cap">Tab</span> zur nächsten Lücke und drücke <span class="kbd-cap">Enter</span> zum Prüfen.</p>
      `;

      // Focus first input automatically
      setTimeout(() => {
        const firstInp = area.querySelector('input.cloze-input');
        if (firstInp) firstInp.focus();
      }, 60);

    } else if (task.type === 'bughunt') {
      const lines = task.codeLines || [];
      let linesHtml = lines.map((l, idx) => {
        const lineNo = (idx + 1).toString().padStart(2, ' ');
        return `
          <div class="bug-line flex items-center font-mono text-xs sm:text-sm" data-lineno="${idx + 1}">
            <span class="text-slate-600 select-none w-8 text-right pr-3 font-semibold">${lineNo}</span>
            <span class="text-slate-200 select-text">${escapeHtml(l)}</span>
          </div>
        `;
      }).join('');

      area.innerHTML = `
        <div class="rounded-xl bg-[#03060c] border border-slate-800/90 p-3.5 space-y-0.5 shadow-inner">
          ${linesHtml}
        </div>
        <p class="text-[11px] text-slate-400 mt-2">🎯 Klicke direkt auf die fehlerhafte Codezeile (z. B. fehlendes <code>self</code>, Syntax- oder Kapselungsfehler).</p>
      `;

      area.querySelectorAll('.bug-line').forEach(el => {
        el.addEventListener('click', () => {
          sfx.playClick();
          const lineNo = parseInt(el.dataset.lineno, 10);
          area.querySelectorAll('.bug-line').forEach(b => b.classList.remove('selected'));
          el.classList.add('selected');
          state.selectedBugLines = [lineNo];
        });
      });

    } else if (task.type === 'diagram_click') {
      let diagramSvg = '';
      if (task.diagramKind === 'class') {
        diagramSvg = diagrams.renderClassDiagram(task.diagramConfig);
      } else if (task.diagramKind === 'pointer_model') {
        diagramSvg = diagrams.renderMemoryPointerModel(task.diagramConfig);
      } else if (task.diagramKind === 'relationship') {
        diagramSvg = diagrams.renderRelationshipDiagram(task.diagramConfig);
      } else if (task.diagramKind === 'usecase') {
        diagramSvg = diagrams.renderUseCaseDiagram(task.diagramConfig);
      }

      area.innerHTML = `
        <div class="rounded-xl bg-[#03060c] border border-slate-800/90 p-4 flex flex-col items-center justify-center shadow-inner">
          ${diagramSvg}
        </div>
        <p class="text-[11px] text-slate-400 mt-2 text-center">👆 Klicke direkt im Diagramm auf das gesuchte Element oder den Zielbereich.</p>
      `;

      area.querySelectorAll('.diagram-hotspot').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          sfx.playClick();
          const hotspotId = el.dataset.hotspotId;
          area.querySelectorAll('.diagram-hotspot').forEach(h => h.classList.remove('selected'));
          el.classList.add('selected');
          state.selectedHotspotId = hotspotId;
        });
      });

    } else if (task.type === 'write') {
      area.innerHTML = `
        <div class="space-y-2">
          <textarea id="write-answer-input" rows="4" placeholder="Schreibe deinen Python-Code oder deine Klausurlösung hier..." class="w-full bg-[#03060c] border border-slate-800 rounded-xl p-3.5 font-mono text-xs sm:text-sm text-brand-300 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-inner resize-y"></textarea>
          <p class="text-[11px] text-slate-400">💡 Schreibe den präzisen Code oder die Methodendefinition.</p>
        </div>
      `;
    }
  }

  /* ==========================================================================
     ANSWER EVALUATION ENGINE
     ========================================================================== */
  function checkAnswer() {
    const task = getActiveTask();
    if (!task) return;

    let isCorrect = false;

    if (task.type === 'tf') {
      if (state.selectedTf === null) {
        alert("Bitte wähle zuerst 'Wahr' oder 'Falsch' aus!");
        return;
      }
      isCorrect = (state.selectedTf === task.correctAnswer);

    } else if (task.type === 'cloze') {
      const inputs = document.querySelectorAll('.cloze-input');
      let allFilled = true;
      let gapsCorrect = true;

      inputs.forEach(inp => {
        const key = inp.dataset.gap;
        const val = inp.value.trim();
        const expected = task.gaps[key];

        if (!val) allFilled = false;

        let match = false;
        if (Array.isArray(expected)) {
          match = expected.some(ex => ex.toLowerCase() === val.toLowerCase());
        } else {
          match = expected.toLowerCase() === val.toLowerCase();
        }

        if (match) {
          inp.classList.remove('incorrect');
          inp.classList.add('correct');
        } else {
          inp.classList.remove('correct');
          inp.classList.add('incorrect');
          gapsCorrect = false;
        }
      });

      if (!allFilled) {
        alert("Bitte fülle alle Lücken aus!");
        return;
      }
      isCorrect = gapsCorrect;

    } else if (task.type === 'bughunt') {
      if (state.selectedBugLines.length === 0) {
        alert("Bitte klicke auf die fehlerhafte Code-Zeile!");
        return;
      }
      const picked = state.selectedBugLines[0];
      const target = task.targetLine;
      isCorrect = (picked === target);

      const pickedEl = document.querySelector(`.bug-line[data-lineno="${picked}"]`);
      if (isCorrect) {
        pickedEl?.classList.add('correct-bug');
      } else {
        pickedEl?.classList.add('wrong-pick');
        const correctEl = document.querySelector(`.bug-line[data-lineno="${target}"]`);
        correctEl?.classList.add('correct-bug');
      }

    } else if (task.type === 'diagram_click') {
      if (!state.selectedHotspotId) {
        alert("Bitte klicke auf ein Element im Diagramm!");
        return;
      }
      isCorrect = (state.selectedHotspotId === task.targetHotspotId);

      const el = document.querySelector(`.diagram-hotspot[data-hotspot-id="${state.selectedHotspotId}"]`);
      if (isCorrect) {
        el?.classList.add('correct-hit');
      } else {
        el?.classList.add('wrong-hit');
        const targetEl = document.querySelector(`.diagram-hotspot[data-hotspot-id="${task.targetHotspotId}"]`);
        targetEl?.classList.add('correct-hit');
      }

    } else if (task.type === 'write') {
      const txt = (document.getElementById('write-answer-input')?.value || '').trim();
      if (!txt) {
        alert("Bitte gib eine Lösung ein!");
        return;
      }
      const keywords = task.keywords || [];
      const lower = txt.toLowerCase();
      const matched = keywords.every(kw => lower.includes(kw.toLowerCase()));
      isCorrect = matched;
    }

    // Record result in storage
    const result = storage.recordResult(task.id, isCorrect);

    // Audio & Visual Effects
    const workspace = document.getElementById('task-workspace');
    if (isCorrect) {
      sfx.playCorrect();
      fireConfetti();
      document.getElementById('xp-counter')?.classList.add('pulse-award');
      setTimeout(() => document.getElementById('xp-counter')?.classList.remove('pulse-award'), 500);
    } else {
      sfx.playIncorrect();
      if (storage.data.settings.animationsEnabled) {
        workspace?.classList.add('shake');
        setTimeout(() => workspace?.classList.remove('shake'), 400);
      }
    }

    // Show Feedback Box
    const box = document.getElementById('feedback-box');
    const title = document.getElementById('feedback-title');
    const desc = document.getElementById('feedback-desc');

    box.classList.remove('hidden', 'bg-emerald-500/10', 'border-emerald-500/30', 'text-emerald-200', 'bg-rose-500/10', 'border-rose-500/30', 'text-rose-200');

    if (isCorrect) {
      box.classList.add('bg-emerald-500/10', 'border-emerald-500/30', 'text-emerald-200');
      title.innerHTML = `
        <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</span>
        <span class="text-emerald-400 font-bold">Korrekt gelöst! (+${result.xpEarned} XP)</span>
        <span class="ml-auto text-[11px] font-mono text-emerald-300">Aufgestiegen in Fach ${result.stats.box}/5</span>
      `;
      desc.innerHTML = `
        <p class="leading-relaxed">${escapeHtml(task.explanation)}</p>
        <div class="pt-2">
          <button id="feedback-next-btn" class="btn-tactile px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-md">
            <span>Weiter zur nächsten Aufgabe</span>
            <span class="kbd-cap bg-emerald-400/40 text-slate-950 border-emerald-600/40">Enter</span>
          </button>
        </div>
      `;
      document.getElementById('feedback-next-btn')?.addEventListener('click', () => {
        document.getElementById('next-btn')?.click();
      });
    } else {
      box.classList.add('bg-rose-500/10', 'border-rose-500/30', 'text-rose-200');
      title.innerHTML = `
        <span class="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs">✗</span>
        <span class="text-rose-400 font-bold">Leider noch nicht ganz richtig!</span>
        <span class="ml-auto text-[11px] font-mono text-rose-300">Zurück in Fach 1</span>
      `;

      let solCodeHtml = '';
      if (task.solutionCode) {
        solCodeHtml = `<pre class="bg-[#03060c] p-3 rounded-lg font-mono text-xs text-brand-300 border border-slate-800 my-2">${escapeHtml(task.solutionCode)}</pre>`;
      }
      desc.innerHTML = `
        <p class="leading-relaxed">${escapeHtml(task.explanation)}</p>
        ${solCodeHtml}
      `;
    }

    renderHeaderStats();
    renderMatrix();
  }

  /* ==========================================================================
     KARTEIKASTEN (LEITNER 5-FÄCHER SYSTEM)
     ========================================================================== */
  function renderSpacedDashboard() {
    const container = document.getElementById('spaced-boxes-container');
    if (!container) return;
    container.innerHTML = '';

    const all = window.TASK_DATABASE.TASKS;
    const metrics = storage.getGlobalMetrics(all);

    const boxMeta = [
      { box: 1, name: "Fach 1: Täglich", interval: "Jeden Lerntag", color: "rose", desc: "Neue & fehlerhafte Aufgaben" },
      { box: 2, name: "Fach 2: Alle 2 Tage", interval: "Nach 2 Tagen", color: "amber", desc: "Erste Festigung" },
      { box: 3, name: "Fach 3: Alle 4 Tage", interval: "Nach 4 Tagen", color: "sky", desc: "Mittleres Langzeitgedächtnis" },
      { box: 4, name: "Fach 4: Wöchentlich", interval: "Nach 7 Tagen", color: "purple", desc: "Sichere Prüfungsroutine" },
      { box: 5, name: "Fach 5: Gemeistert", interval: "Vor der Klausur", color: "emerald", desc: "Perfekt verankert" }
    ];

    boxMeta.forEach(b => {
      const count = metrics.boxCounts[b.box] || 0;
      const card = document.createElement('div');
      card.className = `p-5 rounded-2xl bg-[#0f172a] border border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-700 transition shadow-lg`;

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <span class="box-pill box-pill-${b.box}">${b.name}</span>
            <span class="font-mono text-base font-bold text-white">${count}</span>
          </div>
          <p class="text-xs text-slate-400">${b.desc}</p>
        </div>
        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span class="text-[11px] text-slate-500 font-mono">Wdh: ${b.interval}</span>
          <button class="practice-box-btn btn-tactile px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-700 transition" data-box="${b.box}">
            Dieses Fach üben →
          </button>
        </div>
      `;

      card.querySelector('.practice-box-btn')?.addEventListener('click', () => {
        sfx.playClick();
        state.mode = 'practice';
        state.filterType = 'all';
        state.currentTopic = 'all';
        state.currentType = 'all';
        updateFilterUI();
        updateFilteredTasks();

        // Filter taskIds specifically in this box
        const boxTaskIds = state.filteredTaskIds.filter(id => {
          return (storage.getTaskStats(id).box || 1) === b.box;
        });

        if (boxTaskIds.length > 0) {
          state.filteredTaskIds = boxTaskIds;
          state.currentTaskIdx = 0;
        }

        switchView('practice');
      });

      container.appendChild(card);
    });
  }

  /* ==========================================================================
     KLAUSUR-SIMULATOR (TIMED EXAM WITH IHK GRADE)
     ========================================================================== */
  function startExam() {
    sfx.playClick();
    const sizeRadios = document.querySelectorAll('input[name="exam-size"]');
    let size = 25;
    sizeRadios.forEach(r => { if (r.checked) size = parseInt(r.value, 10); });

    let timeMinutes = 45;
    if (size === 15) timeMinutes = 20;
    if (size === 40) timeMinutes = 75;

    // Pick random tasks across all 6 topics
    const all = [...window.TASK_DATABASE.TASKS].filter(t => !storage.isTrash(t.id));
    all.sort(() => Math.random() - 0.5);
    state.examTasks = all.slice(0, size);
    state.examCurrentIdx = 0;
    state.examAnswers = {};
    state.examSecondsLeft = timeMinutes * 60;
    state.examTotalSeconds = state.examSecondsLeft;

    document.getElementById('exam-setup-card').classList.add('hidden');
    document.getElementById('exam-active-card').classList.remove('hidden');
    document.getElementById('exam-result-card').classList.add('hidden');

    if (state.examTimerInterval) clearInterval(state.examTimerInterval);
    state.examTimerInterval = setInterval(updateExamTimer, 1000);

    renderExamTask();
  }

  function updateExamTimer() {
    if (state.examSecondsLeft <= 0) {
      clearInterval(state.examTimerInterval);
      finishExam();
      return;
    }
    state.examSecondsLeft--;
    const mins = Math.floor(state.examSecondsLeft / 60);
    const secs = state.examSecondsLeft % 60;
    document.getElementById('exam-timer').textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function renderExamTask() {
    const task = state.examTasks[state.examCurrentIdx];
    if (!task) return;

    document.getElementById('exam-question-progress').textContent = `Aufgabe ${state.examCurrentIdx + 1} von ${state.examTasks.length}`;

    const box = document.getElementById('exam-task-box');
    box.innerHTML = `
      <div class="space-y-1.5">
        <span class="text-xs font-mono text-emerald-400 font-bold">Thema ${task.topic} • ${task.type.toUpperCase()}</span>
        <h3 class="text-base sm:text-lg font-bold text-white">${task.title}</h3>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">${task.prompt}</p>
      </div>
      <div id="exam-interactive-container" class="pt-3"></div>
    `;

    const area = document.getElementById('exam-interactive-container');
    const prevAnswer = state.examAnswers[task.id];

    if (task.type === 'tf') {
      area.innerHTML = `
        <div class="grid grid-cols-2 gap-3 max-w-sm py-2">
          <button id="exam-tf-true" class="btn-tactile py-3 px-4 rounded-xl border border-slate-700 font-bold text-xs ${prevAnswer === true ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 text-slate-300'}">
            Wahr
          </button>
          <button id="exam-tf-false" class="btn-tactile py-3 px-4 rounded-xl border border-slate-700 font-bold text-xs ${prevAnswer === false ? 'bg-rose-500/20 border-rose-500 text-rose-300' : 'bg-slate-900 text-slate-300'}">
            Falsch
          </button>
        </div>
      `;
      document.getElementById('exam-tf-true')?.addEventListener('click', () => {
        state.examAnswers[task.id] = true;
        renderExamTask();
      });
      document.getElementById('exam-tf-false')?.addEventListener('click', () => {
        state.examAnswers[task.id] = false;
        renderExamTask();
      });

    } else if (task.type === 'cloze') {
      let codeHtml = task.codeTemplate;
      Object.keys(task.gaps).forEach(gapKey => {
        const prevVal = (prevAnswer && prevAnswer[gapKey]) || '';
        const inp = `<input type="text" autocomplete="off" data-gap="${gapKey}" value="${escapeHtml(prevVal)}" class="exam-cloze-input cloze-input" style="width: ${Math.max(6, task.gaps[gapKey].length + 2)}ch">`;
        codeHtml = codeHtml.replace(`{{${gapKey}}}`, inp);
      });
      area.innerHTML = `
        <div class="rounded-xl bg-[#03060c] border border-slate-800 p-4 font-mono text-xs sm:text-sm leading-relaxed text-slate-200">
          <pre class="whitespace-pre-wrap">${codeHtml}</pre>
        </div>
      `;
      area.querySelectorAll('.exam-cloze-input').forEach(inp => {
        inp.addEventListener('input', () => {
          if (!state.examAnswers[task.id]) state.examAnswers[task.id] = {};
          state.examAnswers[task.id][inp.dataset.gap] = inp.value;
        });
      });

    } else {
      // General freeform answer or note
      const prevVal = typeof prevAnswer === 'string' ? prevAnswer : '';
      area.innerHTML = `
        <textarea id="exam-generic-input" rows="3" placeholder="Deine Klausurantwort..." class="w-full bg-[#03060c] border border-slate-800 rounded-xl p-3.5 font-mono text-xs sm:text-sm text-slate-200 outline-none focus:border-emerald-500">${escapeHtml(prevVal)}</textarea>
      `;
      document.getElementById('exam-generic-input')?.addEventListener('input', (e) => {
        state.examAnswers[task.id] = e.target.value;
      });
    }
  }

  function finishExam() {
    clearInterval(state.examTimerInterval);
    sfx.playCorrect();

    let correct = 0;
    const total = state.examTasks.length;

    state.examTasks.forEach(task => {
      const ans = state.examAnswers[task.id];
      if (task.type === 'tf') {
        if (ans === task.correctAnswer) correct++;
      } else if (task.type === 'cloze') {
        if (ans && typeof ans === 'object') {
          let allMatch = true;
          Object.keys(task.gaps).forEach(k => {
            const userV = (ans[k] || '').trim().toLowerCase();
            const exp = task.gaps[k];
            if (Array.isArray(exp)) {
              if (!exp.some(e => e.toLowerCase() === userV)) allMatch = false;
            } else {
              if (exp.toLowerCase() !== userV) allMatch = false;
            }
          });
          if (allMatch) correct++;
        }
      } else {
        if (ans) correct++; // credit for attempting
      }
    });

    const percent = Math.round((correct / total) * 100);

    // Official IHK Grade Curve
    let grade = 'Note 6 (Ungenügend)';
    let badgeClass = 'bg-rose-500/20 text-rose-300 border border-rose-500/40';
    if (percent >= 92) {
      grade = 'Note 1,0 (Sehr gut)';
      badgeClass = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    } else if (percent >= 81) {
      grade = 'Note 2,0 (Gut)';
      badgeClass = 'bg-teal-500/20 text-teal-300 border border-teal-500/40';
    } else if (percent >= 67) {
      grade = 'Note 3,0 (Befriedigend)';
      badgeClass = 'bg-sky-500/20 text-sky-300 border border-sky-500/40';
    } else if (percent >= 50) {
      grade = 'Note 4,0 (Ausreichend)';
      badgeClass = 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
    } else if (percent >= 30) {
      grade = 'Note 5,0 (Mangelhaft)';
      badgeClass = 'bg-orange-500/20 text-orange-300 border border-orange-500/40';
    }

    document.getElementById('exam-active-card').classList.add('hidden');
    document.getElementById('exam-result-card').classList.remove('hidden');

    const badge = document.getElementById('exam-grade-badge');
    badge.textContent = grade;
    badge.className = `inline-block px-6 py-3 rounded-2xl text-xl sm:text-2xl font-black mb-1 shadow-xl ${badgeClass}`;
    document.getElementById('exam-summary-text').textContent = `Du hast ${correct} von ${total} Aufgaben korrekt gelöst (${percent}%).`;
  }

  /* ==========================================================================
     STATISTIKEN (DEEP ANALYTICS DASHBOARD)
     ========================================================================== */
  function renderStatsDashboard() {
    const all = window.TASK_DATABASE.TASKS;
    const metrics = storage.getGlobalMetrics(all);

    document.getElementById('stats-total-xp').textContent = `${storage.data.xp} XP`;
    document.getElementById('stats-streak').textContent = storage.data.bestStreak;
    document.getElementById('stats-solved-count').textContent = `${metrics.solvedCount} / ${metrics.total}`;
    
    let totalAttempts = 0;
    let totalCorrect = 0;
    Object.values(metrics.topicMetrics).forEach(m => {
      totalAttempts += m.attempts;
      totalCorrect += m.correct;
    });
    const acc = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    document.getElementById('stats-accuracy-rate').textContent = `${acc}%`;

    const topicList = document.getElementById('stats-topic-list');
    topicList.innerHTML = '';

    Object.keys(window.TASK_DATABASE.TOPICS).forEach(topId => {
      const tInfo = window.TASK_DATABASE.TOPICS[topId];
      const tMetric = metrics.topicMetrics[topId] || { total: 0, solved: 0 };
      const pct = tMetric.total > 0 ? Math.round((tMetric.solved / tMetric.total) * 100) : 0;

      const row = document.createElement('div');
      row.className = 'p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5';
      row.innerHTML = `
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-slate-200">${tInfo.icon} ${tInfo.title}</span>
          <span class="font-mono text-emerald-400 font-bold">${tMetric.solved} / ${tMetric.total} (${pct}%)</span>
        </div>
        <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
          <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-300" style="width: ${pct}%"></div>
        </div>
      `;
      topicList.appendChild(row);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ==========================================================================
     APP INITIALIZATION & EVENT LISTENERS
     ========================================================================== */
  function initApp() {
    storage = new window.TrainerStorage();
    sfx = new window.SoundEngine(storage);
    diagrams = new window.DiagramEngine();

    updateFilterUI();
    renderCurrentTask();

    // Mode Navigation
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
            navBtns[m].className = 'px-3.5 py-1.5 rounded-lg font-semibold bg-emerald-500 text-slate-950 shadow transition flex items-center gap-1.5';
          } else {
            navBtns[m].className = 'px-3.5 py-1.5 rounded-lg font-semibold text-slate-400 hover:text-white transition flex items-center gap-1.5';
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

    document.getElementById('exam-back-btn')?.addEventListener('click', () => {
      switchView('practice');
    });

    // Quick Filter Buttons (Alle, Fehler, Gemerkt)
    document.querySelectorAll('.special-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sfx.playClick();
        state.filterType = btn.dataset.filter;
        if (btn.dataset.filter === 'all') {
          state.currentTopic = 'all';
          state.currentType = 'all';
        }
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

    // Empty State Reset Button
    document.getElementById('reset-filter-btn')?.addEventListener('click', () => {
      sfx.playClick();
      state.filterType = 'all';
      state.currentTopic = 'all';
      state.currentType = 'all';
      state.currentTaskIdx = 0;
      updateFilterUI();
      renderCurrentTask();
    });

    // Bookmark Toggle
    document.getElementById('bookmark-task-btn')?.addEventListener('click', () => {
      const task = getActiveTask();
      if (!task) return;
      sfx.playClick();
      const isBookmarked = storage.toggleBookmark(task.id);
      const starIcon = document.getElementById('bookmark-star-icon');
      const bBtn = document.getElementById('bookmark-task-btn');
      if (starIcon) {
        if (isBookmarked) {
          starIcon.setAttribute('fill', '#f59e0b');
          starIcon.setAttribute('stroke', '#f59e0b');
          bBtn.className = 'p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 transition';
        } else {
          starIcon.setAttribute('fill', 'none');
          starIcon.setAttribute('stroke', 'currentColor');
          bBtn.className = 'p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition';
        }
      }
      renderHeaderStats();
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
      box.classList.add('bg-slate-900', 'border-slate-800', 'text-slate-200');
      title.innerHTML = `
        <span class="text-sky-400 font-bold flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          <span>Musterlösung & Erklärung:</span>
        </span>
      `;
      
      let html = `<p class="mt-1">${escapeHtml(task.explanation)}</p>`;
      if (task.solutionCode) {
        html = `<pre class="bg-[#03060c] p-3 rounded-lg font-mono text-xs text-brand-300 border border-slate-800 mb-2">${escapeHtml(task.solutionCode)}</pre>` + html;
      }
      desc.innerHTML = html;
    });

    // Trash / Hide
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
      renderHeaderStats();
      const toggleInSettings = document.getElementById('setting-sound-toggle');
      if (toggleInSettings) toggleInSettings.checked = storage.data.settings.soundEnabled;
      if (storage.data.settings.soundEnabled) sfx.playClick();
    });

    // MODAL: Matrix Modal
    const matrixModal = document.getElementById('matrix-modal');
    document.getElementById('open-matrix-btn')?.addEventListener('click', () => openModal(matrixModal));
    document.getElementById('close-matrix-modal-btn')?.addEventListener('click', () => closeModal(matrixModal));
    document.getElementById('close-matrix-modal-footer')?.addEventListener('click', () => closeModal(matrixModal));
    matrixModal?.addEventListener('click', (e) => {
      if (e.target === matrixModal) closeModal(matrixModal);
    });

    // MODAL: Settings
    const settingsModal = document.getElementById('settings-modal');
    document.getElementById('settings-btn')?.addEventListener('click', () => {
      const soundToggle = document.getElementById('setting-sound-toggle');
      if (soundToggle) soundToggle.checked = storage.data.settings.soundEnabled;
      const volSlider = document.getElementById('setting-volume-slider');
      if (volSlider) {
        volSlider.value = Math.round((storage.data.settings.soundVolume ?? 0.7) * 100);
        document.getElementById('setting-volume-label').textContent = `${volSlider.value}%`;
      }
      const soundProfile = document.getElementById('setting-sound-profile');
      if (soundProfile) soundProfile.value = storage.data.settings.soundProfile || 'synth';
      const animToggle = document.getElementById('setting-anim-toggle');
      if (animToggle) animToggle.checked = storage.data.settings.animationsEnabled;

      openModal(settingsModal);
    });

    document.getElementById('close-settings-modal-btn')?.addEventListener('click', () => closeModal(settingsModal));
    settingsModal?.addEventListener('click', (e) => {
      if (e.target === settingsModal) closeModal(settingsModal);
    });

    // Settings inputs
    document.getElementById('setting-sound-toggle')?.addEventListener('change', (e) => {
      storage.data.settings.soundEnabled = e.target.checked;
      storage.save();
      renderHeaderStats();
    });

    document.getElementById('setting-volume-slider')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      storage.data.settings.soundVolume = val / 100;
      document.getElementById('setting-volume-label').textContent = `${val}%`;
      storage.save();
    });

    document.getElementById('setting-sound-profile')?.addEventListener('change', (e) => {
      storage.data.settings.soundProfile = e.target.value;
      storage.save();
      sfx.playCorrect();
    });

    document.getElementById('setting-anim-toggle')?.addEventListener('change', (e) => {
      storage.data.settings.animationsEnabled = e.target.checked;
      storage.save();
    });

    document.getElementById('export-json-btn')?.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(storage.exportJSON());
      const a = document.createElement('a');
      a.href = dataStr;
      a.download = `oop_trainer_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    });

    document.getElementById('import-json-btn')?.addEventListener('click', () => {
      const raw = prompt("Füge hier den JSON-Text deines Backups ein:");
      if (raw && storage.importJSON(raw)) {
        alert("Lernstand erfolgreich wiederhergestellt!");
        closeModal(settingsModal);
        renderHeaderStats();
        renderCurrentTask();
      }
    });

    document.getElementById('reset-all-data-btn')?.addEventListener('click', () => {
      if (confirm("Möchtest du deinen Trainingsfortschritt und XP wirklich auf 0 zurücksetzen?")) {
        storage.resetAllProgress();
        closeModal(settingsModal);
        renderHeaderStats();
        renderCurrentTask();
      }
    });

    // MODAL: Cheatsheet
    const cheatModal = document.getElementById('cheat-modal');
    document.getElementById('cheat-sheet-btn')?.addEventListener('click', () => openModal(cheatModal));
    document.getElementById('close-cheat-modal-btn')?.addEventListener('click', () => closeModal(cheatModal));
    document.getElementById('close-cheat-modal-footer')?.addEventListener('click', () => closeModal(cheatModal));
    cheatModal?.addEventListener('click', (e) => {
      if (e.target === cheatModal) closeModal(cheatModal);
    });

    // Exam Events
    document.getElementById('start-exam-btn')?.addEventListener('click', startExam);
    document.getElementById('finish-exam-btn')?.addEventListener('click', () => {
      if (confirm("Klausur vorzeitig abgeben und auswerten lassen?")) finishExam();
    });
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

    // Global Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal(settingsModal);
        closeModal(cheatModal);
        closeModal(matrixModal);
        return;
      }

      if (state.mode === 'practice') {
        if (e.target.tagName === 'TEXTAREA' || (e.target.tagName === 'INPUT' && e.key !== 'Enter')) return;
        if (e.key === 'm' || e.key === 'M') {
          if (matrixModal?.classList.contains('hidden')) {
            openModal(matrixModal);
          } else {
            closeModal(matrixModal);
          }
          return;
        }
        if (e.key === 'Enter') {
          const feedbackNext = document.getElementById('feedback-next-btn');
          if (feedbackNext && !document.getElementById('feedback-box').classList.contains('hidden')) {
            feedbackNext.click();
          } else {
            checkAnswer();
          }
        }
        else if (e.key === 't' || e.key === 'T') document.getElementById('hint-btn')?.click();
        else if (e.key === 'l' || e.key === 'L') document.getElementById('solution-btn')?.click();
        else if (e.key === 'w' || e.key === 'W' || e.key === '1') document.getElementById('tf-true-btn')?.click();
        else if (e.key === 'f' || e.key === 'F' || e.key === '2') document.getElementById('tf-false-btn')?.click();
        else if (e.key === 'ArrowRight' && e.altKey) document.getElementById('next-btn')?.click();
        else if (e.key === 'ArrowLeft' && e.altKey) document.getElementById('prev-btn')?.click();
      }
    });
  }

  // Bulletproof initialization regardless of script loading timing:
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
