# CIRCUITVERSE AI ⚡
> **Tagline:** *Learn Circuits. Simulate Ideas. Build Intelligence.*  
> **Competition:** CHAKRAVYUH — AI Vibe Coding Challenge  
> **Problem Statement:** Smart ENTC Learning & Innovation Platform  

---

## 🌟 Executive Summary

**Electronics and Telecommunication Engineering (ENTC)** includes digital electronics, communication systems, embedded technology, signal processing, sensors, microcontrollers, and artificial intelligence. Students frequently struggle with these domains when education is limited to abstract theoretical derivations.

**CircuitVerse AI** is a modern full-stack educational technology platform engineered to bridge rigorous theoretical concepts with hands-on experimentation, live hardware-level simulations, competitive quizzing, embedded firmware challenges, and intelligent learning assistance.

---

## 🛠️ Architecture & Technology Stack

The platform is designed to be lightweight, self-contained, and reliable:

* **Backend Runtime:** Node.js (v22.16 LTS) using built-in high-performance native modules (`node:http`, `node:sqlite`, `node:fs`, `node:path`, `node:crypto`).
* **Zero External NPM Dependencies:** Starts instantaneously with zero `npm install` failures or C++ compiler toolchain incompatibilities.
* **Database & Persistence:** Native **SQLite 3.49** (`node:sqlite`) storing user profiles, XP, levels, engineering ranks, completed lessons, quiz submissions, coding challenge submissions, lab experiment logs, IoT telemetry logs, and activity events.
* **Frontend Architecture:** Single Page Application (SPA) with native ES6+ modules, responsive CSS3 design system, and Web Audio API synthesizer for tactile laboratory audio cues.
* **Design Theme:** Dark Navy (`#070b14` / `#0c1322`), Electric Blue (`#3b82f6`), Cyber Cyan (`#06b6d4`), and Quantum Violet (`#8b5cf6`) with glassmorphism cards and glowing state indicators.

---

## 🚀 Core Platform Modules

### 1. 📊 Home / Mission Control Dashboard
* Dynamic Welcome Hero displaying level progression, live database status, and engineering ranks.
* Metric cards tracking Curriculum Mastery %, Total XP, Timed Quiz High Score, and Engineering Rank.
* Quick-launch action cards to the Virtual Lab, AI Assistant, and Quiz Arena.
* Real-time activity feed streaming recently completed experiments and quizzes directly from SQLite.

### 2. 📚 Interactive Learning Curriculum (6 ENTC Modules)
1. **Digital Electronics & Number Systems:** Radix base conversions (binary, hex, decimal), Boolean algebra, De Morgan's laws, and ADC quantization noise margins.
2. **Logic Gates & Combinational Circuits:** Transistor-level gates, universal NAND/NOR logic synthesis, and binary adders.
3. **Analog & Digital Communication Systems:** AM/FM/PM modulation, BPSK/QPSK/QAM symbol constellations, the Nyquist-Shannon Sampling Theorem, and Shannon-Hartley channel capacity.
4. **Sensors, Actuators & Embedded Microcontrollers:** ATmega328P architecture, GPIO input/output modes, 10-bit Successive Approximation ADC, PWM motor control, and I2C vs SPI communication buses.
5. **Digital Signal Processing (DSP) & Filters:** Time vs Frequency domains, Fast Fourier Transform (FFT) $O(N \log N)$ complexity, FIR linear-phase filters, and IIR feedback stability.
6. **Internet of Things (IoT) & Smart Telemetry:** MQTT broker publish-subscribe topics, edge computing nodes, sensor-actuator feedback loops, and LoRaWAN/Wi-Fi telemetry.
* *Each module features an overview, key engineering principles, a practical industry application, and an interactive knowledge-check question awarding +50 XP.*

### 3. 🔬 Virtual Electronics Workbench
* **Logic Gate Sandbox:** Test 7 logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR) with interactive input switches (A and B toggles), live animated electrical traces (cyan when HIGH, dark navy when LOW), glowing LED output lamp, and a **real-time Truth Table** that dynamically highlights the active input row.
* **Binary Half Adder Combinational Circuit:** Real-time dual-gate circuit simulating arithmetic addition with Sum ($A \oplus B$) and Carry Out ($A \cdot B$) outputs.
* **Interactive Ohm’s Law & LED Driver Lab:** Experiment with power supply voltage (0V to 12V) and current-limiting resistors (100Ω to 10kΩ). Calculates net voltage drop, forward current ($I = V/R$), and power dissipation in real time, with an interactive visual LED brightness indicator and thermal burnout warning if current exceeds 25mA!

### 4. 🤖 AI Learning Assistant (CircuitVerse Knowledge Core)
* Conversational AI interface specifically tuned for ENTC engineering queries.
* Features quick prompt chips (Nyquist sampling, Universal gates, I2C vs SPI, LED sizing, AM vs FM, MQTT).
* **Transparent Architecture:** Clearly identified as the *CircuitVerse Local ENTC Knowledge Core* with curated technical explanations, formatted mathematical equations, and structured markdown code snippets.

