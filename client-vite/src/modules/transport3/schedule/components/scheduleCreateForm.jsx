import React, {useEffect, useState} from 'react'
import {withTranslate} from 'react-redux-multilingual'
import {DialogModal, ErrorLabel} from '@common-components'
import ScheduleCreateInfo from './scheduleCreateInfo'
import SchedulePickLocation from './map/schedulePickLocation.jsx'
import './order.css'
import {useDispatch, useSelector} from 'react-redux';
import {ScheduleActions} from '@modules/transport3/schedule/redux/actions.js';

function ScheduleCreateForm(props) {
  let initialState = {
    code: '',
    vehicles: [],
    orders: [],
    schedule: {},
    nearestDepot: null,
    note: '',
    step: 0
  }
  const [state, setState] = useState(initialState)

  useEffect(() => {
    setState({
      ...state,
      code: props.code,
    })
  }, [props.code])

  const dispatch = useDispatch()
  const save = async () => {
    let {code, orders, vehicles, note, schedule, nearestDepot} = state
    let data = {
      code,
      orders,
      vehicles,
      note,
      schedules: schedule,
      depot: nearestDepot,
      isAutoSchedule: false
    }
    await dispatch(ScheduleActions.createSchedule(data))
    await dispatch(ScheduleActions.getAllSchedule())
    await dispatch(ScheduleActions.getDraftSchedule())
  }

  let listStocsWithLatLng = useSelector(state => state.T3schedule.listStocsWithLatLng);

  const customSave = async () => {
    let {code, orders, vehicles, note, schedule, nearestDepot} = state
    let data = {
      code,
      orders,
      vehicles,
      note,
      schedules: schedule,
      depots: listStocsWithLatLng,
      isAutoSchedule: true
    }
    await dispatch(ScheduleActions.createSchedule(data))
    await dispatch(ScheduleActions.getAllSchedule())
    await dispatch(ScheduleActions.getDraftSchedule())
  }

  let {
    code, step, orders, vehicles
  } = state
  const setCurrentStep = (e, step) => {
    e.preventDefault()
    setState({
      ...state,
      step: step
    })
  }

  const handleOrderChange = (value) => {
    setState({
      ...state,
      orders: value
    })
  }

  const handleVehicleChange = (value) => {
    setState({
      ...state,
      vehicles: value
    })
  }

  const handleNoteChange = (e) => {
    let {value} = e.target
    setState({
      ...state,
      note: value
    })
  }

  const handleScheduleChange = (value) => {
    setState({
      ...state,
      schedule: value
    })
  }

  const handleNearestDepotsChange = (value) => {
    setState({
      ...state,
      nearestDepot: value
    })
  }

  // const handleAuToSchedule = () => {
  //   dispatch(ScheduleActions.autoSchedule())
  // }
  //
  // let isAutoScheduling = useSelector(state => state.T3schedule.isAutoScheduling);
  // let listAutoSchedule = useSelector(state => state.T3schedule.listAutoSchedules);

  return (
    <>
      <DialogModal
        modalID={`modal-add-schedule`}
        isLoading={false}
        formID={`form-add-schedule`}
        title={'Lập lịch vận chuyển'}
        msg_success={'Lập lịch vận chuyển thành công'}
        msg_failure={'Lập lịch vận chuyển không thành công'}
        size="80"
        style={{backgroundColor: 'green'}}
        hasSaveButton={true}
        func={save}
        customButton={'Lưu và tự động lập lịch'}
        customFunc={customSave}
      >
        <div className="nav-tabs-custom">
          <ul className="breadcrumbs">
            <li key="1">
              <a
                className={`${step >= 0 ? 'quote-active-tab' : 'quote-defaul-tab'}`}
                onClick={(e) => setCurrentStep(e, 0)}
                style={{cursor: 'pointer'}}
              >
                <span>Lựa chọn đơn hàng & phương tiện</span>
              </a>
            </li>
            <li key="2">
              <a
                className={`${step >= 1 ? 'quote-active-tab' : 'quote-defaul-tab'}`}
                onClick={(e) => setCurrentStep(e, 1)}
                style={{cursor: 'pointer'}}
              >
                <span>Lập lịch vận chuyển</span>
              </a>
            </li>
            {/*{step === 1 && state.orders.length > 0 && state.vehicles.length > 0 && (*/}
            {/*  <>*/}
            {/*    <li style={{marginLeft: '50%'}}>*/}
            {/*      <div className={'d-flex items-center justify-center'} style={{height: '100%'}}>*/}
            {/*        Tự động sắp xếp lịch trình tối ưu?*/}
            {/*        <a id={'autoBtn'} className={'btn btn-primary'} style={{marginLeft: 10}}*/}
            {/*           onClick={handleAuToSchedule}*/}
            {/*        >{isAutoScheduling ? 'Đang xử lý...' : listAutoSchedule ? 'Sắp xếp lại' : 'Sắp xếp'}</a>*/}
            {/*      </div>*/}
            {/*    </li>*/}
            {/*  </>*/}
            {/*)}*/}
          </ul>
        </div>
        <form id={`form-add-schedule`}>
          <div className="row row-equal-height" style={{marginTop: 0}}>
            {step === 0 && (
              <ScheduleCreateInfo
                code={code}
                orders={orders}
                vehicles={vehicles}
                note={state.note}
                handleOrderChange={handleOrderChange}
                handleVehicleChange={handleVehicleChange}
                handleNoteChange={handleNoteChange}
              />
            )}
            {step === 1 && (
              <SchedulePickLocation
                orders={orders}
                vehicles={vehicles}
                schedule={state.schedule}
                handleVehicleChange={handleVehicleChange}
                handleScheduleChange={handleScheduleChange}
                handleNearestDepotsChange={handleNearestDepotsChange}
              />
            )}
          </div>
        </form>
      </DialogModal>
    </>
  )
}

export default withTranslate(ScheduleCreateForm)
