import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DataTableSetting, DeleteNotification, PaginateBar, DatePicker, SelectMulti, ExportExcel } from '../../../../common-components'

import { SalaryCreateForm, SalaryEditForm, SalaryImportForm } from './combinedContent'
import { EmployeeViewForm } from '../../profile/employee-management/components/combinedContent'

import { SalaryActions } from '../redux/actions'
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
const SalaryManagement = (props) => {
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

  let partMonth = formatDate(Date.now(), true).split('-')
  let month = [partMonth[1], partMonth[0]].join('-')

  const tableId = 'table-salary-management'
  const defaultConfig = { limit: 5 }
  const _limit = getTableConfiguration(tableId, defaultConfig).limit

  const [state, setState] = useState({
    tableId,
    month: month,
    employeeName: '',
    employeeNumber: '',
    organizationalUnits: null,
    page: 0,
    limit: _limit
  })

  useEffect(() => {
    const { searchSalary, getDepartment } = props
    searchSalary(state)
    getDepartment()
  }, [])

  useEffect(() => {
    window.$('#modal_import_file').modal('show')
  }, [state.importSalary])

  /** Function bắt sự kiện thêm lương nhân viên bằng tay */
  const createSalary = () => {
    window.$('#modal-create-salary').modal('show')
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
    window.$(`#modal-view-employee${value._id}`).modal('show')
  }

  /** Function bắt sự kiện thêm lương nhân viên bằng import file */
  const _importSalary = async () => {
    setState(() => ({
      ...state,
      importSalary: true
    }))
    window.$('#modal_import_file').modal('show')
  }

  /**
   * Function bắt sự kiện chỉnh sửa thông tin lương nhân viên
   * @param {*} value : Thông tin lương nhân viên cần chỉnh sửa
   */
  const handleEdit = async (value) => {
    await setState((state) => ({
      ...state,
      currentRow: value
    }))
    window.$('#modal-edit-salary').modal('show')
  }

  /** Function lưu giá trị mã nhân viên vào state khi thay đổi */
  const handleChange = (event) => {
    const { name, value } = event.target
    setState((state) => ({
      ...state,
      [name]: value
    }))
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

  /**
   *Function lưu giá trị tháng vào state khi thay đổi
   * @param {*} value : Giá trị tháng
   */
  const handleMonthChange = (value) => {
    if (value) {
      let partMonth = value.split('-')
      value = [partMonth[1], partMonth[0]].join('-')
    }
    setState((state) => ({
      ...state,
      month: value
    }))
  }

  /** Function bắt sự kiện tìm kiếm */
  const handleSunmitSearch = async () => {
    const { searchSalary } = props
    searchSalary(state)
  }

  /**
   * Bắt sự kiện setting số dòng hiện thị trên một trang
   * @param {*} number : Số dòng hiện thị
   */
  const setLimit = async (number) => {
    const { searchSalary } = props
    await setState((state) => ({
      ...state,
      limit: parseInt(number)
    }))
  }

  /**
   * Bắt sự kiện chuyển trang
   * @param {*} pageNumber : Số trang cần xem
   */
  const setPage = async (pageNumber) => {
    let { limit } = state
    const { searchSalary } = props
    let page = (pageNumber - 1) * limit
    await setState((state) => ({
      ...state,
      page: parseInt(page)
    }))
  }

  useEffect(() => {
    const { searchSalary } = props
    searchSalary(state)
  }, [state.page, state.limit])

  /**
   * Function chyển đổi dữ liệu bảng lương thành dạng dữ liệu dùng export
   * @param {*} data : dữ liệu bảng lương
   */
  const convertDataToExportData = (data) => {
    const { translate, department } = props
    let otherSalary = []
    if (data) {
      data.forEach((x) => {
        if (x.bonus.length !== 0) {
          for (let count in x.bonus) {
            if (!otherSalary.includes(x.bonus[count].nameBonus)) {
              otherSalary = [...otherSalary, x.bonus[count].nameBonus]
            }
          }
        }
      })

      data = data.map((x, index) => {
        let organizationalUnit = department.list.find((y) => y._id === x.organizationalUnit)
        let total = 0,
          bonus = {}
        let d = new Date(x.month),
          month = '' + (d.getMonth() + 1),
          year = d.getFullYear()
        if (x.bonus.length !== 0) {
          for (let count in x.bonus) {
            total = total + parseInt(x.bonus[count].number)
            otherSalary.forEach((y, key) => {
              if (y === x.bonus[count].nameBonus) {
                bonus = { ...bonus, [`bonus${key}`]: parseInt(x.bonus[count].number) }
              }
            })
          }
        }
        let mainSalary = x?.mainSalary ? parseInt(x.mainSalary) : 0
        return {
          STT: index + 1,
          employeeNumber: x.employee.employeeNumber,
          fullName: x.employee.fullName,
          mainSalary: mainSalary,
          birthdate: new Date(x.employee.birthdate),
          status: x.employee.status === 'active' ? translate('human_resource.profile.active') : translate('human_resource.profile.leave'),
          gender: x.employee.gender === 'male' ? translate('human_resource.profile.male') : translate('human_resource.profile.female'),
          organizationalUnit: organizationalUnit ? organizationalUnit.name : '',
          total: parseInt(total) + mainSalary,
          month: month,
          year: year,
          ...bonus
        }
      })
    }
    console.log('data', data)
    let columns = [{ key: 'bonus0', value: 0 }]
    if (otherSalary.length !== 0) {
      columns = otherSalary.map((x, index) => {
        return { key: `bonus${index}`, value: x }
      })
    }
    let merges = [
      {
        key: 'other',
        columnName: translate('human_resource.salary.other_salary'),
        keyMerge: 'bonus0',
        colspan: columns.length
      }
    ]

    let exportData = {
      fileName: translate('human_resource.salary.file_name_export'),
      dataSheets: [
        {
          sheetName: 'Sheet1',
          sheetTitle: translate('human_resource.salary.file_name_export'),
          tables: [
            {
              rowHeader: 2,
              merges: merges,
              columns: [
                { key: 'STT', value: translate('human_resource.stt'), width: 7 },
                { key: 'month', value: translate('human_resource.month'), width: 10 },
                { key: 'year', value: translate('human_resource.work_plan.year'), width: 10 },
                { key: 'employeeNumber', value: translate('human_resource.staff_number') },
                { key: 'fullName', value: translate('human_resource.staff_name'), width: 20 },
                { key: 'organizationalUnit', value: translate('human_resource.unit'), width: 25 },
                { key: 'gender', value: translate('human_resource.profile.gender') },
                { key: 'birthdate', value: translate('human_resource.profile.date_birth') },
                { key: 'status', value: translate('human_resource.profile.status_work') },
                { key: 'mainSalary', value: translate('human_resource.salary.table.main_salary') },
                ...columns,
                { key: 'total', value: translate('human_resource.salary.table.total_salary') }
              ],
              data: data
            }
          ]
        }
      ]
    }
    return exportData
  }

  const { translate, salary, department, deleteSalary } = props

  const { limit, page, importSalary, currentRow, currentRowView } = state

  let formater = new Intl.NumberFormat()
  let { list } = department
  let listSalarys = [],
    exportData = []

  if (salary.isLoading === false) {
    listSalarys = salary.listSalarys
    exportData = convertDataToExportData(listSalarys)
  }

  let pageTotal = salary.totalList % limit === 0 ? parseInt(salary.totalList / limit) : parseInt(salary.totalList / limit + 1)
  let currentPage = parseInt(page / limit + 1)

  console.log('importSalary', importSalary)
  return (
    <div className='box'>
      <div className='box-body qlcv'>
        <div className='form-inline'>
          {/* Nút xuất thêm bảng lương*/}
          <div className='dropdown pull-right' style={{ marginBottom: 15 }}>
            <button
              type='button'
              className='btn btn-success dropdown-toggle pull-right'
              data-toggle='dropdown'
              aria-expanded='true'
              title={translate('human_resource.salary.add_salary_title')}
            >
              {translate('human_resource.salary.add_salary')}
            </button>
            <ul className='dropdown-menu pull-right' style={{ marginTop: 0 }}>
              <li>
                <a style={{ cursor: 'pointer' }} title={translate('human_resource.salary.add_by_hand_title')} onClick={createSalary}>
                  {translate('human_resource.salary.add_by_hand')}
                </a>
              </li>
              <li>
                <a style={{ cursor: 'pointer' }} title={translate('human_resource.salary.add_import_title')} onClick={_importSalary}>
                  {translate('human_resource.salary.add_import')}
                </a>
              </li>
            </ul>
          </div>
          {/* Nút xuất báo cáo */}
          <ExportExcel
            id='export-salary'
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
              items={list.map((u, i) => {
                return { value: u._id, text: u.name }
              })}
              onChange={handleUnitChange}
            ></SelectMulti>
          </div>
          {/* Tháng */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('human_resource.month')}</label>
            <DatePicker id='month' dateFormat='month-year' value={formatDate(Date.now(), true)} onChange={handleMonthChange} />
          </div>
        </div>

        <div className='form-inline'>
          {/* Mã số nhân viên */}
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

        <table id={tableId} className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th>{translate('human_resource.staff_number')}</th>
              <th>{translate('human_resource.staff_name')}</th>
              <th>{translate('human_resource.month')}</th>
              <th>{translate('human_resource.salary.table.total_salary')}</th>
              <th>{translate('human_resource.unit')}</th>
              <th style={{ width: '120px', textAlign: 'center' }}>
                {translate('human_resource.salary.table.action')}
                <DataTableSetting
                  tableId={tableId}
                  columnArr={[
                    translate('human_resource.staff_number'),
                    translate('human_resource.staff_name'),
                    translate('human_resource.month'),
                    translate('human_resource.salary.table.total_salary'),
                    translate('human_resource.unit')
                  ]}
                  setLimit={setLimit}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {listSalarys &&
              listSalarys.length !== 0 &&
              listSalarys.map((x, index) => {
                let total = x.mainSalary ? parseInt(x.mainSalary) : 0
                if (x.bonus && x.bonus.length !== 0) {
                  for (let count in x.bonus) {
                    total = total + parseInt(x.bonus[count].number)
                  }
                }
                let organizationalUnit = list.find((y) => y._id === x.organizationalUnit)
                return (
                  <tr key={index}>
                    <td>
                      <a style={{ cursor: 'pointer' }} onClick={() => handleView(x.employee)}>
                        {x.employee ? x.employee.employeeNumber : null}
                      </a>
                    </td>
                    <td>{x.employee ? x.employee.fullName : null}</td>
                    <td>{formatDate(x.month, true)}</td>
                    <td>
                      {formater.format(total)} {x.unit}
                    </td>
                    <td>{organizationalUnit ? organizationalUnit.name : ''}</td>
                    <td style={{ textAlign: 'center' }}>
                      <a
                        onClick={() => handleEdit(x)}
                        className='edit text-yellow'
                        style={{ width: '5px' }}
                        title={translate('human_resource.salary.edit_salary')}
                      >
                        <i className='material-icons'>edit</i>
                      </a>
                      <DeleteNotification
                        content={translate('human_resource.salary.delete_salary')}
                        data={{
                          id: x._id,
                          info: x.employee.employeeNumber + '- ' + translate('human_resource.month') + ': ' + formatDate(x.month, true)
                        }}
                        func={deleteSalary}
                      />
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>

        {salary.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (!listSalarys || listSalarys.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}
        <PaginateBar pageTotal={pageTotal} currentPage={currentPage} func={setPage} />
      </div>

      {/* Form thêm thông tin bảng lương bằng tay */}
      <SalaryCreateForm />

      {/* Form Thêm thông tin bảng lương bằng import file */}
      {importSalary && <SalaryImportForm />}

      {
        /* Form chỉnh sửa thông tin bảng lương */
        currentRow && (
          <SalaryEditForm
            _id={currentRow._id}
            unit={currentRow.unit}
            employeeNumber={currentRow.employee ? currentRow.employee.employeeNumber : null}
            month={formatDate(currentRow.month, true)}
            mainSalary={currentRow.mainSalary}
            bonus={currentRow.bonus}
          />
        )
      }
      {/* From xem thông tin nhân viên */ <EmployeeViewForm _id={currentRowView ? currentRowView._id : ''} />}
    </div>
  )
}

function mapState(state) {
  const { salary, department } = state
  return { salary, department }
}

const actionCreators = {
  searchSalary: SalaryActions.searchSalary,
  deleteSalary: SalaryActions.deleteSalary,
  getDepartment: DepartmentActions.get
}

const connectedListSalary = connect(mapState, actionCreators)(withTranslate(SalaryManagement))
export { connectedListSalary as SalaryManagement }
