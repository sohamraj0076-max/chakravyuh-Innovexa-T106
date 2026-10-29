// Virtual Electronics Lab Module
const LabModule = {
  currentTab: 'gates', // 'gates' | 'combinational' | 'ohms'
  selectedGate: 'AND',
  inputA: 0,
  inputB: 0,

  // Combinational mode inputs
  combA: 0,
  combB: 0,

  // Ohm's Law circuit state
  voltage: 5.0,
  resistance: 220,
  ledForwardVoltage: 2.0,

  init() {
    this.render();
  },

  render() {
    const container = document.getElementById('view-lab');
    if (!container) return;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px;">Virtual Electronics Workbench</h2>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Interactive real-time circuit simulation, logic gate truth-table verification, and Ohm's Law experiments.</p>
        </div>
        <!-- Lab Tabs -->
        <div style="display: flex; gap: 6px; background: rgba(15, 23, 42, 0.8); padding: 4px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <button class="btn btn-sm ${this.currentTab === 'gates' ? 'btn-primary' : 'btn-secondary'}" onclick="LabModule.switchTab('gates')">
            Logic Gates
          </button>
          <button class="btn btn-sm ${this.currentTab === 'combinational' ? 'btn-primary' : 'btn-secondary'}" onclick="LabModule.switchTab('combinational')">
            Half Adder (Combo)
          </button>
          <button class="btn btn-sm ${this.currentTab === 'ohms' ? 'btn-primary' : 'btn-secondary'}" onclick="LabModule.switchTab('ohms')">
            Ohm's Law & LED
          </button>
        </div>
      </div>

      <div id="lab-workbench-content"></div>
    `;

    this.renderActiveTab();
  },

  switchTab(tab) {
    this.currentTab = tab;
    this.render();
    window.soundEngine?.playSwitch();
  },

  renderActiveTab() {
    const target = document.getElementById('lab-workbench-content');
    if (!target) return;

    if (this.currentTab === 'gates') {
      this.renderLogicGates(target);
    } else if (this.currentTab === 'combinational') {
      this.renderCombinational(target);
    } else if (this.currentTab === 'ohms') {
      this.renderOhmsLaw(target);
    }
  },

  // --- LOGIC GATE LAB ---
  renderLogicGates(target) {
    const output = this.calculateGateOutput(this.selectedGate, this.inputA, this.inputB);
    const truthTable = this.getGateTruthTable(this.selectedGate);

    target.innerHTML = `
      <!-- Gate Selector Bar -->
      <div style="display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; align-items: center;">
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-right: 8px;">Select Gate:</span>
        ${['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'].map(gate => `
          <button class="btn btn-sm ${this.selectedGate === gate ? 'btn-primary' : 'btn-secondary'}" onclick="LabModule.setGate('${gate}')">
            ${gate}
          </button>
        `).join('')}
        <button class="btn btn-sm btn-danger" style="margin-left: auto;" onclick="LabModule.resetGateInputs()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
          Reset Inputs
        </button>
      </div>

      <div class="grid-cols-3">
        <!-- Interactive Schematic Sandbox (2 cols) -->
        <div class="card" style="grid-column: span 2; padding: 32px; display: flex; flex-direction: column; justify-content: space-between; min-height: 420px; background: rgba(10, 16, 31, 0.95); border-color: var(--border-glow);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-weight: 800; font-size: 1.2rem; color: #fff;">${this.selectedGate} Gate Simulation</span>
              <span style="font-size: 0.75rem; color: var(--accent-cyan); background: rgba(6, 182, 212, 0.15); padding: 2px 8px; border-radius: var(--radius-sm); font-family: var(--font-mono);">
                ${this.getGateFormula(this.selectedGate)}
              </span>
            </div>
            <span style="font-size: 0.75rem; color: var(--status-success); font-weight: 600;">● Active Simulation Engine</span>
          </div>

          <!-- Schematic Canvas Representation -->
          <div style="display: flex; align-items: center; justify-content: space-around; padding: 40px 10px;">
            <!-- Inputs Column -->
            <div style="display: flex; flex-direction: column; gap: 36px; align-items: center;">
              <!-- Switch A -->
              <div style="display: flex; align-items: center; gap: 14px;">
                <button onclick="LabModule.toggleInput('A')" style="width: 54px; height: 54px; border-radius: var(--radius-md); background: ${this.inputA ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)'}; border: 2px solid ${this.inputA ? 'var(--accent-cyan)' : 'var(--border-subtle)'}; color: ${this.inputA ? '#fff' : 'var(--text-dim)'}; font-size: 1.4rem; font-weight: 800; cursor: pointer; transition: all 0.2s ease; box-shadow: ${this.inputA ? 'var(--shadow-glow-cyan)' : 'none'};">
                  ${this.inputA}
                </button>
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem;">Input A</div>
                  <div style="font-size: 0.75rem; color: ${this.inputA ? 'var(--accent-cyan)' : 'var(--text-dim)'};">${this.inputA ? 'HIGH (+5V)' : 'LOW (0V)'}</div>
                </div>
              </div>

              <!-- Switch B (Only for 2-input gates) -->
              ${this.selectedGate !== 'NOT' ? `
                <div style="display: flex; align-items: center; gap: 14px;">
                  <button onclick="LabModule.toggleInput('B')" style="width: 54px; height: 54px; border-radius: var(--radius-md); background: ${this.inputB ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)'}; border: 2px solid ${this.inputB ? 'var(--accent-cyan)' : 'var(--border-subtle)'}; color: ${this.inputB ? '#fff' : 'var(--text-dim)'}; font-size: 1.4rem; font-weight: 800; cursor: pointer; transition: all 0.2s ease; box-shadow: ${this.inputB ? 'var(--shadow-glow-cyan)' : 'none'};">
                    ${this.inputB}
                  </button>
                  <div>
                    <div style="font-weight: 700; font-size: 0.95rem;">Input B</div>
                    <div style="font-size: 0.75rem; color: ${this.inputB ? 'var(--accent-cyan)' : 'var(--text-dim)'};">${this.inputB ? 'HIGH (+5V)' : 'LOW (0V)'}</div>
                  </div>
                </div>
              ` : `
                <div style="color: var(--text-dim); font-size: 0.8rem; font-style: italic;">(Single input NOT gate)</div>
              `}
            </div>

            <!-- Wire & Gate Center Graphic -->
            <div style="display: flex; align-items: center; position: relative;">
              <!-- Animated Traces SVG -->
              <svg width="220" height="160" viewBox="0 0 220 160">
                <!-- Trace A -->
                <path d="M 10 40 L 70 40 L 90 60" stroke="${this.inputA ? 'var(--accent-cyan)' : '#1e293b'}" stroke-width="4" fill="none" stroke-linecap="round" />
                ${this.inputA ? '<circle cx="50" cy="40" r="4" fill="#22d3ee" filter="drop-shadow(0 0 4px #06b6d4)" />' : ''}

                <!-- Trace B -->
                ${this.selectedGate !== 'NOT' ? `
                  <path d="M 10 120 L 70 120 L 90 100" stroke="${this.inputB ? 'var(--accent-cyan)' : '#1e293b'}" stroke-width="4" fill="none" stroke-linecap="round" />
                  ${this.inputB ? '<circle cx="50" cy="120" r="4" fill="#22d3ee" filter="drop-shadow(0 0 4px #06b6d4)" />' : ''}
                ` : ''}

                <!-- Gate Symbol Box -->
                <rect x="85" y="45" width="70" height="70" rx="14" fill="#111d3d" stroke="${output ? 'var(--accent-cyan)' : 'var(--border-subtle)'}" stroke-width="2.5" />
                <text x="120" y="87" fill="#fff" font-size="16" font-weight="800" text-anchor="middle" font-family="sans-serif">${this.selectedGate}</text>

                <!-- Output Trace -->
                <path d="M 155 80 L 210 80" stroke="${output ? 'var(--accent-cyan)' : '#1e293b'}" stroke-width="4" fill="none" stroke-linecap="round" />
                ${output ? '<circle cx="185" cy="80" r="4" fill="#22d3ee" filter="drop-shadow(0 0 4px #06b6d4)" />' : ''}
              </svg>
            </div>

            <!-- Output Indicator Column -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 14px;">
              <!-- LED Lamp -->
              <div style="width: 70px; height: 70px; border-radius: 50%; background: ${output ? 'radial-gradient(circle, #22d3ee 20%, #06b6d4 60%, #0891b2 100%)' : '#0f172a'}; border: 3px solid ${output ? '#67e8f9' : '#334155'}; display: flex; align-items: center; justify-content: center; box-shadow: ${output ? '0 0 35px #06b6d4, 0 0 60px rgba(6, 182, 212, 0.4)' : 'none'}; transition: all 0.25s ease;">
                <span style="font-size: 1.6rem; font-weight: 800; color: ${output ? '#fff' : '#475569'};">${output}</span>
              </div>
              <div style="text-align: center;">
                <div style="font-weight: 700; font-size: 0.95rem;">LED Output Y</div>
                <div style="font-size: 0.78rem; font-weight: 700; color: ${output ? 'var(--status-success)' : 'var(--text-dim)'};">
                  ${output ? 'LOGIC HIGH (1)' : 'LOGIC LOW (0)'}
                </div>
              </div>
            </div>
          </div>

          <div style="font-size: 0.8rem; color: var(--text-dim); text-align: center; border-top: 1px solid var(--border-subtle); padding-top: 12px;">
            Tip: Click switch buttons <strong>A</strong> and <strong>B</strong> to toggle voltage states and observe instant gate evaluation.
          </div>
        </div>

        <!-- Real-Time Truth Table (1 col) -->
        <div class="card" style="padding: 24px; background: var(--bg-card);">
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 6px;">Dynamic Truth Table</h3>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 16px;">The active input row is dynamically highlighted in cyan.</p>

          <table style="width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 0.88rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-subtle); color: var(--text-muted); text-align: center;">
                <th style="padding: 10px;">A</th>
                ${this.selectedGate !== 'NOT' ? '<th style="padding: 10px;">B</th>' : ''}
                <th style="padding: 10px; color: var(--accent-cyan);">Output Y</th>
              </tr>
            </thead>
            <tbody>
              ${truthTable.map(row => {
                const isActive = (this.selectedGate === 'NOT') ? (row.a === this.inputA) : (row.a === this.inputA && row.b === this.inputB);
                return `
                  <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center; background: ${isActive ? 'rgba(6, 182, 212, 0.18)' : 'transparent'}; border-left: ${isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent'}; transition: background 0.2s ease;">
                    <td style="padding: 10px; font-weight: ${isActive ? '800' : '400'}; color: ${isActive ? '#fff' : 'var(--text-muted)'};">${row.a}</td>
                    ${this.selectedGate !== 'NOT' ? `<td style="padding: 10px; font-weight: ${isActive ? '800' : '400'}; color: ${isActive ? '#fff' : 'var(--text-muted)'};">${row.b}</td>` : ''}
                    <td style="padding: 10px; font-weight: 800; color: ${row.y ? 'var(--accent-cyan-light)' : 'var(--text-dim)'};">${row.y}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div style="margin-top: 24px; padding: 14px; background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-md); font-size: 0.8rem; color: var(--text-muted);">
            <strong style="color: var(--accent-cyan);">Gate Logic Rule:</strong><br>
            ${this.getGateDescription(this.selectedGate)}
          </div>
        </div>
      </div>
    `;
  },

  // --- COMBINATIONAL HALF ADDER LAB ---
  renderCombinational(target) {
    const sum = this.combA ^ this.combB;
    const carry = this.combA & this.combB;

    target.innerHTML = `
      <div class="card" style="padding: 32px; background: rgba(10, 16, 31, 0.95); border-color: var(--border-glow); margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 14px; margin-bottom: 24px;">
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff;">Binary Half Adder Combinational Circuit</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem;">Calculates 1-bit arithmetic sum: Sum = A ⊕ B, Carry Out = A · B</p>
          </div>
          <button class="btn btn-sm btn-secondary" onclick="LabModule.recordExperiment('Half Adder')">
            Save Experiment Log (+10 XP)
          </button>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap; gap: 30px;">
          <!-- Inputs A & B -->
          <div style="display: flex; flex-direction: column; gap: 24px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <button onclick="LabModule.toggleComb('A')" style="width: 50px; height: 50px; border-radius: var(--radius-md); background: ${this.combA ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)'}; border: 2px solid ${this.combA ? 'var(--accent-cyan)' : 'var(--border-subtle)'}; color: #fff; font-size: 1.3rem; font-weight: 800; cursor: pointer;">
                ${this.combA}
              </button>
              <span style="font-weight: 700;">Binary Input A</span>
            </div>

            <div style="display: flex; align-items: center; gap: 12px;">
              <button onclick="LabModule.toggleComb('B')" style="width: 50px; height: 50px; border-radius: var(--radius-md); background: ${this.combB ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)'}; border: 2px solid ${this.combB ? 'var(--accent-cyan)' : 'var(--border-subtle)'}; color: #fff; font-size: 1.3rem; font-weight: 800; cursor: pointer;">
                ${this.combB}
              </button>
              <span style="font-weight: 700;">Binary Input B</span>
            </div>
          </div>

          <!-- Schematic Representation -->
          <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 20px; min-width: 300px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <span style="font-family: var(--font-mono); color: var(--accent-cyan); font-weight: 700;">XOR Gate (Sum):</span>
              <span style="padding: 4px 12px; border-radius: var(--radius-full); background: ${sum ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.05)'}; color: ${sum ? 'var(--accent-cyan-light)' : 'var(--text-dim)'}; font-weight: 800;">
                SUM = ${sum}
              </span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-family: var(--font-mono); color: var(--accent-violet-light); font-weight: 700;">AND Gate (Carry):</span>
              <span style="padding: 4px 12px; border-radius: var(--radius-full); background: ${carry ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)'}; color: ${carry ? 'var(--accent-violet-light)' : 'var(--text-dim)'}; font-weight: 800;">
                CARRY = ${carry}
              </span>
            </div>
          </div>

          <!-- Arithmetic Result Display -->
          <div style="text-align: center; background: rgba(6, 182, 212, 0.08); border: 1px solid var(--border-glow); border-radius: var(--radius-lg); padding: 24px 36px;">
            <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">Total Arithmetic Value</div>
            <div style="font-size: 2.2rem; font-weight: 900; font-family: var(--font-mono); color: #fff;">
              ${this.combA} + ${this.combB} = ${carry}${sum}₂ (${this.combA + this.combB}₁₀)
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // --- OHM'S LAW & LED CIRCUIT LAB ---
  renderOhmsLaw(target) {
    const netVoltage = Math.max(0, this.voltage - this.ledForwardVoltage);
    const currentA = netVoltage / this.resistance;
    const currentmA = (currentA * 1000).toFixed(1);
    const powermW = (this.voltage * currentA * 1000).toFixed(1);
    const isDangerous = currentmA > 25;
    const brightnessPct = Math.min(100, Math.round((currentmA / 20) * 100));

    target.innerHTML = `
      <div class="grid-cols-3">
        <!-- Controls & Schematic (2 cols) -->
        <div class="card" style="grid-column: span 2; padding: 28px; background: rgba(10, 16, 31, 0.95); border-color: var(--border-glow);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 14px; margin-bottom: 24px;">
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff;">Interactive Ohm's Law & LED Driver</h3>
              <p style="color: var(--text-muted); font-size: 0.85rem;">Formula: Current I = (V_supply - V_forward) / R_limiter</p>
            </div>
            <button class="btn btn-sm btn-secondary" onclick="LabModule.recordExperiment('Ohms Law')">
              Save Experiment (+10 XP)
            </button>
          </div>

          <!-- Interactive Sliders -->
          <div style="display: flex; flex-direction: column; gap: 24px; margin-bottom: 30px;">
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <label style="font-weight: 700; font-size: 0.9rem;">Power Supply Voltage (V):</label>
                <span style="font-family: var(--font-mono); font-weight: 800; color: var(--accent-cyan);">${this.voltage.toFixed(1)} Volts</span>
              </div>
              <input type="range" min="0" max="12" step="0.5" value="${this.voltage}" style="width: 100%; accent-color: var(--accent-cyan); cursor: pointer;" oninput="LabModule.updateVoltage(this.value)">
              <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-dim); margin-top: 4px;">
                <span>0V (GND)</span>
                <span>3.3V (Logic)</span>
                <span>5.0V (Standard)</span>
                <span>9.0V (Battery)</span>
                <span>12.0V (Max)</span>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <label style="font-weight: 700; font-size: 0.9rem;">Current Limiting Resistor (R):</label>
                <span style="font-family: var(--font-mono); font-weight: 800; color: #fbbf24;">${this.resistance} Ω</span>
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${[100, 220, 330, 470, 1000, 2200, 10000].map(r => `
                  <button class="btn btn-sm ${this.resistance === r ? 'btn-primary' : 'btn-secondary'}" onclick="LabModule.setResistance(${r})">
                    ${r >= 1000 ? (r / 1000) + 'k' : r} Ω
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Interactive LED & Meters -->
          <div style="display: flex; align-items: center; justify-content: space-around; background: rgba(15, 23, 42, 0.7); border-radius: var(--radius-md); padding: 24px; border: 1px solid var(--border-subtle);">
            <!-- Virtual Glowing LED -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
              <div style="width: 70px; height: 70px; border-radius: 50%; background: ${brightnessPct > 0 ? (isDangerous ? '#ef4444' : '#22d3ee') : '#1e293b'}; opacity: ${Math.max(0.2, brightnessPct / 100)}; box-shadow: ${brightnessPct > 0 ? (isDangerous ? '0 0 40px #ef4444' : '0 0 35px #06b6d4') : 'none'}; border: 3px solid ${isDangerous ? '#f87171' : '#67e8f9'}; transition: all 0.2s ease;"></div>
              <div style="text-align: center;">
                <div style="font-weight: 700; font-size: 0.9rem;">LED Brightness</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${brightnessPct}% Output</div>
              </div>
            </div>

            <!-- Current & Power Gauges -->
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Forward Current</div>
                <div style="font-size: 1.8rem; font-weight: 800; font-family: var(--font-mono); color: ${isDangerous ? 'var(--status-danger)' : 'var(--accent-cyan)'};">
                  ${currentmA} <span style="font-size: 1rem;">mA</span>
                </div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Circuit Power Dissipation</div>
                <div style="font-size: 1.3rem; font-weight: 800; font-family: var(--font-mono); color: #fff;">
                  ${powermW} <span style="font-size: 0.85rem; color: var(--text-dim);">mW</span>
                </div>
              </div>
            </div>
          </div>

          ${isDangerous ? `
            <div style="margin-top: 16px; padding: 12px 16px; background: rgba(239, 68, 68, 0.15); border: 1px solid var(--status-danger); border-radius: var(--radius-md); color: #fca5a5; font-size: 0.85rem; display: flex; align-items: center; gap: 10px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <span><strong>Warning: Excessive Current (>25mA)!</strong> In a physical circuit, this current will destroy standard 5mm LEDs through thermal degradation. Increase resistance!</span>
            </div>
          ` : ''}
        </div>

        <!-- Formula Breakdown Card (1 col) -->
        <div class="card" style="padding: 24px; background: var(--bg-card);">
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 12px;">Step-by-Step Calculation</h3>
          
          <div style="font-family: var(--font-mono); font-size: 0.82rem; background: rgba(0, 0, 0, 0.3); padding: 14px; border-radius: var(--radius-md); margin-bottom: 16px; line-height: 1.6;">
            <div style="color: var(--accent-cyan); font-weight: 700;">1. Net Resistor Drop:</div>
            <div>V_res = V_supply - V_led</div>
            <div>V_res = ${this.voltage.toFixed(1)}V - ${this.ledForwardVoltage.toFixed(1)}V = ${netVoltage.toFixed(1)}V</div>
            <br>
            <div style="color: #fbbf24; font-weight: 700;">2. Ohm's Law Current:</div>
            <div>I = V_res / R</div>
            <div>I = ${netVoltage.toFixed(1)}V / ${this.resistance}Ω</div>
            <div>I = ${(currentA * 1000).toFixed(2)} mA</div>
            <br>
            <div style="color: var(--accent-violet-light); font-weight: 700;">3. Power Dissipation:</div>
            <div>P = V × I = ${powermW} mW</div>
          </div>

          <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.5;">
            <strong>Design Rule:</strong> Standard indicators (Red/Green/Blue) operate safely between <strong>10 mA and 20 mA</strong>.
          </div>
        </div>
      </div>
    `;
  },

  // Logic helpers
  calculateGateOutput(gate, a, b) {
    switch (gate) {
      case 'AND': return (a && b) ? 1 : 0;
      case 'OR': return (a || b) ? 1 : 0;
      case 'NOT': return a ? 0 : 1;
      case 'NAND': return !(a && b) ? 1 : 0;
      case 'NOR': return !(a || b) ? 1 : 0;
      case 'XOR': return (a ^ b) ? 1 : 0;
      case 'XNOR': return !(a ^ b) ? 1 : 0;
      default: return 0;
    }
  },

  getGateTruthTable(gate) {
    if (gate === 'NOT') {
      return [
        { a: 0, y: this.calculateGateOutput('NOT', 0, 0) },
        { a: 1, y: this.calculateGateOutput('NOT', 1, 0) }
      ];
    }
    return [
      { a: 0, b: 0, y: this.calculateGateOutput(gate, 0, 0) },
      { a: 0, b: 1, y: this.calculateGateOutput(gate, 0, 1) },
      { a: 1, b: 0, y: this.calculateGateOutput(gate, 1, 0) },
      { a: 1, b: 1, y: this.calculateGateOutput(gate, 1, 1) }
    ];
  },

  getGateFormula(gate) {
    switch (gate) {
      case 'AND': return 'Y = A · B';
      case 'OR': return 'Y = A + B';
      case 'NOT': return 'Y = A\'';
      case 'NAND': return 'Y = (A · B)\'';
      case 'NOR': return 'Y = (A + B)\'';
      case 'XOR': return 'Y = A ⊕ B';
      case 'XNOR': return 'Y = (A ⊕ B)\'';
      default: return '';
    }
  },

  getGateDescription(gate) {
    switch (gate) {
      case 'AND': return 'Outputs 1 only when all inputs are 1. Used in enable logic and address decoding.';
      case 'OR': return 'Outputs 1 when at least one input is 1. Used in alarm monitoring and logical flags.';
      case 'NOT': return 'Inverts state: 1 becomes 0 and 0 becomes 1.';
      case 'NAND': return 'Universal gate: outputs 0 only when both inputs are 1.';
      case 'NOR': return 'Universal gate: outputs 1 only when both inputs are 0.';
      case 'XOR': return 'Outputs 1 when inputs are different. Essential for binary addition and parity check.';
      case 'XNOR': return 'Outputs 1 when inputs are identical. Equivalence checker.';
      default: return '';
    }
  },

  setGate(gate) {
    this.selectedGate = gate;
    this.renderActiveTab();
    window.soundEngine?.playSwitch();
  },

  toggleInput(which) {
    if (which === 'A') this.inputA = this.inputA ? 0 : 1;
    if (which === 'B') this.inputB = this.inputB ? 0 : 1;
    this.renderActiveTab();
    window.soundEngine?.playSwitch();
  },

  resetGateInputs() {
    this.inputA = 0;
    this.inputB = 0;
    this.renderActiveTab();
    window.soundEngine?.playSwitch();
  },

  toggleComb(which) {
    if (which === 'A') this.combA = this.combA ? 0 : 1;
    if (which === 'B') this.combB = this.combB ? 0 : 1;
    this.renderActiveTab();
    window.soundEngine?.playSwitch();
  },

  updateVoltage(val) {
    this.voltage = parseFloat(val);
    this.renderActiveTab();
  },

  setResistance(r) {
    this.resistance = r;
    this.renderActiveTab();
    window.soundEngine?.playSwitch();
  },

  async recordExperiment(type) {
    const res = await window.api.recordLabExperiment(type, {
      gate: this.selectedGate,
      inputs: { A: this.inputA, B: this.inputB }
    });
    if (res.success) {
      window.soundEngine?.playSuccess();
      window.showToast?.(`Experiment logged in SQLite! +${res.xpAwarded} XP`, 'success');
      window.app?.refreshTopStats();
    }
  }
};

window.LabModule = LabModule;
