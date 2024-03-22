import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ButtonModal, SelectBox, ErrorLabel, AttributeTable } from '../../../../common-components'
import { UserActions } from '../redux/actions'
import { AttributeActions } from '../../attribute/redux/actions'
import ValidationHelper from '../../../../helpers/validationHelper'

function UserAttributeCreateForm(props) {
  const [state, setState] = useState({
    userList: [],
    userAttributes: []
  })

  const handleUserList = (value) => {
    setState({
      ...state,
      userList: value
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
    var userAttributes = state.userAttributes
    let result = true

    if (userAttributes.length !== 0) {
      for (let n in userAttributes) {
        if (
          !ValidationHelper.validateEmpty(props.translate, userAttributes[n].attributeId).status ||
          !ValidationHelper.validateEmpty(props.translate, userAttributes[n].value).status
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
    let { userList, userAttributes } = state

    if (userList.length == 0 || userAttributes.length == 0 || !validateAttributes()) return false
    return true
  }

  const save = () => {
    var keys_to_keep = ['attributeId', 'value', 'description']
    const data = {
      userList: state.userList,
      attributes: state.userAttributes.map((element) => Object.assign({}, ...keys_to_keep.map((key) => ({ [key]: element[key] }))))
    }

    if (isFormValidated()) {
      return props.createUserAttribute(data)
    }
  }

  const handleOpenModalCreateUserAttribute = () => {
    window.$(`#modal-create-user-attribute`).modal('show')
  }
  console.log('state', state)

  // const handleOpenModalImportAttribute = () => {
  //     window.$(`#modal-import-role-attribute`).modal('show')
  // }

  const { translate, user } = props
  const { userAttributes } = state

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
              {translate('manage_user.add_attribute')}
            </button>
            <ul className='dropdown-menu pull-right'>
              <li>
                <a href='#' onClick={handleOpenModalCreateUserAttribute}>
                  {translate('manage_user.add_user_attribute')}
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
        modalID='modal-create-user-attribute'
        isLoading={user.isLoading}
        formID='form-create-user-attribute'
        title={translate('manage_user.add_attribute_title')}
        size={50}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* Form thêm phân quyền mới */}
        <form id='form-create-user-attribute'>
          {/* Các trang thêm thuộc tính*/}
          <div className='form-group'>
            <label>
              {translate('manage_user.users_add_attribute')}
              <span className='text-red'>*</span>
            </label>
            <SelectBox
              id='select-user-attribute-create'
              className='form-control select2'
              style={{ width: '100%' }}
              items={user.list.map((user) => {
                return { value: user ? user._id : null, text: user ? `${user.name} - ${user.email}` : '' }
              })}
              onChange={handleUserList}
              multiple={true}
            />
          </div>

          {/* Các thuộc tính của phân quyền */}
          <AttributeTable
            attributes={userAttributes}
            handleChange={handleChange}
            attributeOwner={'userAttributes'}
            translation={'manage_user'}
            handleChangeAddRowAttribute={handleChangeAddRowAttribute}
            i={props.i}
          />
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { user } = state
  return { user }
}

const mapDispatchToProps = {
  createUserAttribute: UserActions.createUserAttribute,
  getAttribute: AttributeActions.getAttributes
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(UserAttributeCreateForm))
