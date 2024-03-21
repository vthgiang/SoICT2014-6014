import React, { Component } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { ErrorLabel, SelectBox } from '../../../../../../common-components'
import { generateCode } from '../../../../../../helpers/generateCode'
import MillProductivity from '../plan-component/millProductivity'
class CommandCreateForm extends Component {
  constructor(props) {
    super(props)
    this.EMPTY_COMMAND = {
      code: this.props.commandCode,
      goodId: '1',
      good: '',
      inventory: '',
      baseUnit: '',
      quantity: '',
      approvers: [],
      accountables: [],
      qualityControlStaffs: [],
      description: ''
    }
    this.state = {
      command: Object.assign({}, this.EMPTY_COMMAND),
      listCommands: this.props.manufacturingCommands ? this.props.manufacturingCommands : [],
      listRemainingGoods: this.getRemainingQuantityOfGood()
    }
  }

  // Hàm lấy ra số lượng còn lại chưa lên lệnh từ listRemaninggoods
  getRemainingQuantityFromGoodId = (id) => {
    let result = ''
    const { listRemainingGoods } = this.state
    listRemainingGoods.map((x) => {
      if (x.good._id === id) {
        result = x.remainingQuantity
      }
    })
    return result
  }

  getAllGoodArr = () => {
    const { listGoods, translate } = this.props
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

  handleGoodChange = (value) => {
    const goodId = value[0]
    this.validateGoodChange(goodId, true)
  }

  validateGoodChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = this.props
    if (value === '1') {
      msg = translate('manufacturing.plan.error_good')
    }

    if (willUpdateState) {
      let { command } = this.state
      command.goodId = value
      const { listGoods } = this.props
      let goodArrFilter = listGoods.filter((x) => x.good._id === command.goodId)
      if (goodArrFilter.length) {
        command.baseUnit = goodArrFilter[0].good.baseUnit
        command.good = goodArrFilter[0].good
        command.inventory = goodArrFilter[0].inventory
      } else {
        command.good = ''
        command.baseUnit = ''
        command.inventory = ''
      }
      this.setState((state) => ({
        ...state,
        command: { ...command },
        errorGood: msg
      }))
    }
    return msg
  }

  // getListApproversArr = () => {
  //     const { manufacturingPlan } = this.props;
  //     let listUsersArr = [];
  //     const { listApprovers } = manufacturingPlan;
  //     if (listApprovers) {
  //         listApprovers.map(approver => {
  //             listUsersArr.push({
  //                 value: approver._id,
  //                 text: approver.userId.name + " - " + approver.userId.email
  //             })
  //         })
  //     }

  //     return listUsersArr;
  // }

  // getListAccoutablesArr = () => {
  //     const { auth } = this.props;
  //     let accountablesArr = [];
  //     accountablesArr.push({
  //         value: auth.user._id,
  //         text: auth.user.name + " - " + auth.user.email
  //     });
  //     return accountablesArr;
  // }

  getUserArray = () => {
    const { user } = this.props
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

  handleQuanlityControlStaffsChange = (value) => {
    if (value.length === 0) {
      value = undefined
    }
    this.validateQualityControlStaffsChange(value, true)
  }

  validateQualityControlStaffsChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = this.props
    if (!value || !value.length) {
      msg = translate('manufacturing.plan.choose_quality_control_staffs')
    }
    if (willUpdateState) {
      const { command } = this.state
      command.qualityControlStaffs = value
      this.setState((state) => ({
        ...state,
        command: { ...command },
        errorQualityControlStaffs: msg
      }))
    }

    return msg
  }

  handleApproversChange = (value) => {
    if (value.length === 0) {
      value = undefined
    }
    this.validateApproversChange(value, true)
  }

  validateApproversChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = this.props
    if (!value || !value.length) {
      msg = translate('manufacturing.plan.choose_approvers')
    }
    if (willUpdateState) {
      const { command } = this.state
      command.approvers = value
      this.setState((state) => ({
        ...state,
        command: { ...command },
        errorApprovers: msg
      }))
    }

