import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../common-components'
import { InternalPolicyActions } from '../redux/actions'

function InternalPolicyViewModal(props) {
  const { translate, internalPolicy } = props

  const [state, setState] = useState({
    name: null,
    description: null,
    effect: null,
    actions: null,
    resources: null,
    effectiveStartTime: null,
    effectiveEndTime: null
  })

  const { name, description, effect, actions, resources, effectiveStartTime, effectiveEndTime } = state

  useEffect(() => {
    async function init() {
      setState({
        name: internalPolicy?.name,
        effect: internalPolicy?.effect,
        description: internalPolicy?.description,
        actions: internalPolicy?.actions,
        resources: internalPolicy?.resources,
        effectiveStartTime: internalPolicy?.effectiveStartTime,
        effectiveEndTime: internalPolicy?.effectiveEndTime
      })
    }
    init()
  }, [internalPolicy])

  return (
    <DialogModal
      modalID='view-internal-policy-modal'
      isLoading={false}
      formID='form-view-internal-policy'
      title={translate('system_admin.internal_policy.modal.view_title')}
    >
      {/* Form them API */}
      <form id='form-view-internal-policy'>
        {/* Name */}
        <div className='form-group'>
          <label>{translate('system_admin.internal_policy.table.name')}</label>
          <input readOnly className='form-control' type='text' placeholder='Name' name='name' value={name} />
        </div>

        {/* Description */}
        <div className='form-group'>
          <label>{translate('system_admin.internal_policy.table.description')}</label>
          <input readOnly className='form-control' type='text' name='name' placeholder='Description' value={description} />
        </div>

        <div className='form-group'>
          <label>{translate('system_admin.internal_policy.table.resources')}</label>
          <input readOnly className='form-control' type='text' name='name' placeholder='Resources' value={resources} />
        </div>

        <div className='form-group'>
          <label>{translate('system_admin.internal_policy.table.actions')}</label>
          <input readOnly className='form-control' type='text' name='name' placeholder='Actions' value={actions} />
        </div>

        <div className='form-group'>
          <label>{translate('system_admin.internal_policy.table.effect')}</label>
          <input readOnly className='form-control' type='text' name='name' placeholder='Effect' value={effect} />
        </div>

        <div className='form-group'>
          <label>{translate('system_admin.internal_policy.table.effectiveStartTime')}</label>
          <input readOnly className='form-control' type='text' name='name' placeholder='Effective Start Time' value={effectiveStartTime} />
        </div>

        <div className='form-group'>
          <label>{translate('system_admin.internal_policy.table.effectiveEndTime')}</label>
          <input readOnly className='form-control' type='text' name='name' placeholder='Effective End Time' value={effectiveEndTime} />
        </div>
      </form>
    </DialogModal>
  )
}

function mapState(state) {
  const {} = state
  return {}
}

const actionCreators = {
  editInternalPolicy: InternalPolicyActions.editInternalPolicy
}

export default connect(mapState, actionCreators)(withTranslate(InternalPolicyViewModal))
