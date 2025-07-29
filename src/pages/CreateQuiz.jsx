import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useQuiz } from '../contexts/QuizContext'
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react'

const CreateQuiz = () => {
  const { user } = useAuth()
  const { createQuiz } = useQuiz()
  const navigate = useNavigate()

  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    questions: [
      {
        id: Date.now().toString(),
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }
    ]
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleQuizInfoChange = (e) => {
    setQuizData({
      ...quizData,
      [e.target.name]: e.target.value
    })
  }

  const handleQuestionChange = (questionIndex, value) => {
    const updatedQuestions = [...quizData.questions]
    updatedQuestions[questionIndex].question = value
    setQuizData({
      ...quizData,
      questions: updatedQuestions
    })
  }

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quizData.questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setQuizData({
      ...quizData,
      questions: updatedQuestions
    })
  }

  const handleCorrectAnswerChange = (questionIndex, correctIndex) => {
    const updatedQuestions = [...quizData.questions]
    updatedQuestions[questionIndex].correctAnswer = correctIndex
    setQuizData({
      ...quizData,
      questions: updatedQuestions
    })
  }

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, newQuestion]
    })
  }

  const removeQuestion = (questionIndex) => {
    if (quizData.questions.length > 1) {
      const updatedQuestions = quizData.questions.filter((_, index) => index !== questionIndex)
      setQuizData({
        ...quizData,
        questions: updatedQuestions
      })
    }
  }

  const validateQuiz = () => {
    if (!quizData.title.trim()) {
      return 'Quiz title is required'
    }
    if (!quizData.description.trim()) {
      return 'Quiz description is required'
    }
    
    for (let i = 0; i < quizData.questions.length; i++) {
      const question = quizData.questions[i]
      if (!question.question.trim()) {
        return `Question ${i + 1} is required`
      }
      
      const filledOptions = question.options.filter(option => option.trim())
      if (filledOptions.length < 2) {
        return `Question ${i + 1} must have at least 2 options`
      }
      
      if (!question.options[question.correctAnswer].trim()) {
        return `Question ${i + 1} correct answer cannot be empty`
      }
    }
    
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const validationError = validateQuiz()
    if (validationError) {
      setError(validationError)
      return
    }
    
    setLoading(true)
    
    try {
      const newQuiz = createQuiz({
        ...quizData,
        createdBy: user.name,
        createdById: user.id
      })
      
      navigate(`/quiz/${newQuiz.id}`)
    } catch (err) {
      setError('Failed to create quiz. Please try again.')
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Quiz</h1>
        <p className="text-gray-600">Build an engaging quiz for your audience</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Quiz Information */}
        <div className="card p-6">
          <h2 className="text-2xl font-semibold mb-6">Quiz Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={quizData.title}
                onChange={handleQuizInfoChange}
                className="input"
                placeholder="Enter quiz title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={quizData.description}
                onChange={handleQuizInfoChange}
                className="input h-24 resize-none"
                placeholder="Describe what this quiz is about"
                required
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-8">
            {quizData.questions.map((question, questionIndex) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Question {questionIndex + 1}</h3>
                  {quizData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text *
                    </label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                      className="input"
                      placeholder="Enter your question"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer Options *
                    </label>
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name={`correct-${questionIndex}`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() => handleCorrectAnswerChange(questionIndex, optionIndex)}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                            className="input flex-1"
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                          <span className="text-sm text-gray-500 w-16">
                            {question.correctAnswer === optionIndex ? 'Correct' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Select the radio button next to the correct answer
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/quizzes')}
            className="btn btn-secondary px-8"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary px-8 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            <span>{loading ? 'Creating...' : 'Create Quiz'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateQuiz