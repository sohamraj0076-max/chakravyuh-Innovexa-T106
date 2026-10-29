// Dashboard Module
const DashboardModule = {
  async render() {
    const container = document.getElementById('view-dashboard');
    if (!container) return;

    try {
      const data = await window.api.getProgress();
      const user = data.user || { name: 'ENTC Innovator', xp: 0, level: 1, rank: 'Novice Wireman' };
      const completedCount = (data.completedLessons || []).length;
      const challengesCount = (data.completedChallenges || []).length;
      const totalLessons = 6;
      const lessonPercent = Math.round((completedCount / totalLessons) * 100);

      // Level progress: every 100 XP is 1 level
      const currentLevelBaseXP = (user.level - 1) * 100;
      const xpInCurrentLevel = Math.max(0, user.xp - currentLevelBaseXP);
      const levelProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / 100) * 100));

      container.innerHTML = `
        <!-- Hero Section -->
        <div class="hero-banner">
          <div class="hero-content">
            <div class="hero-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              CHAKRAVYUH — AI Vibe Coding Challenge
            </div>
            <h2>Learn Circuits. Simulate Ideas. <br><span style="background: linear-gradient(135deg, var(--accent-cyan-light), var(--accent-violet-light)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Build Intelligence.</span></h2>
            <p>Welcome to <strong>CircuitVerse AI</strong>, the interactive ENTC learning ecosystem bridging theoretical electromagnetics, digital logic, signal processing, and IoT through live simulation and AI guidance.</p>
            <div class="hero-actions">
              <button class="btn btn-primary" onclick="window.router.navigate('lab')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                Launch Virtual Lab
              </button>
              <button class="btn btn-violet" onclick="window.router.navigate('ai')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Ask AI Assistant
              </button>
              <button class="btn btn-secondary" onclick="window.router.navigate('quiz')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Take Quiz Arena
              </button>
            </div>
          </div>
          <div class="hero-badge-art">
            <div class="pulse-ring"></div>
            <div class="pulse-ring"></div>
            <div style="background: rgba(15, 23, 42, 0.9); border: 2px solid var(--accent-cyan); width: 110px; height: 110px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: var(--shadow-glow-cyan); z-index: 5;">
              <span style="font-size: 1.8rem; font-weight: 800; color: #fff;">${user.level}</span>
              <span style="font-size: 0.7rem; color: var(--accent-cyan); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Level</span>
            </div>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid-cols-4" style="margin-bottom: 28px;">
          <div class="card card-cyan-glow">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600;">Overall Mastery</span>
              <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(6, 182, 212, 0.15); display: flex; align-items: center; justify-content: center; color: var(--accent-cyan);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
            </div>
            <div style="font-size: 1.8rem; font-weight: 800; margin-bottom: 6px;">${lessonPercent}%</div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: ${lessonPercent}%;"></div>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-dim);">${completedCount} of ${totalLessons} core lessons completed</div>
          </div>

          <div class="card card-violet-glow">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600;">Experience Points (XP)</span>
              <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(245, 158, 11, 0.15); display: flex; align-items: center; justify-content: center; color: #fbbf24;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
            </div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #fbbf24; margin-bottom: 6px;">${user.xp} <span style="font-size: 0.9rem; color: var(--text-dim); font-weight: 500;">XP</span></div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: ${levelProgressPercent}%; background: linear-gradient(90deg, #f59e0b, #fbbf24);"></div>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-dim);">${100 - xpInCurrentLevel} XP until Level ${user.level + 1}</div>
          </div>

          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600;">Quiz High Score</span>
              <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(16, 185, 129, 0.15); display: flex; align-items: center; justify-content: center; color: var(--status-success);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                  <path d="M4 22h16"></path>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                </svg>
              </div>
            </div>
            <div style="font-size: 1.8rem; font-weight: 800; margin-bottom: 6px;">${data.quizStats.bestScore}%</div>
            <div style="font-size: 0.85rem; color: var(--accent-cyan); font-weight: 600; margin-top: 14px;">${data.quizStats.totalAttempts} Quiz Attempts</div>
            <div style="font-size: 0.75rem; color: var(--text-dim);">Avg accuracy: ${data.quizStats.avgScore}%</div>
          </div>

          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600;">Engineering Rank</span>
              <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(139, 92, 246, 0.15); display: flex; align-items: center; justify-content: center; color: var(--accent-violet-light);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              </div>
            </div>
            <div style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${user.rank}
            </div>
            <div style="font-size: 0.85rem; color: var(--accent-violet-light); font-weight: 600; margin-top: 14px;">
              ${challengesCount} Challenges Solved
            </div>
            <div style="font-size: 0.75rem; color: var(--text-dim);">${(data.badges || []).length} Badges Unlocked</div>
          </div>
        </div>

        <!-- Two Column Main Layout: Quick Access Labs & Activity Feed -->
        <div class="grid-cols-3">
          <!-- Left 2 Cols: Interactive Modules Showcase -->
          <div style="grid-column: span 2; display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h3 style="font-size: 1.15rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                Core Exploration Portals
              </h3>
              <span style="font-size: 0.8rem; color: var(--accent-cyan); cursor: pointer;" onclick="window.router.navigate('learning')">View All Modules →</span>
            </div>

            <div class="grid-cols-2">
              <div class="card" style="cursor: pointer; padding: 20px;" onclick="window.router.navigate('lab')">
                <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
                  <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(6, 182, 212, 0.15); display: flex; align-items: center; justify-content: center; color: var(--accent-cyan);">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                      <rect x="9" y="9" width="6" height="6"></rect>
                      <line x1="9" y1="1" x2="9" y2="4"></line>
                      <line x1="15" y1="1" x2="15" y2="4"></line>
                      <line x1="9" y1="20" x2="9" y2="23"></line>
                      <line x1="15" y1="20" x2="15" y2="23"></line>
                      <line x1="20" y1="9" x2="23" y2="9"></line>
                      <line x1="20" y1="14" x2="23" y2="14"></line>
                      <line x1="1" y1="9" x2="4" y2="9"></line>
                      <line x1="1" y1="14" x2="4" y2="14"></line>
                    </svg>
                  </div>
                  <div>
                    <h4 style="font-size: 1rem; font-weight: 700;">Virtual Electronics Lab</h4>
                    <span style="font-size: 0.75rem; color: var(--accent-cyan);">Real-time Logic & Ohm's Simulator</span>
                  </div>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
                  Test AND, OR, NOT, NAND, NOR, and XOR gates with live input toggles, active truth tables, and interactive Ohm's Law circuits.
                </p>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem;">
                  <span style="color: var(--status-success); font-weight: 600;">● Live Simulation</span>
                  <span style="color: var(--accent-cyan-light); font-weight: 600;">Open Workbench →</span>
                </div>
              </div>

              <div class="card" style="cursor: pointer; padding: 20px;" onclick="window.router.navigate('iot')">
                <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
                  <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(16, 185, 129, 0.15); display: flex; align-items: center; justify-content: center; color: var(--status-success);">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4 style="font-size: 1rem; font-weight: 700;">IoT Smart-Home Simulator</h4>
                    <span style="font-size: 0.75rem; color: var(--status-success);">Edge Sensors & Automated Actuators</span>
                  </div>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
                  Experiment with Temperature, Ambient Light (LDR), and PIR Motion sensors triggering real-time fan rotations and dynamic lighting.
                </p>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem;">
                  <span style="color: var(--accent-cyan); font-weight: 600;">● Automation Rules</span>
                  <span style="color: var(--status-success); font-weight: 600;">Launch Lab →</span>
                </div>
              </div>

              <div class="card" style="cursor: pointer; padding: 20px;" onclick="window.router.navigate('coding')">
                <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
                  <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(59, 130, 246, 0.15); display: flex; align-items: center; justify-content: center; color: var(--accent-blue-light);">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4 style="font-size: 1rem; font-weight: 700;">Arduino Coding Playground</h4>
                    <span style="font-size: 0.75rem; color: var(--accent-blue-light);">Embedded C/C++ Challenges</span>
                  </div>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
                  Write and validate Arduino sketch logic with deterministic compiler verification, virtual Pin 13 LED, and live Serial Monitor.
                </p>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem;">
                  <span style="color: #fbbf24; font-weight: 600;">+100 XP per challenge</span>
                  <span style="color: var(--accent-blue-light); font-weight: 600;">Code Now →</span>
                </div>
              </div>

              <div class="card" style="cursor: pointer; padding: 20px;" onclick="window.router.navigate('quiz')">
                <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
                  <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(245, 158, 11, 0.15); display: flex; align-items: center; justify-content: center; color: #fbbf24;">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polygon points="10 8 16 12 10 16 10 8"></polygon>
                    </svg>
                  </div>
                  <div>
                    <h4 style="font-size: 1rem; font-weight: 700;">Smart Quiz Arena</h4>
                    <span style="font-size: 0.75rem; color: #fbbf24;">Timed ENTC Multi-Choice Battles</span>
                  </div>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
                  12 rigorous questions testing Nyquist limits, De Morgan's theorems, ADC conversions, and MQTT protocols with instant reviews.
                </p>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem;">
                  <span style="color: var(--accent-violet-light); font-weight: 600;">Countdown Timer</span>
                  <span style="color: #fbbf24; font-weight: 600;">Enter Arena →</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Col: Live Activity Feed & System Diagnostics -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div class="card" style="padding: 20px;">
              <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                Recent Activity Feed
              </h3>
              <div id="dashboard-activity-list" style="display: flex; flex-direction: column; gap: 12px; max-height: 280px; overflow-y: auto;">
                ${(data.activities && data.activities.length > 0) ? data.activities.map(act => `
                  <div style="display: flex; gap: 12px; align-items: flex-start; padding: 8px 10px; background: rgba(255, 255, 255, 0.02); border-radius: var(--radius-sm); border-left: 2px solid var(--accent-cyan);">
                    <div style="flex: 1;">
                      <div style="font-size: 0.82rem; font-weight: 600; color: #fff;">${act.title}</div>
                      <div style="font-size: 0.74rem; color: var(--text-muted);">${act.description}</div>
                    </div>
                    ${act.xp_earned > 0 ? `<span style="font-size: 0.72rem; color: #fbbf24; font-weight: 700;">+${act.xp_earned} XP</span>` : ''}
                  </div>
                `).join('') : '<p style="color: var(--text-dim); font-size: 0.82rem;">No activities logged yet.</p>'}
              </div>
            </div>

            <!-- Platform Architecture & Hackathon Badge -->
            <div class="card" style="padding: 20px; background: rgba(14, 23, 42, 0.9);">
              <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
                Platform Diagnostics
              </h4>
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.78rem;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">Database:</span>
                  <span style="color: var(--status-success); font-weight: 600;">SQLite Native (Local Persistence)</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">AI Engine:</span>
                  <span style="color: var(--accent-cyan-light); font-weight: 600;">Curated ENTC Knowledge Base</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">Runtime:</span>
                  <span style="color: #fff; font-weight: 600;">Node.js v22.16 Full-Stack</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">Audio Feedback:</span>
                  <span style="color: var(--accent-violet-light); font-weight: 600;">Web Audio Synthesizer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      console.error('Error rendering dashboard:', err);
      container.innerHTML = `<div class="card"><p style="color: var(--status-danger);">Failed to render dashboard: ${err.message}</p></div>`;
    }
  }
};

window.DashboardModule = DashboardModule;
