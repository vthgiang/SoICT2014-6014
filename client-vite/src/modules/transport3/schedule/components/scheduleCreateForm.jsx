import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {withTranslate} from 'react-redux-multilingual'
import {CrmCustomerActions} from '@modules/crm/customer/redux/actions'
import {formatToTimeZoneDate} from '@helpers/formatDate'
import {DialogModal, ErrorLabel} from '@common-components'
import ValidationHelper from '@helpers/validationHelper'
import ScheduleCreateInfo from './scheduleCreateInfo'
import SchedulePickLocation from './map/schedulePickLocation.jsx'
import './order.css'
import {MapContainer} from 'react-leaflet';
import {generateCode} from '@helpers/generateCode.js';

function ScheduleCreateForm(props) {
  let initialState = {
    code: '',
    vehicles: [],
    orders: [],
    schedule: [],
    step: 0
  }
  const [state, setState] = useState(initialState)

  useEffect(() => {
    setState({
      ...state,
      code: props.code,
    })
  }, [props.code])

  const save = async () => {
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
          </ul>
        </div>
        <form id={`form-add-schedule`}>
          <div className="row row-equal-height" style={{marginTop: 0}}>
            {step === 0 && (
              <ScheduleCreateInfo
                code={code}
                orders={orders}
                vehicles={vehicles}
                handleOrderChange={handleOrderChange}
                handleVehicleChange={handleVehicleChange}
              />
            )}
            {step === 1 && (
              <SchedulePickLocation
                orders={orders}
                vehicles={vehicles}
                handleVehicleChange={handleVehicleChange}
              />
            )}
          </div>
        </form>
      </DialogModal>
    </>
  )
}

export default withTranslate(ScheduleCreateForm)
