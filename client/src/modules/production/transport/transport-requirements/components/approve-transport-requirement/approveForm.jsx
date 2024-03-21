import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { ButtonModal, DialogModal, ErrorLabel, SelectBox } from '../../../../../../common-components'
import { withTranslate } from 'react-redux-multilingual'
import ValidationHelper from '../../../../../../helpers/validationHelper'

import { transportRequirementsActions } from '../../redux/actions'

function ApproveForm(props) {
  const { currentTransportRequirementDetail } = props

  const [state, setState] = useState({
    status: 'title',
    note: ''
  })
  let { status, note } = state

  const handleStatusChange = (value) => {
    setState({
      ...state,
      status: value[0]
    })
  }

  const handleNoteChange = (e) => {
    setState({
      ...state,
      note: e.target.value
    })
  }

  const save = () => {
    props.editTransportRequirement(currentTransportRequirementDetail._id, { status: Number(status), note: note })
  }

  const isFormValidated = () => {
    if (status === 'title') return false
    return true
  }

  return (
    <DialogModal
      modalID={`modal-approve-transport-requirement`}
      title={'Phê duyệt yêu cầu vận chuyển'}
      formID={`form-approve-transport-requirement`}
      size={25}
      maxWidth={500}
      hasSaveButton={true}
      hasNote={true}
      disableSubmit={!isFormValidated()}
      func={save}
    >
      <form id='form-approve-transport-requirement'>
        <div className={`form-group`}>
          {/* <div className={`form-group ${!statusError ? "" : "has-error"}`}> */}
          <label>
            Trạng thái phê duyệt
            <span className='attention'> * </span>
          </label>
          <SelectBox
            id={`select-transport-requirement-approve-status`}
            className='form-control select2'
            style={{ width: '100%' }}
            value={status}
            items={[
              { value: 'title', text: '---Chọn thái phê duyệt---' },
              { value: 2, text: 'Phê duyệt yêu cầu vận chuyển' },
              { value: 0, text: 'Không phê duyệt yêu cầu' }
            ]}
            onChange={handleStatusChange}
            multiple={false}
          />
          {/* <ErrorLabel content={statusError} /> */}
        </div>
        <div className='form-group'>
          <div className='form-group'>
            <label>
              Ghi chú
              <span className='attention'> </span>
            </label>
            <textarea type='text' className='form-control' value={note} onChange={handleNoteChange} />
          </div>
        </div>
      </form>
    </DialogModal>
  )
}

function mapState(state) {
  return {}
}

const actions = {
  editTransportRequirement: transportRequirementsActions.editTransportRequirement
}

const connectedApproveForm = connect(mapState, actions)(withTranslate(ApproveForm))
export { connectedApproveForm as ApproveForm }
