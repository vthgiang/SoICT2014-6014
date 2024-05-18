import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import {
  ConfirmNotification,
  PaginateBar,
  SelectMulti,
  DatePicker,
} from '../../../../../common-components'

import { BiddingPackageCreateForm, BiddingPackageDetailForm, BiddingPackageEditFrom } from './combinedContent'
// , BiddingPackageDetailForm, BiddingPackageEditFrom, BiddingPackageImportForm

import { BiddingPackageManagerActions } from '../redux/actions'
import { FieldsActions } from '../../../../human-resource/field/redux/actions'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { MajorActions } from '../../../../human-resource/major/redux/actions'
import { CareerReduxAction } from '../../../../human-resource/career/redux/actions'
import { CertificateActions } from '../../../../human-resource/certificate/redux/actions'
import CreateBiddingContract from '../../../bidding-contract/component/createContract'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { ConfigurationActions } from '../../../../super-admin/module-configuration/redux/actions'

const BiddingPackageManagement = (props) => {
  let search = window.location.search.split('?')
  let keySearch = 'nameSearch'
  let _nameSearch = null

  useEffect(() => {
    for (let n in search) {
      let index = search[n].lastIndexOf(keySearch)
      if (index !== -1) {
        _nameSearch = search[n].slice(keySearch.length + 1, search[n].length)
        if (_nameSearch !== 'null' && _nameSearch.trim() !== '') {
          _nameSearch = _nameSearch.split(',')
        } else _nameSearch = null
        break
      }
    }
  }, [search])

  const tableId = 'table-biddingPackage-management'
  const defaultConfig = { limit: 5 }
  const _limit = getTableConfiguration(tableId, defaultConfig).limit

  const [state, setState] = useState({
    tableId,
    position: null,
    gender: null,
    status: [0, 1, 2, 3, 4],
    type: [1, 2, 3, 4, 5],
    professionalSkills: null,
    careerFields: null,
    page: 0,
    limit: 5,
    currentRow: {},
    currentRowView: {}
  })

  useEffect(() => {
    props.getListFields({ page: 0, limit: 10000 })
    props.getListMajor({ name: '', page: 0, limit: 1000 })
    props.getListCareerPosition({ name: '', page: 0, limit: 1000 })
    props.getListCertificate({ name: '', page: 0, limit: 1000 })
    props.getAllUserInAllUnitsOfCompany()
    props.getAllUser()
    props.getConfiguration()
  }, [])

  useEffect(() => {
    props.getAllBiddingPackage(state)
  }, [state.limit, state.page])

  /**
   * Function format dữ liệu Date thành string
   * @param {*} date : Ngày muốn format
   * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
   */
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

  // Function bắt sự kiện thêm lương nhân viên bằng tay
  const createBiddingPackage = () => {
    window.$('#modal-create-bidding-package').modal({ backdrop: 'static', display: 'show' })
  }

  // Function bắt sự kiện thêm lương nhân viên bằng import file
  const _importBiddingPackage = async () => {
    await setState((state) => ({
      ...state,
      importBiddingPackage: true
    }))
    window.$('#modal_import_file').modal('show')
  }

  /**
   *  Bắt sự kiện click xem thông tin nhân viên
   * @param {*} value : Thông tin nhân viên muốn xem
   */
  const handleView = async (value) => {
    await setState((state) => {
      return {
        ...state,
        currentRowView: value
      }
    })
    window.$(`#modal-detail-bidding-package${value._id}`).modal('show')
  }

  /**
   * Bắt sự kiện click chỉnh sửa thông tin nhân viên
   * @param {*} value : Thông tin nhân viên muốn chỉnh sửa
   */
  const handleEdit = async (value) => {
    await setState((state) => {
      return {
        ...state,
        currentRow: value
      }
    })
    // setTimeout(() => {
    window.$(`#modal-edit-bidding-package${value._id}`).modal('show')
    // }, 500);
  }

  /**
   * Bắt sự kiện click chỉnh sửa thông tin nhân viên
   * @param {*} value : Thông tin nhân viên muốn chỉnh sửa
   */
  const handleCreateContract = async (value) => {
    await setState((state) => {
      return {
        ...state,
        currentRowCreateContract: value
      }
    })
    setTimeout(() => {
      window.$(`#modal-create-package-biddingContract-${value._id}`).modal('show')
    }, 500)
  }

  /**
   * Function lưu giá trị trạng thái vào state khi thay đổi
   * @param {*} value : Giá trị trạng thái
   */
  const handleStatusChange = (value) => {
    if (value.length === 0) {
      value = []
    }
    setState((state) => ({
      ...state,
      status: value
    }))
  }

  /**
   * Function lưu giá trị trạng thái vào state khi thay đổi
   * @param {*} value : Giá trị trạng thái
   */
  const handleTypeChange = (value) => {
    if (value.length === 0) {
      value = []
    }
    setState((state) => ({
      ...state,
      type: value
    }))
  }

  /**
   * Function lưu giá trị ngày hết hạn hợp đồng vào state khi thay đổi
   * @param {*} value : Tháng hết hạn hợp đồng
   */
  const handlestartDateSearchChange = (value) => {
    if (value) {
      let partValue = value.split('-')
      value = [partValue[2], partValue[1], partValue[0]].join('-')
    }
    setState((state) => ({
      ...state,
      startDateSearch: value
    }))
  }

  /**
   * Function lưu giá trị ngày hết hạn hợp đồng vào state khi thay đổi
   * @param {*} value : Tháng hết hạn hợp đồng
   */
  const handleendDateSearchChange = (value) => {
    if (value) {
      let partValue = value.split('-')
      value = [partValue[2], partValue[1], partValue[0]].join('-')
    }
    setState((state) => ({
      ...state,
      endDateSearch: value
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setState((state) => ({
      ...state,
      [name]: value
    }))
  }

  /** Function bắt sự kiện tìm kiếm */
  const handleSunmitSearch = async () => {
    props.getAllBiddingPackage(state)
  }

  /**
   * Bắt sự kiện setting số dòng hiện thị trên một trang
   * @param {*} number : Số dòng trên 1 trang
   */
  const setLimit = async (number) => {
    await setState((state) => ({
      ...state,
      limit: parseInt(number)
    }))
  }

  /**
   * Bắt sự kiện chuyển trang
   * @param {*} pageNumber : Số trang muốn xem
   */
  const setPage = async (pageNumber) => {
    let page = (pageNumber - 1) * state.limit
    await setState((state) => ({
      ...state,
      page: parseInt(page)
    }))
  }

  const { biddingPackagesManager, translate } = props

  const { limit, page, startDateSearch, endDateSearch, currentRow, currentRowView, currentRowCreateContract, status, type, isLoading } =
    state

  let listBiddingPackages = []
  if (biddingPackagesManager.listBiddingPackages) {
    listBiddingPackages = biddingPackagesManager.listBiddingPackages
  }

  let pageTotal =
    biddingPackagesManager.totalList % limit === 0
      ? parseInt(biddingPackagesManager.totalList / limit)
      : parseInt(biddingPackagesManager.totalList / limit + 1)
  let currentPage = parseInt(page / limit + 1)

  return (
    <div className='box'>
      <div className='box-body qlcv'>
        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12'>
            {/* Button thêm mới nhân viên */}
            <div className='dropdown'>
              <button
                type='button'
                className='btn btn-success dropdown-toggle pull-right'
                data-toggle='dropdown'
                aria-expanded='true'
                title='Thêm gói thầu'
                onClick={createBiddingPackage}
              >
                Thêm gói thầu
              </button>
            </div>
            {/* <button type="button" style={{ marginRight: 15, marginTop: 0 }} className="btn btn-primary pull-right" onClick={handleExportExcel} >{translate('human_resource.name_button_export')}<i className="fa fa-fw fa-file-excel-o"> </i></button> */}
          </div>
        </div>

        <div className='form-inline' style={{ marginTop: '10px' }}>
          {/* Tên gói thầu */}
          <div className='form-group'>
            <label className='form-control-static'>Tên gói thầu</label>
            <input
              type='text'
              className='form-control'
              name='nameSearch'
              onChange={handleChange}
              placeholder='Tên gói thầu'
              autoComplete='off'
            />
          </div>
          {/* Loại gói thầu  */}
          <div className='form-group'>
            <label className='form-control-static'>Mã gói thầu</label>
            <input
              type='text'
              className='form-control'
              name='codeSearch'
              onChange={handleChange}
              placeholder='Mã gói thầu'
              autoComplete='off'
            />
          </div>
          {/* Trạng thái */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('page.status')}</label>
            <SelectMulti
              id={`multiSelectStatus`}
              multiple='multiple'
              options={{ nonSelectedText: 'Chọn trạng thái', allSelectedText: 'Chọn tất cả' }}
              value={status}
              items={[
                { value: 0, text: 'Đã đóng thầu' },
                { value: 1, text: 'Hoạt động' },
                { value: 2, text: 'Chờ kết quả dự thầu' },
                { value: 3, text: 'Đang thực hiện' },
                { value: 4, text: 'Hoàn thành' }
              ]}
              onChange={handleStatusChange}
            ></SelectMulti>
          </div>
        </div>

        <div className='form-inline'>
          {/* Loại gói thầu */}
          <div className='form-group'>
            <label className='form-control-static'>Loại gói thầu</label>
            <SelectMulti
              id={`multiSelectType`}
              multiple='multiple'
              options={{ nonSelectedText: 'Chọn loại gói thầu', allSelectedText: 'Chọn tất cả' }}
              value={type}
              items={[
                { value: 1, text: 'Tư vấn' },
                { value: 2, text: 'Phi tư vấn' },
                { value: 3, text: 'Hàng hóa' },
                { value: 4, text: 'Xây dựng' },
                { value: 5, text: 'Hỗn hợp' }
              ]}
              onChange={handleTypeChange}
            ></SelectMulti>
          </div>
          {/* Thời gian bắt đầu */}
          <div className='form-group'>
            <label title='Thời gian bắt đầu' className='form-control-static'>
              Thời gian bắt đầu
            </label>
            <DatePicker id='month-startDate-contract' value={startDateSearch} onChange={handlestartDateSearchChange} />
          </div>
          {/* Thời gian kết thúc */}
          <div className='form-group'>
            <label title='Thời gian kết thúc' className='form-control-static'>
              Thời gian kết thúc
            </label>
            <DatePicker id='month-endDate-contract' value={endDateSearch} onChange={handleendDateSearchChange} />
          </div>
        </div>

        <div className='row' style={{ marginBottom: '15px', marginTop: '10px' }}>
          <div className='col-md-12' style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type='button' className='btn btn-success' title={translate('general.search')} onClick={handleSunmitSearch}>
              {translate('general.search')}
            </button>
          </div>
        </div>

        <table id={tableId} className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên gói thầu</th>
              <th>Mã gói thầu</th>
              <th>Thời gian bắt đầu</th>
              <th>Thời gian kết thúc</th>
              <th>Loại gói thầu</th>
              <th>Trạng thái</th>
              <th>Mô tả</th>
              <th style={{ width: '150px', textAlign: 'center' }}>{translate('general.action')}</th>
            </tr>
          </thead>
          <tbody>
            {listBiddingPackages &&
              listBiddingPackages.length !== 0 &&
              listBiddingPackages?.map((x, index) => (
                <tr key={index}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td>{x.name}</td>
                  <td>{x.code}</td>
                  <td>{formatDate(x.startDate)}</td>
                  <td>{formatDate(x.endDate)}</td>
                  <td>{translate(`human_resource.profile.bidding_package_management.type.${x.type}`)}</td>
                  <td style={{ color: x.status == 1 ? '#28A745' : x.status == 2 ? '#f39c12' : x.status == 0 ? '#dd4b39' : null }}>
                    {translate(`human_resource.profile.bidding_package_management.status.${x.status}`)}
                  </td>
                  <td>{x.description}</td>
                  <td>
                    <a onClick={() => handleView(x)} style={{ width: '5px' }} title='detail'>
                      <i className='material-icons'>view_list</i>
                    </a>
                    <a onClick={() => handleEdit(x)} className='edit text-yellow' style={{ width: '5px' }} title='edit'>
                      <i className='material-icons'>edit</i>
                    </a>
                    <ConfirmNotification
                      icon='question'
                      title='Xóa thông tin gói thầu'
                      name='delete'
                      className='text-red'
                      content={`<h4>Delete ${x.name + ' - ' + x.code}</h4>`}
                      func={() => {
                        props.deleteBiddingPackage(x._id)
                        props.getAllBiddingPackage(state)
                      }}
                    />
                    {!x?.hasContract && x.status === 3 && (
                      <a
                        className=''
                        style={{ color: '#28A745' }}
                        onClick={() => handleCreateContract(x)}
                        title={'Tạo hợp đồng cho gói thầu này'}
                      >
                        <i className='material-icons'>add_box</i>
                      </a>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {biddingPackagesManager.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (!listBiddingPackages || listBiddingPackages.length === 0) && (
            <div className='table-info-panel'>{translate('confirm.no_data')}</div>
          )
        )}

        <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={setPage} />
      </div>
      {/* From thêm mới thông tin nhân viên */}
      <BiddingPackageCreateForm />

      {/* From thêm mới hợp đồng */}
      <CreateBiddingContract handleRefresh={handleSunmitSearch} id={currentRowCreateContract ? currentRowCreateContract._id : ''} />

      {
        /* From import thông tin nhân viên*/
        // importBiddingPackage && <BiddingPackageImportForm />
      }

      {/* From xem thông tin nhân viên */ <BiddingPackageDetailForm _id={currentRowView ? currentRowView._id : ''} />}
      {/* From chinh sửa thông tin nhân viên */ <BiddingPackageEditFrom _id={currentRow ? currentRow._id : ''} />}
    </div>
  )
}

function mapState(state) {
  const { biddingPackagesManager, department, field, major, career, certificates, modelConfiguration } = state
  return { biddingPackagesManager, department, field, major, career, certificates, modelConfiguration }
}

const actionCreators = {
  getListFields: FieldsActions.getListFields,
  getListMajor: MajorActions.getListMajor,
  getAllBiddingPackage: BiddingPackageManagerActions.getAllBiddingPackage,
  getDetailBiddingPackage: BiddingPackageManagerActions.getDetailBiddingPackage,
  deleteBiddingPackage: BiddingPackageManagerActions.deleteBiddingPackage,
  getListCareerPosition: CareerReduxAction.getListCareerPosition,
  getListCertificate: CertificateActions.getListCertificate,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
  getAllUser: UserActions.get,
  getConfiguration: ConfigurationActions.getConfiguration
}

const biddingPackageManagement = connect(mapState, actionCreators)(withTranslate(BiddingPackageManagement))
export { biddingPackageManagement as BiddingPackageManagement }
