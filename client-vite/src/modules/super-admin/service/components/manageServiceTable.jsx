import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import parse from 'html-react-parser'

import { PaginateBar, DataTableSetting, SearchBar, DeleteNotification, ConfirmNotification } from '../../../../common-components'

import { ServiceActions } from '../redux/actions'

import ServiceEditForm from './serviceEditForm'
import ServiceCreateForm from './serviceCreateForm'
import ModalImportService from './modalImportService'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'

function ManageServiceTable(props) {
  const tableIdConstructor = 'table-manage-service'
  const defaultConfig = { limit: 10 }
  const limitConstructor = getTableConfiguration(tableIdConstructor, defaultConfig).limit

  const dispatch = useDispatch()

  const [state, setState] = useState({
    tableId: tableIdConstructor,
    limit: limitConstructor,
    page: 1,
    option: 'name', // Mặc định tìm kiếm theo tên
    value: '',
    i: 0
  })

  const getService = (data) => {
    dispatch(ServiceActions.get(data))
  }

  const handleEdit = (service) => {
    setState({
      ...state,
      currentRow: service
    })
    window.$('#modal-edit-service').modal('show')
  }

  const setPage = (page) => {
    setState({
      ...state,
      page
    })
    const { option, limit, value } = state
    const data = {
      perPage: limit,
      page,
      [option]: value
    }
    getService(data)
  }

  const setLimit = (number) => {
    setState({
      ...state,
      limit: number
    })
    const { option, value, page } = state
    const data = {
      perPage: number,
      page,
      [option]: value
    }
    getService(data)
  }

  const setOption = (title, option) => {
    setState({
      ...state,
      [title]: option
    })
  }

  const searchWithOption = () => {
    const { option, limit, value } = state
    const data = {
      perPage: limit,
      page: 1,
      [option]: value
    }
    getService(data)
  }

  // Function lưu các trường thông tin vào state
  const handleChange = (name, value) => {
    setState({
      ...state,
      [name]: value
    })
  }

  const handleChangeAddRowAttribute = (name, value) => {
    setState({
      ...state,
      [name]: value
    })
  }

  useEffect(() => {
    getService({ perPage: state.limit, page: state.page })
    // props.getService()
    // props.getAttribute()
  }, [])

  const sendEmailResetPasswordService = (email) => {
    props.sendEmailResetPasswordService(email)
  }

  const { service, translate } = props
  const { limit, tableId } = state
  return (
    <>
      <div className='dropdown pull-right'>
        <button
          type='button'
          className='btn btn-success dropdown-toggle pull-right'
          data-toggle='dropdown'
          aria-expanded='true'
          title={translate('manage_service.add_title')}
        >
          {translate('manage_service.add')}
        </button>
        <ul className='dropdown-menu pull-right' style={{ marginTop: 0 }}>
          <li>
            <a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-create-service').modal('show')}>
              {translate('manage_service.add_common')}
            </a>
          </li>
          <li>
            <a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-import-service').modal('show')}>
              {translate('manage_service.import')}
            </a>
          </li>
        </ul>
      </div>

      {/* Form thêm mới người dùng */}
      <ServiceCreateForm handleChange={handleChange} handleChangeAddRowAttribute={handleChangeAddRowAttribute} i={state.i} />

      {/* Form import thông tin người dùng */}
      <ModalImportService limit={limit} />

      {/* Thanh tìm kiếm */}
      <SearchBar
        columns={[
          { title: translate('manage_service.name'), value: 'name' },
          { title: translate('manage_service.email'), value: 'email' }
        ]}
        option={state.option}
        setOption={setOption}
        search={searchWithOption}
      />

      {/* Form chỉnh sửa thông tin tài khoản người dùng */}
      {state.currentRow && (
        <ServiceEditForm
          serviceId={state.currentRow._id}
          serviceEmail={state.currentRow.email}
          serviceName={state.currentRow.name}
          serviceActive={state.currentRow.active}
          handleChange={handleChange}
          handleChangeAddRowAttribute={handleChangeAddRowAttribute}
          i={state.i}
        />
      )}

      {/* Bảng dữ liệu tài khoản người dùng */}
      <table className='table table-hover table-striped table-bordered' id={tableId}>
        <thead>
          <tr>
            <th>{translate('manage_service.name')}</th>
            <th>{translate('manage_service.email')}</th>
            <th>{translate('manage_service.status')}</th>
            <th style={{ width: '120px', textAlign: 'center' }}>
              {translate('table.action')}
              <DataTableSetting
                columnArr={[translate('manage_service.name'), translate('manage_service.email'), translate('manage_service.status')]}
                setLimit={setLimit}
                tableId={tableId}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {!service.isLoading &&
            service.listPaginate &&
            service.listPaginate.length > 0 &&
            service.listPaginate.map((u) => (
              <tr key={u._id}>
                <td>{parse(u.name)}</td>
                <td>{u.email}</td>
                <td>
                  {u.active ? (
                    <p>
                      <i className='fa fa-circle text-success' style={{ fontSize: '1em', marginRight: '0.25em' }} />{' '}
                      {translate('manage_service.enable')}{' '}
                    </p>
                  ) : (
                    <p>
                      <i className='fa fa-circle text-danger' style={{ fontSize: '1em', marginRight: '0.25em' }} />{' '}
                      {translate('manage_service.disable')}{' '}
                    </p>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <a
                    onClick={() => handleEdit(u)}
                    className='edit text-yellow'
                    href={`#${u._id}`}
                    style={{ width: '5px' }}
                    title={translate('manage_service.edit')}
                  >
                    <i className='material-icons'>edit</i>
                  </a>
                  <ConfirmNotification
                    className='text-blue'
                    title='Gửi email cấp lại mật khẩu'
                    name='contact_mail'
                    content={`Gửi email cấp lại mật khẩu đến tài khoản [ ${u.email} ]`}
                    icon='question'
                    func={() => sendEmailResetPasswordService(u.email)}
                  />
                  <DeleteNotification
                    content={translate('manage_service.delete')}
                    data={{ id: u._id, info: u.email }}
                    func={props.destroy}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {service.isLoading ? (
        <div className='table-info-panel'>{translate('confirm.loading')}</div>
      ) : (
        service.listPaginate && service.listPaginate.length === 0 && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
      )}

      {/* PaginateBar */}
      <PaginateBar
        display={service.listPaginate.length}
        total={service.totalServices}
        pageTotal={service.totalPages}
        currentPage={service.page}
        func={setPage}
      />
    </>
  )
}

function mapStateToProps(state) {
  const { service } = state
  return { service }
}

const mapDispatchToProps = {
  getService: ServiceActions.get,
  edit: ServiceActions.edit,
  destroy: ServiceActions.destroy,
  sendEmailResetPasswordService: ServiceActions.sendEmailResetPasswordService
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManageServiceTable))
