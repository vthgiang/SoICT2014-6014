import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import Swal from 'sweetalert2'
import parse from 'html-react-parser'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { RoleActions } from '../../../super-admin/role/redux/actions'
import { taskTemplateActions } from '../redux/actions'
import { PaginateBar, SelectMulti, DataTableSetting, ExportExcel } from '../../../../common-components'
import ModalAddTaskTemplate from './addTaskTemplateModal'
import { ModalViewTaskTemplate } from './viewTaskTemplateModal'
import { ModalEditTaskTemplate } from './editTaskTemplateModal'
import { TaskTemplateImportForm } from './taskTemplateImportForm'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import './tasktemplate.css'

class TaskTemplate extends Component {
  constructor(props) {
    super(props)
    const tableId = 'table-task-template'
    const defaultConfig = { limit: 10 }
    const { limit } = getTableConfiguration(tableId, defaultConfig)

    this.state = {
      status: 'start',
      currentPage: 1,
      perPage: limit,
      unit: [],
      name: '',
      currentRole: localStorage.getItem('currentRole'),
      tableId
    }
  }

  componentDidMount() {
    const { currentPage, perPage, unit, name, currentRole } = this.state
    this.props.getDepartment()
    this.props.getTaskTemplateByUser(currentPage, perPage, unit, name)
    this.props.show(currentRole)
  }

