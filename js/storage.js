/**
 * Python OOP & UML Trainer - LocalStorage & Progress Engine
 * Resilient schema, Leitner Spaced Repetition & Detailed Statistics
 */
(function() {
  const STORAGE_KEY = 'oop_trainer_data_v2';

  const RANKS = [
    { minXp: 0, title: "Syntax-Novize", badge: "🌱", color: "text-slate-400" },
    { minXp: 150, title: "Klassen-Lehrling", badge: "📐", color: "text-blue-400" },
    { minXp: 400, title: "Self-Versteher", badge: "🎯", color: "text-sky-400" },
    { minXp: 750, title: "Kapselungs-Hüter", badge: "🛡️", color: "text-indigo-400" },
    { minXp: 1200, title: "Vererbungs-Spezialist", badge: "🧬", color: "text-purple-400" },
    { minXp: 1800, title: "Polymorphie-Zauberer", badge: "🔮", color: "text-amber-400" },
    { minXp: 2500, title: "UML-Architekt", badge: "🏛️", color: "text-emerald-400" },
    { minXp: 3500, title: "Klausur-Endgegner", badge: "👑", color: "text-rose-400 font-black" }
  ];

  const defaultState = {
    version: 2,
    xp: 0,
    streak: 0,
    bestStreak: 0,
    tasks: {}, // taskId -> { attempts, correct, incorrect, box: 1..5, lastTested: timestamp, bookmarked: false }
    hidden: [], // taskIds placed in trash
    settings: {
      soundEnabled: true,
      soundVolume: 0.7,
      soundProfile: 'synth', // 'synth' or 'retro'
      animationsEnabled: true,
      autoAdvance: false
    }
  };

  class TrainerStorage {
    constructor() {
      this.data = this.load();
    }

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          // Migration from old v1 keys if present
          const v1Xp = parseInt(localStorage.getItem('oop_xp') || '0', 10);
          const v1Streak = parseInt(localStorage.getItem('oop_streak') || '0', 10);
          const v1Solved = JSON.parse(localStorage.getItem('oop_solved') || '{}');
          const v1Hidden = JSON.parse(localStorage.getItem('oop_hidden') || '[]');

          const migrated = JSON.parse(JSON.stringify(defaultState));
          migrated.xp = v1Xp;
          migrated.streak = v1Streak;
          migrated.bestStreak = v1Streak;
          migrated.hidden = v1Hidden;

          Object.keys(v1Solved).forEach(id => {
            const isCorrect = v1Solved[id];
            migrated.tasks[id] = {
              attempts: 1,
              correct: isCorrect ? 1 : 0,
              incorrect: isCorrect ? 0 : 1,
              box: isCorrect ? 2 : 1,
              lastTested: Date.now(),
              bookmarked: false
            };
          });

          this.saveState(migrated);
          return migrated;
        }

        const parsed = JSON.parse(raw);
        return Object.assign({}, defaultState, parsed, {
          settings: Object.assign({}, defaultState.settings, parsed.settings || {})
        });
      } catch(e) {
        console.error("Failed to load trainer storage:", e);
        return JSON.parse(JSON.stringify(defaultState));
      }
    }

    save() {
      this.saveState(this.data);
    }

    saveState(stateObj) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateObj));
      } catch(e) {
        console.error("Storage save failed:", e);
      }
    }

    getTaskStats(taskId) {
      if (!this.data.tasks[taskId]) {
        this.data.tasks[taskId] = {
          attempts: 0,
          correct: 0,
          incorrect: 0,
          box: 1,
          lastTested: 0,
          bookmarked: false
        };
      }
      return this.data.tasks[taskId];
    }

    recordResult(taskId, isCorrect) {
      const stats = this.getTaskStats(taskId);
      stats.attempts += 1;
      stats.lastTested = Date.now();

      if (isCorrect) {
        stats.correct += 1;
        // Spaced Repetition Box climb (max 5)
        stats.box = Math.min(5, (stats.box || 1) + 1);
        
        // Gamification
        const xpEarned = 15 + Math.min(10, this.data.streak * 2);
        this.data.xp += xpEarned;
        this.data.streak += 1;
        if (this.data.streak > this.data.bestStreak) {
          this.data.bestStreak = this.data.streak;
        }
      } else {
        stats.incorrect += 1;
        // On error: straight back to Box 1!
        stats.box = 1;
        this.data.streak = 0;
      }

      this.save();
      return { isCorrect, xpEarned: isCorrect ? 15 : 0, stats };
    }

    toggleBookmark(taskId) {
      const stats = this.getTaskStats(taskId);
      stats.bookmarked = !stats.bookmarked;
      this.save();
      return stats.bookmarked;
    }

    isBookmarked(taskId) {
      return !!this.getTaskStats(taskId).bookmarked;
    }

    toggleTrash(taskId) {
      const idx = this.data.hidden.indexOf(taskId);
      if (idx !== -1) {
        this.data.hidden.splice(idx, 1);
      } else {
        this.data.hidden.push(taskId);
      }
      this.save();
    }

    restoreAllTrash() {
      this.data.hidden = [];
      this.save();
    }

    isTrash(taskId) {
      return this.data.hidden.includes(taskId);
    }

    getRank() {
      let currentRank = RANKS[0];
      for (let i = RANKS.length - 1; i >= 0; i--) {
        if (this.data.xp >= RANKS[i].minXp) {
          currentRank = RANKS[i];
          break;
        }
      }
      return currentRank;
    }

    getNextRankProgress() {
      const current = this.getRank();
      const currentIdx = RANKS.findIndex(r => r.title === current.title);
      if (currentIdx === RANKS.length - 1) {
        return { current, next: null, percent: 100, remaining: 0 };
      }
      const next = RANKS[currentIdx + 1];
      const range = next.minXp - current.minXp;
      const progress = this.data.xp - current.minXp;
      const percent = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
      return { current, next, percent, remaining: next.minXp - this.data.xp };
    }

    getGlobalMetrics(allTasks) {
      const activeTasks = allTasks.filter(t => !this.isTrash(t.id));
      const total = activeTasks.length;
      let solvedCount = 0;
      let errorCount = 0;
      let unseenCount = 0;
      const boxCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      const topicMetrics = {};

      activeTasks.forEach(t => {
        const stats = this.getTaskStats(t.id);
        const top = t.topic;
        if (!topicMetrics[top]) {
          topicMetrics[top] = { total: 0, solved: 0, attempts: 0, correct: 0 };
        }
        topicMetrics[top].total++;

        if (stats.attempts === 0) {
          unseenCount++;
        } else {
          topicMetrics[top].attempts += stats.attempts;
          topicMetrics[top].correct += stats.correct;
          if (stats.box >= 2) {
            solvedCount++;
            topicMetrics[top].solved++;
          }
          if (stats.incorrect > 0 || stats.box === 1) {
            errorCount++;
          }
        }
        boxCounts[stats.box || 1]++;
      });

      return {
        total,
        solvedCount,
        errorCount,
        unseenCount,
        boxCounts,
        percent: total > 0 ? Math.round((solvedCount / total) * 100) : 0,
        topicMetrics
      };
    }

    exportJSON() {
      return JSON.stringify(this.data, null, 2);
    }

    importJSON(jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        if (typeof parsed !== 'object' || !parsed.version) {
          throw new Error("Ungültiges Sicherungsformat.");
        }
        this.data = parsed;
        this.save();
        return true;
      } catch(e) {
        console.error("Import failed:", e);
        return false;
      }
    }

    resetAllProgress() {
      this.data.xp = 0;
      this.data.streak = 0;
      this.data.tasks = {};
      this.save();
    }
  }

  window.TrainerStorage = TrainerStorage;
})();
