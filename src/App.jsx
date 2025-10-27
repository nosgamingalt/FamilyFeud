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
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [teacherMode, setTeacherMode] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [teacherPwdInput, setTeacherPwdInput] = useState('');
  const [teacherPwdError, setTeacherPwdError] = useState('');

  // Load questions from JSON file
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('./questions.json');
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
      // If teacher mode is on, show questions in original order; otherwise shuffle
      setShuffledQuestions(teacherMode ? questions[currentTopic] : shuffleArray(questions[currentTopic]));
      setCurrentQuestion(0);
      setRevealed([]);
      setStrikes(0);
      setTimerActive(false);
      setTimeLeft(30);
      setCurrentTeam(1);
    }
  }, [currentTopic, questions, teacherMode]);

  // Timer effect - Manual only, no auto-restart
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);

      // Timer ran out - add a strike but don't auto-restart
      if (strikes < 2) {
        setStrikes(strikes + 1);
      } else {
        // 3rd strike - switch teams and clear strikes
        setStrikes(0);
        setCurrentTeam(currentTeam === 1 ? 2 : 1);
        setTimeLeft(30); // Reset timer when teams are switched due to 3rd strike
        setTimerActive(false);
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, strikes, currentTeam]);

  const questionData = shuffledQuestions[currentQuestion];

  const revealAnswer = (index) => {
    if (!revealed.includes(index)) {
      // Show the answer and add points
      setRevealed([...revealed, index]);
      const team = currentTeam === 1 ? 'team1' : 'team2';
      setScore({ ...score, [team]: score[team] + questionData.points[index] });
      setTimeLeft(30); // Reset timer to 30 seconds when answer is clicked
    } else {
      // Hide the answer and remove points
      setRevealed(revealed.filter(i => i !== index));
      const team = currentTeam === 1 ? 'team1' : 'team2';
      setScore({ ...score, [team]: score[team] - questionData.points[index] });
    }
  };

  const addStrike = () => {
    setTimeLeft(30); // Reset timer when manually adding strike
    if (strikes < 2) {
      // Add strike - no auto-restart
      setStrikes(strikes + 1);
    } else {
      // 3rd strike - switch teams and clear strikes
      setStrikes(0);
      setCurrentTeam(currentTeam === 1 ? 2 : 1);
      setTimerActive(false);
      setTimeLeft(30); // Ensure timer is reset when switching teams
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setRevealed([]);
      setStrikes(0);
      setTimerActive(false);
      setTimeLeft(30);
      setCurrentTeam(1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setRevealed([]);
      setStrikes(0);
      setTimerActive(false);
      setTimeLeft(30);
      setCurrentTeam(1);
    }
  };

  const switchTeam = () => {
    setCurrentTeam(currentTeam === 1 ? 2 : 1);
    setTimerActive(false);
    setTimeLeft(30); // Reset timer when switching teams manually
  };

  const resetGame = () => {
    setScore({ team1: 0, team2: 0 });
    setCurrentQuestion(0);
    setRevealed([]);
    setStrikes(0);
    setCurrentTeam(1);
    setTimerActive(false);
    setTimeLeft(30);
  };

  const reshuffleQuestions = () => {
    if (questions[currentTopic]) {
      // If teacher mode is enabled, keep original order; otherwise shuffle
      const list = teacherMode ? questions[currentTopic] : shuffleArray(questions[currentTopic]);
      setShuffledQuestions(list);
      setCurrentQuestion(0);
      setRevealed([]);
      setStrikes(0);
      setTimerActive(false);
      setTimeLeft(30);
      setCurrentTeam(1);
    }
  };

  const toggleTeacherMode = () => {
    if (!teacherMode) {
      // Open modal to enter password
      setTeacherPwdInput('');
      setTeacherPwdError('');
      setShowTeacherModal(true);
    } else {
      // disable teacher mode and reshuffle
      setTeacherMode(false);
      if (currentTopic && questions[currentTopic]) {
        setShuffledQuestions(shuffleArray(questions[currentTopic]));
        setCurrentQuestion(0);
        setRevealed([]);
        setStrikes(0);
        setTimerActive(false);
        setTimeLeft(30);
        setCurrentTeam(1);
      }
    }
  };

  const confirmTeacherPassword = () => {
    if (teacherPwdInput === 'biorocks') {
      setTeacherMode(true);
      setShowTeacherModal(false);
      if (currentTopic && questions[currentTopic]) {
        setShuffledQuestions(questions[currentTopic]);
        setCurrentQuestion(0);
        setRevealed([]);
        setStrikes(0);
        setTimerActive(false);
        setTimeLeft(30);
        setCurrentTeam(1);
      }
    } else {
      setTeacherPwdError('Incorrect password');
    }
  };

  const cancelTeacherModal = () => {
    setShowTeacherModal(false);
    setTeacherPwdInput('');
    setTeacherPwdError('');
  };

  const resetTimer = () => {
    setTimeLeft(30);
    setTimerActive(false);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-3">
      <div className="max-w-7xl mx-auto">
        {showTeacherModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold mb-2">Enter Teacher Password</h3>
              <input
                type="password"
                value={teacherPwdInput}
                onChange={(e) => setTeacherPwdInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') confirmTeacherPassword(); }}
                className="w-full p-2 mb-2 border rounded"
                placeholder="Password"
                autoFocus
              />
              {teacherPwdError && <div className="text-red-600 text-sm mb-2">{teacherPwdError}</div>}
              <div className="flex justify-end gap-2">
                <button onClick={cancelTeacherModal} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
                <button onClick={confirmTeacherPassword} className="px-3 py-1 bg-yellow-600 text-white rounded">Unlock</button>
              </div>
            </div>
          </div>
        )}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-yellow-400 mb-1" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}>
            BIOLOGY FEUD
          </h1>
          <p className="text-white text-lg">Wisconsin 9th & 10th Grade Edition</p>
        </div>

        {/* Topic Selection - Full Width */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-3 mb-3">
          <label className="text-white font-semibold block mb-1 text-sm">Select Topic:</label>
          <select 
            value={currentTopic}
            onChange={(e) => setCurrentTopic(e.target.value)}
            className="w-full p-2 rounded-lg bg-white bg-opacity-20 text-white border-2 border-white border-opacity-30"
          >
            {Object.keys(questions).map(topic => (
              <option key={topic} value={topic} className="bg-purple-900">{topic}</option>
            ))}
          </select>
        </div>

        {/* Team Scores Row */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className={`bg-gradient-to-br from-red-600 to-red-800 rounded-lg p-3 text-center ${currentTeam === 1 ? 'ring-4 ring-yellow-400' : ''}`}>
            <h2 className="text-white text-lg font-bold">Team 1</h2>
            <p className="text-4xl font-bold text-white">{score.team1}</p>
          </div>
          <div className={`bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-3 text-center ${currentTeam === 2 ? 'ring-4 ring-yellow-400' : ''}`}>
            <h2 className="text-white text-lg font-bold">Team 2</h2>
            <p className="text-4xl font-bold text-white">{score.team2}</p>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-yellow-400 font-semibold">
              Question {currentQuestion + 1} of {shuffledQuestions.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={reshuffleQuestions}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-3 rounded-lg transition text-sm"
              >
                🔀 Reshuffle
              </button>
              <button
                onClick={toggleTeacherMode}
                className={`bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded-lg transition text-sm ${teacherMode ? 'ring-2 ring-white' : ''}`}
                title="Teacher mode: enter password to view all questions in order"
              >
                🧑‍🏫 {teacherMode ? 'Teacher ON' : 'Teacher Mode'}
              </button>
            </div>
          </div>

          {/* Question Selector Dropdown */}
          <div className="mb-3">
            <label className="text-white font-semibold block mb-1 text-sm">Jump to Question:</label>
            <select 
              value={currentQuestion}
              onChange={(e) => {
                setCurrentQuestion(Number(e.target.value));
                setRevealed([]);
                setStrikes(0);
                setTimerActive(false);
                setTimeLeft(30);
                setCurrentTeam(1);
              }}
              className="w-full p-2 rounded-lg bg-white bg-opacity-20 text-white border-2 border-white border-opacity-30"
            >
              {shuffledQuestions.map((q, idx) => (
                <option key={idx} value={idx} className="bg-purple-900">
                  Question {idx + 1}: {q.q.substring(0, 60)}...
                </option>
              ))}
            </select>
          </div>

          <div className="bg-purple-800 bg-opacity-50 rounded-lg p-4 mb-3">
            <p className="text-white text-xl font-semibold text-center leading-relaxed">
              {questionData.q}
            </p>
          </div>
          
          {/* Timer Display - Centered */}
          <div className="flex justify-center mb-3">
            <div className={`relative w-24 h-24 flex items-center justify-center rounded-full border-6 transition-all ${
              timeLeft <= 5 ? 'border-red-500 animate-pulse' : timeLeft <= 10 ? 'border-yellow-500' : 'border-green-500'
            }`}>
              <div className="text-center">
                <div className={`text-4xl font-bold ${
                  timeLeft <= 5 ? 'text-red-400' : timeLeft <= 10 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {timeLeft}
                    </div>
                    <div className="text-white text-xs">seconds</div>
                  </div>
                </div>
              </div>

              {/* Strikes - Below Timer */}
              <div className="flex justify-center gap-3 mb-3">
                {[0, 1, 2].map(i => (
                  <div key={i} className="relative">
                    {i < strikes ? (
                      <X className="w-12 h-12 text-red-500" strokeWidth={4} />
                    ) : (
                      <div className="w-12 h-12 border-4 border-white border-opacity-30 rounded"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center gap-2 mb-3">
                <button
                  onClick={() => {
                    if (timerActive) {
                      // Pause the timer
                      setTimerActive(false);
                    } else {
                      // Start the timer
                      if (timeLeft === 0) {
                        setTimeLeft(30);
                      }
                      setTimerActive(true);
                    }
                  }}
                  className={`${
                    timerActive 
                      ? 'bg-orange-500 hover:bg-orange-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white font-bold py-1.5 px-4 rounded-lg transition text-sm`}
                >
                  {timerActive ? '⏸ Pause' : '▶ Start'}
                </button>
                <button
                  onClick={resetTimer}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-4 rounded-lg transition text-sm"
                >
                  🔄 Reset
                </button>
              </div>
          
          <div className="grid grid-cols-1 gap-2 mb-3">
            {questionData.answers.map((answer, idx) => {
              const visible = teacherMode || revealed.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => revealAnswer(idx)}
                  disabled={teacherMode}
                  className={`p-3 rounded-lg text-left transition transform hover:scale-102 ${
                    visible
                      ? 'bg-green-600 text-white'
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  } ${teacherMode ? 'opacity-90 cursor-not-allowed' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold w-6">{idx + 1}</span>
                      <span className="text-lg font-semibold">
                        {visible ? answer : '???'}
                      </span>
                    </div>
                    {visible && (
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        <span className="text-xl font-bold">{questionData.points[idx]}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
            <button
              onClick={addStrike}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg transition text-sm"
            >
              Add Strike
            </button>
            <button
              onClick={switchTeam}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-lg transition text-sm"
            >
              Switch Team
            </button>
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              ← Previous
            </button>
            <button
              onClick={nextQuestion}
              disabled={currentQuestion === shuffledQuestions.length - 1}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next →
            </button>
          </div>

          <button
            onClick={resetGame}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-purple-900 font-bold py-2 px-3 rounded-lg transition text-sm"
          >
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default BioFamilyFeud;