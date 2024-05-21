import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../common-components'
import { ExternalServiceConsumerActions } from '../redux/actions'

function ExternalServiceConsumerCreateModal(props) {
  const { translate } = props

  const [state, setState] = useState({
    name: null,
    description: null,
    attributes: JSON.stringify(
      {
        key1: 'value1',
        key2: 'value2'
      },
      null,
      2
    )
  })

  const { name, description, attributes } = state

  const handleChangeName = (e) => {
    setState({
      ...state,
      name: e.target.value
    })
  }

  const handleChangeDescription = (e) => {
    setState({
      ...state,
      description: e.target.value
    })
  }

  const handleChangeAttributes = (value) => {
    setState({
      ...state,
      attributes: value.target.value
    })
  }

  const handleSubmit = () => {
    props.createExternalServiceConsumer({
      name,
      description,
      attributes: JSON.parse(attributes)
    })
    window.$('#create-external-service-consumer-modal').modal('hide')
  }

  return (
    <DialogModal
      modalID='create-external-service-consumer-modal'
      isLoading={false}
      formID='form-create-external-service-consumer'
      title={translate('system_admin.external_service_consumer.modal.create_title')}
      msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
      msg_failure={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
      func={handleSubmit}
    >
      {/* Form them API */}
      <form id='form-create-external-service-consumer' onSubmit={handleSubmit}>
        {/* Name */}
        <div className='form-group'>
          <label>{translate('system_admin.external_service_consumer.table.name')}</label>
          <input className='form-control' type='text' name='name' onChange={handleChangeName} />
        </div>

        {/* Description */}
        <div className='form-group'>
          <label>{translate('system_admin.external_service_consumer.table.description')}</label>
          <input className='form-control' type='text' name='name' onChange={handleChangeDescription} />
        </div>

        <div className='form-group'>
          <label>{translate('system_admin.external_service_consumer.table.attributes')}</label>
          <textarea className='form-control' rows='20' name='name' value={attributes} onChange={handleChangeAttributes} />
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
  createExternalServiceConsumer: ExternalServiceConsumerActions.createExternalServiceConsumer
}

export default connect(mapState, actionCreators)(withTranslate(ExternalServiceConsumerCreateModal))
