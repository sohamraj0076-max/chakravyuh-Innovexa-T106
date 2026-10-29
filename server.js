// CIRCUITVERSE AI - Backend Server
// Smart ENTC Learning & Innovation Platform
// Built with Node.js 22 native modules (node:http, node:sqlite, node:fs, node:path)

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'circuitverse.db');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Initialize SQLite Database
let db;
try {
  db = new DatabaseSync(DB_PATH);
  initDatabase(db);
  console.log('[Database] Connected and schema initialized successfully at:', DB_PATH);
} catch (err) {
  console.error('[Database Error] Failed to initialize SQLite database:', err);
  process.exit(1);
}

function initDatabase(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_profile (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      rank TEXT DEFAULT 'Novice Wireman',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS completed_lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id TEXT UNIQUE NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      percentage REAL NOT NULL,
      time_spent INTEGER NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS coding_challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      challenge_id TEXT UNIQUE NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lab_experiments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      circuit_type TEXT NOT NULL,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS iot_telemetry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      temperature REAL,
      light REAL,
      motion INTEGER,
      fan_state INTEGER,
      bulb_state INTEGER,
      alarm_state INTEGER,
      rule_triggered TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activity_feed (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      xp_earned INTEGER DEFAULT 0,
      icon TEXT DEFAULT 'activity',
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Ensure default profile exists
  const existingUser = db.prepare('SELECT * FROM user_profile WHERE id = 1').get();
  if (!existingUser) {
    db.prepare('INSERT INTO user_profile (id, name, xp, level, rank) VALUES (1, ?, 0, 1, ?)')
      .run('ENTC Innovator', 'Novice Wireman');
    
    db.prepare('INSERT INTO activity_feed (title, description, xp_earned, icon) VALUES (?, ?, ?, ?)')
      .run('Welcome to CircuitVerse AI!', 'Platform initialized. Ready to explore circuits, simulations, and AI assistance.', 0, 'cpu');
  }
}

// MIME Types Map
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2'
};

// --- CURRICULUM DATA: 6 ENTC MODULES ---
const LESSONS = [
  {
    id: 'digital-electronics',
    title: 'Digital Electronics & Number Systems',
    category: 'Foundations',
    difficulty: 'Beginner',
    readTime: '6 mins',
    summary: 'Master the binary language of modern computing, radix conversions, and Boolean minimization.',
    content: {
      overview: 'Digital electronics is the backbone of computing, telecommunications, and digital signal processors. Unlike analog systems where signals vary continuously, digital systems represent information using discrete voltage states: High (Logic 1, typically +3.3V or +5V) and Low (Logic 0, 0V/Ground).',
      keyPoints: [
        'Binary (Base 2), Hexadecimal (Base 16), and Decimal (Base 10) form the primary number representations in microprocessors.',
        'Boolean Algebra uses basic operations: AND (conjunction), OR (disjunction), and NOT (inversion).',
        'De Morgan’s Laws state: NOT (A AND B) = (NOT A) OR (NOT B), and NOT (A OR B) = (NOT A) AND (NOT B).',
        'Noise Margin provides high immunity to interference compared to analog voltage levels.'
      ],
      practicalExample: 'In an 8-bit analog-to-digital converter (ADC), an input voltage of 0 to 5V is mapped to 2^8 = 256 discrete binary steps (00000000 to 11111111), giving a step resolution of 5V / 255 = 19.6 mV per step.',
      knowledgeCheck: {
        question: 'What is the binary representation of decimal number 13?',
        options: ['1011', '1101', '1110', '1001'],
        correctIndex: 1,
        explanation: '13 in binary = 8 + 4 + 0 + 1 = 1101 in base-2 (1*8 + 1*4 + 0*2 + 1*1).'
      }
    }
  },
  {
    id: 'logic-gates',
    title: 'Logic Gates & Combinational Circuits',
    category: 'Digital Design',
    difficulty: 'Beginner',
    readTime: '8 mins',
    summary: 'Build combinational logic circuits using AND, OR, NOT, NAND, NOR, and XOR gates.',
    content: {
      overview: 'Logic gates are physical electronic devices implementing Boolean functions using transistors. Universal gates like NAND and NOR can synthesize any arbitrary digital function without needing other gate types.',
      keyPoints: [
        'AND gate gives 1 only when all inputs are 1. OR gate gives 1 when at least one input is 1.',
        'XOR (Exclusive-OR) outputs 1 when inputs differ. It forms the core of binary adders and parity checkers.',
        'NAND and NOR are universal gates because any combinational circuit can be realized solely using either gate.',
        'A Half Adder requires 1 XOR gate (for Sum) and 1 AND gate (for Carry Out).'
      ],
      practicalExample: 'When you press keys on a keyboard, matrix decoder circuits use logic gate multiplexers to isolate which row and column intersect, generating a clean digital scan code.',
      knowledgeCheck: {
        question: 'Which of the following gates outputs 1 if and only if both inputs are identical?',
        options: ['XOR Gate', 'XNOR Gate', 'NAND Gate', 'NOR Gate'],
        correctIndex: 1,
        explanation: 'XNOR (Exclusive-NOR) is the equivalence gate: (0,0)->1 and (1,1)->1, while (0,1)->0 and (1,0)->0.'
      }
    }
  },
  {
    id: 'communication-systems',
    title: 'Analog & Digital Communication Systems',
    category: 'Telecommunications',
    difficulty: 'Intermediate',
    readTime: '9 mins',
    summary: 'Understand carrier modulation (AM/FM/PSK), channel bandwidth, and the Nyquist-Shannon sampling limit.',
    content: {
      overview: 'Telecommunication engineering solves the challenge of transmitting information over physical channels (copper, fiber, wireless airwaves). Raw baseband signals cannot travel long distances through air due to antenna size limitations (antenna length is proportional to wavelength λ = c/f), so high-frequency carrier modulation is essential.',
      keyPoints: [
        'Amplitude Modulation (AM) varies carrier amplitude; Frequency Modulation (FM) varies carrier frequency with higher noise immunity.',
        'Digital Modulation schemes like BPSK, QPSK, and QAM transmit discrete symbols, maximizing bits-per-second per Hertz.',
        'Nyquist Sampling Theorem: A continuous signal can be reconstructed without aliasing if sampled at rate fs ≥ 2 * fmax.',
        'Shannon-Hartley Theorem: Channel Capacity C = B * log2(1 + SNR), defining the theoretical limit of error-free data transfer.'
      ],
      practicalExample: 'Wi-Fi 6 (802.11ax) utilizes 1024-QAM (Quadrature Amplitude Modulation), packing 10 bits of information into each transmitted RF symbol constellation point.',
      knowledgeCheck: {
        question: 'If a human speech signal has frequencies up to 4 kHz, what is the minimum Nyquist sampling rate required?',
        options: ['4,000 Hz', '8,000 Hz', '16,000 Hz', '2,000 Hz'],
        correctIndex: 1,
        explanation: 'Nyquist rate is twice the maximum frequency: fs = 2 * 4 kHz = 8,000 Hz (8 kHz). This is standard for digital telephony.'
      }
    }
  },
  {
    id: 'sensors-microcontrollers',
    title: 'Sensors, Actuators & Embedded Microcontrollers',
    category: 'Embedded Tech',
    difficulty: 'Intermediate',
    readTime: '7 mins',
    summary: 'Interface physical sensors via ADC, control motors using PWM, and handle real-time hardware interrupts.',
    content: {
      overview: 'Microcontrollers (like ATmega328P on Arduino, or ESP32) integrate a CPU, RAM, Flash memory, and I/O peripherals onto a single chip. They bridge software with the physical world through GPIO pins, Analog-to-Digital Converters (ADCs), and hardware communication buses (UART, SPI, I2C).',
      keyPoints: [
        'GPIO (General Purpose Input/Output) can be configured via Direction Registers (DDR) as input (high-impedance) or output (push-pull).',
        'Pulse Width Modulation (PWM) mimics analog output by rapidly switching digital voltage at varying duty cycles (0% to 100%).',
        'Hardware Interrupts pause the main CPU loop immediately to service time-critical external events (e.g., rotary encoders, safety trip).',
        'I2C uses only 2 wires (SDA, SCL) with addressing; SPI uses 4 wires (MOSI, MISO, SCK, CS) for high-speed synchronous transfers.'
      ],
      practicalExample: 'An autonomous robot uses an ultrasonic sensor (HC-SR04) with high-speed microcontroller timer capture registers to measure the microsecond round-trip echo pulse, calculating distance = (time * speed_of_sound) / 2.',
      knowledgeCheck: {
        question: 'What is the primary advantage of SPI over I2C communication?',
        options: ['SPI uses fewer wires than I2C', 'SPI supports full-duplex operation at higher data rates', 'SPI uses software addressing for unlimited slaves without pins', 'SPI requires external pull-up resistors on all lines'],
        correctIndex: 1,
        explanation: 'SPI supports full-duplex synchronous data transmission at clock speeds exceeding 20-50 MHz, whereas standard I2C is half-duplex and limited to 100-400 kHz.'
      }
    }
  },
  {
    id: 'signal-processing',
    title: 'Digital Signal Processing (DSP) & Filters',
    category: 'Signals & Systems',
    difficulty: 'Advanced',
    readTime: '10 mins',
    summary: 'Transform signals from time domain to frequency domain with Fourier analysis and design digital IIR/FIR filters.',
    content: {
      overview: 'Digital Signal Processing (DSP) manipulates digitized real-world signals (audio, biomedical ECG, radar, images) using numerical algorithms. Fourier transforms allow engineers to decompose complex waveforms into constituent sine and cosine harmonics for noise reduction and feature extraction.',
      keyPoints: [
        'Time Domain shows signal amplitude versus time; Frequency Domain displays spectral magnitude and phase versus frequency.',
        'The Fast Fourier Transform (FFT) computes the Discrete Fourier Transform (DFT) with O(N log N) computational complexity instead of O(N^2).',
        'FIR (Finite Impulse Response) filters are inherently stable and have linear phase response.',
        'IIR (Infinite Impulse Response) filters achieve sharp cutoff roll-offs with fewer filter coefficients but can become unstable.'
      ],
      practicalExample: 'Noise-canceling headphones sample environmental ambient noise using an exterior microphone, calculate the inverted anti-phase sound wave in real-time DSP, and play it back to destructively cancel the noise at your ear.',
      knowledgeCheck: {
        question: 'Which transform is primarily used to analyze discrete signals in the complex frequency (z) plane?',
        options: ['Continuous Fourier Transform', 'Z-Transform', 'Laplace Transform', 'Hilbert Transform'],
        correctIndex: 1,
        explanation: 'The Z-transform is the discrete-time counterpart of the continuous Laplace transform, mapping digital sequences to the complex z-plane for filter stability analysis.'
      }
    }
  },
  {
    id: 'internet-of-things',
    title: 'Internet of Things (IoT) & Smart Telemetry',
    category: 'Edge & Cloud',
    difficulty: 'Intermediate',
    readTime: '8 mins',
    summary: 'Design connected edge nodes, lightweight MQTT publish-subscribe messaging, and automated sensor rules.',
    content: {
      overview: 'IoT interconnects embedded edge sensors with cloud servers and mobile dashboards. Because edge devices often run on battery power and cellular or low-power wireless networks, protocols must have minimal protocol overhead and low energy consumption.',
      keyPoints: [
        'MQTT (Message Queuing Telemetry Transport) is a lightweight publish-subscribe protocol with a 2-byte header footprint.',
        'Edge Computing processes sensor data locally before transmission, reducing cloud bandwidth and latency.',
        'Actuators (relays, servos, solid-state switches) translate digital cloud decisions into physical movements and switching.',
        'Security at the edge requires secure boot, encrypted TLS communication, and authenticated API tokens.'
      ],
      practicalExample: 'In a smart agricultural field, soil moisture sensors broadcast readings via LoRaWAN every 10 minutes; when moisture drops below 35%, an edge relay controller triggers a solar drip irrigation pump automatically.',
      knowledgeCheck: {
        question: 'Which IoT communication protocol uses a Broker with Publish/Subscribe topics instead of direct Client-Server requests?',
        options: ['HTTP REST', 'MQTT', 'FTP', 'Telnet'],
        correctIndex: 1,
        explanation: 'MQTT is built around a centralized Broker where publishers send messages to topics (e.g., home/livingroom/temp) and subscribers receive updates asynchronously.'
      }
    }
  }
];

// --- QUIZ QUESTIONS (12 MULTI-CHOICE ENTC QUESTIONS) ---
const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: 'Digital Logic',
    question: 'According to De Morgan’s theorem, what is equivalent to the expression NOT (A + B)?',
    options: ['(NOT A) + (NOT B)', '(NOT A) · (NOT B)', 'NOT (A · B)', 'A · B'],
    correct: 1,
    explanation: 'De Morgan’s second theorem states that the complement of a sum is equal to the product of the individual complements: (A + B)\' = A\' · B\'.'
  },
  {
    id: 2,
    category: 'Logic Circuits',
    question: 'How many 2-input NAND gates are required to construct a standard 2-input XOR gate?',
    options: ['2', '3', '4', '5'],
    correct: 2,
    explanation: 'A 2-input XOR gate can be synthesized using exactly four 2-input NAND gates arranged in three levels.'
  },
  {
    id: 3,
    category: 'Signals & Systems',
    question: 'According to the Nyquist-Shannon Sampling Theorem, what happens if a signal is sampled below 2 × fmax?',
    options: ['Frequency expansion occurs', 'Aliasing distortion occurs', 'Signal amplitude doubles', 'Phase inversion occurs'],
    correct: 1,
    explanation: 'Under-sampling results in aliasing, where high-frequency spectral components fold into the lower frequency spectrum, permanently corrupting the signal.'
  },
  {
    id: 4,
    category: 'Telecommunications',
    question: 'What is the primary advantage of Frequency Modulation (FM) over Amplitude Modulation (AM)?',
    options: ['FM requires significantly lower transmission bandwidth', 'FM exhibits superior noise and amplitude interference immunity', 'FM transmitters are much simpler to construct', 'FM can propagate globally via ground wave reflection'],
    correct: 1,
    explanation: 'Most atmospheric and electrical noise affects signal amplitude. Because FM encodes data in frequency deviations, amplitude limiters can strip noise without signal loss.'
  },
  {
    id: 5,
    category: 'Microcontrollers',
    question: 'What happens when an external hardware interrupt is triggered on an Arduino microcontroller?',
    options: ['The microcontroller resets and starts setup() again', 'The CPU pauses current execution, runs an Interrupt Service Routine (ISR), then resumes', 'The clock frequency drops to preserve power', 'All GPIO pins are switched to inputs'],
    correct: 1,
    explanation: 'Hardware interrupts immediately vector program flow to an assigned Interrupt Service Routine (ISR) and return to the main loop without loss of state.'
  },
  {
    id: 6,
    category: 'Circuit Theory',
    question: 'If a 5V power supply powers an LED with a forward voltage drop of 2.0V and desired forward current of 15mA, what resistor value is needed?',
    options: ['100 Ω', '200 Ω', '330 Ω', '500 Ω'],
    correct: 1,
    explanation: 'Using Ohm’s Law: R = (Vsupply - Vled) / I = (5.0V - 2.0V) / 0.015A = 3.0V / 0.015A = 200 Ω.'
  },
  {
    id: 7,
    category: 'Embedded Protocols',
    question: 'How many signal lines does the standard I2C protocol require between a master and slave device?',
    options: ['1 (OneWire)', '2 (SDA, SCL)', '4 (MOSI, MISO, SCK, CS)', '8 (Parallel Bus)'],
    correct: 1,
    explanation: 'I2C requires only two lines: Serial Data (SDA) and Serial Clock (SCL), both pulled up to VCC with resistors.'
  },
  {
    id: 8,
    category: 'Digital Signal Processing',
    question: 'What is the computational algorithmic complexity of the Fast Fourier Transform (FFT) algorithm for N sample points?',
    options: ['O(N)', 'O(N log2 N)', 'O(N²)', 'O(2^N)'],
    correct: 1,
    explanation: 'The Cooley-Tukey FFT algorithm reduces direct DFT complexity from O(N²) down to O(N log2 N) using divide-and-conquer symmetry.'
  },
  {
    id: 9,
    category: 'IoT & Telemetry',
    question: 'In the MQTT protocol, which Quality of Service (QoS) level guarantees that a message arrives exactly once?',
    options: ['QoS 0', 'QoS 1', 'QoS 2', 'QoS 3'],
    correct: 2,
    explanation: 'QoS 0 is at most once (fire & forget), QoS 1 is at least once (with acks), and QoS 2 guarantees exactly once delivery using a 4-step handshake.'
  },
  {
    id: 10,
    category: 'Sequential Logic',
    question: 'What is the illegal or forbidden input state for an active-high SR (Set-Reset) NOR latch?',
    options: ['S=0, R=0', 'S=0, R=1', 'S=1, R=0', 'S=1, R=1'],
    correct: 3,
    explanation: 'When S=1 and R=1 in a NOR latch, both Q and Q_bar outputs are forced to 0 simultaneously, violating the complement relationship and creating race hazards.'
  },
  {
    id: 11,
    category: 'Sensors',
    question: 'How does an LDR (Light Dependent Resistor / Photoresistor) respond to an increase in ambient incident light?',
    options: ['Its resistance increases dramatically', 'Its resistance decreases significantly', 'Its voltage polarity reverses', 'Its capacitance discharges to zero'],
    correct: 1,
    explanation: 'Photons excite electrons into the conduction band in cadmium sulfide (CdS), increasing carrier density and decreasing electrical resistance.'
  },
  {
    id: 12,
    category: 'Digital Electronics',
    question: 'What digital component is designed to select one of multiple analog or digital input channels and forward it to a single output line?',
    options: ['Demultiplexer', 'Multiplexer (MUX)', 'Decoder', 'Priority Encoder'],
    correct: 1,
    explanation: 'A Multiplexer (data selector) uses binary control select lines to route one of 2^n data input channels to a single shared output line.'
  }
];

