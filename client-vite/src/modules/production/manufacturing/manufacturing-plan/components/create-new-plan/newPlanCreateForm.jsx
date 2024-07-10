import React, { useEffect, useState } from 'react'
import { ButtonModal, DialogModal } from '../../../../../../common-components'
import CommandCreateForm from './commandCreateForm'
import PlanInfoForm from './generalPlanInfoForm'
import ScheduleBooking from './schedule-booking'
import './planCreate.css'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { generateCode } from '../../../../../../helpers/generateCode'
import { SalesOrderActions } from '../../../../order/sales-order/redux/actions'
import { manufacturingPlanActions } from '../../redux/actions'
import { GoodActions } from '../../../../common-production/good-management/redux/actions'
import { LotActions } from '../../../../warehouse/inventory-management/redux/actions'
import { UserActions } from '../../../../../super-admin/user/redux/actions'
import { compareLteDate, formatToTimeZoneDate } from '../../../../../../helpers/formatDate'
import { workScheduleActions } from '../../../work-schedule/redux/actions'
import { taskTemplateActions } from '../../../../../task/task-template/redux/actions'

function NewPlanCreateForm(props) {
  const { translate } = props

  const [steps, setSteps] = useState([
    {
      label: props.translate('manufacturing.plan.general_info'),
      active: true,
      disabled: false
    },
    {
      label: props.translate('manufacturing.plan.command_info'),
      active: false,
      disabled: true
    },
    {
      label: props.translate('manufacturing.plan.schedule_info'),
      active: false,
      disabled: true
    }
  ])

  const [step, setStep] = useState(0)
  const [code, setCode] = useState('')
  const [salesOrders, setSalesOrders] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [goods, setGoods] = useState([])
  const [addedAllGoods, setAddedAllGoods] = useState(false)
  const [approvers, setApprovers] = useState([])
  const [manufacturingCommands, setManufacturingCommands] = useState([])
  const [listGoodsSalesOrders, setListGoodsSalesOrders] = useState([])
  const [listRemainingGoods, setListRemainingGoods] = useState([])
  const [listWorkSchedulesOfWorks, setListWorkSchedulesOfWorks] = useState([])
  const [arrayWorkerSchedules, setArrayWorkerSchedules] = useState([])

  useEffect(() => {
    const getData = async () => {
      const perPage = 5
      const currentPage = 1
      const unit = []
      const name = ''
      await props.getAllUserOfCompany()
      const currentRole = localStorage.getItem('currentRole')
      await props.getSalesOrdersByManufacturingWorks(currentRole)
      await props.getAllApproversOfPlan(currentRole)
      await props.getGoodByManageWorkRole(currentRole)
      await props.getTaskTemplateByUser(currentPage, perPage, unit, name)
    }
    getData()
  }, [])

  const setCurrentStep = async (e, step) => {
    e.preventDefault()
    const newSteps = steps.map((item, index) => {
      if (index <= step) {
        item.active = true
      } else {
        item.active = false
      }
      return item
    })
    setStep(step)
    setSteps(newSteps)
  }

  const handleClickCreate = () => {
    setCode(generateCode('KHSX'))
  }

  const handleStartDateChange = async (value) => {
    setStartDate(value)
    if (value && endDate) {
      const { manufacturingMill } = props
      const { listMills } = manufacturingMill
      if (listMills) {
        const listMillIds = listMills.map((x) => x._id)
        const data = {
          startDate: value,
          endDate,
          manufacturingMills: listMillIds
        }
        props.getAllWorkSchedulesOfManufacturingWork(data)
      }
    }
  }

  const handleEndDateChange = async (value) => {
    setEndDate(value)

    if (startDate && value) {
      const { manufacturingMill } = props
      const { listMills } = manufacturingMill
      if (listMills) {
        const listMillIds = listMills.map((x) => x._id)
        const data = {
          startDate,
          endDate: value,
          manufacturingMills: listMillIds
        }
        props.getAllWorkSchedulesOfManufacturingWork(data)
      }
    }
  }

  const handleApproversChange = (value) => {
    setApprovers(value)
  }

  const handleDescriptionChange = (value) => {
    setDescription(value)
  }

  const handleSalesOrderChange = (value) => {
    setSalesOrders(value)

    const { listSalesOrdersWorks } = props.salesOrders //* note

    let listOrders = []
    if (listSalesOrdersWorks.length) {
      listOrders = listSalesOrdersWorks.filter((x) => value.includes(x._id))
    }
    const goods = []
    const goodIds = []
    for (let i = 0; i < listOrders.length; i++) {
      listOrders[i].goods.map((x) => {
        if (!goodIds.includes(x.good._id)) {
          goodIds.push(x.good._id)
          goods.push({
            good: x.good,
            quantity: x.quantity
          })
        } else {
          goods[findIndex(goods, x.good._id)].quantity += Number(x.quantity)
        }
      })
    }
    if (goodIds.length) {
      props.getInventoryByGoodIds({
        array: goodIds
      })
    }
    setListGoodsSalesOrders([...goods])
  }

  const findIndex = (array, id) => {
    let result = -1
    array.map((x, index) => {
      if (x.good._id === id) {
        result = index
      }
    })
    return result
  }

  // Hàm xử lý thêm tất cả các good trong sales orders vào goods
  const handleAddAllGood = () => {
    const goodIds = goods.map((x) => x.good._id)
    const newGoods = goods
    for (let i = 0; i < listGoodsSalesOrders.length; i++) {
      const x = listGoodsSalesOrders[i]
      if (!goodIds.includes(x.good._id)) {
        goodIds.push(x.good._id)
        newGoods.push({ ...x })
      } else {
        newGoods[findIndex(goods, x.good._id)].quantity = Number(goods[findIndex(newGoods, x.good._id)].quantity)
        newGoods[findIndex(goods, x.good._id)].quantity += Number(x.quantity)
      }
    }
    setGoods([...newGoods])
    setAddedAllGoods(true)
    setManufacturingCommands([])
  }

  const handleListGoodsChange = (goods) => {
    setGoods(goods)
  }

  const handleAddGood = (good) => {
    const goodIds = goods.map((x) => x.good._id)
    const newGoods = goods
    if (!goodIds.includes(good.goodId)) {
      const { listGoodsByRole } = props.goods
      const goodObject = listGoodsByRole.filter((x) => x._id === good.goodId)[0]
      good.good = goodObject
      newGoods.push(good)
    } else {
      newGoods[findIndex(goods, good.goodId)].quantity += Number(good.quantity)
    }
    setGoods([...newGoods])
    setManufacturingCommands([])
  }

  const handleSaveEditGood = (good, indexEditting) => {
    const { listGoodsByRole } = props.goods
    const goodObject = listGoodsByRole.filter((x) => x._id === good.goodId)[0]
    good.good = goodObject

    const goodIds = goods.map((x) => x.good._id)
    const newGoods = goods
    if (!goodIds.includes(good.goodId)) {
      newGoods[indexEditting] = good
    } else if (goods[indexEditting].good._id === good.goodId) {
      newGoods[indexEditting] = good
    } else {
      newGoods[findIndex(newGoods, good.goodId)].quantity = Number(newGoods[findIndex(newGoods, good.goodId)].quantity)
      newGoods[findIndex(newGoods, good.goodId)].quantity += Number(good.quantity)
      newGoods.splice(indexEditting, 1)
    }
    setGoods([...newGoods])
    setManufacturingCommands([])
  }

  const handleDeleteGood = (index) => {
    const newGoods = goods
    newGoods.splice(index, 1)

    setGoods([...newGoods])
    setManufacturingCommands([])
  }

  // Phần chia lệnh sản xuất

  const handleChangeListCommands = (listCommands) => {
    setManufacturingCommands(listCommands)
  }

  const handleRemainingGoodsChange = (listRemainingGoods) => {
    setListRemainingGoods(listRemainingGoods)
  }

  // Check xem bước phân chia lệnh đã được validate hay chưa
  const checkValidateListRemainingGoods = () => {
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

  const isValidateStep = (index) => {
    if (index == 1) {
      if (
        goods.length === 0 ||
        startDate === '' ||
        endDate === '' ||
        (startDate && endDate && !compareLteDate(startDate, endDate).status) ||
        approvers === undefined ||
        (approvers && approvers.length === 0)
      ) {
        return false
      }
      return true
    }
    if (index == 2) {
      if (
        goods.length === 0 ||
        startDate === '' ||
        endDate === '' ||
        manufacturingCommands.length === 0 ||
        !checkValidateListRemainingGoods()
      ) {
        return false
      }
      return true
    }
  }

  const handleManufacturingCommandsChange = (data) => {
    setManufacturingCommands([...data])
  }

  const getListWorkSchedulesOfWorks = () => {
    const { manufacturingMill, workSchedule } = props
    const { listMills } = manufacturingMill
    const listMillIds = listMills.map((x) => x._id)
    const listSchedulesMap = new Map()
    listMillIds.map((x) => {
      const workSchedulesOfMill = workSchedule.listWorkSchedulesOfWorks.filter((y) => y.manufacturingMill === x)
      listSchedulesMap.set(x, workSchedulesOfMill)
    })
    return listSchedulesMap
  }

  const handleListWorkSchedulesOfWorksChange = (data) => {
    setListWorkSchedulesOfWorks(data)
  }

  const isFormValidated = () => {
    let result = true
    for (let i = 0; i < manufacturingCommands.length; i++) {
      if (!manufacturingCommands[i].completed) {
        result = false
      }
    }
    return result && manufacturingCommands.length
  }

  const handleArrayWorkerSchedulesChange = (data) => {
    setArrayWorkerSchedules([...data])
  }

  const save = () => {
    if (isFormValidated()) {
      let listMillSchedules = []
      for (const value of listWorkSchedulesOfWorks.values()) {
        listMillSchedules = [...listMillSchedules, ...value]
      }
      const data = {
        code,
        salesOrders,
        startDate: formatToTimeZoneDate(startDate),
        endDate: formatToTimeZoneDate(endDate),
        description,
        goods,
        approvers,
        creator: localStorage.getItem('userId'),
        manufacturingCommands,
        listMillSchedules,
        arrayWorkerSchedules
      }
      props.createManufacturingPlan(data)
    }
  }

  const checkHasComponent = (name) => {
    const { auth } = props
    let result = false
    auth.components.forEach((component) => {
      if (component.name === name) result = true
    })

    return result
  }

  return (
    <>
      {checkHasComponent('create-manufacturing-plan') && (
        <ButtonModal
          onButtonCallBack={handleClickCreate}
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
        func={save}
        disableSubmit={!isFormValidated()}
        size={100}
        maxWidth={800}
      >
        <form id='form-create-new-plan'>
          <div className='timeline'>
            <div className='timeline-progress' style={{ width: `${(step * 100) / (steps.length - 1)}%` }} />
            <div className='timeline-items'>
              {steps.map((item, index) => (
                <div className={`timeline-item ${item.active ? 'active' : ''}`} key={index}>
                  <div
                    className={`timeline-contain ${!isValidateStep(index) && index > 0 ? 'disable-timeline-contain' : ''}`}
                    onClick={(e) => setCurrentStep(e, index)}
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
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                onApproversChange={handleApproversChange}
                onDescriptionChange={handleDescriptionChange}
                onSalesOrdersChange={handleSalesOrderChange}
                onListGoodsChange={handleListGoodsChange}
                onAddAllGood={handleAddAllGood}
                onAddGood={handleAddGood}
                onSaveEditGood={handleSaveEditGood}
                onDeleteGood={handleDeleteGood}
              />
            )}
            {step === 1 && (
              <CommandCreateForm
                listGoods={goods}
                commandCode={generateCode('LSX')}
                // approvers={getListApproverIds()}
                onChangeListCommands={handleChangeListCommands}
                manufacturingCommands={manufacturingCommands}
                onListRemainingGoodsChange={handleRemainingGoodsChange}
              />
            )}
            {step === 2 && (   
              <ScheduleBooking
                listGoods={goods}
                manufacturingCommands={manufacturingCommands}
                startDate={startDate}
                endDate={endDate}
                onManufacturingCommandsChange={handleManufacturingCommandsChange}
                listWorkSchedulesOfWorks={getListWorkSchedulesOfWorks()}
                onListWorkSchedulesOfWorksChange={handleListWorkSchedulesOfWorksChange}
                onArrayWorkerSchedulesChange={handleArrayWorkerSchedulesChange}
              />
            )}
          </div>
          <div style={{ textAlign: 'center' }}>{`${step + 1} / ${steps.length}`}</div>
        </form>
      </DialogModal>
    </>
  )
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
  createManufacturingPlan: manufacturingPlanActions.createManufacturingPlan,
  getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(NewPlanCreateForm))
