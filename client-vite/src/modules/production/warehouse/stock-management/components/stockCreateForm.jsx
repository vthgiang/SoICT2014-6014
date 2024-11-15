import React from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { DialogModal, SelectBox, ErrorLabel, ButtonModal, TimePicker } from '../../../../../common-components'
import { StockActions } from '../redux/actions'
import { generateCode } from '../../../../../helpers/generateCode'
import { useState } from 'react'
import { formatDate } from '../../../../../helpers/formatDate'
import dayjs from 'dayjs'
import ImportStockModal from './importStockModal'

function StockCreateForm(props) {
  const EMPTY_GOOD = {
    good: '',
    maxQuantity: '',
    minQuantity: ''
  }

  const EMPTY_ROLE = {
    role: '',
    managementGood: []
  }

  const MANAGEMENT_ROLE = {
    role: '',
    managementGood: []
  }

  const [state, setState] = useState({
    code: generateCode('ST'),
    name: '',
    status: '1',
    address: '',
    goods: [],
    good: Object.assign({}, EMPTY_GOOD),
    managementLocation: [],
    role: Object.assign({}, MANAGEMENT_ROLE),
    description: '',
    editInfo: false,
    editInfoRole: false,
    startTime: '07:00 AM',
    endTime: '07:00 PM'
  })

  const handleNameChange = (e) => {
    let value = e.target.value
    validateName(value, true)
  }

  const validateName = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('manage_warehouse.category_management.validate_name')
    }
    if (willUpdateState) {
      setState({
        ...state,
        errorOnName: msg,
        name: value
      })
    }
    return msg === undefined
  }

  const handleAddressChange = (e) => {
    let value = e.target.value
    validateAddress(value, true)
  }

  const validateAddress = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('manage_warehouse.category_management.validate_name')
    }
    if (willUpdateState) {
      setState({
        ...state,
        errorOnAddress: msg,
        address: value
      })
    }
    return msg === undefined
  }

  const handleOrganizationalUnitValueChange = (value) => {
    let organizationalUnitValue = value[0]
    validateOrganizationalUnitValue(organizationalUnitValue, true)
  }

  const validateOrganizationalUnitValue = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate, department } = props
    if (value === '') {
      msg = translate('manage_warehouse.stock_management.error_organizational_unit')
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
      setState({
        ...state,
        organizationalUnitError: msg,
        organizationalUnitValue: value,
        currentDepartment: currentDepartment,
        name: currentDepartment.name,
        description: currentDepartment.description
      })
    }
    return msg
  }

  const handleStatusChange = (value) => {
    setState({
      ...state,
      status: value[0]
    })
  }

  const handleDescriptionChange = (e) => {
    let value = e.target.value
    setState({
      ...state,
      description: value
    })
  }

  const handleGoodsChange = (value) => {
    setState({
      ...state,
      goods: value
    })
  }

  const isFormValidated = () => {
    let result =
      validateName(state.name, false) &&
      validateAddress(state.address, false) &&
      validateStartTime(state.startTime, false) &&
      validateEndTime(state.endTime, false)
    return result
  }

  const save = () => {
    if (isFormValidated()) {
      props.createStock(state)
    }
  }

  const getAllDepartment = () => {
    let { translate } = props
    let manageDepartmentArr = [{ value: '', text: translate('manage_warehouse.stock_management.choose_department') }]

    props.department.list.map((item) => {
      manageDepartmentArr.push({
        value: item._id,
        text: item.name
      })
    })

    return manageDepartmentArr
  }

  const handleMinQuantityChange = (e) => {
    let value = e.target.value
    state.good.minQuantity = value
    setState({
      ...state
    })
  }

  const handleMaxQuantityChange = (e) => {
    let value = e.target.value
    state.good.maxQuantity = value
    setState({
      ...state
    })
  }

  const getAllGoods = () => {
    const { translate } = props
    let goodArr = [{ value: '', text: translate('manage_warehouse.stock_management.choose_good') }]

    props.goods.listALLGoods.map((item) => {
      goodArr.push({
        value: item._id,
        text: item.name
      })
    })

    return goodArr
  }

  const getAllRoles = () => {
    const { translate, role } = props
    let roleArr = [{ value: '', text: translate('manage_warehouse.stock_management.choose_role') }]

    role.list.map((item) => {
      roleArr.push({
        value: item._id,
        text: item.name
      })
    })

    return roleArr
  }

  const handleGoodChange = (value) => {
    let good = value[0]
    validateGood(good, true)
  }

  const validateGood = async (value, willUpdateState = true) => {
    const dataGood = await getAllGoods()

    let msg = undefined
    const { translate } = props
    let { good } = state
    if (!value) {
      msg = translate('manage_warehouse.stock_management.validate_good')
    }
    if (willUpdateState) {
      let goodName = dataGood.find((x) => x.value === value)
      good.good = { _id: value, name: goodName.text }
      setState({
        ...state,
        good: { ...good },
        errorOnGood: msg
      })
    }
    return msg === undefined
  }

  const handleRoleChange = (value) => {
    let role = value[0]
    validateRole(role, true)
  }

  const validateRole = async (value, willUpdateState = true) => {
    const dataRoles = await getAllRoles()

    let msg = undefined
    const { translate } = props
    let { role } = state
    if (!value) {
      msg = translate('manage_warehouse.stock_management.validate_good')
    }
    if (willUpdateState) {
      let roleName = dataRoles.find((x) => x.value === value)
      role.role = { _id: value, name: roleName.text }
      setState({
        ...state,
        role: { ...role },
        errorOnRole: msg
      })
    }
    return msg === undefined
  }

  const handleManagementGoodChange = (value) => {
    let managementGood = value
    validateManagementRole(managementGood, true)
  }

  const validateManagementRole = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    const { role } = state
    if (!value) {
      msg = translate('manage_warehouse.category_management.validate_name')
    }
    if (willUpdateState) {
      role.managementGood = value
      setState({
        ...state,
        errorOnManagementGood: msg,
        role: { ...role }
      })
    }
    return msg === undefined
  }

  const isGoodsValidated = () => {
    let result = validateGood(state.good.good, false)
    return result
  }

  const isRolesValidated = () => {
    let result = validateManagementRole(state.role.managementGood, false) && validateRole(state.role.role, false)
    return result
  }

  const handleAddGood = async (e) => {
    e.preventDefault()
    let goods = [...state.goods, state.good]

    await setState({
      ...state,
      goods: goods,
      good: Object.assign({}, EMPTY_GOOD)
    })
  }

  const handleDeleteGood = async (index) => {
    let { goods } = state
    let newGoods
    if (goods) {
      newGoods = goods.filter((item, x) => index !== x)
    }
    await setState({
      ...state,
      goods: newGoods
    })
  }

  const handleEditGood = async (good, index) => {
    setState({
      ...state,
      editInfo: true,
      indexInfo: index,
      good: Object.assign({}, good)
    })
  }

  const handleSaveEditGood = async (e) => {
    e.preventDefault()
    const { indexInfo, goods } = state
    let newGoods
    if (goods) {
      newGoods = goods.map((item, index) => {
        return index === indexInfo ? state.good : item
      })
    }
    await setState({
      ...state,
      editInfo: false,
      goods: newGoods,
      good: Object.assign({}, EMPTY_GOOD)
    })
  }

  const handleCancelEditGood = async (e) => {
    e.preventDefault()
    setState({
      ...state,
      editInfo: false,
      good: Object.assign({}, EMPTY_GOOD)
    })
  }

  const handleClearGood = (e) => {
    e.preventDefault()
    setState({
      ...state,
      good: Object.assign({}, EMPTY_GOOD)
    })
  }

  const handleClickCreate = (event) => {
    const value = generateCode('ST')
    setState({
      ...state,
      code: value
    })
    event.preventDefault()
    window.$('#modal-create-stock').modal('show')
  }

  const handleAddRole = async (e) => {
    e.preventDefault()
    let managementLocation = [...state.managementLocation, state.role]
    await setState({
      ...state,
      managementLocation: managementLocation,
      role: Object.assign({}, EMPTY_ROLE)
    })
  }

  const handleDeleteRole = async (index) => {
    let { managementLocation } = state
    let newManagementLocation
    if (managementLocation) {
      newManagementLocation = managementLocation.filter((item, x) => index !== x)
    }
    await setState({
      ...state,
      managementLocation: newManagementLocation
    })
  }

  const handleEditRole = async (role, index) => {
    setState({
      ...state,
      editInfoRole: true,
      indexInfoRole: index,
      role: Object.assign({}, role)
    })
  }

  const handleSaveEditRole = async (e) => {
    e.preventDefault()
    const { indexInfoRole, managementLocation } = state
    let newManagementLocation
    if (managementLocation) {
      newManagementLocation = managementLocation.map((item, index) => {
        return index === indexInfoRole ? state.role : item
      })
    }
    await setState({
      ...state,
      editInfoRole: false,
      managementLocation: newManagementLocation,
      role: Object.assign({}, EMPTY_ROLE)
    })
  }

  const handleCancelEditRole = async (e) => {
    e.preventDefault()
    await setState({
      ...state,
      editInfoRole: false,
      role: Object.assign({}, EMPTY_ROLE)
    })
  }

  const handleClearRole = (e) => {
    e.preventDefault()
    setState({
      ...state,
      role: Object.assign({}, EMPTY_ROLE)
    })
  }

  const checkHasComponent = (name) => {
    var { auth } = props
    var result = false
    auth.components.forEach((component) => {
      if (component.name === name) result = true
    })
    return result
  }

  const convertDateTime = (date, time) => {
    let splitter = date.split('-')
    let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`
    return dayjs(strDateTime).format('YYYY/MM/DD HH:mm:ss')
  }

  const handleStartTimeChange = (value) => {
    validateStartTime(value, true)
  }

  const validateStartTime = (value, willUpdateState = true) => {
    let msg = undefined
    let startTime = convertDateTime(formatDate(new Date().toISOString()), value)
    let endTime = convertDateTime(formatDate(new Date().toISOString()), state.endTime)
    if (startTime > endTime) {
      msg = 'Thời gian mở cửa phải trước thời gian đóng cửa'
    }
    if (willUpdateState) {
      setState({
        ...state,
        startTime: value,
        errorOnStartTime: msg
      })
    }
    return msg === undefined
  }

  const handleEndTimeChange = (value) => {
    validateEndTime(value, true)
  }

  const validateEndTime = (value, willUpdateState = true) => {
    let msg = undefined
    let startTime = convertDateTime(formatDate(new Date().toISOString()), state.startTime)
    let endTime = convertDateTime(formatDate(new Date().toISOString()), value)
    if (startTime > endTime) {
      msg = 'Thời gian mở cửa phải trước thời gian đóng cửa'
    }
    if (willUpdateState) {
      setState({
        ...state,
        endTime: value,
        errorOnEndTime: msg
      })
    }
    return msg === undefined
  }

  const { translate, stocks } = props
  const {
    errorOnName,
    errorOnAddress,
    errorOnDepartment,
    errorOnManagementLocation,
    errorOnGood,
    errorOnMinQuantity,
    errorOnMaxQuantity,
    code,
    name,
    managementLocation,
    status,
    address,
    description,
    organizationalUnitValue,
    goods,
    good,
    errorOnRole,
    errorOnManagementGood,
    role,
    currentDepartment,
    startTime,
    endTime,
    errorOnStartTime,
    errorOnEndTime
  } = state
  const departmentManagement = getAllDepartment()
  const listGoods = getAllGoods()
  const listRoles = getAllRoles()

  return (
    <React.Fragment>
      <div className='dropdown pull-right'>
        {/* Xuất báo cáo */}
        <button
          type='button'
          className='btn btn-success dropdown-toggler pull-right'
          data-toggle='dropdown'
          aria-expanded='true'
          title={translate('manage_warehouse.category_management.add')}
        >
          {translate('manage_warehouse.category_management.add')}
        </button>
        <ul className='dropdown-menu pull-right'>
          {checkHasComponent('create-stock-button') && (
            <li>
              <a
                href='#modal-create-stock'
                title='Add stock'
                onClick={(event) => {
                  handleClickCreate(event)
                }}
              >
                {translate('manage_warehouse.category_management.add')}
              </a>
            </li>
          )}
          <li>
            <a
              style={{ cursor: 'pointer' }}
              onClick={() => {
                window.$('#import_stock').modal('show')
              }}
            >
              {translate('human_resource.profile.employee_management.add_import')}
            </a>
          </li>
        </ul>
        <ImportStockModal />
      </div>
      <DialogModal
        modalID={`modal-create-stock`}
        isLoading={stocks.isLoading}
        formID={`form-create-stock`}
        title={translate('manage_warehouse.stock_management.add_title')}
        msg_success={translate('manage_warehouse.stock_management.add_success')}
        msg_failure={translate('manage_warehouse.stock_management.add_faile')}
        disableSubmit={!isFormValidated()}
        func={save}
        size={75}
      >
        <form id={`form-create-stock`}>
          <div className='row'>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className={`form-group`}>
                <label>
                  {translate('manage_warehouse.stock_management.code')}
                  <span className='text-red'> * </span>
                </label>
                <input type='text' className='form-control' value={code} disabled />
              </div>
              <div className={`form-group ${!errorOnName ? '' : 'has-error'}`}>
                <label>
                  {translate('manage_warehouse.stock_management.name')}
                  <span className='text-red'> * </span>
                </label>
                <input type='text' className='form-control' value={name} onChange={handleNameChange} />
                <ErrorLabel content={errorOnName} />
              </div>
              <div className={`form-group ${!errorOnAddress ? '' : 'has-error'}`}>
                <label>
                  {translate('manage_warehouse.stock_management.address')}
                  <span className='text-red'> * </span>
                </label>
                <input type='text' className='form-control' value={address} onChange={handleAddressChange} />
                <ErrorLabel content={errorOnAddress} />
              </div>
            </div>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className={`form-group ${!errorOnDepartment ? '' : 'has-error'}`}>
                <label>
                  {translate('manage_warehouse.stock_management.department')}
                  <span className='text-red'> * </span>
                </label>
                <SelectBox
                  id={`select-department`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={organizationalUnitValue}
                  items={departmentManagement}
                  onChange={handleOrganizationalUnitValueChange}
                  multiple={false}
                />
                <ErrorLabel content={errorOnDepartment} />
              </div>
              <div className='form-group'>
                <label>
                  {translate('manage_warehouse.stock_management.status')}
                  <span className='text-red'> * </span>
                </label>
                <SelectBox
                  id={`select-status-stock`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={status}
                  items={[
                    { value: '1', text: translate('manage_warehouse.stock_management.1.status') },
                    { value: '2', text: translate('manage_warehouse.stock_management.2.status') },
                    { value: '3', text: translate('manage_warehouse.stock_management.3.status') },
                    { value: '4', text: translate('manage_warehouse.stock_management.4.status') }
                  ]}
                  onChange={handleStatusChange}
                  multiple={false}
                />
              </div>
              <div className='form-group'>
                <div className={`col-xs-12 col-sm-6 col-md-6 col-lg-6 form-group ${!errorOnStartTime ? '' : 'has-error'}`}>
                  <label>
                    {'Thời gian bắt đầu mở cửa'}
                    <span className='text-red'> * </span>
                  </label>
                  <TimePicker
                    id={`startTimePicker`}
                    refs={`startTimePicker`}
                    value={startTime}
                    onChange={(e) => handleStartTimeChange(e)}
                  />
                  <ErrorLabel content={errorOnStartTime} />
                </div>
                <div className={`col-xs-12 col-sm-6 col-md-6 col-lg-6 form-group ${!errorOnEndTime ? '' : 'has-error'}`}>
                  <label>
                    {'Thời gian đóng cửa'}
                    <span className='text-red'> * </span>
                  </label>
                  <TimePicker id={`endTimePicker`} refs={`endTimePicker`} value={endTime} onChange={(e) => handleEndTimeChange(e)} />
                  <ErrorLabel content={errorOnEndTime} />
                </div>
              </div>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <div className='form-group'>
                <label>{translate('manage_warehouse.stock_management.description')}</label>
                <textarea type='text' className='form-control' value={description} onChange={handleDescriptionChange} />
              </div>
              {currentDepartment && currentDepartment.managers && (
                <React.Fragment>
                  <fieldset className='scheduler-border'>
                    <legend className='scheduler-border'>{translate('manage_warehouse.stock_management.list_roles')}</legend>
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
                </React.Fragment>
              )}
              <fieldset className='scheduler-border'>
                <legend className='scheduler-border'>{translate('manage_warehouse.stock_management.management_location')}</legend>

                <div className={`form-group ${!errorOnRole ? '' : 'has-error'}`}>
                  <label>{translate('manage_warehouse.stock_management.role')}</label>
                  <SelectBox
                    id={`select-role-by-stock-create`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    value={role.role ? role.role._id : { value: '', text: translate('manage_warehouse.stock_management.choose_role') }}
                    items={listRoles}
                    onChange={handleRoleChange}
                    multiple={false}
                  />
                  <ErrorLabel content={errorOnRole} />
                </div>
                <div className={`form-group ${!errorOnManagementGood ? '' : 'has-error'}`}>
                  <label>
                    {translate('manage_warehouse.stock_management.management_good')}
                    <span className='text-red'> * </span>
                  </label>
                  <SelectBox
                    id={`select-management-good-stock-create`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    value={role.managementGood ? role.managementGood : ''}
                    items={[
                      { value: 'product', text: translate('manage_warehouse.stock_management.product') },
                      { value: 'material', text: translate('manage_warehouse.stock_management.material') },
                      { value: 'equipment', text: translate('manage_warehouse.stock_management.equipment') },
                      { value: 'waste', text: translate('manage_warehouse.stock_management.waste') }
                    ]}
                    onChange={handleManagementGoodChange}
                    multiple={true}
                  />
                  <ErrorLabel content={errorOnManagementGood} />
                </div>

                <div className='pull-right' style={{ marginBottom: '10px' }}>
                  {state.editInfoRole ? (
                    <React.Fragment>
                      <button className='btn btn-success' onClick={handleCancelEditRole} style={{ marginLeft: '10px' }}>
                        {translate('task_template.cancel_editing')}
                      </button>
                      <button
                        className='btn btn-success'
                        disabled={!isRolesValidated()}
                        onClick={handleSaveEditRole}
                        style={{ marginLeft: '10px' }}
                      >
                        {translate('task_template.save')}
                      </button>
                    </React.Fragment>
                  ) : (
                    <button
                      className='btn btn-success'
                      style={{ marginLeft: '10px' }}
                      disabled={!isRolesValidated()}
                      onClick={handleAddRole}
                    >
                      {translate('task_template.add')}
                    </button>
                  )}
                  <button className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={handleClearRole}>
                    {translate('task_template.delete')}
                  </button>
                </div>

                <table className='table table-bordered'>
                  <thead>
                    <tr>
                      <th title={translate('manage_warehouse.stock_management.index')}>
                        {translate('manage_warehouse.stock_management.index')}
                      </th>
                      <th title={translate('manage_warehouse.stock_management.role')}>
                        {translate('manage_warehouse.stock_management.role')}
                      </th>
                      <th title={translate('manage_warehouse.stock_management.management_good')}>
                        {translate('manage_warehouse.stock_management.management_good')}
                      </th>
                      <th>{translate('task_template.action')}</th>
                    </tr>
                  </thead>
                  <tbody id={`good-manage-location-by-stock`}>
                    {typeof managementLocation === 'undefined' || managementLocation.length === 0 ? (
                      <tr>
                        <td colSpan={4}>
                          <center>{translate('task_template.no_data')}</center>
                        </td>
                      </tr>
                    ) : (
                      managementLocation.map((x, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{x.role.name}</td>
                          <td>
                            {x.managementGood
                              ? x.managementGood.map((item, key) => {
                                  return <p key={key}>{translate(`manage_warehouse.stock_management.${item}`)}</p>
                                })
                              : ''}
                          </td>
                          <td>
                            <a href='#abc' className='edit' title={translate('general.edit')} onClick={() => handleEditRole(x, index)}>
                              <i className='material-icons'></i>
                            </a>
                            <a href='#abc' className='delete' title={translate('general.delete')} onClick={() => handleDeleteRole(index)}>
                              <i className='material-icons'></i>
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </fieldset>
              <fieldset className='scheduler-border'>
                <legend className='scheduler-border'>{translate('manage_warehouse.stock_management.goods')}</legend>

                <div className={`form-group ${!errorOnGood ? '' : 'has-error'}`}>
                  <label>{translate('manage_warehouse.good_management.good')}</label>
                  <SelectBox
                    id={`select-good-by-stock-create`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    value={good.good ? good.good._id : { value: '', text: translate('manage_warehouse.stock_management.choose_good') }}
                    items={listGoods}
                    onChange={handleGoodChange}
                    multiple={false}
                  />
                  <ErrorLabel content={errorOnGood} />
                </div>

                <div className={`form-group ${!errorOnMinQuantity ? '' : 'has-error'}`}>
                  <label className='control-label'>{translate('manage_warehouse.stock_management.min_quantity')}</label>
                  <div>
                    <input
                      type='number'
                      className='form-control'
                      placeholder={translate('manage_warehouse.stock_management.min_quantity')}
                      value={good.minQuantity}
                      onChange={handleMinQuantityChange}
                    />
                  </div>
                  <ErrorLabel content={errorOnMinQuantity} />
                </div>
                <div className={`form-group ${!errorOnMaxQuantity ? '' : 'has-error'}`}>
                  <label className='control-label'>{translate('manage_warehouse.stock_management.max_quantity')}</label>
                  <div>
                    <input
                      type='number'
                      className='form-control'
                      placeholder={translate('manage_warehouse.stock_management.max_quantity')}
                      value={good.maxQuantity}
                      onChange={handleMaxQuantityChange}
                    />
                  </div>
                  <ErrorLabel content={errorOnMaxQuantity} />
                </div>

                <div className='pull-right' style={{ marginBottom: '10px' }}>
                  {state.editInfo ? (
                    <React.Fragment>
                      <button className='btn btn-success' onClick={handleCancelEditGood} style={{ marginLeft: '10px' }}>
                        {translate('task_template.cancel_editing')}
                      </button>
                      <button
                        className='btn btn-success'
                        disabled={!isGoodsValidated()}
                        onClick={handleSaveEditGood}
                        style={{ marginLeft: '10px' }}
                      >
                        {translate('task_template.save')}
                      </button>
                    </React.Fragment>
                  ) : (
                    <button
                      className='btn btn-success'
                      style={{ marginLeft: '10px' }}
                      disabled={!isGoodsValidated()}
                      onClick={handleAddGood}
                    >
                      {translate('task_template.add')}
                    </button>
                  )}
                  <button className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={handleClearGood}>
                    {translate('task_template.delete')}
                  </button>
                </div>

                <table className='table table-bordered'>
                  <thead>
                    <tr>
                      <th title={translate('manage_warehouse.stock_management.good')}>
                        {translate('manage_warehouse.stock_management.good')}
                      </th>
                      <th title={translate('manage_warehouse.stock_management.min_quantity')}>
                        {translate('manage_warehouse.stock_management.min_quantity')}
                      </th>
                      <th title={translate('manage_warehouse.stock_management.max_quantity')}>
                        {translate('manage_warehouse.stock_management.max_quantity')}
                      </th>
                      <th>{translate('task_template.action')}</th>
                    </tr>
                  </thead>
                  <tbody id={`good-manage-by-stock`}>
                    {typeof goods === 'undefined' || goods.length === 0 ? (
                      <tr>
                        <td colSpan={4}>
                          <center>{translate('task_template.no_data')}</center>
                        </td>
                      </tr>
                    ) : (
                      goods.map((x, index) => (
                        <tr key={index}>
                          <td>{x.good.name}</td>
                          <td>{x.minQuantity}</td>
                          <td>{x.maxQuantity}</td>
                          <td>
                            <a href='#abc' className='edit' title={translate('general.edit')} onClick={() => handleEditGood(x, index)}>
                              <i className='material-icons'></i>
                            </a>
                            <a href='#abc' className='delete' title={translate('general.delete')} onClick={() => handleDeleteGood(index)}>
                              <i className='material-icons'></i>
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </fieldset>
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { stocks, department, role, goods, auth } = state
  return { stocks, department, role, goods, auth }
}

const mapDispatchToProps = {
  createStock: StockActions.createStock
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(StockCreateForm))
