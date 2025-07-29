import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateQuiz from './pages/CreateQuiz'
import QuizListing from './pages/QuizListing'
import TakeQuiz from './pages/TakeQuiz'
import PrivateRoute from './components/auth/PrivateRoute';


function App() {
  return (
    
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quizzes" element={<QuizListing />} />
          <Route path="/quiz/:id" element={<TakeQuiz />} />
          <Route 
            path="/create" 
            element={
              <PrivateRoute>
                <CreateQuiz />
              </PrivateRoute>
            } 
          />
        </Routes>
      </main>
    </div>
    
  )
}

export default App