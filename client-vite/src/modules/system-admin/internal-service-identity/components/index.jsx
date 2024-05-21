import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DataTableSetting, DeleteNotification, PaginateBar } from '../../../../common-components'
import { InternalServiceIdentityActions } from '../redux/actions'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import { InternalServiceIdentityCreateModal } from './internalServiceIdentityCreateModal'
import InternalServiceIdentityEditModal from './internalServiceIdentityEditModal'
import InternalServiceIdentityViewModal from './internalServiceIdentityViewModal'

function InternalServiceIdentity(props) {
  const { translate, internalServiceIdentities } = props

  const tableId = 'table-management-internal-service-identity'

  const [listInternalServiceIdentity, setListInternalServiceIdentity] = useState([])
  const defaultConfig = { limit: 20 }
  const { limit } = getTableConfiguration(tableId, defaultConfig)

  const [queryParams, setQueryParams] = useState({
    page: 0,
    perPage: limit,
    name: null,
    apiPrefix: null,
    clientId: null
  })
  const [internalServiceIdentityEdit, setInternalServiceIdentityEdit] = useState({})
  const [internalServiceIdentityView, setInternalServiceIdentityView] = useState({})

  const { page, perPage, name, apiPrefix, clientId } = queryParams

  useEffect(() => {
    async function init() {
      props.getInternalServiceIdentities({
        page,
        perPage
      })
    }

    init()
  }, [])

  useEffect(() => {
    if (internalServiceIdentities) {
      setListInternalServiceIdentity(internalServiceIdentities.listInternalServiceIdentity)
    }
  }, [internalServiceIdentities])

  const handleNameChange = (event) => {
    setQueryParams({
      ...queryParams,
      name: event.target.value
    })
  }

  const handleApiPrefixChange = (event) => {
    setQueryParams({
      ...queryParams,
      apiPrefix: event.target.value
    })
  }

  const handleClientIdChange = (event) => {
    setQueryParams({
      ...queryParams,
      clientId: event.target.value
    })
  }

  const handleLimitChange = (value) => {
    if (Number(value) !== perPage) {
      setQueryParams({
        ...queryParams,
        perPage: Number(value)
      })
      props.getInternalServiceIdentities({
        name,
        apiPrefix,
        clientId,
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
    props.getInternalServiceIdentities({
      name,
      apiPrefix,
      clientId,
      page: Number(value) - 1,
      perPage
    })
  }

  const handleSubmitSearch = () => {
    console.log(name)
    props.getInternalServiceIdentities({
      name,
      apiPrefix,
      clientId,
      page,
      perPage
    })
  }

  const handleEdit = (serviceIdentity) => {
    setInternalServiceIdentityEdit(serviceIdentity)

    window.$('#update-internal-service-identity-modal').modal('show')
  }

  const handleView = async (serviceIdentity) => {
    setInternalServiceIdentityView(serviceIdentity)
    window.$('#view-internal-service-identity-modal').modal('show')
  }

  const renderServiceIdentityTable = () => (
    <table id={tableId} className='table table-hover table-striped table-bordered'>
      <thead>
        <tr>
          <th style={{ width: '40px' }}>{translate('system_admin.internal_service_identity.table.no')}</th>
          <th>{translate('system_admin.internal_service_identity.table.name')}</th>
          <th>{translate('system_admin.internal_service_identity.table.apiPrefix')}</th>
          <th>{translate('system_admin.internal_service_identity.table.description')}</th>
          <th>{translate('system_admin.internal_service_identity.table.clientId')}</th>
          <th>{translate('system_admin.internal_service_identity.table.clientSecret')}</th>
          <th style={{ width: '120px' }}>
            {translate('system_admin.internal_service_identity.table.method')}
            <DataTableSetting tableId={tableId} hideColumn={false} setLimit={handleLimitChange} />
          </th>
        </tr>
      </thead>
      <tbody>
        {listInternalServiceIdentity?.length > 0 &&
          listInternalServiceIdentity?.map((identity, index) => (
            <tr key={identity?._id}>
              <td>{index + 1}</td>
              <td>{identity?.name}</td>
              <td>{identity?.apiPrefix}</td>
              <td>{identity?.description}</td>
              <td>{identity?.clientCredential.clientId}</td>
              <td>{identity?.clientCredential.clientSecret}</td>
              <td style={{ textAlign: 'center' }}>
                <a
                  className='edit text-green'
                  style={{ width: '5px' }}
                  title={translate('system_admin.internal_service_identity.view')}
                  onClick={() => handleView(identity)}
                >
                  <i className='material-icons'>visibility</i>
                </a>
                <a onClick={() => handleEdit(identity)} className='edit' title={translate('system_admin.internal_service_identity.edit')}>
                  <i className='material-icons'>edit</i>
                </a>
                <DeleteNotification
                  content={translate('system_admin.internal_service_identity.delete')}
                  data={{
                    id: identity?.id
                  }}
                  func={props.deleteInternalServiceIdentity}
                />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  )

  return (
    <>
      <InternalServiceIdentityCreateModal />
      <InternalServiceIdentityViewModal internalServiceIdentity={internalServiceIdentityView} />
      <InternalServiceIdentityEditModal id={internalServiceIdentityEdit?.id} internalServiceIdentity={internalServiceIdentityEdit} />
      <div className='box'>
        <div className='box-body qlcv'>
          <div className='form-inline'>
            {/* Name */}
            <div className='form-group'>
              <label className='form-control-static'>{translate('system_admin.internal_service_identity.table.name')}</label>
              <input className='form-control' type='text' name='name' onChange={handleNameChange} />
            </div>

            {/* Client ID */}
            <div className='form-group'>
              <label className='form-control-static'>{translate('system_admin.internal_service_identity.table.clientId')}</label>
              <input className='form-control' type='text' name='name' onChange={handleClientIdChange} />
            </div>

            <button
              type='button'
              onClick={() => {
                window.$('#create-internal-service-identity-modal').modal('show')
              }}
              className='btn btn-success pull-right'
              title={translate('system_admin.internal_service_identity.add')}
            >
              {translate('system_admin.internal_service_identity.add')}
            </button>
          </div>

          <div className='form-inline' style={{ marginBottom: 15 }}>
            {/* Method */}
            <div className='form-group'>
              <label className='form-control-static'>{translate('system_admin.internal_service_identity.table.apiPrefix')}</label>
              <input className='form-control' type='text' name='name' onChange={handleApiPrefixChange} />
            </div>

            {/* Button tìm kiếm */}
            <div className='form-group'>
              <label />
              <button type='button' className='btn btn-success' title='Search' onClick={handleSubmitSearch}>
                {translate('general.search')}
              </button>
            </div>
          </div>

          {renderServiceIdentityTable()}

          <PaginateBar
            display={internalServiceIdentities?.listInternalServiceIdentity?.length}
            total={internalServiceIdentities?.totalInternalServiceIdentities}
            pageTotal={internalServiceIdentities?.totalPages}
            currentPage={page}
            func={handlePageChange}
          />
        </div>
      </div>
    </>
  )
}

function mapState(state) {
  const { internalServiceIdentities } = state
  return { internalServiceIdentities }
}
const actions = {
  getInternalServiceIdentities: InternalServiceIdentityActions.getInternalServiceIdentities,
  deleteInternalServiceIdentity: InternalServiceIdentityActions.deleteInternalServiceIdentity
}

export default connect(mapState, actions)(withTranslate(InternalServiceIdentity))
