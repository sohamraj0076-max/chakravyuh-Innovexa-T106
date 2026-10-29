// AI Learning Assistant Module
const AiAssistantModule = {
  messages: [
    {
      sender: 'assistant',
      time: 'Just now',
      source: 'CircuitVerse Curated ENTC Knowledge Engine',
      text: `### ⚡ Welcome to CircuitVerse AI Knowledge Core!

I am your **dedicated ENTC AI Learning Assistant**, engineered to explain complex Electronics and Telecommunication Engineering concepts with crystal clarity.

I can guide you through:
* **Digital Electronics**: Logic gates, Boolean algebra, De Morgan's laws, Karnaugh maps.
* **Telecommunications**: Nyquist sampling rate, AM/FM/QAM modulation, Shannon capacity.
* **Embedded Tech**: Arduino programming, GPIO, ADC conversion, Timer interrupts, I2C/SPI buses.
* **Digital Signal Processing**: Fourier Transform (FFT), FIR vs IIR filters, aliasing.
* **IoT & Sensors**: MQTT publish-subscribe, edge sensors, telemetry.
* **Circuit Troubleshooting**: Ohm's Law (\`V=IR\`), LED resistor sizing.

*Click any prompt chip below or type your question in the chat!*`
    }
  ],

  render() {
    const container = document.getElementById('view-ai');
    if (!container) return;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <h2 style="font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px;">ENTC AI Learning Assistant</h2>
            <span style="font-size: 0.72rem; padding: 2px 8px; border-radius: var(--radius-full); background: rgba(139, 92, 246, 0.2); color: var(--accent-violet-light); font-weight: 700;">
              Local Knowledge Engine
            </span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Ask any theoretical or practical ENTC engineering question for instant, structured explanations.</p>
        </div>
        <button class="btn btn-sm btn-secondary" onclick="AiAssistantModule.clearHistory()">
          Clear Chat
        </button>
      </div>

      <!-- Quick Suggestion Prompt Chips -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 20px;">
        <button class="btn btn-sm btn-secondary" onclick="AiAssistantModule.sendPrompt('Explain Nyquist-Shannon Sampling Theorem with an example')">
          ⚡ Nyquist Theorem & Aliasing
        </button>
        <button class="btn btn-sm btn-secondary" onclick="AiAssistantModule.sendPrompt('Why are NAND and NOR called Universal Gates?')">
          🔌 Universal Logic Gates
        </button>
        <button class="btn btn-sm btn-secondary" onclick="AiAssistantModule.sendPrompt('What is the difference between I2C and SPI buses?')">
          📡 I2C vs SPI Protocols
        </button>
        <button class="btn btn-sm btn-secondary" onclick="AiAssistantModule.sendPrompt('How do I calculate a current limiting resistor for an LED using Ohms law?')">
          💡 LED Resistor Calculation
        </button>
        <button class="btn btn-sm btn-secondary" onclick="AiAssistantModule.sendPrompt('Explain the difference between AM and FM modulation')">
          📻 AM vs FM Modulation
        </button>
        <button class="btn btn-sm btn-secondary" onclick="AiAssistantModule.sendPrompt('How does the MQTT protocol work in IoT?')">
          🌐 MQTT IoT Broker
        </button>
      </div>

      <!-- Chat Workspace Card -->
      <div class="card" style="padding: 0; display: flex; flex-direction: column; height: 600px; background: rgba(10, 16, 31, 0.95); border-color: var(--border-glow); overflow: hidden;">
        <!-- Engine Header -->
        <div style="padding: 14px 20px; background: rgba(15, 23, 42, 0.9); border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: var(--status-success); box-shadow: 0 0 10px var(--status-success);"></div>
            <span style="font-weight: 700; font-size: 0.88rem; color: #fff;">CircuitVerse Knowledge Core v1.0</span>
          </div>
          <span style="font-size: 0.74rem; color: var(--accent-cyan-light); font-weight: 600; background: rgba(6, 182, 212, 0.1); padding: 3px 8px; border-radius: var(--radius-sm);">Rule-Based Educational Assistant (Deterministic Local Knowledge Base — Not an LLM)</span>
        </div>

        <!-- Chat Scroll Area -->
        <div id="ai-chat-messages" style="flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 18px;">
          <!-- Dynamically populated -->
        </div>

        <!-- Input Bar -->
        <div style="padding: 16px 20px; background: rgba(15, 23, 42, 0.95); border-top: 1px solid var(--border-subtle); display: flex; gap: 12px; align-items: center;">
          <input type="text" id="ai-input-field" placeholder="Ask about logic gates, modulation, microcontrollers, Fourier analysis, or circuits..." style="flex: 1; padding: 12px 18px; background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: #fff; font-size: 0.92rem; outline: none;" onkeydown="if(event.key === 'Enter') AiAssistantModule.handleSubmit()">
          <button class="btn btn-primary" id="ai-send-btn" onclick="AiAssistantModule.handleSubmit()" style="padding: 12px 22px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            Ask AI
          </button>
        </div>
      </div>
    `;

    this.renderMessages();
  },

  renderMessages() {
    const container = document.getElementById('ai-chat-messages');
    if (!container) return;

    container.innerHTML = this.messages.map(m => {
      const isUser = m.sender === 'user';
      return `
        <div style="display: flex; gap: 14px; align-items: flex-start; max-width: 92%; ${isUser ? 'margin-left: auto; flex-direction: row-reverse;' : ''}">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: ${isUser ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-violet))' : 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; color: #fff; flex-shrink: 0; box-shadow: ${isUser ? 'var(--shadow-glow-violet)' : 'var(--shadow-glow-cyan)'};">
            ${isUser ? 'YOU' : 'AI'}
          </div>
          <div style="background: ${isUser ? 'rgba(59, 130, 246, 0.15)' : 'rgba(15, 23, 42, 0.85)'}; border: 1px solid ${isUser ? 'rgba(59, 130, 246, 0.3)' : 'var(--border-subtle)'}; border-radius: var(--radius-md); padding: 16px 20px; color: var(--text-main); font-size: 0.92rem; line-height: 1.6; word-break: break-word;">
            ${!isUser && m.source ? `
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">
                <span style="font-size: 0.72rem; color: var(--accent-cyan); font-weight: 700;">${m.source}</span>
                <span style="font-size: 0.7rem; color: var(--text-dim);">${m.time}</span>
              </div>
            ` : ''}
            <div>${this.formatMarkdown(m.text)}</div>
          </div>
        </div>
      `;
    }).join('');

    container.scrollTop = container.scrollHeight;
  },

  formatMarkdown(text) {
    if (!text) return '';
    // Format headers
    let html = text
      .replace(/^### (.*$)/gim, '<h4 style="font-size: 1.05rem; font-weight: 800; color: #fff; margin: 10px 0 6px;">$1</h4>')
      .replace(/^#### (.*$)/gim, '<h5 style="font-size: 0.92rem; font-weight: 700; color: var(--accent-cyan); margin: 8px 0 4px;">$1</h5>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fff;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color: var(--accent-cyan-light);">$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre style="background: rgba(0, 0, 0, 0.4); padding: 12px; border-radius: 8px; font-family: var(--font-mono); font-size: 0.85rem; color: #38bdf8; overflow-x: auto; margin: 8px 0;"><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code style="background: rgba(255, 255, 255, 0.08); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-cyan);">$1</code>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n\* /g, '<br>• ');

    return html;
  },

  async handleSubmit() {
    const input = document.getElementById('ai-input-field');
    if (!input) return;
    const query = input.value.trim();
    if (!query) {
      window.showToast?.('Please enter an ENTC engineering question or pick a prompt chip.', 'warning');
      input.focus();
      return;
    }

    input.value = '';
    await this.processQuery(query);
  },

  async sendPrompt(text) {
    await this.processQuery(text);
  },

  async processQuery(query) {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Push user message
    this.messages.push({
      sender: 'user',
      time: now,
      text: query
    });
    this.renderMessages();
    window.soundEngine?.playSwitch();

    // Show temporary thinking state
    const thinkingIdx = this.messages.length;
    this.messages.push({
      sender: 'assistant',
      time: now,
      source: 'Analyzing query across ENTC Knowledge Graphs...',
      text: '⚡ Processing query...'
    });
    this.renderMessages();

    // Fetch from backend API
    const response = await window.api.sendAiChat(query);
    this.messages[thinkingIdx] = {
      sender: 'assistant',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: response.source || 'CircuitVerse Curated ENTC Knowledge Engine',
      text: response.response || 'Sorry, I could not process your query at this time.'
    };

    this.renderMessages();
    window.soundEngine?.playGateHigh();
  },

  clearHistory() {
    this.messages = [this.messages[0]];
    this.renderMessages();
  }
};

window.AiAssistantModule = AiAssistantModule;
