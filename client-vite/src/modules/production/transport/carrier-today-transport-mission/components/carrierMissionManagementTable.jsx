import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox, DialogModal, DatePicker } from '../../../../../common-components'

import { formatDate, formatToTimeZoneDate } from '../../../../../helpers/formatDate'

import { DetailMission } from './detailMission'
import { CarrierMissionReport } from './carrierMissionReport'

import { transportPlanActions } from '../../transport-plan/redux/actions'
import { transportScheduleActions } from '../../transport-schedule/redux/actions'

import { transportProcessActions } from '../../transport-route/redux/actions'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'

import { getTypeRequirement } from '../../transportHelper/getTextFromValue'

function CarrierMissionManagementTable(props) {
  let { transportPlanId, transportPlan, transportSchedule, socket, sendCurrentLocate } = props
  const [transportScheduleByCarrierId, setTransportScheduleByCarrierId] = useState()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentVehicleRoute, setCurrentVehicleRoute] = useState()
  // const [currentVehicle, setCurrentVehicle] = useState([])
  // const [driver, setDriver] = useState()
  const [currentMission, setCurrentMission] = useState()

  const [sendCurrentLocateTimer, setSendCurrentLocateTimer] = useState([])
  const [currentPosition, setCurrentPosition] = useState({})
  const [currentPlanId, setCurrentPlanId] = useState()

  const handleCarrierDateChange = (value) => {
    setCurrentDate(formatToTimeZoneDate(value))
  }

  const [currentPositionCarrierShow, setCurrentPositionCarrierShow] = useState()
  const [currentPositionCarrierShowTimeInterval, setCurrentPositionCarrierShowTimeInterval] = useState()
  const handleShowMissionDetail = (mission, index) => {
    setCurrentMission({ mission: mission, stt: index })
    const setCurrentPositionShow = (position) => {
      const currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      // setCurrentPosition(currentPosition);
      let data = {
        location: currentPosition
      }
      console.log(new Date())
      setCurrentPositionCarrierShow(data)
    }

    navigator.geolocation.getCurrentPosition(setCurrentPositionShow)
    setCurrentPositionCarrierShowTimeInterval(
      setInterval(() => {
        navigator.geolocation.getCurrentPosition(setCurrentPositionShow)
      }, 30000)
    )
    window.$(`#modal-detail-mission`).modal('show')
  }
  const handleShowMissionDetailClearInterval = () => {
    clearInterval(currentPositionCarrierShowTimeInterval)
    setCurrentPositionCarrierShow()
  }
  const handleShowMissionReport = (mission, index) => {
    setCurrentMission(mission)
    window.$(`#modal-carrier-report-process`).modal('show')
  }

  const getTransportStatus = (routeOrdinal) => {
    if (routeOrdinal && routeOrdinal.transportRequirement && routeOrdinal.transportRequirement.transportStatus) {
      if (String(routeOrdinal.type) === '1') {
        if (String(routeOrdinal.transportRequirement.transportStatus.fromAddress?.status) === '1') {
          return 'Đã lấy được hàng'
        } else {
          return 'Chưa lấy được hàng'
        }
      } else {
        if (String(routeOrdinal.transportRequirement.transportStatus.toAddress?.status) === '1') {
          return 'Đã giao hàng'
        } else {
          return 'Chưa giao được hàng'
        }
      }
    }
    return 'Chưa tiến hành'
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    })
    props.getTransportScheduleByCarrierId(localStorage.getItem('userId'))

    let manageId
    const sendCurrentPosition = (position) => {
      const currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      // setCurrentPosition(currentPosition);
      let data = {
        manageId: manageId,
        location: currentPosition
      }
      console.log(data, ' haha')
      setCurrentPosition(data)
    }
    /** Nhận được tín hiệu quản lý vào xem map => gửi lại vị trí hiện tại
     * data: {manageId: manageId}
     * driver
     */
    socket.io.on('start locate', (data) => {
      console.log(data, ' aaaaaaaaaaaaaaaaaaaa')
      if (data?.manageId) {
        manageId = data.manageId
        // navigator.geolocation.getCurrentPosition(sendCurrentPosition);
        navigator.geolocation.getCurrentPosition(sendCurrentPosition)
        let interval = setInterval(() => {
          // sendCurrentPosition();
          navigator.geolocation.getCurrentPosition(sendCurrentPosition)
        }, 30000)
        // let interval =1;
        // Lưu lại id interval để stop locate => clearInterval
        setSendCurrentLocateTimer(interval)
      }
    })

    /**
     * Dừng gửi vị trí
     * driver
     */
    socket.io.on('stop locate', (data) => {
      console.log(data, ' stop locate')
      console.log(data, ' currenttimerr')
      clearInterval(data.interval)
    })
  }, [])
  useEffect(() => {
    // console.log(currentPosition, " currentPosition");
    if (currentPosition && sendCurrentLocateTimer) {
      props.sendCurrentLocate({ ...currentPosition, interval: sendCurrentLocateTimer })
    }
  }, [currentPosition, sendCurrentLocateTimer])
  useEffect(() => {
    if (transportSchedule) {
      setTransportScheduleByCarrierId(transportSchedule.transportScheduleByCarrierId)
      console.log(transportSchedule.transportScheduleByCarrierId)
    }
  }, [transportSchedule])
  useEffect(() => {
    // console.clear();
    // console.log(transportScheduleByCarrierId)
  }, [transportScheduleByCarrierId])
  // const handleShowReportMission = (routeOrdinal_i) => {
  //     let data = {
  //         planId: transportPlanId,
  //         requirementId: routeOrdinal_i.transportRequirement._id,
  //         status: 1,
  //         description: " "
  //     }
  //     props.changeTransportRequirementProcess(data);
  //     window.$(`#modal-report-process`).modal('show');
  // }

  // useEffect(() => {
  //     if(transportPlanId){
  //         props.getDetailTransportPlan(transportPlanId);
  //     }
  // }, [transportPlanId])
  // useEffect(() => {
  //     if (transportPlan && currentVehicleRoute && transportPlan.currentTransportPlan) {
  //         let vehicle = transportPlan.currentTransportPlan.transportVehicles
  //                     .filter(r=> String(r.vehicle) ===currentVehicleRoute?.transportVehicle?._id)
  //         if (vehicle && vehicle.length!==0){
  //             setCurrentVehicle(vehicle[0]);
  //         }
  //     }
  // }, [transportPlan, currentVehicleRoute])

  // useEffect(() => {
  //     console.log(currentVehicle, " day la xe co nguoi")
  //     if (currentVehicle && currentVehicle.carriers && currentVehicle.carriers.length!==0){
  //         console.log(currentVehicle.carriers)
  //         let dri = currentVehicle.carriers.filter(r => String(r.pos) === "1");
  //         console.log(dri);
  //         if (dri && dri.length !==0 ){
  //             setDriver(dri[0]);
  //         }
  //     }
  // }, [currentVehicle])

  // useEffect(() => {
  //     console.log(currentVehicleRoute, " day la currentVehicleRoute");
  // }, [currentVehicleRoute])
  useEffect(() => {
    let flag = false
    if (currentDate && transportScheduleByCarrierId && transportScheduleByCarrierId.length !== 0) {
      transportScheduleByCarrierId.map((item) => {
        if (item.transportPlan && item.transportPlan.endTime && item.transportPlan.startTime) {
          if (
            formatDate(item.transportPlan.endTime) === formatDate(currentDate) &&
            formatDate(item.transportPlan.startTime) === formatDate(currentDate)
          ) {
            flag = true
            setCurrentVehicleRoute(item.route)
            setCurrentPlanId(item.transportPlan._id)
            console.log(item.transportPlan)
          }
        }
      })
    }
    if (!flag) setCurrentVehicleRoute({})
  }, [currentDate, transportScheduleByCarrierId])
  return (
    <React.Fragment>
      <div className='box-body qlcv'>
        {/* <TransportDialogMissionReport /> */}
        <DetailMission
          currentMission={currentMission?.mission}
          stt={currentMission?.stt}
          currentPositionCarrierShow={currentPositionCarrierShow}
          allMissions={currentVehicleRoute?.routeOrdinal}
          handleShowMissionDetailClearInterval={handleShowMissionDetailClearInterval}
        />
        <CarrierMissionReport currentMission={currentMission} currentPlanId={currentPlanId} />
        <div className='form-inline'>
          <div className='form-group'>
            <DatePicker id={`carrier_day`} value={formatDate(currentDate)} onChange={handleCarrierDateChange} disabled={false} />
          </div>
        </div>
        <div>{/* <div>Tài xế: {driver?.carrier?.name}</div> */}</div>
        <table
          id={currentVehicleRoute ? currentVehicleRoute.transportVehicle : 'route'}
          className='table table-striped table-bordered table-hover'
        >
          <thead>
            <tr>
              <th className='col-fixed' style={{ width: 60 }}>
                {'STT'}
              </th>
              <th>{'Mã yêu cầu'}</th>
              <th>{'Loại yêu cầu'}</th>
              <th>{'Địa chỉ'}</th>
              <th>{'Nhiệm vụ'}</th>
              <th>{'Trạng thái'}</th>
              <th>{'Hành động'}</th>
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
            {currentVehicleRoute &&
              currentVehicleRoute.length !== 0 &&
              currentVehicleRoute.routeOrdinal &&
              currentVehicleRoute.routeOrdinal.length !== 0 &&
              currentVehicleRoute.routeOrdinal.map(
                (routeOrdinal, index) =>
                  routeOrdinal && (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{routeOrdinal.transportRequirement?.code}</td>
                      <td>{getTypeRequirement(routeOrdinal.transportRequirement?.type)}</td>
                      <td>
                        {String(routeOrdinal.type) === '1'
                          ? routeOrdinal.transportRequirement?.fromAddress
                          : routeOrdinal.transportRequirement?.toAddress}
                      </td>
                      <td>{String(routeOrdinal.type) === '1' ? 'Nhận hàng' : 'Trả hàng'}</td>
                      <td>
                        {/* {routeOrdinal.transportRequirement?.transportStatus} */}
                        {getTransportStatus(routeOrdinal)}
                      </td>
                      {/* <td>{"Chưa hoàn thành"}</td> */}
                      <td style={{ textAlign: 'center' }}>
                        <a
                          className='edit text-green'
                          style={{ width: '5px' }}
                          // title={translate('manage_example.detail_info_example')}
                          title={'Thông tin chi tiết yêu cầu vận chuyển'}
                          onClick={() => handleShowMissionDetail(routeOrdinal, index)}
                        >
                          <i className='material-icons'>visibility</i>
                        </a>
                        <a
                          className='edit text-blue'
                          style={{ width: '5px' }}
                          // title={translate('manage_example.detail_info_example')}
                          title={'Báo cáo nhiện vụ vận chuyển'}
                          onClick={() => handleShowMissionReport(routeOrdinal, index)}
                        >
                          <i className='material-icons'>assignment_turned_in</i>
                        </a>
                      </td>
                    </tr>
                  )
              )}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { transportSchedule, socket } = state
  return { transportSchedule, socket }
}

const actions = {
  // getTransportScheduleByPlanId: transportScheduleActions.getTransportScheduleByPlanId,
  getTransportScheduleByCarrierId: transportScheduleActions.getTransportScheduleByCarrierId,
  sendCurrentLocate: transportProcessActions.sendCurrentLocate
  // changeTransportRequirementProcess: transportScheduleActions.changeTransportRequirementProcess,
  // getDetailTransportPlan: transportPlanActions.getDetailTransportPlan,
}

const connectedCarrierMissionManagementTable = connect(mapState, actions)(withTranslate(CarrierMissionManagementTable))
export { connectedCarrierMissionManagementTable as CarrierMissionManagementTable }
