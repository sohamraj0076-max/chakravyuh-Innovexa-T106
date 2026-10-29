// Progress & Reputation Tracking Module
const ProgressModule = {
  async render() {
    const container = document.getElementById('view-progress');
    if (!container) return;

    const data = await window.api.getProgress();
    const user = data.user || { name: 'ENTC Innovator', xp: 0, level: 1, rank: 'Novice Wireman' };
    const completedLessons = data.completedLessons || [];
    const completedChallenges = data.completedChallenges || [];
    const quizAttempts = data.quizAttempts || [];
    const badges = data.badges || [];

    const totalLessons = 6;
    const lessonPercent = Math.round((completedLessons.length / totalLessons) * 100);
    const challengesPercent = Math.round((completedChallenges.length / 3) * 100);

    const currentLevelBaseXP = (user.level - 1) * 100;
    const xpInLevel = Math.max(0, user.xp - currentLevelBaseXP);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px;">Engineering Progress & Credentials</h2>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Persistent profile telemetry synchronized with the SQLite database.</p>
        </div>
        <button class="btn btn-sm btn-danger" onclick="ProgressModule.handleReset()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
          Reset Demo Data
        </button>
      </div>

      <!-- User Profile Hero Card -->
      <div class="card card-cyan-glow" style="padding: 32px; background: rgba(10, 16, 31, 0.95); margin-bottom: 28px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
          <div style="display: flex; align-items: center; gap: 20px;">
            <div style="width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-cyan), var(--accent-violet)); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 800; color: #fff; box-shadow: var(--shadow-glow-cyan);">
              ${user.level}
            </div>
            <div>
              <div style="font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: 4px;">${user.name}</div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-cyan); background: rgba(6, 182, 212, 0.15); padding: 3px 10px; border-radius: var(--radius-sm);">
                  ${user.rank}
                </span>
                <span style="font-size: 0.8rem; color: var(--text-dim);">Level ${user.level} Engineer</span>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 24px;">
            <div style="text-align: right;">
              <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">Total XP</span>
              <div style="font-size: 1.8rem; font-weight: 800; color: #fbbf24;">${user.xp} <span style="font-size: 0.9rem; font-weight: 600;">XP</span></div>
            </div>
            <div style="text-align: right; border-left: 1px solid var(--border-subtle); padding-left: 24px;">
              <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">Level Progress</span>
              <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent-violet-light);">${xpInLevel}/100</div>
            </div>
          </div>
        </div>

        <div class="progress-bar-container" style="height: 10px; margin-top: 24px;">
          <div class="progress-bar-fill" style="width: ${xpInLevel}%;"></div>
        </div>
      </div>

      <!-- Domain Completion Stats -->
      <div class="grid-cols-3" style="margin-bottom: 28px;">
        <div class="card">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">Theoretical Curriculum</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 6px;">${completedLessons.length} / ${totalLessons} Lessons</div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${lessonPercent}%;"></div>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">${lessonPercent}% Completed</div>
        </div>

        <div class="card">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">Embedded Firmware Challenges</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 6px;">${completedChallenges.length} / 3 Solved</div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${challengesPercent}%; background: linear-gradient(90deg, #3b82f6, #60a5fa);"></div>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">${challengesPercent}% Solved</div>
        </div>

        <div class="card">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">Quiz Arena History</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 6px;">${data.quizStats.totalAttempts} Attempts</div>
          <div style="font-size: 0.85rem; color: var(--status-success); font-weight: 700; margin-top: 14px;">Best Score: ${data.quizStats.bestScore}%</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">Average Score: ${data.quizStats.avgScore}%</div>
        </div>
      </div>

      <!-- Unlocked Badges & Achievements -->
      <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 16px; color: #fff;">Unlocked Credentials & Badges:</h3>
      <div class="grid-cols-3" style="gap: 20px; margin-bottom: 40px;">
        ${badges.length > 0 ? badges.map(b => `
          <div class="card card-violet-glow" style="display: flex; align-items: center; gap: 16px; padding: 20px;">
            <div style="width: 50px; height: 50px; border-radius: var(--radius-md); background: rgba(139, 92, 246, 0.15); display: flex; align-items: center; justify-content: center; color: var(--accent-violet-light); flex-shrink: 0;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
            </div>
            <div>
              <h4 style="font-size: 0.98rem; font-weight: 700; color: #fff;">${b.name}</h4>
              <p style="font-size: 0.78rem; color: var(--text-muted);">${b.desc}</p>
            </div>
          </div>
        `).join('') : '<div style="grid-column: 1 / -1; color: var(--text-dim);">Complete lessons, solve coding challenges, or take the quiz to unlock badges!</div>'}
      </div>
    `;
  },

  async handleReset() {
    if (confirm('Reset all progress data in the SQLite database? This is ideal for testing the demo from scratch.')) {
      const res = await window.api.resetProgress();
      if (res.success) {
        window.soundEngine?.playSwitch();
        window.showToast?.('All database progress has been reset', 'info');
        window.app?.refreshTopStats();
        this.render();
      }
    }
  }
};

window.ProgressModule = ProgressModule;