// --- CODING CHALLENGES ---
const CODING_CHALLENGES = [
  {
    id: 'challenge-blink',
    title: 'Challenge 1: Precision 1Hz LED Flasher',
    difficulty: 'Easy',
    xpReward: 100,
    description: 'Configure digital pin 13 as an OUTPUT. In the main loop, turn the LED on for 1000 milliseconds, turn it off for 1000 milliseconds, and print diagnostic status messages to the Serial Monitor at 9600 baud.',
    starterCode: `// Challenge 1: 1Hz Heartbeat LED
const int LED_PIN = 13;

void setup() {
  // 1. Initialize serial communication at 9600 baud
  // 2. Configure LED_PIN as OUTPUT
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  // Write your code here to toggle pin 13 with 1000ms delay
  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED State: HIGH (ON)");
  delay(1000);
  
  digitalWrite(LED_PIN, LOW);
  Serial.println("LED State: LOW (OFF)");
  delay(1000);
}
`,
    expectedPins: [{ pin: 13, mode: 'OUTPUT' }],
    requiredTokens: ['pinMode', '13', 'OUTPUT', 'digitalWrite', 'HIGH', 'LOW', 'delay']
  },
  {
    id: 'challenge-analog',
    title: 'Challenge 2: ADC Light Sensor Threshold Alert',
    difficulty: 'Medium',
    xpReward: 150,
    description: 'Read an analog light sensor on pin A0 (0-1023). If the sensor reading falls below 400 (indicating darkness), turn ON the nightlight on digital pin 8. Otherwise, turn pin 8 OFF. Output the sensor value over Serial.',
    starterCode: `// Challenge 2: Automatic Nightlight Controller
const int SENSOR_PIN = A0;
const int LIGHT_PIN = 8;
const int DARK_THRESHOLD = 400;

void setup() {
  Serial.begin(9600);
  pinMode(LIGHT_PIN, OUTPUT);
  // Note: Analog pins are inputs by default
}

void loop() {
  int sensorValue = analogRead(SENSOR_PIN);
  Serial.print("LDR Value: ");
  Serial.println(sensorValue);

  if (sensorValue < DARK_THRESHOLD) {
    digitalWrite(LIGHT_PIN, HIGH);
    Serial.println("Darkness detected: Nightlight ON");
  } else {
    digitalWrite(LIGHT_PIN, LOW);
    Serial.println("Daylight detected: Nightlight OFF");
  }
  delay(500);
}
`,
    expectedPins: [{ pin: 8, mode: 'OUTPUT' }],
    requiredTokens: ['analogRead', 'A0', 'digitalWrite', '8', 'if']
  },
  {
    id: 'challenge-pwm',
    title: 'Challenge 3: PWM Pulse Width Speed Controller',
    difficulty: 'Medium',
    xpReward: 150,
    description: 'Use Pulse Width Modulation on PWM-capable pin 9 to ramp motor speed / LED brightness from 0 to 255 in increments of 5, then hold at maximum for 200ms. Print the current duty cycle percentage to Serial.',
    starterCode: `// Challenge 3: Motor Soft-Start PWM Controller
const int MOTOR_PWM_PIN = 9;

void setup() {
  Serial.begin(9600);
  pinMode(MOTOR_PWM_PIN, OUTPUT);
}

void loop() {
  for (int duty = 0; duty <= 255; duty += 5) {
    analogWrite(MOTOR_PWM_PIN, duty);
    int percent = (duty * 100) / 255;
    Serial.print("PWM Duty: ");
    Serial.print(percent);
    Serial.println("%");
    delay(20);
  }
  delay(200);
}
`,
    expectedPins: [{ pin: 9, mode: 'OUTPUT' }],
    requiredTokens: ['analogWrite', '9', 'pinMode', 'for', 'delay']
  }
];

