import React, { Component, Fragment, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { taskManagementActions } from '../../task-management/redux/actions'
import { DatePicker, SelectMulti, SelectBox } from '../../../../common-components'
import { convertTime } from '../../../../helpers/stringMethod'
import { PaginateBar, DataTableSetting, ExportExcel } from '../../../../common-components/index'
import NumberFormat from 'react-number-format'
import parse from 'html-react-parser'

function EmployeeTimeSheetLogTable(props) {
  const { department } = props

  const childOrganizationalUnit = department.list.map((x) => ({ id: x._id, name: x.name }))
  let allUnit = childOrganizationalUnit.map((x) => x.id) // Danh sách các đơn vị trong công ty
  let arrayUnitShow = useRef([])

  useEffect(() => {
    let d = new Date(),
      month = d.getMonth() + 1,
      year = d.getFullYear()
    arrayUnitShow.current = allUnit
    if (allUnit.length > 0) {
      // Kiểm tra đã lấy được danh sách đơn vị chưa, nếu chưa lấy được thì chưa gửi request
      props.getAllUserTimeSheet(month, year, rowLimit.current, 1, 0, arrayUnitShow.current, sortType.current)
    }
  }, [JSON.stringify(allUnit)])

  let d = new Date(),
    month = d.getMonth() + 1,
    year = d.getFullYear()
  let endMonth = month < 10 ? '0' + month : '' + month
  endMonth = [endMonth, year].join('-')

  const { tasks, translate } = props

  let { allTimeSheetLogs } = tasks // Thống kê bấm giờ

  let monthTimeSheetLog = useRef(endMonth),
    rowLimit = useRef(15),
    page = useRef(1),
    timeLimit = useRef(0),
    sortType = useRef(['0'])

  let dataExport = {
    fileName: `${'Thống kê công việc nhân viên tháng'} ${monthTimeSheetLog.current}`,
    dataSheets: [
      {
        sheetTitle: `${'Thống kê công việc nhân viên tháng'} ${monthTimeSheetLog.current}`,
        sheetName: `${monthTimeSheetLog.current}`,
        sheetTitleWidth: 11,
        tables: [
          {
            columns: [
              { key: 'STT', value: 'STT', width: 7 },
              { key: 'name', value: 'Họ và tên', width: 30, horizontal: 'left' },
              { key: 'countResponsibleTasks', value: 'Số CV thực hiện', width: 15 },
              { key: 'countAccountableTasks', value: 'Số CV phê duyệt', width: 15 },
              { key: 'countInformedTasks', value: 'Số CV quan sát', width: 15 },
              { key: 'countConsultedTasks', value: 'Số CV tư vấn', width: 15 },
              { key: 'totalTasks', value: 'Tổng số CV', width: 15 },
              { key: 'totalDuration_1', value: 'Bấm giờ', width: 15 },
              { key: 'totalDuration_2', value: 'Bấm hẹn giờ', width: 15 },
              { key: 'totalDuration_3', value: 'Bấm bù giờ', width: 15 },
              { key: 'totalDuration', value: 'Tổng thời gian', width: 15 }
            ],
            data: allTimeSheetLogs?.docs?.map((tsl, index) => ({
              STT: index + 1,
              name: tsl.name ? tsl.name : '...',
              countResponsibleTasks: tsl.countResponsibleTasks,
              countAccountableTasks: tsl.countAccountableTasks,
              countInformedTasks: tsl.countInformedTasks,
              countConsultedTasks: tsl.countConsultedTasks,
              totalTasks: tsl.totalTasks,
              totalDuration_1: convertTime(tsl.totalDuration[1]),
              totalDuration_2: convertTime(tsl.totalDuration[2]),
              totalDuration_3: convertTime(tsl.totalDuration[3]),
              totalDuration: convertTime(tsl.totalDuration[1] + tsl.totalDuration[2] + tsl.totalDuration[3])
            }))
          }
        ]
      }
    ]
  }

  // Xử lý sự kiện thay đổi tháng
  const handleChangeMonthTimeSheetLog = (value) => {
    monthTimeSheetLog.current = value
  }

  const getUnitNameById = (id) => {
    for (let unit of childOrganizationalUnit) {
      if (unit.id === id) {
        return unit.name
      }
    }
  }

  // Xử lý sự kiện thay đổi giới hạn mốc thời gian bấm giờ
  const handleChangeTimeLimit = (value) => {
    timeLimit.current = value.floatValue
  }

  // Xử lý sự kiện thay đổi đơn vị
  const handleSelectOrganizationalUnit = (value) => {
    arrayUnitShow.current = value
  }

  const handleChangeSortType = (value) => {
    sortType.current = value
  }

  // Lấy dữ liệu theo tháng được chọn
  const getAllUserTimeSheetLogs = () => {
    if (monthTimeSheetLog) {
      let d = monthTimeSheetLog.current.split('-')
      let month = d[0]
      let year = d[1]
      props.getAllUserTimeSheet(month, year, rowLimit.current, page.current, timeLimit.current, arrayUnitShow.current, sortType.current)
    }
  }

  // Lấy dữ liệu tại trang được chọn
  const handlePaginationAllTimeSheetLogs = (pageIndex) => {
    if (monthTimeSheetLog) {
      let d = monthTimeSheetLog.current.split('-')
      let month = d[0]
      let year = d[1]
      page.current = pageIndex
      props.getAllUserTimeSheet(month, year, rowLimit.current, page.current, timeLimit.current, arrayUnitShow.current, sortType.current)
    }
  }

  // Giới hạn số lượng cột, mỗi khi chọn sẽ reset về trang 1
  const setRowLimit = (limitValue) => {
    if (monthTimeSheetLog) {
      let d = monthTimeSheetLog.current.split('-')
      let month = d[0]
      let year = d[1]
      page.current = 1
      rowLimit.current = limitValue
      props.getAllUserTimeSheet(month, year, rowLimit.current, page.current, timeLimit.current, arrayUnitShow.current, sortType.current)
    }
  }

  return (
    <React.Fragment>
      {/* Thống kê bấm giờ theo tháng */}
      <div className='row'>
        <div className='col-xs-12 col-md-12'>
          <div className='box box-primary'>
            <div className='box-body qlcv'>
              <div className='form-inline'>
                {/* Seach theo thời gian */}
                <div className='form-group'>
                  <label style={{ width: 'auto' }}>Tháng</label>
                  <DatePicker
                    id='month-time-sheet-log'
                    dateFormat='month-year'
                    value={monthTimeSheetLog.current}
                    onChange={handleChangeMonthTimeSheetLog}
                    disabled={false}
                  />
                </div>
                {/* Chọn đơn vị */}
                <div className='form-group'>
                  <label style={{ width: 'auto' }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                  <SelectMulti
                    id='multiSelectOrganizationalUnitInDashboardUnit'
                    items={childOrganizationalUnit.map((item) => {
                      return { value: item.id, text: item.name }
                    })}
                    options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                    onChange={handleSelectOrganizationalUnit}
                    value={arrayUnitShow ? arrayUnitShow.current : []}
                  />
                </div>
                {/* Thời gian bấm giờ tối thiểu */}
                <div className='form-group'>
                  <label style={{ width: 'auto' }}>Thời gian tối thiểu</label>
                  <NumberFormat
                    className='form-control'
                    value={timeLimit.current}
                    displayType={'input'}
                    suffix={' giờ'}
                    onValueChange={handleChangeTimeLimit}
                  />
                </div>
                {/* Chọn kiểu sắp xếp */}
                <div className='form-group'>
                  <label style={{ width: 'auto' }}>Sắp xếp thời gian</label>
                  <SelectBox
                    id='SelectTimesheetLogSortType'
                    className='form-control select'
                    items={[
                      { value: 0, text: 'Không sắp xếp' },
                      { value: 1, text: 'Tăng dần' },
                      { value: 2, text: 'Giảm dần' }
                    ]}
                    multiple={false}
                    value={sortType.current}
                    onChange={handleChangeSortType}
                    options={{ minimumResultsForSearch: 4 }}
                  />
                </div>
                <button className='btn btn-primary' onClick={getAllUserTimeSheetLogs}>
                  Thống kê
                </button>
                <ExportExcel id='export-excel' style={{ right: 0 }} exportData={dataExport} />
              </div>
            </div>
            <div className='box-body qlcv'>
              <DataTableSetting
                tableId={'all-time-sheet-logs'}
                setLimit={setRowLimit}
                columnArr={[
                  'STT',
                  'Họ và tên',
                  'Số CV thực hiện',
                  'Số CV phê duyệt',
                  'Số CV quan sát',
                  'Số CV tư vấn',
                  'Tổng số CV',
                  'Tổng thời gian',
                  'Bấm giờ',
                  'Bấm hẹn giờ',
                  'Bấm bù giờ'
                ]}
                hiddenColumns={[9, 10, 11]}
              />
            </div>
            <div className='box-body qlcv'>
              <table className='table table-hover table-striped table-bordered' id='all-time-sheet-logs'>
                <colgroup>
                  <col span={'1'} style={{ textAlign: 'center' }}></col>
                  <col span={'1'} style={{ width: '180px' }}></col>
                  <col span={'1'} style={{ textAlign: 'center' }}></col>
                  <col span={'1'} style={{ textAlign: 'center' }}></col>
                  <col span={'1'} style={{ textAlign: 'center' }}></col>
                  <col span={'1'} style={{ textAlign: 'center' }}></col>
                  <col span={'1'} style={{ textAlign: 'center' }}></col>
                  <col span={'1'} style={{ width: '250px', textAlign: 'center' }}></col>
                  <col span={'1'} style={{ textAlign: 'center' }}></col>
                  <col span={'1'} style={{ textAlign: 'center' }}></col>
                  <col span={'1'} style={{ textAlign: 'center' }}></col>
                </colgroup>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Họ và tên</th>
                    <th>Số CV thực hiện</th>
                    <th>Số CV phê duyệt</th>
                    <th>Số CV quan sát</th>
                    <th>Số CV tư vấn</th>
                    <th>Tổng số CV</th>
                    <th>Tổng thời gian</th>
                    <th>Bấm giờ</th>
                    <th>Bấm hẹn giờ</th>
                    <th>Bấm bù giờ</th>
                  </tr>
                </thead>
                <tbody>
                  {allTimeSheetLogs?.docs?.map((tsl, index) => {
                    let str =
                      '<table style="width: 100%">' +
                      '<colgroup>' +
                      '<col span="1" style="width: 70%;">' +
                      '<col span="1" style="width: 30%;">' +
                      '</colgroup>' +
                      '<tbody>'
                    for (let unit of tsl.unitDuration) {
                      str +=
                        '<tr>' + '<td>' + getUnitNameById(unit.name) + '</td>' + '<td><a>' + convertTime(unit.value) + '</a></td>' + '</tr>'
                    }
                    str +=
                      '<tr>' +
                      '<td><a class="save_result">Tổng</a></td>' +
                      '<td><a>' +
                      convertTime(tsl.totalDuration[1] + tsl.totalDuration[2] + tsl.totalDuration[3]) +
                      '</a></td>' +
                      '</tr>'
                    str += '</tbody></table>'
                    return (
                      <tr key={index}>
                        <td style={{ textAlign: 'center' }}>{index + 1}</td>
                        <td>
                          <a>{tsl.name}</a>
                        </td>
                        <td style={{ textAlign: 'center' }}>{tsl.countResponsibleTasks}</td>
                        <td style={{ textAlign: 'center' }}>{tsl.countAccountableTasks}</td>
                        <td style={{ textAlign: 'center' }}>{tsl.countInformedTasks}</td>
                        <td style={{ textAlign: 'center' }}>{tsl.countConsultedTasks}</td>
                        <td style={{ textAlign: 'center' }}>{tsl.totalTasks}</td>
                        <td style={{ whiteSpace: 'pre-wrap' }} className='col-sort'>
                          {parse(str)}
                        </td>
                        <td style={{ textAlign: 'center' }}>{convertTime(tsl.totalDuration[1])}</td>
                        <td style={{ textAlign: 'center' }}>{convertTime(tsl.totalDuration[2])}</td>
                        <td style={{ textAlign: 'center' }}>{convertTime(tsl.totalDuration[3])}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <PaginateBar
                display={allTimeSheetLogs ? allTimeSheetLogs?.docs?.length : 0}
                total={allTimeSheetLogs ? allTimeSheetLogs.totalDocs : 0}
                pageTotal={allTimeSheetLogs ? allTimeSheetLogs.totalPages : 0}
                currentPage={allTimeSheetLogs ? allTimeSheetLogs.page : 1}
                func={handlePaginationAllTimeSheetLogs}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { tasks, department } = state
  return { tasks, department }
}
const actionCreators = {
  getAllUserTimeSheet: taskManagementActions.getAllUserTimeSheet
}

export default connect(mapState, actionCreators)(withTranslate(EmployeeTimeSheetLogTable))
