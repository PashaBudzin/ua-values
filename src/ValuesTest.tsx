import { useEffect, useState } from 'react'
import { scaleOf, test, totalQuestions } from './questions'
import { findBand, scoreAxis } from './scoring'
import type { Answers } from './scoring'
import './ValuesTest.css'

function ValuesTest() {
  const [answers, setAnswers] = useState<Answers>({})
  const [finished, setFinished] = useState(false)

  const answeredCount = Object.keys(answers).length
  const complete = answeredCount === totalQuestions
  const progress = Math.round((answeredCount / totalQuestions) * 100)

  const result = finished ? scoreAxis(test.questions, answers) : null
  const band = result ? findBand(test.bands, result.percent) : null

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [finished])

  const choose = (id: string, weight: number) =>
    setAnswers((answers) => ({ ...answers, [id]: weight }))

  const restart = () => {
    setAnswers({})
    setFinished(false)
  }

  return (
    <div className="vt">
      <header className="vt-bar">
        <div className="vt-bar-row">
          <span className="vt-brand">ua-values</span>
          <span className="vt-brand-test">{test.title}</span>
          <span className="vt-count">
            {finished ? 'результат' : `${answeredCount} / ${totalQuestions}`}
          </span>
        </div>
        <div
          className="vt-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={finished ? 100 : progress}
        >
          <div
            className="vt-fill"
            style={{ width: `${finished ? 100 : progress}%` }}
          />
        </div>
      </header>

      {result && band ? (
        <main className="vt-main vt-result">
          <p className="vt-eyebrow">Ваш результат</p>
          <h1 className="vt-result-title">{band.title}</h1>
          <p className="vt-result-sub">
            {test.axis.low.label} — {test.axis.high.label}:{' '}
            <b>{result.percent}%</b> на бік «{test.axis.high.label}»
          </p>

          <div className="vt-axis">
            <div className="vt-axis-track">
              <div
                className="vt-axis-marker"
                style={{ left: `${result.percent}%` }}
              />
            </div>
            <div className="vt-axis-poles">
              <div className="vt-axis-pole">
                <strong>{test.axis.low.label}</strong>
                <span>{test.axis.low.hint}</span>
              </div>
              <div className="vt-axis-pole vt-axis-pole--high">
                <strong>{test.axis.high.label}</strong>
                <span>{test.axis.high.hint}</span>
              </div>
            </div>
          </div>

          <p className="vt-result-text">{band.description}</p>

          <ul className="vt-split">
            <li>
              <b>{result.towardHigh}</b>
              <span>на бік «{test.axis.high.label}»</span>
            </li>
            <li>
              <b>{result.towardLow}</b>
              <span>на бік «{test.axis.low.label}»</span>
            </li>
            <li>
              <b>{result.neutral}</b>
              <span>не визначились</span>
            </li>
          </ul>

          <div className="vt-actions">
            <button
              type="button"
              className="vt-btn vt-btn--ghost"
              onClick={() => setFinished(false)}
            >
              Переглянути відповіді
            </button>
            <button type="button" className="vt-btn" onClick={restart}>
              Пройти заново
            </button>
          </div>
        </main>
      ) : (
        <main className="vt-main">
          <section className="vt-intro">
            <h1>{test.title}</h1>
            <p className="vt-subtitle">{test.subtitle}</p>
            <p className="vt-meta">
              {totalQuestions} запитань · ~2 хвилини · без правильних відповідей
            </p>
          </section>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (complete) setFinished(true)
            }}
          >
            {test.questions.map((question, index) => {
              const chosen = answers[question.id]

              return (
                <fieldset className="vt-q" key={question.id}>
                  <legend className="vt-legend">
                    <span className="vt-num">{index + 1}</span>
                    {question.text}
                  </legend>
                  <div className="vt-options">
                    {scaleOf(question).map((option) => (
                      <label className="vt-option" key={`${option.weight}-${option.label}`}>
                        <input
                          type="radio"
                          name={question.id}
                          value={option.weight}
                          checked={chosen === option.weight}
                          onChange={() => choose(question.id, option.weight)}
                        />
                        <span className="vt-option-label">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )
            })}

            <div className="vt-submit">
              <button type="submit" className="vt-btn" disabled={!complete}>
                Показати результат
              </button>
              {!complete && (
                <span className="vt-hint">
                  Залишилось без відповіді: {totalQuestions - answeredCount}
                </span>
              )}
            </div>
          </form>
        </main>
      )}
    </div>
  )
}

export default ValuesTest
