import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslate } from 'react-redux-multilingual'
import ConfigParametersForm from './configParametersForm'
import { ConfigParametersAction } from './redux/actions'

function ConfigParameters({ handleStartAllocation }) {
  const translate = useTranslate()
  const configData = useSelector((state) => state.configParametersReducer)
  const { numberGeneration, solutionSize, isAutomatically, defaultSetting, _id } = configData
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
            <ConfigParametersForm />
          </div>
          <div className='box-footer text-center flex justify-center gap-[16px]'>
            {/* {isAutomatic === 'off' && (
              <>
                <button type='button' className='btn btn-success' onClick={handleUpdateData}>
                  Cập nhật
                </button>
                <button type='button' className='btn btn-success' onClick={handleResetData}>
                  Reset thay đổi
                </button>
              </>
            )} */}
            {/* <button type='button' className='btn btn-success' onClick={handleUpdateData}>
              Cập nhật
            </button>
            <button type='button' className='btn btn-success' onClick={handleResetData}>
              Reset thay đổi
            </button> */}
            <button type='button' className='btn btn-success' onClick={(e) => handleStartAllocation(e)}>
              Bắt đầu phân bổ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfigParameters
