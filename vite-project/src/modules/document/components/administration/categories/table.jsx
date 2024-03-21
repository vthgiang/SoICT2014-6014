import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'

import { SearchBar, DataTableSetting, PaginateBar, ExportExcel } from '../../../../../common-components'
import { DocumentActions } from '../../../redux/actions'

import CreateForm from './createForm'
import EditForm from './editForm'
import { CategoryImportForm } from '../../../components/administration/categories/categoryImportForm'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
function Table(props) {
  const TableId = 'table-manage-document-categories'
  const defaultConfig = { limit: 5 }
  const Limit = getTableConfiguration(TableId, defaultConfig).limit
  const [state, setState] = useState({
    tableId: TableId,
    option: 'name',
    value: '',
    limit: Limit,
    page: 1
  })
  useEffect(() => {
    props.getDocumentCategories({ page: state.page, limit: state.limit })
  }, [])
  const deleteDocumentCategory = (id, info) => {
    const { translate } = props
    Swal.fire({
      html: `<h4 style="color: red"><div>${translate('document.administration.categories.delete')}</div> <div>"${info}" ?</div></h4>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: translate('general.no'),
      confirmButtonText: translate('general.yes')
    }).then((result) => {
      if (result.value) {
        props.deleteDocumentCategory(id)
      }
    })
  }

  const showModalEditCategory = async (currentRow) => {
    await setState({
      ...state,
      currentRow: currentRow
    })
    window.$('#modal-edit-document-category').modal('show')
  }
  const convertDataToExportData = (data) => {
    data = data.map((x, index) => {
      return {
        STT: index + 1,
        name: x.name,
        description: x.description
      }
    })
    let exportData = {
      fileName: 'Bảng thống kê loại tài liệu',
      dataSheets: [
        {
          sheetName: 'Sheet1',
          tables: [
            {
              tableName: 'Bảng thống kê loại tài liệu',
              rowHeader: 1,
              columns: [
                { key: 'STT', value: 'STT' },
                { key: 'name', value: 'Tên loại tài liệu' },
                { key: 'description', value: 'Mô tả loại tài liệu' }
              ],
              data: data
            }
          ]
        }
      ]
    }
    return exportData
  }
  const setPage = async (page) => {
    setState({
      ...state,
      page: page
    })
    const data = {
      limit: state.limit,
      page: page,
      key: state.option,
      value: state.value
    }
    await props.getDocumentCategories(data)
  }

  const setLimit = (number) => {
    if (state.limit !== number) {
      setState({
        ...state,
        limit: number
      })
      const data = { limit: number, page: state.page }
      props.getDocumentCategories(data)
    }
  }

  const setOption = (title, option) => {
    setState({
      ...state,
      [title]: option
    })
  }

  const searchWithOption = async () => {
    const data = {
      limit: state.limit,
      page: 1,
      key: state.option,
      value: state.value
    }
    await props.getDocumentCategories(data)
  }
  const { translate } = props
  const { isLoading } = props.documents
  const { categories } = props.documents.administration
  const { paginate } = categories
  const { currentRow, tableId } = state
  const { list } = categories
  let dataExport = []
  if (isLoading === false) {
    dataExport = list
  }
  let exportData = convertDataToExportData(dataExport)
  return (
    <React.Fragment>
      <CreateForm />
      {currentRow && <EditForm categoryId={currentRow._id} categoryName={currentRow.name} categoryDescription={currentRow.description} />}
      <ExportExcel
        id='export-document-category'
        exportData={exportData}
        style={{ marginRight: 5 }}
        buttonName={translate('document.export')}
      />
      <SearchBar
        columns={[
          { title: translate('document.administration.categories.name'), value: 'name' },
          { title: translate('document.administration.categories.description'), value: 'description' }
        ]}
        option={state.option}
        setOption={setOption}
        search={searchWithOption}
      />
      <table className='table table-hover table-striped table-bordered' id={tableId}>
        <thead>
          <tr>
            <th>{translate('document.administration.categories.name')}</th>
            <th>{translate('document.administration.categories.description')}</th>
            <th style={{ width: '120px', textAlign: 'center' }}>
              {translate('general.action')}
              <DataTableSetting
                columnArr={[
                  translate('document.administration.categories.name'),
                  translate('document.administration.categories.description')
                ]}
                setLimit={setLimit}
                tableId={tableId}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {paginate.length > 0 ? (
            paginate.map((docType) => (
              <tr key={docType._id}>
                <td>{docType.name}</td>
                <td>{docType.description}</td>
                <td>
                  <a
                    className='text-yellow'
                    onClick={() => showModalEditCategory(docType)}
                    title={translate('document.administration.categories.edit')}
                  >
                    <i className='material-icons'>edit</i>
                  </a>
                  <a
                    className='text-red'
                    onClick={() => deleteDocumentCategory(docType._id, docType.name)}
                    title={translate('document.administration.categories.delete')}
                  >
                    <i className='material-icons'>delete</i>
                  </a>
                </td>
              </tr>
            ))
          ) : isLoading ? (
            <tr>
              <td colSpan={3}>{translate('general.loading')}</td>
            </tr>
          ) : (
            <tr>
              <td colSpan={3}>{translate('general.no_data')}</td>
            </tr>
          )}
        </tbody>
      </table>
      <PaginateBar pageTotal={categories.totalPages} currentPage={categories.page} func={setPage} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  getDocumentCategories: DocumentActions.getDocumentCategories,
  deleteDocumentCategory: DocumentActions.deleteDocumentCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Table))
