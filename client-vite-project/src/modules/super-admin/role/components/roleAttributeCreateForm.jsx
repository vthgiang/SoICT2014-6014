import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ButtonModal, SelectBox, ErrorLabel, AttributeTable } from '../../../../common-components'
import { RoleActions } from '../redux/actions'
import { AttributeActions } from '../../attribute/redux/actions'
import ValidationHelper from '../../../../helpers/validationHelper'
import ModalImportRole from './modalImportRole'

function RoleAttributeCreateForm(props) {
  const [state, setState] = useState({
    roleList: [],
    roleAttributes: []
  })

  useEffect(() => {
    props.get()
  }, [])

  const handleRoleList = (value) => {
    setState({
      ...state,
      roleList: value
    })
  }

  const handleRoleUser = (e) => {
    const { value } = e.target
    setState({
      ...state,
      roleUsers: [value]
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
    var roleAttributes = state.roleAttributes
    let result = true

    if (roleAttributes.length !== 0) {
      for (let n in roleAttributes) {
        if (
          !ValidationHelper.validateEmpty(props.translate, roleAttributes[n].attributeId).status ||
          !ValidationHelper.validateEmpty(props.translate, roleAttributes[n].value).status
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
    let { roleList, roleAttributes } = state

    if (roleList.length == 0 || roleAttributes.length == 0 || !validateAttributes()) return false
    return true
  }

  const save = () => {
    var keys_to_keep = ['attributeId', 'value', 'description']
    const data = {
      roleList: state.roleList,
      attributes: state.roleAttributes.map((element) => Object.assign({}, ...keys_to_keep.map((key) => ({ [key]: element[key] }))))
    }

    if (isFormValidated()) {
      return props.createRoleAttribute(data)
    }
  }

  const handleOpenModalCreateRoleAttribute = () => {
    window.$(`#modal-create-role-attribute`).modal('show')
  }
  console.log('state', state)

  // const handleOpenModalImportAttribute = () => {
  //     window.$(`#modal-import-role-attribute`).modal('show')
  // }

  const { translate, role } = props
  const { roleAttributes } = state

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
              {translate('manage_role.add_attribute')}
            </button>
            <ul className='dropdown-menu pull-right'>
              <li>
                <a href='#' onClick={handleOpenModalCreateRoleAttribute}>
                  {translate('manage_role.add_role_attribute')}
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
        modalID='modal-create-role-attribute'
        isLoading={role.isLoading}
        formID='form-create-role-attribute'
        title={translate('manage_role.add_attribute_title')}
        size={50}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* Form thêm phân quyền mới */}
        <form id='form-create-role-attribute'>
          {/* Tên phân quyền
                    <div className={`form-group ${!roleNameError ? "" : "has-error"}`}>
                        <label>{translate('manage_role.name')}<span className="text-red">*</span></label>
                        <input className="form-control" onChange={handleRoleName} />
                        <ErrorLabel content={roleNameError} />
                    </div> */}

          {/* Các phân quyền thêm thuộc tính*/}
          <div className='form-group'>
            <label>
              {translate('manage_role.roles_add_attribute')}
              <span className='text-red'>*</span>
            </label>
            <SelectBox
              id='select-role-attribute-create'
              className='form-control select2'
              style={{ width: '100%' }}
              items={role.list.map((role) => {
                return { value: role ? role._id : null, text: role ? role.name : '' }
              })}
              onChange={handleRoleList}
              multiple={true}
            />
          </div>

          {/* Các thuộc tính của phân quyền */}
          <AttributeTable
            attributes={roleAttributes}
            handleChange={handleChange}
            handleChangeAddRowAttribute={handleChangeAddRowAttribute}
            attributeOwner={'roleAttributes'}
            translation={'manage_role'}
            i={props.i}
          />
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { role, user } = state
  return { role, user }
}

const mapDispatchToProps = {
  get: RoleActions.get,
  createRoleAttribute: RoleActions.createRoleAttribute,
  getAttribute: AttributeActions.getAttributes
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RoleAttributeCreateForm))
