import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DeleteNotification, ExportExcel, DatePicker } from '../../../../common-components'

import { WorkPlanEditForm, WorkPlanCreateForm, WorkPlanImportForm } from './combinedContent'

import { WorkPlanActions } from '../redux/actions'

const ManageWorkPlan = (props) => {
  const [state, setState] = useState({
    year: new Date().getFullYear()
  })

  useEffect(() => {
    const { getListWorkPlan } = props
    getListWorkPlan()
  }, [])

  /** Bắt sự kiện import kế hoạch làm việc */
  const handleImport = async () => {
    await setState((state) => ({
      ...state,
      importWorkPlan: true
    }))
    window.$('#modal_import_file').modal('show')
  }

  /** Function bắt sự kiện thêm mới lịch làm việc */
  const _createWorkPlan = async () => {
    await setState((state) => ({
      ...state,
      createWorkPlan: true
    }))
    window.$('#modal-create-work-plan').modal('show')
  }

  /**
   * Bắt sự kiện thay đổi số ngày được nghỉ phép trong năm
   * @param {*} value : Tổng số ngày được nghỉ phép
   */
  const handleYearChange = (value) => {
    setState((state) => ({
      ...state,
      year: value
    }))
  }

  const handleSunmitSearch = () => {
    const { year } = state
    const { getListWorkPlan } = props
    getListWorkPlan({ year: year })
  }

  /**
   * Function format ngày hiện tại thành dạnh dd/mm/yyyy
   * @param {*} date : Ngày muốn format
   */
  const formatDate = (date) => {
    if (date) {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day
      return [day, month, year].join('/')
    }
    return date
  }

  /**
   * Function format ngày hiện tại thành dạnh dd-mm-yyyy
   * @param {*} date : Ngày muốn format
   */
  const formatDate2 = (date) => {
    if (date) {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day
      return [day, month, year].join('-')
    }
    return date
  }

  /**
   * Function bắt sự kiện chỉnh sửa lịch làm việc
   * @param {*} value : Thông tin lịch làm việc
   */
  const handleEdit = async (value) => {
    await setState((state) => ({
      ...state,
      currentRow: value
    }))
    window.$('#modal-edit-work-plan').modal('show')
  }

  const handleNumberDateOfYearChange = (e) => {
    const { value } = e.target
    setState((state) => ({
      ...state,
      maximumNumberOfLeaveDays: value
    }))
  }

  const updateNumberDateOfYear = async () => {
    const { workPlan, updateWorkPlan } = props
    let { maximumNumberOfLeaveDays } = state

    if (!maximumNumberOfLeaveDays) {
      maximumNumberOfLeaveDays = workPlan.maximumNumberOfLeaveDays
    }
    await window.$(`#collapseNumberDateOfYear`).collapse('hide')
    updateWorkPlan(null, { maximumNumberOfLeaveDays: maximumNumberOfLeaveDays })
  }

  /**
   * Function chyển đổi dữ liệu kế hoạch làm việc thành dạng dữ liệu dùng export
   * @param {*} data
   */
  const convertDataToExportData = (data) => {
    const { translate } = props
    data = data.map((x, index) => {
      return {
        STT: index + 1,
        type: translate(`human_resource.work_plan.${x.type}`),
        startDate: new Date(x.startDate),
        endDate: new Date(x.endDate),
        description: x.description
      }
    })
    let exportData = {
      fileName: translate('human_resource.work_plan.file_name_export'),

      dataSheets: [
        {
          sheetName: 'sheet1',
          sheetTitle: translate('human_resource.work_plan.file_name_export'),
          tables: [
            {
              columns: [
                { key: 'STT', value: translate('human_resource.stt'), width: 7 },
                { key: 'type', value: translate('human_resource.work_plan.table.type'), width: 35 },
                { key: 'startDate', value: translate('human_resource.work_plan.table.start_date') },
                { key: 'endDate', value: translate('human_resource.work_plan.table.end_date') },
                { key: 'description', value: translate('human_resource.work_plan.table.describe_timeline'), width: 35 }
              ],
              data: data
            }
          ]
        }
      ]
    }
    return exportData
  }

  const { translate, workPlan, deleteWorkPlan } = props

  let { year, importWorkPlan, createWorkPlan, currentRow, maximumNumberOfLeaveDays } = state

  let workPlans = workPlan.listWorkPlan,
    numberDateLeave = workPlan.maximumNumberOfLeaveDays

  if (maximumNumberOfLeaveDays !== undefined) {
    numberDateLeave = maximumNumberOfLeaveDays
  }

  let exportData = convertDataToExportData(workPlans)
  let listNoLeave = workPlans.filter((x) => x.type === 'time_not_allow_to_leave')
  let listAutoLeave = workPlans.filter((x) => x.type === 'time_allow_to_leave')
  let listWorkPlan = workPlans.filter((x) => x.type === 'time_for_holiday')
  let listWorkPlanOther = workPlans.filter((x) => x.type === 'other')

  return (
    <div className='box'>
      <div className='box-body qlcv'>
        <div className='form-inline'>
          {/* Button thêm lịch làm việc */}
          <div className='dropdown pull-right'>
            <button
              type='button'
              className='btn btn-success pull-right dropdown-toggle'
              data-toggle='dropdown'
              aria-expanded='true'
              title={translate('human_resource.work_plan.add_work_plan_title')}
            >
              {translate('human_resource.work_plan.add_work_plan')}
            </button>
            <ul className='dropdown-menu pull-right'>
              <li>
                <a
                  style={{ cursor: 'pointer' }}
                  title={translate('human_resource.work_plan.add_work_plan_title')}
                  onClick={_createWorkPlan}
                >
                  {translate('human_resource.work_plan.add_by_hand')}
                </a>
              </li>
              <li>
                <a style={{ cursor: 'pointer' }} title={translate('human_resource.work_plan.add_data_by_excel')} onClick={handleImport}>
                  {translate('human_resource.work_plan.add_import')}
                </a>
              </li>
            </ul>
          </div>
          <ExportExcel
            id='export-work-plan'
            buttonName={translate('human_resource.name_button_export')}
            exportData={exportData}
            style={{ marginRight: 15, marginTop: 0 }}
          />
        </div>

        <div className='form-inline'>
          {/* Năm */}
          <div className='form-group'>
            <label style={{ width: 'auto' }}>{translate('human_resource.work_plan.year')}</label>
            <DatePicker id='year' dateFormat='year' value={year} onChange={handleYearChange} />
          </div>

          {/* Nút tìm kiếm */}
          <div className='form-group'>
            <button type='button' className='btn btn-success' title={translate('general.search')} onClick={() => handleSunmitSearch()}>
              {translate('general.search')}
            </button>
          </div>
        </div>

        <div className='row row-equal-height'>
          {/* Danh sách thời gian nghỉ lễ, ghỉ tết*/}
          <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
            <div id='work-plan' className='description-box' style={{ paddingRight: 10 }}>
              <h4>{translate('human_resource.work_plan.list_holiday')}</h4>
              <table className='table table-striped table-bordered table-hover' style={{ marginBottom: 0 }}>
                <thead>
                  <tr>
                    <th className='not-sort' style={{ width: '45px' }}>
                      {translate('human_resource.stt')}
                    </th>
                    <th>{translate('human_resource.work_plan.table.timeline')}</th>
                    <th>{translate('human_resource.work_plan.table.describe_timeline')}</th>
                    <th style={{ width: 100 }}>{translate('general.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {listWorkPlan &&
                    listWorkPlan.length !== 0 &&
                    listWorkPlan.map((x, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {formatDate(x.startDate) === formatDate(x.endDate)
                            ? formatDate(x.startDate)
                            : formatDate(x.startDate) + ' - ' + formatDate(x.endDate)}
                        </td>
                        <td>{x.description}</td>
                        <td>
                          <a
                            onClick={() => handleEdit(x)}
                            className='edit text-yellow'
                            style={{ width: '5px' }}
                            title={translate('human_resource.work_plan.edit_work_plan')}
                          >
                            <i className='material-icons'>edit</i>
                          </a>
                          <DeleteNotification
                            content={translate('human_resource.work_plan.delete_work_plan')}
                            data={{
                              id: x._id,
                              info:
                                formatDate(x.startDate) === formatDate(x.endDate)
                                  ? formatDate(x.startDate)
                                  : formatDate(x.startDate) + ' - ' + formatDate(x.endDate)
                            }}
                            func={deleteWorkPlan}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {workPlan.isLoading ? (
                <div className='table-info-panel'>{translate('confirm.loading')}</div>
              ) : (
                (!listWorkPlan || listWorkPlan.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
              )}
            </div>
          </div>
          <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
            {/* Danh sách thời gian được nghỉ*/}
            <div className='box-solid description description-box' style={{ paddingRight: 10 }}>
              <h4>{translate('human_resource.work_plan.list_auto_leave')}</h4>
              {/* Số ngày nghỉ phép trong một năm */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ width: 'auto' }}>
                  {`${translate('human_resource.work_plan.number_date_leave_of_year')} (${translate('human_resource.work_plan.date_year')})`}
                  &ensp;
                </label>
                <input
                  className='form-control'
                  style={{ width: 80, display: 'inline' }}
                  value={numberDateLeave}
                  onChange={handleNumberDateOfYearChange}
                  type='Number'
                />
                &ensp;
                <button type='button' style={{ marginTop: -5 }} className='btn btn-primary' onClick={updateNumberDateOfYear}>
                  {translate('human_resource.work_plan.save_as')}
                </button>
              </div>

              <table className='table table-striped table-bordered table-hover' style={{ marginBottom: 0 }}>
                <thead>
                  <tr>
                    <th className='not-sort' style={{ width: '45px' }}>
                      {translate('human_resource.stt')}
                    </th>
                    <th>{translate('human_resource.work_plan.table.timeline')}</th>
                    <th>{translate('human_resource.work_plan.table.describe_timeline')}</th>
                    <th style={{ width: 100 }}>{translate('general.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {listAutoLeave &&
                    listAutoLeave.length !== 0 &&
                    listAutoLeave.map((x, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {formatDate(x.startDate) === formatDate(x.endDate)
                            ? formatDate(x.startDate)
                            : formatDate(x.startDate) + ' - ' + formatDate(x.endDate)}
                        </td>
                        <td>{x.description}</td>
                        <td>
                          <a
                            onClick={() => handleEdit(x)}
                            className='edit text-yellow'
                            style={{ width: '5px' }}
                            title={translate('human_resource.work_plan.edit_work_plan')}
                          >
                            <i className='material-icons'>edit</i>
                          </a>
                          <DeleteNotification
                            content={translate('human_resource.work_plan.delete_work_plan')}
                            data={{
                              id: x._id,
                              info:
                                formatDate(x.startDate) === formatDate(x.endDate)
                                  ? formatDate(x.startDate)
                                  : formatDate(x.startDate) + ' - ' + formatDate(x.endDate)
                            }}
                            func={deleteWorkPlan}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {workPlan.isLoading ? (
                <div className='table-info-panel'>{translate('confirm.loading')}</div>
              ) : (
                (!listAutoLeave || listAutoLeave.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
              )}
            </div>
          </div>
        </div>

        <div className='row row-equal-height'>
          <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
            {/* Danh sách thời gian không được xin nghỉ phép*/}
            <div className='description-box ' style={{ paddingRight: 10 }}>
              <h4>{translate('human_resource.work_plan.list_no_leave')}</h4>
              <table className='table table-striped table-bordered table-hover' style={{ marginBottom: 0 }}>
                <thead>
                  <tr>
                    <th className='not-sort' style={{ width: '45px' }}>
                      {translate('human_resource.stt')}
                    </th>
                    <th>{translate('human_resource.work_plan.table.timeline')}</th>
                    <th>{translate('human_resource.work_plan.table.describe_timeline')}</th>
                    <th style={{ width: 100 }}>{translate('general.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {listNoLeave &&
                    listNoLeave.length !== 0 &&
                    listNoLeave.map((x, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {formatDate(x.startDate) === formatDate(x.endDate)
                            ? formatDate(x.startDate)
                            : formatDate(x.startDate) + ' - ' + formatDate(x.endDate)}
                        </td>
                        <td>{x.description}</td>
                        <td>
                          <a
                            onClick={() => handleEdit(x)}
                            className='edit text-yellow'
                            style={{ width: '5px' }}
                            title='Chỉnh sửa nghỉ phép'
                          >
                            <i className='material-icons'>edit</i>
                          </a>
                          <DeleteNotification
                            content='Xoá ngày nghỉ lễ (tết)'
                            data={{
                              id: x._id,
                              info:
                                formatDate(x.startDate) === formatDate(x.endDate)
                                  ? formatDate(x.startDate)
                                  : formatDate(x.startDate) + ' - ' + formatDate(x.endDate)
                            }}
                            func={deleteWorkPlan}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {workPlan.isLoading ? (
                <div className='table-info-panel'>{translate('confirm.loading')}</div>
              ) : (
                (!listNoLeave || listNoLeave.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
              )}
            </div>
          </div>
          <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
            {/* Thời gian nghỉ khác */}
            <div className='description-box' style={{ paddingRight: 10 }}>
              <h4>{translate('human_resource.work_plan.other')}</h4>
              <table className='table table-striped table-bordered table-hover' style={{ marginBottom: 0 }}>
                <thead>
                  <tr>
                    <th className='not-sort' style={{ width: '45px' }}>
                      {translate('human_resource.stt')}
                    </th>
                    <th>{translate('human_resource.work_plan.table.timeline')}</th>
                    <th>{translate('human_resource.work_plan.table.describe_timeline')}</th>
                    <th style={{ width: 100 }}>{translate('general.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {listWorkPlanOther &&
                    listWorkPlanOther.length !== 0 &&
                    listWorkPlanOther.map((x, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {formatDate(x.startDate) === formatDate(x.endDate)
                            ? formatDate(x.startDate)
                            : formatDate(x.startDate) + ' - ' + formatDate(x.endDate)}
                        </td>
                        <td>{x.description}</td>
                        <td>
                          <a
                            onClick={() => handleEdit(x)}
                            className='edit text-yellow'
                            style={{ width: '5px' }}
                            title={translate('human_resource.work_plan.edit_work_plan')}
                          >
                            <i className='material-icons'>edit</i>
                          </a>
                          <DeleteNotification
                            content={translate('human_resource.work_plan.delete_work_plan')}
                            data={{
                              id: x._id,
                              info:
                                formatDate(x.startDate) === formatDate(x.endDate)
                                  ? formatDate(x.startDate)
                                  : formatDate(x.startDate) + ' - ' + formatDate(x.endDate)
                            }}
                            func={deleteWorkPlan}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {workPlan.isLoading ? (
                <div className='table-info-panel'>{translate('confirm.loading')}</div>
              ) : (
                (!listWorkPlanOther || listWorkPlanOther.length === 0) && (
                  <div className='table-info-panel'>{translate('confirm.no_data')}</div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form import lịch làm việc */ importWorkPlan && <WorkPlanImportForm />}
      {/* Form thêm lịch làm việc*/ createWorkPlan && <WorkPlanCreateForm />}
      {
        /* Form chỉnh sửa lịch làm việc*/
        currentRow !== undefined && (
          <WorkPlanEditForm
            _id={currentRow._id}
            type={currentRow.type}
            startDate={formatDate2(currentRow.startDate)}
            endDate={formatDate2(currentRow.endDate)}
            description={currentRow.description}
          />
        )
      }
    </div>
  )
}

function mapState(state) {
  const { workPlan } = state
  return { workPlan }
}

const actionCreators = {
  deleteWorkPlan: WorkPlanActions.deleteWorkPlan,
  getListWorkPlan: WorkPlanActions.getListWorkPlan,
  updateWorkPlan: WorkPlanActions.updateWorkPlan
}
export default connect(mapState, actionCreators)(withTranslate(ManageWorkPlan))
