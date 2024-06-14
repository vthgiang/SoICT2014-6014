import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslate } from 'react-redux-multilingual'
import { SelectBox } from '../../../../../../common-components'
import ConfigParametersForm from './configParametersForm'
import { ConfigParametersAction } from './redux/actions'

function ConfigParameters({ handleStartAllocation }) {
  const translate = useTranslate()
  const configData = useSelector((state) => state.configParametersReducer)
  const { numberGeneration, solutionSize, hmcr, par, bandwidth, alpha, beta, gamma, isAutomatically, defaultSetting, _id } = configData
  const [isAutomatic, setIsAutomatic] = useState(isAutomatically ? 'on' : 'off')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(ConfigParametersAction.getConfigSettingData())
  }, [dispatch])

  useEffect(() => {
    setIsAutomatic(isAutomatically ? 'on' : 'off')
  }, [isAutomatically])

  const handleChangeIsAutomaticState = (value) => {
    setIsAutomatic(value[0])
    dispatch(ConfigParametersAction.updateConfigSetting('isAutomatically', value[0] === 'on'))
  }

  const handleUpdateData = () => {
    dispatch(ConfigParametersAction.updateConfigSetting('isAutomatically', isAutomatic === 'on'))
    dispatch(
      ConfigParametersAction.updateConfigSettingData(_id, {
        numberGeneration,
        solutionSize,
        hmcr,
        par,
        bandwidth,
        alpha,
        beta,
        gamma,
        isAutomatically,
        isReset: false
      })
    )
  }

  const handleResetData = () => {
    Object.entries(defaultSetting).forEach(([key, value]) => {
      dispatch(ConfigParametersAction.updateConfigSetting(key, value))
    })
    dispatch(ConfigParametersAction.updateConfigSettingData(_id, { ...defaultSetting, isReset: true }))
  }

  return (
    <div className='row'>
      <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
        <div className='box box-default'>
          <div className='box-header with-border text-center'>
            <b style={{ fontSize: '24px' }}>{translate('kpi.kpi_allocation.config_management.config_component')}</b>
          </div>
          <div className='box-body'>
            <div className='flex flex-col'>
              <label className='ml-[15px]'>{translate('kpi.kpi_allocation.config_management.automatic')}</label>
              <div className='flex items-center mb-[16px]'>
                <div className='col-xs-12 col-sm-12 col-md-12 col-12'>
                  <SelectBox
                    id='select-backup-status'
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={[
                      { value: 'on', text: translate('kpi.kpi_allocation.config_management.automatic_on') },
                      { value: 'off', text: translate('kpi.kpi_allocation.config_management.automatic_off') }
                    ]}
                    value={isAutomatic}
                    onChange={handleChangeIsAutomaticState}
                    multiple={false}
                  />
                </div>
              </div>
            </div>

            {isAutomatic === 'off' && <ConfigParametersForm />}
          </div>
          <div className='box-footer text-center flex justify-center gap-[16px]'>
            {isAutomatic === 'off' && (
              <>
                <button type='button' className='btn btn-success' onClick={handleUpdateData}>
                  Cập nhật
                </button>
                <button type='button' className='btn btn-success' onClick={handleResetData}>
                  Reset thay đổi
                </button>
              </>
            )}
            <button type='button' className='btn btn-success' onClick={() => handleStartAllocation()}>
              Bắt đầu phân bổ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfigParameters
