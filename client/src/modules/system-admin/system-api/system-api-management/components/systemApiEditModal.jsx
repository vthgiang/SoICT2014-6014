import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, SelectBox } from '../../../../../common-components'

import { SystemApiActions } from '../redux/actions'

function SystemApiEditModal(props) {
  const { translate } = props

  const [state, setState] = useState({
    id: null,
    path: null,
    method: 'GET',
    description: null
  })

  const { id, path, method, description } = state

  if (props._id !== id) {
    setState({
      ...state,
      id: props._id,
      path: props.systemApi?.path,
      method: props.systemApi?.method,
      description: props.systemApi?.description
    })
  }

  const handleChangePath = (e) => {
    setState({
      ...state,
      path: e.target.value
    })
  }

  const handleChangeMethod = (value) => {
    setState({
      ...state,
      method: value[0]
    })
  }

  const handleChangeDescription = (e) => {
    setState({
      ...state,
      description: e.target.value
    })
  }

  const handleSubmit = () => {
    props.editSystemApi(id, {
      path: path,
      method: method,
      description: description
    })
    window.$('#edit-system-api-modal').modal('hide')
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID='edit-system-api-modal'
        isLoading={false}
        formID='form-create-system-api'
        title={translate('system_admin.system_api.modal.edit_title')}
        msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
        msg_failure={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
        func={handleSubmit}
      >
        {/* Form them API */}
        <form
          id='form-create-system-api'
          onSubmit={() => handleSubmit(translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success'))}
        >
          {/* Path */}
          <div className='form-group'>
            <label>{translate('system_admin.system_api.table.path')}</label>
            <input
              className='form-control'
              type='text'
              placeholder={translate('system_admin.system_api.placeholder.input_path')}
              value={path}
              onChange={(e) => handleChangePath(e)}
            />
          </div>

          {/* Method */}
          <div className='form-group'>
            <label>{translate('system_admin.system_api.table.method')}</label>
            <SelectBox
              id={`method-edit-system-api`}
              className='form-control select2'
              style={{ width: '100%' }}
              items={[
                {
                  text: 'GET',
                  value: 'GET'
                },
                {
                  text: 'PUT',
                  value: 'PUT'
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
              onChange={handleChangeMethod}
              value={method}
              multiple={false}
            />
          </div>

          {/* Description */}
          <div className='form-group'>
            <label>{translate('system_admin.system_api.table.description')}</label>
            <input
              className='form-control'
              type='text'
              value={description}
              placeholder={translate('system_admin.system_api.placeholder.input_description')}
              onChange={(e) => handleChangeDescription(e)}
            />
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const {} = state
  return {}
}

const actionCreators = {
  editSystemApi: SystemApiActions.editSystemApi
}

const connectedSystemApiEditModal = connect(mapState, actionCreators)(withTranslate(SystemApiEditModal))
export { connectedSystemApiEditModal as SystemApiEditModal }
