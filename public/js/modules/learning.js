// Interactive Learning Curriculum Module
const LearningModule = {
  lessons: [],
  completedIds: [],
  activeLesson: null,

  async render() {
    const container = document.getElementById('view-learning');
    if (!container) return;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px;">Interactive ENTC Curriculum</h2>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Structured, beginner-friendly theoretical foundations paired with practical engineering examples.</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <input type="text" id="lesson-search-input" placeholder="Search lessons..." style="padding: 8px 14px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: #fff; font-size: 0.85rem;" oninput="LearningModule.filterLessons()">
        </div>
      </div>

      <!-- Lessons Grid -->
      <div id="lessons-grid" class="grid-cols-3" style="margin-bottom: 28px;">
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          Loading curriculum...
        </div>
      </div>

      <!-- Active Lesson Reader Container (hidden by default) -->
      <div id="lesson-modal" style="display: none; position: fixed; inset: 0; background: rgba(7, 11, 20, 0.85); backdrop-filter: blur(10px); z-index: 1000; overflow-y: auto; padding: 40px 20px;">
        <div style="max-width: 800px; margin: 0 auto; background: var(--bg-secondary); border: 1px solid var(--border-glow); border-radius: var(--radius-lg); box-shadow: var(--shadow-card); padding: 32px; position: relative;">
          <button onclick="LearningModule.closeLesson()" style="position: absolute; top: 20px; right: 20px; background: rgba(255, 255, 255, 0.08); border: none; color: #fff; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            ✕
          </button>
          <div id="lesson-modal-content"></div>
        </div>
      </div>
    `;

    await this.loadData();
  },

  async loadData() {
    this.lessons = await window.api.getLessons();
    const progress = await window.api.getProgress();
    this.completedIds = progress.completedLessons || [];
    this.renderLessonsGrid();
  },

  filterLessons() {
    const query = (document.getElementById('lesson-search-input')?.value || '').toLowerCase();
    this.renderLessonsGrid(query);
  },

  renderLessonsGrid(filterText = '') {
    const grid = document.getElementById('lessons-grid');
    if (!grid) return;

    const filtered = this.lessons.filter(l => 
      l.title.toLowerCase().includes(filterText) || 
      l.category.toLowerCase().includes(filterText) ||
      l.summary.toLowerCase().includes(filterText)
    );

    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">No lessons match your search query.</div>';
      return;
    }

    grid.innerHTML = filtered.map(lesson => {
      const isCompleted = this.completedIds.includes(lesson.id);
      return `
        <div class="card card-cyan-glow" style="display: flex; flex-direction: column; justify-content: space-between; cursor: pointer;" onclick="LearningModule.openLesson('${lesson.id}')">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--accent-cyan); background: rgba(6, 182, 212, 0.12); padding: 3px 8px; border-radius: var(--radius-sm);">
                ${lesson.category}
              </span>
              <span style="font-size: 0.75rem; color: var(--text-dim);">${lesson.readTime}</span>
            </div>
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 8px; line-height: 1.3;">${lesson.title}</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px;">
              ${lesson.summary}
            </p>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
            ${isCompleted ? `
              <span style="display: inline-flex; align-items: center; gap: 6px; color: var(--status-success); font-size: 0.82rem; font-weight: 700;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Mastered
              </span>
            ` : `
              <span style="color: var(--accent-cyan-light); font-size: 0.82rem; font-weight: 600;">+50 XP Available</span>
            `}
            <button class="btn btn-sm ${isCompleted ? 'btn-secondary' : 'btn-primary'}" onclick="event.stopPropagation(); LearningModule.openLesson('${lesson.id}')">
              ${isCompleted ? 'Review' : 'Start Lesson'} →
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  openLesson(lessonId) {
    const lesson = this.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    this.activeLesson = lesson;

    const modal = document.getElementById('lesson-modal');
    const content = document.getElementById('lesson-modal-content');
    if (!modal || !content) return;

    const isCompleted = this.completedIds.includes(lesson.id);

    content.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
        <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-cyan); background: rgba(6, 182, 212, 0.15); padding: 4px 10px; border-radius: var(--radius-sm); text-transform: uppercase;">
          ${lesson.category}
        </span>
        <span style="font-size: 0.8rem; color: var(--text-dim);">${lesson.difficulty} Level · ${lesson.readTime}</span>
        ${isCompleted ? '<span style="font-size: 0.75rem; color: var(--status-success); font-weight: 700; margin-left: auto;">✓ Mastered</span>' : ''}
      </div>

      <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 16px; color: #fff;">${lesson.title}</h1>

      <div style="font-size: 0.98rem; line-height: 1.7; color: var(--text-main); margin-bottom: 24px;">
        <p style="margin-bottom: 16px;">${lesson.content.overview}</p>

        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; margin-bottom: 20px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Key Engineering Principles:
          </h4>
          <ul style="padding-left: 20px; display: flex; flex-direction: column; gap: 8px;">
            ${lesson.content.keyPoints.map(kp => `<li style="color: var(--text-muted); font-size: 0.92rem;">${kp}</li>`).join('')}
          </ul>
        </div>

        <div style="background: rgba(139, 92, 246, 0.08); border-left: 4px solid var(--accent-violet); padding: 16px 20px; border-radius: 0 var(--radius-md) var(--radius-md) 0; margin-bottom: 24px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--accent-violet-light); margin-bottom: 6px;">
            🛠️ Practical Industry Application:
          </h4>
          <p style="color: var(--text-muted); font-size: 0.92rem;">${lesson.content.practicalExample}</p>
        </div>

        <!-- Interactive Knowledge Check -->
        <div class="card" style="border-color: var(--border-glow); background: rgba(10, 16, 31, 0.95); margin-top: 24px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <h4 style="font-size: 1rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Quick Knowledge Check:
            </h4>
            <span style="font-size: 0.75rem; color: #fbbf24; font-weight: 700;">+50 XP</span>
          </div>
          <p style="font-weight: 600; margin-bottom: 16px; font-size: 0.95rem;">${lesson.content.knowledgeCheck.question}</p>
          <div style="display: flex; flex-direction: column; gap: 10px;" id="kc-options-container">
            ${lesson.content.knowledgeCheck.options.map((opt, idx) => `
              <button class="btn btn-secondary" style="justify-content: flex-start; text-align: left; padding: 12px 16px; font-size: 0.9rem;" onclick="LearningModule.checkAnswer(${idx})">
                <span style="width: 24px; height: 24px; border-radius: 50%; background: rgba(255, 255, 255, 0.08); display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 0.78rem;">
                  ${String.fromCharCode(65 + idx)}
                </span>
                ${opt}
              </button>
            `).join('')}
          </div>
          <div id="kc-feedback" style="display: none; margin-top: 16px; padding: 14px; border-radius: var(--radius-md);"></div>
        </div>
      </div>
    `;

    modal.style.display = 'block';
    window.soundEngine?.playSwitch();
  },

  async checkAnswer(selectedIndex) {
    if (!this.activeLesson) return;
    const kc = this.activeLesson.content.knowledgeCheck;
    const isCorrect = selectedIndex === kc.correctIndex;
    const feedbackEl = document.getElementById('kc-feedback');
    const buttons = document.querySelectorAll('#kc-options-container button');

    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === kc.correctIndex) {
        btn.style.borderColor = 'var(--status-success)';
        btn.style.background = 'rgba(16, 185, 129, 0.2)';
      } else if (idx === selectedIndex) {
        btn.style.borderColor = 'var(--status-danger)';
        btn.style.background = 'rgba(239, 68, 68, 0.2)';
      }
    });

    if (feedbackEl) {
      feedbackEl.style.display = 'block';
      if (isCorrect) {
        window.soundEngine?.playSuccess();
        feedbackEl.style.background = 'rgba(16, 185, 129, 0.15)';
        feedbackEl.style.border = '1px solid var(--status-success)';
        feedbackEl.innerHTML = `
          <div style="font-weight: 700; color: var(--status-success); margin-bottom: 4px;">✓ Correct! +50 XP Earned</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">${kc.explanation}</div>
        `;

        // Award completion on backend
        const result = await window.api.completeLesson(this.activeLesson.id);
        if (result.success && !this.completedIds.includes(this.activeLesson.id)) {
          this.completedIds.push(this.activeLesson.id);
          window.app?.refreshTopStats();
          window.showToast?.('Lesson Mastered! +50 XP awarded', 'success');
        }
      } else {
        window.soundEngine?.playError();
        feedbackEl.style.background = 'rgba(239, 68, 68, 0.15)';
        feedbackEl.style.border = '1px solid var(--status-danger)';
        feedbackEl.innerHTML = `
          <div style="font-weight: 700; color: var(--status-danger); margin-bottom: 4px;">✕ Incorrect</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">${kc.explanation}</div>
        `;
      }
    }
  },

  closeLesson() {
    const modal = document.getElementById('lesson-modal');
    if (modal) modal.style.display = 'none';
    this.renderLessonsGrid();
  }
};

window.LearningModule = LearningModule;
