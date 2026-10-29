// Smart Quiz Arena Module
const QuizModule = {
  questions: [],
  currentIndex: 0,
  userAnswers: {}, // { [questionId]: selectedOptionIndex }
  timerSeconds: 25,
  timerInterval: null,
  totalElapsed: 0,
  isFinished: false,
  submissionResult: null,

  async render() {
    const container = document.getElementById('view-quiz');
    if (!container) return;

    container.innerHTML = `
      <div id="quiz-main-container">
        <div style="text-align: center; padding: 60px 20px;">
          <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 12px; color: #fff;">ENTC Smart Quiz Arena</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem; max-width: 600px; margin: 0 auto 30px;">
            Test your command of digital logic, signal processing, microcontroller architecture, and telecommunications under time constraints.
          </p>
          <button class="btn btn-primary" onclick="QuizModule.startQuiz()" style="padding: 14px 32px; font-size: 1rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
            Initialize Quiz Arena
          </button>
        </div>
      </div>
    `;
  },

  async startQuiz() {
    this.questions = await window.api.getQuizQuestions();
    if (!this.questions || this.questions.length === 0) {
      window.showToast?.('Failed to load quiz questions', 'error');
      return;
    }

    this.currentIndex = 0;
    this.userAnswers = {};
    this.isFinished = false;
    this.submissionResult = null;
    this.totalElapsed = 0;

    this.renderQuestionScreen();
    this.startTimer();
    window.soundEngine?.playSwitch();
  },

  startTimer() {
    clearInterval(this.timerInterval);
    this.timerSeconds = 25;
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      this.timerSeconds--;
      this.totalElapsed++;
      this.updateTimerDisplay();

      if (this.timerSeconds <= 0) {
        clearInterval(this.timerInterval);
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        // Timeout: auto-advance or mark unanswered
        window.soundEngine?.playError();
        this.nextQuestion();
      }
    }, 1000);
  },

  updateTimerDisplay() {
    const timerEl = document.getElementById('quiz-timer-text');
    const timerBar = document.getElementById('quiz-timer-bar');
    if (timerEl) timerEl.innerText = `${this.timerSeconds}s`;
    if (timerBar) {
      const pct = (this.timerSeconds / 25) * 100;
      timerBar.style.width = `${pct}%`;
      if (this.timerSeconds <= 5) {
        timerBar.style.background = 'var(--status-danger)';
      } else {
        timerBar.style.background = 'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet))';
      }
    }
  },

  renderQuestionScreen() {
    const container = document.getElementById('quiz-main-container');
    if (!container) return;

    const q = this.questions[this.currentIndex];
    const totalQ = this.questions.length;
    const progressPct = Math.round(((this.currentIndex + 1) / totalQ) * 100);

    container.innerHTML = `
      <div style="max-width: 850px; margin: 0 auto;">
        <!-- Top Status Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--accent-cyan); background: rgba(6, 182, 212, 0.15); padding: 4px 10px; border-radius: var(--radius-sm);">
              ${q.category}
            </span>
            <span style="font-size: 0.85rem; color: var(--text-dim); margin-left: 10px;">Question ${this.currentIndex + 1} of ${totalQ}</span>
          </div>

          <!-- Countdown Display -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--status-warning)" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span id="quiz-timer-text" style="font-family: var(--font-mono); font-weight: 800; color: #fbbf24; font-size: 1.1rem;">25s</span>
          </div>
        </div>

        <!-- Timer progress line -->
        <div style="width: 100%; height: 6px; background: rgba(255, 255, 255, 0.08); border-radius: var(--radius-full); overflow: hidden; margin-bottom: 24px;">
          <div id="quiz-timer-bar" style="width: 100%; height: 100%; background: linear-gradient(90deg, var(--accent-cyan), var(--accent-violet)); transition: width 1s linear;"></div>
        </div>

        <!-- Question Card -->
        <div class="card" style="padding: 36px; background: rgba(10, 16, 31, 0.95); border-color: var(--border-glow); margin-bottom: 24px;">
          <h3 style="font-size: 1.35rem; font-weight: 700; line-height: 1.4; margin-bottom: 28px; color: #fff;">
            ${q.question}
          </h3>

          <!-- Options -->
          <div style="display: flex; flex-direction: column; gap: 14px;" id="quiz-options-list">
            ${q.options.map((opt, idx) => `
              <button class="btn btn-secondary" style="justify-content: flex-start; text-align: left; padding: 16px 20px; font-size: 0.95rem; border-radius: var(--radius-md);" onclick="QuizModule.selectOption(${q.id}, ${idx})">
                <span style="width: 28px; height: 28px; border-radius: 50%; background: rgba(255, 255, 255, 0.08); display: inline-flex; align-items: center; justify-content: center; margin-right: 14px; font-weight: 700; font-size: 0.85rem;">
                  ${String.fromCharCode(65 + idx)}
                </span>
                ${opt}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Navigation Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <button class="btn btn-secondary" onclick="QuizModule.quitQuiz()">
            Quit Quiz
          </button>
          <div style="font-size: 0.85rem; color: var(--text-dim);">
            ${totalQ - this.currentIndex - 1} questions remaining
          </div>
        </div>
      </div>
    `;
  },

  selectOption(questionId, optionIndex) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    clearInterval(this.timerInterval);

    this.userAnswers[questionId] = optionIndex;
    window.soundEngine?.playSwitch();

    // Immediate tactile visual feedback: highlight chosen button
    const buttons = document.querySelectorAll('#quiz-options-list button');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === optionIndex) {
        btn.style.borderColor = 'var(--accent-cyan)';
        btn.style.background = 'rgba(6, 182, 212, 0.25)';
        btn.style.boxShadow = 'var(--shadow-glow-cyan)';
      }
    });

    // Advance smoothly after 300ms
    setTimeout(() => {
      this.nextQuestion();
    }, 320);
  },

  nextQuestion() {
    clearInterval(this.timerInterval);
    this.isTransitioning = false;
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.renderQuestionScreen();
      this.startTimer();
    } else {
      this.finishQuiz();
    }
  },

  async finishQuiz() {
    clearInterval(this.timerInterval);
    const container = document.getElementById('quiz-main-container');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <div class="live-dot" style="width: 20px; height: 20px; margin: 0 auto 20px;"></div>
          <h3 style="font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 8px;">Submitting & Grading Answers...</h3>
          <p style="color: var(--text-muted);">Syncing results to SQLite database and calculating XP rewards...</p>
        </div>
      `;
    }

    const res = await window.api.submitQuiz(this.userAnswers, this.totalElapsed);
    this.submissionResult = res;

    if (res.percentage >= 70) {
      window.soundEngine?.playSuccess();
    } else {
      window.soundEngine?.playError();
    }

    window.app?.refreshTopStats();
    this.renderResultsScreen();
  },

  renderResultsScreen() {
    const container = document.getElementById('quiz-main-container');
    if (!container || !this.submissionResult) return;

    const res = this.submissionResult;
    const isPassed = res.percentage >= 60;

    container.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto;">
        <!-- Results Hero Card -->
        <div class="card" style="padding: 40px; text-align: center; background: rgba(10, 16, 31, 0.95); border-color: ${isPassed ? 'var(--status-success)' : 'var(--status-warning)'}; margin-bottom: 28px;">
          <div style="width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 16px; background: ${isPassed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}; display: flex; align-items: center; justify-content: center; color: ${isPassed ? 'var(--status-success)' : '#fbbf24'};">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              ${isPassed ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>'}
            </svg>
          </div>
          <h2 style="font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 6px;">
            ${isPassed ? 'Outstanding Achievement!' : 'Quiz Complete — Room to Grow!'}
          </h2>
          <p style="color: var(--text-muted); font-size: 1rem; margin-bottom: 24px;">
            You scored <strong>${res.score}</strong> out of <strong>${res.total}</strong> questions correctly (${res.percentage}% accuracy) in ${res.timeSpent} seconds.
          </p>

          <div style="display: inline-flex; gap: 20px; background: rgba(255, 255, 255, 0.04); padding: 14px 28px; border-radius: var(--radius-full); margin-bottom: 24px;">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">XP Earned</span>
              <div style="font-size: 1.3rem; font-weight: 800; color: #fbbf24;">+${res.xpEarned} XP</div>
            </div>
            <div style="border-left: 1px solid var(--border-subtle); padding-left: 20px;">
              <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">Status</span>
              <div style="font-size: 1.3rem; font-weight: 800; color: ${isPassed ? 'var(--status-success)' : 'var(--status-warning)'};">
                ${isPassed ? 'PASSED' : 'REVIEW'}
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: center; gap: 14px;">
            <button class="btn btn-primary" onclick="QuizModule.startQuiz()">
              Retake Quiz Arena
            </button>
            <button class="btn btn-secondary" onclick="window.router.navigate('dashboard')">
              Return to Dashboard
            </button>
          </div>
        </div>

        <!-- Question-by-Question Review -->
        <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 16px; color: #fff;">Detailed Question Review & Explanations:</h3>
        <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 40px;">
          ${res.review.map((item, idx) => `
            <div class="card" style="padding: 20px; border-left: 4px solid ${item.isCorrect ? 'var(--status-success)' : 'var(--status-danger)'};">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase;">
                  ${item.category}
                </span>
                <span style="font-size: 0.8rem; font-weight: 700; color: ${item.isCorrect ? 'var(--status-success)' : 'var(--status-danger)'};">
                  ${item.isCorrect ? '✓ Correct' : '✕ Incorrect'}
                </span>
              </div>
              <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 12px; color: #fff;">
                ${idx + 1}. ${item.question}
              </h4>
              <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.88rem; margin-bottom: 12px;">
                <div style="color: ${item.isCorrect ? 'var(--status-success)' : 'var(--status-danger)'}; font-weight: 600;">
                  Your answer: ${item.userSelected !== -1 ? item.options[item.userSelected] : 'Unanswered (Timed out)'}
                </div>
                ${!item.isCorrect ? `
                  <div style="color: var(--status-success); font-weight: 600;">
                    Correct answer: ${item.options[item.correctAnswer]}
                  </div>
                ` : ''}
              </div>
              <div style="font-size: 0.82rem; color: var(--text-muted); background: rgba(0, 0, 0, 0.2); padding: 10px 14px; border-radius: var(--radius-sm);">
                <strong>Explanation:</strong> ${item.explanation}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  quitQuiz() {
    clearInterval(this.timerInterval);
    this.render();
  }
};

window.QuizModule = QuizModule;
