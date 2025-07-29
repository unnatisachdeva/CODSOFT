import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { Search, Clock, User, ArrowRight, Filter } from 'lucide-react';

function QuizListing() {
  const { quizzes } = useQuiz();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute top-3.5 left-3 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredQuizzes.length === 0 ? (
          <p>No quizzes found.</p>
        ) : (
          filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-lg shadow p-6 flex flex-col justify-between transition hover:shadow-md"
            >
              <div>
                <h2 className="text-lg font-bold mb-2">{quiz.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{quiz.description}</p>
                <div className="text-xs text-gray-500 flex items-center gap-2 mb-1">
                  <User className="h-4 w-4" />
                  {quiz.createdBy}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </div>
              </div>

              <Link
                to={`/quiz/${quiz.id}`}
                className="mt-4 inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
              >
                Take Quiz
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default QuizListing;
