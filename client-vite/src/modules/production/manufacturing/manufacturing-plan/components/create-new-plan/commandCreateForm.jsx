import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { ErrorLabel, SelectBox } from '../../../../../../common-components'
import { generateCode } from '../../../../../../helpers/generateCode'
import { manufacturingRoutingActions } from '../../../manufacturing-routing/redux/actions'

const CommandCreateForm = (props) => {
  const EMPTY_COMMAND = {
    code: props.commandCode,
    goodId: '1',
    good: '',
    inventory: '',
    baseUnit: '',
    quantity: '',
    approvers: [],
    routingId: '1',
    routing: '',
    workOrders: [],
    accountables: [],
    qualityControlStaffs: [],
    description: ''
  }
  const { translate, listGoods, manufacturingCommands, manufacturingRouting } = props

  const [command, setCommand] = useState({ ...EMPTY_COMMAND })
  const [listCommands, setListCommands] = useState(props.manufacturingCommands ? props.manufacturingCommands : [])
  const [listRemainingGoods, setListRemainingGoods] = useState([])
  const [errorGood, setErrorGood] = useState('')
  const [errorQualityControlStaffs, setErrorQualityControlStaffs] = useState()
  const [errorApprovers, setErrorApprovers] = useState('')
  const [errorAccountables, setErrorAccountables] = useState('')
  const [errorQuantity, setErrorQuantity] = useState('')
  const [errorRouting, setErrorRouting] = useState('')
  const [editCommand, setEditCommand] = useState(false)
  const [indexEditting, setIndexEditting] = useState('')

  useEffect(() => {
    setListRemainingGoods(getRemainingQuantityOfGood(props.manufacturingCommands))
  }, [])

  // Hàm lấy ra số lượng còn lại chưa lên lệnh từ listRemaninggoods
  const getRemainingQuantityFromGoodId = (id) => {
    let result = ''
    listRemainingGoods.map((x) => {
      if (x.good._id === id) {
        result = x.remainingQuantity
      }
    })
    return result
  }

  const getAllGoodArr = () => {
    const { listGoods, translate } = props
    let goodArr = [
      {
        value: '1',
        text: translate('manufacturing.plan.choose_good')
      }
    ]
    listGoods.map((x) => {
      goodArr.push({
        value: x.good._id,
        text: x.good.code + ' - ' + x.good.name
      })
    })
    return goodArr
  }

  const handleGoodChange = async (value) => {
    const goodId = value[0]
    await props.getAllManufacturingRoutingsByGood(goodId)
    validateGoodChange(goodId, true)
  }

  const validateGoodChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (value === '1') {
      msg = translate('manufacturing.plan.error_good')
    }

    if (willUpdateState) {
      const newCommand = command
      newCommand.goodId = value
      const { listGoods } = props
      let goodArrFilter = listGoods.filter((x) => x.good._id === command.goodId)
      if (goodArrFilter.length) {
        newCommand.baseUnit = goodArrFilter[0].good.baseUnit
        newCommand.good = goodArrFilter[0].good
        newCommand.inventory = goodArrFilter[0].inventory
      } else {
        newCommand.good = ''
        newCommand.baseUnit = ''
        newCommand.inventory = ''
      }
      setCommand({ ...newCommand })
      setErrorGood(msg)
    }
    return msg
  }

  const getAllRoutingArr = () => {
    let routingArr = [
      {
        value: '1',
        text: translate('manufacturing.plan.choose_routing')
      }
    ]
    manufacturingRouting.listRoutings?.map((x) => {
      routingArr.push({
        value: x._id,
        text: x.name
      })
    })
    return routingArr
  }

  const handleRoutingChange = (value) => {
    const routingId = value[0]
    validateRoutingChange(routingId, true)
  }
  const validateRoutingChange = (value, willUpdateState = true) => {  
    let msg = undefined
    if (value === "1") {
      msg = translate('manufacturing.plan.error_routing')
    }
    if (willUpdateState) {
      const selectedRouting = manufacturingRouting
        .listRoutings.filter((x) => x._id === value)
      setErrorRouting(msg)
      setCommand({ 
        ...command, 
        routingId: value,
        routing: selectedRouting[0], 
      })
    }

    return msg
  }

  const getUserArray = () => {
    const { user } = props
    const { usercompanys } = user
    let userArray = []
    if (usercompanys) {
      usercompanys.map((user) => {
        userArray.push({
          value: user._id,
          text: user.name + ' - ' + user.email
        })
      })
    }
    return userArray
  }

  const handleQuanlityControlStaffsChange = (value) => {
    if (value.length === 0) {
      value = undefined
    }
    validateQualityControlStaffsChange(value, true)
  }

  const validateQualityControlStaffsChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value || !value.length) {
      msg = translate('manufacturing.plan.choose_quality_control_staffs')
    }
    if (willUpdateState) {
      const newCommand = command
      newCommand.qualityControlStaffs = value
      setCommand({ ...newCommand })
      setErrorQualityControlStaffs(msg)
    }

    return msg
  }

  const handleApproversChange = (value) => {
    if (value.length === 0) {
      value = undefined
    }
    validateApproversChange(value, true)
  }

  const validateApproversChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value || !value.length) {
      msg = translate('manufacturing.plan.choose_approvers')
    }
    if (willUpdateState) {
      const newCommand = command
      newCommand.approvers = value
      setCommand({ ...newCommand })
      setErrorApprovers(msg)
    }

    return msg
  }

  const handleAccountablesChange = (value) => {
    if (value.length === 0) {
      value = undefined
    }
    validateAccountablesChange(value, true)
  }

  const validateAccountablesChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value || !value.length) {
      msg = translate('manufacturing.plan.choose_accountables')
    }
    if (willUpdateState) {
      const newCommand = command
      newCommand.accountables = value
      setCommand({ ...newCommand })
      setErrorAccountables(msg)
    }

    return msg
  }

  const handleDescriptionChange = (e) => {
    const { value } = e.target
    const newCommand = command
    newCommand.description = value
    setCommand({ ...newCommand })
  }

  const handleQuantityChange = (e) => {
    const { value } = e.target
    validateQuantityChange(value, true)
  }

  const validateQuantityChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (value === '') {
      msg = translate('manufacturing.plan.error_quantity')
    }
    if (value < 1) {
      msg = translate('manufacturing.plan.error_quantity_input')
    }
    if (command.goodId !== '1') {
      const remainingQuantity = getRemainingQuantityFromGoodId(command.goodId)
      if (value > remainingQuantity) {
        msg = translate('manufacturing.plan.error_quantity_input_remaining')
      }
    } else {
      msg = translate('manufacturing.plan.error_quantity_input_good')
    }
    if (willUpdateState) {
      const newCommand = command
      newCommand.quantity = value
      setCommand({ ...newCommand })
      setErrorQuantity(msg)
    }
    return msg
  }

  const validateCommand = () => {
    if (
      validateGoodChange(command.goodId, false) ||
      validateQuantityChange(command.quantity, false) ||
      validateQualityControlStaffsChange(command.qualityControlStaffs, false) ||
      validateApproversChange(command.approvers, false) ||
      validateAccountablesChange(command.accountables, false) ||
      validateRoutingChange(command.routingId, false)
    ) {
      return false
    }
    return true
  }

  const handleClearCommand = (e) => {
    e.preventDefault()
    setCommand({ ...EMPTY_COMMAND })
  }

  const handleAddCommand = async (e) => {
    e.preventDefault()
    
    const newCommand = command
    newCommand.code = generateCode('LSX')
    
    setListCommands([...listCommands, newCommand])
    props.onChangeListCommands([...listCommands, newCommand])
    setCommand({...EMPTY_COMMAND})
    calculateRemainingQuantityGood([...listCommands, newCommand])
  }

  const handleEditCommand = async (command, index) => {
    setCommand({ ...command })
    setEditCommand(true)
    setIndexEditting(index)
    calculateRemainingQuantityGood()
  }

  const handleCancelEditCommand = async (e) => {
    e.preventDefault()
    setCommand({ ...EMPTY_COMMAND })
    setEditCommand(false)
    calculateRemainingQuantityGood()
  }

  const handleSaveEditCommand = async (e) => {
    e.preventDefault()
    const newListCommands = listCommands
    newListCommands[indexEditting] = command
    setCommand({ ...EMPTY_COMMAND })
    setListCommands([...newListCommands])
    setEditCommand(false)

    props.onChangeListCommands(listCommands)
    calculateRemainingQuantityGood()
  }

  const handleDeleteCommand = async (command, index) => {
    let newListCommands = [...listCommands]
    newListCommands.splice(index, 1)

    setCommand({ ...EMPTY_COMMAND })
    setListCommands({ ...newListCommands })

    props.onChangeListCommands(newListCommands)
    calculateRemainingQuantityGood()
  }

  // Hàm findIndex để tìm xem goodId command hiện tại thuộc phần tử nào của listGoods
  const findIndex = (array, id) => {
    let result = -1
    array.map((x, index) => {
      if (x.good._id === id) {
        result = index
      }
    })
    return result
  }
  // Hàm này sẽ sinh ra listRemainingGoods và tính số lượng trong listRemainingGoods cho hợp lý
  const getRemainingQuantityOfGood = (prevListManufacturingCommands) => {
    const newListRemainingGoods = []
    const { listGoods } = props
    if (prevListManufacturingCommands.length) {
      let listCopyGoods = []
      listGoods.map((x) => {
        listCopyGoods.push({ ...x })
      })
      prevListManufacturingCommands.map((x) => {
        listCopyGoods[findIndex(listCopyGoods, x.goodId)].quantity -= Number(x.quantity)
      })
      if (editCommand) {
        let command = prevListManufacturingCommands[indexEditting]
        listCopyGoods[findIndex(listCopyGoods, command.goodId)].quantity += Number(command.quantity)
      }
      
      listCopyGoods.map((x) => {
        newListRemainingGoods.push({
          good: x.good,
          remainingQuantity: x.quantity
        })
      })
    } else {
      listGoods.map((x) => {
        newListRemainingGoods.push({
          good: x.good,
          remainingQuantity: x.quantity
        })
      })
    }
    return newListRemainingGoods
  }

  const calculateRemainingQuantityGood = (prevListManufacturingCommands) => {
    const newListRemainingGoods = getRemainingQuantityOfGood(prevListManufacturingCommands)
    props.onListRemainingGoodsChange(newListRemainingGoods)
    setListRemainingGoods([...newListRemainingGoods])
  }

  const isValidateDivideCommandStep = () => {
    const { manufacturingCommands } = props
    if (manufacturingCommands.length === 0) {
      return false
    } else {
      for (let i = 0; i < listRemainingGoods.length; i++) {
        if (listRemainingGoods[i].remainingQuantity > 0) {
          return false
        }
      }
      return true
    }
  }
  
  return (
    <React.Fragment>
      <div className='row'>
        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
          <fieldset className='scheduler-border'>
            <legend className='scheduler-border'>{translate('manufacturing.plan.manufacturing_good_info')}</legend>
            <table className='table'>
              <thead>
                <tr>
                  <th>{translate('manufacturing.plan.index')}</th>
                  <th>{translate('manufacturing.plan.good_code')}</th>
                  <th>{translate('manufacturing.plan.good_name')}</th>
                  <th>{translate('manufacturing.plan.base_unit')}</th>
                  <th>{translate('manufacturing.plan.quantity_good_inventory')}</th>
                  <th>{translate('manufacturing.plan.quantity')}</th>
                  <th>{translate('manufacturing.plan.quantity_need_planned')}</th>
                </tr>
              </thead>
              <tbody>
                {listGoods &&
                  listGoods.length &&
                  listGoods.map((x, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{x.good.code}</td>
                      <td>{x.good.name}</td>
                      <td>{x.good.baseUnit}</td>
                      <td>{x.inventory}</td>
                      <td>{x.quantity}</td>
                      <td>{getRemainingQuantityFromGoodId(x.good._id)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </fieldset>
        </div>
      </div>
      {/* <div className='row'>
        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
          <MillProductivity listGoods={listGoods} />
        </div>
      </div> */}
      <div className='row'>
        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
          <fieldset className='scheduler-border'>
            <legend className='scheduler-border'>{translate('manufacturing.plan.divide_command')}</legend>
            <div className='row'>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className={`form-group`}>
                  <label>{translate('manufacturing.plan.command_code')}</label>
                  <input type='text' value={command.code} disabled={true} className='form-control' />
                </div>
              </div>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className={`form-group ${!errorGood ? '' : 'has-error'}`}>
                  <label>
                    {translate('manufacturing.plan.choose_good')}
                    <span className='attention'> * </span>
                  </label>
                  <SelectBox
                    id={`select-good-of-command`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    value={command.goodId}
                    items={getAllGoodArr()}
                    onChange={handleGoodChange}
                    multiple={false}
                  />
                  <ErrorLabel content={errorGood} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className={`form-group`}>
                  <label>{translate('manufacturing.plan.base_unit')}</label>
                  <input type='text' value={command.baseUnit} disabled={true} className='form-control' />
                </div>
              </div>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className={`form-group`}>
                  <label>{translate('manufacturing.plan.quantity_good_inventory')}</label>
                  <input type='number' value={command.inventory} disabled={true} className='form-control' />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className={`form-group`}>
                  <label>{translate('manufacturing.plan.quantity_need_planned')}</label>
                  <input type='number' value={getRemainingQuantityFromGoodId(command.goodId)} disabled={true} className='form-control' />
                </div>
              </div>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className={`form-group ${!errorQuantity ? '' : 'has-error'}`}>
                  <label>
                    {translate('manufacturing.plan.command_quantity')}
                    <span className='attention'> * </span>
                  </label>
                  <input type='number' value={command.quantity} onChange={handleQuantityChange} className='form-control' />
                  <ErrorLabel content={errorQuantity} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className={`form-group ${!errorApprovers ? '' : 'has-error'}`}>
                  <label>
                    {translate('manufacturing.command.approvers')}
                    <span className='attention'> * </span>
                  </label>
                  <a style={{ cursor: 'pointer' }} title={translate('manufacturing.command.approver_description')}>
                    <i className='fa fa-question-circle' style={{ marginLeft: 5 }} />
                  </a>
                  <SelectBox
                    id={`select-approvers-command-create`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    value={command.approvers}
                    items={getUserArray()}
                    onChange={handleApproversChange}
                    disabled={false}
                    multiple={true}
                  />
                  <ErrorLabel content={errorApprovers} />
                </div>
                <div className={`form-group ${!errorQualityControlStaffs ? '' : 'has-error'}`}>
                  <label>
                    {translate('manufacturing.plan.qualityControlStaffs')}
                    <span className='attention'> * </span>
                  </label>
                  <SelectBox
                    id={`select-quality-control-staffs-command-create`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    value={command.qualityControlStaffs}
                    items={getUserArray()}
                    onChange={handleQuanlityControlStaffsChange}
                    multiple={true}
                  />
                  <ErrorLabel content={errorQualityControlStaffs} />
                </div>
              </div>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className={`form-group ${!errorAccountables ? '' : 'has-error'}`}>
                  <label>
                    {translate('manufacturing.plan.accountables')}
                    <span className='attention'> * </span>
                  </label>
                  <a style={{ cursor: 'pointer' }} title={translate('manufacturing.plan.accountable_description')}>
                    <i className='fa fa-question-circle' style={{ marginLeft: 5 }} />
                  </a>
                  <SelectBox
                    id={`select-accoutables-command-create`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    value={command.accountables}
                    items={getUserArray()}
                    onChange={handleAccountablesChange}
                    disabled={false}
                    multiple={true}
                  />
                  <ErrorLabel content={errorAccountables} />
                </div>
                <div className={`form-group ${!errorRouting ? '' : 'has-error'}`}>
                  <label>
                    {translate('manufacturing.plan.routing')}
                    <span className='attention'> * </span>
                  </label>
                  <a style={{ cursor: 'pointer' }} title={translate('manufacturing.plan.routing_description')}>
                    <i className='fa fa-question-circle' style={{ marginLeft: 5 }} />
                  </a>
                  <SelectBox
                    id={`select-routing-command-create`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    value={command.routingId}
                    items={getAllRoutingArr()}
                    onChange={handleRoutingChange}
                    disabled={false}
                    multiple={false}
                  />
                  <ErrorLabel content={errorRouting} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                <div className='form-group'>
                  <label>{translate('manufacturing.plan.description')}</label>
                  <textarea type='text' className='form-control' value={command.description} onChange={handleDescriptionChange} />
                </div>
              </div>
            </div>
            <div className='pull-right' style={{ marginBottom: '10px' }}>
              {editCommand ? (
                <React.Fragment>
                  <button className='btn btn-success' onClick={handleCancelEditCommand} style={{ marginLeft: '10px' }}>
                    {translate('manufacturing.purchasing_request.cancel_editing_good')}
                  </button>
                  <button
                    className='btn btn-success'
                    onClick={handleSaveEditCommand}
                    disabled={!validateCommand()}
                    style={{ marginLeft: '10px' }}
                  >
                    {translate('manufacturing.purchasing_request.save_good')}
                  </button>
                </React.Fragment>
              ) : (
                <button className='btn btn-success' style={{ marginLeft: '10px' }} disabled={!validateCommand()} onClick={handleAddCommand}>
                  {translate('manufacturing.purchasing_request.add_good')}
                </button>
              )}
              <button className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={handleClearCommand}>
                {translate('manufacturing.purchasing_request.delete_good')}
              </button>
            </div>
          </fieldset>
          <table className='table table-striped'>
            <thead>
              <tr>
                <th>{translate('manufacturing.plan.index')}</th>
                <th>{translate('manufacturing.plan.command_code')}</th>
                <th>{translate('manufacturing.plan.good_code')}</th>
                <th>{translate('manufacturing.plan.good_name')}</th>
                <th>{translate('manufacturing.plan.base_unit')}</th>
                <th>{translate('manufacturing.plan.quantity')}</th>
                <th>{translate('table.action')}</th>
              </tr>
            </thead>
            <tbody>
              {manufacturingCommands && manufacturingCommands.length === 0 ? (
                <tr>
                  <td colSpan={7}>{translate('general.no_data')}</td>
                </tr>
              ) : (
                manufacturingCommands.map((command, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{command.code}</td>
                    <td>{command.good.code}</td>
                    <td>{command.good.name}</td>
                    <td>{command.good.baseUnit}</td>
                    <td>{command.quantity}</td>
                    <td>
                      <a href='#abc' className='edit' title={translate('general.edit')} onClick={() => handleEditCommand(command, index)}>
                        <i className='material-icons'></i>
                      </a>
                      <a
                        href='#abc'
                        className='delete'
                        title={translate('general.delete')}
                        onClick={() => handleDeleteCommand(command, index)}
                      >
                        <i className='material-icons'></i>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
          {!isValidateDivideCommandStep() && (
            <div className='pull-left form-group has-error' style={{ marginBottom: '10px' }}>
              <label>
                {translate('manufacturing.plan.created_all_command')}
                <span className='attention'> * </span>
              </label>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { manufacturingPlan, auth, user, manufacturingRouting } = state
  return { manufacturingPlan, auth, user, manufacturingRouting }
}

const mapDispatchToProps = {
  getAllManufacturingRoutingsByGood: manufacturingRoutingActions.getAllManufacturingRoutingsByGood
}


export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CommandCreateForm))