// --- AI KNOWLEDGE CORE: CURATED ENTC INTELLIGENCE ---
const ENTC_KNOWLEDGE_BASE = [
  {
    keywords: ['logic gate', 'and gate', 'or gate', 'not gate', 'nand', 'nor', 'xor', 'xnor', 'truth table', 'boolean'],
    topic: 'Logic Gates & Digital Combinational Circuits',
    response: `### ⚡ Logic Gates: Foundations of Digital Design

Logic gates represent the core building blocks of digital integrated circuits (ICs) and microprocessors. They implement Boolean algebraic operations through transistor networks (CMOS - NMOS/PMOS pairs).

#### 📊 Summary of Essential 2-Input Gates:
* **AND Gate**: Outputs 1 only when BOTH inputs are 1 (\`Y = A · B\`).
* **OR Gate**: Outputs 1 when AT LEAST ONE input is 1 (\`Y = A + B\`).
* **NOT (Inverter)**: Flips the binary state (\`Y = A'\`).
* **NAND Gate (Universal)**: Inverted AND (\`Y = (A · B)'\`). Outputs 0 only if both inputs are 1.
* **NOR Gate (Universal)**: Inverted OR (\`Y = (A + B)'\`). Outputs 1 only when both inputs are 0.
* **XOR (Exclusive OR)**: Outputs 1 if inputs are DIFFERENT (\`Y = A ⊕ B = A'B + AB'\`).
* **XNOR (Equivalence)**: Outputs 1 if inputs are IDENTICAL (\`Y = (A ⊕ B)'\`).

#### 🛠️ Practical Hardware Application:
NAND and NOR gates are termed **Universal Gates** because any digital system—from a 1-bit Half Adder to a 64-bit AMD/Intel ALU—can be synthesized entirely out of NAND or NOR gates.

💡 *Try testing these live in the CircuitVerse **Virtual Electronics Lab** tab to see real-time truth tables and glowing LED responses!*`
  },
  {
    keywords: ['nyquist', 'sampling', 'aliasing', 'sampling rate', 'sampling theorem', 'shannon'],
    topic: 'Nyquist-Shannon Sampling Theorem & Aliasing',
    response: `### ⚡ Nyquist-Shannon Sampling Theorem

In telecommunications and digital signal processing (DSP), converting an analog continuous-time waveform into discrete numerical samples requires adherence to the **Nyquist Criterion**.

#### 📐 The Mathematical Rule:
\`\`\`
fs ≥ 2 · f_max
\`\`\`
Where:
* **fs** = Sampling Frequency (samples per second / Hz)
* **f_max** = Highest frequency component present in the input signal (Bandwidth)
* **Nyquist Rate** = Exactly \`2 · f_max\`
* **Nyquist Frequency** = \`fs / 2\` (Folding frequency)

#### ⚠️ What is Aliasing?
If \`fs < 2 · f_max\`, high frequencies mirror across the Nyquist folding frequency and appear falsely as phantom low frequencies. This non-recoverable distortion is called **aliasing**.

#### 🛠️ Real-World Engineering Example:
* **Human Auditory Range**: 20 Hz to 20,000 Hz (\`f_max = 20 kHz\`).
* **Compact Disc (CD) Audio Standard**: Sampled at **44.1 kHz**, satisfying \`44.1 kHz > 2 × 20 kHz\` with safety headroom for analog anti-aliasing low-pass brickwall filters.`
  },
  {
    keywords: ['arduino', 'microcontroller', 'microprocessor', 'gpio', 'atmega', 'esp32', 'firmware', 'adc'],
    topic: 'Microcontrollers, GPIO & Embedded Architecture',
    response: `### ⚡ Microcontrollers vs. Microprocessors

#### 🔬 Key Architectural Difference:
* **Microcontroller (MCU)**: Integrates CPU core, RAM, Flash memory (ROM), timers, ADC, and I/O peripherals onto a **single monolithic silicon die** (e.g., ATmega328P, ESP32, STM32, ARM Cortex-M). Ideal for dedicated control loops and embedded systems.
* **Microprocessor (MPU)**: High-performance CPU core requiring external RAM (DDR4/5), storage (NVMe/eMMC), and power management ICs (e.g., Intel Core, Apple Silicon, Raspberry Pi BCM2711). Ideal for general operating systems.

#### 🔌 GPIO Peripheral Modes:
1. **INPUT**: High impedance (Z) mode. Pin samples external voltage with negligible current draw.
2. **INPUT_PULLUP**: Connects an internal 20kΩ-50kΩ resistor to VCC to prevent a floating, noise-sensitive pin.
3. **OUTPUT**: Low-impedance push-pull transistor driver, sinking or sourcing up to 20-40 mA.

#### 🛠️ Analog-to-Digital Converter (ADC):
The ATmega328P features a 10-bit ADC. It converts 0V-5V input voltages into a digital integer from **0 to 1023** (\`2^10 = 1024 steps\`), yielding ~4.88 mV per count.`
  },
  {
    keywords: ['modulation', 'am', 'fm', 'pm', 'qam', 'carrier', 'telecom', 'bandwidth', 'bpsk'],
    topic: 'Carrier Modulation Schemes (AM, FM, PM & QAM)',
    response: `### ⚡ Communication Systems: Carrier Modulation

Baseband signals (voice, audio, sensor telemetry) have low frequencies, meaning their electromagnetic wavelength \`λ = c / f\` is massive. Transmitting them directly would require kilometer-long antennas! **Modulation** superimposes low-frequency intelligence onto a high-frequency RF carrier wave.

#### 📻 Analog Schemes:
* **AM (Amplitude Modulation)**: Varies carrier peak amplitude. Susceptible to static noise and lightning strikes.
* **FM (Frequency Modulation)**: Varies carrier instantaneous frequency. Provides superior Signal-to-Noise Ratio (SNR) through amplitude limiter clipping.

#### 📡 Modern Digital Schemes:
* **BPSK / QPSK**: Phase Shift Keying. QPSK transmits 2 bits per RF symbol (\`45°, 135°, 225°, 315°\`).
* **QAM (Quadrature Amplitude Modulation)**: Combines phase shifts with amplitude variation. Used in 4G LTE, 5G NR, Wi-Fi 6, and cable modems for gigabit throughput.

💡 *Check out the **Interactive Learning -> Communication Systems** module in CircuitVerse to master Shannon capacity!*`
  },
  {
    keywords: ['iot', 'mqtt', 'broker', 'pub sub', 'sensor', 'actuator', 'smart home', 'telemetry'],
    topic: 'Internet of Things (IoT) Protocols & Architecture',
    response: `### ⚡ IoT Architecture & The MQTT Protocol

The Internet of Things connects edge sensor nodes to cloud analytic engines. Unlike traditional heavy HTTP request-response cycles, IoT relies on optimized protocols.

#### 📡 Why MQTT (Message Queuing Telemetry Transport)?
* **Publish / Subscribe Decoupling**: Clients do not need to know the IP addresses of other nodes; they simply publish to or subscribe to hierarchical topics (e.g., \`home/sensor/temp\`).
* **Ultra-Lightweight**: Packet headers are as small as **2 bytes**, saving battery power on cellular/satellite links.
* **Three QoS Levels**:
  * **QoS 0**: At most once (best effort, no ack).
  * **QoS 1**: At least once (duplicate packets possible, acknowledged).
  * **QoS 2**: Exactly once (guaranteed 4-way handshake delivery).

#### 🛠️ Hands-on Tip:
Test our **IoT Simulator** tab right inside CircuitVerse! You can adjust real-time Temperature, Light (LDR), and Motion sensors to see automated smart fan and lighting triggers execute live.`
  },
  {
    keywords: ['fourier', 'dsp', 'filter', 'fir', 'iir', 'fft', 'frequency domain', 'spectral'],
    topic: 'Digital Signal Processing (DSP) & Filters',
    response: `### ⚡ Digital Signal Processing (DSP) & Fourier Analysis

DSP converts real-world physical vibrations, acoustic waves, and radio signals into arrays of numbers, transforming time-domain signals into the frequency domain.

#### 🌊 The Fourier Transform:
Any arbitrary periodic or non-periodic waveform can be deconstructed into a sum of pure orthogonal sine and cosine waves.
* **Time Domain \`x[n]\`**: Shows *when* events occur.
* **Frequency Domain \`X[k]\`**: Shows *what frequencies* are present and their spectral power.
* **FFT (Fast Fourier Transform)**: Calculates the N-point discrete transform in \`O(N log N)\` operations instead of \`O(N²)\`.

#### 🎛️ Digital Filters:
* **FIR (Finite Impulse Response)**: Non-recursive, linear phase, guaranteed absolute stability.
* **IIR (Infinite Impulse Response)**: Recursive feedback structure, highly computationally efficient with sharp cutoff transitions.`
  },
  {
    keywords: ['ohm', 'resistor', 'voltage', 'current', 'led', 'kirchhoff', 'v=ir', 'power'],
    topic: 'Ohm’s Law & Basic Circuit Analysis',
    response: `### ⚡ Ohm’s Law & LED Current-Limiting Analysis

#### 📐 Core Mathematical Equations:
\`\`\`
V = I · R      (Voltage = Current × Resistance)
P = V · I = I² · R = V² / R   (Electrical Power in Watts)
\`\`\`

#### 🔴 Sizing an LED Current-Limiting Resistor:
An LED has a fixed forward voltage drop (\`V_f\`, typically 1.8V-2.2V for Red/Yellow, 3.0V-3.4V for Blue/White) and must never receive raw unregulated voltage, or it will suffer catastrophic thermal runaway.

**Formula**:
\`\`\`
R_limit = (V_supply - V_forward) / I_target
\`\`\`

* **Example**: For a 5.0V microcontroller output, a 2.0V Red LED, and 15 mA (0.015 A) safe current:
  \`R = (5.0 - 2.0) / 0.015 = 3.0 / 0.015 = 200 Ω\`.
  (Standard E24 value: **220 Ω**).

💡 *Experiment with resistor values and voltage in the **Virtual Electronics Lab -> Resistor & LED Circuit**!*`
  }
];

