import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ConfigurationActions } from '../redux/actions'

function BiddingConfiguration(props) {
  const { translate, modelConfiguration } = props
  const initData = {
    company: '',
    address: '',
    phone: '',
    email: '',
    taxCode: '',
    representativeName: '',
    representativeRole: '',
    bankName: '',
    bankAccountNumber: ''
  }
  const [state, setState] = useState(initData)

  useEffect(() => {
    const bidding = {
      company: state.company,
      address: state.address,
      email: state.email,
      phone: state.phone,
      taxCode: state.taxCode,
      representative: {
        name: state.representativeName,
        role: state.representativeRole
      },
      bank: {
        name: state.bankName,
        accountNumber: state.bankAccountNumber
      }
    }
    props.setDataReq(bidding)
  }, [state])

  useEffect(() => {
    if (props.id !== state.id) {
      props.getConfiguration()
      setState({
        ...state,
        id: props.id,
        dataStatus: 1
      })
    }
  }, [props.id])

  useEffect(() => {
    if (modelConfiguration?.biddingConfig != '') {
      const data = modelConfiguration?.biddingConfig
      setState({
        ...state,
        company: data?.company,
        address: data?.address,
        phone: data?.phone,
        email: data?.email,
        taxCode: data?.taxCode,
        representativeName: data?.representative?.name,
        representativeRole: data?.representative?.role,
        bankName: data?.bank?.name,
        bankAccountNumber: data?.bank?.accountNumber
      })
    }
  }, [JSON.stringify(modelConfiguration?.biddingConfig)])

  // hàm thay đổi giá trị form
  const handleChangeForm = (event, currentKey) => {
    setState({
      ...state,
      [currentKey]: event?.target?.value
    })
  }

  return (
    <div>
      <fieldset className='scheduler-border'>
        <legend className='scheduler-border'>Thông tin công ty</legend>
        <div className='row'>
          <div className={`form-group col-md-6`}>
            <label>
              Công ty<span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' value={state.company} onChange={(e) => handleChangeForm(e, 'company')}></input>
          </div>

          <div className={`form-group col-md-6 `}>
            <label>
              Địa chỉ<span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' value={state.address} onChange={(e) => handleChangeForm(e, 'address')}></input>
          </div>
        </div>
        <div className='row'>
          <div className={`form-group col-md-6 `}>
            <label>
              Email<span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' value={state.email} onChange={(e) => handleChangeForm(e, 'email')}></input>
          </div>
          <div className={`form-group col-md-6`}>
            <label>
              Số điện thoại<span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' value={state.phone} onChange={(e) => handleChangeForm(e, 'phone')}></input>
          </div>
        </div>
        <div className='row'>
          <div className={`form-group col-md-6`}>
            <label>
              Người đại diện<span className='text-red'>*</span>
            </label>
            <input
              type='text'
              className='form-control'
              value={state.representativeName}
              onChange={(e) => handleChangeForm(e, 'representativeName')}
            ></input>
          </div>

          <div className={`form-group col-md-6 `}>
            <label>
              Chức vụ<span className='text-red'>*</span>
            </label>
            <input
              type='text'
              className='form-control'
              value={state.representativeRole}
              onChange={(e) => handleChangeForm(e, 'representativeRole')}
            ></input>
          </div>
        </div>
        <div className='row'>
          <div className={`form-group col-md-6`}>
            <label>
              Số tài khoản<span className='text-red'>*</span>
            </label>
            <input
              type='text'
              className='form-control'
              value={state.bankAccountNumber}
              onChange={(e) => handleChangeForm(e, 'bankAccountNumber')}
            ></input>
          </div>

          <div className={`form-group col-md-6 `}>
            <label>
              Ngân hàng<span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' value={state.bankName} onChange={(e) => handleChangeForm(e, 'bankName')}></input>
          </div>
        </div>
        <div className='row'>
          <div className={`form-group col-md-6 `}>
            <label>
              Mã số thuế<span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' value={state.taxCode} onChange={(e) => handleChangeForm(e, 'taxCode')}></input>
          </div>
        </div>
      </fieldset>
    </div>
  )
}

function mapState(state) {
  const { modelConfiguration } = state
  return { modelConfiguration }
}

const actionCreators = {
  getConfiguration: ConfigurationActions.getConfiguration,
  editConfiguration: ConfigurationActions.editConfiguration
}

const biddingConfigPage = connect(mapState, actionCreators)(withTranslate(BiddingConfiguration))
export { biddingConfigPage as BiddingConfiguration }
