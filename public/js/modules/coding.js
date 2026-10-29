// Arduino Embedded Coding Playground Module
const CodingModule = {
  challenges: [],
  selectedChallengeId: 'challenge-blink',
  activeCode: '',
  validationResult: null,

  async render() {
    const container = document.getElementById('view-coding');
    if (!container) return;

    this.challenges = await window.api.getCodingChallenges();
    const activeChallenge = this.challenges.find(c => c.id === this.selectedChallengeId) || this.challenges[0];
    if (activeChallenge && !this.activeCode) {
      this.activeCode = activeChallenge.starterCode;
    }

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <h2 style="font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px;">Arduino Embedded Coding Lab</h2>
            <span style="font-size: 0.72rem; padding: 2px 8px; border-radius: var(--radius-full); background: rgba(59, 130, 246, 0.2); color: var(--accent-blue-light); font-weight: 700;">
              Virtual AVR Runtime & Deterministic AST Validator
            </span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Write Arduino C/C++ sketches, validate GPIO configurations, and observe simulated microcontroller telemetry.</p>
        </div>
      </div>

      <!-- Simulation Environment Notice -->
      <div style="background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: var(--radius-md); padding: 12px 18px; margin-bottom: 20px; font-size: 0.82rem; color: var(--accent-blue-light); display: flex; align-items: center; gap: 10px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span><strong>Deterministic Firmware Verification:</strong> Sketches are verified against AVR C++ structure, pin assignments, and loop constructs. Execution is virtually simulated via the onboard virtual MCU and Serial Monitor (no physical USB hardware connected).</span>
      </div>

      <!-- Challenge Selector Pills -->
      <div style="display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap;">
        ${this.challenges.map(c => `
          <button class="btn btn-sm ${this.selectedChallengeId === c.id ? 'btn-primary' : 'btn-secondary'}" onclick="CodingModule.selectChallenge('${c.id}')">
            ${c.title.split(':')[0]} (${c.difficulty})
          </button>
        `).join('')}
      </div>

      <!-- Challenge Overview Card -->
      <div class="card" style="margin-bottom: 24px; padding: 20px; background: rgba(10, 16, 31, 0.9);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff;">${activeChallenge.title}</h3>
          <span style="font-size: 0.8rem; color: #fbbf24; font-weight: 700; background: rgba(245, 158, 11, 0.15); padding: 4px 10px; border-radius: var(--radius-sm);">
            +${activeChallenge.xpReward} XP
          </span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;">${activeChallenge.description}</p>
      </div>

      <!-- IDE Workspace: Code Editor (Left) & Virtual Arduino + Serial Monitor (Right) -->
      <div class="grid-cols-2" style="gap: 20px;">
        <!-- Code Editor Pane -->
        <div class="card" style="padding: 0; display: flex; flex-direction: column; height: 550px; background: #070c17; border-color: var(--border-glow); overflow: hidden;">
          <!-- Editor Toolbar -->
          <div style="padding: 10px 16px; background: rgba(15, 23, 42, 0.9); border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #f87171;"></span>
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #fbbf24;"></span>
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #34d399;"></span>
              <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-dim); margin-left: 8px;">sketch.ino (Arduino C++)</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-sm btn-secondary" onclick="CodingModule.resetCode()">
                Reset Template
              </button>
              <button class="btn btn-sm btn-primary" onclick="CodingModule.compileAndRun()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Verify & Run
              </button>
            </div>
          </div>

          <!-- Codearea -->
          <textarea id="code-editor-textarea" spellcheck="false" style="flex: 1; width: 100%; background: #070c17; color: #38bdf8; font-family: var(--font-mono); font-size: 0.9rem; padding: 18px; border: none; outline: none; resize: none; line-height: 1.6;" oninput="CodingModule.activeCode = this.value">${this.activeCode}</textarea>
        </div>

        <!-- Virtual Hardware & Serial Monitor Pane -->
        <div style="display: flex; flex-direction: column; gap: 20px; height: 550px;">
          <!-- Virtual Arduino Uno Board Graphic -->
          <div class="card" style="padding: 20px; background: rgba(10, 16, 31, 0.95); display: flex; align-items: center; justify-content: space-around;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
              <div id="virtual-led-pin13" style="width: 44px; height: 44px; border-radius: 50%; background: #1e293b; border: 3px solid #334155; display: flex; align-items: center; justify-content: center; transition: all 0.25s ease;">
                <span style="font-size: 0.7rem; font-weight: 800; color: #475569;">13</span>
              </div>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">Onboard LED (Pin 13)</span>
            </div>

            <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center;">
              <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">Target MCU</div>
              <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">ATmega328P</div>
              <div style="font-size: 0.72rem; color: var(--status-success); font-weight: 600;">● 16 MHz Crystal · 5V</div>
            </div>

            <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
              <div id="virtual-tx-rx" style="width: 44px; height: 44px; border-radius: var(--radius-md); background: rgba(6, 182, 212, 0.1); border: 2px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; color: var(--accent-cyan); font-weight: 800; font-size: 0.75rem;">
                UART
              </div>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">9600 Baud TX/RX</span>
            </div>
          </div>

          <!-- Virtual Serial Monitor Console -->
          <div class="card" style="flex: 1; padding: 0; display: flex; flex-direction: column; background: #050811; border-color: var(--border-subtle); overflow: hidden;">
            <div style="padding: 8px 14px; background: rgba(15, 23, 42, 0.85); border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); font-family: var(--font-mono);">Virtual Serial Monitor (COM3 - 9600)</span>
              <button class="btn btn-sm btn-secondary" style="padding: 2px 8px; font-size: 0.72rem;" onclick="CodingModule.clearConsole()">Clear</button>
            </div>
            <div id="virtual-serial-output" style="flex: 1; padding: 14px; overflow-y: auto; font-family: var(--font-mono); font-size: 0.82rem; line-height: 1.5; color: #a5f3fc; display: flex; flex-direction: column; gap: 4px;">
              <div style="color: var(--text-dim); font-style: italic;">[Virtual Serial Ready. Click "Verify & Run" to execute sketch.]</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  selectChallenge(id) {
    this.selectedChallengeId = id;
    const challenge = this.challenges.find(c => c.id === id);
    if (challenge) {
      this.activeCode = challenge.starterCode;
    }
    this.render();
    window.soundEngine?.playSwitch();
  },

  resetCode() {
    const challenge = this.challenges.find(c => c.id === this.selectedChallengeId);
    if (challenge) {
      this.activeCode = challenge.starterCode;
      const textarea = document.getElementById('code-editor-textarea');
      if (textarea) textarea.value = this.activeCode;
      window.soundEngine?.playSwitch();
    }
  },

  clearConsole() {
    const consoleEl = document.getElementById('virtual-serial-output');
    if (consoleEl) {
      consoleEl.innerHTML = '<div style="color: var(--text-dim); font-style: italic;">[Console cleared]</div>';
    }
  },

  async compileAndRun() {
    const textarea = document.getElementById('code-editor-textarea');
    if (textarea) this.activeCode = textarea.value;

    const consoleEl = document.getElementById('virtual-serial-output');
    const ledEl = document.getElementById('virtual-led-pin13');

    if (consoleEl) {
      consoleEl.innerHTML = '<div style="color: #fbbf24;">[Compiler] Invoking avr-gcc syntax verification and deterministic checker...</div>';
    }

    const res = await window.api.validateCode(this.selectedChallengeId, this.activeCode);
    this.validationResult = res;

    if (res.success && res.compilationPassed) {
      window.soundEngine?.playSuccess();
      if (ledEl) {
        ledEl.style.background = '#22d3ee';
        ledEl.style.borderColor = '#67e8f9';
        ledEl.style.boxShadow = '0 0 25px #06b6d4';
        const span = ledEl.querySelector('span');
        if (span) span.style.color = '#fff';
      }

      if (consoleEl) {
        consoleEl.innerHTML = res.serialOutput.map(line => `<div>${line}</div>`).join('');
      }

      window.showToast?.(`Challenge Verified! +${res.xpAwarded || 100} XP awarded`, 'success');
      window.app?.refreshTopStats();
    } else {
      window.soundEngine?.playError();
      if (ledEl) {
        ledEl.style.background = '#1e293b';
        ledEl.style.borderColor = '#334155';
        ledEl.style.boxShadow = 'none';
      }

      if (consoleEl) {
        consoleEl.innerHTML = (res.serialOutput || ['❌ Compilation error']).map(line => `<div style="color: #f87171;">${line}</div>`).join('');
      }
      window.showToast?.('Compilation / Logic check failed. Check console for details.', 'error');
    }
  }
};

window.CodingModule = CodingModule;
