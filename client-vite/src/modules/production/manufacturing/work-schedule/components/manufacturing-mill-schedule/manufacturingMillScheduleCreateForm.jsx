import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ButtonModal, DatePicker, DialogModal, SelectBox, SlimScroll } from '../../../../../../common-components'
import { formatToTimeZoneDate, formatYearMonth } from '../../../../../../helpers/formatDate'
import { workScheduleActions } from '../../redux/actions'

function ManufacturingMillScheduleCreateForm(props) {
  const getAllDaysOfMonth = (month) => {
    let arrayMonthYear = month.split('-')
    let lastDaysOfMonth = new Date(arrayMonthYear[1], arrayMonthYear[0], 0)
    let days = lastDaysOfMonth.getDate()

    let arrayDayOfMonth = []
    for (let i = 1; i <= days; i++) {
      arrayDayOfMonth.push(i)
    }
    return arrayDayOfMonth
  }

  let currentDateDefault = Date.now()
  let currentMonthYearDefault = formatYearMonth(currentDateDefault)
  let allDaysOfMonthDefault = getAllDaysOfMonth(currentMonthYearDefault)

  const [state, setState] = useState({
    month: currentMonthYearDefault,
    allDaysOfMonth: allDaysOfMonthDefault,
    numberOfTurns: 4,
    manufacturingMill: 'all'
  })

  const handleMonthChange = (value) => {
    let allDaysOfMonth = getAllDaysOfMonth(value)
    setState((state) => ({
      ...state,
      month: value,
      allDaysOfMonth: allDaysOfMonth
    }))
  }

  const getListManufacturingMills = () => {
    const { translate, manufacturingMill } = props
    let listMillsArray = [
      {
        value: 'all',
        text: translate('manufacturing.work_schedule.choose_all_mill')
      }
    ]

    const { listMills } = manufacturingMill
    if (listMills) {
      listMills.map((mill, index) => {
        listMillsArray.push({
          value: mill._id,
          text: mill.code + ' - ' + mill.name
        })
      })
    }

    return listMillsArray
  }

  const handleManufacturingMillChange = (value) => {
    const manufacturingMill = value[0]
    setState((state) => ({
      ...state,
      manufacturingMill: manufacturingMill
    }))
  }


  const save = () => {
    let { manufacturingMill, month, numberOfTurns } = state
    let data = {}
    if (manufacturingMill === 'all') {
      data = {
        allManufacturingMill: true,
        month: formatToTimeZoneDate(month),
        numberOfTurns: numberOfTurns,
        currentRole: localStorage.getItem('currentRole')
      }
    } else {
      data = {
        manufacturingMill: manufacturingMill,
        month: formatToTimeZoneDate(month),
        numberOfTurns: numberOfTurns,
        currentRole: localStorage.getItem('currentRole')
      }
    }

    props.createWorkSchedule(data)
  }

  const { translate, workSchedule } = props
  const { manufacturingMill, month, allDaysOfMonth, numberOfTurns } = state
  // Tao mang cac ca
  let turns = []
  for (let i = 1; i <= numberOfTurns; i++) {
    turns.push(i)
  }
  return (
    <React.Fragment>
      <ButtonModal
        modalID='modal-create-mill-work-schedule'
        button_name={translate('manufacturing.work_schedule.add_work_schedule_button')}
        title={translate('manufacturing.work_schedule.add_work_schedule')}
      />
      <DialogModal
        modalID='modal-create-mill-work-schedule'
        isLoading={workSchedule.isLoading}
        formID='form-create-mill-work-schedule'
        title={translate('manufacturing.work_schedule.add_work_schedule_mill')}
        msg_success={translate('manufacturing.work_schedule.create_successfully')}
        msg_failure={translate('manufacturing.work_schedule.create_failed')}
        func={save}
        // disableSubmit={!isFormValidated()}
        hasNote={false}
        size={50}
        maxWidth={500}
      >
        <form id='form-create-mill-work-schedule'>
          <div className={`form-group`}>
            <label>{translate('manufacturing.work_schedule.manufacturingMill')}</label>
            <SelectBox
              id={`select-manufacturingMill-create-work-schedule`}
              className='form-control select2'
              style={{ width: '100%' }}
              value={manufacturingMill}
              items={getListManufacturingMills()}
              onChange={handleManufacturingMillChange}
              multiple={false}
            />
          </div>
          <div className={`form-group`}>
            <label>{translate('manufacturing.work_schedule.month')}</label>
            <DatePicker
              id={`work-schedule-create-month`}
              value={month}
              dateFormat={'month-year'}
              onChange={handleMonthChange}
              disabled={false}
            />
          </div>

          <div id='create-croll-table' className='form-inline'>
            <table id='create-work-schedule-table' className='table table-striped table-bordered table-hover not-sort'>
              <thead>
                <tr>
                  <th style={{ width: 100 }}>{translate('manufacturing.work_schedule.work_turns')}</th>
                  {allDaysOfMonth.map((day, index) => (
                    <th key={index}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {turns.map((turn, index) => {
                  return (
                    <tr key={index}>
                      <td>{translate(`manufacturing.work_schedule.turn_${turn}`)}</td>
                      {allDaysOfMonth.map((day, index2) => (
                        <td key={index2}>
                          <input type='checkbox' disabled={true} />
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <SlimScroll
            outerComponentId='create-croll-table'
            innerComponentId='create-work-schedule-table'
            innerComponentWidth={1000}
            activate={true}
          />
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { workSchedule, manufacturingMill } = state
  return { workSchedule, manufacturingMill }
}

const mapDispatchToProps = {
  createWorkSchedule: workScheduleActions.createWorkSchedule
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingMillScheduleCreateForm))
