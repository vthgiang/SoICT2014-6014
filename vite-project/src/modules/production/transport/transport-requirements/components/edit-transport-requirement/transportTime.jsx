import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components'
import { withTranslate } from 'react-redux-multilingual'
import ValidationHelper from '../../../../../../helpers/validationHelper'
import { formatDate, formatToTimeZoneDate } from '../../../../../../helpers/formatDate'

import { exampleActions } from '../../redux/actions'
import { BillActions } from '../../../../warehouse/bill-management/redux/actions'
import { CrmCustomerActions } from '../../../../../crm/customer/redux/actions'
import { GoodActions } from '../../../../common-production/good-management/redux/actions'
import { validate } from 'uuid'

function TransportTime(props) {
  const { callBackState, timeRequested, componentId } = props

  const [currentTime, setCurrentTime] = useState({
    time: '',
    detail: ''
  })

  const [listTimeChosen, setListTimeChosen] = useState([])

  const [errorForm, setErrorForm] = useState({})

  let { timeError } = errorForm

  let handleTimeChange = (value) => {
    setCurrentTime({
      ...currentTime,
      time: value
    })
    setErrorForm({
      ...errorForm,
      timeError: null
    })
  }
  let handleDetailChange = (e) => {
    setCurrentTime({
      ...currentTime,
      detail: e.target.value
    })
  }
  const handleAddTime = (e) => {
    e.preventDefault()
    try {
      if (!formatToTimeZoneDate(currentTime.time)) {
        setErrorForm({
          ...errorForm,
          timeError: 'Ngày không hợp lệ'
        })
        return
      }
      let selectDate = new Date(formatToTimeZoneDate(currentTime.time))
      selectDate.setHours(10, 1, 1)
      let currentDate = new Date()
      currentDate.setHours(8, 1, 1)
      if (currentDate.getTime() > selectDate.getTime()) {
        setErrorForm({
          ...errorForm,
          timeError: 'Ngày mong muốn không trước ngày hôm nay'
        })
        return
      }
      let time = {
        time: currentTime.time,
        detail: currentTime.detail
      }
      setListTimeChosen((listTimeChosen) => [...listTimeChosen, time])
    } catch (error) {
      setErrorForm({
        ...errorForm,
        timeError: 'Ngày không hợp lệ'
      })
      return
    }
  }

  useEffect(() => {
    // console.log(listTimeChosen, " danh sach thoi gian lua chon");
    callBackState(listTimeChosen)
  }, [listTimeChosen])

  useEffect(() => {
    if (timeRequested && timeRequested.length !== 0) {
      let list = []
      timeRequested.map((time) => {
        list.push({
          time: time.timeRequest ? formatDate(time.timeRequest) : '',
          detail: time.description
        })
      })
      setListTimeChosen(list)
    }
  }, [timeRequested])

  useEffect(() => {
    if (currentTime) {
      // if (new Date(currentTime) !== "Invalid Date") && !isNaN(new Date(currentTime))
    }
  }, [currentTime])

  return (
    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
      <fieldset className='scheduler-border'>
        <legend className='scheduler-border'>{'Thời gian mong muốn'}</legend>
        <div className='row'>
          <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
            <div className='row'>
              <div className='col-xs-12 col-sm-3 col-md-3 col-lg-3'>
                <div className={`form-group ${!timeError ? '' : 'has-error'}`}>
                  <label>{'Chọn ngày'}</label>
                  <DatePicker
                    id={componentId ? componentId : `expected_date2`}
                    value={currentTime.time}
                    onChange={handleTimeChange}
                    disabled={false}
                  />
                  <ErrorLabel content={timeError} />
                </div>
              </div>
              <div className='col-xs-12 col-sm-5 col-md-5 col-lg-5'>
                <div className={`form-group`}>
                  <label>{'Yêu cầu thêm'}</label>
                  <textarea type='text' className='form-control' value={currentTime.detail} onChange={handleDetailChange} />
                  {/* <ErrorLabel content={errorGood} /> */}
                </div>
              </div>
              <div style={{ marginTop: '24px' }}>
                {/* {this.state.editGood ? ( */}
                {/* <React.Fragment>
                                        <button className="btn btn-success" 
                                        // onClick={this.handleCancelEditGood} 
                                        style={{ marginLeft: "10px" }}>
                                            {"cancel_editing_good"}
                                        </button>
                                        <button className="btn btn-success" 
                                        onClick={this.handleSaveEditGood} 
                                        style={{ marginLeft: "10px" }}>
                                            {"save_good"}
                                        </button>
                                    </React.Fragment> */}
                {/* ) : ( */}
                <button
                  className='btn btn-success'
                  style={{ marginLeft: '10px' }}
                  // disabled={!this.isGoodValidated()}
                  onClick={handleAddTime}
                >
                  {'Thêm yêu cầu'}
                </button>
                {/* )}
                                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>
                                    {translate("manufacturing.purchasing_request.delete_good")}
                                </button> */}
              </div>
            </div>

            <table className='table table-striped'>
              <thead>
                <tr>
                  <th>{'Số thứ tự'}</th>
                  <th>{'Ngày'}</th>
                  <th>{'Chi tiết'}</th>
                  {/* <th>{translate("manufacturing.plan.base_unit")}</th>
                                    <th>{translate("manufacturing.plan.quantity_good_inventory")}</th>
                                    <th>{translate("manufacturing.plan.quantity")}</th>
                                    <th>{translate("table.action")}</th> */}
                </tr>
              </thead>
              <tbody>
                {listTimeChosen && listTimeChosen.length === 0 ? (
                  <tr>
                    {/* <td colSpan={7}>{translate("general.no_data")}</td> */}
                    <td colSpan={3}>{'Không có dữ liệu'}</td>
                  </tr>
                ) : (
                  listTimeChosen.map((x, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{x.time}</td>
                      <td>{x.detail}</td>
                      {/* <td>
                                                    <a
                                                        href="#abc"
                                                        className="edit"
                                                        title={translate("general.edit")}
                                                        onClick={() => this.handleEditGood(x, index)}
                                                    >
                                                        <i className="material-icons"></i>
                                                    </a>
                                                    <a
                                                        href="#abc"
                                                        className="delete"
                                                        title={translate("general.delete")}
                                                        onClick={() => this.handleDeleteGood(index)}
                                                    >
                                                        <i className="material-icons"></i>
                                                    </a>
                                                </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </fieldset>
    </div>
  )
}

function mapState(state) {
  const listAllGoods = state.goods.listALLGoods
  return { listAllGoods }
}

const actions = {
  getAllGoods: GoodActions.getAllGoods
}

const connectedTransportTime = connect(mapState, actions)(withTranslate(TransportTime))
export { connectedTransportTime as TransportTime }
