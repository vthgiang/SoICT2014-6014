import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components'
import { withTranslate } from 'react-redux-multilingual'
import ValidationHelper from '../../../../../../helpers/validationHelper'
import { formatDate, formatToTimeZoneDate } from '../../../../../../helpers/formatDate'

import { BillActions } from '../../../../warehouse/bill-management/redux/actions'
import { CrmCustomerActions } from '../../../../../crm/customer/redux/actions'
import { GoodActions } from '../../../../common-production/good-management/redux/actions'
import { validate } from 'uuid'

function TransportTime(props) {
  const { callBackState, timeRequested, translate } = props

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
      if (!(currentTime.time && formatToTimeZoneDate(currentTime.time))) {
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
    } catch (error) {
      setErrorForm({
        ...errorForm,
        timeError: 'Ngày không hợp lệ'
      })
      return
    }
    let listTimes = [...listTimeChosen]
    let time = {
      time: currentTime.time,
      detail: currentTime.detail
    }
    if (listTimes && listTimes.length !== 0) {
      let flag = false
      for (let i = 0; i < listTimes.length; i++) {
        if (new String(listTimes[i].time).valueOf() == new String(time.time).valueOf()) {
          flag = true
          break
        }
      }
      if (!flag) {
        listTimes.push(time)
      }
      setListTimeChosen(listTimes)
    } else {
      setListTimeChosen([time])
    }
    // setListTimeChosen(listTimeChosen => [...listTimeChosen, time]);
  }
  const handleDeleteTime = (time) => {
    let listTimes = [...listTimeChosen]
    if (listTimes && listTimes.length !== 0) {
      let k = listTimes.filter((r) => new String(r.time).valueOf() != new String(time.time).valueOf())
      setListTimeChosen(k)
    }
  }
  useEffect(() => {
    console.log(listTimeChosen, ' danh sach thoi gian lua chon')
    callBackState(listTimeChosen)
  }, [listTimeChosen])

  useEffect(() => {
    if (timeRequested && timeRequested.length !== 0) {
      let list = []
      timeRequested.map((time) => {
        list.push({
          time: time.timeRequest,
          detail: time.description
        })
      })
      setListTimeChosen(list)
    }
  }, [timeRequested])
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
                  <DatePicker id={`expected_date`} value={currentTime.time} onChange={handleTimeChange} disabled={false} />
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
                  <th>{'Hành động'}</th>
                </tr>
              </thead>
              <tbody>
                {listTimeChosen && listTimeChosen.length === 0 ? (
                  <tr>
                    {/* <td colSpan={7}>{translate("general.no_data")}</td> */}
                    <td colSpan={4}>{'Không có dữ liệu'}</td>
                  </tr>
                ) : (
                  listTimeChosen.map((x, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{x.time}</td>
                      <td>{x.detail}</td>
                      <td>
                        {/* <a
                                                        href="#abc"
                                                        className="edit"
                                                        title={translate("general.edit")}
                                                        onClick={() => this.handleEditGood(x, index)}
                                                    >
                                                        <i className="material-icons"></i>
                                                    </a> */}
                        <a href='#abc' className='delete' title={translate('general.delete')} onClick={() => handleDeleteTime(x)}>
                          <i className='material-icons'></i>
                        </a>
                      </td>
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
