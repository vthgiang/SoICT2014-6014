import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import {
  DataTableSetting,
  DeleteNotification,
  PaginateBar,
  SelectMulti,
  ExportExcel,
  DatePicker,
  SelectBox,
  TreeSelect
} from '../../../../../common-components'

import { EmployeeCreateForm, EmployeeDetailForm, EmployeeEditFrom, EmployeeImportForm } from './combinedContent'

import { EmployeeManagerActions } from '../redux/actions'
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions'
import { CareerReduxAction } from '../../../career/redux/actions'
import { MajorActions } from '../../../major/redux/actions'
import { SearchDataImportForm } from './searchDataImportForm'
import { CertificateActions } from '../../../certificate/redux/actions'

class SearchEmployeeForCareerPosition extends Component {
  constructor(props) {
    super(props)
    let search = window.location.search.split('?')
    let keySearch = 'organizationalUnits'
    let organizationalUnits = null
    for (let n in search) {
      let index = search[n].lastIndexOf(keySearch)
      if (index !== -1) {
        organizationalUnits = search[n].slice(keySearch.length + 1, search[n].length)
        if (organizationalUnits !== 'null' && organizationalUnits.trim() !== '') {
          organizationalUnits = organizationalUnits.split(',')
        } else organizationalUnits = null
        break
      }
    }

    this.state = {
      searchForPackage: true,
      organizationalUnits: organizationalUnits,
      status: 'active',
      careerPosition: [],
      biddingPackagePersonalStatus: [1, 2, 3],
      page: 0,
      limit: 5
    }
  }

  componentDidMount() {
    this.props.getDepartment()
    this.props.getListMajor({ name: '', page: 0, limit: 1000 })
    this.props.getListCareerPosition({ name: '', page: 0, limit: 1000 })
    this.props.getListCertificate({ name: '', page: 0, limit: 1000 })
    this.props.getAllEmployee(this.state)
  }

