# CIRCUITVERSE AI — OFFICIAL JUDGE & DEMONSTRATION GUIDE
> **Competition:** CHAKRAVYUH — AI Vibe Coding Challenge  
> **Problem Statement:** Smart ENTC Learning & Innovation Platform  
> **Tagline:** *Learn Circuits. Simulate Ideas. Build Intelligence.*  
> **Directory:** `C:\Users\ADMIN\.gemini\antigravity\scratch\circuitverse-ai`

---

## ⚡ 1. QUICK STARTUP (WINDOWS)

### Option A: One-Click Launcher (Recommended)
1. Open Windows File Explorer and navigate to:
   `C:\Users\ADMIN\.gemini\antigravity\scratch\circuitverse-ai`
2. Double-click **`start.bat`**.
3. Open your browser to:
   👉 **`http://localhost:3000`**

### Option B: Terminal Command (PowerShell or CMD)
```powershell
cd C:\Users\ADMIN\.gemini\antigravity\scratch\circuitverse-ai
node server.js
```
*(If `node` is not in your global system PATH, run with: `& "C:\Users\ADMIN\AppData\Local\Programs\nodejs\node.exe" server.js`)*

---

## 🔧 2. TROUBLESHOOTING COMMON STARTUP ISSUES

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `'node' is not recognized` | Node.js directory is not in system PATH | Double-click `start.bat` (which automatically checks `C:\Users\ADMIN\AppData\Local\Programs\nodejs\node.exe`) or run via full path. |
| `EADDRINUSE: port 3000 busy` | Another process is occupying port 3000 | Kill existing process: `Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force` or run with custom port: `$env:PORT=3001; node server.js`. |
| Browser shows blank screen | Browser cached older script assets | Press `Ctrl + Shift + R` or `Ctrl + F5` to perform a hard refresh. |
| Resetting all demo progress | Need to test from fresh state | Click the red **"Reset Demo Data"** button in the **Progress & Badges** tab. |

---

## ⏱️ 3. RECOMMENDED 3-MINUTE JUDGE DEMONSTRATION SEQUENCE

### Minute 1: Platform Overview & Virtual Electronics Workbench
1. **Dashboard:** Start on the Home Dashboard (`http://localhost:3000`). Show the modern dark navy aesthetic, live SQLite database connectivity badge, XP progression meter, and recent activity feed.
2. **Virtual Lab — Logic Gates:**
   - Click **Virtual Electronics Lab** in the sidebar.
   - Toggle **Input A** and **Input B** on the `AND` gate.
   - **Observe:** Output LED stays dark (0) for (0,0), (0,1), and (1,0), and illuminates cyan (1) only when both inputs are 1.
   - Point out the **dynamic Truth Table** highlighting the active input row in cyan in real-time.
3. **Virtual Lab — Ohm's Law & LED Driver:**
   - Click the **Ohm's Law & LED** tab.
   - Adjust the voltage slider to **12.0V** and select the **100 Ω** resistor.
   - **Observe:** The current jumps to **100 mA**, the LED glows red, and a prominent **High-Current Burnout Warning (>25mA)** alerts the student to thermal runaway danger.

### Minute 2: IoT Smart-Home Simulation & Embedded Coding Playground
4. **IoT Smart-Home Simulator:**
   - Click **IoT Smart Simulator** in the sidebar.
   - Note the clear educational simulation disclaimer banner.
   - Drag the **Temperature slider above 28°C**: the virtual cooling fan immediately starts rotating with animated SVG blades and the badge updates to `RUNNING (PWM)` in cyan.
   - Drag the **Ambient Light slider below 300 lux**: the room bulb automatically illuminates with a warm glow.
   - Click **Trigger Motion**: the PIR sensor trips the security siren, and MQTT telemetry logs in real time.
5. **Arduino Coding Lab:**
   - Click **Arduino Coding Lab** in the sidebar.
   - Select *Challenge 1 (Precision 1Hz LED Flasher)*.
   - Click **Verify & Run**: the deterministic AST validator verifies the sketch, illuminates the virtual onboard Pin 13 LED, and streams simulated 9600 baud serial output to the Virtual Serial Monitor.
   - Delete `void loop()` and click **Verify & Run** to demonstrate robust compiler error feedback (`Missing mandatory function: void loop()`).