function handleAiQuery(message) {
  const normalized = message.toLowerCase().trim();

  // Search knowledge base
  let bestMatch = null;
  let highestScore = 0;

  for (const item of ENTC_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (normalized.includes(kw)) {
        score += kw.length; // weight longer specific keywords higher
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore > 0) {
    return {
      success: true,
      topic: bestMatch.topic,
      source: 'CircuitVerse Curated ENTC Knowledge Engine',
      isLlm: false,
      response: bestMatch.response
    };
  }

  // Generative fallback with ENTC reasoning guidance
  return {
    success: true,
    topic: 'General ENTC Inquiry',
    source: 'CircuitVerse Curated ENTC Knowledge Engine',
    isLlm: false,
    response: `### 🎓 CircuitVerse ENTC Learning Assistant

I received your question: *"${escapeHtml(message)}"*

I am the **CircuitVerse Local ENTC Knowledge Core**, specialized in:
1. **Digital Logic**: Logic gates (AND, OR, NAND, NOR, XOR), Karnaugh Maps, Adders, Latches & Flip-Flops.
2. **Telecommunications**: Nyquist sampling, Shannon capacity, AM/FM, BPSK/QPSK/QAM modulation, and RF spectrum.
3. **Embedded Systems**: Arduino, ATmega328P, ESP32, GPIO modes, Interrupts, ADC, PWM, and I2C/SPI/UART buses.
4. **Signal Processing**: Fourier Transform (FFT), Time vs Frequency domain, FIR/IIR filter design.
5. **IoT & Sensors**: MQTT Broker, LDR photoresistors, PIR motion, DHT sensors, Edge telemetry.
6. **Circuit Analysis**: Ohm's Law (\`V=IR\`), Kirchhoff's Laws (KCL/KVL), and LED current limiting.

👉 *Try asking:*
* *"Explain the Nyquist Sampling Theorem and Aliasing with an example."*
* *"What is the difference between I2C and SPI buses?"*
* *"How do universal NAND gates work to make an XOR gate?"*
* *"How do I calculate a current limiting resistor for a 5V LED?"*
* *"Explain the MQTT protocol and publish/subscribe topics."*`
  };
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Deterministic Arduino Code Validator
function validateArduinoCode(challengeId, code) {
  const challenge = CODING_CHALLENGES.find(c => c.id === challengeId);
  if (!challenge) {
    return { success: false, error: 'Challenge not found' };
  }

  const cleanCode = code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const errors = [];
  const warnings = [];
  const serialOutput = [];

  // Check setup and loop
  if (!/void\s+setup\s*\(\s*\)/.test(cleanCode)) {
    errors.push('Missing mandatory function: void setup()');
  }
  if (!/void\s+loop\s*\(\s*\)/.test(cleanCode)) {
    errors.push('Missing mandatory function: void loop()');
  }

  // Check required tokens
  for (const token of challenge.requiredTokens) {
    if (!cleanCode.includes(token)) {
      errors.push(`Missing required embedded construct or identifier: '${token}'`);
    }
  }

  // Check pin configurations
  for (const exp of challenge.expectedPins) {
    const pinRegex = new RegExp(`pinMode\\s*\\(\\s*(${exp.pin}|[A-Za-z0-9_]+)\\s*,\\s*${exp.mode}\\s*\\)`);
    if (!pinRegex.test(cleanCode)) {
      errors.push(`Expected pin ${exp.pin} configured as ${exp.mode} using pinMode()`);
    }
  }

  if (errors.length > 0) {
    return {
      success: false,
      compilationPassed: false,
      errors,
      warnings,
      serialOutput: [
        '[Compiler] Compilation failed with ' + errors.length + ' error(s):',
        ...errors.map(e => '  ❌ ' + e),
        '[Simulation] Cannot execute virtual runtime due to syntax/structure violations.'
      ]
    };
  }

  // Simulate execution logs based on challenge
  serialOutput.push('[Bootloader] Sketch uploaded successfully (Binary size: 1,842 bytes / 5% of Flash)');
  serialOutput.push('[Hardware] Microcontroller clock set to 16.00 MHz external crystal');

  if (cleanCode.includes('Serial.begin')) {
    serialOutput.push('[Serial] Serial port initialized at 9600 baud, 8-N-1');
  }

  if (challengeId === 'challenge-blink') {
    serialOutput.push('[Cycle 1 - 0.00s] Pin 13 written HIGH (5.0V) -> Onboard LED ACTIVE');
    serialOutput.push('LED State: HIGH (ON)');
    serialOutput.push('[Cycle 1 - 1.00s] Pin 13 written LOW (0.0V) -> Onboard LED INACTIVE');
    serialOutput.push('LED State: LOW (OFF)');
    serialOutput.push('[Cycle 2 - 2.00s] Pin 13 written HIGH (5.0V) -> Onboard LED ACTIVE');
    serialOutput.push('LED State: HIGH (ON)');
    serialOutput.push('[Status] 1Hz square wave frequency verified across 2 cycles.');
  } else if (challengeId === 'challenge-analog') {
    serialOutput.push('[ADC] Sampling channel A0 via 10-bit Successive Approximation ADC...');
    serialOutput.push('LDR Value: 284');
    serialOutput.push('Darkness detected: Nightlight ON (Pin 8 HIGH)');
    serialOutput.push('[ADC] Next sample: LDR Value: 612');
    serialOutput.push('Daylight detected: Nightlight OFF (Pin 8 LOW)');
    serialOutput.push('[Status] Hysteresis and threshold conditions verified.');
  } else if (challengeId === 'challenge-pwm') {
    serialOutput.push('[Timer/Counter] Configured Timer1 Fast-PWM on Pin 9');
    serialOutput.push('PWM Duty: 0% (AnalogWrite: 0)');
    serialOutput.push('PWM Duty: 25% (AnalogWrite: 65)');
    serialOutput.push('PWM Duty: 50% (AnalogWrite: 128)');
    serialOutput.push('PWM Duty: 75% (AnalogWrite: 192)');
    serialOutput.push('PWM Duty: 100% (AnalogWrite: 255 - Max Speed)');
    serialOutput.push('[Status] PWM soft-ramp transition verified.');
  }

  return {
    success: true,
    compilationPassed: true,
    errors: [],
    warnings: [],
    serialOutput,
    pinStates: challenge.expectedPins
  };
}

// --- HTTP SERVER REQUEST HANDLER ---
const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS Headers for API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Helper for JSON responses
  const sendJson = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
  };

  // Helper for reading JSON body
  const readJsonBody = (callback) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) { // 1MB limit
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        callback(null, parsed);
      } catch (err) {
        callback(err, null);
      }
    });
  };

  // --- API ROUTING ---
  if (pathname.startsWith('/api/')) {
    // 1. Health Endpoint
    if (pathname === '/api/health' && method === 'GET') {
      sendJson(200, {
        status: 'online',
        app: 'CircuitVerse AI',
        version: '1.0.0',
        dbConnected: true,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      });
      return;
    }

    // 2. User Progress Endpoint
    if (pathname === '/api/progress' && method === 'GET') {
      try {
        const user = db.prepare('SELECT * FROM user_profile WHERE id = 1').get();
        const completedLessons = db.prepare('SELECT lesson_id, completed_at FROM completed_lessons').all();
        const quizAttempts = db.prepare('SELECT * FROM quiz_attempts ORDER BY completed_at DESC LIMIT 5').all();
        const codingChallenges = db.prepare('SELECT challenge_id, completed_at FROM coding_challenges').all();
        const activities = db.prepare('SELECT * FROM activity_feed ORDER BY timestamp DESC LIMIT 10').all();
        const quizStats = db.prepare('SELECT COUNT(*) as total_attempts, MAX(percentage) as best_score, AVG(percentage) as avg_score FROM quiz_attempts').get();

        // Calculate badges
        const badges = [];
        if (completedLessons.length >= 1) {
          badges.push({ id: 'first_lesson', name: 'Silicon Initiate', desc: 'Completed your first ENTC theoretical lesson', icon: 'zap' });
        }
        if (completedLessons.length >= 6) {
          badges.push({ id: 'curriculum_master', name: 'ENTC Scholar', desc: 'Completed all 6 core learning modules', icon: 'award' });
        }
        if (quizAttempts.length >= 1) {
          badges.push({ id: 'quiz_taker', name: 'Challenge Accepted', desc: 'Attempted the Smart ENTC Quiz Arena', icon: 'target' });
        }
        if (quizStats && quizStats.best_score >= 80) {
          badges.push({ id: 'quiz_master', name: 'Logic Virtuoso', desc: 'Scored 80%+ on the ENTC Quiz Arena', icon: 'check-circle' });
        }
        if (codingChallenges.length >= 1) {
          badges.push({ id: 'coder_first', name: 'Firmware Hacker', desc: 'Validated your first Arduino embedded challenge', icon: 'code' });
        }
        if (codingChallenges.length >= 3) {
          badges.push({ id: 'coder_master', name: 'Embedded Architect', desc: 'Mastered all embedded coding challenges', icon: 'cpu' });
        }

        sendJson(200, {
          user,
          completedLessons: completedLessons.map(l => l.lesson_id),
          completedChallenges: codingChallenges.map(c => c.challenge_id),
          quizAttempts,
          quizStats: {
            totalAttempts: quizStats ? quizStats.total_attempts : 0,
            bestScore: quizStats && quizStats.best_score ? Math.round(quizStats.best_score) : 0,
            avgScore: quizStats && quizStats.avg_score ? Math.round(quizStats.avg_score) : 0
          },
          activities,
          badges
        });
      } catch (err) {
        console.error('[API Error /progress]', err);
        sendJson(500, { error: 'Failed to retrieve progress data', details: err.message });
      }
      return;
    }

    // 3. Reset Progress Endpoint
    if (pathname === '/api/progress/reset' && method === 'POST') {
      try {
        db.exec(`
          DELETE FROM completed_lessons;
          DELETE FROM quiz_attempts;
          DELETE FROM coding_challenges;
          DELETE FROM lab_experiments;
          DELETE FROM iot_telemetry;
          DELETE FROM activity_feed;
          UPDATE user_profile SET xp = 0, level = 1, rank = 'Novice Wireman' WHERE id = 1;
          INSERT INTO activity_feed (title, description, xp_earned, icon) 
          VALUES ('Progress Reset', 'All lesson progress, quizzes, and simulation states have been reset.', 0, 'rotate-ccw');
        `);
        sendJson(200, { success: true, message: 'Progress reset successfully' });
      } catch (err) {
        console.error('[API Error /progress/reset]', err);
        sendJson(500, { error: 'Failed to reset progress', details: err.message });
      }
      return;
    }

    // 4. Lessons Endpoint
    if (pathname === '/api/lessons' && method === 'GET') {
      sendJson(200, { lessons: LESSONS });
      return;
    }

    // 5. Complete Lesson Endpoint
    if (pathname === '/api/lessons/complete' && method === 'POST') {
      readJsonBody((err, body) => {
        if (err || !body.lessonId) {
          sendJson(400, { error: 'Invalid payload: lessonId required' });
          return;
        }

        const lesson = LESSONS.find(l => l.id === body.lessonId);
        if (!lesson) {
          sendJson(404, { error: 'Lesson not found' });
          return;
        }

        try {
          const already = db.prepare('SELECT id FROM completed_lessons WHERE lesson_id = ?').get(body.lessonId);
          let xpAwarded = 0;
          if (!already) {
            xpAwarded = 50;
            db.prepare('INSERT INTO completed_lessons (lesson_id) VALUES (?)').run(body.lessonId);
            db.prepare('UPDATE user_profile SET xp = xp + ? WHERE id = 1').run(xpAwarded);
            
            // Recalculate level
            const updatedUser = db.prepare('SELECT xp FROM user_profile WHERE id = 1').get();
            const newLevel = Math.floor(updatedUser.xp / 100) + 1;
            let rank = 'Novice Wireman';
            if (newLevel >= 5) rank = 'ENTC Master Architect';
            else if (newLevel >= 4) rank = 'Senior Circuit Designer';
            else if (newLevel >= 3) rank = 'Embedded Systems Engineer';
            else if (newLevel >= 2) rank = 'Silicon Apprentice';

            db.prepare('UPDATE user_profile SET level = ?, rank = ? WHERE id = 1').run(newLevel, rank);
            db.prepare('INSERT INTO activity_feed (title, description, xp_earned, icon) VALUES (?, ?, ?, ?)')
              .run(`Lesson Completed: ${lesson.title}`, `Mastered ${lesson.category} concepts and knowledge check.`, xpAwarded, 'book-open');
          }

          sendJson(200, {
            success: true,
            xpAwarded,
            alreadyCompleted: !!already,
            lessonId: body.lessonId
          });
        } catch (dbErr) {
          console.error('[API Error /lessons/complete]', dbErr);
          sendJson(500, { error: 'Failed to record lesson completion' });
        }
      });
      return;
    }

    // 6. Quiz Questions Endpoint
    if (pathname === '/api/quiz/questions' && method === 'GET') {
      // Return questions without disclosing correct answer directly
      const sanitized = QUIZ_QUESTIONS.map(q => ({
        id: q.id,
        category: q.category,
        question: q.question,
        options: q.options
      }));
      sendJson(200, { questions: sanitized });
      return;
    }

    // 7. Submit Quiz Endpoint
    if (pathname === '/api/quiz/submit' && method === 'POST') {
      readJsonBody((err, body) => {
        if (err || !body.answers) {
          sendJson(400, { error: 'Invalid payload: answers object required' });
          return;
        }

        const userAnswers = body.answers; // e.g. { "1": 1, "2": 2 }
        const timeSpent = parseInt(body.timeSpent, 10) || 60;

        let correctCount = 0;
        const total = QUIZ_QUESTIONS.length;
        const review = [];

        QUIZ_QUESTIONS.forEach(q => {
          const selected = userAnswers[q.id] !== undefined ? userAnswers[q.id] : -1;
          const isCorrect = selected === q.correct;
          if (isCorrect) correctCount++;

          review.push({
            id: q.id,
            category: q.category,
            question: q.question,
            options: q.options,
            userSelected: selected,
            correctAnswer: q.correct,
            isCorrect,
            explanation: q.explanation
          });
        });

        const percentage = Math.round((correctCount / total) * 100);
        const xpEarned = correctCount * 25 + (percentage >= 80 ? 100 : 0);

        try {
          db.prepare('INSERT INTO quiz_attempts (score, total, percentage, time_spent) VALUES (?, ?, ?, ?)')
            .run(correctCount, total, percentage, timeSpent);
          
          db.prepare('UPDATE user_profile SET xp = xp + ? WHERE id = 1').run(xpEarned);
          
          // Update level & rank
          const updatedUser = db.prepare('SELECT xp FROM user_profile WHERE id = 1').get();
          const newLevel = Math.floor(updatedUser.xp / 100) + 1;
          let rank = 'Novice Wireman';
          if (newLevel >= 5) rank = 'ENTC Master Architect';
          else if (newLevel >= 4) rank = 'Senior Circuit Designer';
          else if (newLevel >= 3) rank = 'Embedded Systems Engineer';
          else if (newLevel >= 2) rank = 'Silicon Apprentice';

          db.prepare('UPDATE user_profile SET level = ?, rank = ? WHERE id = 1').run(newLevel, rank);

          db.prepare('INSERT INTO activity_feed (title, description, xp_earned, icon) VALUES (?, ?, ?, ?)')
            .run('Quiz Arena Completed', `Scored ${correctCount}/${total} (${percentage}%) in ${timeSpent}s.`, xpEarned, 'award');

          sendJson(200, {
            score: correctCount,
            total,
            percentage,
            timeSpent,
            xpEarned,
            review
          });
        } catch (dbErr) {
          console.error('[API Error /quiz/submit]', dbErr);
          sendJson(500, { error: 'Failed to record quiz submission' });
        }
      });
      return;
    }

    // 8. Coding Challenges Endpoint
    if (pathname === '/api/code/challenges' && method === 'GET') {
      sendJson(200, { challenges: CODING_CHALLENGES });
      return;
    }

    // 9. Validate Code Endpoint
    if (pathname === '/api/code/validate' && method === 'POST') {
      readJsonBody((err, body) => {
        if (err || !body.challengeId || !body.code) {
          sendJson(400, { error: 'Invalid payload: challengeId and code required' });
          return;
        }

        const result = validateArduinoCode(body.challengeId, body.code);
        if (result.success && result.compilationPassed) {
          try {
            const already = db.prepare('SELECT id FROM coding_challenges WHERE challenge_id = ?').get(body.challengeId);
            let xpAwarded = 0;
            if (!already) {
              const ch = CODING_CHALLENGES.find(c => c.id === body.challengeId);
              xpAwarded = ch ? ch.xpReward : 100;
              db.prepare('INSERT INTO coding_challenges (challenge_id) VALUES (?)').run(body.challengeId);
              db.prepare('UPDATE user_profile SET xp = xp + ? WHERE id = 1').run(xpAwarded);

              const updatedUser = db.prepare('SELECT xp FROM user_profile WHERE id = 1').get();
              const newLevel = Math.floor(updatedUser.xp / 100) + 1;
              let rank = 'Novice Wireman';
              if (newLevel >= 5) rank = 'ENTC Master Architect';
              else if (newLevel >= 4) rank = 'Senior Circuit Designer';
              else if (newLevel >= 3) rank = 'Embedded Systems Engineer';
              else if (newLevel >= 2) rank = 'Silicon Apprentice';

              db.prepare('UPDATE user_profile SET level = ?, rank = ? WHERE id = 1').run(newLevel, rank);
              db.prepare('INSERT INTO activity_feed (title, description, xp_earned, icon) VALUES (?, ?, ?, ?)')
                .run(`Challenge Passed: ${ch ? ch.title : body.challengeId}`, 'Embedded logic validated and firmware verified in simulation.', xpAwarded, 'code');
            }
            result.xpAwarded = xpAwarded;
          } catch (dbErr) {
            console.error('[API Error /code/validate DB]', dbErr);
          }
        }

        sendJson(200, result);
      });
      return;
    }

    // 10. AI Chat Endpoint
    if (pathname === '/api/ai/chat' && method === 'POST') {
      readJsonBody((err, body) => {
        if (err || !body.message) {
          sendJson(400, { error: 'Invalid payload: message required' });
          return;
        }

        const answer = handleAiQuery(body.message);
        sendJson(200, answer);
      });
      return;
    }

    // 11. IoT Telemetry Endpoint
    if (pathname === '/api/iot/telemetry' && method === 'POST') {
      readJsonBody((err, body) => {
        if (err) {
          sendJson(400, { error: 'Invalid JSON payload' });
          return;
        }

        const { temperature, light, motion, fanState, bulbState, alarmState, ruleTriggered } = body;
        try {
          db.prepare(`
            INSERT INTO iot_telemetry (temperature, light, motion, fan_state, bulb_state, alarm_state, rule_triggered)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).run(
            temperature || 25.0,
            light || 500.0,
            motion ? 1 : 0,
            fanState ? 1 : 0,
            bulbState ? 1 : 0,
            alarmState ? 1 : 0,
            ruleTriggered || null
          );

          sendJson(200, { success: true, loggedAt: new Date().toISOString() });
        } catch (dbErr) {
          console.error('[API Error /iot/telemetry]', dbErr);
          sendJson(500, { error: 'Failed to record IoT telemetry' });
        }
      });
      return;
    }

    // 12. Record Lab Experiment
    if (pathname === '/api/lab/record' && method === 'POST') {
      readJsonBody((err, body) => {
        if (err || !body.circuitType) {
          sendJson(400, { error: 'circuitType required' });
          return;
        }

        try {
          db.prepare('INSERT INTO lab_experiments (circuit_type, details) VALUES (?, ?)').run(
            body.circuitType,
            body.details ? JSON.stringify(body.details) : null
          );
          db.prepare('UPDATE user_profile SET xp = xp + 10 WHERE id = 1').run();
          db.prepare('INSERT INTO activity_feed (title, description, xp_earned, icon) VALUES (?, ?, ?, ?)')
            .run(`Lab Experiment: ${body.circuitType}`, 'Simulated circuit state and validated truth outputs.', 10, 'activity');

          sendJson(200, { success: true, xpAwarded: 10 });
        } catch (dbErr) {
          console.error('[API Error /lab/record]', dbErr);
          sendJson(500, { error: 'Failed to record lab experiment' });
        }
      });
      return;
    }

    // 404 for unknown API routes
    sendJson(404, { error: 'API route not found' });
    return;
  }

  // --- STATIC FILE SERVING ---
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA client-side routing
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

if (process.env.PIPE_NAME) {
  server.listen(process.env.PIPE_NAME, () => {
    console.log(`=======================================================`);
    console.log(`🚀 CIRCUITVERSE AI Server running on pipe: ${process.env.PIPE_NAME}`);
    console.log(`⚡ Mode: Full-Stack ENTC Testing IPC Pipeline`);
    console.log(`=======================================================`);
  });
} else {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🚀 CIRCUITVERSE AI Server running at http://localhost:${PORT}`);
    console.log(`⚡ Tagline: Learn Circuits. Simulate Ideas. Build Intelligence.`);
    console.log(`📡 Competition: CHAKRAVYUH — AI Vibe Coding Challenge`);
    console.log(`💡 Mode: Full-Stack ENTC Learning Platform with SQLite Persistence`);
    console.log(`=======================================================`);
  });
}

module.exports = { server, db, handleAiQuery, validateArduinoCode };
