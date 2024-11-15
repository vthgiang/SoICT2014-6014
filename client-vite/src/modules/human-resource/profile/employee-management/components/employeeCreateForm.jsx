import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'

import { DialogModal } from '../../../../../common-components'

import {
  GeneralTab,
  ContactTab,
  TaxTab,
  InsurranceTab,
  DisciplineTab,
  ExperienceTab,
  CertificateTab,
  ContractTab,
  SalaryTab,
  FileTab
} from '../../employee-create/components/combinedContent'

import { EmployeeManagerActions } from '../redux/actions'
import FamilyMemberTab from '../../employee-create/components/familyMemberTab'
import { generateCode } from '../../../../../helpers/generateCode'
import { EmployeeInfoActions } from '../../employee-info/redux/actions'
import { MajorActions } from '../../../major/redux/actions'
import { CareerReduxAction } from '../../../career/redux/actions'
import { CertificateActions } from '../../../certificate/redux/actions'
import { BiddingPackageManagerActions } from '../../../../bidding/bidding-package/biddingPackageManagement/redux/actions'

const initMember = {
  name: '',
  codeSocialInsurance: '',
  bookNumberSocialInsurance: '',
  gender: 'male',
  isHeadHousehold: 'no',
  relationshipWithHeadHousehold: '',
  ccns: '',
  birth: '',
  placeOfBirthCertificate: '',
  nationality: '',
  nation: '',
  numberPassport: '',
  note: ''
}
const EmployeeCreateForm = (props) => {
  /**
   * Function format dữ liệu Date thành string
   * @param {*} date : Ngày muốn format
   * @param {*} monthYear : true trả về yyyy-mm, false trả về yyyy-mm-dd
   */
  const formatDate2 = (date, monthYear = false) => {
    if (date) {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      if (monthYear === true) {
        return [year, month].join('-')
      } else return [year, month, day].join('-')
    }
    return date
  }

  const [state, setState] = useState({
    img: './upload/human-resource/avatars/avatar5.png',
    avatar: '',
    employee: {
      employeeNumber: generateCode('NV'),
      employeeTimesheetId: generateCode('NV'),
      fullName: '',
      emailInCompany: '',
      phoneNumber: '',
      avatar: '/upload/human-resource/avatars/avatar5.png',
      gender: 'male',
      maritalStatus: 'single',
      educationalLevel: '',
      professionalSkill: 'unavailable',
      status: 'active',
      identityCardNumber: '',
      identityCardAddress: '',
      identityCardDate: formatDate2(Date.now()),
      birthdate: formatDate2(Date.now()),
      roles: [],
      workProcess: [],
      socialInsuranceDetails: []
    },
    courses: [],
    degrees: [],
    certificates: [],
    careerPositions: [],
    experiences: [],
    contracts: [],
    files: [],
    disciplines: [],
    commendations: [],
    annualLeaves: [],
    houseHold: {
      headHouseHoldName: '',
      documentType: '',
      houseHoldNumber: '',
      city: '',
      district: '',
      ward: '',
      houseHoldAddress: '',
      phone: '',
      houseHoldCode: '',
      familyMembers: []
    },
    editMember: initMember
  })

  /**
   * Function upload avatar
   * @param {*} img
   * @param {*} avatar
   */
  const handleUpload = (img, avatar) => {
    setState((state) => ({
      ...state,
      img: img,
      avatar: avatar
    }))
  }

  /**
   * Function lưu các trường thông tin vào state
   * @param {*} name : Tên trường
   * @param {*} value : Giá trị của trường
   */
  const handleChange = (name, value) => {
    const { employee } = state
    if (
      name === 'startingDate' ||
      name === 'leavingDate' ||
      name === 'birthdate' ||
      name === 'identityCardDate' ||
      name === 'taxDateOfIssue' ||
      name === 'healthInsuranceStartDate' ||
      name === 'healthInsuranceEndDate'
    ) {
      if (value) {
        let partValue = value.split('-')
        value = [partValue[2], partValue[1], partValue[0]].join('-')
      }
    }
    setState((state) => ({
      ...state,
      employee: {
        ...employee,
        [name]: value
      }
    }))
  }

  /**
   * Function lưu thông tin chức danh vào state
   * @param {*} data : dữ liệu về chức danh
   */
  const handleChangeRole = (data) => {
    setState({
      ...state,
      employee: {
        ...employee,
        roles: [...data]
      }
    })
  }

  /**
   * Function thêm mới kinh nghiệm làm việc
   * @param {*} data : Dữ liệu thông tin kinh nghiệm làm việc
   * @param {*} addData : Kinh nghiệm làm việc muốn thêm
   */
  const handleChangeExperience = (data, addData) => {
    setState((state) => ({
      ...state,
      experiences: data
    }))
  }

  const handleChangeCareerPosition = (data, addData) => {
    setState((state) => ({
      ...state,
      careerPositions: data
    }))
  }

  const handleChangeWorkProcess = (data, addData) => {
    const { employee } = state
    setState((state) => {
      return {
        ...state,
        employee: {
          ...employee,
          workProcess: [...data]
        }
      }
    })
  }

  /**
   * Function thêm, chỉnh sửa thông tin bằng cấp
   * @param {*} data : Dữ liệu thông tin bằng cấp
   * @param {*} addData : Bằng cấp muốn thêm
   */
  const handleChangeDegree = (data, addData) => {
    setState((state) => ({
      ...state,
      degrees: data
    }))
  }

  /**
   * Function thêm, chỉnh sửa thông tin chứng chỉ
   * @param {*} data : Dữ liệu thông tin chứng chỉ
   * @param {*} addData : Chứng chỉ muốn thêm
   */
  const handleChangeCertificate = (data, addData) => {
    setState((state) => ({
      ...state,
      certificates: data
    }))
  }

  /**
   * Function thêm, chỉnh sửa thông tin quá trình đóng BHXH
   * @param {*} data : Dữ liệu thông tin quá trình đóng BHXH
   * @param {*} addData : Quá trình đóng BHXH muốn thêm
   */
  const handleChangeBHXH = (data, addData) => {
    const { employee } = state
    setState((state) => ({
      ...state,
      employee: {
        ...employee,
        socialInsuranceDetails: data
      }
    }))
  }

  /**
   * Function thêm thông tin hợp đồng lao động
   * @param {*} data : Dữ liệu thông tin hợp đồng
   * @param {*} addData : Hợp đồng muốn thêm
   */
  const handleChangeContract = (data, addData) => {
    setState((state) => ({
      ...state,
      contracts: data
    }))
  }

  /**
   * Function thêm thông tin khen thưởng
   * @param {*} data : Dữ liệu thông tin khen thưởng
   * @param {*} addData : Khen thưởng muốn thêm
   */
  const handleChangeConmmendation = (data, addData) => {
    setState((state) => ({
      ...state,
      commendations: data
    }))
  }

  /**
   * Function thêm thông tin kỷ luật
   * @param {*} data : Dữ liệu thông tin kỷ luật
   * @param {*} addData : Kỷ luật muốn thêm
   */
  const handleChangeDiscipline = (data, addData) => {
    setState((state) => ({
      ...state,
      disciplines: data
    }))
  }

  /**
   * Function thêm thông tin nghỉ phép
   * @param {*} data : Dữ liệu thông tin nghỉ phép
   * @param {*} addData : Nghỉ phép muốn thêm
   */
  const handleChangeAnnualLeave = (data, addData) => {
    setState((state) => ({
      ...state,
      annualLeaves: data
    }))
  }

  /**
   * Function thêm thông tin tài liệu đính kèm
   * @param {*} data : Dữ liệu thông tin tài liệu đính kèm
   * @param {*} addData : Tài liệu đính kèm muốn thêm
   */
  const handleChangeFile = (data, addData) => {
    setState((state) => ({
      ...state,
      files: data
    }))
  }

  /**
   *  Function thêm thông tin quá trình đào tạo
   * @param {*} data : Dữ liệu thông tin quá trình đào tạo
   */
  const handleChangeCourse = (data) => {
    setState((state) => ({
      ...state,
      courses: data
    }))
  }

  /**
   * Function kiểm tra các trường bắt buộc phải nhập
   * @param {*} value : Giá trị của trường cần kiểm tra
   */
  const validatorInput = (value) => {
    if (value !== undefined && value.toString().trim() !== '') {
      return true
    }
    return false
  }

  /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
  const isFormValidated = () => {
    const { employee } = state
    let result = validatorInput(employee.employeeNumber) && validatorInput(employee.fullName)

    if (employee.healthInsuranceStartDate && employee.healthInsuranceEndDate) {
      if (new Date(employee.healthInsuranceEndDate).getTime() < new Date(employee.healthInsuranceStartDate).getTime()) {
        return false
      }
    } else if (
      (employee.healthInsuranceStartDate && !employee.healthInsuranceEndDate) ||
      (!employee.healthInsuranceStartDate && employee.healthInsuranceEndDate)
    ) {
      return false
    }
    if (employee.leavingDate && employee.startingDate) {
      if (new Date(employee.leavingDate).getTime() < new Date(employee.startingDate).getTime()) {
        return false
      }
    } else if (employee.leavingDate && !employee.startingDate) {
      return false
    }
    return result
  }

  /** Function thêm mới thông tin nhân viên */
  const save = async () => {
    let {
      employee,
      degrees,
      experiences,
      certificates,
      contracts,
      files,
      avatar,
      careerPositions,
      disciplines,
      commendations,
      annualLeaves,
      courses,
      houseHold
    } = state

    await setState((state) => ({
      ...state,
      employee: {
        ...employee,
        degrees,
        certificates,
        contracts,
        files,
        disciplines,
        commendations,
        annualLeaves,
        courses,
        careerPositions,
        experiences,
        houseHold
      }
    }))

    const degreesConvert = state?.degrees?.length
      ? state.degrees.map((x) => {
          const splitDate = x?.year ? x.year.split('-') : x.year
          return {
            ...x,
            year: [splitDate[2], splitDate[1], splitDate[0]].join('-')
          }
        })
      : []

    let formData = convertJsonObjectToFormData({
      ...employee,
      degrees: degreesConvert,
      certificates: [...state.certificates],
      contracts: [...state.contracts],
      files: [...state.files],
      disciplines: [...state.disciplines],
      commendations: [...state.commendations],
      annualLeaves: [...state.annualLeaves],
      courses: [...state.courses],
      careerPositions: [...state.careerPositions],
      experiences: [...state.experiences],
      houseHold: { ...state.houseHold }
    })
    degrees.forEach((x) => {
      formData.append('fileDegree', x.fileUpload)
    })
    certificates.forEach((x) => {
      formData.append('fileCertificate', x.fileUpload)
    })
    experiences.forEach((x) => {
      formData.append('fileExperience', x.fileUpload)
    })
    careerPositions.forEach((x) => {
      formData.append('fileCareerPosition', x.fileUpload)
    })
    contracts.forEach((x) => {
      formData.append('fileContract', x.fileUpload)
    })
    files.forEach((x) => {
      formData.append('file', x.fileUpload)
    })
    formData.append('fileAvatar', avatar)
    employee &&
      employee.healthInsuranceAttachment &&
      employee.healthInsuranceAttachment.forEach((x) => {
        formData.append('healthInsuranceAttachment', x.fileUpload)
      })

    console.log('xxxxxxxxxxxxxxxxxxxx', formData)
    props.addNewEmployee(formData)
  }

  /* -------------------------------------------------------------------------- */
  /*                                 // End save                                */
  /* -------------------------------------------------------------------------- */

  const _fm_saveMember = (data) => {
    setState((prev) => ({
      ...prev,
      houseHold: {
        ...state.houseHold,
        familyMembers: [...state.houseHold.familyMembers, data]
      }
    }))
  }

  const _fm_handleHeadHouseHoldName = (e) => {
    let headHouseHoldName = e.target.value
    setState((state) => {
      return {
        ...state,
        houseHold: {
          ...state.houseHold,
          headHouseHoldName
        }
      }
    })
  }

  const _fm_handleDocumentType = (e) => {
    let documentType = e.target.value
    setState((state) => {
      return {
        ...state,
        houseHold: {
          ...state.houseHold,
          documentType
        }
      }
    })
  }

  const _fm_handleHouseHoldNumber = (e) => {
    let houseHoldNumber = e.target.value
    setState((state) => {
      return {
        ...state,
        houseHold: {
          ...state.houseHold,
          houseHoldNumber
        }
      }
    })
  }

  const _fm_handleCity = (e) => {
    let city = e.target.value
    setState((state) => {
      return {
        ...state,
        houseHold: {
          ...state.houseHold,
          city
        }
      }
    })
  }

  const _fm_handleDistrict = (e) => {
    let district = e.target.value
    setState((state) => {
      return {
        ...state,
        houseHold: {
          ...state.houseHold,
          district
        }
      }
    })
  }

  const _fm_handleWard = (e) => {
    let ward = e.target.value
    setState((state) => {
      return {
        ...state,
        houseHold: {
          ...state.houseHold,
          ward
        }
      }
    })
  }

  const _fm_handleHouseHoldAddress = (e) => {
    let houseHoldAddress = e.target.value
    setState((state) => {
      return {
        ...state,
        houseHold: {
          ...state.houseHold,
          houseHoldAddress
        }
      }
    })
  }

  const _fm_handlePhone = (e) => {
    let phone = e.target.value
    setState((state) => {
      return {
        ...state,
        houseHold: {
          ...state.houseHold,
          phone
        }
      }
    })
  }

  const _fm_handleHouseHoldCode = (e) => {
    let houseHoldCode = e.target.value
    setState((state) => {
      return {
        ...state,
        houseHold: {
          ...state.houseHold,
          houseHoldCode
        }
      }
    })
  }

  const _fm_editMember = (index, data) => {
    let familyMembers = state.houseHold.familyMembers
    familyMembers[index] = data
    setState((state) => {
      return {
        ...state,
        houseHold: {
          ...state.houseHold,
          familyMembers: familyMembers
        }
      }
    })
  }

  const _fm_deleteMember = (index) => {
    let familyMembers = state.houseHold.familyMembers
    familyMembers = familyMembers.filter((node, i) => i !== index)
    setState((state) => {
      return {
        ...state,
        houseHold: {
          ...state.houseHold,
          familyMembers: familyMembers
        }
      }
    })
  }

  const { translate, employeesManager, employeesInfo, career, major, certificate } = props
  const { img, employee, degrees, certificates, contracts, courses, commendations, disciplines, annualLeaves, files, editMember } = state

  return (
    <React.Fragment>
      <DialogModal
        size='75'
        modalID='modal-create-employee'
        isLoading={employeesManager.isLoading}
        formID='form-create-employee'
        title={translate('human_resource.profile.add_staff')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* <form className="form-group" id="form-create-employee"> */}
        <div className='nav-tabs-custom row' style={{ marginTop: '-15px' }}>
          <ul className='nav nav-tabs'>
            <li className='active'>
              <a title={translate('human_resource.profile.tab_name.menu_general_infor_title')} data-toggle='tab' href='#general'>
                {translate('human_resource.profile.tab_name.menu_general_infor')}
              </a>
            </li>
            <li>
              <a title={translate('human_resource.profile.tab_name.menu_contact_infor_title')} data-toggle='tab' href='#contact'>
                {translate('human_resource.profile.tab_name.menu_contact_infor')}
              </a>
            </li>
            <li>
              <a title={translate('human_resource.profile.tab_name.menu_education_experience_title')} data-toggle='tab' href='#experience'>
                {translate('human_resource.profile.tab_name.menu_education_experience')}
              </a>
            </li>
            <li>
              <a title={translate('human_resource.profile.tab_name.menu_diploma_certificate_title')} data-toggle='tab' href='#diploma'>
                {translate('human_resource.profile.tab_name.menu_diploma_certificate')}
              </a>
            </li>
            <li>
              <a title={translate('human_resource.profile.tab_name.menu_account_tax_title')} data-toggle='tab' href='#account'>
                {translate('human_resource.profile.tab_name.menu_account_tax')}
              </a>
            </li>
            <li>
              <a title={translate('human_resource.profile.tab_name.menu_insurrance_infor_title')} data-toggle='tab' href='#insurrance'>
                {translate('human_resource.profile.tab_name.menu_insurrance_infor')}
              </a>
            </li>
            <li>
              <a title={translate('human_resource.profile.tab_name.menu_contract_training_title')} data-toggle='tab' href='#contract'>
                {translate('human_resource.profile.tab_name.menu_contract_training')}
              </a>
            </li>
            <li>
              <a title={translate('human_resource.profile.tab_name.menu_reward_discipline_title')} data-toggle='tab' href='#reward'>
                {translate('human_resource.profile.tab_name.menu_reward_discipline')}
              </a>
            </li>
            <li>
              <a title={translate('menu.annual_leave_personal')} data-toggle='tab' href='#salary'>
                {translate('menu.annual_leave_personal')}
              </a>
            </li>
            <li>
              <a title={'Thành viên hộ gia đình'} data-toggle='tab' href='#family_member'>
                Thành viên hộ gia đình
              </a>
            </li>
            <li>
              <a title={translate('human_resource.profile.tab_name.menu_attachments_title')} data-toggle='tab' href='#attachments'>
                {translate('human_resource.profile.tab_name.menu_attachments')}
              </a>
            </li>
          </ul>
          <div className='tab-content'>
            {/* Tab thông tin chung */}
            <GeneralTab
              id='general'
              img={img}
              handleChange={handleChange}
              handleUpload={handleUpload}
              handleChangeRole={handleChangeRole}
              employee={employee}
            />
            {/* Tab thông tin liên hệ */}
            <ContactTab id='contact' handleChange={handleChange} employee={employee} />
            {/* Tab học vấn - kinh nghiệm */}
            <ExperienceTab
              id='experience'
              employee={employee}
              handleChange={handleChange}
              handleAddExperience={handleChangeExperience}
              handleEditExperience={handleChangeExperience}
              handleDeleteExperience={handleChangeExperience}
              handleAddCareerPosition={handleChangeCareerPosition}
              handleEditCareerPosition={handleChangeCareerPosition}
              handleDeleteCareerPosition={handleChangeCareerPosition}
            />
            {/* Tab bằng cấp - chứng chỉ */}
            <CertificateTab
              id='diploma'
              degrees={degrees}
              certificates={certificates}
              listMajors={major?.listMajor}
              listCertificates={certificate?.listCertificate}
              listPositions={career?.listPosition}
              handleAddDegree={handleChangeDegree}
              handleEditDegree={handleChangeDegree}
              handleDeleteDegree={handleChangeDegree}
              handleAddCertificate={handleChangeCertificate}
              handleEditCertificate={handleChangeCertificate}
              handleDeleteCertificate={handleChangeCertificate}
            />
            {/* Tab Tài khoản - thuế */}
            <TaxTab id='account' employee={employee} handleChange={handleChange} />
            {/* Tab thông tin bảo hiểm */}
            <InsurranceTab
              id='insurrance'
              pageCreate={true}
              socialInsuranceDetails={employee.socialInsuranceDetails}
              employee={employee}
              handleChange={handleChange}
              handleAddBHXH={handleChangeBHXH}
              handleEditBHXH={handleChangeBHXH}
              handleDeleteBHXH={handleChangeBHXH}
            />
            {/* Tab hợp đồng - quá trình đào tạo*/}
            <ContractTab
              id='contract'
              pageCreate={true}
              employee={employee}
              contracts={contracts}
              courses={courses}
              handleChange={handleChange}
              handleAddContract={handleChangeContract}
              handleEditContract={handleChangeContract}
              handleDeleteContract={handleChangeContract}
              handleAddCourse={handleChangeCourse}
              handleEditCourse={handleChangeCourse}
              handleDeleteCourse={handleChangeCourse}
            />
            {/* Tab khen thưởng - kỷ luật*/}
            <DisciplineTab
              id='reward'
              commendations={commendations}
              disciplines={disciplines}
              handleAddConmmendation={handleChangeConmmendation}
              handleEditConmmendation={handleChangeConmmendation}
              handleDeleteConmmendation={handleChangeConmmendation}
              handleAddDiscipline={handleChangeDiscipline}
              handleEditDiscipline={handleChangeDiscipline}
              handleDeleteDiscipline={handleChangeDiscipline}
            />
            {/* Tab lương thưởng - nghỉ phép*/}
            <SalaryTab
              id='salary'
              pageCreate={true}
              annualLeaves={annualLeaves}
              handleAddAnnualLeave={handleChangeAnnualLeave}
              handleEditAnnualLeave={handleChangeAnnualLeave}
              handleDeleteAnnualLeave={handleChangeAnnualLeave}
            />
            {/* Tab tài liệu đính kèm */}
            <FileTab
              id='attachments'
              files={files}
              employee={employee}
              handleChange={handleChange}
              handleAddFile={handleChangeFile}
              handleEditFile={handleChangeFile}
              handleDeleteFile={handleChangeFile}
            />
            {/* Tab thành viên hộ gia đình */}
            <FamilyMemberTab
              id='family_member'
              tabEditMember='modal-create-member-c'
              editMember={editMember}
              _fm_editMember={_fm_editMember}
              _fm_deleteMember={_fm_deleteMember}
              houseHold={state.houseHold}
              _fm_handleHeadHouseHoldName={_fm_handleHeadHouseHoldName}
              _fm_handleDocumentType={_fm_handleDocumentType}
              _fm_handleHouseHoldNumber={_fm_handleHouseHoldNumber}
              _fm_handleCity={_fm_handleCity}
              _fm_handleDistrict={_fm_handleDistrict}
              _fm_handleWard={_fm_handleWard}
              _fm_handleHouseHoldAddress={_fm_handleHouseHoldAddress}
              _fm_handlePhone={_fm_handlePhone}
              _fm_handleHouseHoldCode={_fm_handleHouseHoldCode}
              _fm_saveMember={_fm_saveMember}
            />
          </div>
        </div>
        {/* </form> */}
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { employeesManager, employeesInfo, major, career, certificate, biddingPackagesManager } = state
  return { employeesManager, employeesInfo, major, career, certificate, biddingPackagesManager }
}

const actionCreators = {
  addNewEmployee: EmployeeManagerActions.addNewEmployee,
  getEmployeeProfile: EmployeeInfoActions.getEmployeeProfile,
  getListMajor: MajorActions.getListMajor,
  getListCareerPosition: CareerReduxAction.getListCareerPosition,
  getListCertificate: CertificateActions.getListCertificate,
  getListBiddingPackage: BiddingPackageManagerActions.getAllBiddingPackage
}

const createForm = connect(mapState, actionCreators)(withTranslate(EmployeeCreateForm))
export { createForm as EmployeeCreateForm }
