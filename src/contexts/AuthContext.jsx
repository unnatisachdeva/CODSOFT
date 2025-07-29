import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('quizUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const register = async (userData) => {
    try {
      // Simulate API call
      const users = JSON.parse(localStorage.getItem('quizUsers') || '[]')
      
      // Check if user already exists
      if (users.find(u => u.email === userData.email)) {
        throw new Error('User already exists')
      }

      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString()
      }

      users.push(newUser)
      localStorage.setItem('quizUsers', JSON.stringify(users))
      localStorage.setItem('quizUser', JSON.stringify(newUser))
      setUser(newUser)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const login = async (email, password) => {
    try {
      // Simulate API call
      const users = JSON.parse(localStorage.getItem('quizUsers') || '[]')
      const user = users.find(u => u.email === email && u.password === password)
      
      if (!user) {
        throw new Error('Invalid credentials')
      }

      localStorage.setItem('quizUser', JSON.stringify(user))
      setUser(user)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('quizUser')
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}