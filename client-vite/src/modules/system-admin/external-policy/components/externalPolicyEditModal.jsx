import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, SelectBox } from '../../../../common-components'
import { ExternalPolicyActions } from '../redux/actions'
import { SystemApiActions } from '../../system-api/system-api-management/redux/actions'

function ExternalPolicyEditModal(props) {
  const { translate, externalPolicy, systemApis } = props

  const [state, setState] = useState({
    name: '',
    description: '',
    effect: 'Allow',
    actions: [],
    resources: [],
    enabled: true,
    condition: ''
  })

  const { id, name, description, effect, actions, resources, enabled, condition } = state
  const listPaginateApi = systemApis?.listPaginateApi.map((api) => api.path).filter((path, index, array) => array.indexOf(path) == index)

  useEffect(() => {
    props.getSystemApis({
      page: 1,
      perPage: 10000
    })
  }, [])

  useEffect(() => {
    async function init() {
      setState({
        id: externalPolicy?.id,
        name: externalPolicy?.name,
        effect: externalPolicy?.effect,
        description: externalPolicy?.description,
        actions: externalPolicy?.actions,
        resources: externalPolicy?.resources,
        enabled: externalPolicy?.enabled,
        condition: JSON.stringify(externalPolicy?.condition, null, 2)
      })
    }
    init()
  }, [externalPolicy])

  const handleChangeDescription = (e) => {
    setState({
      ...state,
      description: e.target.value
    })
  }

  const handleChangeEffect = (value) => {
    setState({
      ...state,
      effect: value[0]
    })
  }

  const handleChangeActions = (value) => {
    setState({
      ...state,
      actions: value[0]
    })
  }

  const handleChangeResources = (value) => {
    setState({
      ...state,
      resources: value
    })
  }

  const handleToggleEnabled = (value) => {
    setState({
      ...state,
      enabled: value.target.checked
    })
  }

  const handleChangeCondition = (value) => {
    setState({
      ...state,
      condition: value.target.value
    })
  }

  const handleSubmit = () => {
    props.editExternalPolicy(id, {
      name,
      description,
      effect,
      actions,
      resources,
      enabled,
      condition: JSON.parse(condition)
    })
    window.$('#update-external-policy-modal').modal('hide')
  }

  return (
    <DialogModal
      modalID='update-external-policy-modal'
      isLoading={false}
      formID='form-update-external-policy'
      title={translate('system_admin.external_policy.modal.update_title')}
      msg_success='Cập nhật thành công'
      msg_failure='Cập nhật thất bại'
      func={handleSubmit}
    >
      {/* Form them API */}
      <form id='form-update-external-policy' onSubmit={handleSubmit}>
        <div className='form-group'>
          <input
            id='update-external-policy-enabled'
            className='form-control'
            type='checkbox'
            name='name'
            placeholder='Enabled'
            defaultChecked={externalPolicy?.enabled ?? enabled}
            onChange={handleToggleEnabled}
          />
          <label htmlFor='update-external-policy-enabled'>{translate('system_admin.external_policy.table.enabled')}</label>
        </div>

        {/* Name */}
        <div className='form-group'>
          <label>{translate('system_admin.external_policy.table.name')}</label>
          <input readOnly className='form-control' type='text' placeholder='Name' name='name' value={name} />
        </div>

        {/* Description */}
        <div className='form-group'>
          <label>{translate('system_admin.external_policy.table.description')}</label>
          <input
            className='form-control'
            type='text'
            name='name'
            placeholder='Description'
            value={description}
            onChange={handleChangeDescription}
          />
        </div>

        <div className='form-group'>
          <label>{translate('system_admin.external_policy.table.resources')}</label>
          <SelectBox
            id='resources-update-external-policy'
            className='form-control select2'
            style={{ width: '100%' }}
            value={resources}
            items={listPaginateApi.map((api) => {
              return { value: api, text: api }
            })}
            onChange={handleChangeResources}
            multiple
          />
        </div>

        <div className='form-group'>
          <label>{translate('system_admin.external_policy.table.actions')}</label>
          <SelectBox
            id='method-update-external-policy'
            className='form-control select2'
            style={{ width: '100%' }}
            value={actions}
            items={[
              {
                text: 'GET',
                value: 'GET'
              },
              {
                text: 'PATCH',
                value: 'PATCH'
              },
              {
                text: 'POST',
                value: 'POST'
              },
              {
                text: 'DELETE',
                value: 'DELETE'
              }
            ]}
            onChange={handleChangeActions}
            multiple
          />
        </div>

        <div className='form-group'>
          <label>{translate('system_admin.external_policy.table.effect')}</label>
          <SelectBox
            id='effect-update'
            className='form-control select2'
            style={{ width: '100%' }}
            value={effect}
            items={[
              { value: 'Allow', text: `Allow` },
              { value: 'Deny', text: `Deny` }
            ]}
            onChange={handleChangeEffect}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='condition'>{translate('system_admin.external_policy.table.condition')}</label>
          <textarea className='form-control' rows='20' name='name' value={condition} onChange={handleChangeCondition} />
        </div>
      </form>
    </DialogModal>
  )
}

function mapState(state) {
  const { systemApis } = state
  return { systemApis }
}

const actionCreators = {
  getSystemApis: SystemApiActions.getSystemApis,
  editExternalPolicy: ExternalPolicyActions.editExternalPolicy
}

export default connect(mapState, actionCreators)(withTranslate(ExternalPolicyEditModal))