### Minute 3: Smart Quiz Arena, AI Assistant & SQLite Persistence
6. **Smart Quiz Arena:**
   - Click **Smart Quiz Arena** in the sidebar.
   - Click **Initialize Quiz Arena** and answer a question.
   - Point out the countdown timer with race-condition protection and immediate tactile feedback.
   - Complete the quiz to show real score calculation and question-by-question review with engineering explanations.
7. **AI Learning Assistant:**
   - Click **AI Learning Assistant** in the sidebar.
   - Click the prompt chip *"⚡ Nyquist Theorem & Aliasing"*.
   - Point out the transparent attribution: *"Rule-Based Educational Assistant (Deterministic Local Knowledge Base — Not an LLM)"*.
   - Try sending an empty question to observe immediate validation feedback.
8. **Progress & Badges:**
   - Click **Progress & Badges**. Show accumulated XP, updated rank (*Silicon Apprentice*), and unlocked achievement badges.
   - Close the server, restart it, and refresh: all progress remains 100% intact due to SQLite persistence.

---

## 💬 4. SUGGESTED QUESTIONS JUDGES MAY ASK & HONEST ANSWERS

### Q1: Is the backend using a real database or just localStorage?
> **Answer:** It uses a **real SQLite 3.49 database** (`circuitverse.db`) powered by Node.js 22 native `node:sqlite`. It has 7 relational tables storing user profiles, completed lessons, quiz scores, coding challenges, and IoT telemetry. Data persists across browser and server restarts. LocalStorage is used only as an offline backup.

### Q2: Is the AI assistant connected to an external LLM API?
> **Answer:** No external API key was configured in the competition environment, so the assistant operates on a **curated, deterministic ENTC Knowledge Core** covering over 40 foundational concepts. We intentionally avoided calling an unconfigured external service or faking an LLM. It is explicitly labeled as a rule-based educational assistant.

### Q3: Does the Arduino playground actually compile and run C++ on physical hardware?
> **Answer:** No, and the UI explicitly discloses this. The playground uses a **deterministic AST and token validator** that checks sketch structure, `setup()`/`loop()` syntax, and pin configuration, feeding a virtual AVR simulation state (onboard Pin 13 LED and virtual serial monitor).

### Q4: Why are there no external npm dependencies in `package.json`?
> **Answer:** By leveraging Node.js 22 LTS native capabilities (`node:http`, `node:sqlite`, `node:fs`, `node:path`, `node:crypto`), the platform starts instantaneously on any machine without `npm install` lag, build step errors, or C++ native toolchain incompatibilities.

---

## 📋 5. HONEST LIST OF IMPLEMENTED FEATURES & CURRENT LIMITATIONS

### Genuinely Implemented Features:
* Full-stack Single Page Application with Dark Navy, Electric Blue, Cyan, and Violet responsive styling.
* 7 interactive logic gates (`AND`, `OR`, `NOT`, `NAND`, `NOR`, `XOR`, `XNOR`) with real-time active-row truth table highlighting.
* Binary Half Adder combinational schematic calculator ($1 + 1 = 10_2$).
* Interactive Ohm's Law and LED driver with real-time current, power, and burnout warnings.
* 6 comprehensive ENTC curriculum modules with interactive knowledge checks awarding +50 XP.
* 12-question timed Quiz Arena with score computation and explanations.
* Real-time IoT Smart-Home simulator with live slider-to-actuator DOM updates (fan rotation, bulb glow, motion siren) and telemetry logs.
* Arduino coding challenge playground with deterministic AST validator and virtual serial monitor.
* Web Audio API synthesizer for tactile hardware relay clicks and tones.
* SQLite 3 persistent storage across 7 tables with user level and badge progression.

### Current Limitations:
* **No multi-gate custom drag-and-drop breadboard:** Gates and half-adder circuits are pre-wired schematics rather than an open canvas wire-routing engine.
* **Simulated IoT hardware:** Sensor telemetry is simulated in software; edge nodes are not connected to physical MQTT brokers.
* **Deterministic Arduino validation:** Challenges validate required structures rather than running an entire full-scale AVR GCC compiler toolchain.
