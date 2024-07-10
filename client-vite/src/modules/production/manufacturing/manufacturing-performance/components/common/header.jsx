import React, { useEffect, useState, useRef } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styles from './index.module.css'

const SegmentedControl = ({ segments, callback, defaultIndex = 0, controlRef }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const componentReady = useRef(false)

  useEffect(() => {
    componentReady.current = true
  }, [])

  useEffect(() => {
    const activeSegmentRef = segments[activeIndex].ref
    const { offsetWidth, offsetLeft } = activeSegmentRef.current
    const { style } = controlRef.current

    style.setProperty('--highlight-width', `${offsetWidth}px`)
    style.setProperty('--highlight-x-pos', `${offsetLeft}px`)
  }, [activeIndex, callback, controlRef, segments])

  const handleInputChange = (value, index) => {
    setActiveIndex(index)
    callback(value)
  }

  return (
    <div className={styles.controls_container} ref={controlRef}>
      <div className={`${styles.controls} ${componentReady.current ? styles.ready : styles.idle}`}>
        {segments?.map((item, i) => (
          <div key={item.value} className={`${styles.segment} ${i === activeIndex ? styles.active : styles.inactive}`} ref={item.ref}>
            <input
              type='radio'
              value={item.value}
              id={item.label}
              name={item.name}
              onChange={() => handleInputChange(item.value, i)}
              checked={i === activeIndex}
            />
            <label htmlFor={item.label}>{item.label}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

const DashboardHeader = (props) => {
  const { translate, onChangePeriod, onToggleSidebar, onSave, editMode } = props
  const history = useHistory()

  const handleShowCreateKpiModal = () => {
    window.$('#modal-add-kpi').modal('show')
  }

  const handleRedirectCreatePlan = () => {
    history.push('/manage-manufacturing-plan')
  }

  return (
    <div className={styles.container}>
      <SegmentedControl
        callback={onChangePeriod}
        controlRef={useRef()}
        segments={[
          {
            label: translate('manufacturing.performance.date'),
            value: 'day',
            ref: useRef()
          },
          {
            label: translate('manufacturing.performance.month'),
            value: 'month',
            ref: useRef()
          },
          {
            label: translate('manufacturing.performance.quater'),
            value: 'quater',
            ref: useRef()
          },
          {
            label: translate('manufacturing.performance.year'),
            value: 'year',
            ref: useRef()
          }
        ]}
      />
      {!editMode ? (
        <>
          <button onClick={handleRedirectCreatePlan} className={styles.add_plan_button + ' ' + styles.btn}>
            Tạo KHSX
          </button>
          <button onClick={handleShowCreateKpiModal} className={styles.add_button + ' ' + styles.btn}>
            Tạo KPI
          </button>
          <button onClick={onToggleSidebar} className={styles.edit_button + ' ' + styles.btn}>
            Chỉnh sửa
          </button>
        </>
      ) : (
        <>
          <button onClick={onToggleSidebar} className={styles.cancel_button + ' ' + styles.btn}>
            Đóng
          </button>
          <button onClick={onSave} className={styles.edit_button + ' ' + styles.btn}>
            Lưu
          </button>
        </>
      )}
    </div>
  )
}

export default connect(null, null)(withTranslate(DashboardHeader))
