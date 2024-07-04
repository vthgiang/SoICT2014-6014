import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { AttributeActions } from '../../../super-admin/attribute/redux/actions'
import { SelectMulti, PaginateBar, DataTableSetting } from '../../../../common-components'
import { RequesterActions } from '../redux/actions'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import RequesterEditForm from './requesterEditForm'
import { PolicyActions } from '../../../super-admin/policy-authorization/redux/actions'

function ManageRequester(props) {
  const tableIdContructor = 'table-manage-requester'
  const defaultConfig = { limit: 10 }
  const { limit } = getTableConfiguration(tableIdContructor, defaultConfig)

  const [state, setState] = useState({
    tableId: tableIdContructor,
    limit,
    page: 1,
    type: ['User', 'Service'], // Find all types in default
    value: '',
    i: 0,
    currentRow: {}
  })

  const { requester, attribute } = props
  const { translate, getAttribute, getRequesters, getAllPolicies } = props
  const { currentRow, tableId, type, name, page } = state

  const setPage = (page) => {
    setState({
      ...state,
      page
    })
    getRequesters({
      type,
      name,
      page,
      perPage: limit
    })
  }

  const setLimit = (number) => {
    setState({
      ...state,
      limit: number
    })
    getRequesters({
      type,
      name,
      page,
      perPage: limit
    })
  }

  const handleChangeAddRowAttribute = (name, value) => {
    setState({
      ...state,
      [name]: value
    })
  }

  const handleChangeName = (e) => {
    setState({
      ...state,
      name: e.target.value
    })
  }

  const handleChangeRequesterType = (value) => {
    setState({
      ...state,
      type: value
    })
  }

  const handleSubmitSearch = () => {
    getRequesters({
      type,
      name,
      page,
      perPage: limit
    })
  }

  useEffect(() => {
    getRequesters({ page, perPage: limit })
    getAttribute()
    getAllPolicies()
  }, [])

  // Cac ham xu ly du lieu voi modal
  const handleEdit = async (requester) => {
    const newIndex = state.i + requester.attributes.length ?? 0
    setState({
      ...state,
      i: newIndex,
      currentRow: requester
    })
    window.$('#modal-edit-requester').modal('show')
  }

  const prettyAttributes = (attributes) => {
    let str = ''
    const attributeList = attribute.lists
    for (let i = 0; i < attributes.length; i++) {
      const attributeName = attributeList.find((x) => x._id === attributes[i].attributeId)?.attributeName
      str += `${attributeName}: ${attributes[i].value}\n`
    }
    return str
  }

  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body qlcv'>
        {/* Form hỉnh sửa thông tin   */}
        <RequesterEditForm requester={currentRow} handleChangeAddRowAttribute={handleChangeAddRowAttribute} i={state.i} />

        <div className='form-inline' style={{ marginBottom: 15 }}>
          {/* Name */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_requester.name')}</label>
            <input
              className='form-control'
              type='text'
              placeholder={translate('manage_requester.placeholder.name')}
              name='name'
              onChange={(e) => handleChangeName(e)}
            />
          </div>
        </div>
        <div className='form-inline' style={{ marginBottom: 15 }}>
          {/* Type */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_requester.requester_type')}</label>
            <SelectMulti
              id='requester-type-management'
              items={[
                {
                  text: 'User',
                  value: 'User'
                },
                {
                  text: 'Service',
                  value: 'Service'
                }
              ]}
              options={{
                allSelectedText: translate('manage_requester.select_all_method'),
                nonSelectedText: translate('manage_requester.non_select_method')
              }}
              value={type}
              onChange={handleChangeRequesterType}
            />
          </div>

          {/* Button tìm kiếm */}
          <div className='form-group'>
            <label />
            <button type='button' className='btn btn-success' title={translate('general.search')} onClick={() => handleSubmitSearch()}>
              {translate('general.search')}
            </button>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <table className='table table-hover table-striped table-bordered' id={tableId}>
          <thead>
            <tr>
              <th>{translate('manage_requester.index')}</th>
              <th>{translate('manage_requester.name')}</th>
              <th>{translate('manage_requester.type')}</th>
              <th>{translate('manage_requester.attribute')}</th>
              <th style={{ width: '120px' }}>
                {translate('table.action')}
                <DataTableSetting
                  columnArr={[
                    translate('manage_requester.index'),
                    translate('manage_requester.name'),
                    translate('manage_requester.type'),
                    translate('manage_requester.attribute')
                  ]}
                  setLimit={setLimit}
                  tableId={tableId}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {requester.listPaginate &&
              requester.listPaginate.length > 0 &&
              requester.listPaginate.map((x, index) => (
                <tr key={x.id}>
                  <td>{index + 1}</td>
                  <td>{x.name}</td>
                  <td>{x.type}</td>
                  <td>
                    <pre>{prettyAttributes(x.attributes)}</pre>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <a className='edit' onClick={() => handleEdit(x)}>
                      <i className='material-icons'>edit</i>
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {requester.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          requester.listPaginate &&
          requester.listPaginate.length === 0 && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}
        {/* PaginateBar */}
        <PaginateBar
          display={requester.listPaginate.length}
          total={requester.totalRequesters}
          pageTotal={requester.totalPages}
          currentPage={page}
          func={setPage}
        />
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const { requester, attribute } = state
  return { requester, attribute }
}

const mapDispatchToProps = {
  getRequesters: RequesterActions.get,
  getAttribute: AttributeActions.getAttributes,
  getAllPolicies: PolicyActions.getAllPolicies
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManageRequester))
