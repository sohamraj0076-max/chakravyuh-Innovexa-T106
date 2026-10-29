// CIRCUITVERSE AI - Main Application Router & Controller

class AppRouter {
  constructor() {
    this.currentView = 'dashboard';
    this.views = {
      'dashboard': window.DashboardModule,
      'learning': window.LearningModule,
      'lab': window.LabModule,
      'ai': window.AiAssistantModule,
      'quiz': window.QuizModule,
      'coding': window.CodingModule,
      'iot': window.IotModule,
      'progress': window.ProgressModule
    };
  }

  init() {
    // Check URL hash if any
    const hash = window.location.hash.replace('#', '');
    if (hash && this.views[hash]) {
      this.currentView = hash;
    }
    this.navigate(this.currentView, false);

    // Bind hash change
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash && this.views[newHash] && newHash !== this.currentView) {
        this.navigate(newHash, false);
      }
    });
  }

  navigate(viewName, updateHash = true) {
    if (!this.views[viewName]) viewName = 'dashboard';
    this.currentView = viewName;

    if (updateHash) {
      window.location.hash = viewName;
    }

    // Update nav links active class
    document.querySelectorAll('.nav-item').forEach(item => {
      const target = item.getAttribute('data-view');
      if (target === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Toggle view containers
    document.querySelectorAll('.view-section').forEach(section => {
      section.classList.remove('active');
    });

    const activeEl = document.getElementById(`view-${viewName}`);
    if (activeEl) {
      activeEl.classList.add('active');
    }

    // Call render on active module
    const mod = this.views[viewName];
    if (mod && typeof mod.render === 'function') {
      mod.render();
    }

    // Close mobile sidebar if open
    document.getElementById('app-sidebar')?.classList.remove('open');
    document.getElementById('sidebar-backdrop')?.classList.remove('active');

    // Update page title
    this.updateHeaderTitle(viewName);

    // Refresh user stats
    window.app?.refreshTopStats();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateHeaderTitle(viewName) {
    const titles = {
      'dashboard': { title: 'CircuitVerse AI Dashboard', sub: 'Learn Circuits. Simulate Ideas. Build Intelligence.' },
      'learning': { title: 'Interactive Learning Curriculum', sub: 'Foundational and advanced ENTC engineering lessons' },
      'lab': { title: 'Virtual Electronics Lab', sub: 'Interactive logic gate workbench & Ohm\'s law simulator' },
      'ai': { title: 'AI Learning Assistant', sub: 'Curated ENTC engineering intelligence engine' },
      'quiz': { title: 'Smart Quiz Arena', sub: 'Timed multiple-choice battles & mastery assessment' },
      'coding': { title: 'Arduino Coding Playground', sub: 'Embedded C/C++ firmware challenges & simulation' },
      'iot': { title: 'IoT Smart-Home Simulator', sub: 'Real-time telemetry, sensors, and automation logic' },
      'progress': { title: 'Credentials & Achievements', sub: 'SQLite database persistence & engineering ranks' }
    };

    const current = titles[viewName] || titles['dashboard'];
    const titleEl = document.getElementById('topbar-title');
    const subEl = document.getElementById('topbar-subtitle');
    if (titleEl) titleEl.innerText = current.title;
    if (subEl) subEl.innerText = current.sub;
  }
}

class AppController {
  constructor() {
    this.user = null;
  }

  async init() {
    window.router = new AppRouter();
    window.router.init();
    await this.refreshTopStats();

    // Setup global sound toggle
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isMuted = window.soundEngine?.toggleMute();
        soundBtn.innerHTML = isMuted ? `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
        ` : `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        `;
        window.showToast?.(isMuted ? 'Audio effects muted' : 'Audio effects enabled', 'info');
      });
    }

    // Setup mobile sidebar toggle
    const menuBtn = document.getElementById('btn-menu-toggle');
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('open');
        backdrop?.classList.toggle('active', isOpen);
      });
    }
    if (backdrop && sidebar) {
      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('active');
      });
    }
  }

  async refreshTopStats() {
    try {
      const data = await window.api.getProgress();
      if (!data || !data.user) return;
      this.user = data.user;

      const xpChip = document.getElementById('topbar-xp');
      const levelChip = document.getElementById('topbar-level');
      const userRank = document.getElementById('sidebar-user-rank');
      const userName = document.getElementById('sidebar-user-name');
      const avatar = document.getElementById('sidebar-user-avatar');

      if (xpChip) xpChip.innerText = `${data.user.xp} XP`;
      if (levelChip) levelChip.innerText = `Lvl ${data.user.level}`;
      if (userRank) userRank.innerHTML = `⚡ ${data.user.rank}`;
      if (userName) userName.innerText = data.user.name;
      if (avatar) avatar.innerText = data.user.name.charAt(0);
    } catch (e) {
      console.warn('Failed to refresh stats:', e);
    }
  }
}

// Global Toast System
window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let icon = 'ℹ️';
  if (type === 'success') icon = '✓';
  if (type === 'error') icon = '✕';
  if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `
    <div style="font-weight: 800; font-size: 1rem;">${icon}</div>
    <div style="font-size: 0.88rem; font-weight: 500;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(60px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Initialize when ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
  window.app.init();
});