### 5. 🎯 Smart Quiz Arena
* 12 multi-choice questions covering all core ENTC domains.
* Configurable 25-second per-question countdown timer with visual progress bar.
* Instant visual and Web Audio tactile feedback for selected answers.
* Real-time score calculation and bonus XP calculation.
* Comprehensive question-by-question review showing user choice, correct answer, and in-depth engineering explanation.
* Records attempt history, high score, and average accuracy in SQLite.

### 6. 💻 Arduino Coding Playground
* Interactive C/C++ embedded coding workspace with syntax template.
* 3 Predefined challenges:
  1. *Challenge 1:* Precision 1Hz LED Flasher (`pinMode`, `digitalWrite`, `delay`)
  2. *Challenge 2:* ADC Light Sensor Threshold Alert (`analogRead`, `A0`, conditional thresholding)
  3. *Challenge 3:* Motor Soft-Start PWM Controller (`analogWrite`, Timer1 duty ramp)
* **Deterministic AST Validator:** Validates code structure, mandatory `setup()` and `loop()` routines, correct pin directions, and timing.
* **Virtual Hardware Simulator:** Animated onboard LED (Pin 13) and a virtual Serial Monitor streaming simulated 9600 baud serial output.

### 7. 🌐 IoT / Smart-Home Simulator
* Interactive sensor dials:
  * DHT22 Temperature Sensor (10°C to 45°C slider).
  * CdS Photoresistor Ambient Light Sensor (20 to 1000 lux slider).
  * Pyroelectric PIR Motion Detector (interactive trigger toggle).
* Simulated Actuators:
  * Smart Cooling Fan with animated rotating SVG blades whose rotation speed scales with temperature.
  * Automated Nightlight whose illumination scales inversely with ambient brightness.
  * Security Siren with audio buzzer alert when motion is detected in armed mode.
* User-configurable automation rules and live MQTT telemetry broadcast stream.

### 8. 🏆 Progress Tracking & Credential System
* Real SQLite database persistence storing user XP, Level, and rank (Novice Wireman $\to$ Silicon Apprentice $\to$ Embedded Systems Engineer $\to$ Senior Circuit Designer $\to$ ENTC Master Architect).
* Dynamic badges gallery with automated unlocks (Silicon Initiate, ENTC Scholar, Challenge Accepted, Logic Virtuoso, Firmware Hacker, Embedded Architect).
* "Reset Demo Data" option for clean demonstration testing.

---

## 🏃 Setup & Execution Instructions

### Prerequisites
* Windows 10/11 with Node.js installed (v18+; recommended v22+).

### Quick Start
1. Open a terminal (PowerShell or Command Prompt) and navigate to the project directory:
   ```powershell
   cd C:\Users\ADMIN\.gemini\antigravity\scratch\circuitverse-ai
   ```
2. Launch the backend server:
   ```powershell
   node server.js
   ```
   *(Or double-click `start.bat`)*
3. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

### Running Automated In-Memory Tests
To verify all SQLite tables, logic gate truth-table rules, and static asset integrity:
```powershell
node test_in_memory.js
```

---

## 🧭 Demonstration Workflow for Judges

1. **Dashboard:** Start on the Home Dashboard to view overall metrics, live SQLite status, and the activity feed.
2. **Virtual Lab (Logic Gates):** Navigate to *Virtual Lab*. Toggle inputs A and B on the AND gate; observe the glowing LED and dynamic cyan highlight in the truth table. Switch to the *Ohm's Law & LED* tab; adjust the voltage slider to 12V with a 100Ω resistor to witness the high-current burnout warning.
3. **Interactive Learning:** Navigate to *Interactive Learning*. Open the *Analog & Digital Communication Systems* lesson, review the Nyquist theorem and Shannon capacity, and answer the knowledge-check question to earn +50 XP.
4. **AI Assistant:** Navigate to *AI Assistant*. Click the quick prompt *"⚡ Nyquist Theorem & Aliasing"* to see structured technical explanations with mathematical formulas.
5. **Smart Quiz Arena:** Navigate to *Quiz Arena*. Click *"Initialize Quiz Arena"*, answer timed questions, and inspect the final score card and question review.
6. **Arduino Coding Lab:** Navigate to *Arduino Coding Lab*. Click *"Verify & Run"* on Challenge 1 to see the AST validator pass, the onboard Pin 13 LED illuminate, and the Virtual Serial Monitor display simulated serial telemetry.
7. **IoT Smart-Home:** Navigate to *IoT Simulator*. Slide the temperature slider above 28°C to watch the cooling fan spin; slide ambient light below 300 lux to watch the light turn on; click *"Trigger Motion"* to trigger the security siren.
8. **Progress & Badges:** Navigate to *Progress & Badges* to view accumulated XP, updated rank, and unlocked achievement badges recorded in SQLite.
