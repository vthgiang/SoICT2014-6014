import React, { Component } from 'react'
import { ButtonModal, DialogModal } from '../../../../../../common-components'
import CommandCreateForm from './commandCreateForm'
import PlanInfoForm from './generalPlanInfoForm'
import ScheduleBooking from './scheduleBooking'
import './planCreate.css'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { generateCode } from '../../../../../../helpers/generateCode'
import { SalesOrderActions } from '../../../../order/sales-order/redux/actions'
import { manufacturingPlanActions } from '../../redux/actions'
import { GoodActions } from '../../../../common-production/good-management/redux/actions'
import { LotActions } from '../../../../warehouse/inventory-management/redux/actions'
import { UserActions } from '../../../../../super-admin/user/redux/actions'
import { compareLtDate, compareLteDate, formatToTimeZoneDate } from '../../../../../../helpers/formatDate'
import { workScheduleActions } from '../../../work-schedule/redux/actions'
import { manufacturingCommand } from '../../../manufacturing-command/redux/reducers'

class NewPlanCreateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0,
      steps: [
        {
          label: this.props.translate('manufacturing.plan.general_info'),
          active: true,
          disabled: false
        },
        {
          label: this.props.translate('manufacturing.plan.command_info'),
          active: false,
          disabled: true
        },
        {
          label: this.props.translate('manufacturing.plan.schedule_info'),
          active: false,
          disabled: true
        }
      ],

      code: '',
      salesOrders: [],
      startDate: '',
      endDate: '',
      description: '',
      goods: [],
      approvers: [],
      manufacturingCommands: [],
      // Danh sách list goods được tổng hợp từ các salesorder
      listGoodsSalesOrders: [],
      // Mảng chưa good, số lượng good chưa được nhập vào lệnh sản xuất
      listRemainingGoods: []
      // Danh sách lịch của xưởng được book trong kế hoạch
    }
  }

  componentDidMount = () => {
    // this.props.getAllSalesOrder({ page: 1, limit: 1000 });
    this.props.getAllUserOfCompany()
    const currentRole = localStorage.getItem('currentRole')
    this.props.getSalesOrdersByManufacturingWorks(currentRole)
    this.props.getAllApproversOfPlan(currentRole)
    this.props.getGoodByManageWorkRole(currentRole)
  }

  setCurrentStep = async (e, step) => {
    e.preventDefault()
    let { steps } = this.state
    steps.map((item, index) => {
      if (index <= step) {
        item.active = true
      } else {
        item.active = false
      }
      return item
    })
    this.setState((state) => {
      return {
        ...state,
        steps: steps,
        step: step
      }
    })
  }

  handleClickCreate = () => {
    this.setState({
      code: generateCode('KHSX')
    })
  }

  handleStartDateChange = async (value) => {
    await this.setState({
      startDate: value
    })
    if (this.state.startDate && this.state.endDate) {
      const { manufacturingMill } = this.props
      const { startDate, endDate } = this.state
      const { listMills } = manufacturingMill
      if (listMills) {
        const listMillIds = listMills.map((x) => x._id)
        const data = {
          startDate: startDate,
          endDate: endDate,
          manufacturingMills: listMillIds
        }
        this.props.getAllWorkSchedulesOfManufacturingWork(data)
      }
    }
  }

  handleEndDateChange = async (value) => {
    await this.setState({
      endDate: value
    })
    if (this.state.startDate && this.state.endDate) {
      const { manufacturingMill } = this.props
      const { startDate, endDate } = this.state
      const { listMills } = manufacturingMill
      if (listMills) {
        const listMillIds = listMills.map((x) => x._id)
        const data = {
          startDate: startDate,
          endDate: endDate,
          manufacturingMills: listMillIds
        }
        this.props.getAllWorkSchedulesOfManufacturingWork(data)
      }
    }
  }

  handleApproversChange = (value) => {
    this.setState({
      approvers: value
    })
  }

  handleDescriptionChange = (value) => {
    this.setState({
      description: value
    })
  }

  handleSalesOrderChange = (value) => {
    this.setState({
      salesOrders: value
    })

    const { listSalesOrdersWorks } = this.props.salesOrders

    let listOrders = []
    if (listSalesOrdersWorks.length) {
      listOrders = listSalesOrdersWorks.filter((x) => value.includes(x._id))
    }
    let goods = []
    // let goodIds = goods.map(x => x.good._id);
    let goodIds = []
    for (let i = 0; i < listOrders.length; i++) {
      listOrders[i].goods.map((x) => {
        if (!goodIds.includes(x.good._id)) {
          goodIds.push(x.good._id)
          goods.push({
            good: x.good,
            quantity: x.quantity
          })
        } else {
          goods[this.findIndex(goods, x.good._id)].quantity += Number(x.quantity)
        }
      })
    }
    if (goodIds.length) {
      this.props.getInventoryByGoodIds({
        array: goodIds
      })
    }
    this.setState({
      listGoodsSalesOrders: [...goods]
    })
  }

  findIndex = (array, id) => {
    let result = -1
    array.map((x, index) => {
      if (x.good._id === id) {
        result = index
      }
    })
    return result
  }

  // Hàm xử lý thêm tất cả các good trong sales orders vào goods
  handleAddAllGood = () => {
    let { goods, listGoodsSalesOrders } = this.state
    let goodIds = goods.map((x) => x.good._id)
    for (let i = 0; i < listGoodsSalesOrders.length; i++) {
      let x = listGoodsSalesOrders[i]
      if (!goodIds.includes(x.good._id)) {
        goodIds.push(x.good._id)
        goods.push({ ...x })
      } else {
        goods[this.findIndex(goods, x.good._id)].quantity = Number(goods[this.findIndex(goods, x.good._id)].quantity)
        goods[this.findIndex(goods, x.good._id)].quantity += Number(x.quantity)
      }
    }
    this.setState({
      goods: [...goods],
      // State đánh dấu đã add tất cả các good của sales order để tạo KH => Không được sửa lại nữa
      addedAllGoods: true,

      // Thay đổi số lượng sản phẩm thì lệnh phải về rỗng
      manufacturingCommands: []
    })
  }

  // getListApproverIds = () => {
  //     const { manufacturingPlan } = this.props;
  //     let approvers = [];
  //     if (manufacturingPlan.listApprovers && manufacturingPlan.isLoading === false) {
  //         approvers = manufacturingPlan.listApprovers.map(x => x._id);
  //     }
  //     return approvers;
  // }

  handleListGoodsChange = (goods) => {
    this.setState({
      goods: goods
    })
  }

  handleAddGood = (good) => {
    const { goods } = this.state
    const goodIds = goods.map((x) => x.good._id)
    if (!goodIds.includes(good.goodId)) {
      const { listGoodsByRole } = this.props.goods
      const goodObject = listGoodsByRole.filter((x) => x._id === good.goodId)[0]
      good.good = goodObject
      goods.push(good)
    } else {
      goods[this.findIndex(goods, good.goodId)].quantity += Number(good.quantity)
    }
    this.setState((state) => ({
      ...state,
      goods: [...goods],
      // Thay đổi phải cho lệnh về rỗng
      manufacturingCommands: []
    }))
  }

  handleSaveEditGood = (good, indexEditting) => {
    // Do good.good cũ truyền sang vẫn của good.good cũ, nên nếu thay đổi tên mặt hàng phải cập nhật lại;
    const { listGoodsByRole } = this.props.goods
    const goodObject = listGoodsByRole.filter((x) => x._id === good.goodId)[0]
    good.good = goodObject

    const { goods } = this.state
    const goodIds = goods.map((x) => x.good._id)
    if (!goodIds.includes(good.goodId)) {
      goods[indexEditting] = good
    } else if (goods[indexEditting].good._id === good.goodId) {
      goods[indexEditting] = good
    } else {
      goods[this.findIndex(goods, good.goodId)].quantity = Number(goods[this.findIndex(goods, good.goodId)].quantity)
      goods[this.findIndex(goods, good.goodId)].quantity += Number(good.quantity)
      goods.splice(indexEditting, 1)
    }
    this.setState((state) => ({
      ...state,
      goods: [...goods],
      // Thay đổi phải cho lệnh về rỗng
      manufacturingCommands: []
    }))
  }

  handleDeleteGood = (index) => {
    const { goods } = this.state
    goods.splice(index, 1)
    this.setState((state) => ({
      ...state,
      goods: [...goods],
      // Thay đổi phải cho lệnh về rỗng
      manufacturingCommands: []
    }))
  }

  // Phần chia lệnh sản xuất

  handleChangeListCommands = (listCommands) => {
    this.setState((state) => ({
      ...state,
      manufacturingCommands: listCommands
    }))
  }

  static getDerivedStateFromProps = (props, state) => {
    if (state.salesOrders.length) {
      const { lots } = props
      const { listInventories } = lots
      const { listGoodsSalesOrders } = state
      if (listInventories) {
        listInventories.map((x, index) => {
          if (listGoodsSalesOrders[index]) {
            listGoodsSalesOrders[index].inventory = x.inventory
          }
        })
      }
      return {
        ...state,
        listGoodsSalesOrders: listGoodsSalesOrders
      }
    }
    return null
  }

  handleRemainingGoodsChange = (listRemainingGoods) => {
    this.setState((state) => ({
      ...state,
      listRemainingGoods: listRemainingGoods
    }))
  }

  // Check xem bước phân chia lệnh đã được validate hay chưa
  checkValidateListRemainingGoods = () => {
    const { listRemainingGoods } = this.state
    if (listRemainingGoods.length === 0) {
      return false
    }
    for (let i = 0; i < listRemainingGoods.length; i++) {
      if (listRemainingGoods[i].remainingQuantity > 0) {
        return false
      }
    }
    return true
  }

  isValidateStep = (index) => {
    if (index == 1) {
      if (
        this.state.goods.length === 0 ||
        this.state.startDate === '' ||
        this.state.endDate === '' ||
        (this.state.startDate && this.state.endDate && !compareLteDate(this.state.startDate, this.state.endDate).status) ||
        this.state.approvers === undefined ||
        (this.state.approvers && this.state.approvers.length === 0)
      ) {
        return false
      }
      return true
    } else if (index == 2) {
      if (
        this.state.goods.length === 0 ||
        this.state.startDate === '' ||
        this.state.endDate === '' ||
        this.state.manufacturingCommands.length === 0 ||
        !this.checkValidateListRemainingGoods()
      ) {
        return false
      }
      return true
    }
  }

  handleManufacturingCommandsChange = (data) => {
    this.setState((state) => ({
      ...state,
      manufacturingCommands: [...data]
    }))
  }

  getListWorkSchedulesOfWorks = () => {
    // Lấy danh sách lịch của xưởng truyền xuống
    const { manufacturingMill, workSchedule } = this.props
    const { listMills } = manufacturingMill
    const listMillIds = listMills.map((x) => x._id)
    var listSchedulesMap = new Map()
    listMillIds.map((x) => {
      let workSchedulesOfMill = workSchedule.listWorkSchedulesOfWorks.filter((y) => y.manufacturingMill === x)
      listSchedulesMap.set(x, workSchedulesOfMill)
    })
    return listSchedulesMap
  }

  handleListWorkSchedulesOfWorksChange = (data) => {
    this.setState({
      listWorkSchedulesOfWorks: data
    })
  }

  isFormValidated = () => {
    const { manufacturingCommands } = this.state
    let result = true
    for (let i = 0; i < manufacturingCommands.length; i++) {
      if (!manufacturingCommands[i].completed) {
        result = false
      }
    }
    return result && manufacturingCommands.length
  }

  handleArryWorkerSchedulesChange = (data) => {
    this.setState((state) => ({
      ...state,
      arrayWorkerSchedules: [...data]
    }))
  }

  save = () => {
    if (this.isFormValidated()) {
      const { listWorkSchedulesOfWorks } = this.state
      let listMillSchedules = []
      for (var value of listWorkSchedulesOfWorks.values()) {
        listMillSchedules = [...listMillSchedules, ...value]
      }
      const data = {
        code: this.state.code,
        salesOrders: this.state.salesOrders,
        startDate: formatToTimeZoneDate(this.state.startDate),
        endDate: formatToTimeZoneDate(this.state.endDate),
        description: this.state.description,
        goods: this.state.goods,
        approvers: this.state.approvers,
        creator: localStorage.getItem('userId'),
        manufacturingCommands: this.state.manufacturingCommands,
        listMillSchedules: listMillSchedules,
        arrayWorkerSchedules: this.state.arrayWorkerSchedules
      }
      this.props.createManufacturingPlan(data)
    }
  }

  checkHasComponent = (name) => {
    let { auth } = this.props
    let result = false
    auth.components.forEach((component) => {
      if (component.name === name) result = true
    })

    return result
  }

  render() {
    const { step, steps } = this.state
    const { translate } = this.props
    const {
      code,
      salesOrders,
      startDate,
      approvers,
      endDate,
      description,
      goods,
      listGoodsSalesOrders,
      addedAllGoods,
      manufacturingCommands
    } = this.state
    return (
      <React.Fragment>
        {this.checkHasComponent('create-manufacturing-plan') && (
          <ButtonModal
            onButtonCallBack={this.handleClickCreate}
            modalID='modal-create-new-plan'
            button_name={translate('manufacturing.plan.create_plan')}
            title={translate('manufacturing.plan.create_plan_title')}
          />
        )}
        <DialogModal
          modalID='modal-create-new-plan'
          isLoading={false}
          formID='form-create-new-plan'
          title={translate('manufacturing.plan.create_plan_title')}
          msg_success={translate('manufacturing.plan.create_successfully')}
          msg_failure={translate('manufacturing.plan.create_failed')}
          func={this.save}
          disableSubmit={!this.isFormValidated()}
          size={100}
          maxWidth={500}
        >
          <form id='form-create-new-plan'>
            <div className='timeline'>
              <div className='timeline-progress' style={{ width: `${(step * 100) / (steps.length - 1)}%` }}></div>
              <div className='timeline-items'>
                {steps.map((item, index) => (
                  <div className={`timeline-item ${item.active ? 'active' : ''}`} key={index}>
                    <div
                      className={`timeline-contain ${!this.isValidateStep(index) && index > 0 ? 'disable-timeline-contain' : ''}`}
                      onClick={(e) => this.setCurrentStep(e, index)}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {step === 0 && (
                <PlanInfoForm
                  code={code}
                  salesOrderIds={salesOrders}
                  startDate={startDate}
                  endDate={endDate}
                  approvers={approvers}
                  description={description}
                  listGoods={goods}
                  listGoodsSalesOrders={listGoodsSalesOrders}
                  addedAllGoods={addedAllGoods}
                  onStartDateChange={this.handleStartDateChange}
                  onEndDateChange={this.handleEndDateChange}
                  onApproversChange={this.handleApproversChange}
                  onDescriptionChange={this.handleDescriptionChange}
                  onSalesOrdersChange={this.handleSalesOrderChange}
                  onListGoodsChange={this.handleListGoodsChange}
                  onAddAllGood={this.handleAddAllGood}
                  onAddGood={this.handleAddGood}
                  onSaveEditGood={this.handleSaveEditGood}
                  onDeleteGood={this.handleDeleteGood}
                />
              )}
              {step === 1 && (
                <CommandCreateForm
                  listGoods={goods}
                  commandCode={generateCode('LSX')}
                  // approvers={this.getListApproverIds()}
                  onChangeListCommands={this.handleChangeListCommands}
                  manufacturingCommands={manufacturingCommands}
                  onListRemainingGoodsChange={this.handleRemainingGoodsChange}
                />
              )}
              {step === 2 && (
                <ScheduleBooking
                  listGoods={goods}
                  manufacturingCommands={manufacturingCommands}
                  startDate={startDate}
                  endDate={endDate}
                  onManufacturingCommandsChange={this.handleManufacturingCommandsChange}
                  listWorkSchedulesOfWorks={this.getListWorkSchedulesOfWorks()}
                  onListWorkSchedulesOfWorksChange={this.handleListWorkSchedulesOfWorksChange}
                  onArrayWorkerSchedulesChange={this.handleArryWorkerSchedulesChange}
                />
              )}
            </div>
            <div style={{ textAlign: 'center' }}>{`${step + 1} / ${steps.length}`}</div>
          </form>
        </DialogModal>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { salesOrders, manufacturingPlan, lots, goods, manufacturingMill, workSchedule, auth } = state
  return { salesOrders, manufacturingPlan, lots, goods, manufacturingMill, workSchedule, auth }
}

const mapDispatchToProps = {
  getSalesOrdersByManufacturingWorks: SalesOrderActions.getSalesOrdersByManufacturingWorks,
  getAllApproversOfPlan: manufacturingPlanActions.getAllApproversOfPlan,
  getInventoryByGoodIds: LotActions.getInventoryByGoodIds,
  getAllUserOfCompany: UserActions.getAllUserOfCompany,
  getGoodByManageWorkRole: GoodActions.getGoodByManageWorkRole,
  getAllWorkSchedulesOfManufacturingWork: workScheduleActions.getAllWorkSchedulesOfManufacturingWork,
  createManufacturingPlan: manufacturingPlanActions.createManufacturingPlan
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(NewPlanCreateForm))
