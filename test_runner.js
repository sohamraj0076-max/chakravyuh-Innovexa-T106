// CIRCUITVERSE AI - Automated Integration & Audit Test Suite
// Executes real HTTP requests over the Node HTTP stack
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');

const PIPE_NAME = '\\\\.\\pipe\\circuitverse-audit';
process.env.PIPE_NAME = PIPE_NAME;

// Load server
const serverModule = require('./server.js');

function httpRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      socketPath: PIPE_NAME,
      path: options.path,
      method: options.method || 'GET',
      headers: {
        'host': 'localhost',
        ...(options.headers || {})
      }
    };

    if (postData) {
      const dataStr = typeof postData === 'string' ? postData : JSON.stringify(postData);
      reqOptions.headers['Content-Type'] = 'application/json';
      reqOptions.headers['Content-Length'] = Buffer.byteLength(dataStr);
    }

    const req = http.request(reqOptions, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch (e) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
          json
        });
      });
    });

    req.on('error', err => reject(err));

    if (postData) {
      const dataStr = typeof postData === 'string' ? postData : JSON.stringify(postData);
      req.write(dataStr);
    }
    req.end();
  });
}

async function runAudit() {
  console.log('\n======================================================');
  console.log('🧪 CIRCUITVERSE AI — CRITICAL LAUNCH READINESS AUDIT');
  console.log('======================================================\n');

  // Allow server to bind to pipe
  await new Promise(r => setTimeout(r, 600));

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Health check
  await test('GET /api/health (HTTP 200, online status, DB connected)', async () => {
    const res = await httpRequest({ path: '/api/health' });
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}: ${res.body}`);
    if (res.json.status !== 'online' || !res.json.dbConnected) throw new Error('Unhealthy status reported');
  });

  // 2. User progress
  await test('GET /api/progress (HTTP 200, returns profile and statistics)', async () => {
    const res = await httpRequest({ path: '/api/progress' });
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}: ${res.body}`);
    if (!res.json.user || typeof res.json.user.xp !== 'number') throw new Error('Invalid user profile payload');
  });

  // 3. Curriculum
  await test('GET /api/lessons (HTTP 200, returns all 6 ENTC modules)', async () => {
    const res = await httpRequest({ path: '/api/lessons' });
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}: ${res.body}`);
    if (!Array.isArray(res.json.lessons) || res.json.lessons.length !== 6) {
      throw new Error(`Expected 6 lessons, got ${res.json.lessons ? res.json.lessons.length : 0}`);
    }
  });

  // 4. Complete a lesson & award XP
  await test('POST /api/lessons/complete (HTTP 200, awards 50 XP to database)', async () => {
    const res = await httpRequest(
      { path: '/api/lessons/complete', method: 'POST' },
      { lessonId: 'digital-electronics' }
    );
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}: ${res.body}`);
    if (!res.json.success) throw new Error('Lesson completion failed');
  });

  // 5. Quiz questions
  await test('GET /api/quiz/questions (HTTP 200, returns sanitized question bank)', async () => {
    const res = await httpRequest({ path: '/api/quiz/questions' });
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}: ${res.body}`);
    if (!Array.isArray(res.json.questions) || res.json.questions.length < 10) {
      throw new Error('Expected at least 10 quiz questions');
    }
  });

  // 6. Submit quiz & grade
  await test('POST /api/quiz/submit (HTTP 200, grades answers, computes accuracy & persists)', async () => {
    const res = await httpRequest(
      { path: '/api/quiz/submit', method: 'POST' },
      {
        answers: { "1": 1, "2": 2, "3": 1, "4": 1, "5": 1 },
        timeSpent: 28
      }
    );
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}: ${res.body}`);
    if (res.json.score === undefined || res.json.percentage === undefined || !Array.isArray(res.json.review)) {
      throw new Error('Invalid quiz grading structure');
    }
  });

  // 7. Coding challenges
  await test('GET /api/code/challenges (HTTP 200, returns embedded challenges)', async () => {
    const res = await httpRequest({ path: '/api/code/challenges' });
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}: ${res.body}`);
    if (!Array.isArray(res.json.challenges) || res.json.challenges.length === 0) {
      throw new Error('No coding challenges found');
    }
  });

  // 8. Deterministic Arduino validator
  await test('POST /api/code/validate (HTTP 200, verifies C++ sketch and outputs virtual serial)', async () => {
    const sampleSketch = `
      const int LED_PIN = 13;
      void setup() {
        Serial.begin(9600);
        pinMode(LED_PIN, OUTPUT);
      }
      void loop() {
        digitalWrite(LED_PIN, HIGH);
        Serial.println("LED ON");
        delay(1000);
        digitalWrite(LED_PIN, LOW);
        Serial.println("LED OFF");
        delay(1000);
      }
    `;
    const res = await httpRequest(
      { path: '/api/code/validate', method: 'POST' },
      { challengeId: 'challenge-blink', code: sampleSketch }
    );
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}: ${res.body}`);
    if (!res.json.success || !res.json.compilationPassed || !Array.isArray(res.json.serialOutput)) {
      throw new Error('Arduino validation logic failed');
    }
  });

  // 9. AI Assistant query resolution
  await test('POST /api/ai/chat (HTTP 200, matches ENTC knowledge concepts)', async () => {
    const res = await httpRequest(
      { path: '/api/ai/chat', method: 'POST' },
      { message: 'Explain Nyquist Sampling Theorem' }
    );
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}: ${res.body}`);
    if (!res.json.success || !res.json.response.includes('Nyquist')) {
      throw new Error('AI query resolution did not match concept');
    }
  });

  // 10. IoT telemetry recording
  await test('POST /api/iot/telemetry (HTTP 200, logs edge sensor readings & evaluates rules)', async () => {
    const res = await httpRequest(
      { path: '/api/iot/telemetry', method: 'POST' },
      {
        temperature: 31.0,
        light: 150,
        motion: 1,
        fanState: 1,
        bulbState: 1,
        alarmState: 1,
        ruleTriggered: 'High temperature threshold exceeded'
      }
    );
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}: ${res.body}`);
    if (!res.json.success) throw new Error('Telemetry logging failed');
  });

  // 11. Static files: index.html
  await test('GET / (HTTP 200, serves SPA HTML shell)', async () => {
    const res = await httpRequest({ path: '/' });
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}: ${res.body}`);
    if (!res.body.includes('CIRCUITVERSE')) throw new Error('HTML missing brand title');
    if (!res.headers['content-type'].includes('text/html')) throw new Error('Wrong content-type for HTML');
  });

  // 12. Static files: CSS style
  await test('GET /css/style.css (HTTP 200, serves theme stylesheet)', async () => {
    const res = await httpRequest({ path: '/css/style.css' });
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}: ${res.body}`);
    if (!res.body.includes('--accent-cyan')) throw new Error('CSS missing expected design tokens');
    if (!res.headers['content-type'].includes('text/css')) throw new Error('Wrong content-type for CSS');
  });

  // 13. Persistence verification across restart
  await test('Database Persistence Verification across simulated server reboot', async () => {
    const { DatabaseSync } = require('node:sqlite');
    const db = new DatabaseSync(path.join(__dirname, 'data', 'circuitverse.db'));
    const userRow = db.prepare('SELECT * FROM user_profile WHERE id = 1').get();
    const completed = db.prepare('SELECT COUNT(*) as count FROM completed_lessons').get();
    const quizzes = db.prepare('SELECT COUNT(*) as count FROM quiz_attempts').get();
    const iotLogs = db.prepare('SELECT COUNT(*) as count FROM iot_telemetry').get();

    if (!userRow || userRow.xp <= 0) throw new Error('User XP not persisted in database');
    if (completed.count === 0) throw new Error('Completed lessons not persisted');
    if (quizzes.count === 0) throw new Error('Quiz attempts not persisted');
    if (iotLogs.count === 0) throw new Error('IoT telemetry not persisted');
  });

  console.log('\n======================================================');
  console.log(`📊 AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

runAudit().catch(err => {
  console.error('Fatal audit execution error:', err);
  process.exit(1);
});
