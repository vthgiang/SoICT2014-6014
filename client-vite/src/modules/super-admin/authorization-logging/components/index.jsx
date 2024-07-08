import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslate } from 'react-redux-multilingual'
import { DataTableSetting, PaginateBar, SelectMulti } from '../../../../common-components'
import { AuthorizationLoggingActions } from '../redux/actions'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'

export default function AuthorizationLogging() {
  const translate = useTranslate()
  const authorizationLogging = useSelector((x) => x.authorizationLogging)
  const dispatch = useDispatch()
  const getAuthorizationLogging = (data) => dispatch(AuthorizationLoggingActions.getAuthorizationLogging(data))
  const tableId = 'table-management-authorization-logging'

  const defaultConfig = { limit: 20 }
  const { limit } = getTableConfiguration(tableId, defaultConfig)

  const [queryParams, setQueryParams] = useState({
    page: 1,
    perPage: limit,
    requesterId: null,
    resourceId: null,
    accessStatus: ['Allowed', 'Denied']
  })

  const { page, perPage, requesterId, resourceId, accessStatus } = queryParams

  useEffect(() => {
    async function init() {
      getAuthorizationLogging({
        page,
        perPage
      })
    }

    init()
  }, [])

  const handleChangeRequester = (event) => {
    setQueryParams({
      ...queryParams,
      requesterId: event.target.value
    })
  }

  const handleChangeResource = (event) => {
    setQueryParams({
      ...queryParams,
      resourceId: event.target.value
    })
  }

  const handleChangeStatus = (value) => {
    setQueryParams({
      ...queryParams,
      accessStatus: value
    })
  }

  const handleLimitChange = (value) => {
    if (Number(value) !== perPage) {
      setQueryParams({
        ...queryParams,
        perPage: Number(value)
      })
      getAuthorizationLogging({
        requesterId,
        resourceId,
        accessStatus,
        page: 1,
        perPage: Number(value)
      })
    }
  }

  const handlePageChange = (value) => {
    setQueryParams({
      ...queryParams,
      page: Number(value)
    })
    getAuthorizationLogging({
      requesterId,
      resourceId,
      accessStatus,
      page: Number(value),
      perPage
    })
  }

  const handleSubmitSearch = () => {
    getAuthorizationLogging({
      requesterId,
      resourceId,
      accessStatus,
      page,
      perPage
    })
  }

  const renderPolicyTable = () => (
    <table id={tableId} className='table table-hover table-striped table-bordered'>
      <thead>
        <tr>
          <th style={{ width: '40px' }}>{translate('system_admin.authorization_logging.table.index')}</th>
          <th>{translate('system_admin.authorization_logging.table.requester')}</th>
          <th>{translate('system_admin.authorization_logging.table.resource')}</th>
          <th>{translate('system_admin.authorization_logging.table.status')}</th>
          <th>{translate('system_admin.authorization_logging.table.policy')}</th>
          <th>{translate('system_admin.authorization_logging.table.access_time')}</th>
          <th style={{ width: '120px' }}>
            <DataTableSetting tableId={tableId} hideColumn={false} setLimit={handleLimitChange} />
          </th>
        </tr>
      </thead>
      <tbody>
        {authorizationLogging?.listPaginate?.length > 0 &&
          authorizationLogging.listPaginate.map((loggingRecord, index) => (
            <tr key={loggingRecord.id}>
              <td>{index + 1}</td>
              <td>{loggingRecord.requesterId.name}</td>
              <td>{loggingRecord.resourceId.name}</td>
              <td>{loggingRecord.accessStatus}</td>
              <td>{loggingRecord.policyId.name}</td>
              <td>{loggingRecord.accessTime}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )

  return (
    <div className='box'>
      <div className='box-body qlcv'>
        <div className='form-inline'>
          {/* Name */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('system_admin.authorization_logging.table.requester')} Id</label>
            <input className='form-control' type='text' name='name' onChange={handleChangeRequester} />
          </div>

          <div className='form-group'>
            <label className='form-control-static'>{translate('system_admin.authorization_logging.table.resource')} Id</label>
            <input className='form-control' type='text' name='name' onChange={handleChangeResource} />
          </div>

          <div className='form-group'>
            <label className='form-control-static'>{translate('system_admin.authorization_logging.table.status')}</label>
            <SelectMulti
              id='authorization-logging-select-status'
              className='form-control select2'
              style={{ width: '100%' }}
              items={[
                { value: 'Allowed', text: 'Allowed' },
                { value: 'Denied', text: 'Denied' }
              ]}
              onChange={handleChangeStatus}
              multiple
              value={accessStatus}
            />
          </div>
          {/* Button tìm kiếm */}
          <div className='form-group'>
            <button type='button' className='btn btn-success' title={translate('general.search')} onClick={handleSubmitSearch}>
              {translate('general.search')}
            </button>
          </div>
        </div>

        {renderPolicyTable()}

        <PaginateBar
          display={authorizationLogging?.listAuthorizationLogging?.length}
          total={authorizationLogging?.totalLoggingRecords}
          pageTotal={authorizationLogging?.totalPages}
          currentPage={page}
          func={handlePageChange}
        />
      </div>
    </div>
  )
}
