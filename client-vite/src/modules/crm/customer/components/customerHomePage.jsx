import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ConfirmNotification, DataTableSetting, ExportExcel, PaginateBar, SelectMulti } from '../../../../common-components'
import { getStorage } from '../../../../config'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import { UserActions } from '../../../super-admin/user/redux/actions'
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper'
import { CrmCareTypeActions } from '../../careType/redux/action'
import CreateCareCommonForm from '../../common/createCareCommonForm'
import { formatFunction } from '../../common/index'
import { CrmGroupActions } from '../../group/redux/actions'
import { CrmStatusActions } from '../../status/redux/actions'
import { CrmCustomerActions } from '../redux/actions'
import CreateForm from './createForm'
import EditForm from './editForm'
import CrmCustomerImportFile from './importFileForm'
import InfoForm from './infoForm'
function CustomerHomePage(props) {
  const tableId = 'table-manage-crm-customer'
  const defaultConfig = { limit: 10 }
  const limit = getTableConfiguration(tableId, defaultConfig).limit

  const [limitState, setLimitState] = useState(limit)
  const [page, setPageState] = useState(0)
  const [option, setOption] = useState('name')
  const [value, setValue] = useState('')
  const [tableIdState, setTableId] = useState()
  const [importCustomer, setImportCustomer] = useState()
  const [createCustomer, setCreateCustomer] = useState()
  const [customerId, setCustomerId] = useState()
  const [customerIdEdit, setCustomerIdEdit] = useState()
  const { translate, crm, user } = props

  const [state, setState] = useState({
    limit: limit,
    page: 0,
    tableId: tableId,
    roleId: getStorage('currentRole')
  })

  useEffect(() => {
    async function getData() {
      const currentRole = getStorage('currentRole')
      props.getCustomers(state)
      props.getGroups({ roleId: currentRole })
      props.getStatus({ roleId: currentRole })
      props.getCareTypes({})

      if (user && user.organizationalUnitsOfUser) {
        let getCurrentUnit = user.organizationalUnitsOfUser.find(
          (item) =>
            //item.managers[0] === currentRole
            item.managers.find((manager) => manager === currentRole) === currentRole ||
            item.deputyManagers[0] === currentRole ||
            item.employees[0] === currentRole
        )
        if (getCurrentUnit) {
          props.getChildrenOfOrganizationalUnits(getCurrentUnit._id)
        }
      }
    }
    getData()
  }, [])

  /**
   * Hàm xử lý khi click button import khách hàng
   */
  async function handleImportCustomer() {
    await setImportCustomer(true)
    window.$('#modal-customer-import').modal('show')
  }

  /**
   * Hàm xử lý khi click button thêm khách hàng bằng tay
   */
  async function handleCreateCustomer() {
    await setCreateCustomer(true)
    window.$('#modal-customer-create').modal('show')
  }

  /**
   * Hàm xử lý khi click nút xem chi tiết khách hàng
   * @param {*} id
   */
  async function handleInfo(id) {
    await setCustomerId(id)
    window.$(`#modal-crm-customer-info-${id}`).modal('show')
  }

  /**
   * Hàm xử lý khi click nút edit khách hàng
   * @param {*} id
   */
  async function handleEdit(id) {
    await setCustomerIdEdit(id)
    window.$('#modal-crm-customer-edit').modal('show')
  }
  // ham xử lý thêm hoạt động chăm sóc khách hàng
  const handleCreateCareAction = async (id) => {
    await setCustomerId(id)
    window.$('#modal-crm-care-common-create').modal('show')
  }

  // ham tim kiem
  const search = () => {
    console.log('CUSSTATE', state)
    props.getCustomers(state)
  }
  /**
   * xử lý lọc thông tin theo mã khách hàng
   */
  const handleSearchByCustomerCode = (e) => {
    const value = e.target.value
    const newState = {
      ...state,
      customerCode: value
    }
    setState(newState)
  }
  /**
   * xử lý lọc thông tin theo trạng thái
   */
  const handleSearchByStatus = (value) => {
    const newState = { ...state, customerStatus: value }
    setState(newState)
  }

  /**
   *
   * @param {*} group[]
   * Xử lý lọc thông tin theo nhóm khách hàng
   */
  const handleSearchByGroup = (value) => {
    console.log('value', value)
    const newState = { ...state, customerGroup: value }
    setState(newState)
  }

  /**
   *
   * @param {*} owner
   */
  async function handleSearchByOwner(value) {
    const newState = { ...state, customerOwner: value }
    await setState(newState)
  }

  const setPage = async (pageNumber) => {
    const newState = { ...state, page: (pageNumber - 1) * state.limit }
    await setState(newState)
    props.getCustomers(newState)
  }

  const setLimit = (number) => {
    setLimitState(number)
    const data = {
      ...state,
      limit: number
    }
    setState(data)
    props.getCustomers(data)
  }

  /**
   * Hàm xử lý click button xóa khách hàng
   * @param {*} id
   */
  const deleteCustomer = (id) => {
    if (id) {
      props.deleteCustomer(id)
    }
  }

  const convertDataToExportData = (data) => {
    const { translate } = props
    if (data) {
      data = data.map((o, index) => ({
        STT: index + 1,
        code: o.code,
        name: o.name,
        owner: o.owner && o.owner.length > 0 ? o.owner.map((ow) => ow.email).join(', ') : '',
        status: o.status && o.status.length > 0 ? o.status[o.status.length - 1].name : '',
        customerSource: o.customerSource ? o.customerSource : '',
        customerType: o.customerType ? formatFunction.formatCustomerType(o.customerType, translate) : '',
        group: o.group ? o.group.name : '',
        represent: o.represent ? o.represent : '',
        mobilephoneNumber: o.mobilephoneNumber ? o.mobilephoneNumber : '',
        email: o.email ? o.email : '',
        email2: o.email2 ? o.email2 : '',
        address: o.address ? o.address : '',
        gender: o.gender ? formatFunction.formatCustomerGender(o.gender, translate) : '',
        birthDate: o.birthDate ? new Date(o.birthDate) : '',
        companyEstablishmentDate: o.companyEstablishmentDate ? new Date(o.companyEstablishmentDate) : '',
        taxNumber: o.taxNumber ? o.taxNumber : '',
        address2: o.address2 ? o.address2 : '',
        telephoneNumber: o.telephoneNumber ? o.telephoneNumber : '',
        location: o.location ? formatFunction.formatCustomerLocation(o.location, translate) : '',
        website: o.website ? o.website : '',
        linkedIn: o.linkedIn ? o.linkedIn : ''
      }))
    }

    let exportData = {
      fileName: 'Thông tin khách hàng',
      dataSheets: [
        {
          sheetName: 'sheet1',
          sheetTitle: 'Thông tin khách hàng',
          tables: [
            {
              columns: [
                { key: 'STT', value: 'STT', width: 7 },
                { key: 'code', value: translate('crm.customer.code') },
                { key: 'name', value: translate('crm.customer.name'), width: 20 },
                { key: 'owner', value: translate('crm.customer.owner'), width: 25 },
                { key: 'status', value: translate('crm.customer.status') },
                { key: 'customerSource', value: translate('crm.customer.source') },
                { key: 'customerType', value: translate('crm.customer.customerType') },
                { key: 'group', value: translate('crm.customer.group'), width: 25 },
                { key: 'represent', value: translate('crm.customer.represent'), width: 25 },
                { key: 'mobilephoneNumber', value: translate('crm.customer.mobilephoneNumber'), width: 25 },
                { key: 'email', value: translate('crm.customer.email'), width: 25 },
                { key: 'email2', value: translate('crm.customer.secondaryEmail'), width: 25 },
                { key: 'address', value: translate('crm.customer.address'), width: 25 },
                { key: 'gender', value: translate('crm.customer.gender'), width: 25 },
                { key: 'birthDate', value: translate('crm.customer.birth'), width: 25 },
                { key: 'companyEstablishmentDate', value: translate('crm.customer.companyEstablishmentDate'), width: 25 },
                { key: 'taxNumber', value: translate('crm.customer.taxNumber'), width: 25 },
                { key: 'address2', value: translate('crm.customer.address2'), width: 25 },
                { key: 'telephoneNumber', value: translate('crm.customer.telephoneNumber'), width: 25 },
                { key: 'location', value: translate('crm.customer.location'), width: 25 },
                { key: 'website', value: translate('crm.customer.website'), width: 25 },
                { key: 'linkedIn', value: translate('crm.customer.linkedIn'), width: 25 }
              ],
              data: data
            }
          ]
        }
      ]
    }
    return exportData
  }

  const { customers } = crm

  let pageTotal =
    crm.customers.totalDocs % limit === 0 ? parseInt(crm.customers.totalDocs / limit) : parseInt(crm.customers.totalDocs / limit + 1)
  let cr_page = parseInt(state.page / limit + 1)

  //lay danh sach nhan vien
  let unitMembers
  if (user.usersOfChildrenOrganizationalUnit) {
    console.log('bat dau tim unit members ')
    unitMembers = getEmployeeSelectBoxItems(user.usersOfChildrenOrganizationalUnit)
    console.log('unit members la')
    console.log(unitMembers)
  }

  // Lấy danh sách đơn vị
  let units
  if (user.organizationalUnitsOfUser) {
    units = user.organizationalUnitsOfUser
    console.log('units la')
    console.log(units)
  }

  // Lấy danh sách nhóm khách hàng
  let listGroups
  if (crm.groups.list && crm.groups.list.length > 0) {
    listGroups = crm.groups.list.map((o) => ({ value: o._id, text: o.name }))
  }

  // Lấy danh sách trạng thái khách hàng
  let listStatus
  if (crm.status.list && crm.status.list.length > 0) {
    listStatus = crm.status.list.map((o) => ({ value: o._id, text: o.name }))
  }

  let exportData = []
  if (customers && customers.list && customers.list.length > 0) {
    exportData = convertDataToExportData(customers.list)
  }
  return (
    <div className='box'>
      <div className='box-body qlcv'>
        {/* Nút thêm khách hàng */}
        <div className='form-inline'>
          {/* export excel danh sách khách hàng */}
          <ExportExcel
            id='export-customer'
            buttonName={translate('human_resource.name_button_export')}
            exportData={exportData}
            style={{ marginTop: 0 }}
          />
          {/* Button dropdown thêm mới khách hàng */}
          <div className='dropdown pull-right' style={{ marginBottom: 15 }}>
            <button
              type='button'
              className='btn btn-success dropdown-toggle pull-right'
              data-toggle='dropdown'
              aria-expanded='true'
              title={'Thêm khách hàng'}
            >
              Thêm khách hàng
            </button>
            <ul className='dropdown-menu pull-right' style={{ marginTop: 0 }}>
              <li>
                <a style={{ cursor: 'pointer' }} title={`Nhập bằng file`} onClick={handleImportCustomer}>
                  {translate('human_resource.salary.add_import')}
                </a>
              </li>
              <li>
                <a style={{ cursor: 'pointer' }} title={`Nhập bằng tay`} onClick={handleCreateCustomer}>
                  {`Thêm bằng tay`}
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* form import khách hàng */}
        {importCustomer && <CrmCustomerImportFile listStatus={listStatus} listGroups={listGroups} />}

        {/* form thêm mới khách hàng bằng tay */}
        {createCustomer && <CreateForm />}

        {/* form xem chi tiết khách hàng */}
        {customerId && <InfoForm customerId={customerId} />}

        {/* form edit khách hàng */}
        {customerIdEdit && <EditForm customerIdEdit={customerIdEdit} />}

        {/* form thêm mới hoạt động cskh*/}
        {customerId && <CreateCareCommonForm customerId={customerId} type={1}></CreateCareCommonForm>}

        {/* search form */}
        <div className='form-inline'>
          {/* tim kiem theo ma khach hang */}
          <div className='form-group'>
            <label className='form-control-static'>Mã khách hàng</label>
            <input
              className='form-control'
              type='text'
              name='customerCode'
              onChange={handleSearchByCustomerCode}
              placeholder={`Mã khách hàng`}
            />
          </div>
          <div className='form-group unitSearch'>
            {/* Tìm kiếm khách hàng theo người quản lý */}
            <label>{translate('crm.customer.owner')}</label>
            {unitMembers && (
              <SelectMulti
                id={`customer-group-edit-form`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={unitMembers[0].value}
                onChange={handleSearchByOwner}
                multiple={false}
                options={{
                  nonSelectedText: 'Chọn nhân viên quản lý ',
                  allSelectedText: translate(`task.task_management.select_all_department`)
                }}
              />
            )}
          </div>
        </div>

        <div className='form-inline'>
          {/* Tìm kiếm khách hàng theo trạng thái */}
          <div className='form-group'>
            <label>{translate('crm.customer.status')}</label>
            {listStatus && (
              <SelectMulti
                id='multiSelectUnit12'
                items={listStatus}
                onChange={handleSearchByStatus}
                options={{
                  nonSelectedText: listStatus.length !== 0 ? translate('crm.customer.status') : 'Chưa có trạng thái khách hàng',
                  allSelectedText: translate(`task.task_management.select_all_department`)
                }}
              ></SelectMulti>
            )}
          </div>
          {/* tìm kiếm khách hàng theo nhóm */}
          <div className='form-group '>
            <label>{translate('crm.customer.group')}</label>
            {listGroups && (
              <SelectMulti
                id='multiSelectUnit-group-customer-home-page'
                items={listGroups}
                onChange={handleSearchByGroup}
                options={{
                  nonSelectedText: listGroups.length !== 0 ? 'Chọn nhóm khách hàng' : 'Chưa có nhóm khách hàng',
                  allSelectedText: translate(`task.task_management.select_all_department`)
                }}
              ></SelectMulti>
            )}
          </div>
          <div className='form-group'>
            <label></label>
            <button type='button' className='btn btn-success' onClick={search} title={translate('form.search')}>
              {translate('form.search')}
            </button>
          </div>
        </div>
        <table className='table table-hover table-striped table-bordered' id={tableId} style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <th>{translate('crm.customer.code')}</th>
              <th>{translate('crm.customer.name')}</th>
              <th>{translate('crm.customer.status')}</th>
              <th>{translate('crm.customer.customerType')}</th>
              <th>{translate('crm.customer.email')}</th>
              <th>{translate('crm.customer.mobilephoneNumber')}</th>
              <th>{translate('crm.customer.owner')}</th>
              <th style={{ width: '120px' }}>
                {translate('table.action')}
                <DataTableSetting
                  columnArr={[
                    translate('crm.customer.code'),
                    translate('crm.customer.name'),
                    translate('crm.customer.status'),
                    translate('crm.customer.customerType'),
                    translate('crm.customer.email'),
                    translate('crm.customer.mobilephoneNumber'),
                    translate('crm.customer.owner')
                  ]}
                  setLimit={setLimit}
                  tableId={tableId}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.list && customers.list.length > 0
              ? customers.list.map((cus) => (
                  <tr key={cus._id}>
                    <td>{cus.code}</td>
                    <td>{cus.name}</td>
                    <td>
                      {cus.customerStatus && cus.customerStatus.length > 0 ? cus.customerStatus[cus.customerStatus.length - 1].name : null}
                    </td>
                    <td>{cus.customerType === 1 ? 'Cá nhân ' : 'Công ty'}</td>
                    <td>{cus.email}</td>
                    <td>{cus.mobilephoneNumber}</td>
                    <td>{cus.owner && cus.owner.length > 0 ? cus.owner.map((o) => o.name).join(', ') : null}</td>
                    <td style={{ textAlign: 'center' }}>
                      <a className='text-green' title='Xem chi tiết thông tin khách hàng' onClick={() => handleInfo(cus._id)}>
                        <i className='material-icons'>visibility</i>
                      </a>
                      <a className='text-yellow' title='Chỉnh sửa thông tin khách hàng' onClick={() => handleEdit(cus._id)}>
                        <i className='material-icons'>edit</i>
                      </a>
                      <a className='text-green' title='Tạo hoạt động chăm sóc khách hàng' onClick={() => handleCreateCareAction(cus._id)}>
                        <i className='material-icons'>add_comment</i>{' '}
                      </a>
                      <ConfirmNotification
                        icon='question'
                        title='Xóa thông tin về khách hàng'
                        content='<h3>Xóa thông tin khách hàng</h3>'
                        name='delete'
                        className='text-red'
                        func={() => props.deleteCustomer(cus._id)}
                      />
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
        {customers.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          customers.list && customers.list.length === 0 && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}

        {/* PaginateBar */}
        <PaginateBar pageTotal={pageTotal} currentPage={cr_page} func={setPage} />
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const { crm, user } = state
  return { crm, user }
}

const mapDispatchToProps = {
  getCustomers: CrmCustomerActions.getCustomers,
  deleteCustomer: CrmCustomerActions.deleteCustomer,
  getGroups: CrmGroupActions.getGroups,
  getStatus: CrmStatusActions.getStatus,
  getCareTypes: CrmCareTypeActions.getCareTypes,
  getAllEmployeeOfUnitByRole: UserActions.getAllEmployeeOfUnitByRole,
  getDepartment: UserActions.getDepartmentOfUser,
  getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CustomerHomePage))
