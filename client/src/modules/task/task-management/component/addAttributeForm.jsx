import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ButtonModal, SelectBox, ErrorLabel, AttributeTable } from '../../../../common-components'
import ValidationHelper from '../../../../helpers/validationHelper'
import { AttributeActions } from '../../../super-admin/attribute/redux/actions'
import { taskManagementActions } from '../redux/actions'

function AddAttributeForm(props) {
  const [state, setState] = useState({
    taskAttributes: []
  })

  useEffect(() => {
    props.getAttribute()
  }, [])

  useEffect(() => {
    if (props.taskID !== state.taskID) {
      setState({
        ...state,
        taskID: props.taskID,
        taskAttributes: props.taskAttributes
      })
    }
  }, [props.taskID])

  const handleChange = (name, value) => {
    setState({
      ...state,
      [name]: value
    })
  }

  const handleChangeAddRowAttribute = (name, value) => {
    props.handleChangeAddRowAttribute(name, value)
  }

  const validateAttributes = () => {
    var attributes = state.taskAttributes
    let result = true

    if (attributes.length !== 0) {
      for (let n in attributes) {
        if (
          !ValidationHelper.validateEmpty(props.translate, attributes[n].attributeId).status ||
          !ValidationHelper.validateEmpty(props.translate, attributes[n].value).status
        ) {
          result = false
          break
        }
      }
    }
    return result
  }

  const isFormValidated = () => {
    if (!validateAttributes()) return false
    return true
  }
  console.log(state.taskAttributes)
  const save = () => {
    var keys_to_keep = ['attributeId', 'value', 'description']

    if (isFormValidated()) {
      return props.saveTaskAttributes(props.id, {
        attributes: state.taskAttributes.map((element) => Object.assign({}, ...keys_to_keep.map((key) => ({ [key]: element[key] }))))
      })
    }
  }

  const { translate } = props
  const { taskAttributes } = state

  return (
    <React.Fragment>
      <DialogModal
        modalID={`${props.id}-attribute-form`}
        formID={`form-add-attribute-${props.id}`}
        title={translate(props.translation + '.add_attribute_title')}
        func={save}
        disableSubmit={!isFormValidated()}
        size={75}
      >
        {/* Form thêm phân quyền mới */}
        <form id={`form-add-attribute-${props.id}`}>
          {/* Các thuộc tính của user */}
          <AttributeTable
            attributes={taskAttributes}
            handleChange={handleChange}
            attributeOwner={props.attributeOwner}
            translation={props.translation}
            handleChangeAddRowAttribute={handleChangeAddRowAttribute}
            i={props.i}
            attributeType={['Delegation', 'Mixed']}
          />
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {}
const actions = {
  saveTaskAttributes: taskManagementActions.saveTaskAttributes,
  getAttribute: AttributeActions.getAttributes
}

const addAttributeForm = connect(mapStateToProps, actions)(withTranslate(AddAttributeForm))

export { addAttributeForm as AddAttributeForm }
