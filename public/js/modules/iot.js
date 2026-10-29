// IoT Smart-Home Real-World Simulator Module
const IotModule = {
  // Sensor states
  temperature: 24.5, // °C
  light: 650, // lux
  motion: 0, // 0 = no motion, 1 = motion detected

  // Actuator states
  fanState: 0, // 0 = off, 1 = on
  fanSpeed: 0, // 0 to 100%
  bulbState: 0, // 0 = off, 1 = on
  bulbBrightness: 0, // 0 to 100%
  alarmState: 0, // 0 = disarmed, 1 = armed/tripped

  // Automation Rule Thresholds
  tempThreshold: 28.0,
  lightThreshold: 300,
  securityArmed: true,

  // Mode: 'auto' | 'manual'
  mode: 'auto',

  telemetryLogs: [],

  render() {
    const container = document.getElementById('view-iot');
    if (!container) return;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <h2 style="font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px;">IoT Edge & Smart-Home Simulator</h2>
            <span style="font-size: 0.72rem; padding: 2px 8px; border-radius: var(--radius-full); background: rgba(16, 185, 129, 0.2); color: var(--status-success); font-weight: 700;">
              Real-Time Edge Node Simulation
            </span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Simulate real-world embedded sensors (DHT22, CdS LDR, PIR) triggering autonomous edge-computing automation rules.</p>
        </div>

        <!-- Mode Toggle & Reset -->
        <div style="display: flex; gap: 10px; align-items: center;">
          <div style="display: flex; background: rgba(15, 23, 42, 0.8); padding: 4px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <button class="btn btn-sm ${this.mode === 'auto' ? 'btn-primary' : 'btn-secondary'}" onclick="IotModule.setMode('auto')">
              Auto Rules
            </button>
            <button class="btn btn-sm ${this.mode === 'manual' ? 'btn-primary' : 'btn-secondary'}" onclick="IotModule.setMode('manual')">
              Manual Override
            </button>
          </div>
          <button class="btn btn-sm btn-secondary" onclick="IotModule.resetSensors()">
            Reset
          </button>
        </div>
      </div>

      <!-- Simulation Notice Banner -->
      <div style="background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.25); border-radius: var(--radius-md); padding: 12px 18px; margin-bottom: 20px; font-size: 0.82rem; color: var(--accent-cyan-light); display: flex; align-items: center; gap: 10px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span><strong>Educational Simulation Environment:</strong> Sensor values and actuator responses are calculated in software for ENTC laboratory study. No physical smart-home hardware is implied.</span>
      </div>

      <!-- Main Grid: Sensors (Left) & Actuators / Living Room (Right) -->
      <div class="grid-cols-2" style="gap: 24px; margin-bottom: 24px;">
        <!-- Column 1: Interactive Virtual Sensors -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Temperature Sensor Card -->
          <div class="card" style="padding: 24px; background: rgba(10, 16, 31, 0.95);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(239, 68, 68, 0.15); display: flex; align-items: center; justify-content: center; color: #f87171;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>
                </div>
                <div>
                  <h4 style="font-size: 1rem; font-weight: 700; color: #fff;">DHT22 Temperature Sensor</h4>
                  <span style="font-size: 0.75rem; color: var(--text-dim);">ADC Channel 0 · Range: 10°C to 45°C</span>
                </div>
              </div>
              <span id="iot-temp-display" style="font-family: var(--font-mono); font-size: 1.4rem; font-weight: 800; color: #f87171;">
                ${this.temperature.toFixed(1)}°C
              </span>
            </div>
            <input type="range" min="10" max="45" step="0.5" value="${this.temperature}" style="width: 100%; accent-color: #ef4444; cursor: pointer;" oninput="IotModule.updateTemperature(this.value)">
            <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-dim); margin-top: 6px;">
              <span>10°C (Cold)</span>
              <span>Threshold: ${this.tempThreshold}°C</span>
              <span>45°C (Extreme)</span>
            </div>
          </div>

          <!-- Ambient Light / LDR Card -->
          <div class="card" style="padding: 24px; background: rgba(10, 16, 31, 0.95);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(245, 158, 11, 0.15); display: flex; align-items: center; justify-content: center; color: #fbbf24;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                </div>
                <div>
                  <h4 style="font-size: 1rem; font-weight: 700; color: #fff;">CdS Photoresistor (LDR)</h4>
                  <span style="font-size: 0.75rem; color: var(--text-dim);">ADC Channel 1 · Ambient Illumination</span>
                </div>
              </div>
              <span id="iot-light-display" style="font-family: var(--font-mono); font-size: 1.4rem; font-weight: 800; color: #fbbf24;">
                ${this.light} lux
              </span>
            </div>
            <input type="range" min="20" max="1000" step="10" value="${this.light}" style="width: 100%; accent-color: #f59e0b; cursor: pointer;" oninput="IotModule.updateLight(this.value)">
            <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-dim); margin-top: 6px;">
              <span>20 lux (Pitch Dark)</span>
              <span>Threshold: ${this.lightThreshold} lux</span>
              <span>1000 lux (Full Daylight)</span>
            </div>
          </div>

          <!-- PIR Motion Sensor Card -->
          <div class="card" style="padding: 24px; background: rgba(10, 16, 31, 0.95);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(139, 92, 246, 0.15); display: flex; align-items: center; justify-content: center; color: var(--accent-violet-light);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"></circle><path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2"></path></svg>
                </div>
                <div>
                  <h4 style="font-size: 1rem; font-weight: 700; color: #fff;">Pyroelectric PIR Motion Detector</h4>
                  <span style="font-size: 0.75rem; color: var(--text-dim);">Digital Pin 2 (Interrupt Driven)</span>
                </div>
              </div>
              <button class="btn btn-sm ${this.motion ? 'btn-primary' : 'btn-secondary'}" onclick="IotModule.triggerMotion()">
                ${this.motion ? '⚠️ Motion Active' : 'Trigger Motion'}
              </button>
            </div>
          </div>
        </div>

        <!-- Column 2: Virtual Smart-Home Actuators & Virtual Room -->
        <div class="card" style="padding: 28px; background: rgba(10, 16, 31, 0.95); border-color: var(--border-glow); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 14px; margin-bottom: 24px;">
              <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff;">Smart Actuator Status</h3>
              <span style="font-size: 0.75rem; color: var(--status-success); font-weight: 600;">● Edge Controller Active</span>
            </div>

            <!-- Actuators Grid -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px;">
              <!-- Smart Cooling Fan -->
              <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; text-align: center; display: flex; flex-direction: column; align-items: center;">
                <!-- Animated SVG Fan Blades -->
                <div id="virtual-fan-graphic" style="width: 60px; height: 60px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center;">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${this.fanState ? '#38bdf8' : '#475569'}" stroke-width="2" style="${this.fanState ? `animation: spinFan ${Math.max(0.2, 1.2 - (this.temperature - 20) * 0.04)}s linear infinite;` : ''}">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 2a4 4 0 0 1 4 4v3h-4V2z"></path>
                    <path d="M22 12a4 4 0 0 1-4 4h-3v-4h7z"></path>
                    <path d="M12 22a4 4 0 0 1-4-4v-3h4v7z"></path>
                    <path d="M2 12a4 4 0 0 1 4-4h3v4H2z"></path>
                  </svg>
                </div>
                <div style="font-weight: 700; font-size: 0.88rem;">Cooling Fan</div>
                <div id="fan-state-badge" style="font-size: 0.75rem; font-weight: 700; color: ${this.fanState ? 'var(--accent-cyan)' : 'var(--text-dim)'}; margin-top: 4px;">
                  ${this.fanState ? 'RUNNING (PWM)' : 'STOPPED'}
                </div>
                ${this.mode === 'manual' ? `
                  <button class="btn btn-sm btn-secondary" style="margin-top: 10px; font-size: 0.72rem; padding: 2px 8px;" onclick="IotModule.toggleFanManual()">Toggle</button>
                ` : ''}
              </div>

              <!-- Automated Smart Lighting -->
              <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; text-align: center; display: flex; flex-direction: column; align-items: center;">
                <div id="virtual-bulb-graphic" style="width: 60px; height: 60px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 44px; height: 44px; border-radius: 50%; background: ${this.bulbState ? '#fbbf24' : '#1e293b'}; box-shadow: ${this.bulbState ? '0 0 30px #f59e0b' : 'none'}; border: 2px solid ${this.bulbState ? '#fde68a' : '#334155'}; transition: all 0.25s ease;"></div>
                </div>
                <div style="font-weight: 700; font-size: 0.88rem;">Room Light</div>
                <div id="bulb-state-badge" style="font-size: 0.75rem; font-weight: 700; color: ${this.bulbState ? '#fbbf24' : 'var(--text-dim)'}; margin-top: 4px;">
                  ${this.bulbState ? 'ACTIVE (ON)' : 'OFF (STANDBY)'}
                </div>
                ${this.mode === 'manual' ? `
                  <button class="btn btn-sm btn-secondary" style="margin-top: 10px; font-size: 0.72rem; padding: 2px 8px;" onclick="IotModule.toggleBulbManual()">Toggle</button>
                ` : ''}
              </div>

              <!-- Security Siren Buzzer -->
              <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; text-align: center; display: flex; flex-direction: column; align-items: center;">
                <div style="width: 60px; height: 60px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 44px; height: 44px; border-radius: 50%; background: ${this.alarmState ? '#ef4444' : '#1e293b'}; box-shadow: ${this.alarmState ? '0 0 30px #ef4444' : 'none'}; border: 2px solid ${this.alarmState ? '#fca5a5' : '#334155'}; display: flex; align-items: center; justify-content: center; color: #fff;">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                  </div>
                </div>
                <div style="font-weight: 700; font-size: 0.88rem;">Security Siren</div>
                <div id="alarm-state-badge" style="font-size: 0.75rem; font-weight: 700; color: ${this.alarmState ? 'var(--status-danger)' : 'var(--text-dim)'}; margin-top: 4px;">
                  ${this.alarmState ? 'ALARM TRIPPED!' : 'ARMED (SECURE)'}
                </div>
                ${this.alarmState ? `
                  <button class="btn btn-sm btn-danger" style="margin-top: 10px; font-size: 0.72rem; padding: 2px 8px;" onclick="IotModule.silenceAlarm()">Silence</button>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Automation Rule Logic Explanation -->
          <div style="background: rgba(15, 23, 42, 0.7); border-radius: var(--radius-md); padding: 16px; border: 1px solid var(--border-subtle); font-size: 0.8rem; color: var(--text-muted); line-height: 1.6;">
            <div style="font-weight: 700; color: var(--accent-cyan); margin-bottom: 6px;">Active Autonomous Logic Rules:</div>
            <div>• <strong>Rule 1 (Climate):</strong> IF Temp &gt; ${this.tempThreshold}°C → Turn Fan ON with dynamic PWM frequency.</div>
            <div>• <strong>Rule 2 (Lighting):</strong> IF Ambient Light &lt; ${this.lightThreshold} lux → Turn Nightlight ON.</div>
            <div>• <strong>Rule 3 (Security):</strong> IF Motion Detected while Armed → Trigger Siren Buzzer (Pin 11).</div>
          </div>
        </div>
      </div>

      <!-- Live Telemetry Stream Console -->
      <div class="card" style="padding: 20px; background: #070c17;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          MQTT Edge Telemetry Broadcast Stream
        </h4>
        <div id="iot-telemetry-feed" style="font-family: var(--font-mono); font-size: 0.8rem; max-height: 140px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; color: #a5f3fc;">
          <!-- Logged packets -->
          <div style="color: var(--text-dim);">[MQTT Broker connected on localhost:1883 / topic: 'circuitverse/telemetry']</div>
        </div>
      </div>

      <style>
        @keyframes spinFan {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `;

    this.evaluateRules();
  },

  updateTemperature(val) {
    this.temperature = parseFloat(val);
    const disp = document.getElementById('iot-temp-display');
    if (disp) disp.innerText = `${this.temperature.toFixed(1)}°C`;
    this.evaluateRules('temperature');
  },

  updateLight(val) {
    this.light = parseInt(val, 10);
    const disp = document.getElementById('iot-light-display');
    if (disp) disp.innerText = `${this.light} lux`;
    this.evaluateRules('light');
  },

  triggerMotion() {
    this.motion = 1;
    this.render();
    window.soundEngine?.playSwitch();

    if (this.securityArmed) {
      this.alarmState = 1;
      window.soundEngine?.playAlarm();
    }

    this.evaluateRules('motion');

    // Auto clear motion after 4 seconds
    setTimeout(() => {
      this.motion = 0;
      this.render();
    }, 4000);
  },

  silenceAlarm() {
    this.alarmState = 0;
    this.render();
    window.soundEngine?.playSwitch();
  },

  setMode(m) {
    this.mode = m;
    this.render();
    window.soundEngine?.playSwitch();
  },

  toggleFanManual() {
    this.fanState = this.fanState ? 0 : 1;
    this.render();
    window.soundEngine?.playSwitch();
  },

  toggleBulbManual() {
    this.bulbState = this.bulbState ? 0 : 1;
    this.render();
    window.soundEngine?.playSwitch();
  },

  resetSensors() {
    this.temperature = 24.5;
    this.light = 650;
    this.motion = 0;
    this.alarmState = 0;
    this.mode = 'auto';
    this.render();
    window.soundEngine?.playSwitch();
  },

  evaluateRules(source = 'periodic') {
    let ruleTriggered = null;

    if (this.mode === 'auto') {
      // Rule 1: Temperature Fan
      const shouldFan = this.temperature >= this.tempThreshold;
      if (shouldFan !== !!this.fanState) {
        this.fanState = shouldFan ? 1 : 0;
        ruleTriggered = shouldFan ? 'Temp threshold exceeded -> Fan activated' : 'Temp normal -> Fan deactivated';
      }

      // Rule 2: Light Bulb
      const shouldBulb = this.light < this.lightThreshold;
      if (shouldBulb !== !!this.bulbState) {
        this.bulbState = shouldBulb ? 1 : 0;
        ruleTriggered = shouldBulb ? 'Darkness detected -> Light turned on' : 'Daylight restored -> Light turned off';
      }
    }

    // Immediately update live actuator graphics and badges
    this.updateActuatorDOM();

    // Append telemetry packet
    const now = new Date().toLocaleTimeString();
    const packet = `[${now}] PUBLISH 'home/telemetry' -> { temp: ${this.temperature.toFixed(1)}°C, lux: ${this.light}, motion: ${this.motion}, fan: ${this.fanState}, bulb: ${this.bulbState}, alarm: ${this.alarmState} }`;
    
    const feed = document.getElementById('iot-telemetry-feed');
    if (feed) {
      const line = document.createElement('div');
      line.innerText = packet;
      feed.appendChild(line);
      feed.scrollTop = feed.scrollHeight;
    }

    // Persist to backend
    window.api?.sendIoTTelemetry({
      temperature: this.temperature,
      light: this.light,
      motion: this.motion,
      fanState: this.fanState,
      bulbState: this.bulbState,
      alarmState: this.alarmState,
      ruleTriggered
    });
  },

  updateActuatorDOM() {
    // 1. Fan state & SVG animation update
    const fanBadge = document.getElementById('fan-state-badge');
    const fanGraphic = document.getElementById('virtual-fan-graphic');
    if (fanBadge) {
      fanBadge.innerText = this.fanState ? 'RUNNING (PWM)' : 'STOPPED';
      fanBadge.style.color = this.fanState ? 'var(--accent-cyan)' : 'var(--text-dim)';
    }
    if (fanGraphic) {
      const svg = fanGraphic.querySelector('svg');
      if (svg) {
        svg.style.stroke = this.fanState ? '#38bdf8' : '#475569';
        const spinSpeed = Math.max(0.15, 1.2 - Math.max(0, this.temperature - 20) * 0.04);
        svg.style.animation = this.fanState ? `spinFan ${spinSpeed}s linear infinite` : 'none';
      }
    }

    // 2. Light bulb & glow update
    const bulbBadge = document.getElementById('bulb-state-badge');
    const bulbGraphic = document.getElementById('virtual-bulb-graphic');
    if (bulbBadge) {
      bulbBadge.innerText = this.bulbState ? 'ACTIVE (ON)' : 'OFF (STANDBY)';
      bulbBadge.style.color = this.bulbState ? '#fbbf24' : 'var(--text-dim)';
    }
    if (bulbGraphic) {
      const circle = bulbGraphic.querySelector('div');
      if (circle) {
        circle.style.background = this.bulbState ? '#fbbf24' : '#1e293b';
        circle.style.boxShadow = this.bulbState ? '0 0 30px #f59e0b' : 'none';
        circle.style.borderColor = this.bulbState ? '#fde68a' : '#334155';
      }
    }
  }
};

window.IotModule = IotModule;