  /**
   * Function format dữ liệu Date thành string
   * @param {*} date : Ngày muốn format
   * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
   */
  formatDate(date, monthYear = false) {
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

  /**
   *  Bắt sự kiện click xem thông tin nhân viên
   * @param {*} value : Thông tin nhân viên muốn xem
   */
  handleView = async (value) => {
    await this.setState((state) => {
      return {
        ...state,
        currentRowView: value
      }
    })
    window.$(`#modal-detail-employee${value._id}`).modal('show')
  }

  /**
   * Bắt sự kiện click chỉnh sửa thông tin nhân viên
   * @param {*} value : Thông tin nhân viên muốn chỉnh sửa
   */
  handleEdit = async (value) => {
    await this.setState((state) => {
      return {
        ...state,
        currentRow: value
      }
    })
    window.$(`#modal-edit-employee${value._id}`).modal('show')
  }

  /**
   * Function lưu giá trị unit vào state khi thay đổi
   * @param {*} value : Array id trình độ
   */
  handleChangeProfessionalSkill = (value) => {
    if (value.length === 0) {
      value = null
    }
    this.setState({
      ...this.state,
      professionalSkill: value[0]
    })
  }

  /**
   * Function lưu giá trị unit vào state khi thay đổi
   * @param {*} value : Array id Chuyên ngành
   */
  handleMajor = (value) => {
    this.setState({ majors: value })
  }

  /**
   * Function lưu giá trị unit vào state khi thay đổi
   * @param {*} value : Array id Chuyên ngành
   */
  handleCertificate = (value) => {
    this.setState({ certificates: value })
  }

  /**
   * Function lưu giá trị unit vào state khi thay đổi
   * @param {*} value : Array id Vị trí công việc
   */

  handlePosition = (value) => {
    if (value.length === 0) {
      value = []
    }
    this.setState((state) => ({
      ...state,
      careerPosition: value
    }))
  }

  /**
   * Function lưu giá trị unit vào state khi thay đổi
   * @param {*} value : Array id Vị trí công việc
   */

  handleBiddingPackagePersonalStatus = (value) => {
    if (value.length === 0) {
      value = []
    }
    this.setState((state) => ({
      ...state,
      biddingPackagePersonalStatus: value
    }))
  }

  /**
   * Function lưu giá trị ngày hết hạn hợp đồng vào state khi thay đổi
   * @param {*} value : Tháng hết hạn hợp đồng
   */
  handleEndDateOfCertificateChange = (value) => {
    this.setState({
      ...this.state,
      certificatesEndDate: value
    })
  }

  handleStartDateOfBiddingPackage = (value) => {
    this.setState({
      ...this.state,
      startDate: value
    })
  }

  handleChange = (e) => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  /** Function bắt sự kiện tìm kiếm */
  handleSunmitSearch = async () => {
    this.props.getAllEmployee(this.state)
  }

  /**
   * Bắt sự kiện setting số dòng hiện thị trên một trang
   * @param {*} number : Số dòng trên 1 trang
   */
  setLimit = async (number) => {
    await this.setState({
      limit: parseInt(number)
    })
    this.props.getAllEmployee(this.state)
  }

  /**
   * Bắt sự kiện chuyển trang
   * @param {*} pageNumber : Số trang muốn xem
   */
  setPage = async (pageNumber) => {
    let page = (pageNumber - 1) * this.state.limit
    await this.setState({
      page: parseInt(page)
    })
    this.props.getAllEmployee(this.state)
  }

  render() {
    // console.log('oppend', this.state);
    // console.log("department", this.props.department)

    const { employeesManager, translate, career, major, certificate } = this.props

    const {
      importEmployee,
      limit,
      page,
      currentRow,
      currentRowView,
      certificatesEndDate,
      certificatesCount,
      professionalSkill,
      majors,
      exp,
      sameExp,
      biddingPackgaeStartDate,
      biddingPackagePersonalStatus,
      careerPosition,
      certificates,
      action
    } = this.state // filterField, filterPosition, filterAction,

    let listEmployees = []
    if (employeesManager.listEmployees) {
      listEmployees = employeesManager.listEmployees
    }

    let pageTotal =
      employeesManager.totalList % limit === 0
        ? parseInt(employeesManager.totalList / limit)
        : parseInt(employeesManager.totalList / limit + 1)
    let currentPage = parseInt(page / limit + 1)

    let listPosition = career?.listPosition

    const listMajor = major.listMajor
    const listCertificate = certificate.listCertificate

    let professionalSkillArr = [
      { value: null, text: 'Chọn trình độ' },
      { value: 1, text: 'Trình độ phổ thông' },
      { value: 2, text: 'Trung cấp' },
      { value: 3, text: 'Cao đẳng' },
      { value: 4, text: 'Đại học / Cử nhân' },
      { value: 5, text: 'Kỹ sư' },
      { value: 6, text: 'Thạc sĩ' },
      { value: 7, text: 'Tiến sĩ' },
      { value: 8, text: 'Giáo sư' },
      { value: 0, text: 'Không có' }
    ]

    // Filter danh sách
    let filterPosition = listPosition

    let posCodeArr = []
    let dataTreePosition = []

    return (
      <div className='box'>
        <div className='box-body'>
          <div className='row'>
            {/* Vị trí công việc  */}
            <div className='form-group col-md-4'>
              <label className='form-control-static'>Vị trí công việc</label>
              <SelectMulti
                id={`multiSelectStatus`}
                style={{ margin: 0 }}
                multiple='multiple'
                options={{ nonSelectedText: 'Chọn vị trí công việc', allSelectedText: 'Chọn tất cả' }}
                value={careerPosition}
                items={
                  listPosition
                    ? listPosition?.map((x) => {
                        return { text: x.name, value: x._id }
                      })
                    : []
                }
                onChange={this.handlePosition}
              ></SelectMulti>
            </div>
            {/* Số năm kinh nghiệm */}
            <div className='form-group col-md-4'>
              <label className='form-control-static'>Số năm kinh nghiệm</label>
              <input
                type='number'
                className='form-control'
                value={exp}
                name='exp'
                onChange={this.handleChange}
                placeholder={'Số năm kinh nghiệm'}
              />
            </div>
            {/* Số năm kinh nghiệm công việc tương đương */}
            <div className='form-group col-md-4'>
              <label className='form-control-static'>Số năm kinh nghiệm công việc tương đương</label>
              <input
                type='number'
                className='form-control'
                value={sameExp}
                step={0.1}
                name='sameExp'
                onChange={this.handleChange}
                placeholder={'Kinh nghiệm công việc tương tự'}
              />
            </div>
          </div>

          <div className='row'>
            {/* Trình độ chuyên môn  */}

            <div className='form-group col-md-4'>
              <label className='form-control-static'>Trình độ chuyên môn</label>
              <SelectBox
                id={`professionalSkillArr-selectbox`}
                multiple={false}
                className='form-control select2'
                style={{ width: '100%', padding: '5px 0 5px 0' }}
                value={professionalSkill}
                items={professionalSkillArr}
                onChange={this.handleChangeProfessionalSkill}
              ></SelectBox>
            </div>
            {/* Chuyên ngành  */}
            <div className='form-group col-md-4'>
              <label className='form-control-static'>Chuyên ngành</label>
              <SelectBox
                id={`major`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={listMajor?.map((x) => {
                  return { text: x.name, value: x._id }
                })}
                options={{ placeholder: 'Chọn chuyên ngành' }}
                onChange={this.handleMajor}
                value={majors}
                multiple={true}
              />
            </div>
            {/* Trạng thái tham gia thầu */}
            <div className='form-group col-md-4'>
              <label className='form-control-static'>Trạng thái tham gia gói thầu</label>
              <SelectMulti
                id={`multiSelectBiddingPackageStatus`}
                style={{ margin: 0 }}
                multiple='multiple'
                options={{ nonSelectedText: 'Chọn trạng thái tham gia gói thầu', allSelectedText: 'Chọn tất cả' }}
                value={biddingPackagePersonalStatus}
                items={[
                  { value: 1, text: 'Chưa tham gia' },
                  { value: 2, text: 'Chờ kết quả dự thầu' },
                  { value: 3, text: 'Đã tham gia gói thầu' }
                ]}
                onChange={this.handleBiddingPackagePersonalStatus}
              ></SelectMulti>
            </div>
            {/* Số năm kinh nghiệm công việc tương đương */}
            {/* <div className="form-group col-md-4">
                            <label className="form-control-static">Số năm kinh nghiệm công việc tương đương</label>
                            <input type="number" className="form-control" value={sameExp} step={0.1} name="sameExp" onChange={this.handleChange} placeholder={"Kinh nghiệm công việc tương tự"} />
                        </div> */}
            {/* Thời gian bắt đầu gói thầu */}
            {/* <div className="form-group col-md-4">
                            <label className="form-control-static">Thới gian bắt đầu gói thầu</label>
                            <DatePicker
                                id="month-endDate-start-date"
                                // dateFormat="month-year"
                                value={biddingPackgaeStartDate}
                                onChange={this.handleStartDateOfBiddingPackage}
                            />
                        </div> */}
          </div>

          <div className='row'>
            {/* Loại chứng chỉ */}
            <div className='form-group col-md-4'>
              <label className='form-control-static'>Loại chứng chỉ</label>
              <SelectBox
                id={`certificate`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={listCertificate?.map((x) => {
                  return { text: x.name, value: x._id }
                })}
                options={{ placeholder: 'Chọn chứng chỉ' }}
                onChange={this.handleCertificate}
                value={certificates}
                multiple={true}
              />
            </div>
            {/* Số lượng chứng chỉ */}
            <div className='form-group col-md-4'>
              <label className='form-control-static'>Số lượng chứng chỉ</label>
              <input
                type='number'
                className='form-control'
                value={certificatesCount}
                name='certificatesCount'
                onChange={this.handleChange}
              />
            </div>
            {/* Thời gian bắt đầu gói thầu */}
            <div className='form-group col-md-4'>
              <label className='form-control-static'>Thời gian bắt đầu gói thầu</label>
              <DatePicker id='month-endDate-start-date' value={biddingPackgaeStartDate} onChange={this.handleStartDateOfBiddingPackage} />
            </div>
            {/* Tháng hết hạn chứng chỉ */}
            {/* <div className="form-group col-md-4">
                            <label className="form-control-static">Hiệu lực chứng chỉ</label>
                            <DatePicker
                                id="month-endDate-certificate"
                                // dateFormat="month-year"
                                value={certificatesEndDate}
                                onChange={this.handleEndDateOfCertificateChange}
                            />
                        </div> */}
          </div>

          {/* <div className="row">
                        

                    </div> */}

          <div className='form-inline' style={{ marginBottom: 15 }}>
            {/* Button tìm kiếm */}
            <div className='form-group'>
              <label>
                <button type='button' className='btn btn-success' title={translate('general.search')} onClick={this.handleSunmitSearch}>
                  {translate('general.search')}
                </button>
              </label>
            </div>
          </div>

          <table id='employee-career-position' className='table table-striped table-bordered table-hover'>
            <thead>
              <tr>
                <th>{translate('human_resource.staff_name')}</th>
                <th>Vị trí công việc</th>
                <th>Trình độ chuyên môn</th>
                <th>Chứng chỉ</th>
                <th>Bằng cấp</th>
                <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
              </tr>
            </thead>
            <tbody>
              {listEmployees &&
                listEmployees?.length !== 0 &&
                listEmployees.map((x, index) => {
                  return (
                    <tr key={index}>
                      <td>{x.fullName}</td>
                      <td>
                        {x.careerPositions?.length > 0 ? (
                          x.careerPositions?.map((e, key) => {
                            return (
                              <li key={key}>
                                {' '}
                                {e?.careerPosition?.name} {e?.startDate ? '- Ngày bắt đầu: ' + this.formatDate(e?.startDate) : ''}{' '}
                                {e?.endDate ? '- Ngày kết thúc: ' + this.formatDate(e?.endDate) : ''}{' '}
                              </li>
                            )
                          })
                        ) : (
                          <p>Chưa có dữ liệu</p>
                        )}
                      </td>
                      <td>
                        {x.degrees?.length > 0 ? (
                          x.degrees?.map((e, key) => {
                            let degreeQualification = ''
                            if (e.degreeQualification) {
                              degreeQualification = professionalSkillArr.find((item) => item.value == e.degreeQualification).text
                            } else {
                              degreeQualification = 'Không có'
                            }
                            if (e.major)
                              return (
                                <li>
                                  {degreeQualification} ({e.major.name})
                                </li>
                              )
                            else return ''
                          })
                        ) : (
                          <p>Chưa có dữ liệu</p>
                        )}
                      </td>
                      <td>
                        {x.certificates?.length > 0 ? (
                          x.certificates?.map((e, key) => {
                            return (
                              <li key={key}>
                                {' '}
                                {e.certificate?.name}
                                {e.certificate?.abbreviation ? '(' + e.certificate?.abbreviation + ')' : ''} - {e?.issuedBy} - hiệu lực:{' '}
                                {this.formatDate(e?.endDate)}{' '}
                              </li>
                            )
                          })
                        ) : (
                          <p>Chưa có dữ liệu</p>
                        )}
                      </td>
                      <td>
                        {x.degrees?.length > 0 ? (
                          x.degrees?.map((e, key) => {
                            let degreeQualification = ''
                            if (e.degreeQualification) {
                              degreeQualification = professionalSkillArr.find((item) => item.value == e.degreeQualification).text
                            } else {
                              degreeQualification = 'Không có'
                            }
                            return (
                              <li key={key}>
                                {' '}
                                {this.formatDate(e?.year)} - {e?.name} - Loại: {translate(`human_resource.profile.${e?.degreeType}`)} -
                                Chuyên ngành: {e.major?.name} - Bậc: {degreeQualification}
                              </li>
                            )
                          })
                        ) : (
                          <p>Chưa có dữ liệu</p>
                        )}
                      </td>
                      <td>
                        <a
                          onClick={() => this.handleView(x)}
                          style={{ width: '5px' }}
                          title={translate('human_resource.profile.employee_management.view_employee')}
                        >
                          <i className='material-icons'>view_list</i>
                        </a>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
          {employeesManager.isLoading ? (
            <div className='table-info-panel'>{translate('confirm.loading')}</div>
          ) : (
            (!listEmployees || listEmployees.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
          )}

          <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
        </div>
        {/* From thêm mới thông tin nhân viên */}
        <EmployeeCreateForm />

        {/* From import thông tin nhân viên*/ importEmployee && <EmployeeImportForm />}

        {/* From xem thông tin nhân viên */ <EmployeeDetailForm _id={currentRowView ? currentRowView._id : ''} />}
        {/* From chinh sửa thông tin nhân viên */ <EmployeeEditFrom _id={currentRow ? currentRow._id : ''} />}
      </div>
    )
  }
}

function mapState(state) {
  const { employeesManager, department, career, major, certificate } = state
  return { employeesManager, department, career, major, certificate }
}

const actionCreators = {
  getDepartment: DepartmentActions.get,
  getListCareerPosition: CareerReduxAction.getListCareerPosition,
  getListMajor: MajorActions.getListMajor,
  getListCertificate: CertificateActions.getListCertificate,
  getAllEmployee: EmployeeManagerActions.getAllEmployee,
  deleteEmployee: EmployeeManagerActions.deleteEmployee
}

export default connect(mapState, actionCreators)(withTranslate(SearchEmployeeForCareerPosition))