    return msg
  }

  handleAccountablesChange = (value) => {
    if (value.length === 0) {
      value = undefined
    }
    this.validateAccountablesChange(value, true)
  }

  validateAccountablesChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = this.props
    if (!value || !value.length) {
      msg = translate('manufacturing.plan.choose_accountables')
    }
    if (willUpdateState) {
      const { command } = this.state
      command.accountables = value
      this.setState((state) => ({
        ...state,
        command: { ...command },
        errorAccountables: msg
      }))
    }

    return msg
  }

  handleDescriptionChange = (e) => {
    const { value } = e.target
    const { command } = this.state
    command.description = value
    this.setState((state) => ({
      ...state,
      command: { ...command }
    }))
  }

  handleQuantityChange = (e) => {
    const { value } = e.target
    this.validateQuantityChange(value, true)
  }

  validateQuantityChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = this.props
    if (value === '') {
      msg = translate('manufacturing.plan.error_quantity')
    }
    if (value < 1) {
      msg = translate('manufacturing.plan.error_quantity_input')
    }
    const { command } = this.state
    if (command.goodId !== '1') {
      const remainingQuantity = this.getRemainingQuantityFromGoodId(command.goodId)
      if (value > remainingQuantity) {
        msg = translate('manufacturing.plan.error_quantity_input_remaining')
      }
    } else {
      msg = translate('manufacturing.plan.error_quantity_input_good')
    }
    if (willUpdateState) {
      let { command } = this.state
      command.quantity = value
      this.setState((state) => ({
        ...state,
        command: { ...command },
        errorQuantity: msg
      }))
    }
    return msg
  }

  validateCommand = () => {
    if (
      this.validateGoodChange(this.state.command.goodId, false) ||
      this.validateQuantityChange(this.state.command.quantity, false) ||
      this.validateQualityControlStaffsChange(this.state.command.qualityControlStaffs, false) ||
      this.validateApproversChange(this.state.command.approvers, false) ||
      this.validateAccountablesChange(this.state.command.accountables, false)
    ) {
      return false
    }
    return true
  }

  handleClearCommand = (e) => {
    e.preventDefault()
    this.setState((state) => ({
      ...state,
      command: Object.assign({}, this.EMPTY_COMMAND)
    }))
  }

  handleAddCommand = async (e) => {
    e.preventDefault()
    const { command, listCommands } = this.state
    command.code = generateCode('LSX')
    await this.setState((state) => ({
      ...state,
      listCommands: [...listCommands, command],
      command: Object.assign({}, this.EMPTY_COMMAND)
    }))

    this.props.onChangeListCommands(this.state.listCommands)
    this.calculateRemainingQuantityGood()
  }

  handleEditCommand = async (command, index) => {
    await this.setState((state) => ({
      ...state,
      command: { ...command },
      editCommand: true,
      indexEditting: index
    }))
    this.calculateRemainingQuantityGood()
  }

  handleCancelEditCommand = async (e) => {
    e.preventDefault()
    await this.setState((state) => ({
      ...state,
      command: Object.assign({}, this.EMPTY_COMMAND),
      editCommand: false
    }))
    this.calculateRemainingQuantityGood()
  }

  handleSaveEditCommand = async (e) => {
    e.preventDefault()
    const { command, listCommands, indexEditting } = this.state

    listCommands[indexEditting] = command
    await this.setState((state) => ({
      ...state,
      command: Object.assign({}, this.EMPTY_COMMAND),
      listCommands: [...listCommands],
      editCommand: false
    }))

    this.props.onChangeListCommands(this.state.listCommands)
    this.calculateRemainingQuantityGood()
  }

  handleDeleteCommand = async (command, index) => {
    let { listCommands } = this.state
    listCommands.splice(index, 1)
    await this.setState((state) => ({
      ...state,
      editCommand: false,
      command: Object.assign({}, this.EMPTY_COMMAND),
      listCommands: [...listCommands]
    }))
    this.props.onChangeListCommands(this.state.listCommands)
    this.calculateRemainingQuantityGood()
  }

  // Hàm findIndex để tìm xem goodId command hiện tại thuộc phần tử nào của listGoods
  findIndex = (array, id) => {
    let result = -1
    array.map((x, index) => {
      if (x.good._id === id) {
        result = index
      }
    })
    return result
  }
  // Hàm này sẽ sinh ra listRemainingGoods và tính số lượng trong listRemainingGoods cho hợp lý
  getRemainingQuantityOfGood = () => {
    // Tính số lượng trong command
    const listRemainingGoods = []
    const { manufacturingCommands, listGoods } = this.props
    if (manufacturingCommands.length) {
      // Nếu mà trước đó đã có lệnh thì phải lấy listGoods trừ đi list commands
      // Sao chép listGoods ra mảng với để tính toán
      let listCopyGoods = []
      listGoods.map((x) => {
        listCopyGoods.push({ ...x })
      })
      manufacturingCommands.map((x) => {
        listCopyGoods[this.findIndex(listCopyGoods, x.goodId)].quantity -= Number(x.quantity)
      })
      if (this.state && this.state.editCommand) {
        let command = manufacturingCommands[this.state.indexEditting]
        listCopyGoods[this.findIndex(listCopyGoods, command.goodId)].quantity += Number(command.quantity)
      }
      // Gán mảng sao chép này vào listRemainingGoods
      listCopyGoods.map((x) => {
        listRemainingGoods.push({
          good: x.good,
          remainingQuantity: x.quantity
        })
      })
    } else {
      // Nếu chưa có lệnh nào thì lấy theo listGoods
      listGoods.map((x) => {
        listRemainingGoods.push({
          good: x.good,
          remainingQuantity: x.quantity
        })
      })
    }
    return listRemainingGoods
  }

  calculateRemainingQuantityGood = () => {
    let listRemainingGoods = this.getRemainingQuantityOfGood()
    this.props.onListRemainingGoodsChange(listRemainingGoods)
    this.setState((state) => ({
      ...state,
      listRemainingGoods: [...listRemainingGoods]
    }))
  }

  isValidateDivideCommandStep = () => {
    const { manufacturingCommands } = this.props
    const { listRemainingGoods } = this.state
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

  render() {
    const { translate, listGoods, manufacturingCommands } = this.props
    const { command, errorGood, errorQualityControlStaffs, errorQuantity, errorApprovers, errorAccountables } = this.state
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
                        <td>{this.getRemainingQuantityFromGoodId(x.good._id)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </fieldset>
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
            <MillProductivity listGoods={listGoods} />
          </div>
        </div>
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
                      items={this.getAllGoodArr()}
                      onChange={this.handleGoodChange}
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
                    <input
                      type='number'
                      value={this.getRemainingQuantityFromGoodId(command.goodId)}
                      disabled={true}
                      className='form-control'
                    />
                  </div>
                </div>
                <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                  <div className={`form-group ${!errorQuantity ? '' : 'has-error'}`}>
                    <label>
                      {translate('manufacturing.plan.command_quantity')}
                      <span className='attention'> * </span>
                    </label>
                    <input type='number' value={command.quantity} onChange={this.handleQuantityChange} className='form-control' />
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
                      items={this.getUserArray()}
                      onChange={this.handleApproversChange}
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
                      items={this.getUserArray()}
                      onChange={this.handleQuanlityControlStaffsChange}
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
                      items={this.getUserArray()}
                      onChange={this.handleAccountablesChange}
                      disabled={false}
                      multiple={true}
                    />
                    <ErrorLabel content={errorAccountables} />
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                  <div className='form-group'>
                    <label>{translate('manufacturing.plan.description')}</label>
                    <textarea type='text' className='form-control' value={command.description} onChange={this.handleDescriptionChange} />
                  </div>
                </div>
              </div>
              <div className='pull-right' style={{ marginBottom: '10px' }}>
                {this.state.editCommand ? (
                  <React.Fragment>
                    <button className='btn btn-success' onClick={this.handleCancelEditCommand} style={{ marginLeft: '10px' }}>
                      {translate('manufacturing.purchasing_request.cancel_editing_good')}
                    </button>
                    <button
                      className='btn btn-success'
                      onClick={this.handleSaveEditCommand}
                      disabled={!this.validateCommand()}
                      style={{ marginLeft: '10px' }}
                    >
                      {translate('manufacturing.purchasing_request.save_good')}
                    </button>
                  </React.Fragment>
                ) : (
                  <button
                    className='btn btn-success'
                    style={{ marginLeft: '10px' }}
                    disabled={!this.validateCommand()}
                    onClick={this.handleAddCommand}
                  >
                    {translate('manufacturing.purchasing_request.add_good')}
                  </button>
                )}
                <button className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={this.handleClearCommand}>
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
                        <a
                          href='#abc'
                          className='edit'
                          title={translate('general.edit')}
                          onClick={() => this.handleEditCommand(command, index)}
                        >
                          <i className='material-icons'></i>
                        </a>
                        <a
                          href='#abc'
                          className='delete'
                          title={translate('general.delete')}
                          onClick={() => this.handleDeleteCommand(command, index)}
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
            {!this.isValidateDivideCommandStep() && (
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
}

function mapStateToProps(state) {
  const { manufacturingPlan, auth, user } = state
  return { manufacturingPlan, auth, user }
}

export default connect(mapStateToProps, null)(withTranslate(CommandCreateForm))
