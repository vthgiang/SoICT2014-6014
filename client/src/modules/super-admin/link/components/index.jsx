import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { LinkActions } from '../redux/actions'
import { RoleActions } from '../../role/redux/actions'
import { AttributeActions } from '../../attribute/redux/actions'

import { ToolTip, SearchBar, DataTableSetting, PaginateBar } from '../../../../common-components'

import LinkInfoForm from './linkInfoForm'
import ModalImportLinkPrivilege from './modalImportLinkPrivilege'
import LinkAttributeCreateForm from './linkAttributeCreateForm'

import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
function ManageLink(props) {
  const tableId_contructor = 'table-manage-link'
  const defaultConfig = { limit: 10 }
  const limit = getTableConfiguration(tableId_contructor, defaultConfig).limit

  const [state, setState] = useState({
    tableId: tableId_contructor,
    limit: limit,
    page: 1,
    option: 'url', // Mặc định tìm kiếm theo tên
    value: '',
    i: 0
  })

  const setOption = (title, option) => {
    setState({
      ...state,
      [title]: option
    })
  }

  const searchWithOption = () => {
    let { option, value, limit } = state
    const params = {
      type: 'active',
      limit,
      page: 1,
      key: option,
      value
    }
    props.getLinks(params)
  }

  const setPage = (page) => {
    setState({
      ...state,
      page
    })
    let { limit, option, value } = state
    const params = {
      type: 'active',
      limit,
      page,
      key: option,
      value
    }
    props.getLinks(params)
  }

  const setLimit = (number) => {
    setState({
      ...state,
      limit: number
    })
    let { page, option, value } = state
    const params = {
      type: 'active',
      limit: number,
      page,
      key: option,
      value
    }
    props.getLinks(params)
  }

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
    let { page, limit } = state
    props.getLinks({ type: 'active' })
    props.getLinks({ type: 'active', page, limit })
    props.getRoles()
    props.getAttribute()
  }, [])

  // Cac ham xu ly du lieu voi modal
  const handleEdit = async (link) => {
    await setState({
      ...state,
      currentRow: link
    })
    window.$('#modal-edit-link').modal('show')
  }

  // mở modal import file quản lý phân quyền trang
  const handleOpenModalImport = () => {
    window.$(`#modal-import-link-privilege`).modal('show')
  }

  const { translate, link, role } = props
  const { currentRow, tableId } = state

  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <React.Fragment>
          {/* Form import file quản lý phân quyền trang */}
          <ModalImportLinkPrivilege />

          {/* Button thêm phân quyền mới */}
          <div style={{ display: 'flex', marginBottom: 6, float: 'right' }}>
            {
              <div className='dropdown'>
                <button
                  type='button'
                  className='btn btn-success dropdown-toggler'
                  data-toggle='dropdown'
                  aria-expanded='true'
                  onClick={handleOpenModalImport}
                >
                  Import phân quyền trang từ file
                </button>
              </div>
            }
          </div>

          {/* Form thêm thuộc tính cho trang */}
          <LinkAttributeCreateForm handleChange={handleChange} handleChangeAddRowAttribute={handleChangeAddRowAttribute} i={state.i} />

          {/* Form hỉnh sửa thông tin   */}
          {currentRow && (
            <LinkInfoForm
              linkId={currentRow._id}
              linkUrl={currentRow.url}
              linkDescription={currentRow.description}
              linkRoles={currentRow.roles
                .filter((role) => role && role.roleId && (!role.policies || role.policies.length == 0))
                .map((role) => role.roleId._id)}
              // linkRoles={currentRow.roles.map(role => role && role.roleId ? role.roleId._id : null)}
              linkAttributes={currentRow.attributes}
              handleChange={handleChange}
              handleChangeAddRowAttribute={handleChangeAddRowAttribute}
              i={state.i}
            />
          )}

          {/* Thanh tìm kiếm */}
          <SearchBar
            columns={[
              { title: translate('manage_link.url'), value: 'url' },
              { title: translate('manage_link.category'), value: 'category' },
              { title: translate('manage_link.description'), value: 'description' }
            ]}
            option={state.option}
            setOption={setOption}
            search={searchWithOption}
          />

          {/* Bảng dữ liệu */}
          <table className='table table-hover table-striped table-bordered' id={tableId}>
            <thead>
              <tr>
                <th>{translate('manage_link.url')}</th>
                <th>{translate('manage_link.category')}</th>
                <th>{translate('manage_link.description')}</th>
                <th>{translate('manage_link.roles')}</th>
                <th style={{ width: '120px' }}>
                  {translate('table.action')}
                  <DataTableSetting
                    columnArr={[
                      translate('manage_link.url'),
                      translate('manage_link.category'),
                      translate('manage_link.description'),
                      translate('manage_link.roles')
                    ]}
                    setLimit={setLimit}
                    tableId={tableId}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {link.listPaginate &&
                link.listPaginate.length > 0 &&
                link.listPaginate.map((link) => (
                  <tr key={link._id}>
                    <td>{link.url}</td>
                    <td>{link.category}</td>
                    <td>{link.description}</td>
                    <td>
                      <ToolTip
                        dataTooltip={link.roles
                          .filter((role) => role && role.roleId && (!role.policies || role.policies.length == 0))
                          .map((role) => role.roleId.name)}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <a className='edit' onClick={() => handleEdit(link)}>
                        <i className='material-icons'>edit</i>
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {link.isLoading ? (
            <div className='table-info-panel'>{translate('confirm.loading')}</div>
          ) : (
            link.listPaginate && link.listPaginate.length === 0 && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
          )}
          {/* PaginateBar */}
          <PaginateBar
            display={link.listPaginate.length}
            total={link.totalDocs}
            pageTotal={link.totalPages}
            currentPage={link.page}
            func={setPage}
          />
        </React.Fragment>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const { link, role } = state
  return { link }
}

// const getState = {
//     getLinks: LinkActions.get,
//     getRoles: RoleActions.get,
//     destroy: LinkActions.destroy,
//     getAttribute: AttributeActions.getAttributes
// }

const mapDispatchToProps = {
  getLinks: LinkActions.get,
  getRoles: RoleActions.get,
  destroy: LinkActions.destroy,
  getAttribute: AttributeActions.getAttributes
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManageLink))
