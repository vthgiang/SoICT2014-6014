import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ButtonModal, ErrorLabel, SelectBox, AttributeTable } from '../../../../common-components'
import { UserActions } from '../redux/actions'
import { RoleActions } from '../../role/redux/actions'
import { AttributeActions } from '../../attribute/redux/actions'
import ValidationHelper from '../../../../helpers/validationHelper'

function UserCreateForm(props) {
  const [state, setState] = useState({
    userAttributes: []
  })

  const save = () => {
    var keys_to_keep = ['attributeId', 'value', 'description']
    if (isFormValidated()) {
      return props.create({
        name: state.userName,
        email: state.userEmail,
        roles: state.userRoles,
        attributes: state.userAttributes.map((element) => Object.assign({}, ...keys_to_keep.map((key) => ({ [key]: element[key] }))))
      })
    }
  }

  const isFormValidated = () => {
    let { userName, userEmail } = state
    let { translate } = props
    if (
      !ValidationHelper.validateName(translate, userName, 6, 255).status ||
      !ValidationHelper.validateEmail(translate, userEmail).status ||
      !ValidationHelper.validateEmail(translate, userEmail).status ||
      !validateAttributes()
    )
      return false
    return true
  }

  const handleUserName = (e) => {
    let { value } = e.target
    let { translate } = props
    let { message } = ValidationHelper.validateName(translate, value, 6, 255)
    setState({
      ...state,
      userName: value,
      userNameError: message
    })
  }

  const handleUserEmail = (e) => {
    let { value } = e.target
    let { translate } = props
    let { message } = ValidationHelper.validateEmail(translate, value)
    setState({
      ...state,
      userEmail: value,
      userEmailError: message
    })
  }

  const handleRolesChange = (value) => {
    setState({
      ...state,
      userRoles: value
    })
  }

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

  useEffect(() => {
    props.getRoles()
  }, [])

  const { translate, role, user } = props
  const { userEmailError, userNameError, userAttributes } = state

  const items = role.list
    .filter((role) => {
      return role && role.name !== 'Super Admin'
    })
    .map((role) => {
      return { value: role ? role._id : null, text: role ? role.name : '' }
    })

  return (
    <DialogModal
      modalID='modal-create-user'
      isLoading={user.isLoading}
      formID='form-create-user'
      title={translate('manage_user.add_title')}
      func={save}
      disableSubmit={!isFormValidated()}
    >
      {/* Form thêm tài khoản người dùng mới */}
      <form id='form-create-user' onSubmit={() => save(translate('manage_user.add_success'))}>
        {/* Tên người dùng */}
        <div className={`form-group ${!userNameError ? '' : 'has-error'}`}>
          <label>
            {translate('table.name')}
            <span className='text-red'>*</span>
          </label>
          <input type='text' className='form-control' onChange={handleUserName} />
          <ErrorLabel content={userNameError} />
        </div>

        {/* Email */}
        <div className={`form-group ${!userEmailError ? '' : 'has-error'}`}>
          <label>
            {translate('table.email')}
            <span className='text-red'>*</span>
          </label>
          <input type='email' className='form-control' onChange={handleUserEmail} />
          <ErrorLabel content={userEmailError} />
        </div>

        {/* Phân quyền được cấp */}
        <div className='form-group'>
          <label>{translate('manage_user.roles')}</label>
          {items.length !== 0 && (
            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
              id={`user-role-form-create`}
              className='form-control select2'
              style={{ width: '100%' }}
              items={items}
              onChange={handleRolesChange}
              multiple={true}
            />
          )}
        </div>

        {/* Các thuộc tính của user */}
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
  )
}

function mapStateToProps(state) {
  const { user, role } = state
  return { user, role }
}

const mapDispatchToProps = {
  create: UserActions.create,
  getRoles: RoleActions.get,
  getAttribute: AttributeActions.getAttributes
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(UserCreateForm))
