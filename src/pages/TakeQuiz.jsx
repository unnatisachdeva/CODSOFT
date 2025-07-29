import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuiz } from '../contexts/QuizContext';

const TakeQuiz = () => {
  const { id } = useParams();
  const { getQuiz } = useQuiz();
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const foundQuiz = getQuiz(id);
    setQuiz(foundQuiz);
  }, [id, getQuiz]);

  const handleOptionChange = (qIndex, optionIndex) => {
    setUserAnswers({ ...userAnswers, [qIndex]: optionIndex });
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    quiz.questions.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);
  };

  if (!quiz) return <div>Loading quiz...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
      {quiz.questions.map((q, index) => (
        <div key={index} className="mb-6">
          <h3 className="font-semibold">
            Q{index + 1}. {q.question}
          </h3>
          <div className="mt-2 space-y-2">
            {q.options.map((option, i) => (
              <div key={i}>
                <label>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={i}
                    disabled={submitted}
                    checked={userAnswers[index] === i}
                    onChange={() => handleOptionChange(index, i)}
                    className="mr-2"
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="text-green-600 mt-4 font-semibold">
          You scored {score} out of {quiz.questions.length}
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;
