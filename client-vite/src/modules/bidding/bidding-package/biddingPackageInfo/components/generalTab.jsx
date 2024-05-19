import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { saveAs } from 'file-saver'
import { Packer } from 'docx'
import { bidsDocxCreate } from './bidsDocxCreator'

function GeneralTab(props) {
  const [state, setState] = useState({
    currentRowView: props.biddingPackage
  })

  /**
   * Function format dữ liệu Date thành string
   * @param {*} date : Ngày muốn format
   * @param {*} monthYear : true trả về tháng năm , false trả về ngày tháng năm
   */
  const formatDate = (date, monthYear = false) => {
    if (date) {
      const d = new Date(date)
      let month = `${d.getMonth() + 1}`
      let day = `${d.getDate()}`
      const year = d.getFullYear()

      if (month.length < 2) month = `0${month}`
      if (day.length < 2) day = `0${day}`

      if (monthYear === true) {
        return [month, year].join('-')
      }
      return [day, month, year].join('-')
    }
    return date
  }

  useEffect(() => {
    setState((state) => {
      return {
        ...state,
        id: props.id,
        _id: props.biddingPackage._id,
        name: props.biddingPackage.name,
        code: props.biddingPackage.code,
        customer: props.biddingPackage ? props.biddingPackage.customer : '',
        price: props.biddingPackage.price ? props.biddingPackage.price : 0,
        openLocal: props.biddingPackage.openLocal ? props.biddingPackage.openLocal : '',
        receiveLocal: props.biddingPackage.receiveLocal ? props.biddingPackage.receiveLocal : '',
        startDate: props.biddingPackage.startDate,
        endDate: props.biddingPackage.endDate,
        type: props.biddingPackage.type,
        status: props.biddingPackage.status,
        description: props.biddingPackage.description,
        hasContract: props.biddingPackage.hasContract
      }
    })
    // console.log(61, props.biddingPackage, props.biddingPackage.hasContract);
  }, [props.id, JSON.stringify(props.biddingPackage)])

  const { translate } = props

  const { id, _id, name, code, customer, receiveLocal, openLocal, price, startDate, endDate, type, status, description, hasContract } =
    state

  const typeArr = [
    { value: 1, text: 'Gói thầu tư vấn' },
    { value: 2, text: 'Gói thầu phi tư vấn' },
    { value: 3, text: 'Gói thầu hàng hóa' },
    { value: 4, text: 'Gói thầu xây lắp' },
    { value: 5, text: 'Gói thầu hỗn hợp' }
  ]
  const statusArr = [
    { value: '0', text: 'Đã đóng thầu' },
    { value: '1', text: 'Hoạt động' },
    { value: '2', text: 'Chờ kết quả dự thầu' },
    { value: '3', text: 'Đang thực hiện' },
    { value: '4', text: 'Hoàn thành' }
  ]

  const handleCreateContract = () => {
    setTimeout(() => {
      window.$(`#modal-create-package-biddingContract-${_id}`).modal('show')
    }, 500)
  }

  const generateBidsDocx = (state) => {
    const doc = bidsDocxCreate(state, props.modelConfiguration.biddingConfig)

    Packer.toBlob(doc).then((blob) => {
      console.log(blob)
      saveAs(blob, `HSDT ${state.name}.docx`)
      console.log('Document created successfully')
    })
  }
  return (
    <div id={id} className='tab-pane active'>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {!props.inContractDetail && !props.disableLinkCreateContract && !hasContract && status === 3 ? (
            <span>
              {/* <CreateBiddingContract
                                id={_id ? _id : ''}
                            /> */}
              <span className='text-red'>*</span>{' '}
              <span style={{ color: 'red' }}>Gói thầu đang thực hiện nhưng chưa tạo hợp đồng. Hãy tạo Hợp đồng ngay tại</span> &nbsp;
              <a style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleCreateContract()}>
                đây
              </a>
              <span className='text-red'>*</span>
            </span>
          ) : (
            ''
          )}
        </div>
        <div className='btn btn-success' onClick={() => generateBidsDocx(state)}>
          Tải file HSDT
        </div>
      </div>
      <div className=' row box-body'>
        <div className='pull-right col-lg-12 col-md-12 col-ms-12 col-xs-12'>
          <div className='row'>
            {/* Name */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>Tên gói thầu&emsp; </strong>
              {props.inContractDetail ? (
                <span>
                  <a href={`/bidding/bidding-package?id=${_id}`} target='_blank'>
                    {' '}
                    {name}{' '}
                  </a>
                </span>
              ) : (
                <span>{name}</span>
              )}
            </div>
            {/* Mã gói thầu */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>Mã gói thầu&emsp; </strong>
              {code}
            </div>
          </div>
          <div className='row'>
            {/* Thời gian bắt đầu */}
            <div className='form-group col-lg-6 col-md-6 col-ms-12 col-xs-12'>
              <strong>Thời gian bắt đầu&emsp; </strong>
              {formatDate(startDate)}
            </div>
            {/* Thời gian kết thúc */}
            <div className='form-group col-lg-6 col-md-6 col-ms-12 col-xs-12'>
              <strong>Thời gian kết thúc&emsp; </strong>
              {formatDate(endDate)}
            </div>
          </div>
          <div className='row'>
            {/* Loại gói thầu */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>Loại gói thầu&emsp; </strong>
              {typeArr.find((x) => x.value === type)?.text}
            </div>
            {/* Trạng thái */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>Trạng thái&emsp; </strong>
              {statusArr.find((x) => x.value == status)?.text}
            </div>
          </div>
          <div className='row'>
            {/* Bên mới thầu */}
            <div className='form-group col-lg-6 col-md-6 col-ms-12 col-xs-12'>
              <strong>Bên mời thầu&emsp; </strong>
              {customer}
            </div>
            {/* Dự toán gói thầu */}
            <div className='form-group col-lg-6 col-md-6 col-ms-12 col-xs-12'>
              <strong>Dự toán gói thầu&emsp; </strong>
              {price}
            </div>
          </div>
          <div className='row'>
            {/* Địa điểm mở thầu */}
            <div className='form-group col-lg-6 col-md-6 col-ms-12 col-xs-12'>
              <strong>Địa điểm mở thầu&emsp; </strong>
              {openLocal}
            </div>
            {/* Địa điểm nhận thầu */}
            <div className='form-group col-lg-6 col-md-6 col-ms-12 col-xs-12'>
              <strong>Địa điểm nhận thầu&emsp; </strong>
              {receiveLocal}
            </div>
          </div>
          <div className='row'>
            {/* Mô tả */}
            <div className='form-group col-lg-12 col-md-12 col-ms-12 col-xs-12'>
              <strong htmlFor='emailCompany'>Mô tả</strong>
              &emsp; {description}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function mapState(state) {
  const { modelConfiguration } = state
  return { modelConfiguration }
}
const tabGeneral = connect(mapState, null)(withTranslate(GeneralTab))
export { tabGeneral as GeneralTab }
