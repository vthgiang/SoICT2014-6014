import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox, DialogModal } from '../../../../../common-components'

import { formatDate } from '../../../../../helpers/formatDate'

import { TransportManageVehicleProcess } from './transportManageVehicleProcess'

import { TransportDetailRoute } from './transportListMissionProcess'
import { TransportDetailMap } from './transportDetailMap'

import { transportPlanActions } from '../../transport-plan/redux/actions'
import { transportScheduleActions } from '../../transport-schedule/redux/actions'
import { transportProcessActions } from '../redux/actions'

import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'

import './timeLine.css'

function TransportManageProcess(props) {
  const { currentTransportPlan, transportSchedule, socket } = props

  const [currentTransportSchedule, setCurrentTransportSchedule] = useState()

  // Vị trí hiện tại
  const [currentPosition, setCurrentPosition] = useState({})

  const [currentVehicleRoute, setCurrentVehicleRoute] = useState({})
  const [currentVehicleRoute_transportVehicleId, setCurrentVehicleRoute_transportVehicleId] = useState()

  const [longestRoute, setLongestRoute] = useState()
  const [getLocateOnMap, setGetLocateOnMap] = useState(false)

  const [sendCurrentLocateTimer, setSendCurrentLocateTimer] = useState([])

  // manage
  const [currentLocationOnMap, setCurrentLocationOnMap] = useState([])

  const handleShowDetailRoute = (route) => {
    setCurrentVehicleRoute_transportVehicleId(route)
    // setCurrentVehicleRoute(route);
    window.$(`#modal-detail-route-manage`).modal('show')
  }

  /**
   * Show bản đồ => yêu cầu gửi vị trí hiện tại để show lên map
   * @param {*} route
   */
  const handleShowDetailMap = (route) => {
    console.log('okkkk')
    console.log(currentTransportPlan)
    // if (currentTransportPlan && Number(currentTransportPlan.status) === 4){

    if (currentTransportPlan) {
      setCurrentVehicleRoute(route)
      setGetLocateOnMap(true)
      props.startLocate({ manageId: localStorage.getItem('userId'), driverId: getDriver(route.transportVehicle?._id)?.id })
      window.$(`#modal-detail-map`).modal('show')
    }
  }
  // useEffect(() => {
  //     if (props.socket){
  //         props.socket.io.on("hihi", data => {
  //             console.log(data);
  //         });
  //     }
  // }, [])

  /**
   * Tính chiều dài route hiện tại (so với các route khác trong cùng kế hoạch)
   * @param {*} item
   */
  const getBarWidth = (item) => {
    let length = 0
    if (longestRoute && longestRoute !== 0) {
      if (item.routeOrdinal && item.routeOrdinal.length !== 0) {
        item.routeOrdinal.map((routeOrdinal) => {
          length += routeOrdinal.distance ? routeOrdinal.distance : 0
        })
      }
    }
    console.log(length, longestRoute)
    return (length / longestRoute) * 100
  }

  const getDriver = (vehicleId) => {
    let driver = { id: ' ', name: ' ' }
    if (currentTransportPlan && currentTransportPlan.transportVehicles && currentTransportPlan.transportVehicles.length !== 0) {
      let transportVehicles = currentTransportPlan.transportVehicles.filter((r) => String(r.vehicle?._id) === String(vehicleId))
      if (transportVehicles && transportVehicles.length !== 0) {
        let carriers = transportVehicles[0]?.carriers
        if (carriers && carriers.length !== 0) {
          let carrier_driver = carriers.filter((c) => String(c.pos) === '1')
          if (carrier_driver && carrier_driver.length !== 0) {
            driver.name = carrier_driver[0]?.carrier?.name
            driver.id = carrier_driver[0]?.carrier?._id
          }
        }
      }
    }
    return driver
  }

  const getCarriers = (vehicleId) => {
    let listCarriers = ''
    if (currentTransportPlan && currentTransportPlan.transportVehicles && currentTransportPlan.transportVehicles.length !== 0) {
      let transportVehicles = currentTransportPlan.transportVehicles.filter((r) => String(r.vehicle?._id) === String(vehicleId))
      if (transportVehicles && transportVehicles.length !== 0) {
        let carriers = transportVehicles[0]?.carriers
        if (carriers && carriers.length !== 0) {
          let carrier_driver = carriers.filter((c) => String(c.pos) !== '1')
          if (carrier_driver && carrier_driver.length !== 0) {
            carrier_driver.map((cd, indexcd) => {
              if (cd.carrier && cd.carrier.name) {
                if (indexcd !== 0) {
                  listCarriers = listCarriers.concat(', ')
                }
                listCarriers = listCarriers.concat(cd.carrier.name)
              }
            })
          }
        }
      }
    }
    return listCarriers
  }
  // setInterval(()=>{
  //     navigator.geolocation.getCurrentPosition(success);
  // }, 50000)

  const stopGetLocateOnMap = () => {
    setGetLocateOnMap(false)
    props.stopLocate({ driverId: getDriver(currentVehicleRoute.transportVehicle?._id)?.id, interval: sendCurrentLocateTimer })
  }

  useEffect(() => {
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
    //   const sendCurrentPosition = () => {
    //     const currentPosition = {
    //       lat: 13,
    //       lng: 12,
    //     }
    //     // setCurrentPosition(currentPosition);
    //     let data = {
    //         manageId: manageId,
    //         location: currentPosition
    //     }
    //     console.log(data, " haha")
    //     setCurrentPosition(data)
    //   };
    // socket.io.on("current position", data => {
    //     console.log(data);
    // })
    // console.log(localStorage.getItem("userId"))
    /** Nhận được tín hiệu quản lý vào xem map => gửi lại vị trí hiện tại
     * data: {manageId: manageId}
     * driver
     */
    socket.io.on('start locate', (data) => {
      console.log(data, ' aaaaaaaaaaaaaaaaaaaa')
      if (data?.manageId) {
        manageId = data.manageId
        // navigator.geolocation.getCurrentPosition(sendCurrentPosition);

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
     * Nhận vị trí driver gửi lại
     * data : location: {lat: , lng: }
     * manager
     */
    socket.io.on('send current locate', (data) => {
      if (data.location) {
        console.log(data.location, '  send current locate adminnnnnnnn ')
        // setCurrentPosition(data.location);
        setSendCurrentLocateTimer(data.interval)
        setCurrentLocationOnMap(data.location)
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
      // if (localStorage.getItem("userId") !== '607a98a6e57ad61670049a2c')
      // props.driverSendMessage({
      //     data: {
      //         position: currentPosition,
      //     }
      // })
      props.sendCurrentLocate({ ...currentPosition, interval: sendCurrentLocateTimer })
    }
  }, [currentPosition, sendCurrentLocateTimer])
  useEffect(() => {
    if (currentTransportPlan && currentTransportPlan._id !== '0') {
      props.getTransportScheduleByPlanId(currentTransportPlan._id)
    }
  }, [currentTransportPlan])

  useEffect(() => {
    if (transportSchedule) {
      setCurrentTransportSchedule(transportSchedule.currentTransportSchedule)
    }
  }, [transportSchedule])

  useEffect(() => {
    if (
      currentVehicleRoute_transportVehicleId &&
      currentTransportSchedule &&
      currentTransportSchedule.route &&
      currentTransportSchedule.route.length !== 0
    ) {
      let tmpCurrentRoute = currentTransportSchedule.route.filter(
        (r) => String(r.transportVehicle?._id) === String(currentVehicleRoute_transportVehicleId)
      )
      if (tmpCurrentRoute && tmpCurrentRoute.length !== 0) {
        setCurrentVehicleRoute(tmpCurrentRoute[0])
      }
    }
  }, [currentTransportSchedule, currentVehicleRoute_transportVehicleId])

  useEffect(() => {
    // console.log(currentTransportSchedule, " allll")
    if (currentTransportSchedule && currentTransportSchedule.route && currentTransportSchedule.route.length !== 0) {
      let resLength = 0
      currentTransportSchedule.route.map((r) => {
        if (r.routeOrdinal && r.routeOrdinal.length !== 0) {
          let length = 0
          r.routeOrdinal.map((routeOrdinal) => {
            length += routeOrdinal.distance ? routeOrdinal.distance : 0
          })
          if (length > resLength) resLength = length
        }
      })
      setLongestRoute(resLength)
    }
  }, [currentTransportSchedule])

  // const success = position => {
  //     const currentPosition = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //     }
  //     setCurrentPosition(currentPosition);
  //   };

  useEffect(() => {
    // navigator.geolocation.getCurrentPosition(success);
    // const timer = setTimeout(() => {
    //     navigator.geolocation.getCurrentPosition(success);
    // }, 5000);
    // return () => clearTimeout(timer);
  })

  return (
    <DialogModal
      modalID={`modal-detail-process`}
      title={'Chi tiết thực hiện vận chuyển'}
      formID={`modal-detail-process`}
      size={100}
      maxWidth={500}
      hasSaveButton={false}
      hasNote={false}
    >
      <div className='box-body qlcv'>
        {currentTransportPlan && (
          <TransportDetailRoute currentVehicleRoute={currentVehicleRoute} transportPlanId={currentTransportPlan?._id} />
        )}
        <TransportDetailMap
          currentVehicleRoute={currentVehicleRoute}
          getLocateOnMap={getLocateOnMap}
          stopGetLocateOnMap={stopGetLocateOnMap}
          currentLocationOnMap={currentLocationOnMap}
        />
        {currentTransportPlan &&
          currentTransportSchedule &&
          currentTransportSchedule.route &&
          currentTransportSchedule.route.length !== 0 &&
          currentTransportSchedule.route.map(
            (item, index) =>
              item && (
                // <fieldset className="scheduler-border" style={{ height: "100%" }}>
                //     <legend className="scheduler-border">{item.transportVehicle?.name}</legend>
                <div className='box box-solid' key={index}>
                  {/* <div className="box-header"> */}
                  {/* <div className="box-title">{item.transportVehicle?.name +" - " +item.transportVehicle?.code}</div> */}
                  {/* </div> */}

                  <div className='box-body qlcv'>
                    <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
                      <table className='transport-process-detail-vehicle'>
                        <tbody>
                          <tr>
                            <td>
                              <strong>Mã xe: </strong>
                            </td>
                            <td>{item.transportVehicle?.code}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Trọng tải xe: </strong>
                            </td>
                            <td>{item.transportVehicle?.payload}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Thể tích thùng chứa: </strong>
                            </td>
                            <td>{item.transportVehicle?.volume}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
                      <table className='transport-process-detail-vehicle'>
                        <tbody>
                          <tr>
                            <td>
                              <strong>Tài xế: </strong>
                            </td>
                            <td>{getDriver(item.transportVehicle?._id)?.name}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Đi cùng: </strong>
                            </td>
                            <td>{getCarriers(item.transportVehicle?._id)}</td>
                          </tr>
                          <tr>
                            <td>
                              <a
                                className='edit text-green'
                                style={{ width: '5px', cursor: 'pointer' }}
                                title={'manage_example.detail_info_example'}
                                onClick={() => handleShowDetailRoute(item.transportVehicle?._id)}
                              >
                                <strong>{'Chi tiết nhiệm vụ '}</strong>
                                <i className='material-icons'>assignment</i>
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <a
                                className='edit text-green'
                                style={{ width: '5px', cursor: 'pointer' }}
                                title={'Bản đồ chi tiết'}
                                onClick={() => handleShowDetailMap(item)}
                              >
                                <strong>{'Bản đồ '}</strong>
                                <i className='material-icons'>location_on</i>
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12 container-time-line'>
                      <table className='transport-process-detail-vehicle'>
                        <tbody>
                          <tr>
                            <td>
                              <strong>Tiến độ vận chuyển:</strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <TransportManageVehicleProcess route={item} timelineBarWidth={getBarWidth(item)} />
                    </div>
                  </div>
                </div>
              )
              // </fieldset>
          )}

        {/* <iframe src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyCkVQAqCoJU79mTctNsNmQLy9ME7qiTlfs&q=21.0058354500001,105.842277338"} 
                    width="600" 
                    height="450" 
                    frameborder="0" 
                    style={{border:0}} 
                    allowfullscreen=""
                    loading="lazy" 
                    aria-hidden="false" 
                    tabindex="0"></iframe>    */}
        {/* <fieldset className="scheduler-border" style={{ height: "100%" }}> */}

        {/* <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6"> */}
        {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="form-group">
                        <strong>{"Trọng tải: "+item.transportVehicle.payload}</strong>
                        </div>
                        </div>                                    
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="form-group">
                        <strong>{"Thể tích thùng chứa: "+item.transportVehicle.volume}</strong>
                        </div>
                        </div>
                        </div> */}

        {/* </fieldset> */}
      </div>
    </DialogModal>
  )
}

function mapState(state) {
  const { transportSchedule } = state
  const { socket } = state
  return { transportSchedule, socket }
}

const actions = {
  getTransportScheduleByPlanId: transportScheduleActions.getTransportScheduleByPlanId,
  driverSendMessage: transportScheduleActions.driverSendMessage,
  startLocate: transportProcessActions.startLocate,
  sendCurrentLocate: transportProcessActions.sendCurrentLocate,
  stopLocate: transportProcessActions.stopLocate
}

const connectedTransportManageProcess = connect(mapState, actions)(withTranslate(TransportManageProcess))
export { connectedTransportManageProcess as TransportManageProcess }
