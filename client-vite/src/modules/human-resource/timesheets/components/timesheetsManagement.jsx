import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { getStorage } from '../../../../config'

import {
  DataTableSetting,
  DeleteNotification,
  PaginateBar,
  DatePicker,
  SelectMulti,
  SlimScroll,
  ExportExcel
} from '../../../../common-components'

import { TimesheetsByShiftImportForm, TimesheetsCreateForm, TimesheetsEditForm, TrendWorkOfEmployeeChart } from './combinedContent'
import { EmployeeViewForm } from '../../profile/employee-management/components/combinedContent'

import { TimesheetsActions } from '../redux/actions'
import { AnnualLeaveActions } from '../../annual-leave/redux/actions'
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions'
import { ConfigurationActions } from '../../../super-admin//module-configuration/redux/actions'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import './timesheet.css'

const TimesheetsManagement = (props) => {
  /**
   * Function format dữ liệu Date thành string
   * @param {*} date : Ngày muốn format
   * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
   */
  const formatDate = (date, monthYear = false) => {
    if (date) {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      if (monthYear === true) {
        return [month, year].join('-')
      } else return [day, month, year].join('-')
    }
    return date
  }

  /**
   * Function lấy danh sách các ngày trong tháng
   * @param {*} month : Tháng
   */
  const getAllDayOfMonth = (month) => {
    const lang = getStorage('lang')
    let arrayDay = [],
      days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    if (lang === 'vn') {
      days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    }
    let partMonth = month.split('-')
    let lastDayOfmonth = new Date(partMonth[1], partMonth[0], 0)
    for (let i = 1; i <= lastDayOfmonth.getDate(); i++) {
      let day = i
      if (i.toString().length < 2) day = '0' + i
      let date = new Date([partMonth[1], partMonth[0], day])
      arrayDay = [...arrayDay, { day: days[date.getDay()], date: date.getDate(), time: [partMonth[1], partMonth[0], day].join('-') }]
    }
    return arrayDay
  }

  let _allDayOfMonth = getAllDayOfMonth(formatDate(Date.now(), true))
  let dateNow = new Date()
  let _dayNow = dateNow.getDate()

  const tableId = 'timesheets-management'
  const defaultConfig = { limit: 5 }
  const _limit = getTableConfiguration(tableId, defaultConfig).limit

  const [state, setState] = useState({
    allDayOfMonth: _allDayOfMonth,
    dayNow: _dayNow,
    month: formatDate(Date.now(), true),
    employeeNumber: '',
    employeeName: '',
    organizationalUnits: null,
    page: 0,
    limit: _limit,
    tableId
  })

  useEffect(() => {
    const { month } = state

    let monthSearch = month
    if (month) {
      let partMonth = state.month.split('-')
      monthSearch = [partMonth[1], partMonth[0]].join('-')
    }
    props.getConfiguration()
    props.getDepartment()
    props.searchTimesheets({ ...state, month: monthSearch })
    props.searchAnnualLeaves({ page: 0, limit: 10000000, month: monthSearch, status: 'approved' })
  }, [])

  /** Function bắt sự kiện thêm thông tin chấm công */
  const createTimesheets = () => {
    window.$('#modal-create-timesheets').modal('show')
  }

  /**
   *  Bắt sự kiện click xem thông tin nhân viên
   * @param {*} value : Thông tin nhân viên muốn xem
   */
  const handleView = async (value) => {
    await setState((state) => {
      return {
        ...state,
        currentRowView: value
      }
    })
    window.$(`#modal-view-employee${value._id}`).modal('show')
  }

  /**
   *  Bắt sự kiện click xem báo cáo ngày công của nhân viên
   * @param {*} id : id nhân viên
   */
  const handleViewChart = async (value) => {
    await setState((state) => {
      return {
        ...state,
        currentRowViewChart: value
      }
    })
    window.$(`#modal-view-chart${value._id}`).modal('show')
  }

  /** Function bắt sự kiện import thông tin chấm công */
  const handleImport = async () => {
    await setState({
      ...state,
      importExcel: true
    })
    window.$('#modal_import_file').modal('show')
  }

  /** Function bắt sự kiện chỉnh sửa thông tin chấm công */
  const handleEdit = async (value) => {
    await setState({
      ...state,
      currentRow: value
    })
    window.$('#modal-edit-timesheets').modal('show')
  }

  /** Function lưu giá trị mã nhân viên vào state khi thay đổi */
  const handleChange = (e) => {
    const { name, value } = e.target
    setState({
      ...state,
      [name]: value
    })
  }

  /**
   * Function lưu giá trị unit vào state khi thay đổi
   * @param {*} value : Array id đơn vị
   */
  const handleUnitChange = (value) => {
    if (value.length === 0) {
      value = null
    }
    setState({
      ...state,
      organizationalUnits: value
    })
  }

  /**
   * Function lưu giá trị tháng vào state khi thay đổi
   * @param {*} value : Tháng
   */
  const handleMonthChange = (value) => {
    setState({
      ...state,
      month: value
    })
  }

  /** Function bắt sự kiện tìm kiếm */
  const handleSunmitSearch = async () => {
    const { month } = state
    let allDayOfMonth = getAllDayOfMonth(month)
    let dateNow = new Date(),
      dayNow = dateNow.getDate()
    let partMonth = month.split('-')
    if (formatDate(new Date(partMonth[1], partMonth[0], 0), true) !== formatDate(dateNow, true)) {
      dayNow = 31
    }
    setState({
      ...state,
      allDayOfMonth: allDayOfMonth,
      dayNow: dayNow
    })

    let monthNew = [partMonth[1], partMonth[0]].join('-')
    props.searchTimesheets({ ...state, month: monthNew })
    props.searchAnnualLeaves({ page: 0, limit: 10000000, month: monthNew, status: 'approved' })
  }

  /**
   * Bắt sự kiện setting số dòng hiện thị trên một trang
   * @param {*} number : Số dòng
   */
  const setLimit = async (number) => {
    const { month } = state
    await setState({
      ...state,
      limit: parseInt(number)
    })

    let monthSearch = month
    if (month) {
      let partMonth = state.month.split('-')
      monthSearch = [partMonth[1], partMonth[0]].join('-')
    }

    props.searchTimesheets({ ...state, month: monthSearch })
  }

  /**
   * Bắt sự kiện chuyển trang
   * @param {*} pageNumber :  Số trang muốn xem
   */
  const setPage = async (pageNumber) => {
    const { month, limit } = state
    let page = (pageNumber - 1) * limit
    await setState({
      ...state,
      page: parseInt(page)
    })
    let monthSearch = month
    if (month) {
      let partMonth = month.split('-')
      monthSearch = [partMonth[1], partMonth[0]].join('-')
    }
    props.searchTimesheets({ ...state, month: monthSearch })
  }

  /**
   * Function chyển đổi dữ liệu chấm công thành dạng dữ liệu dùng export
   * @param {*} data : Dữ liệu chấm công
   */
  const convertDataToExportData = (data, timekeepingType) => {
    const { translate } = props
    const { month } = state
    let dataExport = [],
      styleColumn,
      space = []
    if (timekeepingType === 'shift') {
      space = [{ key: 'space', value: '', width: '10' }]
      styleColumn = {
        STT: {
          vertical: 'middle',
          horizontal: 'center'
        },
        fullName: {
          vertical: 'middle',
          horizontal: 'center'
        },
        employeeNumber: {
          vertical: 'middle',
          horizontal: 'center'
        },
        totalHours: {
          vertical: 'middle',
          horizontal: 'center'
        },
        totalHoursOff: {
          vertical: 'middle',
          horizontal: 'center'
        },
        totalOvertime: {
          vertical: 'middle',
          horizontal: 'center'
        }
      }
      data.map((x, index) => {
        let totalHours = x.totalHours
        let totalHoursOff = x.totalHoursOff
        let totalOvertime = x.totalOvertime
        let shifts1s = x.timekeepingByShift.shift1s
        let shifts2s = x.timekeepingByShift.shift2s
        let shifts3s = x.timekeepingByShift.shift3s
        let colShifts1 = {},
          colShifts2 = {},
          colShifts3 = {}
        shifts1s.forEach((y, key) => {
          if (y === true) {
            colShifts1 = { ...colShifts1, [`date${key + 1}`]: 'X' }
          } else {
            colShifts1 = { ...colShifts1, [`date${key + 1}`]: '' }
          }
        })
        shifts2s.forEach((y, key) => {
          if (y === true) {
            colShifts2 = { ...colShifts2, [`date${key + 1}`]: 'X' }
          } else {
            colShifts2 = { ...colShifts2, [`date${key + 1}`]: '' }
          }
        })
        shifts3s.forEach((y, key) => {
          if (y === true) {
            colShifts3 = { ...colShifts3, [`date${key + 1}`]: 'X' }
          } else {
            colShifts3 = { ...colShifts3, [`date${key + 1}`]: '' }
          }
        })

        let row = [
          {
            merges: { STT: 3, employeeNumber: 3, fullName: 3, totalHours: 3, totalHoursOff: 3, totalOvertime: 3 },
            STT: index + 1,
            fullName: x.employee ? x.employee.fullName : '',
            employeeNumber: x.employee ? x.employee.employeeNumber : '',
            space: translate('human_resource.timesheets.shifts1'),
            ...colShifts1,
            totalHours: totalHours,
            totalHoursOff: totalHoursOff,
            totalOvertime: totalOvertime
          },
          {
            STT: '',
            fullName: '',
            employeeNumber: '',
            space: translate('human_resource.timesheets.shifts2'),
            ...colShifts2,
            totalHours: ''
          },
          {
            STT: '',
            fullName: '',
            employeeNumber: '',
            space: translate('human_resource.timesheets.shifts3'),
            ...colShifts3,
            totalHours: ''
          }
        ]
        dataExport = dataExport.concat(row)
      })
    }

    if (timekeepingType === 'hours') {
      dataExport = data.map((x, index) => {
        let totalHours = x.totalHours
        let totalHoursOff = x.totalHoursOff
        let totalOvertime = x.totalOvertime
        let timekeepingByHours = x.timekeepingByHours
        let colName = {}
        timekeepingByHours.forEach((y, key) => {
          colName = { ...colName, [`date${key + 1}`]: y !== 0 ? y : '' }
        })

        return {
          STT: index + 1,
          fullName: x.employee ? x.employee.fullName : '',
          employeeNumber: x.employee ? x.employee.employeeNumber : '',
          ...colName,
          totalHours: totalHours,
          totalHoursOff: totalHoursOff,
          totalOvertime: totalOvertime
        }
      })
    }

    let addColumns = []
    for (let n = 1; n <= 31; n++) {
      addColumns = [...addColumns, { key: `date${n}`, value: n, width: 4 }]
    }

    let exportData = {
      fileName: translate('human_resource.timesheets.file_name_export'),
      dataSheets: [
        {
          sheetName: 'Sheet1',
          sheetTitle: `${translate('human_resource.timesheets.file_name_export')} ${translate('human_resource.month').toLowerCase()} ${month}`,
          sheetTitleWidth: timekeepingType === 'hours' ? 37 : 38,
          tables: [
            {
              merges: [
                {
                  key: 'other',
                  columnName: translate('human_resource.timesheets.date_of_month'),
                  keyMerge: 'date1',
                  colspan: 31
                }
              ],
              rowHeader: 2,
              styleColumn: styleColumn,
              columns: [
                { key: 'STT', value: translate('human_resource.stt'), width: 7 },
                { key: 'employeeNumber', value: translate('human_resource.staff_number') },
                { key: 'fullName', value: translate('human_resource.staff_name'), width: 20 },
                ...space,
                ...addColumns,
                { key: 'totalHours', value: translate('human_resource.timesheets.total_timesheets') },
                { key: 'totalHoursOff', value: translate('human_resource.timesheets.total_hours_off') },
                { key: 'totalOvertime', value: translate('human_resource.timesheets.total_over_time') }
              ],
              data: dataExport
            }
          ]
        }
      ]
    }
    return exportData
  }

  const { translate, timesheets, annualLeave, department, modelConfiguration } = props

  const { month, limit, page, allDayOfMonth, dayNow, organizationalUnits, currentRowViewChart, currentRowView, currentRow, importExcel } =
    state

  let timekeepingType,
    config,
    listAnnualLeaves = [],
    listTimesheets = [],
    exportData = [],
    humanResourceConfig = modelConfiguration.humanResourceConfig

  if (humanResourceConfig) {
    timekeepingType = humanResourceConfig.timekeepingType
    if (timekeepingType === 'shift') {
      config = humanResourceConfig.timekeepingByShift
    }
  }

  if (annualLeave.isLoading === false) {
    listAnnualLeaves = annualLeave.listAnnualLeaves
  }

  if (timesheets.isLoading === false && timekeepingType) {
    listTimesheets = timesheets.listTimesheets
    exportData = convertDataToExportData(listTimesheets, timekeepingType)
  }

  let pageTotal = timesheets.totalList % limit === 0 ? parseInt(timesheets.totalList / limit) : parseInt(timesheets.totalList / limit + 1)
  let currentPage = parseInt(page / limit + 1)

  return (
    <div className='box'>
      <div className='box-body qlcv'>
        <div className='form-inline'>
          {/* Button chấm công */}
          <div className='dropdown pull-right' style={{ marginBottom: 15 }}>
            <button type='button' className='btn btn-success pull-right dropdown-toggle' data-toggle='dropdown' aria-expanded='true'>
              {translate('human_resource.timesheets.add_timesheets')}
            </button>
            <ul className='dropdown-menu pull-right' style={{ marginTop: 0 }}>
              <li>
                <a
                  style={{ cursor: 'pointer' }}
                  title={translate('human_resource.timesheets.add_timesheets_title')}
                  onClick={createTimesheets}
                >
                  {translate('human_resource.timesheets.add_by_hand')}
                </a>
              </li>
              <li>
                <a style={{ cursor: 'pointer' }} title={translate('human_resource.add_data_by_excel')} onClick={handleImport}>
                  {translate('human_resource.timesheets.add_import')}
                </a>
              </li>
            </ul>
          </div>
          <ExportExcel
            id='export-timesheets'
            buttonName={translate('human_resource.name_button_export')}
            exportData={exportData}
            style={{ marginRight: 15, marginTop: 0 }}
          />
        </div>

        <div className='form-inline'>
          {/* Đơn vị */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('human_resource.unit')}</label>
            <SelectMulti
              id={`multiSelectUnit`}
              multiple='multiple'
              options={{ nonSelectedText: translate('human_resource.non_unit'), allSelectedText: translate('human_resource.all_unit') }}
              items={department.list.map((u, i) => {
                return { value: u._id, text: u.name }
              })}
              onChange={handleUnitChange}
            ></SelectMulti>
          </div>
          {/* Tháng */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('human_resource.month')}</label>
            <DatePicker id='month' dateFormat='month-year' deleteValue={false} value={month} onChange={handleMonthChange} />
          </div>
        </div>

        <div className='form-inline'>
          {/* Mã nhân viên */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('human_resource.staff_number')}</label>
            <input
              type='text'
              className='form-control'
              name='employeeNumber'
              onChange={handleChange}
              placeholder={translate('human_resource.staff_number')}
              autoComplete='off'
            />
          </div>
          {/* Tên nhân viên  */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('human_resource.staff_name')}</label>
            <input
              type='text'
              className='form-control'
              name='employeeName'
              onChange={handleChange}
              placeholder={translate('human_resource.staff_name')}
              autoComplete='off'
            />
          </div>
        </div>

        <div className='form-inline' style={{ marginBottom: 10 }}>
          {/* Nút tìm kiếm */}
          <div className='form-group'>
            <label></label>
            <button type='button' className='btn btn-success' title={translate('general.search')} onClick={() => handleSunmitSearch()}>
              {translate('general.search')}
            </button>
          </div>
        </div>
        {timekeepingType === 'shift' && (
          <div className='form-inline'>
            <label>{translate('human_resource.timesheets.symbol')}: &emsp; &emsp; </label>
            <i style={{ color: '#08b30e', fontSize: 19 }} className='glyphicon glyphicon-ok'></i>
            <span> -- {translate('human_resource.timesheets.do_work')} </span>
            &emsp;&emsp;&emsp;<i style={{ color: 'red', fontSize: 19 }} className='glyphicon glyphicon-remove'></i>
            <span> -- {translate('human_resource.timesheets.not_work')}</span>
          </div>
        )}

        <DataTableSetting
          tableId={tableId}
          columnArr={[
            translate('human_resource.staff_number'),
            translate('human_resource.staff_name'),
            translate('human_resource.timesheets.total_timesheets'),
            translate('general.action'),
            translate('human_resource.timesheets.shift_work')
          ]}
          setLimit={setLimit}
        />
        {timekeepingType === 'shift' && (
          <div id='croll-table' className='form-inline'>
            <div className='sticky col-lg-6 col-md-6 col-sm-7 col-xs-8 ' style={{ padding: 0 }}>
              <table id={tableId} className='keeping table table-bordered'>
                <thead>
                  <tr style={{ height: 58 }}>
                    <th className='col-fixed not-sort'>{translate('human_resource.staff_number')}</th>
                    <th className='col-fixed not-sort'>{translate('human_resource.staff_name')}</th>
                    <th className='col-fixed not-sort'>{translate('human_resource.timesheets.total_timesheets')}</th>
                    <th className='col-fixed not-sort'>{translate('general.action')}</th>
                    <th className='col-fixed not-sort'>{translate('human_resource.timesheets.shift_work')}</th>
                  </tr>
                </thead>
                <tbody>
                  {listTimesheets.length !== 0 &&
                    listTimesheets.map((x, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td rowSpan='3' style={{ paddingTop: 22 }}>
                            <a style={{ cursor: 'pointer' }} onClick={() => handleView(x.employee)}>
                              {x.employee ? x.employee.employeeNumber : null}
                            </a>
                          </td>
                          <td rowSpan='3' style={{ paddingTop: 22 }}>
                            {x.employee ? x.employee.fullName : null}
                          </td>
                          <td rowSpan='3' style={{ paddingTop: 22 }}>
                            {' '}
                            {x.totalHours}
                          </td>
                          <td rowSpan='3' style={{ paddingTop: 22, textAlign: 'center' }}>
                            <a
                              onClick={() => handleViewChart(x.employee)}
                              style={{ width: '5px' }}
                              title={`Báo cáo ngày công của ${x.employee ? x.employee.fullName : null}`}
                            >
                              <i className='material-icons'>insert_chart_outlined</i>
                            </a>
                            <a
                              onClick={() => handleEdit(x)}
                              className='edit text-yellow'
                              style={{ width: '5px' }}
                              title={translate('human_resource.timesheets.edit_timesheets')}
                            >
                              <i className='material-icons'>edit</i>
                            </a>
                            <DeleteNotification
                              content={translate('human_resource.timesheets.delete_timesheets')}
                              data={{
                                id: x._id,
                                info: x.employee.employeeNumber + '- ' + translate('human_resource.month') + ': ' + month
                              }}
                              func={props.deleteTimesheets}
                            />
                          </td>
                          <td>{translate('human_resource.timesheets.shifts1')}</td>
                        </tr>
                        <tr>
                          <td>{translate('human_resource.timesheets.shifts2')}</td>
                        </tr>
                        <tr>
                          <td>{translate('human_resource.timesheets.shifts3')}</td>
                        </tr>
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </div>
            <div className='col-lg-6 col-md-6 col-sm-5 col-xs-4' style={{ padding: 0 }}>
              <table id='timesheets' className='timekeeping table table-bordered' style={{ marginLeft: -1 }}>
                <thead>
                  <tr style={{ height: 58 }}>
                    {allDayOfMonth.map((x, index) => (
                      <th className='col-fixed not-sort' key={index}>
                        {x.day}&nbsp; {x.date}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {listTimesheets.length !== 0 &&
                    listTimesheets.map((x, index) => {
                      let annualLeaves = listAnnualLeaves.filter((a) => a.employee._id === x.employee._id)

                      let shift1s = x.timekeepingByShift.shift1s,
                        shift2s = x.timekeepingByShift.shift2s,
                        shift3s = x.timekeepingByShift.shift3s
                      return (
                        <React.Fragment key={index}>
                          <tr>
                            {allDayOfMonth.map((y, indexs) => {
                              let check = false
                              let data = []
                              annualLeaves.forEach((a) => {
                                if (
                                  new Date(a.startDate).getTime() <= new Date(y.time).getTime() &&
                                  new Date(a.endDate).getTime() >= new Date(y.time).getTime()
                                ) {
                                  check = true
                                  data = [...data, a]
                                }
                              })
                              return (
                                <td
                                  key={indexs}
                                  className='tooltip-timesheet'
                                  style={{ backgroundColor: check ? '#e0e0e0' : 'none', borderBottomColor: check ? '#e0e0e0' : 'none' }}
                                >
                                  {shift1s[indexs] && indexs < dayNow ? (
                                    <i style={{ color: '#08b30e' }} className='glyphicon glyphicon-ok'></i>
                                  ) : indexs < dayNow ? (
                                    <i style={{ color: 'red' }} className='glyphicon glyphicon-remove'></i>
                                  ) : null}
                                  {check && <span className='tooltiptext'>{data[0].reason}</span>}
                                </td>
                              )
                            })}
                          </tr>
                          <tr>
                            {allDayOfMonth.map((y, indexs) => {
                              let check = false
                              let data = []
                              annualLeaves.forEach((a) => {
                                console.log(y.time)
                                console.log(a.startDate)
                                if (
                                  new Date(a.startDate).getTime() <= new Date(y.time).getTime() &&
                                  new Date(a.endDate).getTime() >= new Date(y.time).getTime()
                                ) {
                                  check = true
                                  data = [...data, a]
                                }
                              })
                              return (
                                <td
                                  key={indexs}
                                  className='tooltip-timesheet'
                                  style={{
                                    backgroundColor: check ? '#e0e0e0' : 'none',
                                    borderTopColor: check ? '#e0e0e0' : 'none',
                                    borderBottomColor: check ? '#e0e0e0' : 'none'
                                  }}
                                >
                                  {shift2s[indexs] === true && indexs < dayNow ? (
                                    <i style={{ color: '#08b30e' }} className='glyphicon glyphicon-ok'></i>
                                  ) : indexs < dayNow ? (
                                    <i style={{ color: 'red' }} className='glyphicon glyphicon-remove'></i>
                                  ) : null}
                                  {check && <span className='tooltiptext'>{data[0].reason}</span>}
                                </td>
                              )
                            })}
                          </tr>
                          <tr>
                            {allDayOfMonth.map((y, indexs) => {
                              let check = false
                              let data = []
                              annualLeaves.forEach((a) => {
                                console.log(y.time)
                                console.log(a.startDate)
                                if (
                                  new Date(a.startDate).getTime() <= new Date(y.time).getTime() &&
                                  new Date(a.endDate).getTime() >= new Date(y.time).getTime()
                                ) {
                                  check = true
                                  data = [...data, a]
                                }
                              })
                              return (
                                <td
                                  className='tooltip-timesheet'
                                  key={indexs}
                                  style={{ backgroundColor: check ? '#e0e0e0' : 'none', borderTopColor: check ? '#e0e0e0' : 'none' }}
                                >
                                  {shift3s[indexs] === true && indexs < dayNow ? (
                                    <i style={{ color: '#08b30e' }} className='glyphicon glyphicon-ok'></i>
                                  ) : indexs < dayNow ? (
                                    <i style={{ color: 'red' }} className='glyphicon glyphicon-remove'></i>
                                  ) : null}
                                  {check && (
                                    <span className='tooltiptext'>
                                      {data[0].reason}
                                      <p>
                                        {'Từ ' +
                                          (data[0].startTime ? data[0].startTime : '') +
                                          ' ' +
                                          formatDate(data[0].startDate) +
                                          ' đến ' +
                                          (data[0].endTime ? data[0].endTime : '') +
                                          ' ' +
                                          formatDate(data[0].endDate)}
                                      </p>
                                    </span>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        </React.Fragment>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {timekeepingType === 'hours' && (
          <div id='croll-table' className='row-equal-height form-inline'>
            {/* <div className="sticky" style={{ padding: 0 }}> */}
            <table id='timesheets' className='table table-striped table-bordered'>
              <thead>
                <tr>
                  <th rowSpan='2' className='col-fixed not-sort' style={{ width: 120 }}>
                    {translate('human_resource.staff_number')}
                  </th>
                  <th rowSpan='2' className='col-fixed not-sort' style={{ width: 150 }}>
                    {translate('human_resource.staff_name')}
                  </th>
                  <th rowSpan='2' className='col-fixed not-sort' style={{ width: 100 }}>
                    {translate('human_resource.timesheets.total_timesheets')}
                  </th>
                  <th rowSpan='2' className='col-fixed not-sort' style={{ width: 120, textAlign: 'center' }}>
                    {translate('general.action')}
                  </th>
                  <th
                    colSpan={allDayOfMonth.length}
                    className='col-fixed not-sort'
                    style={{ width: 70 * allDayOfMonth.length, textAlign: 'left' }}
                  >
                    {translate('human_resource.timesheets.date_of_month')}
                  </th>
                </tr>
                <tr>
                  {allDayOfMonth.map((x, index) => (
                    <th className='col-fixed not-sort' style={{ width: 70 }} key={index}>{`${x.date} - ${x.day}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listTimesheets.length !== 0 &&
                  listTimesheets.map((x, index) => {
                    let annualLeaves = listAnnualLeaves.filter((a) => a.employee._id === x.employee._id)
                    let timekeepingByHours = x.timekeepingByHours
                    return (
                      <tr key={index}>
                        <td>
                          <a style={{ cursor: 'pointer' }} onClick={() => handleView(x.employee)}>
                            {x.employee ? x.employee.employeeNumber : null}
                          </a>
                        </td>
                        <td>{x.employee ? x.employee.fullName : null}</td>
                        <td>{x.totalHours}</td>
                        <td style={{ textAlign: 'center' }}>
                          <a
                            onClick={() => handleViewChart(x.employee)}
                            style={{ width: '5px' }}
                            title={`Báo cáo ngày công của ${x.employee ? x.employee.fullName : null}`}
                          >
                            <i className='material-icons'>insert_chart_outlined</i>
                          </a>
                          <a
                            onClick={() => handleEdit(x)}
                            className='edit text-yellow'
                            style={{ width: '5px' }}
                            title={translate('human_resource.timesheets.edit_timesheets')}
                          >
                            <i className='material-icons'>edit</i>
                          </a>
                          <DeleteNotification
                            content={translate('human_resource.timesheets.delete_timesheets')}
                            data={{
                              id: x._id,
                              info: x.employee.employeeNumber + '- ' + translate('human_resource.month') + ': ' + month
                            }}
                            func={props.deleteTimesheets}
                          />
                        </td>
                        {allDayOfMonth.map((y, indexs) => {
                          let check = false
                          let data = []
                          annualLeaves.forEach((a) => {
                            if (
                              new Date(a.startDate).getTime() <= new Date(y.time).getTime() &&
                              new Date(a.endDate).getTime() >= new Date(y.time).getTime()
                            ) {
                              check = true
                              data = [...data, a]
                            }
                          })
                          return (
                            <td key={indexs} className='tooltip-timesheet' style={{ backgroundColor: check ? '#e0e0e0' : 'none' }}>
                              {timekeepingByHours[indexs] !== 0 ? timekeepingByHours[indexs] : null}
                              {check && <span className='tooltiptext'>{data[0].reason}</span>}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        )}

        <SlimScroll outerComponentId='croll-table' innerComponentId='timesheets' innerComponentWidth={1000} activate={true} />
        <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={setPage} />
      </div>
      {/* Form thêm mới thông tin chấm công */}
      <TimesheetsCreateForm timekeepingType={timekeepingType} />

      {importExcel && <TimesheetsByShiftImportForm timekeepingType={timekeepingType} />}

      {
        /* Form chinh sửa thông tin chấm công */
        currentRow && (
          <TimesheetsEditForm
            _id={currentRow._id}
            timekeepingType={timekeepingType}
            employeeNumber={currentRow.employee ? `${currentRow.employee.employeeNumber} - ${currentRow.employee.fullName}` : null}
            month={formatDate(currentRow.month, true)}
            shift1s={currentRow.timekeepingByShift.shift1s}
            shift2s={currentRow.timekeepingByShift.shift2s}
            shift3s={currentRow.timekeepingByShift.shift3s}
            timekeepingByHours={currentRow.timekeepingByHours}
            totalHoursOff={currentRow.totalHoursOff}
            totalOvertime={currentRow.totalOvertime}
            allDayOfMonth={getAllDayOfMonth(formatDate(currentRow.month, true))}
          />
        )
      }
      {/* From xem thông tin nhân viên */ <EmployeeViewForm _id={currentRowView ? currentRowView._id : ''} />}
      {currentRowViewChart && (
        <TrendWorkOfEmployeeChart
          employeeId={currentRowViewChart ? currentRowViewChart._id : 'null'}
          nameChart={`Báo cáo ngày công của ${currentRowViewChart.fullName}`}
          nameData1='Tổng giờ làm'
          nameData2='Số giờ tăng ca'
        />
      )}
    </div>
  )
}

function mapState(state) {
  const { department, annualLeave, timesheets, modelConfiguration } = state
  return { department, annualLeave, timesheets, modelConfiguration }
}

const actionCreators = {
  getDepartment: DepartmentActions.get,
  searchTimesheets: TimesheetsActions.searchTimesheets,
  deleteTimesheets: TimesheetsActions.deleteTimesheets,
  getConfiguration: ConfigurationActions.getConfiguration,
  searchAnnualLeaves: AnnualLeaveActions.searchAnnualLeaves
}

const connectedTimesheets = connect(mapState, actionCreators)(withTranslate(TimesheetsManagement))
export { connectedTimesheets as TimesheetsManagement }
