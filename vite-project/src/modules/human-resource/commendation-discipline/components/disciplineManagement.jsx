import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DataTableSetting, DeleteNotification, PaginateBar, SelectMulti, ExportExcel } from '../../../../common-components'

import { DisciplineCreateForm, DisciplineEditForm } from './combinedContent'
import { EmployeeViewForm } from '../../profile/employee-management/components/combinedContent'

import { DisciplineActions } from '../redux/actions'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
const DisciplineManager = (props) => {
  let search = window.location.search.split('?')
  let keySearch = 'organizationalUnits'
  let _organizationalUnits = null

  for (let n in search) {
    let index = search[n].lastIndexOf(keySearch)
    if (index !== -1) {
      _organizationalUnits = search[n].slice(keySearch.length + 1, search[n].length)
      if (_organizationalUnits !== 'null' && _organizationalUnits.trim() !== '') {
        _organizationalUnits = _organizationalUnits.split(',')
      } else _organizationalUnits = null
      break
    }
  }

  const tableId = 'discipline-management-table'
  const defaultConfig = { limit: 5 }
  const _limit = getTableConfiguration(tableId, defaultConfig).limit

  const [state, setState] = useState({
    decisionNumber: '',
    employeeNumber: '',
    employeeName: '',
    organizationalUnits: _organizationalUnits,
    page: 0,
    limit: _limit,
    tableId
  })

  useEffect(() => {
    const { getListDiscipline } = props
    getListDiscipline(state)
  }, [])

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
   *  Bắt sự kiện click xem thông tin nhân viên
   * @param {*} value : Thông tin nhân viên muốn xem
   */
  const handleView = async (value) => {
    await setState((state) => ({
      ...state,
      currentRowView: value
    }))
    window.$(`#modal-view-employee-displine${value._id}`).modal('show')
  }

  /**
   * Bắt sự kiện click chỉnh sửa thông tin kỷ luật
   * @param {*} value : Thông tin kỷ luật
   */
  const handleEdit = async (value) => {
    await setState((state) => ({
      ...state,
      currentRow: value
    }))
    window.$('#modal-edit-discipline').modal('show')
  }

  /**
   * Function lưu giá trị unit vào state khi thay đổi
   * @param {*} value : Array id đơn vị
   */
  const handleUnitChange = (value) => {
    if (value.length === 0) {
      value = null
    }
    setState((state) => ({
      ...state,
      organizationalUnits: value
    }))
  }

  /** Function bắt sự kiện thay đổi mã nhân viên, tên nhân viên và số quyết định */
  const handleChange = (e) => {
    const { name, value } = e.target
    setState((state) => ({
      ...state,
      [name]: value
    }))
  }

  /** Function bắt sự kiện tìm kiếm */
  const handleSubmitSearch = () => {
    const { getListDiscipline } = props
    getListDiscipline(state)
  }

  /**
   * Bắt sự kiện setting số dòng hiện thị trên một trang
   * @param {*} number : Số dòng hiện thị trên 1 trang
   */
  const setLimit = async (number) => {
    await setState((state) => ({
      ...state,
      limit: parseInt(number)
    }))
  }

  /**
   * Bắt sự kiện chuyển trang
   * @param {*} pageNumber : Số trang muốn xem
   */
  const setPage = async (pageNumber) => {
    const { limit } = state
    var page = (pageNumber - 1) * limit
    await setState((state) => ({
      ...state,
      page: parseInt(page)
    }))
  }

  useEffect(() => {
    const { getListDiscipline } = props
    getListDiscipline(state)
  }, [state.limit, state.page])

  /**
   * Function chyển đổi dữ liệu kỷ luật thành dạng dữ liệu dùng export
   * @param {*} data : Dữ liệu kỷ luật
   */
  const convertDataToExportData = (data) => {
    const { department, translate } = props
    if (data) {
      data = data.map((x, index) => {
        let decisionUnit = department.list.find((y) => y._id === x.organizationalUnit)
        return {
          STT: index + 1,
          employeeNumber: x.employee ? x.employee.employeeNumber : null,
          fullName: x.employee ? x.employee.fullName : null,
          decisionNumber: x.decisionNumber,
          decisionUnit: decisionUnit ? decisionUnit.name : '',
          startDate: new Date(x.startDate),
          endDate: new Date(x.endDate),
          type: x.type,
          reason: x.reason
        }
      })
    }
    let exportData = {
      fileName: translate('human_resource.commendation_discipline.discipline.file_name_export'),
      dataSheets: [
        {
          sheetName: 'sheet1',
          sheetTitle: translate('human_resource.commendation_discipline.discipline.file_name_export'),
          tables: [
            {
              columns: [
                { key: 'STT', value: translate('human_resource.stt'), width: 7 },
                { key: 'employeeNumber', value: translate('human_resource.staff_number') },
                { key: 'fullName', value: translate('human_resource.staff_name'), width: 20 },
                { key: 'decisionNumber', value: translate('human_resource.commendation_discipline.commendation.table.decision_number') },
                {
                  key: 'decisionUnit',
                  value: translate('human_resource.commendation_discipline.commendation.table.decision_unit'),
                  width: 25
                },
                { key: 'startDate', value: translate('human_resource.commendation_discipline.discipline.table.start_date') },
                { key: 'endDate', value: translate('human_resource.commendation_discipline.discipline.table.end_date') },
                { key: 'type', value: translate('human_resource.commendation_discipline.discipline.table.discipline_forms') },
                { key: 'reason', value: translate('human_resource.commendation_discipline.discipline.table.reason_discipline') }
              ],
              data: data
            }
          ]
        }
      ]
    }
    return exportData
  }

  const { translate, discipline, department } = props

  const { pageActive, deleteDiscipline } = props

  const { limit, page, organizationalUnits, currentRow, currentRowView } = state

  let { list } = department

  let listDisciplines = [],
    exportData = []
  if (discipline.isLoading === false) {
    listDisciplines = discipline.listDisciplines
    exportData = convertDataToExportData(listDisciplines)
  }

  let pageTotal =
    discipline.totalListDiscipline % limit === 0
      ? parseInt(discipline.totalListDiscipline / limit)
      : parseInt(discipline.totalListDiscipline / limit + 1)
  let currentPage = parseInt(page / limit + 1)

  return (
    <div id='kyluat' className={`tab-pane ${pageActive === 'discipline' ? 'active' : null}`}>
      <div className='box-body qlcv'>
        {/* Form thêm kỷ luật */}
        <DisciplineCreateForm />
        <ExportExcel
          id='export-discipline'
          buttonName={translate('human_resource.name_button_export')}
          exportData={exportData}
          style={{ marginRight: 15, marginTop: 2 }}
        />

        <div className='form-inline'>
          {/* Cấp ra quyết định */}
          <div className='form-group'>
            <label className='form-control-static'>
              {translate('human_resource.commendation_discipline.commendation.table.decision_unit')}
            </label>
            <SelectMulti
              id={`multiSelectUnitDiscipline`}
              multiple='multiple'
              value={organizationalUnits ? organizationalUnits : []}
              options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
              items={list.map((u, i) => {
                return { value: u._id, text: u.name }
              })}
              onChange={handleUnitChange}
            ></SelectMulti>
          </div>
          {/* Số quyết định */}
          <div className='form-group'>
            <label className='form-control-static'>
              {translate('human_resource.commendation_discipline.commendation.table.decision_number')}
            </label>
            <input
              type='text'
              className='form-control'
              name='decisionNumber'
              onChange={handleChange}
              placeholder={translate('human_resource.commendation_discipline.commendation.table.decision_number')}
              autoComplete='off'
            />
          </div>
        </div>

        <div className='form-inline'>
          {/* Mã nhân viên*/}
          <div className='form-group'>
            <label className='form-control-static'>{translate('human_resource.staff_number')}</label>
            <input
              type='text'
              className='form-control'
              name='employeeNumber'
              onChange={handleChange}
              placeholder={translate('page.staff_number')}
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
          {/* Hình thức kỷ luật*/}
          <div className='form-group'>
            <label className='form-control-static'>
              {translate('human_resource.commendation_discipline.discipline.table.discipline_forms_short')}
            </label>
            <input
              type='text'
              className='form-control'
              name='type'
              onChange={handleChange}
              placeholder={translate('human_resource.commendation_discipline.discipline.table.discipline_forms')}
              autoComplete='off'
            />
          </div>
          {/* Nút tìm kiếm */}
          <div className='form-group'>
            <label></label>
            <button type='button' className='btn btn-success' onClick={handleSubmitSearch} title={translate('page.add_search')}>
              {translate('page.add_search')}
            </button>
          </div>
        </div>

        <table id={tableId} className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th>{translate('human_resource.staff_number')}</th>
              <th>{translate('table.employee_name')}</th>
              <th>{translate('human_resource.commendation_discipline.discipline.table.start_date')}</th>
              <th>{translate('human_resource.commendation_discipline.discipline.table.end_date')}</th>
              <th>{translate('human_resource.commendation_discipline.commendation.table.decision_number')}</th>
              <th>{translate('human_resource.commendation_discipline.commendation.table.decision_unit')}</th>
              <th>{translate('human_resource.commendation_discipline.discipline.table.discipline_forms')}</th>
              <th style={{ width: '120px', textAlign: 'center' }}>
                {translate('general.action')}
                <DataTableSetting
                  tableId={tableId}
                  columnArr={[
                    translate('human_resource.staff_number'),
                    translate('table.employee_name'),
                    translate('human_resource.commendation_discipline.discipline.table.start_date'),
                    translate('human_resource.commendation_discipline.discipline.table.end_date'),
                    translate('human_resource.commendation_discipline.commendation.table.decision_number'),
                    translate('human_resource.commendation_discipline.commendation.table.decision_unit'),
                    translate('human_resource.commendation_discipline.discipline.table.discipline_forms')
                  ]}
                  setLimit={setLimit}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {listDisciplines &&
              listDisciplines.length !== 0 &&
              listDisciplines.map((x, index) => {
                let decisionUnit = department.list.find((y) => y._id === x.organizationalUnit)
                return (
                  <tr key={index}>
                    <td>
                      <a style={{ cursor: 'pointer' }} onClick={() => handleView(x.employee)}>
                        {x.employee ? x.employee.employeeNumber : ''}
                      </a>
                    </td>
                    <td>{x.employee ? x.employee.fullName : ''}</td>
                    <td>{formatDate(x.startDate)}</td>
                    <td>{formatDate(x.endDate)}</td>
                    <td>{x.decisionNumber}</td>
                    <td>{decisionUnit ? decisionUnit.name : ''}</td>
                    <td>{x.type}</td>
                    <td style={{ textAlign: 'center' }}>
                      <a
                        onClick={() => handleEdit(x)}
                        className='edit text-yellow'
                        style={{ width: '5px' }}
                        title={translate('human_resource.commendation_discipline.discipline.edit_discipline')}
                      >
                        <i className='material-icons'>edit</i>
                      </a>
                      <DeleteNotification
                        content={translate('human_resource.commendation_discipline.discipline.delete_discipline')}
                        data={{
                          id: x._id,
                          info: x.employee.employeeNumber + ' - ' + translate('page.number_decisions') + ': ' + x.decisionNumber
                        }}
                        func={deleteDiscipline}
                      />
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
        {discipline.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (!listDisciplines || listDisciplines.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}
        <PaginateBar id='discipline' pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={setPage} />
        {
          /* Form chỉnh sửa thông tin kỷ luật */
          currentRow !== undefined && (
            <DisciplineEditForm
              _id={currentRow._id}
              employeeNumber={currentRow.employee ? `${currentRow.employee.employeeNumber} - ${currentRow.employee.fullName}` : null}
              decisionNumber={currentRow.decisionNumber}
              organizationalUnit={currentRow.organizationalUnit}
              startDate={formatDate(currentRow.startDate)}
              endDate={formatDate(currentRow.endDate)}
              type={currentRow.type}
              reason={currentRow.reason}
            />
          )
        }
        {/* From xem thông tin nhân viên */ <EmployeeViewForm _id={currentRowView ? currentRowView._id : ''} duplicate={'displine'} />}
      </div>
    </div>
  )
}

function mapState(state) {
  const { discipline, department } = state
  return { discipline, department }
}

const actionCreators = {
  getListDiscipline: DisciplineActions.getListDiscipline,
  deleteDiscipline: DisciplineActions.deleteDiscipline
}

const disciplineManager = connect(mapState, actionCreators)(withTranslate(DisciplineManager))
export { disciplineManager as DisciplineManager }
