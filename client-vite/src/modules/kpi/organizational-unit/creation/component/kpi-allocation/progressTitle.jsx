import React from 'react'
import './progress_title.css'

function ProgressTitle({ setCurrentStep, steps, step }) {
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setCurrentStep(e, index)
    }
  }

  return (
    <div className='timeline'>
      <div className='timeline-progress' style={{ width: `${(step * 100) / (steps.length - 1)}%` }} />
      <div className='timeline-items'>
        {steps?.map((item, index) => (
          <div className={`timeline-item ${item.active ? 'active' : ''}`} key={index}>
            <div
              key={index}
              className='timeline-contain'
              onClick={(e) => setCurrentStep(e, index)}
              // onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={0}
              role='button'
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressTitle
