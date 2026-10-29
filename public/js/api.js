// Client API Service for CircuitVerse AI
const API_BASE = window.location.origin;

const api = {
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      return await res.json();
    } catch (e) {
      console.warn('API Health check failed:', e);
      return { status: 'offline', error: e.message };
    }
  },

  async getProgress() {
    try {
      const res = await fetch(`${API_BASE}/api/progress`);
      return await res.json();
    } catch (e) {
      console.error('Failed to get progress:', e);
      // Fallback to localStorage if server is unreachable
      const local = localStorage.getItem('circuitverse_progress');
      if (local) return JSON.parse(local);
      return {
        user: { name: 'ENTC Innovator', xp: 0, level: 1, rank: 'Novice Wireman' },
        completedLessons: [],
        completedChallenges: [],
        quizAttempts: [],
        quizStats: { totalAttempts: 0, bestScore: 0, avgScore: 0 },
        activities: [],
        badges: []
      };
    }
  },

  async resetProgress() {
    try {
      const res = await fetch(`${API_BASE}/api/progress/reset`, { method: 'POST' });
      localStorage.removeItem('circuitverse_progress');
      return await res.json();
    } catch (e) {
      console.error('Failed to reset progress:', e);
      return { success: false, error: e.message };
    }
  },

  async getLessons() {
    try {
      const res = await fetch(`${API_BASE}/api/lessons`);
      const data = await res.json();
      return data.lessons || [];
    } catch (e) {
      console.error('Failed to get lessons:', e);
      return [];
    }
  },

  async completeLesson(lessonId) {
    try {
      const res = await fetch(`${API_BASE}/api/lessons/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId })
      });
      return await res.json();
    } catch (e) {
      console.error('Failed to complete lesson:', e);
      return { success: false, error: e.message };
    }
  },

  async getQuizQuestions() {
    try {
      const res = await fetch(`${API_BASE}/api/quiz/questions`);
      const data = await res.json();
      return data.questions || [];
    } catch (e) {
      console.error('Failed to get quiz questions:', e);
      return [];
    }
  },

  async submitQuiz(answers, timeSpent) {
    try {
      const res = await fetch(`${API_BASE}/api/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, timeSpent })
      });
      return await res.json();
    } catch (e) {
      console.error('Failed to submit quiz:', e);
      return { error: e.message };
    }
  },

  async getCodingChallenges() {
    try {
      const res = await fetch(`${API_BASE}/api/code/challenges`);
      const data = await res.json();
      return data.challenges || [];
    } catch (e) {
      console.error('Failed to get coding challenges:', e);
      return [];
    }
  },

  async validateCode(challengeId, code) {
    try {
      const res = await fetch(`${API_BASE}/api/code/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, code })
      });
      return await res.json();
    } catch (e) {
      console.error('Failed to validate code:', e);
      return { success: false, error: e.message };
    }
  },

  async sendAiChat(message) {
    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      return await res.json();
    } catch (e) {
      console.error('AI chat error:', e);
      return {
        success: false,
        error: e.message,
        response: 'Connection to the CircuitVerse ENTC Knowledge Engine failed. Please ensure the backend server is running.'
      };
    }
  },

  async sendIoTTelemetry(data) {
    try {
      const res = await fetch(`${API_BASE}/api/iot/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async recordLabExperiment(circuitType, details) {
    try {
      const res = await fetch(`${API_BASE}/api/lab/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ circuitType, details })
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};

window.api = api;
