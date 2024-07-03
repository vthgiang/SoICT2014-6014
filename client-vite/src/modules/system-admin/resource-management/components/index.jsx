import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { AttributeActions } from '../../../super-admin/attribute/redux/actions'
import { SelectMulti, PaginateBar, DataTableSetting } from '../../../../common-components'
import { ResourceActions } from '../redux/actions'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import ResourceEditForm from './resourceEditForm'

function ManageResource(props) {
  const tableIdContructor = 'table-manage-resource'
  const defaultConfig = { limit: 10 }
  const { limit } = getTableConfiguration(tableIdContructor, defaultConfig)

  const [state, setState] = useState({
    tableId: tableIdContructor,
    limit,
    page: 1,
    type: ['Link', 'Component', 'SystemApi', 'Task'], // Find all types in default
    value: '',
    i: 0,
    currentRow: {}
  })

  const { resource, attribute } = props
  const { translate, getAttribute, getResources } = props
  const { currentRow, tableId, type, name, page } = state

  const setPage = (page) => {
    setState({
      ...state,
      page
    })
    getResources({
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
    getResources({
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

  const handleChangeResourceType = (value) => {
    setState({
      ...state,
      type: value
    })
  }

  const handleSubmitSearch = () => {
    getResources({
      type,
      name,
      page,
      perPage: limit
    })
  }

  useEffect(() => {
    getResources({ page, perPage: limit })
    getAttribute()
  }, [])

  // Cac ham xu ly du lieu voi modal
  const handleEdit = async (resource) => {
    const newIndex = state.i + resource.attributes.length ?? 0
    setState({
      ...state,
      i: newIndex,
      currentRow: resource
    })
    window.$('#modal-edit-resource').modal('show')
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

  const prettyAdditionalInfo = (additionalInfo) => {
    let str = ''
    for (const k in additionalInfo) {
      str += `${k}: ${additionalInfo[k]}\n`
    }
    return str
  }

  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body qlcv'>
        {/* Form hỉnh sửa thông tin   */}
        <ResourceEditForm resource={currentRow} handleChangeAddRowAttribute={handleChangeAddRowAttribute} i={state.i} />

        <div className='form-inline' style={{ marginBottom: 15 }}>
          {/* Name */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_resource.name')}</label>
            <input
              className='form-control'
              type='text'
              placeholder={translate('manage_resource.placeholder.name')}
              name='name'
              onChange={(e) => handleChangeName(e)}
            />
          </div>
        </div>
        <div className='form-inline' style={{ marginBottom: 15 }}>
          {/* Type */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_resource.resource_type')}</label>
            <SelectMulti
              id='resource-type-management'
              items={[
                {
                  text: 'Link',
                  value: 'Link'
                },
                {
                  text: 'Component',
                  value: 'Component'
                },
                {
                  text: 'SystemApi',
                  value: 'SystemApi'
                },
                {
                  text: 'Task',
                  value: 'Task'
                }
              ]}
              options={{
                allSelectedText: translate('manage_resource.select_all_method'),
                nonSelectedText: translate('manage_resource.non_select_method')
              }}
              value={type}
              onChange={handleChangeResourceType}
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
              <th>{translate('manage_resource.index')}</th>
              <th>{translate('manage_resource.name')}</th>
              <th>{translate('manage_resource.type')}</th>
              <th>{translate('manage_resource.attribute')}</th>
              <th>{translate('manage_resource.additional_info')}</th>
              <th style={{ width: '120px' }}>
                {translate('table.action')}
                <DataTableSetting
                  columnArr={[
                    translate('manage_resource.index'),
                    translate('manage_resource.name'),
                    translate('manage_resource.type'),
                    translate('manage_resource.attribute'),
                    translate('manage_resource.additional_info')
                  ]}
                  setLimit={setLimit}
                  tableId={tableId}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {resource.listPaginate &&
              resource.listPaginate.length > 0 &&
              resource.listPaginate.map((x, index) => (
                <tr key={x.id}>
                  <td>{index + 1}</td>
                  <td>{x.name}</td>
                  <td>{x.type}</td>
                  <td>
                    <pre>{prettyAttributes(x.attributes)}</pre>
                  </td>
                  <td>
                    <pre>{prettyAdditionalInfo(x.additionalInfo)}</pre>
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
        {resource.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          resource.listPaginate &&
          resource.listPaginate.length === 0 && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}
        {/* PaginateBar */}
        <PaginateBar
          display={resource.listPaginate.length}
          total={resource.totalResources}
          pageTotal={resource.totalPages}
          currentPage={page}
          func={setPage}
        />
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const { resource, attribute } = state
  return { resource, attribute }
}

const mapDispatchToProps = {
  getResources: ResourceActions.get,
  getAttribute: AttributeActions.getAttributes
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManageResource))
