import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { SelectBox } from '../../../../common-components'

import { ConfigurationActions } from '../redux/actions'

function HumanResourceConfiguration(props) {
  const [state, setState] = useState({})

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

  useMemo(() => {
    if (state.dataStatus === 1 && props.modelConfiguration.humanResourceConfig) {
      // Dữ liệu đã về
      setState((state) => {
        return {
          ...state,
          dataStatus: 2,
          humanResourceConfig: props.modelConfiguration.humanResourceConfig
        }
      })
      props.setDataReq(props.modelConfiguration.humanResourceConfig)
      return false
    }

    if (state.dataStatus === 2) {
      setState((state) => {
        return {
          ...state,
          dataStatus: 3
        }
      })
      return true
    }

    return true
  }, [props.modelConfiguration.humanResourceConfig])

  const handleContractNoticeTimeChange = (e) => {
    const { value } = e.target
    let { humanResourceConfig } = state
    props.modelConfiguration.humanResourceConfig.contractNoticeTime = value
    setState({
      ...state,
      humanResourceConfig: props.modelConfiguration.humanResourceConfig
    })
    props.setDataReq(props.modelConfiguration.humanResourceConfig)
  }

  /**
   * Function thay đổi kiểu chấm công
   * @param {*} value
   */
  const handleTimekeepingTypeChange = (value) => {
    //let { humanResourceConfig } = state;
    //humanResourceConfig.timekeepingType = value[0];
    props.modelConfiguration.humanResourceConfig.timekeepingType = value[0]
    console.log(props.modelConfiguration.humanResourceConfig.timekeepingType)
    setState({
      ...state,
      humanResourceConfig: props.modelConfiguration.humanResourceConfig
    })
    props.setDataReq(props.modelConfiguration.humanResourceConfig)
  }

  /** Function thay đổi giờ của các ca làm việc */
  const handleShiftTimeChange = (e) => {
    const { name, value } = e.target
    let { humanResourceConfig } = state
    props.modelConfiguration.humanResourceConfig.timekeepingByShift[name] = value
    setState({
      ...state,
      humanResourceConfig: props.modelConfiguration.humanResourceConfig
    })
    props.setDataReq(props.modelConfiguration.humanResourceConfig)
  }

  // const save = () => {
  //     const { humanResourceConfig } = state;
  //     console.log(humanResourceConfig);
  //     props.editConfiguration({ humanResource: humanResourceConfig });
  // }

  const { translate } = props

  const { id, humanResourceConfig, showContract, showTimekeep } = state
  let contractNoticeTime = '',
    timekeepingType = '',
    timekeepingByShift = '',
    timekeepingByShiftAndHour = ''
  if (humanResourceConfig) {
    contractNoticeTime = humanResourceConfig.contractNoticeTime
    timekeepingType = humanResourceConfig.timekeepingType
    timekeepingByShift = humanResourceConfig.timekeepingByShift
    timekeepingByShiftAndHour = humanResourceConfig.timekeepingByShiftAndHour
  }

  return (
    <div id={id} className='tab-pane active'>
      <div className='row'>
        <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
          <fieldset className='scheduler-border'>
            <legend className='scheduler-border' style={{ marginBottom: 0 }}>
              <h4 className='box-title'>{translate('module_configuration.timekeeping')}</h4>
            </legend>
            {/* Kiểu chấm công*/}
            <div className='form-group'>
              <label>{translate('module_configuration.timekeeping_type')}</label>
              <SelectBox
                id={`timekeeping-type`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={timekeepingType}
                items={[
                  { value: 'shift', text: translate('module_configuration.shift') },
                  { value: 'hours', text: translate('module_configuration.hours') }
                ]}
                // items={[{ value: 'shift', text: translate('module_configuration.shift') }, { value: 'hours', text: translate('module_configuration.hours') }, { value: 'shift_and_hour', text: translate('module_configuration.shift_and_hour') }]}
                onChange={handleTimekeepingTypeChange}
              />
            </div>
            {timekeepingType === 'shift' && (
              <div>
                <div id='work_plan' className='description-box qlcv'>
                  <h4>{translate('module_configuration.shift')}</h4>
                  {/* Số giờ ca 1 */}
                  <div className='form-inline'>
                    <div className='form-group'>
                      <label>{translate('module_configuration.shift1_time')}</label>
                      <input
                        type='number'
                        min='0'
                        value={timekeepingByShift.shift1Time}
                        className='form-control'
                        name='shift1Time'
                        onChange={handleShiftTimeChange}
                      />
                    </div>
                  </div>

                  {/* Số giờ ca 2 */}
                  <div className='form-inline'>
                    <div className='form-group'>
                      <label>{translate('module_configuration.shift2_time')}</label>
                      <input
                        type='number'
                        min='0'
                        value={timekeepingByShift.shift2Time}
                        className='form-control'
                        name='shift2Time'
                        onChange={handleShiftTimeChange}
                      />
                    </div>
                  </div>

                  {/* Số giờ ca 3 */}
                  <div className='form-inline'>
                    <div className='form-group'>
                      <label>{translate('module_configuration.shift3_time')}</label>
                      <input
                        type='number'
                        min='0'
                        value={timekeepingByShift.shift3Time}
                        className='form-control'
                        name='shift3Time'
                        onChange={handleShiftTimeChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </fieldset>
        </div>
        <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
          <fieldset className='scheduler-border'>
            <legend className='scheduler-border' style={{ marginBottom: 0 }}>
              <h4 className='box-title'>{translate('human_resource.profile.labor_contract')}</h4>
            </legend>
            {/* Báo hết hạn hợp đồng (ngày) */}
            <div className='form-group'>
              <label>{translate('module_configuration.contract_notice_time')}</label>
              <input
                type='number'
                min='0'
                step='1'
                value={contractNoticeTime}
                className='form-control'
                name='contractNoticeTimes'
                onChange={handleContractNoticeTimeChange}
                placeholder={translate('module_configuration.contract_notice_time_title')}
              />
            </div>
          </fieldset>
        </div>
      </div>
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

const humanResource = connect(mapState, actionCreators)(withTranslate(HumanResourceConfiguration))
export { humanResource as HumanResourceConfiguration }
