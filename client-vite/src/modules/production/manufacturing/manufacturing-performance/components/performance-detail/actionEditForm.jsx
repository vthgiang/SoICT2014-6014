import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { DialogModal, SelectBox, DatePicker } from '../../../../../../common-components'
import { formatDate } from '../../../../../../helpers/formatDate'

const ActionEditForm = (props) => {
  const { translate, onKpiChange, manufacturingMetric } = props
  const currentActionIndex = localStorage.getItem('currentActionIndex')
  const [action, setAction] = useState({})

  const getStatusArr = () => {
    return [
      { value: 0, text: translate('manufacturing.performance.un_fulfilled') },
      { value: 1, text: translate('manufacturing.performance.in_progress') },
      { value: 2, text: translate('manufacturing.performance.completed') }
    ]
  }

  const handleStatusChange = (index, value) => {
    const newAction = { ...action }
    newAction.milestones[index].status = value[0]
    setAction(newAction)
  }

  const handleProgressChange = (e) => {
    setAction({
      ...action,
      progress: e.target.value
    })
  }

  const isFormValidated = () => {
    return action?.progress !== ''
  }

  const save = () => {
    const newActions = manufacturingMetric.currentKpi.actions
    newActions[currentActionIndex] = action

    onKpiChange({ actions: newActions })
  }

  useEffect(() => {
    setAction(manufacturingMetric.currentKpi?.actions[currentActionIndex])
  }, [manufacturingMetric.isLoading])

  return (
    <DialogModal
      modalID='modal-edit-action'
      isLoading={false}
      formID='form-edit-action'
      title={translate('manufacturing.performance.edit_action')}
      msg_success={translate('manufacturing.performance.edit_action_success')}
      msg_failure={translate('manufacturing.performance.edit_action_failure')}
      func={save}
      disableSubmit={!isFormValidated()}
      size={50}
      maxWidth={800}
    >
      <form id='form-edit-action'>
        <div className='form-group'>
          <label>{translate('manufacturing.performance.progress')}</label>
          <input type='text' className='form-control' name='name' value={action?.progress} onChange={handleProgressChange} />
        </div>
        <div className='form-group'>
          <label className='form-control-static'>{translate('manufacturing.performance.milestone')}</label>
          <table className='table table-hover table-striped table-bordered'>
            <thead>
              <tr>
                <th>{translate('manufacturing.performance.name')}</th>
                <th>{translate('manufacturing.performance.time')}</th>
                <th>{translate('manufacturing.performance.status')}</th>
              </tr>
            </thead>
            <tbody>
              {action?.milestones?.map((milf, index) => (
                <tr key={index}>
                  <td style={{ width: '50%' }}>{milf.name}</td>
                  <td style={{ width: '20%' }}>{formatDate(milf.time)}</td>
                  <td style={{ width: '30%' }}>
                    <SelectBox
                      id={`milestone_status-${index}`}
                      className='form-control select2'
                      style={{ width: '100%' }}
                      value={milf.status}
                      items={getStatusArr()}
                      onChange={(value) => handleStatusChange(index, value)}
                      multiple={false}
                      disabled={false}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </DialogModal>
  )
}

function mapStateToProps(state) {
  const { manufacturingMetric } = state
  return { manufacturingMetric }
}

export default connect(mapStateToProps, null)(withTranslate(ActionEditForm))
