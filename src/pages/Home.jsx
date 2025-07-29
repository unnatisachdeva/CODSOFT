import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useQuiz } from '../contexts/QuizContext'
import { Plus, Users, Trophy, BookOpen, ArrowRight } from 'lucide-react'

const Home = () => {
  const { user } = useAuth()
  const { quizzes } = useQuiz()

  const featuredQuizzes = quizzes.slice(0, 3)

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Create & Take
            <span className="block text-primary-600">Amazing Quizzes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Build interactive quizzes, challenge your knowledge, and compete with others. 
            Perfect for education, training, or just having fun!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <>
                <Link 
                  to="/create" 
                  className="btn btn-primary text-lg px-8 py-4 flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Create Your First Quiz</span>
                </Link>
                <Link 
                  to="/quizzes" 
                  className="btn btn-secondary text-lg px-8 py-4 flex items-center space-x-2"
                >
                  <BookOpen size={20} />
                  <span>Browse Quizzes</span>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="btn btn-primary text-lg px-8 py-4 flex items-center space-x-2"
                >
                  <Users size={20} />
                  <span>Get Started Free</span>
                </Link>
                <Link 
                  to="/quizzes" 
                  className="btn btn-secondary text-lg px-8 py-4 flex items-center space-x-2"
                >
                  <BookOpen size={20} />
                  <span>Try Sample Quizzes</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose QuizMaker?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features that make creating and taking quizzes a breeze
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="text-primary-600" size={32} />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Easy Creation</h3>
            <p className="text-gray-600">
              Create engaging quizzes with multiple choice questions in minutes. 
              Our intuitive interface makes quiz creation effortless.
            </p>
          </div>

          <div className="card p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="text-green-600" size={32} />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Instant Results</h3>
            <p className="text-gray-600">
              Get immediate feedback on your performance with detailed results 
              and correct answers after completing each quiz.
            </p>
          </div>

          <div className="card p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-orange-600" size={32} />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Community Driven</h3>
            <p className="text-gray-600">
              Join a community of learners and educators. Share your quizzes 
              and discover amazing content created by others.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Quizzes Section */}
      {featuredQuizzes.length > 0 && (
        <section className="py-16 bg-gray-50 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Quizzes
            </h2>
            <p className="text-xl text-gray-600">
              Popular quizzes to get you started
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {featuredQuizzes.map((quiz) => (
              <div key={quiz.id} className="card p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                <p className="text-gray-600 mb-4">{quiz.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>{quiz.questions?.length || 0} questions</span>
                  <span>By {quiz.createdBy}</span>
                </div>
                <Link 
                  to={`/quiz/${quiz.id}`}
                  className="btn btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <span>Take Quiz</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/quizzes" 
              className="btn btn-secondary text-lg px-8 py-3"
            >
              View All Quizzes
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who are already creating and taking amazing quizzes
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="btn btn-primary text-lg px-8 py-4"
              >
                Sign Up Now
              </Link>
              <Link 
                to="/login" 
                className="btn btn-secondary text-lg px-8 py-4"
              >
                Already have an account?
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
            