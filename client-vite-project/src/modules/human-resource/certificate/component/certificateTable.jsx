import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { SearchBar, DeleteNotification, PaginateBar, DataTableSetting, ToolTip, ConfirmNotification } from '../../../../common-components'

import { CertificateActions } from '../redux/actions'
import EditForm from './editForm'
import CreateForm from './createForm'

import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import Swal from 'sweetalert2'
import { MajorActions } from '../../major/redux/actions'
function CertificateTable(props) {
  console.log('prob ------', props)

  const tableId_constructor = 'table-manage-certificate'
  const defaultConfig = { name: '', page: 0, limit: 100 }
  const limit = getTableConfiguration(tableId_constructor, defaultConfig).limit

  const [state, setState] = useState({
    tableId: tableId_constructor,
    limit: limit,
    page: 0,
    name: '' // Mặc định tìm kiếm theo tên
  })

  let { certificateDuplicate, certificateDuplicateName } = state
  // Cac ham xu ly du lieu voi modal
  const handleAddCertificate = async (certificate) => {
    await setState({
      ...state
    })
    window.$('#modal-create-certificate').modal('show')
  }

  const setName = (e) => {
    const { value } = e.target
    setState({
      ...state,
      name: value
    })
  }

  const handleEdit = async (certificate) => {
    await setState({
      ...state,
      currentRow: certificate
    })
    window.$('#edit-certificate').modal('show')
  }

  const setPage = (page) => {
    setState({
      ...state,
      page
    })
    let { name, limit } = state
    const data = {
      limit,
      page,
      name: name
    }
    props.get(data)
  }

  const setLimit = (number) => {
    setState({
      ...state,
      limit: number
    })
    let { name, page } = state
    const data = {
      limit: number,
      page,
      name: name
    }
    props.get(data)
  }

  const searchWithOption = async () => {
    const data = {
      limit: state.limit,
      page: state.page,
      name: state.name
    }
    await props.get(data)
  }

  useEffect(() => {
    props.get({ name: state.name, page: state.page, limit: state.limit })
    props.getListMajor({ name: '', page: 0, limit: 1000 })
  }, [])

  const { certificate, major, translate } = props
  const { currentRow, option, tableId } = state
  console.log('currentRow', currentRow)

  return (
    <React.Fragment>
      {/* Button thêm bằng cấp - chứng chỉ mới */}
      <div style={{ display: 'flex', marginBottom: 20, marginTop: 20, float: 'right' }}>
        <a className='btn btn-success pull-right' href='#modal-create-certificate' title='Add certificate' onClick={handleAddCertificate}>
          Thêm
        </a>
      </div>

      {<CreateForm list={major?.listMajor} />}

      {/* Thanh tìm kiếm */}
      <div className='form-inline' style={{ marginBottom: '20px', marginTop: '20px' }}>
        <div className='form-group' style={{ marginRight: '20px' }}>
          <label className='form-control-static' style={{ marginRight: '20px' }}>
            Tên chứng chỉ
          </label>
          <input
            type='text'
            className='form-control'
            name='name'
            onChange={setName}
            placeholder={'Nhập tên bằng cấp - chứng chỉ'}
            autoComplete='off'
          />
        </div>
        <div className='form-group'>
          <label></label>
          <button
            type='button'
            className='btn btn-success'
            title={translate('asset.general_information.search')}
            onClick={searchWithOption}
          >
            {translate('asset.general_information.search')}
          </button>
        </div>
      </div>

      {/* Bảng dữ liệu bằng cấp - chứng chỉ */}
      <table className='table table-hover table-striped table-bordered' id={tableId}>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Tên viết tắt</th>
            {/* <th>Chuyên ngành</th> */}
            <th>Mô tả</th>
            <th style={{ width: '120px', textAlign: 'center' }}>
              {translate('table.action')}
              <DataTableSetting
                columnName={translate('table.action')}
                columnArr={['Tên', 'Tên viết tắt', 'Chuyên ngành']}
                setLimit={setLimit}
                tableId={tableId}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {certificate?.listCertificate?.map((certificate) => (
            <tr
              key={`certificateList${certificate._id}`}
              style={
                certificateDuplicateName && certificateDuplicateName.includes(certificate.name.trim().toLowerCase().replaceAll(' ', ''))
                  ? { color: 'orangered', fontWeight: 'bold' }
                  : { color: '' }
              }
            >
              <td> {certificate.name} </td>
              <td> {certificate.abbreviation} </td>
              {/* <td><ToolTip dataTooltip={certificate?.majors?.length ? certificate.majors.map(major => major ? major.name : "") : []} /></td> */}
              <td> {certificate.description}</td>
              <td style={{ textAlign: 'center' }}>
                <a className='edit' href={`#${certificate._id}`} onClick={() => handleEdit(certificate)}>
                  <i className='material-icons'>edit</i>
                </a>
                {/* <a className="delete" href={`#${certificate._id}`} onClick={() => handleDelete(certificate)}><i className="material-icons">delete</i></a> */}
                {
                  <ConfirmNotification
                    icon='question'
                    title='Xóa chứng chỉ'
                    name='delete'
                    className='text-red'
                    content={`<h4>Delete ${certificate.name}</h4>`}
                    func={() => props.deleteCertificate(certificate._id)}
                  />
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Form chỉnh sửa thông tin bằng cấp - chứng chỉ */}

      {currentRow && (
        <EditForm
          certificateId={currentRow._id}
          certificateName={currentRow.name}
          certificateAbbreviation={currentRow.abbreviation}
          certificateDescription={currentRow.description}
          listData={major?.listMajor}
        />
      )}
      {certificate.isLoading ? (
        <div className='table-info-panel'>{translate('confirm.loading')}</div>
      ) : (
        certificate.listPaginate &&
        certificate.listPaginate.length === 0 && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
      )}
      {/* PaginateBar */}
      <PaginateBar
        display={certificate.listPaginate?.length}
        total={certificate?.totalDocs}
        pageTotal={certificate?.totalPages}
        currentPage={certificate?.page}
        func={setPage}
      />
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { major, certificate } = state
  return { major, certificate }
}

const mapDispatchToProps = {
  get: CertificateActions.getListCertificate,
  getListMajor: MajorActions.getListMajor,
  deleteCertificate: CertificateActions.deleteCertificate
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CertificateTable))
