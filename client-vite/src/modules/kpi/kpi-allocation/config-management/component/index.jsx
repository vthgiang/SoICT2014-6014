import React, { useEffect, useState } from 'react'
import { useTranslate } from 'react-redux-multilingual/lib/context'
import { useDispatch, useSelector } from 'react-redux'
import { SelectBox } from '../../../../../common-components'
import ConfigManagementForm from './form'
import { ConfigManagementAction } from '../redux/actions'

function ConfigManagement() {
  const translate = useTranslate()
  const configData = useSelector((state) => state.kpiAllocation.configManagementReducer)
  const { numberGeneration, solutionSize, isAutomatically, defaultSetting, _id } = configData
  const [isAutomatic, setIsAutomatic] = useState(isAutomatically ? 'on' : 'off')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(ConfigManagementAction.getConfigSettingData())
  }, [dispatch])

  useEffect(() => {
    setIsAutomatic(isAutomatically ? 'on' : 'off')
  }, [isAutomatically])

  const handleChangeIsAutomaticState = (value) => {
    setIsAutomatic(value[0])
    dispatch(ConfigManagementAction.updateConfigSetting('isAutomatically', value[0] === 'on'))
  }

  const handleUpdateData = () => {
    dispatch(ConfigManagementAction.updateConfigSetting('isAutomatically', isAutomatic === 'on'))
    dispatch(
      ConfigManagementAction.updateConfigSettingData(_id, {
        numberGeneration,
        solutionSize,
        isAutomatically,
        isReset: false
      })
    )
  }

  const handleResetData = () => {
    Object.entries(defaultSetting).forEach(([key, value]) => {
      dispatch(ConfigManagementAction.updateConfigSetting(key, value))
    })

    dispatch(ConfigManagementAction.updateConfigSettingData(_id, { ...defaultSetting, isReset: true }))
  }

  return (
    <div className='row'>
      <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
        <div className='box box-default'>
          <div className='box-header with-border text-center'>
            <b style={{ fontSize: '24px' }}>{translate('kpi.kpi_allocation.config_management.config_component')}</b>
          </div>
          <div className='box-body'>
            <div className='flex items-center justify-center'>
              <div className='col-xs-12 col-sm-10 col-md-10 col-lg-10'>
                <div className='form-group'>
                  <label>{translate('kpi.kpi_allocation.config_management.automatic')}</label>
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

              <div className='col-xs-12 col-sm-1 col-md-1 col-lg-1 text-center'>
                <button type='button' className='btn btn-success' onClick={handleResetData}>
                  Reset thay đổi
                </button>
              </div>
            </div>

            {isAutomatic === 'off' && <ConfigManagementForm />}
          </div>
          {isAutomatic === 'off' && (
            <div className='box-footer text-center'>
              <button type='button' className='btn btn-success' onClick={handleUpdateData}>
                Cập nhật
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConfigManagement
