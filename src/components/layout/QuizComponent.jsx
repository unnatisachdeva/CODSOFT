import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, AlertCircle, Flag } from 'lucide-react';

const QuizComponent = () => {
  // Sample quiz data - replace with your actual data structure
  const [quizData] = useState({
    id: 'health-quiz-001',
    title: 'Health & Wellness Quiz',
    description: 'Test your knowledge about health and physical activities',
    timeLimit: 600, // 10 minutes in seconds
    questions: [
      {
        id: 1,
        question: "Have you practiced sport or any physical activity out of your working hours at least 30 min or more during the last month?",
        type: 'multiple-choice',
        options: [
          { id: 'a', text: '5 times or more per week', isCorrect: true },
          { id: 'b', text: '1 or 3 times per week', isCorrect: false },
          { id: 'c', text: 'Less than 4 times per month', isCorrect: false },
          { id: 'd', text: "I don't practice sport during the month", isCorrect: false }
        ]
      },
      {
        id: 2,
        question: "How many hours of sleep do you get on average per night?",
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'Less than 6 hours', isCorrect: false },
          { id: 'b', text: '6-7 hours', isCorrect: false },
          { id: 'c', text: '7-9 hours', isCorrect: true },
          { id: 'd', text: 'More than 9 hours', isCorrect: false }
        ]
      },
      {
        id: 3,
        question: "What is the recommended daily water intake for adults?",
        type: 'multiple-choice',
        options: [
          { id: 'a', text: '4-6 glasses', isCorrect: false },
          { id: 'b', text: '8-10 glasses', isCorrect: true },
          { id: 'c', text: '12-14 glasses', isCorrect: false },
          { id: 'd', text: '2-3 glasses', isCorrect: false }
        ]
      },
      {
        id: 4,
        question: "Which of these is considered a healthy BMI range?",
        type: 'multiple-choice',
        options: [
          { id: 'a', text: '15-18.5', isCorrect: false },
          { id: 'b', text: '18.5-24.9', isCorrect: true },
          { id: 'c', text: '25-30', isCorrect: false },
          { id: 'd', text: 'Above 30', isCorrect: false }
        ]
      },
      {
        id: 5,
        question: "How often should adults engage in moderate-intensity aerobic activity?",
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'Once a week', isCorrect: false },
          { id: 'b', text: 'At least 150 minutes per week', isCorrect: true },
          { id: 'c', text: '30 minutes per month', isCorrect: false },
          { id: 'd', text: 'Only when feeling unwell', isCorrect: false }
        ]
      }
    ]
  });

  // Quiz state management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(quizData.timeLimit);
  const [quizStatus, setQuizStatus] = useState('active'); // 'active', 'completed', 'expired'
  const [showResults, setShowResults] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  // Timer logic
  useEffect(() => {
    if (quizStatus === 'active' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setQuizStatus('expired');
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStatus, timeRemaining]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, optionId) => {
    if (quizStatus !== 'active') return;
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  // Navigation functions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Flag question for review
  const toggleFlag = (questionId) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Calculate results
  const calculateResults = useCallback(() => {
    let correctAnswers = 0;
    let totalAnswered = 0;

    quizData.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (userAnswer) {
        totalAnswered++;
        const correctOption = question.options.find(opt => opt.isCorrect);
        if (correctOption && correctOption.id === userAnswer) {
          correctAnswers++;
        }
      }
    });

    const percentage = totalAnswered > 0 ? Math.round((correctAnswers / quizData.questions.length) * 100) : 0;
    
    return {
      correctAnswers,
      totalQuestions: quizData.questions.length,
      totalAnswered,
      percentage,
      timeSpent: quizData.timeLimit - timeRemaining
    };
  }, [userAnswers, quizData.questions, quizData.timeLimit, timeRemaining]);

  // Complete quiz
  const handleQuizComplete = () => {
    setQuizStatus('completed');
    setShowResults(true);
  };

  // Current question
  const currentQuestion = quizData.questions[currentQuestionIndex];
  const results = showResults ? calculateResults() : null;

  // Progress calculation
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercentage = (answeredCount / quizData.questions.length) * 100;

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
          <p className="text-gray-600">Here are your results</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-2">Score</h3>
            <p className="text-3xl font-bold">{results.percentage}%</p>
            <p className="text-sm opacity-90">
              {results.correctAnswers} out of {results.totalQuestions} correct
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-6 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-2">Time</h3>
            <p className="text-3xl font-bold">{formatTime(results.timeSpent)}</p>
            <p className="text-sm opacity-90">Time spent</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Question Review</h3>
          <div className="space-y-4">
            {quizData.questions.map((question, index) => {
              const userAnswer = userAnswers[question.id];
              const correctOption = question.options.find(opt => opt.isCorrect);
              const userOption = question.options.find(opt => opt.id === userAnswer);
              const isCorrect = correctOption && correctOption.id === userAnswer;

              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-800">
                      {index + 1}. {question.question}
                    </h4>
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <p className={`${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      Your answer: {userOption ? userOption.text : 'Not answered'}
                    </p>
                    {!isCorrect && (
                      <p className="text-green-600">
                        Correct answer: {correctOption.text}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{quizData.title}</h1>
          <p className="text-gray-600">{quizData.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2" />
            <span className={`font-mono text-lg ${timeRemaining < 60 ? 'text-red-600' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {quizData.questions.length}
          </span>
          <span className="text-sm text-gray-600">
            {answeredCount} answered ({Math.round(progressPercentage)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentQuestion.question}
          </h2>
          <button
            onClick={() => toggleFlag(currentQuestion.id)}
            className={`p-2 rounded-full transition-colors ${
              flaggedQuestions.has(currentQuestion.id) 
                ? 'bg-yellow-100 text-yellow-600' 
                : 'bg-gray-100 text-gray-400 hover:text-gray-600'
            }`}
          >
            <Flag className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                userAnswers[currentQuestion.id] === option.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  userAnswers[currentQuestion.id] === option.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {userAnswers[currentQuestion.id] === option.id && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="font-medium">{option.id.toUpperCase()}</span>
                <span className="ml-3">{option.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </button>

        {/* Question Navigator */}
        <div className="flex space-x-2">
          {quizData.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                index === currentQuestionIndex
                  ? 'bg-blue-600 text-white'
                  : userAnswers[quizData.questions[index].id]
                  ? 'bg-green-100 text-green-600 border border-green-300'
                  : flaggedQuestions.has(quizData.questions[index].id)
                  ? 'bg-yellow-100 text-yellow-600 border border-yellow-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex === quizData.questions.length - 1 ? (
          <button
            onClick={handleQuizComplete}
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Complete Quiz
            <CheckCircle className="w-5 h-5 ml-2" />
          </button>
        ) : (
          <button
            onClick={goToNextQuestion}
            disabled={currentQuestionIndex === quizData.questions.length - 1}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-green-600">{answeredCount}</div>
          <div className="text-sm text-gray-600">Answered</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-yellow-600">{flaggedQuestions.size}</div>
          <div className="text-sm text-gray-600">Flagged</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-600">
            {quizData.questions.length - answeredCount}
          </div>
          <div className="text-sm text-gray-600">Remaining</div>
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;