  render() {
    const { translate, tasktemplates, user } = this.props
    const { currentPage, currentEditRow, currentViewRow, currentEditRowId, tableId } = this.state

    let listTaskTemplates
    let pageTotal
    let units = []
    let currentUnit

    if (tasktemplates.pageTotal) {
      pageTotal = tasktemplates.pageTotal
    }
    if (user.organizationalUnitsOfUser) {
      units = user.organizationalUnitsOfUser
      currentUnit = units.filter(
        (item) =>
          item.managers.includes(localStorage.getItem('currentRole')) ||
          item.deputyManagers.includes(localStorage.getItem('currentRole')) ||
          item.employees.includes(localStorage.getItem('currentRole'))
      )
    }

    if (tasktemplates.items) {
      listTaskTemplates = tasktemplates.items
    }
    let list = []
    if (tasktemplates.isLoading === false) {
      list = tasktemplates.items
    }
    const exportData = this.convertDataToExportData(list)

    return (
      <div className='box'>
        <div className='box-body qlcv' id='table-task-template'>
          {currentViewRow && <ModalViewTaskTemplate taskTemplateId={currentViewRow} />}
          {currentEditRow && <ModalEditTaskTemplate taskTemplate={currentEditRow} taskTemplateId={currentEditRowId} />}

          <TaskTemplateImportForm />
          <ExportExcel id='export-taskTemplate' exportData={exportData} style={{ marginLeft: 5 }} />
          {/** Kiểm tra xem role hiện tại có quyền thêm mới mẫu công việc không(chỉ trưởng đơn vị) */}
          {this.checkHasComponent('create-task-template-button') && (
            <>
              <ModalAddTaskTemplate />
              <div className='form-inline'>
                <div className='dropdown pull-right' style={{ marginBottom: 15 }}>
                  <button
                    type='button'
                    className='btn btn-success dropdown-toggler pull-right'
                    data-toggle='dropdown'
                    aria-expanded='true'
                    title='Thêm'
                  >
                    {translate('task_template.add')}
                  </button>
                  <ul className='dropdown-menu pull-right'>
                    <li>
                      <a
                        href='#modal-add-task-template'
                        title='ImportForm'
                        onClick={(event) => {
                          this.handleAddTaskTemplate(event)
                        }}
                      >
                        {translate('task_template.add')}
                      </a>
                    </li>
                    <li>
                      <a
                        href='#modal_import_file'
                        title='Import file excell'
                        onClick={(event) => {
                          this.handImportFile(event)
                        }}
                      >
                        {translate('task_template.import')}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/** Các ô input để nhập điều kiện tìm mẫu công việc */}
          <div className='form-inline'>
            <div className='form-group'>
              <label className='form-control-static'>{translate('task_template.name')}</label>
              <input
                className='form-control'
                type='text'
                placeholder={translate('task_template.search_by_name')}
                onChange={this.handleChangeTaskTemplateName}
              />
            </div>
          </div>

          <div className='form-inline'>
            <div className='form-group'>
              <label className='form-control-static'>{translate('task_template.unit')}</label>
              {units && (
                <SelectMulti
                  id='multiSelectUnit'
                  defaultValue={units.map((item) => {
                    return item._id
                  })}
                  items={units.map((item) => {
                    return { value: item._id, text: item.name }
                  })}
                  options={{
                    nonSelectedText: translate('task_template.select_all_units'),
                    allSelectedText: translate(`task.task_management.select_all_department`)
                  }}
                />
              )}
              <button type='button' className='btn btn-success' title='Tìm tiếm mẫu công việc' onClick={this.handleUpdateData}>
                {translate('task_template.search')}
              </button>
            </div>
          </div>

          <DataTableSetting
            tableId={tableId}
            columnArr={['Tên mẫu công việc', 'Mô tả', 'Số lần sử dụng', 'Người tạo mẫu', 'Đơn vị']}
            setLimit={this.setLimit}
          />

          {/** Table chứa các mẫu công việc trong 1 trang */}
          <table className='table table-bordered table-striped table-hover' id={tableId}>
            <thead>
              <tr>
                <th title={translate('task_template.tasktemplate_name')}>{translate('task_template.tasktemplate_name')}</th>
                <th title={translate('task_template.description')}>{translate('task_template.description')}</th>
                <th title={translate('task_template.count')}>{translate('task_template.count')}</th>
                <th title={translate('task_template.creator')}>{translate('task_template.creator')}</th>
                <th title={translate('task_template.unit')}>{translate('task_template.unit')}</th>
                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
              </tr>
            </thead>
            <tbody className='task-table'>
              {typeof listTaskTemplates !== 'undefined' && listTaskTemplates.length !== 0
                ? listTaskTemplates.map(
                    (item) =>
                      item && (
                        <tr key={item?._id}>
                          <td title={item?.name}>{item?.name}</td>
                          <td title={item?.description}>{parse(item?.description ? item.description : '')}</td>
                          <td title={item?.numberOfUse}>{item?.numberOfUse}</td>
                          <td title={item?.creator?.name}>
                            {item?.creator?.name ? item.creator.name : translate('task.task_template.error_task_template_creator_null')}
                          </td>
                          <td title={item?.organizationalUnit?.name}>
                            {item?.organizationalUnit?.name
                              ? item.organizationalUnit.name
                              : translate('task_template.error_task_template_organizational_unit_null')}
                          </td>
                          <td>
                            <a
                              href='#abc'
                              onClick={() => this.handleView(item?._id)}
                              title={translate('task.task_template.view_detail_of_this_task_template')}
                            >
                              <i className='material-icons'>view_list</i>
                            </a>

                            {/** Check quyền xem có được xóa hay sửa mẫu công việc không */}
                            {this.checkPermisson(item?.organizationalUnit?.managers, item?.creator?._id) && (
                              <>
                                <a
                                  href="cursor:{'pointer'}"
                                  onClick={() => this.handleEdit(item)}
                                  className='edit'
                                  title={translate('task_template.edit_this_task_template')}
                                >
                                  <i className='material-icons'>edit</i>
                                </a>
                                <a
                                  href="cursor:{'pointer'}"
                                  onClick={() => this.handleDelete(item?._id, item?.numberOfUse)}
                                  className='delete'
                                  title={translate('task_template.delete_this_task_template')}
                                >
                                  <i className='material-icons'></i>
                                </a>
                              </>
                            )}
                          </td>
                        </tr>
                      )
                  )
                : null}
            </tbody>
          </table>
          {listTaskTemplates && listTaskTemplates.length === 0 && <div className='table-info-panel'>{translate('confirm.no_data')}</div>}
          <PaginateBar pageTotal={pageTotal} currentPage={currentPage} func={this.setPage} />
        </div>
      </div>
    )
  }

  getPriority = (value) => {
    const priority = Number(value)
    const { translate } = this.props
    switch (priority) {
      case 1:
        return translate('task.task_management.low')
      case 2:
        return translate('task.task_management.average')
      case 3:
        return translate('task.task_management.standard')
      case 4:
        return translate('task.task_management.high')
      case 5:
        return translate('task.task_management.urgent')
      default:
        return ''
    }
  }

  handleChangeTaskTemplateName = (e) => {
    const { value } = e.target
    this.setState({
      name: value
    })
  }

  /** Cập nhật số dòng trên một trang hiển thị */
  setLimit = (limit) => {
    const { perPage, unit, name } = this.state
    if (limit !== perPage) {
      this.setState({
        perPage: limit,
        currentPage: 1
      })
      this.props.getTaskTemplateByUser(1, limit, unit, name)
    }
  }

  myFunction = () => {
    let input
    let filter
    let table
    let tr
    let td
    let i
    let txtValue
    input = document.getElementById('myInput')
    filter = input.value.toLowerCase()
    table = document.getElementById('myTable')
    tr = table.getElementsByTagName('tr')
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('td')[0]
      if (td) {
        txtValue = td.textContent || td.innerText
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
          tr[i].style.display = ''
        } else {
          tr[i].style.display = 'none'
        }
      }
    }
  }

  /** Khi người dùng chuyển trang, update data của trang mới đó */
  handleGetDataPagination = async (number) => {
    const { currentPage, perPage, name } = this.state
    const units = window.$('#multiSelectUnit').val()
    if (currentPage !== number) {
      this.setState({
        currentPage: number
      })
      this.props.getTaskTemplateByUser(number, perPage, units, name)
    }
  }

  /** Khi có hành động thay đổi data(thêm sửa xóa 1 mẫu công việc...), Hiển thị dữ liệu về trang 1 */
  handleUpdateData = () => {
    const { perPage, name } = this.state
    const units = window.$('#multiSelectUnit').val()
    this.setState({
      currentPage: 1
    })
    this.props.getTaskTemplateByUser(1, perPage, units, name)
  }

  /** Xoa tasktemplate theo id */
  handleDelete = (id, numberOfUse) => {
    const { translate } = this.props
    if (numberOfUse === 0) {
      Swal.fire({
        title: translate('task_template.confirm_title'),
        type: 'success',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('task_template.confirm')
      }).then((res) => {
        if (res.value) {
          this.props.deleteTaskTemplateById(id)

          const test = window.$('#multiSelectUnit').val()
          this.props.getTaskTemplateByUser(this.state.currentPage, this.state.perPage, test, '')
        }
      })
    } else {
      Swal.fire({
        title: translate('task_template.error_title'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('task_template.confirm')
      })
    }
  }

  checkPermisson = (managerCurrentUnit, creatorId) => {
    if (!managerCurrentUnit || !creatorId) return false
    const currentRole = localStorage.getItem('currentRole')
    for (const i in managerCurrentUnit) {
      if (currentRole === managerCurrentUnit[i]) {
        return true
      }
    }
    if (creatorId === localStorage.getItem('userId')) {
      return true
    }
    return false
  }

  checkHasComponent = (name) => {
    const { auth } = this.props
    let result = false
    auth.components.forEach((component) => {
      if (component.name === name) result = true
    })
    return result
  }

  /** Hiển thị số thứ tự của trang đang xem ở paginate bar */
  setPage = async (number) => {
    const { currentPage, perPage, name } = this.state
    const units = window.$('#multiSelectUnit').val()
    if (currentPage !== number) {
      this.setState({
        currentPage: number
      })
      this.props.getTaskTemplateByUser(number, perPage, units, name)
    }
  }

  /** Mở modal xem thông tin chi tiết 1 mẫu công việc */
  handleView = async (taskTemplateId) => {
    await this.setState({
      currentViewRow: taskTemplateId
    })
    window.$('#modal-view-tasktemplate').modal('show')
  }

  /** Mở modal chỉnh sửa 1 mẫu công việc */
  handleEdit = async (taskTemplate) => {
    await this.setState({
      currentEditRow: taskTemplate,
      currentEditRowId: taskTemplate._id
    })
    window.$('#modal-edit-task-template').modal('show')
  }

  /** Mở modal import file excel */
  handImportFile = (event) => {
    event.preventDefault()
    window.$('#modal_import_file').modal('show')
  }

  /** Mở modal thêm mới 1 mẫu công việc */
  handleAddTaskTemplate = (event) => {
    event.preventDefault()
    window.$('#modal-add-task-template-undefined').modal('show')
  }

  // Function chyển đổi dữ liệu mẫu công việc thành dạng dữ liệu dùng export
  convertDataToExportData = (data) => {
    let datas = []
    if (data) {
      for (let k = 0; k < data.length; k++) {
        const { auth, role } = this.props
        let annunciator
        const x = data[k]
        let length = 0
        const actionName = []
        const actionDescription = []
        const mandatory = []

        if (!role.isLoading && !auth.isLoading) {
          annunciator = auth.user.name + role.item ? ` - ${role.item.name}` : ''
        }
        if (x.taskActions) {
          if (x.taskActions.length > length) {
            length = x.taskActions.length
          }
          for (let i = 0; i < x.taskActions.length; i++) {
            actionName[i] = x.taskActions[i].name
            actionDescription[i] = x.taskActions[i].description
            if (x.taskActions[i].mandatory) {
              mandatory[i] = 'Bắt buộc'
            } else {
              mandatory[i] = 'Không bắt buộc'
            }
          }
        }
        const infomationName = []
        const type = []
        const infomationDescription = []
        const filledByAccountableEmployeesOnly = []
        if (x.taskInformations) {
          if (x.taskInformations.length > length) {
            length = x.taskInformations.length
          }
          for (let i = 0; i < x.taskInformations.length; i++) {
            infomationName[i] = x.taskInformations[i].name
            infomationDescription[i] = x.taskInformations[i].description
            type[i] = x.taskInformations[i].type
            if (x.taskInformations[i].filledByAccountableEmployeesOnly) {
              filledByAccountableEmployeesOnly[i] = 'true'
            } else {
              filledByAccountableEmployeesOnly[i] = 'false'
            }
          }
        }
        let numberOfUse = 0
        if (x.numberOfUse !== 0) {
          numberOfUse = x.numberOfUse
        }
        let collaboratedWithOrganizationalUnits = []
        let readByEmployees = []
        let responsibleEmployees = []
        let accountableEmployees = []
        let consultedEmployees = []
        let informedEmployees = []

        if (x.readByEmployees && x.readByEmployees[0]) {
          readByEmployees = x.readByEmployees.map((item) => item.name)
          if (length < readByEmployees.length) {
            length = readByEmployees.length
          }
        }
        if (x.collaboratedWithOrganizationalUnits && x.collaboratedWithOrganizationalUnits[0]) {
          collaboratedWithOrganizationalUnits = x.collaboratedWithOrganizationalUnits.map((item) => item.name)
          if (length < collaboratedWithOrganizationalUnits.length) {
            length = collaboratedWithOrganizationalUnits.length
          }
        }
        if (x.responsibleEmployees && x.responsibleEmployees[0]) {
          responsibleEmployees = x.responsibleEmployees.map((item) => item.email)
        }
        if (x.accountableEmployees && x.accountableEmployees[0]) {
          accountableEmployees = x.accountableEmployees.map((item) => item.email)
        }
        if (x.consultedEmployees && x.consultedEmployees[0]) {
          consultedEmployees = x.consultedEmployees.map((item) => item.email)
        }
        if (x.informedEmployees && x.informedEmployees[0]) {
          informedEmployees = x.informedEmployees.map((item) => item.email)
        }

        let out = {
          STT: k + 1,
          name: x.name,
          description: x.description,
          numberOfUse,
          readByEmployees: readByEmployees[0],
          responsibleEmployees: responsibleEmployees.join(', '),
          accountableEmployees: accountableEmployees.join(', '),
          consultedEmployees: consultedEmployees.join(', '),
          informedEmployees: informedEmployees.join(', '),
          organizationalUnits: x.organizationalUnit && x.organizationalUnit.name,
          collaboratedWithOrganizationalUnits: collaboratedWithOrganizationalUnits[0],
          creator: x.creator && x.creator.email,
          annunciator,
          priority: this.getPriority(x.priority),
          formula: x.formula,
          actionName: actionName[0],
          actionDescription: actionDescription[0],
          mandatory: mandatory[0],
          infomationName: infomationName[0],
          infomationDescription: infomationDescription[0],
          type: type[0],
          filledByAccountableEmployeesOnly: filledByAccountableEmployeesOnly[0]
        }
        datas = [...datas, out]
        if (length > 1) {
          for (let i = 1; i < length; i++) {
            out = {
              STT: '',
              name: '',
              description: '',
              numberOfUse: '',
              readByEmployees: readByEmployees[i],
              responsibleEmployees: '',
              accountableEmployees: '',
              consultedEmployees: '',
              informedEmployees: '',
              organizationalUnits: '',
              collaboratedWithOrganizationalUnits: collaboratedWithOrganizationalUnits[i],
              creator: '',
              annunciator: '',
              priority: '',
              formula: '',
              actionName: actionName[i],
              actionDescription: actionDescription[i],
              mandatory: mandatory[i],
              infomationName: infomationName[i],
              infomationDescription: infomationDescription[i],
              type: type[i],
              filledByAccountableEmployeesOnly: filledByAccountableEmployeesOnly[i]
            }
            datas = [...datas, out]
          }
        }
      }
    }

    const exportData = {
      fileName: 'Bảng thống kê mẫu công việc',
      dataSheets: [
        {
          sheetName: 'sheet1',
          sheetTitle: 'Danh sách mẫu công việc',
          tables: [
            {
              merges: [
                {
                  key: 'taskActions',
                  columnName: 'Danh sách hoạt động',
                  keyMerge: 'actionName',
                  colspan: 3
                },
                {
                  key: 'taskInfomations',
                  columnName: 'Danh sách thông tin',
                  keyMerge: 'infomationName',
                  colspan: 4
                }
              ],
              rowHeader: 2,
              columns: [
                { key: 'STT', value: 'STT' },
                { key: 'name', value: 'Tên mẫu' },
                { key: 'description', value: 'Mô tả' },
                { key: 'organizationalUnits', value: 'Đơn vị' },
                { key: 'collaboratedWithOrganizationalUnits', value: 'Đơn vị phối hợp thực hiện công việc' },
                { key: 'numberOfUse', value: 'Số lần sử dụng' },
                { key: 'creator', value: 'Người tạo mẫu' },
                { key: 'annunciator', value: 'Người xuất báo cáo' },
                { key: 'readByEmployees', value: 'Người được xem' },
                { key: 'priority', value: 'Độ ưu tiên' },
                { key: 'responsibleEmployees', value: 'Người thực hiện' },
                { key: 'accountableEmployees', value: 'Người phê duyệt' },
                { key: 'consultedEmployees', value: 'Người tư vấn' },
                { key: 'informedEmployees', value: 'Người quan sát' },
                { key: 'formula', value: 'Công thức tính điểm' },
                { key: 'actionName', value: 'Tên hoạt động' },
                { key: 'actionDescription', value: 'Mô tả hoạt động' },
                { key: 'mandatory', value: 'Bắt buộc' },
                { key: 'infomationName', value: 'Tên thông tin' },
                { key: 'infomationDescription', value: 'Mô tả thông tin' },
                { key: 'type', value: 'Kiểu dữ liệu' },
                { key: 'filledByAccountableEmployeesOnly', value: 'Chỉ quản lý được điền' }
              ],
              data: datas
            }
          ]
        }
      ]
    }
    return exportData
  }
}

function mapState(state) {
  const { tasktemplates, user, auth, role } = state
  return { tasktemplates, user, auth, role }
}

const actionCreators = {
  getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,
  getDepartment: UserActions.getDepartmentOfUser,
  deleteTaskTemplateById: taskTemplateActions.deleteTaskTemplateById,
  show: RoleActions.show
}
export default connect(mapState, actionCreators)(withTranslate(TaskTemplate))
