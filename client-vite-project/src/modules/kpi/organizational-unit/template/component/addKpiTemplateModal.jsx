import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../../common-components'
import ValidationHelper from '../../../../../helpers/validationHelper'
import { kpiTemplateActions } from '../redux/actions'

import { AddKpiTemplate } from './addKpiTemplate'

function ModalAddKpiTemplate(props) {
  const [state, setState] = useState({
    templateData: {
      organizationalUnit: '',
      name: '',
      creator: '',
      kpis: []
    },
    currentRole: localStorage.getItem('currentRole')
  })

  /**Submit new template in data */
  const handleSubmit = () => {
    let { templateData } = state
    props.addNewTemplate(templateData)
    // props.getKpiTemplates(null, null, 1, props.limit);
  }

  /**
   * Xử lý form lớn kpitemplate
   */
  const isKpiTemplateFormValidated = () => {
    let validateName = ValidationHelper.validateName(props.translate, state.templateData.name)
    if (state.templateData.name && validateName.status && state.templateData.organizationalUnit.length !== 0) {
      return true
    }
    return false
  }

  const onChangeTemplateData = (value) => {
    setState({
      templateData: value
    })
  }

  const { user, translate, savedKpiAsTemplate, savedKpiItem, savedKpiId } = props

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-add-kpi-template`}
        formID={`form-add-kpi-template`}
        title={'Thêm mới mẫu KPI đơn vị'}
        func={handleSubmit}
        disableSubmit={!isKpiTemplateFormValidated()}
        size={75}
      >
        <AddKpiTemplate
          onChangeTemplateData={onChangeTemplateData}
          // dùng cho chức năng lưu kpi thành template
          savedKpiAsTemplate={savedKpiAsTemplate}
          savedKpiItem={savedKpiItem}
          savedKpiId={savedKpiId}
        />
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {}

const actionCreators = {
  addNewTemplate: kpiTemplateActions.addKpiTemplate,
  getKpiTemplates: kpiTemplateActions.getKpiTemplates
}
const connectedModalAddKpiTemplate = connect(mapState, actionCreators)(withTranslate(ModalAddKpiTemplate))
export { connectedModalAddKpiTemplate as ModalAddKpiTemplate }
