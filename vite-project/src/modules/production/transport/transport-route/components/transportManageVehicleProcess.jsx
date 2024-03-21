import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox } from '../../../../../common-components'

import { ResultMissionReport } from './resultMissionReport'

import { formatDate } from '../../../../../helpers/formatDate'

import { transportPlanActions } from '../../transport-plan/redux/actions'
import { transportScheduleActions } from '../../transport-schedule/redux/actions'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'

// import './timeLine.css';

function TransportManageVehicleProcess(props) {
  /**
   * route = {routeOrdinal: ....., transportVehicle: ....}
   * timelineBarWidth: chiều dài thanh timeline
   */
  const { route, timelineBarWidth } = props
  let totalDistance = 0
  let totalTime = 0

  //Vị trí các điểm trên timeline bar - sử dụng để marginLeft
  const [timelineItemPos, setTimelineItemPos] = useState([])

  const [processBarLen, setProcessBarLen] = useState(0)

  const [currentMission, setCurrentMission] = useState()
  useEffect(() => {
    if (route) {
      let barWidth = timelineBarWidth ? timelineBarWidth : 100
      // Tính tổng khoảng cách xe phải di chuyển
      if (route.routeOrdinal && route.routeOrdinal.length !== 0) {
        route.routeOrdinal.map((routeOrdinal) => {
          totalDistance += routeOrdinal.distance
        })

        // Chia tỉ lệ các điểm trên đường đi
        let timelineItem = []
        let currentTimelineItemDistance = 0
        let processLen = 0
        route.routeOrdinal.map((routeOrdinal) => {
          currentTimelineItemDistance += routeOrdinal.distance
          // timelineItem.push((currentTimelineItemDistance/totalDistance)*barWidth);
          timelineItem.push((routeOrdinal.distance / totalDistance) * 100)
          console.log(routeOrdinal)
          if (String(routeOrdinal.type) === '1') {
            if (String(routeOrdinal.transportRequirement?.transportStatus?.fromAddress?.status) === '1') {
              console.log(currentTimelineItemDistance, ' lll ', totalDistance)
              processLen = (currentTimelineItemDistance / totalDistance) * 100
            }
          } else {
            if (String(routeOrdinal.transportRequirement?.transportStatus?.toAddress?.status) === '1') {
              console.log(currentTimelineItemDistance, ' lll ', totalDistance)
              processLen = (currentTimelineItemDistance / totalDistance) * 100
            }
          }
        })
        setProcessBarLen(processLen)
        setTimelineItemPos(timelineItem)
      }
    }
    // console.log(route, " kkkkkkkkkkkkkkkkkkk")
  }, [route, timelineBarWidth])

  useEffect(() => {
    console.log(processBarLen, ' ooooooooooooooooooooooooooooooo')
  }, [processBarLen])

  // useEffect(() => {
  //     console.log(timelineItemPos);
  // }, [timelineItemPos])
  const getTimeLineItemStatus = (routeOrdinal, index) => {
    let res = ' '
    if (routeOrdinal && routeOrdinal.transportRequirement && routeOrdinal.transportRequirement.transportStatus) {
      if (String(routeOrdinal.type) === '1') {
        if (String(routeOrdinal.transportRequirement.transportStatus.fromAddress?.status) === '1') {
          res = 'active'
        } else if (String(routeOrdinal.transportRequirement.transportStatus.fromAddress?.status) === '2') {
          res = 'active2'
        } else res = ' '
      } else {
        if (String(routeOrdinal.transportRequirement.transportStatus.toAddress?.status) === '1') {
          res = 'active'
        } else if (String(routeOrdinal.transportRequirement.transportStatus.toAddress?.status) === '2') {
          res = 'active2'
        } else res = ' '
      }
    }
    return res
  }

  const getTimeTransport = (routeOrdinal, index) => {
    let res = ' '
    if (routeOrdinal && routeOrdinal.transportRequirement && routeOrdinal.transportRequirement.transportStatus) {
      if (String(routeOrdinal.type) === '1') {
        if (routeOrdinal.transportRequirement.transportStatus.fromAddress?.time) {
          try {
            let t = new Date(routeOrdinal.transportRequirement.transportStatus.fromAddress.time)
            res = t.getHours() + ':' + t.getMinutes() + 'p'
          } catch (error) {
            res = routeOrdinal.transportRequirement.transportStatus.fromAddress.time
          }
        }
      } else {
        if (routeOrdinal.transportRequirement.transportStatus.toAddress?.time) {
          try {
            let t = new Date(routeOrdinal.transportRequirement.transportStatus.toAddress.time)
            res = t.getHours() + ':' + t.getMinutes() + 'p'
          } catch (error) {
            res = routeOrdinal.transportRequirement.transportStatus.toAddress.time
          }
        }
      }
    }
    return res
  }

  const getActionType = (routeOrdinal, index) => {
    let res = ' '
    if (String(routeOrdinal.type) === '1') {
      res = 'Nhận hàng'
    } else {
      res = 'Giao hàng'
    }
    return res
  }

  const showResultMission = (routeOrdinal) => {
    setCurrentMission(routeOrdinal)
    console.log(routeOrdinal, ' ll')
    window.$(`#modal-result-misson-map`).modal('show')
  }

  return (
    <div className='timeline-transport' style={{ width: timelineBarWidth + '%' }}>
      <div className='timeline-progress' style={{ width: processBarLen + '%' }}></div>
      <div className='timeline-items-transport'>
        {route &&
          route.routeOrdinal &&
          route.routeOrdinal.length !== 0 &&
          route.routeOrdinal.map((routeOrdinal, index) => (
            <div
              key={'--' + index}
              // className={`timeline-item ${o.active ? 'active' : ''}`}
              className={`timeline-item-transport ` + getTimeLineItemStatus(routeOrdinal, index)}
              style={{ marginLeft: `calc( ${timelineItemPos[index]}% - ${index === 0 ? '10' : '20'}px)` }}
            >
              {getTimeLineItemStatus(routeOrdinal, index) !== ' ' && (
                <div className='timeline-contain-transport active' onClick={() => showResultMission(routeOrdinal)}>
                  {getTimeTransport(routeOrdinal, index)}
                </div>
              )}
              {getTimeLineItemStatus(routeOrdinal, index) === ' ' && (
                <div className='timeline-contain-transport'>{getActionType(routeOrdinal, index)}</div>
              )}
            </div>
          ))}
        {/* <div key={"1"} className={`timeline-item active`} >
                    <div className="timeline-contain">{"123131323"}</div>
                </div>
                <div key={"2"} className={`timeline-item`} >
                    <div className="timeline-contain" 
                    // onClick={(e) => this.setCurrentStep(e, index)}
                    >{"123131323"}</div>
                    
                </div> */}
      </div>
      <ResultMissionReport routeOrdinal={currentMission} />
    </div>
  )
}

function mapState(state) {
  const allTransportPlans = state.transportPlan.lists
  const { currentTransportSchedule } = state.transportSchedule
  const { socket } = state
  return { allTransportPlans, currentTransportSchedule, socket }
}

const actions = {
  getAllTransportPlans: transportPlanActions.getAllTransportPlans,
  getTransportScheduleByPlanId: transportScheduleActions.getTransportScheduleByPlanId
}

const connectedTransportManageVehicleProcess = connect(mapState, actions)(withTranslate(TransportManageVehicleProcess))
export { connectedTransportManageVehicleProcess as TransportManageVehicleProcess }
