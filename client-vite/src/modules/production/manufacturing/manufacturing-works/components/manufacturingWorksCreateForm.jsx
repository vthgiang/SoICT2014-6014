import React, { Component } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { ButtonModal, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components'
import ValidationHelper from '../../../../../helpers/validationHelper'
import { generateCode } from '../../../../../helpers/generateCode'
import { worksActions } from '../redux/actions'

class ManufacturingWorksCreateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: generateCode('NMSX'),
      name: '',
      organizationalUnitValue: '',
      phoneNumber: '',
      address: '',
      status: '',
      description: '',
      manageRoles: [],
      turn: 3
    }
  }

  handleChangeWorksName = (e) => {
    const { value } = e.target
    this.setState({
      name: value
    })
    let { translate } = this.props
    let { message } = ValidationHelper.validateName(translate, value, 6, 255)
    this.setState({ nameError: message })
  }

  getListDepartmentArr = () => {
    const { translate, department, manufacturingWorks } = this.props
    const { list } = department
    const { listWorks } = manufacturingWorks
    let listDepartmentArr = [
      {
        value: '',
        text: translate('manufacturing.manufacturing_works.choose_organizational_unit')
      }
    ]

    loop: for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < listWorks.length; j++) {
        if (listWorks[j].organizationalUnit._id === list[i]._id) {
          continue loop
        }
      }
      listDepartmentArr.push({
        value: list[i]._id,
        text: list[i].name
      })
    }

    return listDepartmentArr
  }

  handleOrganizationalUnitValueChange = (value) => {
    let organizationalUnitValue = value[0]
    this.validateOrganizationalUnitValue(organizationalUnitValue, true)
  }

  validateOrganizationalUnitValue = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate, department } = this.props
    if (value === '') {
      msg = translate('manufacturing.manufacturing_works.error_organizational_unit')
    }

    if (willUpdateState) {
      const { list } = department
      let currentDepartment
      const listDepartment = list.filter((x) => x._id === value)
      if (listDepartment.length > 0) {
        currentDepartment = listDepartment[0]
      } else {
        currentDepartment = {
          name: '',
          description: ''
        }
      }
      this.setState((state) => ({
        ...state,
        organizationalUnitError: msg,
        organizationalUnitValue: value,
        currentDepartment: currentDepartment,
        name: currentDepartment.name,
        description: currentDepartment.description
      }))
    }
    return msg
  }

  getListRolesArr = () => {
    const { role } = this.props
    let { list } = role
    let listRolesArr = []
    const { currentDepartment } = this.state
    // Lấy ra các role trưởng đơn vị của đơn vị hiện tại
    let currentRolesManagerIds = currentDepartment.managers.map((role) => role._id)
    if (list) {
      // Lọc các role hiện tại ra khỏi list
      list = list.filter((role) => !currentRolesManagerIds.includes(role._id))
      list.map((role) => {
        listRolesArr.push({
          value: role._id,
          text: role.name
        })
      })
    }
    return listRolesArr
  }

  handleChangeRoles = (value) => {
    this.setState((state) => ({
      ...state,
      manageRoles: value
    }))
  }

  handlePhoneNumberChange = (e) => {
    const { value } = e.target
    this.setState({
      phoneNumber: value
    })
    let { translate } = this.props
    let { message } = ValidationHelper.validateEmpty(translate, value)
    this.setState({ phoneNumberError: message })
  }

  handleAddressChange = (e) => {
    const { value } = e.target
    this.setState({
      address: value
    })
    let { translate } = this.props
    let { message } = ValidationHelper.validateEmpty(translate, value)
    this.setState({ addressError: message })
  }

  handleTurnChange = (e) => {
    const { value } = e.target
    this.setState({ turn: value })
    if (value <= 0 || value > 12) {
      let message = 'Số ca làm việc phải nằm trong khoảng từ 1 đến 12'
      this.setState({ turnError: message })
      return
    } else {
      this.setState({ turnError: '' })
    }
  }

  handleStatusChange = (value) => {
    let status = value[0]
    this.validateStatus(status, true)
  }

  validateStatus = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = this.props
    if (value === '') {
      msg = translate('manufacturing.manufacturing_works.status_error')
    }
    if (willUpdateState) {
      this.setState((state) => {
        return {
          ...state,
          status: value,
          statusError: msg
        }
      })
    }
    return msg
  }

  handleDescriptionChange = (e) => {
    const { value } = e.target
    this.setState({
      description: value
    })
  }

  isFormValidated = () => {
    const { name, organizationalUnitValue, status, address, phoneNumber } = this.state
    let { translate } = this.props
    if (
      !ValidationHelper.validateName(translate, name, 6, 255).status ||
      !ValidationHelper.validateEmpty(translate, address).status ||
      !ValidationHelper.validateEmpty(translate, phoneNumber).status ||
      this.validateOrganizationalUnitValue(organizationalUnitValue, false) ||
      this.validateStatus(status, false) ||
      this.state.turn <= 0 ||
      this.state.turn > 12
    ) {
      return false
    }
    return true
  }

  save = () => {
    if (this.isFormValidated()) {
      const data = {
        code: this.state.code,
        name: this.state.name,
        organizationalUnit: this.state.organizationalUnitValue,
        address: this.state.address,
        phoneNumber: this.state.phoneNumber,
        status: this.state.status,
        description: this.state.description,
        manageRoles: this.state.manageRoles,
        turn: this.state.turn
      }
      this.props.createManufacturingWorks(data)
    }
  }

  handleClickCreate = () => {
    const code = generateCode('NMSX')
    this.setState((state) => ({
      ...state,
      code: code
    }))
  }

  render() {
    const { translate, manufacturingWorks } = this.props
    const {
      name,
      nameError,
      phoneNumber,
      phoneNumberError,
      address,
      addressError,
      status,
      statusError,
      description,
      code,
      organizationalUnitError,
      organizationalUnitValue,
      currentDepartment,
      manageRoles,
      turn,
      turnError
    } = this.state
    return (
      <React.Fragment>
        <ButtonModal
          onButtonCallBack={this.handleClickCreate}
          modalID='modal-create-works'
          button_name={translate('manufacturing.manufacturing_works.create_works')}
          title={translate('manufacturing.manufacturing_works.create_works')}
        />
        <DialogModal
          modalID='modal-create-works'
          isLoading={manufacturingWorks.isLoading}
          formID='form-create-works'
          title={translate('manufacturing.manufacturing_works.create_works')}
          msg_success={translate('manufacturing.manufacturing_works.create_successfully')}
          msg_failure={translate('manufacturing.manufacturing_works.create_failed')}
          func={this.save}
          disableSubmit={!this.isFormValidated()}
          size={50}
          maxWidth={500}
        >
          <form id='form-create-works'>
            <div className='form-group'>
              <label>
                {translate('manufacturing.manufacturing_works.code')}
                <span className='text-red'>*</span>
              </label>
              <input type='text' className='form-control' value={code} disabled={true}></input>
            </div>
            <div className={`form-group ${!organizationalUnitError ? '' : 'has-error'}`}>
              <label>
                {translate('manufacturing.manufacturing_works.organizational_unit')}
                <span className='text-red'>*</span>
              </label>
              <SelectBox
                id={`select-organizational-unit-create`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={organizationalUnitValue}
                items={this.getListDepartmentArr()}
                onChange={this.handleOrganizationalUnitValueChange}
                multiple={false}
              />
              <ErrorLabel content={organizationalUnitError} />
            </div>
            <div className={`form-group ${!nameError ? '' : 'has-error'}`}>
              <label>
                {translate('manufacturing.manufacturing_works.name')}
                <span className='text-red'>*</span>
              </label>
              <input type='text' className='form-control' value={name} onChange={this.handleChangeWorksName}></input>
              <ErrorLabel content={nameError} />
            </div>
            {currentDepartment && currentDepartment.managers && (
              <React.Fragment>
                <fieldset className='scheduler-border'>
                  <legend className='scheduler-border'>{translate('manufacturing.manufacturing_works.list_roles')}</legend>
                  {currentDepartment.managers.map((role, index) => {
                    return (
                      <div className={`form-group`} key={index}>
                        <strong>{role.name}: &emsp;</strong>
                        {role.users.map((user, index) => {
                          if (index === role.users.length - 1) {
                            return user.userId.name
                          }
                          return user.userId.name + ', '
                        })}
                      </div>
                    )
                  })}
                </fieldset>
                <div className='form-group'>
                  <label>{translate('manufacturing.manufacturing_works.manage_roles')}</label>
                  <a style={{ cursor: 'pointer' }} title={translate('manufacturing.manufacturing_works.manage_roles_description')}>
                    <i class='fa fa-question-circle' aria-hidden='true' style={{ marginLeft: '10px' }}></i>
                  </a>
                  <div>
                    <SelectBox
                      id={`select-manage-roles-works`}
                      className='form-control select2'
                      style={{ width: '100%' }}
                      items={this.getListRolesArr()}
                      value={manageRoles}
                      onChange={this.handleChangeRoles}
                      multiple={true}
                    />
                  </div>
                </div>
              </React.Fragment>
            )}
            <div className={`form-group ${!phoneNumberError ? '' : 'has-error'}`}>
              <label>
                {translate('manufacturing.manufacturing_works.phone')}
                <span className='text-red'>*</span>
              </label>
              <input type='text' value={phoneNumber} className='form-control' onChange={this.handlePhoneNumberChange}></input>
              <ErrorLabel content={phoneNumberError} />
            </div>
            <div className={`form-group ${!addressError ? '' : 'has-error'}`}>
              <label>
                {translate('manufacturing.manufacturing_works.address')}
                <span className='text-red'>*</span>
              </label>
              <input type='text' value={address} className='form-control' onChange={this.handleAddressChange}></input>
              <ErrorLabel content={addressError} />
            </div>
            <div className={`form-group ${!turnError ? '' : 'has-error'}`}>
              <label>
                Số ca làm việc<span className='text-red'>*</span>
              </label>
              <input type='number' value={turn} className='form-control' onChange={this.handleTurnChange}></input>
              <ErrorLabel content={turnError} />
            </div>
            <div className={`form-group ${!statusError ? '' : 'has-error'}`}>
              <label>
                {translate('manufacturing.manufacturing_works.status')}
                <span className='text-red'>*</span>
              </label>
              <SelectBox
                id={`select-status`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={status}
                items={[
                  { value: '', text: translate('manufacturing.manufacturing_works.choose_status') },
                  { value: '1', text: translate('manufacturing.manufacturing_works.1') },
                  { value: '0', text: translate('manufacturing.manufacturing_works.0') }
                ]}
                onChange={this.handleStatusChange}
                multiple={false}
              />
              <ErrorLabel content={statusError} />
            </div>
            <div className='form-group'>
              <label>{translate('manufacturing.manufacturing_works.description')}</label>
              <textarea type='text' value={description} onChange={this.handleDescriptionChange} className='form-control'></textarea>
            </div>
          </form>
        </DialogModal>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { manufacturingWorks, department, role } = state
  return { manufacturingWorks, department, role }
}

const mapDispatchToProps = {
  createManufacturingWorks: worksActions.createManufacturingWorks
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingWorksCreateForm))
