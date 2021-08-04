import { findAllByTestId } from '@testing-library/react';
import { Diff } from 'jest-diff';
import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
import QuestionCard from './components/QuestionCard';

// Types
import { QuestionState } from './API'

// Styles
import { GlobalStyle, Wrapper, DropDownWrapper } from './App.style';


export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

export type Category = {
  [index: string]: number
}

const TOTAL_QUESTIONS = 10
const CATEGORIES: Category = {
  "General Knowledge": 9,
  "Entertainment: Books": 10,
  "Entertainment: Film": 11,
  "Entertainment: Music": 12,
  "Entertainment: Musicals & Theaters": 13,
  "Entertainment: Television": 14,
  "Entertainment: Video Games": 15,
  "Entertainment: Board Games": 16,
  "Science & Nature": 17,
  "Science: Computers": 18,
  "Science: Mathematics": 19,
  "Mythology": 20,
  "Sports": 21,
  "Geography": 22,
  "History": 23,
  "Politics": 24,
  "Art": 25,
  "Celebrities": 26,
  "Animals": 27,
  "Vehicles": 28,
  "Entertainment: Comics": 29,
  "Science: Gadgets": 30,
  "Entertainment: Japanese Anime & Manga": 31,
  "Entertainment: Cartoon & Animations": 32
}

const App = () => {

  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[]>([])
  const [number, setNumber] = useState(0)
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)
  const [category, setCategory] = useState('select')
  const [difficulty, setDifficulty] = useState('select')
  const [error, setError] = useState('')

  const startTriviaGame = async () => {

    if (difficulty === 'select' || category === 'select') {
      setError('Please select a difficulty and a category before starting game')
    } else {
      setLoading(true)
      setGameOver(false)
  
      const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, difficulty, CATEGORIES[category])
      
      setError('')
      setDifficulty('select')
      setCategory('select')
      setQuestions(newQuestions)
      setScore(0)
      setUserAnswers([])
      setNumber(0)
      setLoading(false)
    }
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // users answer
      const answer = e.currentTarget.value
      // check answer against correct answer
      const correct = answer === questions[number].correct_answer
      // add score if answer correct
      if (correct) { setScore(prev => prev + 1) }
      // save answer in array for useranswers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }
      setUserAnswers(prev => [...prev, answerObject])
    }
  }
  
  const nextQuestion = () => {
    // Move on to the next question if not the last question
    const nextQuestion = number + 1
    
    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true)
    } else {
      setNumber(nextQuestion)
    }
  }

  return (
    <>
      <GlobalStyle />
      <Wrapper className="App">
        <h1>Happy Hour Trivia</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? 
        (<DropDownWrapper>
        <div>
          <select name='difficulty' value={difficulty} onChange={(e) => setDifficulty(e.currentTarget.value)}>
            <option value='select'>Difficulty:</option>
            <option value='easy'>Easy</option>
            <option value='medium'>Medium</option>
            <option value='hard'>Hard</option>
          </select>
          <select name='category' value={category} onChange={(e) => setCategory(e.currentTarget.value)}>
            <option value='select'>Category:</option>
            {Object.keys(CATEGORIES).sort().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {!!error ? 
            <p style={{'color': 'red'}}>{error}</p> : null
          }
        </div>
        </DropDownWrapper>) : null }
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? <button className='start' onClick={startTriviaGame}>Start Game</button> : null }
        {!gameOver ? <p className='score'>Score: {score}</p> : null }
        {loading ? <p>Loading Questions...</p> : null }
        {!loading && !gameOver && (
          <QuestionCard 
            questionNumber={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
          <button className='next' onClick={nextQuestion}>Next Question</button>
        ) : null}
      </Wrapper>
    </>
  );
}

export default App;
