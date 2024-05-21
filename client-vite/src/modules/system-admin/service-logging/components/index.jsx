import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DataTableSetting, PaginateBar } from '../../../../common-components'
import { ServiceLoggingActions } from '../redux/actions'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'

function ServiceLogging(props) {
  const { translate, serviceLogging } = props

  const tableId = 'table-management-service-logging'

  const [listServiceLogging, setListServiceLogging] = useState([])
  const defaultConfig = { limit: 20 }
  const { limit } = getTableConfiguration(tableId, defaultConfig)

  const [queryParams, setQueryParams] = useState({
    page: 0,
    perPage: limit,
    type: null,
    target: null
  })

  const { page, perPage, type, target } = queryParams

  useEffect(() => {
    async function init() {
      props.getServiceLogging({
        page,
        perPage
      })
    }

    init()
  }, [])

  useEffect(() => {
    if (serviceLogging) {
      setListServiceLogging(serviceLogging.listServiceLogging)
    }
  }, [serviceLogging])

  const handleTypeChange = (event) => {
    setQueryParams({
      ...queryParams,
      type: event.target.value
    })
  }

  const handleTargetChange = (event) => {
    setQueryParams({
      ...queryParams,
      target: event.target.value
    })
  }

  const handleLimitChange = (value) => {
    if (Number(value) !== perPage) {
      setQueryParams({
        ...queryParams,
        perPage: Number(value)
      })
      props.getServiceLogging({
        type,
        target,
        page: 0,
        perPage: Number(value)
      })
    }
  }

  const handlePageChange = (value) => {
    setQueryParams({
      ...queryParams,
      page: Number(value) - 1
    })
    props.getServiceLogging({
      type,
      target,
      page: Number(value) - 1,
      perPage
    })
  }

  const handleSubmitSearch = () => {
    props.getServiceLogging({
      type,
      target,
      page,
      perPage
    })
  }

  const renderPolicyTable = () => (
    <table id={tableId} className='table table-hover table-striped table-bordered'>
      <thead>
        <tr>
          <th style={{ width: '40px' }}>{translate('system_admin.service_logging.table.no')}</th>
          <th>{translate('system_admin.service_logging.table.target')}</th>
          <th>{translate('system_admin.service_logging.table.type')}</th>
          <th>{translate('system_admin.service_logging.table.status')}</th>
          <th>{translate('system_admin.service_logging.table.payload')}</th>
          <th>{translate('system_admin.service_logging.table.timestamp')}</th>
          <th style={{ width: '120px' }}>
            <DataTableSetting tableId={tableId} hideColumn={false} setLimit={handleLimitChange} />
          </th>
        </tr>
      </thead>
      <tbody>
        {listServiceLogging?.length > 0 &&
          listServiceLogging.map((loggingRecord, index) => (
            <tr key={loggingRecord?.id}>
              <td>{index + 1}</td>
              <td>{loggingRecord?.target}</td>
              <td>{loggingRecord?.type}</td>
              <td>{loggingRecord?.status}</td>
              <td>
                <pre>{JSON.stringify(loggingRecord?.payload, null, 2)}</pre>
              </td>
              <td>{loggingRecord?.timestamp}</td>
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
            <label className='form-control-static'>{translate('system_admin.service_logging.table.type')}</label>
            <input className='form-control' type='text' name='name' onChange={handleTypeChange} />
          </div>

          <div className='form-group'>
            <label className='form-control-static'>{translate('system_admin.service_logging.table.target')}</label>
            <input className='form-control' type='text' name='name' onChange={handleTargetChange} />
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
          display={serviceLogging?.listServiceLogging?.length}
          total={serviceLogging?.totalLoggingRecords}
          pageTotal={serviceLogging?.totalPages}
          currentPage={page}
          func={handlePageChange}
        />
      </div>
    </div>
  )
}

function mapState(state) {
  const { serviceLogging } = state
  return { serviceLogging }
}
const actions = {
  getServiceLogging: ServiceLoggingActions.getServiceLogging
}

export default connect(mapState, actions)(withTranslate(ServiceLogging))
