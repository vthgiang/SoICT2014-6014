import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  ButtonModal,
  DialogModal,
  ErrorLabel,
  DatePicker,
  SelectBox,
  LazyLoadComponent,
  forceCheckOrVisible
} from '../../../../../common-components'
import { withTranslate } from 'react-redux-multilingual'
import { generateCode } from '../../../../../helpers/generateCode'
import { formatToTimeZoneDate, formatDate } from '../../../../../helpers/formatDate'
import ValidationHelper from '../../../../../helpers/validationHelper'

import { LocationMap } from './map/locationMap'
import { MapContainer } from '../../transportHelper/mapbox/map'
import { TransportVehicleAndCarrierSelect } from './transport-plan-create/transportVehicleAndCarrierSelect'
import { TransportVehicleCarrier2 } from './transportVehicleCarrier2'

import { transportPlanActions } from '../redux/actions'
import { transportDepartmentActions } from '../../transport-department/redux/actions'
import { transportRequirementsActions } from '../../transport-requirements/redux/actions'
import { getTypeRequirement } from '../../transportHelper/getTextFromValue'

import {} from './transport-plan.css'

function TransportPlanCreateForm(props) {
  // let allTransportRequirements;
  let { transportRequirements, transportDepartment, transportPlan } = props
  const [formSchedule, setFormSchedule] = useState({
    code: '',
    startDate: '',
    endDate: '',
    name: 'Kế hoạch vận chuyển',
    supervisor: 'title'
  })

  /**
   * Danh sách tất cả transportrequirements theo thứ tự ưu tiên
   * [transportRequirement, ...]
   */
  const [listRequirements, setListRequirements] = useState([])

  /**
   * Danh sách transportrequirements đã lựa chọn
   * [id, id...]
   */
  const [listSelectedRequirements, setListSelectedRequirements] = useState([])
  /**
   * Danh sách vị trí tọa độ tương ứng với transportrequirements
   */
  const [listSelectedRequirementsLocation, setListSelectedRequirementsLocation] = useState([])

  const [totalPayloadVolume, setTotalPayloadVolume] = useState({
    payload: 0,
    volume: 0
  })

  const isFormValidated = () => {
    if (formSchedule.startDate !== '' && formSchedule.endDate !== '' && formSchedule.supervisor !== 'title' && formSchedule.name !== '') {
      let startTime = new Date(formSchedule.startDate)
      startTime.setHours(10, 10, 10)
      let endTime = new Date(formSchedule.endDate)
      endTime.setHours(15, 15, 15)
      if (startTime.getTime() < endTime.getTime()) {
        return true
      }
    }

    return false
  }

  const handleClickCreateCode = () => {
    setFormSchedule({
      ...formSchedule,
      code: generateCode('KHVC')
    })
  }

  const handlePlanNameChange = (e) => {
    setFormSchedule({
      ...formSchedule,
      name: e.target.value
    })
  }

  const handleStartDateChange = async (value) => {
    await setFormSchedule({
      ...formSchedule,
      startDate: formatToTimeZoneDate(value)
    })
  }

  const handleEndDateChange = async (value) => {
    console.log(value, ' end date change')
    await setFormSchedule({
      ...formSchedule,
      endDate: formatToTimeZoneDate(value)
    })
  }

  const getSupervisor = () => {
    let supervisorList = [
      {
        value: 'title',
        text: 'Chọn người giám sát'
      }
    ]
    if (transportDepartment && transportDepartment.listUser && transportDepartment.listUser.length !== 0) {
      let listUser = transportDepartment.listUser.filter((r) => Number(r.role) === 2)
      if (listUser && listUser.length !== 0 && listUser[0].list && listUser[0].list.length !== 0) {
        listUser[0].list.map((userId) => {
          supervisorList.push({
            value: userId._id,
            text: userId.name
          })
        })
      }
    }
    return supervisorList
  }

  const handleSupervisorChange = (value) => {
    setFormSchedule({
      ...formSchedule,
      supervisor: value[0]
    })
  }

  const save = () => {
    props.createTransportPlan({
      ...formSchedule,
      creator: localStorage.getItem('userId'),
      currentRole: localStorage.getItem('currentRole')
    })
    setFormSchedule({
      code: '',
      startDate: '',
      endDate: '',
      name: 'Kế hoạch vận chuyển',
      supervisor: 'title'
    })
  }

  /**
   * sắp xếp và trả về thứ tự ưu tiên các yêu cần vận chuyển
   * theo thời gian yêu cầu và thời gian của kế hoạch
   * @param {*} allTransportRequirements
   */
  const arrangeRequirement = (allTransportRequirements, date) => {
    let result = []
    let calArr = []
    if (allTransportRequirements && allTransportRequirements.length !== 0) {
      allTransportRequirements.map((requirement, index) => {
        let mark = 0
        if (requirement.timeRequests && requirement.timeRequests.length !== 0) {
          requirement.timeRequests.map((time) => {
            let timeRequest = new Date(time.timeRequest)
            if (
              timeRequest.getDate() === date.getDate() &&
              timeRequest.getMonth() === date.getMonth() &&
              timeRequest.getFullYear() === date.getFullYear()
            ) {
              mark = 5 * 86400000
            }
          })
        }
        const createdAt = new Date(requirement.createdAt)
        mark += date.getTime() - createdAt.getTime()
        calArr.push({
          requirement: requirement,
          mark: mark
        })
      })
      calArr.sort((a, b) => {
        return b.mark - a.mark
      })
      for (let i = 0; i < calArr.length; i++) {
        result.push(calArr[i].requirement)
      }
    }
    return result
  }

  const handleSelectRequirement = (requirement) => {
    let arr = [...listSelectedRequirements]
    let pos = arr.indexOf(requirement._id)
    if (pos >= 0) {
      arr = arr.slice(0, pos).concat(arr.slice(pos + 1))
    } else {
      arr.push(requirement._id)
    }
    // console.log(arr);
    setListSelectedRequirements(arr)
  }

  const getStatusTickBox = (requirement) => {
    if (listSelectedRequirements && listSelectedRequirements.length !== 0) {
      if (listSelectedRequirements.indexOf(requirement._id) >= 0) {
        return 'iconactive'
      } else {
        return 'iconinactive'
      }
    } else {
      return 'iconinactive'
    }
  }

  // useEffect(() => {
  //     props.getAllTransportRequirements({page:1, limit: 100, status: 2})
  // }, [])

  // useEffect(() => {
  //     console.log(formSchedule, " day la form schedule");
  // }, [formSchedule])
  useEffect(() => {
    // props.getUserByRole({currentUserId: localStorage.getItem('userId'), role: 2});
  }, [])
  useEffect(() => {
    props.getAllTransportRequirements({ page: 1, limit: 100, status: '2' })
  }, [formSchedule.startDate, formSchedule.endDate])
  useEffect(() => {
    if (transportRequirements) {
      let { lists } = transportRequirements
      console.log(transportRequirements)
      if (lists && lists.length !== 0) {
        if (formSchedule.startDate && formSchedule.endDate) {
          const startDate = new Date(formSchedule.startDate)
          const endDate = new Date(formSchedule.endDate)
          if (startDate.getTime() <= endDate.getTime()) {
            console.log('oje vasd')
            setListRequirements(arrangeRequirement(lists, startDate))
          }
        } else {
          setListRequirements(lists)
        }
      }
    }
  }, [formSchedule.startDate, formSchedule.endDate, transportRequirements])

  useEffect(() => {
    setFormSchedule({
      ...formSchedule,
      transportRequirements: listSelectedRequirements
    })

    let locationArr = []
    if (listRequirements && listRequirements.length !== 0 && listSelectedRequirements && listSelectedRequirements.length !== 0) {
      listRequirements.map((item, index) => {
        if (listSelectedRequirements.indexOf(item._id) >= 0) {
          // console.log(item, "otem");
          locationArr.push(
            {
              name: String(index + 1),
              location: {
                lat: item.geocode?.fromAddress?.lat,
                lng: item.geocode?.fromAddress?.lng
              }
            },
            {
              name: String(index + 1),
              location: {
                lat: item.geocode?.toAddress?.lat,
                lng: item.geocode?.toAddress?.lng
              }
            }
          )
        }
      })
    }
    // console.log(locationArr, " ar")
    setListSelectedRequirementsLocation(locationArr)

    if (listSelectedRequirements && listSelectedRequirements.length !== 0) {
      let totalPayload = 0
      let totalVolume = 0
      listSelectedRequirements.map((item) => {
        totalPayload += item.payload
        totalVolume += item.volume
      })
      setTotalPayloadVolume({
        payload: totalPayload,
        volume: totalVolume
      })
    }
  }, [listSelectedRequirements])

  const callBackVehicleAndCarrier = (transportVehicles) => {
    setFormSchedule({
      ...formSchedule,
      transportVehicles: transportVehicles
    })
  }

  return (
    <React.Fragment>
      <ButtonModal
        onButtonCallBack={handleClickCreateCode}
        modalID={'modal-create-transport-plan'}
        button_name={'Thêm kế hoạch vận chuyển'}
        title={'Thêm kế hoạch vận chuyển'}
      />
      <DialogModal
        modalID='modal-create-transport-plan'
        isLoading={false}
        formID='form-create-transport-requirements'
        title={'Thêm kế hoạch vận chuyển'}
        msg_success={'success'}
        msg_failure={'fail'}
        func={save}
        disableSubmit={!isFormValidated()}
        size={100}
        maxWidth={500}
      >
        <form id='form-create-transport-requirements'>
          <div className='nav-tabs-custom'>
            <ul className='nav nav-tabs'>
              <li className='active'>
                <a href='#plan-list-transport-carrier' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
                  {'Thống kê phương tiện và nhân viên'}
                </a>
              </li>
              <li>
                <a href='#plan-list-transport-requirement' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
                  {'Tạo thông tin chung kế hoạch và chọn yêu cầu vận chuyển'}
                </a>
              </li>
              <li>
                <a href='#plan-transport-vehicle-carrier' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
                  {'Chọn phương tiện và nhân viên'}
                </a>
              </li>
            </ul>
            <div className='tab-content'>
              <div className='tab-pane active' id='plan-list-transport-carrier'>
                <TransportVehicleCarrier2
                  transportPlan={transportPlan}
                  // key={transportPlan}
                />
              </div>
              <div className='tab-pane' id='plan-list-transport-requirement'>
                <div className='box-body'>
                  <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                    <div className='col-xs-12 col-sm-12 col-md-4 col-lg-4'>
                      <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                        <div className='form-group'>
                          <label>
                            Mã kế hoạch <span className='attention'> </span>
                          </label>
                          <input type='text' className='form-control' disabled={true} value={formSchedule.code} />
                        </div>
                      </div>
                      <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                        <div className='form-group'>
                          <label>
                            Tên kế hoạch <span className='attention'> </span>
                          </label>
                          <input
                            type='text'
                            className='form-control'
                            disabled={false}
                            value={formSchedule.name}
                            onChange={handlePlanNameChange}
                          />
                        </div>
                      </div>
                      <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                        <div className={`form-group`}>
                          <label>
                            Người phụ trách giám sát
                            <span className='attention'> * </span>
                          </label>
                          <SelectBox
                            id={`select-type-requirement`}
                            className='form-control select2'
                            style={{ width: '100%' }}
                            value={formSchedule.supervisor}
                            items={getSupervisor()}
                            onChange={handleSupervisorChange}
                            multiple={false}
                          />
                        </div>
                      </div>

                      <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                        <div className='form-group'>
                          <label>
                            Ngày bắt đầu <span className='attention'> * </span>
                          </label>
                          <DatePicker
                            id={`start_date1`}
                            value={formatDate(formSchedule.startDate)}
                            onChange={handleStartDateChange}
                            disabled={false}
                          />
                        </div>
                      </div>
                      <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                        <div className={`form-group`}>
                          <label>
                            Ngày kết thúc
                            <span className='attention'> * </span>
                          </label>
                          <DatePicker
                            id={`end_date1`}
                            value={formatDate(formSchedule.endDate)}
                            onChange={handleEndDateChange}
                            disabled={false}
                          />
                        </div>
                      </div>
                    </div>

                    <div className='col-xs-12 col-sm-12 col-md-8 col-lg-8'>
                      {listRequirements && listRequirements.length !== 0 && (
                        // <LocationMap
                        //     locations = {listSelectedRequirementsLocation}
                        //     loadingElement={<div style={{height: `100%`}}/>}
                        //     containerElement={<div style={{height: "50vh"}}/>}
                        //     mapElement={<div style={{height: `100%`}}/>}
                        //     defaultZoom={11}
                        // />
                        <MapContainer nonDirectLocations={listSelectedRequirementsLocation} />
                      )}
                    </div>
                  </div>

                  <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                      {listRequirements && listRequirements.length !== 0 && (
                        <table id={'1'} className='table table-striped table-bordered table-hover' style={{ marginTop: '10px' }}>
                          <thead>
                            <tr>
                              <th className='col-fixed' style={{ width: 60 }}>
                                {'STT'}
                              </th>
                              <th>{'Mã yêu cầu'}</th>
                              <th>{'Loại yêu cầu'}</th>
                              <th>{'Địa chỉ nhận hàng'}</th>
                              <th>{'Địa chỉ giao hàng'}</th>
                              <th>{'Ngày tạo'}</th>
                              <th>{'Ngày mong muốn vận chuyển'}</th>
                              {/* <th>{"Trạng thái"}</th> */}
                              <th>{'Thêm vào kế hoạch'}</th>
                              {/* <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                            <DataTableSetting
                                                tableId={tableId}
                                                columnArr={[
                                                    translate('manage_example.index'),
                                                    translate('manage_example.exampleName'),
                                                    translate('manage_example.description'),
                                                ]}
                                                setLimit={setLimit}
                                            />
                                        </th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {listRequirements &&
                              listRequirements.length !== 0 &&
                              listRequirements.map(
                                (x, index) =>
                                  x && (
                                    <tr key={index + x._id}>
                                      <td>{index + 1}</td>
                                      <td>{x.code}</td>
                                      <td>{getTypeRequirement(x.type)}</td>
                                      <td>{x.fromAddress}</td>
                                      <td>{x.toAddress}</td>
                                      <td>{x.createdAt ? formatDate(x.createdAt) : ''}</td>
                                      <td>
                                        {x.timeRequests &&
                                          x.timeRequests.length !== 0 &&
                                          x.timeRequests.map((timeRequest, index2) => (
                                            <div key={index + ' ' + index2}>{index2 + 1 + '/ ' + formatDate(timeRequest.timeRequest)}</div>
                                          ))}
                                      </td>
                                      {/* <td>{x.status}</td> */}
                                      <td style={{ textAlign: 'center' }} className='tooltip-checkbox'>
                                        <span
                                          className={'icon ' + getStatusTickBox(x)}
                                          title={'alo'}
                                          onClick={() => handleSelectRequirement(x)}
                                        ></span>
                                      </td>
                                    </tr>
                                  )
                              )}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='tab-pane' id='plan-transport-vehicle-carrier'>
                <LazyLoadComponent>
                  <TransportVehicleAndCarrierSelect
                    key={formSchedule.endDate}
                    startTime={formSchedule.startDate}
                    endTime={formSchedule.endDate}
                    callBackVehicleAndCarrier={callBackVehicleAndCarrier}
                    totalPayloadVolume={totalPayloadVolume}
                  />
                </LazyLoadComponent>
              </div>
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { transportRequirements, transportDepartment } = state
  // console.log(transportDepartment);
  return { transportRequirements, transportDepartment }
}

const actions = {
  getAllTransportRequirements: transportRequirementsActions.getAllTransportRequirements,
  createTransportPlan: transportPlanActions.createTransportPlan,
  getUserByRole: transportDepartmentActions.getUserByRole
}

const connectedTransportPlanCreateForm = connect(mapState, actions)(withTranslate(TransportPlanCreateForm))
export { connectedTransportPlanCreateForm as TransportPlanCreateForm }
