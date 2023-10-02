import React, { useState, useEffect } from 'react';
import styles from '../StartPageQuiz.module.css';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const questions = [
    {
      questionText: 'What is the first step towards financial planning💰?',
      answerOptions: [
        { answerText: 'Spending', isCorrect: false },
        { answerText: 'Investing', isCorrect: false },
        { answerText: 'Budgeting', isCorrect: true },
        { answerText: 'Saving', isCorrect: false },
      ],
    },
    {
      questionText: 'Which of the following is NOT a factor that affects your credit score💳?',
      answerOptions: [
        { answerText: 'Payment History', isCorrect: false },
        { answerText: 'Income', isCorrect: true },
        { answerText: 'Utilisation Rate', isCorrect: false },
        { answerText: 'Your undergrad degree', isCorrect: true },
      ],
    },
    {
      questionText: 'Raghav is a busy doctor💊. What is most likely the best way for him to invest in the stock market📈?',
      answerOptions: [
        { answerText: 'Direct Stocks', isCorrect: false },
        { answerText: 'Mutual Funds', isCorrect: true },
        { answerText: 'Bonds', isCorrect: false },
        { answerText: 'Savings Account', isCorrect: false },
      ],
    },
    {
      questionText: 'What does ETF stand for👀?',
      answerOptions: [
        { answerText: 'Exchange Traded Fund', isCorrect: true },
        { answerText: 'Equity Traded Fund', isCorrect: false },
        { answerText: 'Equity Transfer Fund', isCorrect: false },
        { answerText: 'Exchange Transport Fund ', isCorrect: false },
      ],
    },
    {
      questionText: 'Above what number is a credit score considered good👌?',
      answerOptions: [
        { answerText: '700', isCorrect: true },
        { answerText: '100', isCorrect: false },
        { answerText: '650', isCorrect: false },
        { answerText: '500', isCorrect: false },
      ],
    },
    {
      questionText: 'If interest rates rise🔼, which of the following would likely happen?',
      answerOptions: [
        { answerText: 'lower FD interest', isCorrect: false },
        { answerText: 'expensive loans', isCorrect: true },
        { answerText: 'lower taxes', isCorrect: false },
        { answerText: 'all of the above', isCorrect: false },
      ],
    },
    {
        questionText: <div>
        Calculate your net worth:<br />
        Savings in Bank: ₹3000<br />
        Stocks: ₹1500<br />
        Money given to friend: ₹300<br />
        Money taken from mother: ₹200<br />
      </div>,
      answerOptions: [
        { answerText: '₹4800', isCorrect: false },
        { answerText: '₹4600', isCorrect: true },
        { answerText: '₹4300', isCorrect: false },
        { answerText: 'none of the above', isCorrect: false },
      ],
    },
    {
        questionText: 'Life insurance premiums can be affected by:',
        answerOptions: [
          { answerText: 'age of the person', isCorrect: true },
          { answerText: 'family income', isCorrect: false },
          { answerText: 'name of the person', isCorrect: false },
          { answerText: 'all of the above', isCorrect: false },
        ],
      },
      {
        questionText: 'If co-pay in your health insurance is 20% and hospital bill is ₹1 lakh, how much will you have to pay?',
        answerOptions: [
          { answerText: '₹30,000', isCorrect: false },
          { answerText: '₹80,000', isCorrect: false },
          { answerText: '₹20,000', isCorrect: true },
          { answerText: '₹1 lakh', isCorrect: false },
        ],
      },  
      {
        questionText: 'Which loan among the options will likely have the interest rate?',
        answerOptions: [
          { answerText: 'gold loan', isCorrect: false },
          { answerText: 'credit card debt', isCorrect: true },
          { answerText: 'home loan', isCorrect: false },
          { answerText: 'car loan', isCorrect: false },
        ],
      },
  ];

  const StartPageQuiz = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
    const [optionClasses, setOptionClasses] = useState(
      Array(4).fill(styles.answerButton)
    ); // Initialize button classes
    const [feedback, setFeedback] = useState(''); // For showing "Correct" or "Wrong" feedback
  
    const handleAnswerOptionClick = (isCorrect, index) => {
      if (showScore) {
        return; // Prevent clicking on buttons after the quiz is completed
      }
  
      const updatedOptionClasses = [...optionClasses];
      const updatedQuestions = [...questions];
  
      updatedQuestions[currentQuestion].answerOptions[index].clicked = true;
  
      if (isCorrect) {
        updatedOptionClasses[index] = styles.correct;
        setScore(score + 1);
        setFeedback('Correct!😁'); // Show "Correct" feedback
      } else {
        updatedOptionClasses[index] = styles.incorrect;
        const correctIndex = updatedQuestions[
          currentQuestion
        ].answerOptions.findIndex((option) => option.isCorrect);
        updatedOptionClasses[correctIndex] = styles.correct; // Make the correct answer green
        setFeedback('Oops, that is wrong!🥺'); // Show "Wrong" feedback
      }
  
      setOptionClasses(updatedOptionClasses);
  
      // Move to the next question with a delay
      setTimeout(() => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
          setCurrentQuestion(nextQuestion);
          resetButtonClasses(); // Reset button classes when moving to the next question
          setFeedback(''); // Clear the feedback message
        } else {
          setShowScore(true);
        }
      }, 3000); // Delay moving to the next question for 2 seconds
    };
  
    const resetButtonClasses = () => {
      const defaultClasses = Array(4).fill(styles.answerButton);
      setOptionClasses(defaultClasses);
    };
  
    useEffect(() => {
      // Reset the feedback message when moving to a new question
      setFeedback('');
    }, [currentQuestion]);
  
    return (
        <div className={styles.app}>
      {showScore ? (
        <div className={styles['score-section']}>
          You scored {score} out of {questions.length}
          <br />
          <br/>
          <button
            style={{
              width: '100%',
              fontSize: '16px',
              backgroundColor: '#28a745',
              borderColor: '#28a745',
              margin: '0 auto',
              display: 'block',
              padding: '5px',
              borderRadius: '7px',
              boxShadow: '0px 4px #1a5928',
              transition: '0.2s ease',
              fontWeight: 'bold',
              marginBottom: '5px',
              color: '#fff',
            }}
            className="getStarted"
            onClick={() => navigate('/auth/register')}
          >
            CONTINUE LEARNING
          </button>
        </div>
        ) : (
          <>
            <div className={styles['question-section']}>
              <div className={styles['question-count']}>
                <span>Question {currentQuestion + 1}</span>/{questions.length}
              </div>
              <div className={styles['question-text']}>
                {questions[currentQuestion].questionText}
              </div>
              {feedback && (
                <div className={styles.feedback}>
                  <p className={styles.feedbackMessage}>{feedback}</p>
                </div>
              )}
            </div>
            <div className={styles['answer-section']}>
              {questions[currentQuestion].answerOptions.map((answerOption, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerOptionClick(answerOption.isCorrect, index)}
                  className={`${optionClasses[index]} ${styles.answerButton}`}
                  disabled={answerOption.clicked} // Disable the button after clicking
                >
                  {answerOption.answerText}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };
  
  export default StartPageQuiz;




