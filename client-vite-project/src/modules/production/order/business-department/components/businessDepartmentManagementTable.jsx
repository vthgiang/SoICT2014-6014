import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { BusinessDepartmentActions } from '../redux/actions'
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions'
import { RoleActions } from '../../../../super-admin/role/redux/actions'
import { DataTableSetting, PaginateBar, SelectBox } from '../../../../../common-components'
import BusinessDepartmentCreateForm from './businessDepartmentCreateForm'
import BusinessDepartmentEditForm from './businessDepartmentEditForm'
import BusinessDepartmentDetailForm from './businessDepartmentDetailForm'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
class BusinessDepartmentManagementTable extends Component {
  constructor(props) {
    super(props)
    const tableId = 'business-department-manager-table'
    const defaultConfig = { limit: 5 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit

    this.state = {
      page: 1,
      limit: limit,
      role: '',
      tableId
    }
  }

  componentDidMount = () => {
    const { page, limit } = this.state
    this.props.getAllBusinessDepartments({ page, limit })
    this.props.getAllDepartments()
  }

  setPage = async (page) => {
    await this.setState({
      page: page
    })
    const data = {
      limit: this.state.limit,
      page: page
    }
    this.props.getAllBusinessDepartments(data)
  }

  setLimit = async (limit) => {
    await this.setState({
      limit: limit
    })
    const data = {
      limit: limit,
      page: this.state.page
    }
    this.props.getAllBusinessDepartments(data)
  }

  handleRoleChange = (value) => {
    if (value[0] !== 'title') {
      this.setState({
        role: value[0]
      })
    }
  }

  handleSubmitSearch = async () => {
    await this.setState({
      page: 1
    })
    let { page, limit, role } = this.state
    if (role === 'all') {
      role = ''
    }
    const data = {
      page,
      limit,
      role
    }
    this.props.getAllBusinessDepartments(data)
  }

  handleShowDetailBusinessDepartment = async (businessDepartmentDetail) => {
    await this.setState((state) => {
      return {
        ...state,
        businessDepartmentDetail
      }
    })
    window.$('#modal-detail-business-department').modal('show')
  }

  handleEditBusinessDepartment = async (businessDepartment) => {
    await this.setState((state) => {
      return {
        ...state,
        businessDepartmentEdit: businessDepartment
      }
    })
    window.$('#modal-edit-business-department').modal('show')
  }

  getManagerName = (organizationalUnit) => {
    let managers = organizationalUnit.managers ? organizationalUnit.managers : {}
    if (managers && managers.length && managers[0].users && managers[0].users.length && managers[0].users[0].userId) {
      let { userId } = managers[0].users[0]
      if (userId.name) {
        return userId.name
      } else {
        return '---'
      }
    }
    return '---'
  }

  render() {
    const { translate } = this.props
    const { businessDepartments } = this.props
    const { totalPages, page } = businessDepartments
    let { businessDepartmentEdit, businessDepartmentDetail, role, tableId } = this.state
    let listBusinessDepartments = []
    if (businessDepartments.isLoading === false) {
      listBusinessDepartments = businessDepartments.listBusinessDepartments
    }

    const roleConvert = ['title', 'Kinh doanh', 'Quản lý bán hàng', 'Kế toán']
    return (
      <React.Fragment>
        {businessDepartmentEdit && <BusinessDepartmentEditForm businessDepartmentEdit={businessDepartmentEdit} />}
        {businessDepartmentDetail && <BusinessDepartmentDetailForm businessDepartmentDetail={businessDepartmentDetail} />}
        <div className='box-body qlcv'>
          <BusinessDepartmentCreateForm />
          <div className='form-inline'>
            <div className='form-group'>
              <label className='form-control-static'>Vai trò</label>
              <SelectBox
                id={`select-type-for-business-department-search`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={[
                  { value: 'title', text: '---Chọn vai trò đơn vị---' },
                  { value: 'all', text: 'Chọn tất cả' },
                  { value: '1', text: 'Kinh doanh' },
                  { value: '2', text: 'Quản lý bán hàng' },
                  { value: '3', text: 'Kế toán' }
                ]}
                onChange={this.handleRoleChange}
              />
            </div>
            <div className='form-group'>
              <button type='button' className='btn btn-success' title={'Tìm phòng kinh doanh'} onClick={this.handleSubmitSearch}>
                {'Tìm kiếm'}
              </button>
            </div>
          </div>
          <table id={tableId} className='table table-striped table-bordered table-hover'>
            <thead>
              <tr>
                <th>{'STT'}</th>
                <th>{'Tên đơn vị'}</th>
                <th>{'Trưởng đơn vị'}</th>
                <th>{'Vai trò'}</th>
                <th style={{ width: '120px', textAlign: 'center' }}>
                  {translate('table.action')}
                  <DataTableSetting
                    tableId={tableId}
                    columnArr={['STT', 'Tên đơn vị', 'Trưởng đơn vị', 'Vai trò']}
                    setLimit={this.setLimit}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {listBusinessDepartments &&
                listBusinessDepartments.length !== 0 &&
                listBusinessDepartments.map((businessDepartment, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{businessDepartment.organizationalUnit ? businessDepartment.organizationalUnit.name : '---'}</td>
                    <td>{businessDepartment.organizationalUnit ? this.getManagerName(businessDepartment.organizationalUnit) : '---'}</td>
                    <td>{roleConvert[businessDepartment.role]}</td>
                    <td style={{ textAlign: 'center' }}>
                      <a
                        style={{ width: '5px' }}
                        title={'Xem chi tiết'}
                        onClick={() => {
                          this.handleShowDetailBusinessDepartment(businessDepartment)
                        }}
                      >
                        <i className='material-icons'>view_list</i>
                      </a>
                      <a
                        className='edit text-yellow'
                        style={{ width: '5px' }}
                        title={'Chỉnh sửa thông tin'}
                        onClick={() => {
                          this.handleEditBusinessDepartment(businessDepartment)
                        }}
                      >
                        <i className='material-icons'>edit</i>
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {businessDepartments.isLoading ? (
            <div className='table-info-panel'>{translate('confirm.loading')}</div>
          ) : (
            (typeof listBusinessDepartments === 'undefined' || listBusinessDepartments.length === 0) && (
              <div className='table-info-panel'>{translate('confirm.no_data')}</div>
            )
          )}
          <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={this.setPage} />
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { businessDepartments } = state
  return { businessDepartments }
}

const mapDispatchToProps = {
  getAllBusinessDepartments: BusinessDepartmentActions.getAllBusinessDepartments,
  getAllDepartments: DepartmentActions.get,
  getAllRoles: RoleActions.get
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BusinessDepartmentManagementTable))
