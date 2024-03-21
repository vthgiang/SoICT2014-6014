import React from 'react'
import { DialogModal } from '../../../../common-components'

export default function CreateSimpleTaskModal(props) {
  return (
    <React.Fragment>
      <DialogModal
        modalID='modal-create-simple-task-project-template'
        isLoading={false}
        formID='form-create-simple-task-project-template'
        title={'Thêm việc vào dự án'}
        // func={save}
        // disableSubmit={!isFormValidated()}
        size={100}
      >
        CreateSimpleTaskModal
      </DialogModal>
    </React.Fragment>
  )
}
