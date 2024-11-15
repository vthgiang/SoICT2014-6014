import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DateTimeConverter, DataTableSetting, TreeSelect, SelectBox, ExportExcel, PaginateBar } from '../../../../../common-components'
import { DocumentActions } from '../../../redux/actions'
import { RoleActions } from '../../../../super-admin/role/redux/actions'
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions'
import { getStorage } from '../../../../../config'
import DocumentInformation from '../documents/documentInformation'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'

function DocumentShow(props) {
  const { type, typeId } = props
  const TableId = `table-manage-document-${typeId}`
  const defaultConfig = { limit: 5 }
  const Limit = getTableConfiguration(TableId, defaultConfig).limit
  const [state, setState] = useState({
    option: 'name',
    value: '',
    limit: Limit,
    page: 1,
    tableId: TableId
  })
  useEffect(() => {
    props.getAllRoles()
    props.getAllDepartments()
    props.getUserDocumentStatistics(getStorage('currentRole'), type, { page: state.page, limit: state.limit })
  }, [])

  const toggleDocumentInformation = async (data) => {
    await setState({
      ...state,
      currentRow: data
    })
    window.$('#modal-information-user-document').modal('show')
    props.increaseNumberView(data._id)
  }

  function requestDownloadDocumentFile(id, fileName, numberVersion) {
    props.downloadDocumentFile(id, fileName, numberVersion)
  }

  function requestDownloadDocumentFileScan(id, fileName, numberVersion) {
    props.downloadDocumentFileScan(id, fileName, numberVersion)
  }
  function setOption(title, option) {
    setState({
      ...state,
      [title]: option
    })
  }
  const findPath = (select) => {
    const archives = props.documents.administration.archives.list
    let paths = select.map((s) => {
      let archive = archives.filter((arch) => arch._id === s)
      return archive[0] ? archive[0].path : ''
    })
    return paths
  }
  const formatDate = (date, monthYear = false) => {
    if (date) {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()
      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day
      if (monthYear === true) {
        return [month, year].join('-')
      } else return [day, month, year].join('-')
    } else {
      return date
    }
  }
  function handleCategoryChange(value) {
    setState({
      ...state,
      category: value
    })
  }
  function handleDomainChange(value) {
    setState({
      ...state,
      domain: value
    })
  }
  function handleDomains(value) {
    setState({
      ...state,
      documentDomains: value
    })
  }
  function handleNameChange(e) {
    const value = e.target.value
    setState({
      ...state,
      name: value.trim()
    })
  }
  function handleArchiveChange(value) {
    setState({
      ...state,
      archive: value
    })
  }

  const findRole = (id) => {
    const listRole = props.role.list
    let role = listRole.filter((role) => role._id === id)
    if (role && role.length) return role[0].name
    else return ''
  }
  function handleIssuingBodyChange(e) {
    const value = e.target.value
    setState({
      ...state,
      issuingBody: value.trim()
    })
  }
  function handleArchivedRecordPlaceOrganizationalUnit(value) {
    setState((state) => {
      return {
        ...state,
        organizationUnit: value
      }
    })
  }
  const searchWithOption = async () => {
    let path = state.archive ? findPath(state.archive) : ''
    const data = {
      limit: state.limit,
      page: 1,
      name: state.name,
      category: state.category ? state.category[0] : '',
      domains: state.domain ? state.domain : '',
      archives: path && path.length ? path : '',
      issuingBody: state.issuingBody ? state.issuingBody : '',
      organizationUnit: state.organizationUnit && state.organizationUnit[0] !== '' ? state.organizationUnit : ''
    }
    await props.getUserDocumentStatistics(getStorage('currentRole'), type, data)
  }
  const convertDataToExportData = (data) => {
    let newData = []
    for (let i = 0; i < data.length; i++) {
      let element = {}
      let x = data[i]
      let length = 0
      let domain = ''
      let length_domains, length_archives, length_relationship, length_roles, length_versions, length_logs, length_views, length_downloads
      if (x.domains && x.domains.length) {
        element.domains = x.domains[0].name
        length_domains = x.domains.length
      } else {
        element.domains = ''
        length_domains = 0
      }
      if (x.archives && x.archives.length) {
        element.archives = x.archives[0].path
        length_archives = x.archives.length
      } else {
        element.archives = ''
        length_archives = 0
      }
      if (x.roles && x.roles.length) {
        element.roles = findRole(x.roles[0])
        length_roles = x.roles.length
      } else {
        element.roles = 0
        length_roles = 0
      }
      if (x.relationshipDocuments && x.relationshipDocuments.length) {
        element.relationshipDocuments = x.relationshipDocuments[0].name
        length_relationship = x.relationshipDocuments.length
      } else {
        element.relationshipDocuments = ''
        length_relationship = 0
      }
      if (x.versions && x.versions.length) {
        element.versionName = x.versions[0].versionName
        element.issuingDate = formatDate(x.versions[0].issuingDate)
        element.effectiveDate = formatDate(x.versions[0].effectiveDate)
        element.expiredDate = formatDate(x.versions[0].expiredDate)
        length_versions = x.versions.length
      } else {
        element.versionName = ''
        element.issuingDate = ''
        element.effectiveDate = ''
        element.expiredDate = ''
        length_versions = 0
      }
      if (x.views && x.views.length) {
        element.viewer = x.views[0].viewer.name
        element.timeView = formatDate(x.views[0].time)
        length_views = x.views.length
      } else {
        element.viewer = ''
        element.timeView = ''
        length_views = 0
      }
      if (x.downloads && x.downloads.length) {
        element.downloader = x.downloads[0].downloader.name
        element.timeDownload = formatDate(x.downloads[0].time)
        length_downloads = x.downloads.length
      } else {
        element.downloader = ''
        element.timeDownload = ''
        length_downloads = 0
      }
      if (x.logs && x.logs.length) {
        element.title = x.logs[0].title
        element.description = x.logs[0].description
        length_logs = x.logs.length
      } else {
        element.title = ''
        element.descriptionLogs = ''
        length_logs = 0
      }
      element.name = x.name
      element.description = x.description ? x.description : ''
      element.issuingBody = x.issuingBody ? x.issuingBody : ''
      element.signer = x.signer ? x.signer : ''
      element.category = x.category ? x.category.name : ''
      element.relationshipDescription = x.relationshipDescription ? x.relationshipDescription : ''
      element.organizationUnitManager = x.organizationUnitManager ? x.organizationUnitManager.name : ''
      element.officialNumber = x.officialNumber ? x.officialNumber : ''
      let max_length = Math.max(
        length_domains,
        length_archives,
        length_relationship,
        length_roles,
        length_versions,
        length_logs,
        length_views,
        length_downloads
      )

      newData = [...newData, element]
      if (max_length > 1) {
        for (let i = 1; i < max_length; i++) {
          let object = {
            name: '',
            description: '',
            issuingBody: '',
            signer: '',
            category: '',
            relationshipDescription: '',
            organizationUnitManager: '',
            officialNumber: '',
            domains: i < length_domains ? x.domains[i].name : '',
            archives: i < length_archives ? x.archives[i].path : '',
            roles: i < length_roles ? findRole(x.roles[i]) : '',
            relationshipDocuments: i < length_relationship ? x.relationshipDocuments[i].name : '',
            versionName: i < length_versions ? x.versions[i].versionName : '',
            issuingDate: i < length_versions ? formatDate(x.versions[i].issuingDate) : '',
            effectiveDate: i < length_versions ? formatDate(x.versions[i].effectiveDate) : '',
            expiredDate: i < length_versions ? formatDate(x.versions[i].expiredDate) : '',
            viewer: i < length_views ? x.views[i].viewer.name : '',
            timeView: i < length_views ? formatDate(x.views[i].time) : '',
            downloader: i < length_downloads ? x.downloads[i].downloader.name : '',
            timeDownload: i < length_downloads ? formatDate(x.downloads[i].time) : '',
            title: i < length_logs ? x.logs[i].title : '',
            descriptionLogs: i < length_logs ? x.logs[i].description : ''
          }
          newData = [...newData, object]
        }
      }
    }
    let exportData = {
      fileName: 'Bảng thống kê tài liệu',
      dataSheets: [
        {
          sheetName: 'sheet1',
          sheetTitle: 'Danh sách tài liệu',
          tables: [
            {
              tableName: 'Bảng thống kê tài liệu',
              merges: [
                {
                  key: 'Versions',
                  columnName: 'Phiên bản',
                  keyMerge: 'versionName',
                  colspan: 3
                },
                {
                  key: 'Views',
                  columnName: 'Người đã xem',
                  keyMerge: 'viewer',
                  colspan: 2
                },
                {
                  key: 'Downloads',
                  columnName: 'Người đã tải',
                  keyMerge: 'downloader',
                  colspan: 2
                },
                {
                  key: 'Logs',
                  columnName: 'Lịch sử chỉnh sửa',
                  keyMerge: 'title',
                  colspan: 2
                }
              ],
              rowHeader: 2,
              columns: [
                { key: 'STT', value: 'STT' },
                { key: 'name', value: 'Tên' },
                { key: 'description', value: 'Mô tả' },
                { key: 'category', value: 'Loai tài liệu' },
                { key: 'issuingBody', value: 'Cơ quan ban hành' },
                { key: 'signer', value: 'Người ký' },
                { key: 'relationshipDescription', value: 'Mô tả liên kết' },
                { key: 'organizationUnitManager', value: 'Cơ quan quản lí' },
                { key: 'domains', value: 'Danh mục' },
                { key: 'archives', value: 'Địa chỉ lưu trữ' },
                { key: 'roles', value: 'Các chức danh được xem' },
                { key: 'versionName', value: 'Tên phiên bản' },
                { key: 'issuingDate', value: 'Ngày ban hành' },
                { key: 'effectiveDate', value: 'Ngày hiệu lực' },
                { key: 'viewer', value: 'Người đã xem' },
                { key: 'timeView', value: 'Thời gian xem' },
                { key: 'downloader', value: 'Người đã tải' },
                { key: 'timeDownload', value: 'Người đã tải' },
                { key: 'title', value: 'Tiêu đề chỉnh sửa' },
                { key: 'descriptionLogs', value: 'Chỉnh sửa chi tiết' }
              ],
              data: newData
            }
          ]
        }
      ]
    }

    return exportData
  }

  const convertData = (data) => {
    let array = data.map((item) => {
      return {
        value: item.id,
        text: item.name
      }
    })
    array.unshift({ value: '', text: 'Tất cả các loại' })
    return array
  }
  const setPage = async (page) => {
    setState({ page })
    let path = state.archive ? findPath(state.archive) : ''
    setState({ page })
    const data = {
      limit: state.limit,
      page: page,
      name: state.name,
      category: state.category ? state.category[0] : '',
      domains: state.domain ? state.domain : '',
      archives: path && path.length ? path : ''
    }
    await props.getUserDocumentStatistics(getStorage('currentRole'), type, data)
  }

  function setLimit(number) {
    if (state.limit !== number) {
      setState({ limit: number })
      const data = { limit: number, page: state.page }
      props.getUserDocumentStatistics(getStorage('currentRole'), type, data)
    }
  }
  const { translate, department } = props
  const { user } = props.documents
  const { common } = user
  let dataShow = null
  switch (type) {
    case 'common':
      dataShow = user.common
      break

    case 'downloaded':
      dataShow = user.downloaded
      break
    case 'latest':
      dataShow = user.latest
      break
    default:
      break
  }
  let paginate = dataShow.paginate
  console.log(paginate)

  const { isLoading } = props.documents
  const { domains, categories, archives } = props.documents.administration
  const docs = props.documents.user.data
  const { currentRow, archive, category, domain, tableId } = state
  const listDomain = domains.list
  const listCategory = convertData(categories.list)
  const listArchive = archives.list
  let list = []
  if (isLoading === false) {
    list = docs.list
  }
  let dataExport = []
  if (isLoading === false) {
    dataExport = dataShow.list
  }
  let exportData = dataExport ? convertDataToExportData(dataExport) : ''

  const convertDataOrgan = (data) => {
    data.unshift({ value: '', text: translate('document.store.all') })
    return data
  }
  return (
    <div className='qlcv'>
      <React.Fragment>
        {currentRow !== undefined && (
          <DocumentInformation
            documentId={currentRow._id}
            documentName={currentRow.name}
            documentDescription={currentRow.description}
            documentCategory={currentRow.category ? currentRow.category.name : ''}
            documentDomains={currentRow.domains ? currentRow.domains.map((domain) => domain.name) : []}
            documentArchives={currentRow.archives ? currentRow.archives.map((archive) => archive.path) : []}
            documentIssuingBody={currentRow.issuingBody}
            documentOfficialNumber={currentRow.officialNumber}
            documentSigner={currentRow.signer}
            documentVersions={currentRow.versions}
            documentRelationshipDescription={currentRow.relationshipDescription}
            documentRelationshipDocuments={
              currentRow.relationshipDocuments ? currentRow.relationshipDocuments.map((document) => document.name) : []
            }
            documentRoles={currentRow.roles}
            documentArchivedRecordPlaceInfo={currentRow.archivedRecordPlaceInfo}
            documentArchivedRecordPlaceOrganizationalUnit={currentRow.archivedRecordPlaceOrganizationalUnit}
            documentArchivedRecordPlaceManager={currentRow.archivedRecordPlaceManager}
            documentLogs={currentRow.logs}
          />
        )}
        {<ExportExcel id='export-document-downloaded' exportData={exportData} style={{ marginLeft: 5 }} />}
        <div className='form-inline'>
          <div className='form-group'>
            <label>{translate('document.category')}</label>
            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
              id={`stattus-category-${typeId}`}
              style={{ width: '100%' }}
              items={listCategory}
              onChange={handleCategoryChange}
              value={category}
            />
          </div>
          <div className='form-group'>
            <label>{translate('document.store.information')}</label>
            <TreeSelect
              id='tree-select-search-archive'
              data={listArchive}
              className='form-control'
              handleChange={handleArchiveChange}
              value={archive}
              mode='hierarchical'
              style={{ width: ' 100%' }}
            />
          </div>
        </div>
        <div className='form-inline'>
          <div className='form-group'>
            <label>{translate('document.domain')}</label>
            <TreeSelect
              id='tree-select-search-domain'
              data={listDomain}
              className='form-control'
              handleChange={handleDomainChange}
              value={domain}
              mode='hierarchical'
              style={{ width: '100%' }}
            />
          </div>
          <div className='form-group'>
            <label>{translate('document.name')}</label>
            <input type='text' className='form-control' onChange={handleNameChange} />
          </div>
        </div>
        <div className='form-inline'>
          <div className='form-group'>
            <label>{translate('document.store.organizational_unit_manage')}</label>
            <SelectBox
              id={`select-documents-organizational-unit-manage-table-${typeId}`}
              className='form-control select2'
              style={{ width: '100%' }}
              items={convertDataOrgan(
                department.list.map((organ) => {
                  return { value: organ._id, text: organ.name }
                })
              )}
              onChange={handleArchivedRecordPlaceOrganizationalUnit}
              multiple={false}
            />
          </div>
          <div className='form-group'>
            <label>{translate('document.doc_version.issuing_body')}</label>
            <input type='text' className='form-control' onChange={handleIssuingBodyChange} />
          </div>
          <div className='form-group' style={{ marginLeft: 0 }}>
            <label></label>
            <button type='button' className='btn btn-success' onClick={() => searchWithOption()}>
              {translate('kpi.organizational_unit.management.over_view.search')}
            </button>
          </div>
        </div>

        <DataTableSetting
          columnArr={[
            translate('document.name'),
            translate('document.description'),
            translate('document.issuing_date'),
            translate('document.effective_date'),
            translate('document.expired_date'),
            translate('document.upload_file'),
            translate('document.upload_file_scan')
          ]}
          setLimit={setLimit}
          tableId={tableId}
        />
        <table className='table table-hover table-striped table-bordered' id={tableId} style={{ marginBottom: '0px' }}>
          <thead>
            <tr>
              <th>{translate('document.name')}</th>
              <th>{translate('document.description')}</th>
              <th>{translate('document.issuing_date')}</th>
              <th>{translate('document.effective_date')}</th>
              <th>{translate('document.expired_date')}</th>
              <th>{translate('document.upload_file')}</th>
              <th>{translate('document.upload_file_scan')}</th>
              <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
            </tr>
          </thead>
          <tbody>
            {paginate &&
              paginate.length > 0 &&
              paginate.map((doc) => (
                <tr key={doc._id}>
                  <td>{doc.name}</td>
                  <td>{doc.description}</td>
                  <td>{doc.versions.length ? formatDate(doc.versions[doc.versions.length - 1].issuingDate) : null}</td>
                  <td>{doc.versions.length ? formatDate(doc.versions[doc.versions.length - 1].effectiveDate) : null}</td>
                  <td>{doc.versions.length ? formatDate(doc.versions[doc.versions.length - 1].expiredDate) : null}</td>
                  <td>
                    <a href='#' onClick={() => requestDownloadDocumentFile(doc._id, doc.name, doc.versions.length - 1)}>
                      <u>{doc.versions.length && doc.versions[doc.versions.length - 1].file ? translate('document.download') : ''}</u>
                    </a>
                  </td>
                  <td>
                    <a href='#' onClick={() => requestDownloadDocumentFileScan(doc._id, 'SCAN_' + doc.name, doc.versions.length - 1)}>
                      <u>
                        {doc.versions.length && doc.versions[doc.versions.length - 1].scannedFileOfSignedDocument
                          ? translate('document.download')
                          : ''}
                      </u>
                    </a>
                  </td>
                  <td style={{ width: '10px' }}>
                    <a className='text-green' title={translate('document.edit')} onClick={() => toggleDocumentInformation(doc)}>
                      <i className='material-icons'>visibility</i>
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          paginate?.length === 0 && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}
        <PaginateBar pageTotal={dataShow.totalPages} currentPage={dataShow.page} func={setPage} />
      </React.Fragment>
    </div>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  getAllDepartments: DepartmentActions.get,
  getAllRoles: RoleActions.get,
  getAllDocuments: DocumentActions.getDocumentsUserCanView,
  increaseNumberView: DocumentActions.increaseNumberView,
  downloadDocumentFile: DocumentActions.downloadDocumentFile,
  downloadDocumentFileScan: DocumentActions.downloadDocumentFileScan,
  getUserDocumentStatistics: DocumentActions.getUserDocumentStatistics
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DocumentShow))
