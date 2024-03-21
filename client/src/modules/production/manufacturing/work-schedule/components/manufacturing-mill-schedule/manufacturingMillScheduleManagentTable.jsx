import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DataTableSetting, DatePicker, PaginateBar, SlimScroll } from '../../../../../../common-components'
import { formatToTimeZoneDate, formatYearMonth } from '../../../../../../helpers/formatDate'
import ManufacturingCommandDetailInfo from '../../../manufacturing-command/components/manufacturingCommandDetailInfo'
import { millActions } from '../../../manufacturing-mill/redux/actions'
import { workScheduleActions } from '../../redux/actions'
import ManufacturingMillScheduleCreateForm from './manufacturingMillScheduleCreateForm'
import './manufacturingMillScheduleManagementTable.css'

function ManufacturingMillScheduleManagentTable(props) {
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
    limit: 5,
    page: 1,
    month: currentMonthYearDefault,
    allDaysOfMonth: allDaysOfMonthDefault,
    code: '',
    currentRole: localStorage.getItem('currentRole')
  })

  useEffect(() => {
    let { limit, page, month } = state
    let data = {
      limit: limit,
      page: page,
      object: 'manufacturingMill',
      month: formatToTimeZoneDate(month),
      currentRole: state.currentRole
    }
    props.getAllWorkSchedules(data)
    props.getAllManufacturingMills({ status: 1, currentRole: state.currentRole })
    props.setCurrentMonth(month)
  }, [])

  const handleChangeMonth = (value) => {
    setState((state) => ({
      ...state,
      month: value
    }))
  }

  const setLimit = async (limit) => {
    await setState((state) => ({
      ...state,
      limit: limit
    }))
    let { page, month } = state
    let data = {
      limit: limit,
      page: page,
      object: 'manufacturingMill',
      month: formatToTimeZoneDate(month),
      currentRole: state.currentRole
    }
    props.getAllWorkSchedules(data)
  }

  const setPage = async (page) => {
    await setState((state) => ({
      ...state,
      page: page
    }))
    let { limit, month } = state
    let data = {
      limit: limit,
      page: page,
      object: 'manufacturingMill',
      month: formatToTimeZoneDate(month),
      currentRole: state.currentRole
    }
    props.getAllWorkSchedules(data)
  }

  const handleCodeChange = (e) => {
    const { value } = e.target
    setState((state) => ({
      ...state,
      code: value
    }))
  }

  const handleSubmitSearch = () => {
    let { month } = state
    let allDaysOfMonth = getAllDaysOfMonth(month)
    setState((state) => ({
      ...state,
      allDaysOfMonth: allDaysOfMonth
    }))
    let { limit, page, code } = state
    let data = {
      code: code,
      limit: limit,
      page: page,
      object: 'manufacturingMill',
      month: formatToTimeZoneDate(month),
      currentRole: state.currentRole
    }
    props.getAllWorkSchedules(data)
    props.setCurrentMonth(month)
  }

  const handleShowDetailManufacturingCommand = async (command) => {
    await setState((state) => ({
      ...state,
      commandDetail: command
    }))
    window.$('#modal-detail-info-manufacturing-command-1').modal('show')
  }

  const { translate, workSchedule } = props
  let listWorkSchedules = []
  if (workSchedule.listWorkSchedules && workSchedule.isLoading === false) {
    listWorkSchedules = workSchedule.listWorkSchedules
  }
  const { totalPages, page } = workSchedule
  const { month, allDaysOfMonth, code } = state
  console.log(listWorkSchedules)
  const arrayStatus = [0, 6, 1, 2, 3, 4]
  return (
    <React.Fragment>
      {<ManufacturingMillScheduleCreateForm />}
      <div className='box-body qlcv'>
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.work_schedule.mill_code')}</label>
            <input
              type='text'
              value={code}
              className='form-control'
              onChange={handleCodeChange}
              placeholder='KH2020122212'
              autoComplete='off'
            />
          </div>
        </div>
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.work_schedule.time')}</label>
            <DatePicker id={`month-mill`} dateFormat={'month-year'} value={month} onChange={handleChangeMonth} disabled={false} />
          </div>
          <div className='form-group'>
            <button
              type='button'
              className='btn btn-success'
              title={translate('manufacturing.work_schedule.search')}
              onClick={handleSubmitSearch}
            >
              {translate('manufacturing.work_schedule.search')}
            </button>
          </div>
        </div>
      </div>
      <div className='form-inline'>
        {arrayStatus.map((status, index) => (
          <span key={index}>
            <span
              className='icon'
              title={translate(`manufacturing.work_schedule.${status}.content`)}
              style={{ backgroundColor: translate(`manufacturing.work_schedule.${status}.color`), verticalAlign: 'middle' }}
            ></span>
            <span style={{ verticalAlign: 'middle' }}>
              &emsp;
              {translate(`manufacturing.work_schedule.${status}.content`)}
              &emsp;&emsp;
            </span>
          </span>
        ))}
      </div>

      <DataTableSetting tableId='info-mill-table' limit={state.limit} setLimit={setLimit} hideColumnOption={false} />
      <div id='croll-table' className='form-inline'>
        <div className='col-lg-6 col-md-6 col-sm-7 col-xs-8' style={{ padding: 0 }}>
          <table id='info-mill-table' className='table table-bordered not-sort'>
            <thead>
              <tr>
                <th>{translate('manufacturing.work_schedule.mill_code')}</th>
                <th>{translate('manufacturing.work_schedule.mill_name')}</th>
                <th>{translate('manufacturing.work_schedule.work_turns')}</th>
              </tr>
            </thead>
            <tbody>
              {listWorkSchedules.length !== 0 &&
                listWorkSchedules.map((schedule, index) => {
                  let numberOfTurns = schedule.turns.length ? schedule.turns.length : 1
                  let arrayTurnsWithoutOne = []
                  if (numberOfTurns > 1) {
                    for (let i = 2; i <= numberOfTurns; i++) {
                      arrayTurnsWithoutOne.push(i)
                    }
                  }
                  return (
                    <React.Fragment key={index}>
                      <tr key={index}>
                        <td rowSpan={numberOfTurns}>{schedule.manufacturingMill && schedule.manufacturingMill.code}</td>
                        <td rowSpan={numberOfTurns}>{schedule.manufacturingMill && schedule.manufacturingMill.name}</td>
                        <td>{translate('manufacturing.work_schedule.turn_1')}</td>
                      </tr>
                      {arrayTurnsWithoutOne.map((x, index) => (
                        <tr key={index}>
                          <td>{translate(`manufacturing.work_schedule.turn_${x}`)}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  )
                })}
            </tbody>
          </table>
        </div>
        <div className='col-lg-6 col-md-6 col-sm-5 col-xs-4' style={{ padding: 0 }}>
          <table id='work-schedule-table' className='table table-striped table-bordered table-hover not-sort'>
            <thead>
              <tr>
                {allDaysOfMonth.map((day, index) => (
                  <th key={index}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listWorkSchedules.length !== 0 &&
                listWorkSchedules.map((schedule, index1) =>
                  schedule.turns.map((turn, index2) => (
                    <tr key={index2}>
                      {turn.map((command, index3) => {
                        if (command !== null && command.status)
                          return (
                            <td key={index3} className='tooltip-checkbox'>
                              {/* <input type="checkbox" disabled={true} style={{ backgroundColor: translate(`manufacturing.work_schedule.${command.status}.color`) }}>
                                                                    </input> */}
                              <span
                                className='icon'
                                title={translate(`manufacturing.work_schedule.${command.status}.content`)}
                                style={{ backgroundColor: translate(`manufacturing.work_schedule.${command.status}.color`) }}
                              ></span>
                              <span className='tooltiptext'>
                                <a style={{ color: 'white' }} onClick={() => handleShowDetailManufacturingCommand(command)}>
                                  {command.code}
                                </a>
                              </span>
                            </td>
                          )

                        return (
                          <td key={index3}>
                            {/* <input type="checkbox" disabled={true} /> */}
                            <span className='icon' style={{ backgroundColor: 'white' }}></span>
                          </td>
                        )
                      })}
                    </tr>
                  ))
                )}
            </tbody>
          </table>
        </div>
      </div>

      <SlimScroll outerComponentId='croll-table' innerComponentId='work-schedule-table' innerComponentWidth={1000} activate={true} />
      <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={setPage} />
      {<ManufacturingCommandDetailInfo idModal={1} commandDetail={state.commandDetail} />}
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { workSchedule } = state
  return { workSchedule }
}

const mapDispatchToProps = {
  getAllWorkSchedules: workScheduleActions.getAllWorkSchedules,
  getAllManufacturingMills: millActions.getAllManufacturingMills,
  setCurrentMonth: workScheduleActions.setCurrentMonth
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingMillScheduleManagentTable))
