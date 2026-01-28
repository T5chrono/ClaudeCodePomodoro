import { useState, useEffect, useRef } from 'react'
import './App.css'

const WORK_TIME = 25 * 60
const SHORT_BREAK = 5 * 60
const LONG_BREAK = 15 * 60
const SESSIONS_BEFORE_LONG_BREAK = 4

function App() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('WORK')
  const [completedSessions, setCompletedSessions] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)

    if (mode === 'WORK') {
      const newSessions = completedSessions + 1
      setCompletedSessions(newSessions)

      if (newSessions % SESSIONS_BEFORE_LONG_BREAK === 0) {
        setMode('LONG BREAK')
        setTimeLeft(LONG_BREAK)
      } else {
        setMode('SHORT BREAK')
        setTimeLeft(SHORT_BREAK)
      }
    } else {
      setMode('WORK')
      setTimeLeft(WORK_TIME)
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const skipSession = () => {
    setIsRunning(false)
    handleTimerComplete()
  }

  const resetTimer = () => {
    setIsRunning(false)
    if (mode === 'WORK') {
      setTimeLeft(WORK_TIME)
    } else if (mode === 'SHORT BREAK') {
      setTimeLeft(SHORT_BREAK)
    } else {
      setTimeLeft(LONG_BREAK)
    }
  }

  const resetPomodoro = () => {
    setIsRunning(false)
    setMode('WORK')
    setTimeLeft(WORK_TIME)
    setCompletedSessions(0)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="app">
      <div className="timer-container">
        <div className="timer-circle">
          <span className="mode-label">{mode}</span>
          <span className="time-display">{formatTime(timeLeft)}</span>

          <div className="button-row">
            <button
              className={`btn ${isRunning ? 'btn-pause' : 'btn-start'}`}
              onClick={toggleTimer}
            >
              {isRunning ? 'PAUSE' : 'START'}
            </button>
            <button className="btn btn-skip" onClick={skipSession}>
              SKIP
            </button>
          </div>

          <div className="secondary-buttons">
            <button className="btn-secondary" onClick={resetTimer}>
              RESET TIMER
            </button>
            <button className="btn-secondary" onClick={resetPomodoro}>
              RESET POMODORO
            </button>
          </div>

          <span className="sessions-count">
            Completed sessions: {completedSessions}
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
