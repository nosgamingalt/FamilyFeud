import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const BioFamilyFeud = () => {
  const [questions, setQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTopic, setCurrentTopic] = useState('');
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [revealed, setRevealed] = useState([]);
  const [score, setScore] = useState({ team1: 0, team2: 0 });
  const [strikes, setStrikes] = useState(0);
  const [currentTeam, setCurrentTeam] = useState(1);
  const [showQuestion, setShowQuestion] = useState(false);
  const [teacherMode, setTeacherMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const TEACHER_PASSWORD = 'biorocks'; // Change this to your desired password

  // Load questions from JSON file
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/questions.json');
        if (!response.ok) {
          throw new Error('Failed to load questions');
        }
        const data = await response.json();
        setQuestions(data);
        setCurrentTopic(Object.keys(data)[0]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize shuffled questions when topic changes
  useEffect(() => {
    if (currentTopic && questions[currentTopic]) {
      setShuffledQuestions(shuffleArray(questions[currentTopic]));
      setCurrentQuestion(0);
      setRevealed([]);
      setStrikes(0);
      setShowQuestion(false);
    }
  }, [currentTopic, questions]);

  const questionData = shuffledQuestions[currentQuestion];

  const revealAnswer = (index) => {
    if (!revealed.includes(index)) {
      setRevealed([...revealed, index]);
      const team = currentTeam === 1 ? 'team1' : 'team2';
      setScore({ ...score, [team]: score[team] + questionData.points[index] });
    }
  };

  const addStrike = () => {
    if (strikes < 2) {
      setStrikes(strikes + 1);
    } else {
      setStrikes(0);
      setCurrentTeam(currentTeam === 1 ? 2 : 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setRevealed([]);
      setStrikes(0);
      setShowQuestion(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setRevealed([]);
      setStrikes(0);
      setShowQuestion(false);
    }
  };

  const switchTeam = () => {
    setCurrentTeam(currentTeam === 1 ? 2 : 1);
  };

  const resetGame = () => {
    setScore({ team1: 0, team2: 0 });
    setCurrentQuestion(0);
    setRevealed([]);
    setStrikes(0);
    setCurrentTeam(1);
    setShowQuestion(false);
  };

  const reshuffleQuestions = () => {
    if (questions[currentTopic]) {
      setShuffledQuestions(shuffleArray(questions[currentTopic]));
      setCurrentQuestion(0);
      setRevealed([]);
      setStrikes(0);
      setShowQuestion(false);
    }
  };

  const handleTeacherModeToggle = () => {
    if (teacherMode) {
      // If already in teacher mode, just turn it off
      setTeacherMode(false);
    } else {
      // If not in teacher mode, show password modal
      setShowPasswordModal(true);
      setPasswordInput('');
      setPasswordError('');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === TEACHER_PASSWORD) {
      setTeacherMode(true);
      setShowPasswordModal(false);
      setPasswordInput('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
      setPasswordInput('');
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordInput('');
    setPasswordError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-3xl">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-red-600 text-white p-8 rounded-lg max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Error Loading Questions</h2>
          <p className="mb-4">{error}</p>
          <p className="text-sm">Make sure the <code className="bg-red-800 px-2 py-1 rounded">questions.json</code> file is in the same directory as this HTML file.</p>
        </div>
      </div>
    );
  }

  if (!questionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-3xl">No questions available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">Teacher Mode</h2>
            <p className="text-gray-700 mb-4">Enter the password to access Teacher Mode:</p>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full p-3 border-2 border-purple-300 rounded-lg mb-2 focus:outline-none focus:border-purple-600"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-600 text-sm mb-3">{passwordError}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1"></div>
            <div className="flex-1 flex justify-center">
              <h1 className="text-5xl font-bold text-yellow-400" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}>
                BIOLOGY FEUD
              </h1>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={handleTeacherModeToggle}
                className={`${
                  teacherMode 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-orange-600 hover:bg-orange-700'
                } text-white font-bold py-2 px-4 rounded-lg transition text-sm`}
              >
                {teacherMode ? '👨‍🏫 Teacher Mode: ON' : '🔒 Teacher Mode'}
              </button>
            </div>
          </div>
          <p className="text-white text-xl">9th & 10th Grade Edition</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4 mb-6">
          <label className="text-white font-semibold block mb-2">Select Topic:</label>
          <select 
            value={currentTopic}
            onChange={(e) => setCurrentTopic(e.target.value)}
            className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white border-2 border-white border-opacity-30 text-lg"
          >
            {Object.keys(questions).map(topic => (
              <option key={topic} value={topic} className="bg-purple-900">{topic}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`bg-gradient-to-br from-red-600 to-red-800 rounded-lg p-6 text-center transform transition ${currentTeam === 1 ? 'scale-105 ring-4 ring-yellow-400' : ''}`}>
            <h2 className="text-white text-2xl font-bold mb-2">Team 1</h2>
            <p className="text-6xl font-bold text-white">{score.team1}</p>
          </div>
          <div className={`bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-center transform transition ${currentTeam === 2 ? 'scale-105 ring-4 ring-yellow-400' : ''}`}>
            <h2 className="text-white text-2xl font-bold mb-2">Team 2</h2>
            <p className="text-6xl font-bold text-white">{score.team2}</p>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-yellow-400 font-semibold text-lg">
              Question {currentQuestion + 1} of {shuffledQuestions.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={reshuffleQuestions}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
              >
                🔀 Reshuffle
              </button>
              <button
                onClick={() => setShowQuestion(!showQuestion)}
                className="bg-yellow-500 hover:bg-yellow-600 text-purple-900 font-bold py-2 px-6 rounded-lg transition"
              >
                {showQuestion ? 'Hide' : 'Show'} Question
              </button>
            </div>
          </div>
          
          {showQuestion && (
            <div className="bg-purple-800 bg-opacity-50 rounded-lg p-6 mb-4">
              <p className="text-white text-2xl font-semibold text-center leading-relaxed">
                {questionData.q}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4 mb-6">
            {[0, 1, 2].map(i => (
              <div key={i} className="relative">
                {i < strikes ? (
                  <X className="w-16 h-16 text-red-500" strokeWidth={4} />
                ) : (
                  <div className="w-16 h-16 border-4 border-white border-opacity-30 rounded"></div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 mb-6">
            {questionData.answers.map((answer, idx) => (
              <button
                key={idx}
                onClick={() => revealAnswer(idx)}
                disabled={revealed.includes(idx)}
                className={`p-4 rounded-lg text-left transition transform hover:scale-102 ${
                  revealed.includes(idx)
                    ? 'bg-green-600 text-white'
                    : teacherMode
                    ? 'bg-blue-500 bg-opacity-40 text-white hover:bg-opacity-50 border-2 border-yellow-400'
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold w-8">{idx + 1}</span>
                    <span className="text-xl font-semibold">
                      {revealed.includes(idx) || teacherMode ? answer : '???'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {revealed.includes(idx) && (
                      <Check className="w-6 h-6" />
                    )}
                    {(revealed.includes(idx) || teacherMode) && (
                      <span className="text-2xl font-bold">{questionData.points[idx]}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={addStrike}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              Add Strike
            </button>
            <button
              onClick={switchTeam}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              Switch Team
            </button>
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={nextQuestion}
              disabled={currentQuestion === shuffledQuestions.length - 1}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>

          <button
            onClick={resetGame}
            className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-purple-900 font-bold py-3 px-4 rounded-lg transition"
          >
            Reset Game
          </button>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-white">
          <h3 className="font-bold text-xl mb-3 text-yellow-400">How to Play:</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Select a topic from the dropdown menu</li>
            <li>Click "Show Question" to reveal the question to teams</li>
            <li>Teams take turns guessing answers</li>
            <li>Click an answer to reveal it and award points to the current team</li>
            <li>Click "Add Strike" for incorrect answers (3 strikes switches teams)</li>
            <li>Use "Switch Team" to manually change which team is playing</li>
            <li>Navigate between questions with Previous/Next buttons</li>
            <li>Click "🔀 Reshuffle" to randomize question order</li>
            <li>The team with the most points wins!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default BioFamilyFeud;