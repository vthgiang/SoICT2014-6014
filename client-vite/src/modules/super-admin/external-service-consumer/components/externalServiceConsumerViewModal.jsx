import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../common-components'
import { ExternalServiceConsumerActions } from '../redux/actions'

function ExternalServiceConsumersViewModal(props) {
  const { translate, externalServiceConsumer } = props

  const [state, setState] = useState({
    name: null,
    description: null,
    attributes: null
  })

  useEffect(() => {
    async function init() {
      setState({
        name: externalServiceConsumer?.name,
        description: externalServiceConsumer?.description,
        attributes: JSON.stringify(externalServiceConsumer?.attributes, null, 2)
      })
    }
    init()
  }, [externalServiceConsumer])

  const { name, description, attributes } = state

  return (
    <DialogModal
      modalID='view-external-service-consumer-modal'
      isLoading={false}
      formID='form-view-external-service-consumer'
      title={translate('system_admin.external_service_consumer.modal.view_title')}
    >
      {/* Form them API */}
      <form id='form-view-external-service-consumer'>
        {/* Name */}
        <div className='form-group'>
          <label>{translate('system_admin.external_service_consumer.table.name')}</label>
          <input readOnly className='form-control' type='text' placeholder='Name' name='name' value={name} />
        </div>

        {/* Description */}
        <div className='form-group'>
          <label>{translate('system_admin.external_service_consumer.table.description')}</label>
          <input readOnly className='form-control' type='text' name='name' placeholder='Description' value={description} />
        </div>

        {/* Attributes */}
        <div className='form-group'>
          <label>{translate('system_admin.external_service_consumer.table.attributes')}</label>
          <pre>{attributes}</pre>
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
  editExternalServiceConsumers: ExternalServiceConsumerActions.editExternalServiceConsumers
}

export default connect(mapState, actionCreators)(withTranslate(ExternalServiceConsumersViewModal))
