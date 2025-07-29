import React, { createContext, useContext, useState, useEffect } from 'react'

const QuizContext = createContext()

export const useQuiz = () => {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
}

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([])
  const [quizResults, setQuizResults] = useState([])

  useEffect(() => {
    // Load quizzes from localStorage
    const savedQuizzes = localStorage.getItem('quizzes')
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes))
    } else {
      // Add some sample quizzes
      const sampleQuizzes = [
        {
          id: '1',
          title: 'JavaScript Basics',
          description: 'Test your knowledge of JavaScript fundamentals',
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
          questions: [
            {
              id: '1',
              question: 'What does "var" keyword do in JavaScript?',
              options: [
                'Declares a variable',
                'Creates a function',
                'Imports a module',
                'Defines a class'
              ],
              correctAnswer: 0
            },
            {
              id: '2',
              question: 'Which of the following is NOT a JavaScript data type?',
              options: [
                'String',
                'Boolean',
                'Integer',
                'Undefined'
              ],
              correctAnswer: 2
            }
          ]
        }
      ]
      setQuizzes(sampleQuizzes)
      localStorage.setItem('quizzes', JSON.stringify(sampleQuizzes))
    }

    // Load quiz results
    const savedResults = localStorage.getItem('quizResults')
    if (savedResults) {
      setQuizResults(JSON.parse(savedResults))
    }
  }, [])

  const createQuiz = (quizData) => {
    const newQuiz = {
      id: Date.now().toString(),
      ...quizData,
      createdAt: new Date().toISOString()
    }
    
    const updatedQuizzes = [...quizzes, newQuiz]
    setQuizzes(updatedQuizzes)
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes))
    
    return newQuiz
  }

  const getQuiz = (id) => {
    return quizzes.find(quiz => quiz.id === id)
  }

  const saveQuizResult = (result) => {
    const newResult = {
      id: Date.now().toString(),
      ...result,
      completedAt: new Date().toISOString()
    }
    
    const updatedResults = [...quizResults, newResult]
    setQuizResults(updatedResults)
    localStorage.setItem('quizResults', JSON.stringify(updatedResults))
    
    return newResult
  }

  const getUserResults = (userId) => {
    return quizResults.filter(result => result.userId === userId)
  }

  const getQuizResults = (quizId) => {
    return quizResults.filter(result => result.quizId === quizId)
  }

  const value = {
    quizzes,
    quizResults,
    createQuiz,
    getQuiz,
    saveQuizResult,
    getUserResults,
    getQuizResults
  }

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  )
}