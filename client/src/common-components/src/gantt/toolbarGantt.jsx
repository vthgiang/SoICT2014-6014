import React from 'react'
import { withTranslate } from 'react-redux-multilingual'

function ToolbarGantt(props) {
  const { translate } = props
  const { onZoomChange, zoom } = props

  const handleZoomChange = (e) => {
    if (onZoomChange) {
      onZoomChange(e.target.value)
    }
  }

  const zoomRadios = [
    translate('system_admin.system_setting.backup.hour'),
    translate('system_admin.system_setting.backup.date'),
    translate('system_admin.system_setting.backup.week'),
    translate('system_admin.system_setting.backup.month')
  ].map((value) => {
    let isActive = zoom === value
    return (
      <label key={value} className={`radio-label ${isActive ? 'radio-label-active' : ''}`}>
        <input type='radio' checked={isActive} onChange={handleZoomChange} value={value} />
        {value}
      </label>
    )
  })

  return (
    <div className='zoom-bar'>
      <div className='tool-bar'>{zoomRadios}</div>
    </div>
  )
}

export default withTranslate(ToolbarGantt)
