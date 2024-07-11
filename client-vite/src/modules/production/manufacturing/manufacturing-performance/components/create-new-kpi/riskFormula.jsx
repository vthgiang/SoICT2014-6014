import React, { useEffect, useState } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import styles from './index.module.css'

const Attribute = ({ value, onFocusInput }) => {
  return (
    <>
      <div className={styles['attribute']}>
        <span>{value}</span>
      </div>
      <input className={styles['padding_input']} onFocus={onFocusInput} />
    </>
  )
}

const Operator = ({ value, onFocusInput }) => {
  return (
    <>
      <div className={styles['operator']}>{value}</div>
      <input className={styles['padding_input']} onFocus={onFocusInput} />
    </>
  )
}

const RiskFormula = (props) => {
  const { translate, formula, onFormulaChange, listAttributes } = props
  const [focusedInput, setFocusedInput] = useState(null)

  const operators = [
    { code: '+', name: '+' },
    { code: '-', name: '-' },
    { code: '*', name: '*' },
    { code: '/', name: '/' },
    { code: '(', name: '(' },
    { code: ')', name: ')' }
  ]

  const attributes = listAttributes.map((e) => ({
    code: e.code,
    name: e.name
  }))

  const handleAttributeClick = (attr) => {
    const newElement = {
      code: attr.code,
      name: attr.name,
      type: 'attribute'
    }
    if (focusedInput === null) {
      onFormulaChange([...formula, newElement])
    } else {
      const newFormula = [...formula]
      newFormula.splice(focusedInput - 1, 0, newElement)
      onFormulaChange(newFormula)
    }
  }

  const handleOperatorClick = (e, operator) => {
    e.preventDefault()

    const newElement = {
      code: operator.code,
      name: operator.name,
      type: 'operator'
    }
    if (focusedInput === null) {
      onFormulaChange([...formula, newElement])
    } else {
      const newFormula = [...formula]
      newFormula.splice(focusedInput - 1, 0, newElement)
      onFormulaChange(newFormula)
    }
  }

  const handleFocusInput = (inputId) => {
    setFocusedInput(inputId)
  }

  useEffect(() => {
    // Xử lý sự kiện xóa một element trong formula
    const handleKeyDown = (e) => {
      if (e.key == 'Delete' || e.key == 'Backspace') {
        if (focusedInput !== null) {
          const newFormula = [...formula]
          newFormula.splice(focusedInput, 1)
          onFormulaChange(newFormula)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [focusedInput])

  return (
    <div className={styles['risk_formula']}>
      <div className={styles['input_box']}>
        {formula.map((item, index) => {
          return item.type === 'attribute' ? (
            <Attribute key={index} value={item.name} onFocusInput={() => handleFocusInput(index)} />
          ) : (
            <Operator key={index} value={item.name} onFocusInput={() => handleFocusInput(index)} />
          )
        })}
      </div>
      <div className={styles['elements']}>
        <div className={styles['attribute_list']}>
          <label>
            Thuộc tính
            <a style={{ cursor: 'pointer' }} title={translate('manufacturing.performance.attribute_description')}>
              <i className='fa fa-question-circle' style={{ marginLeft: 5 }} />
            </a>
          </label>
          <ul>
            {attributes.map((attr, index) => (
              <li key={index} onClick={() => handleAttributeClick(attr)}>
                {`${index + 1}.${attr.name}`}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles['operator_list']}>
          <label>Operator</label>
          <div>
            {operators.map((operator, index) => (
              <button key={index} className={styles['operator_btn']} onClick={(e) => handleOperatorClick(e, operator)}>
                {operator.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(null, null)(withTranslate(RiskFormula))
