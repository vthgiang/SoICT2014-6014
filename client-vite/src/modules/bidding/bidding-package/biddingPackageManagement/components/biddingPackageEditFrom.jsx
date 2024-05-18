import React, { useRef, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal } from '../../../../../common-components'

import { KeyPeopleRequire, GeneralTab, Proposals } from './combinedContent'
import { BiddingPackageManagerActions } from '../redux/actions'
import { MajorActions } from '../../../../human-resource/major/redux/actions'
import { CareerReduxAction } from '../../../../human-resource/career/redux/actions'
import { CertificateActions } from '../../../../human-resource/certificate/redux/actions'
import { KeyPeople } from './keyPeople'
import { UserActions } from '../../../../super-admin/user/redux/actions'

const BiddingPackageEditFrom = (props) => {
  const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2 }

  const [state, setState] = useState({
    dataStatus: DATA_STATUS.NOT_AVAILABLE,
    biddingPackage: {
      name: '',
      name: '',
      code: '',
      startDate: '',
      endDate: '',
      type: '',
      status: '',
      description: '',
      keyPersonnelRequires: [
        {
          careerPosition: '',
          majors: '',
          certificateRequirements: {
            certificates: [],
            count: 0
          }
        }
      ]
    }
  })
  const [log, setLog] = useState(null)
  const [oldBP, setOldBP] = useState(null)

  const mountedRef = useRef(true)

  useEffect(() => {
    const shouldUpdate = async () => {
      if (props._id !== state._id && !props.biddingPackagesManager.isLoading) {
        await props.getDetailBiddingPackage(props._id, {})
        setState({
          ...state,
          _id: props?._id,
          dataStatus: DATA_STATUS.QUERYING,
          biddingPackage: ''
        })
      }

      if (state.dataStatus === DATA_STATUS.QUERYING && !props.biddingPackagesManager.isLoading) {
        setState({
          ...state,
          dataStatus: DATA_STATUS.AVAILABLE,
          biddingPackage: { ...props.biddingPackagesManager?.biddingPackageDetail }
        })
        setOldBP({ ...props.biddingPackagesManager?.biddingPackageDetail })
      }
    }
    shouldUpdate()
    return () => {
      mountedRef.current = false
    }
  }, [props._id, props.biddingPackagesManager.isLoading, state.dataStatus])

  const { translate, biddingPackagesManager, career, major, certificate } = props

  let { _id, biddingPackage } = state

  /**
   * Function upload avatar
   * @param {*} img
   * @param {*} avatar
   */
  const handleUpload = (img, avatar) => {
    setState({
      ...state,
      img: img,
      avatar: avatar
    })
  }

  /**
   * Function lưu các trường thông tin vào state
   * @param {*} name : Tên trường
   * @param {*} value : Giá trị của trường
   */
  const handleChange = (name, value) => {
    const { biddingPackage } = state
    if (
      name === 'startDate' ||
      name === 'endDate' ||
      name === 'birthdate' ||
      name === 'identityCardDate' ||
      name === 'taxDateOfIssue' ||
      name === 'startDate' ||
      name === 'endDate' ||
      name === 'contractEndDate'
    ) {
      if (value) {
        let partValue = value.split('-')
        value = [partValue[2], partValue[1], partValue[0]].join('-')
      }
    }
    setState({
      ...state,
      biddingPackage: {
        ...biddingPackage,
        [name]: value
      }
    })
  }

  const handleChangeCareerKeyEmployee = (value, index) => {
    setState({
      ...state,
      biddingPackage: {
        ...biddingPackage,
        keyPeople: [state.biddingPackage.keyPeople.map()]
      }
    })
  }

  /**
   * Function kiểm tra các trường bắt buộc phải nhập
   * @param {*} value : Giá trị của trường cần kiểm tra
   */
  const validatorInput = (value) => {
    if (value && value.toString().trim() !== '') {
      return true
    }
    return false
  }

  /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
  const isFormValidated = () => {
    const { biddingPackage } = state
    let result = true
    if (biddingPackage) {
      result = validatorInput(biddingPackage.name)

      if (biddingPackage.startDate && biddingPackage.endDate) {
        if (new Date(biddingPackage.endDate).getTime() < new Date(biddingPackage.startDate).getTime()) {
          return false
        }
      } else if ((biddingPackage.startDate && !biddingPackage.endDate) || (!biddingPackage.startDate && biddingPackage.endDate)) {
        return false
      }
      if (biddingPackage.endDate && biddingPackage.startDate) {
        if (new Date(biddingPackage.endDate).getTime() < new Date(biddingPackage.startDate).getTime()) {
          return false
        }
      } else if (biddingPackage.endDate && !biddingPackage.startDate) {
        return false
      }
    }
    return result
  }

  const save = async () => {
    let { _id, biddingPackage } = state
    let proposal = oldBP.proposals
    let oldLogs = proposal?.logs ?? []
    let newLogItem = log

    let dataReq = {
      ...biddingPackage
    }

    if (newLogItem) {
      dataReq = {
        ...biddingPackage,
        proposals: {
          ...biddingPackage.proposals,
          logs: [...oldLogs, newLogItem]
        }
      }
    }

    console.log('====1817===', dataReq)

    await props.updateBiddingPackage(_id, dataReq)

    // await props.updateBiddingPackage(_id, biddingPackage);
    await props.getDetailBiddingPackage(props._id, {})
    setState({
      ...state,
      dataStatus: DATA_STATUS.QUERYING
    })
  }

  return (
    <React.Fragment>
      <DialogModal
        size='75'
        modalID={`modal-edit-bidding-package${props._id}`}
        isLoading={biddingPackagesManager.isLoading}
        formID={`form-edit-bidding-package${_id}`}
        title='Chỉnh sửa thông tin gói thầu'
        func={save}
        resetOnSave={true}
        resetOnClose={true}
        // afterClose={() => {
        //     setState(state => ({
        //         ...state,
        //         _id: null,
        //     }))
        // }}
        disableSubmit={!isFormValidated()}
      >
        {/* <form className="form-group" id="form-edit-biddingPackage"> */}
        {biddingPackage && (
          <div className='nav-tabs-custom row' style={{ marginTop: '-15px', overflowX: 'hidden', marginBottom: '-15px' }}>
            <ul className='nav nav-tabs'>
              <li className='active'>
                <a
                  title={translate('human_resource.profile.tab_name.menu_general_infor_title')}
                  data-toggle='tab'
                  href={`#edit_general${_id}`}
                >
                  {translate('human_resource.profile.tab_name.menu_general_infor')}
                </a>
              </li>
              <li>
                <a title='Yêu cầu nhân sự chủ chốt' data-toggle='tab' href={`#edit_contact_bidding_package${_id}`}>
                  Yêu cầu nhân sự chủ chốt
                </a>
              </li>
              <li>
                <a title='Danh sách nhân sự chủ chốt' data-toggle='tab' href={`#edit_key_people_bidding_package${_id}`}>
                  Nhân sự chủ chốt
                </a>
              </li>
              <li>
                <a title='Hồ sơ đề xuất' data-toggle='tab' href={`#proposals_edit_${_id}`}>
                  Hồ sơ đề xuất
                </a>
              </li>
            </ul>
            <div className='tab-content'>
              {
                /* Tab thông tin chung */
                <GeneralTab
                  id={`edit_general${_id}`}
                  type='edit'
                  handleChange={handleChange}
                  handleUpload={handleUpload}
                  biddingPackage={biddingPackage}
                />
              }
              {/* Điều kiện nhân sự chủ chốt */}
              <KeyPeopleRequire
                id={`edit_contact_bidding_package${_id}`}
                handleChange={handleChange}
                listCareer={career?.listPosition}
                listMajor={major?.listMajor}
                listCertificate={certificate?.listCertificate}
                biddingPackage={biddingPackage}
              />
              {/* Danh sách nhân sự chủ chốt */}
              <KeyPeople
                id={`edit_key_people_bidding_package${_id}`}
                handleChange={handleChange}
                listCareer={career?.listPosition}
                listMajor={major?.listMajor}
                listCertificate={certificate?.listCertificate}
                keyPersonnelRequires={state.biddingPackage.keyPersonnelRequires}
                biddingPackage={biddingPackage}
              />
              {/* Hồ sơ đề xuất */}
              <Proposals
                type={`edit`}
                bidId={_id}
                id={`proposals_edit_${_id}`}
                handleChange={handleChange}
                listCareer={career?.listPosition}
                proposals={state.biddingPackage.proposals}
                biddingPackage={biddingPackage}
                oldBiddingPackage={oldBP}
                setLog={setLog}
              />
            </div>
          </div>
        )}
        {/* </form> */}
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { biddingPackagesManager, user, major, career, certificate } = state
  return { biddingPackagesManager, user, major, career, certificate }
}

const actionCreators = {
  getDetailBiddingPackage: BiddingPackageManagerActions.getDetailEditBiddingPackage,
  updateBiddingPackage: BiddingPackageManagerActions.updateBiddingPackage,
  getListMajor: MajorActions.getListMajor,
  getListCareerPosition: CareerReduxAction.getListCareerPosition,
  getListCertificate: CertificateActions.getListCertificate,
  getAllUserOfCompany: UserActions.getAllUserOfCompany,
  getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
  getDepartment: UserActions.getDepartmentOfUser
}

const editFrom = connect(mapState, actionCreators)(withTranslate(BiddingPackageEditFrom))
export { editFrom as BiddingPackageEditFrom }
