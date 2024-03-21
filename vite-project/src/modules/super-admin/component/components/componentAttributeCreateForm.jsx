import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ButtonModal, SelectBox, ErrorLabel, AttributeTable } from '../../../../common-components'
import { ComponentActions } from '../redux/actions'
import { AttributeActions } from '../../attribute/redux/actions'
import ValidationHelper from '../../../../helpers/validationHelper'

function ComponentAttributeCreateForm(props) {
  const [state, setState] = useState({
    componentList: [],
    componentAttributes: []
  })

  const handleComponentList = (value) => {
    setState({
      ...state,
      componentList: value
    })
  }

  /**
   * Bắt sự kiện chỉnh sửa tên thuộc tính
   */
  // Function lưu các trường thông tin vào state
  const handleChange = (name, value) => {
    setState({
      ...state,
      [name]: value
    })
  }

  const handleChangeAddRowAttribute = (name, value) => {
    props.handleChangeAddRowAttribute(name, value)
  }

  useEffect(() => {
    props.getAttribute()
  }, [])

  const validateAttributes = () => {
    var componentAttributes = state.componentAttributes
    let result = true

    if (componentAttributes.length !== 0) {
      for (let n in componentAttributes) {
        if (
          !ValidationHelper.validateEmpty(props.translate, componentAttributes[n].attributeId).status ||
          !ValidationHelper.validateEmpty(props.translate, componentAttributes[n].value).status
        ) {
          result = false
          break
        }
      }
    }
    console.log(result)
    return result
  }

  const isFormValidated = () => {
    let { componentList, componentAttributes } = state

    if (componentList.length == 0 || componentAttributes.length == 0 || !validateAttributes()) return false
    return true
  }

  const save = () => {
    var keys_to_keep = ['attributeId', 'value', 'description']
    const data = {
      componentList: state.componentList,
      attributes: state.componentAttributes.map((element) => Object.assign({}, ...keys_to_keep.map((key) => ({ [key]: element[key] }))))
    }

    if (isFormValidated()) {
      return props.createComponentAttribute(data)
    }
  }

  const handleOpenModalCreateComponentAttribute = () => {
    window.$(`#modal-create-component-attribute`).modal('show')
  }
  console.log('state', state)

  // const handleOpenModalImportAttribute = () => {
  //     window.$(`#modal-import-role-attribute`).modal('show')
  // }

  const { translate, component } = props
  const { componentAttributes } = state

  return (
    <React.Fragment>
      {/* Button thêm thuộc tính */}
      <div style={{ display: 'flex', marginBottom: 6, float: 'right' }}>
        {
          <div className='dropdown'>
            <button
              style={{ marginRight: 10 }}
              type='button'
              className='btn btn-primary dropdown-toggler'
              data-toggle='dropdown'
              aria-expanded='true'
            >
              {translate('manage_component.add_attribute')}
            </button>
            <ul className='dropdown-menu pull-right'>
              <li>
                <a href='#' onClick={handleOpenModalCreateComponentAttribute}>
                  {translate('manage_component.add_component_attribute')}
                </a>
              </li>
              {/* <li><a href="#" onClick={handleOpenModalImportRoleAttribute}>Thêm thuộc tính từ file</a></li> */}
            </ul>
          </div>
        }
      </div>

      {/* <ModalImportRole /> */}
      {/* <ButtonModal modalID="modal-create-role" button_name={translate('manage_role.add')} title={translate('manage_role.add_title')} /> */}

      <DialogModal
        modalID='modal-create-component-attribute'
        isLoading={component.isLoading}
        formID='form-create-component-attribute'
        title={translate('manage_component.add_attribute_title')}
        size={50}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* Form thêm phân quyền mới */}
        <form id='form-create-component-attribute'>
          {/* Các trang thêm thuộc tính*/}
          <div className='form-group'>
            <label>
              {translate('manage_component.components_add_attribute')}
              <span className='text-red'>*</span>
            </label>
            <SelectBox
              id='select-component-attribute-create'
              className='form-control select2'
              style={{ width: '100%' }}
              items={component.list.map((component) => {
                return { value: component ? component._id : null, text: component ? component.name : '' }
              })}
              onChange={handleComponentList}
              multiple={true}
            />
          </div>

          {/* Các thuộc tính của phân quyền */}
          <AttributeTable
            attributes={componentAttributes}
            handleChange={handleChange}
            attributeOwner={'componentAttributes'}
            translation={'manage_component'}
            handleChangeAddRowAttribute={handleChangeAddRowAttribute}
            i={props.i}
          />
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { component } = state
  return { component }
}

const mapDispatchToProps = {
  createComponentAttribute: ComponentActions.createComponentAttribute,
  getAttribute: AttributeActions.getAttributes
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ComponentAttributeCreateForm))
