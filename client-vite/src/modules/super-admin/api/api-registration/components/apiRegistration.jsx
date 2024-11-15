import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'

import { PaginateBar, DataTableSetting, SelectMulti, DeleteNotification } from '../../../../../common-components'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { formatDate } from '../../../../../helpers/formatDate'

import { CreateApiRegistrationModal } from './createApiRegistrationModal'

import { PrivilegeApiActions } from '../../../../system-admin/system-api/system-api-privilege/redux/actions'
import TooltipCopy from '../../../../../common-components/src/tooltip-copy/TooltipCopy'

function ApiRegistration(props) {
  const { translate, privilegeApis, company } = props

  const tableId = 'table-api-registration'
  const defaultConfig = { limit: 20 }
  const limit = getTableConfiguration(tableId, defaultConfig).limit

  const [state, setState] = useState({
    email: null,
    companyId: localStorage.getItem('companyId'),
    page: 1,
    perPage: limit
  })
  const { email, companyId, page, perPage } = state

  useEffect(() => {
    props.getPrivilegeApis({
      email: email,
      companyIds: [companyId],
      role: 'admin',
      page: page,
      perPage: perPage
    })
  }, [])

  const handleChangeEmail = (e) => {
    setState({
      ...state,
      email: e.target.value
    })
  }

  const handleSunmitSearch = () => {
    props.getPrivilegeApis({
      email: email,
      companyIds: [companyId],
      role: 'admin',
      page: page,
      perPage: perPage
    })
  }

  const handleAcceptApiRegistration = (api) => {
    props.updateStatusPrivilegeApi({
      privilegeApiIds: [api?._id],
      status: 3
    })
  }

  const handleDeclineApiRegistration = (api) => {
    props.updateStatusPrivilegeApi({
      privilegeApiIds: [api?._id],
      status: 2
    })
  }

  const handleCancelApiRegistration = (api) => {
    Swal.fire({
      html: `<h4 style="color: red"><div>${translate('system_admin.privilege_system_api.cancel')}</div></h4>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: translate('general.no'),
      confirmButtonText: translate('general.yes')
    }).then((result) => {
      if (result.value) {
        props.updateStatusPrivilegeApi({
          privilegeApiIds: [api?._id],
          status: 0
        })
      }
    })
  }

  const handleDeleteApiRegistration = (api) => {
    Swal.fire({
      html: `<h4 style="color: red"><div>${translate('system_admin.privilege_system_api.delete')}</div></h4>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: translate('general.no'),
      confirmButtonText: translate('general.yes')
    }).then((result) => {
      if (result.value) {
        props.deletePrivilegeApi({
          privilegeApiIds: [api?._id]
        })
      }
    })
  }

  const setLimit = (value) => {
    if (Number(value) !== perPage) {
      setState({
        ...state,
        page: 1,
        perPage: Number(value)
      })
      props.getPrivilegeApis({
        email: email,
        companyIds: [companyId],
        role: 'admin',
        page: 1,
        perPage: Number(value)
      })
    }
  }

  const handleGetDataPagination = (value) => {
    setState({
      ...state,
      page: value
    })
    props.getPrivilegeApis({
      email: email,
      companyIds: [companyId],
      role: 'admin',
      page: value,
      perPage: perPage
    })
  }

  const formatStatus = (status) => {
    if (status === 0) {
      return <span style={{ color: '#858585' }}>Vô hiệu hóa</span>
    } else if (status === 1) {
      return <span style={{ color: '#F57F0C' }}>Yêu cầu sử dụng</span>
    } else if (status === 2) {
      return <span style={{ color: '#E34724' }}>Từ chối</span>
    } else if (status === 3) {
      return <span style={{ color: '#28A745' }}>Đang sử dụng</span>
    }
  }

  const handleAddPrivilegeApi = () => {
    window.$('#create-api-registration-modal').modal('show')
  }

  let listPaginateApiRegistration = privilegeApis?.listPaginatePrivilegeApi

  return (
    <React.Fragment>
      <CreateApiRegistrationModal role='admin' privilegeApisStatus={3} />

      <div className='box'>
        <div className='box-body qlcv'>
          <div className='form-inline' style={{ marginBottom: 15 }}>
            {/* Email */}
            <div className='form-group'>
              <label className='form-control-static'>{translate('system_admin.privilege_system_api.table.email')}</label>
              <input
                className='form-control'
                type='text'
                placeholder={translate('system_admin.privilege_system_api.placeholder.input_email')}
                name='name'
                onChange={(e) => handleChangeEmail(e)}
              />
            </div>
            <button type='button' className='btn btn-success' title={translate('general.search')} onClick={() => handleSunmitSearch()}>
              {translate('general.search')}
            </button>

            <button
              type='button'
              onClick={() => handleAddPrivilegeApi()}
              className='btn btn-success pull-right'
              title={translate('task.task_management.add_title')}
            >
              {translate('task.task_management.add_task')}
            </button>
          </div>

          <table id={tableId} className='table table-hover table-striped table-bordered'>
            <thead
              style={{
                tableLayout: 'fixed'
              }}
            >
              <tr>
                <th
                  style={{
                    textAlign: 'center'
                  }}
                >
                  {translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.no_')}
                </th>
                <th>{translate('system_admin.privilege_system_api.table.email')}</th>
                <th>{translate('system_admin.privilege_system_api.table.description')}</th>
                <th>{translate('system_admin.privilege_system_api.table.startDate')}</th>
                <th>{translate('system_admin.privilege_system_api.table.endDate')}</th>
                <th>{translate('task.task_management.col_status')}</th>
                <th>Token</th>
                <th style={{ width: '120px' }}>
                  {translate('table.action')}
                  <DataTableSetting tableId={tableId} hideColumn={false} setLimit={setLimit} />
                </th>
              </tr>
            </thead>
            <tbody>
              {listPaginateApiRegistration?.length > 0 &&
                listPaginateApiRegistration.map((apiRegistration, index) => (
                  <tr key={apiRegistration._id}>
                    <td>{index + 1}</td>
                    <td>{apiRegistration.email}</td>
                    <td
                      style={{
                        textAlign: 'justify',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '20vw'
                      }}
                    >
                      {apiRegistration.description ? apiRegistration.description : 'NaN'}
                    </td>
                    <td>{apiRegistration.startDate ? formatDate(apiRegistration.startDate) : 'Unlimited'}</td>
                    <td>{apiRegistration.endDate ? formatDate(apiRegistration.endDate) : 'Unlimited'}</td>
                    <td>{formatStatus(apiRegistration.status)}</td>
                    <td style={{ position: 'relative' }}>
                      {apiRegistration?.token && (
                        <TooltipCopy className='pull-right' copyText={apiRegistration?.token} copySuccessNoti={'Copied'} />
                      )}

                      <div style={{ marginRight: 40 }}>
                        {apiRegistration?.token ? `${apiRegistration?.token?.slice(0, 60)}...` : 'Waiting for being accepted...'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {![2, 3].includes(apiRegistration.status) ? (
                        <>
                          <a onClick={() => handleAcceptApiRegistration(apiRegistration)} style={{ color: '#28A745' }}>
                            <i className='material-icons'>check_circle_outline</i>
                          </a>

                          <a onClick={() => handleDeclineApiRegistration(apiRegistration)} style={{ color: '#E34724' }}>
                            <i className='material-icons'>remove_circle_outline</i>
                          </a>

                          <a onClick={() => handleDeleteApiRegistration(apiRegistration)} style={{ color: '#E34724' }}>
                            <i className='material-icons'>delete</i>
                          </a>
                        </>
                      ) : (
                        <a onClick={() => handleCancelApiRegistration(apiRegistration)} style={{ color: '#858585' }}>
                          <i className='material-icons'>highlight_off</i>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <PaginateBar
            display={privilegeApis?.listPaginatePrivilegeApi?.length}
            total={privilegeApis?.totalPrivilegeApis}
            pageTotal={privilegeApis?.totalPages}
            currentPage={page}
            func={handleGetDataPagination}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { privilegeApis, company } = state
  return { privilegeApis, company }
}
const actions = {
  getPrivilegeApis: PrivilegeApiActions.getPrivilegeApis,
  updateStatusPrivilegeApi: PrivilegeApiActions.updateStatusPrivilegeApi,
  deletePrivilegeApi: PrivilegeApiActions.deletePrivilegeApis
}

export default connect(mapState, actions)(withTranslate(ApiRegistration))
