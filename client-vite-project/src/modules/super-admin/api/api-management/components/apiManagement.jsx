import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { SelectMulti, PaginateBar, DataTableSetting } from '../../../../../common-components'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'

import { ApiActions } from '../redux/actions'

function ApiManagement(props) {
  const { translate, apis } = props

  const tableId = 'table-management-api'
  const defaultConfig = { limit: 20 }
  const limit = getTableConfiguration(tableId, defaultConfig).limit

  const [state, setState] = useState({
    path: null,
    method: [],
    description: null,
    page: 1,
    perPage: limit
  })

  const { path, method, description, page, perPage } = state

  useEffect(() => {
    props.getApis({
      page: page,
      perPage: perPage
    })
  }, [])

  const handleChangePath = (e) => {
    setState({
      ...state,
      path: e.target.value
    })
  }

  const handleChangeDescription = (e) => {
    setState({
      ...state,
      description: e.target.value
    })
  }

  const handleChangeMethod = (value) => {
    setState({
      ...state,
      method: value
    })
  }

  const handleSunmitSearch = () => {
    props.getApis({
      path: path,
      method: method,
      description: description,
      page: page,
      perPage: perPage
    })
  }

  const setLimit = (value) => {
    if (Number(value) !== perPage) {
      setState({
        ...state,
        page: 1,
        perPage: Number(value)
      })
      props.getApis({
        path: path,
        method: method,
        description: description,
        page: 1,
        perPage: Number(value)
      })
    }
  }

  const handleGetDataPagination = (value) => {
    console.log(value)
    setState({
      ...state,
      page: value
    })
    props.getApis({
      path: path,
      method: method,
      description: description,
      page: value,
      perPage: perPage
    })
  }

  let listPaginateApi = apis?.listPaginateApi
  console.log('listPaginateApi', listPaginateApi)
  return (
    <React.Fragment>
      <div className='box'>
        <div className='box-body qlcv'>
          <div className='form-inline'>
            {/* Path */}
            <div className='form-group'>
              <label className='form-control-static'>{translate('system_admin.system_api.table.path')}</label>
              <input
                className='form-control'
                type='text'
                placeholder={translate('system_admin.system_api.placeholder.input_path')}
                name='name'
                onChange={(e) => handleChangePath(e)}
              />
            </div>

            {/* Description */}
            <div className='form-group'>
              <label className='form-control-static'>{translate('system_admin.system_api.table.description')}</label>
              <input
                className='form-control'
                type='text'
                placeholder={translate('system_admin.system_api.placeholder.input_description')}
                name='name'
                onChange={(e) => handleChangeDescription(e)}
              />
            </div>
          </div>

          <div className='form-inline' style={{ marginBottom: 15 }}>
            {/* Method */}
            <div className='form-group'>
              <label className='form-control-static'>{translate('system_admin.system_api.table.method')}</label>
              <SelectMulti
                id={`method-management-system-api`}
                items={[
                  {
                    text: 'GET',
                    value: 'GET'
                  },
                  {
                    text: 'PUT',
                    value: 'PUT'
                  },
                  {
                    text: 'PATCH',
                    value: 'PATCH'
                  },
                  {
                    text: 'POST',
                    value: 'POST'
                  },
                  {
                    text: 'DELETE',
                    value: 'DELETE'
                  }
                ]}
                options={{
                  allSelectedText: translate('system_admin.system_api.select_all_method'),
                  nonSelectedText: translate('system_admin.system_api.non_select_method')
                }}
                onChange={handleChangeMethod}
              />
            </div>

            {/* Button tìm kiếm */}
            <div className='form-group'>
              <label></label>
              <button type='button' className='btn btn-success' title={translate('general.search')} onClick={() => handleSunmitSearch()}>
                {translate('general.search')}
              </button>
            </div>
          </div>

          <table id={tableId} className='table table-hover table-striped table-bordered'>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.no_')}</th>
                <th>{translate('system_admin.system_api.table.path')}</th>
                <th>{translate('system_admin.system_api.table.method')}</th>
                <th>{translate('system_admin.system_api.table.description')}</th>
                <th style={{ width: '120px' }}>
                  {translate('table.action')}
                  <DataTableSetting tableId={tableId} hideColumn={false} setLimit={setLimit} />
                </th>
              </tr>
            </thead>
            <tbody>
              {listPaginateApi?.length > 0 &&
                listPaginateApi.map((api, index) => (
                  <tr key={api?._id}>
                    <td>{index + 1}</td>
                    <td>{api?.path}</td>
                    <td>{api?.method}</td>
                    <td>{api?.description}</td>
                    <td style={{ textAlign: 'center' }}></td>
                  </tr>
                ))}
            </tbody>
          </table>

          <PaginateBar
            display={apis?.listPaginateApi?.length}
            total={apis?.totalApis}
            pageTotal={apis?.totalPages}
            currentPage={page}
            func={handleGetDataPagination}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { apis } = state
  return { apis }
}
const actions = {
  getApis: ApiActions.getApis
}

export default connect(mapState, actions)(withTranslate(ApiManagement))
