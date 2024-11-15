import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import BookManagement from '../components/stock-book'
import ReceiptManagement from '../components/good-receipts'
import IssueManagement from '../components/good-issues'
import ReturnManagement from '../components/good-returns'
import RotateManagement from '../components/stock-rotate'
import TakeManagement from '../components/stock-takes'

import { BillActions } from '../redux/actions'
import { StockActions } from '../../stock-management/redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { GoodActions } from '../../../common-production/good-management/redux/actions'
import { CrmCustomerActions } from '../../../../crm/customer/redux/actions'
import { millActions } from '../../../manufacturing/manufacturing-mill/redux/actions'
import { worksActions } from '../../../manufacturing/manufacturing-works/redux/actions'

function BillManagement(props) {
  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole'),
    limit: 5,
    page: 1,
    group: ''
  })

  useEffect(() => {
    const { limit, page, currentRole, group } = state
    props.getBillsByType({ page, limit, managementLocation: currentRole })
    props.getAllBillsByGroup({ group, managementLocation: currentRole })
    props.getAllStocks()
    props.getUser()
    props.getAllGoods()
    props.getCustomers()
    props.getAllManufacturingMills()
    props.getAllManufacturingWorks()
  }, [])

  const handleShowDetailInfo = async (id) => {
    await props.getDetailBill(id)
    window.$('#modal-detail-bill').modal('show')
  }

  const handleEdit = async (bill) => {
    await setState({
      ...state,
      currentRow: bill
    })

    window.$('#modal-edit-bill').modal('show')
  }

  function formatDate(date, monthYear = false) {
    if (date) {
      let d = new Date(date),
        day = '' + d.getDate(),
        month = '' + (d.getMonth() + 1),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      if (monthYear === true) {
        return [month, year].join('-')
      } else return [day, month, year].join('-')
    } else {
      return date
    }
  }

  const setPage = async (page) => {
    setState({
      ...state,
      page: page
    })
    const data = {
      limit: state.limit,
      managementLocation: state.currentRole,
      page: page,
      code: state.code,
      status: state.status,
      stock: state.stock,
      type: state.type,
      startDate: state.startDate,
      endDate: state.endDate,
      customer: state.customer,
      supplier: state.supplier,
      toStock: state.toStock,
      creator: state.creator
    }
    const { group } = state
    if (group !== '') {
      data.group = group
    }
    await props.getBillsByType(data)
  }

  const setLimit = async (number) => {
    setState({
      ...state,
      limit: number
    })
    const data = {
      limit: number,
      page: state.page,
      managementLocation: state.currentRole,
      code: state.code,
      status: state.status,
      stock: state.stock,
      type: state.type,
      startDate: state.startDate,
      endDate: state.endDate,
      customer: state.customer,
      supplier: state.supplier,
      toStock: state.toStock,
      creator: state.creator
    }
    const { group } = state
    if (group !== '') {
      data.group = group
    }
    await props.getBillsByType(data)
  }

  const handleStockChange = (value) => {
    setState({
      ...state,
      stock: value
    })
  }

  const handleToStockChange = (value) => {
    setState({
      ...state,
      toStock: value
    })
  }

  const handleCreatorChange = (value) => {
    setState({
      ...state,
      creator: value
    })
  }

  const handleCodeChange = (e) => {
    let value = e.target.value
    setState({
      ...state,
      code: value
    })
  }

  const handleTypeChange = (value) => {
    setState({
      ...state,
      type: value
    })
  }

  const handleStatusChange = (value) => {
    setState({
      ...state,
      status: value
    })
  }

  const handleSearchByStatus = async (value) => {
    setState({
      ...state,
      status: value
    })
    await handleSubmitSearch()
  }

  const handlePartnerChange = (value) => {
    setState({
      ...state,
      customer: value
    })
  }

  const handleSupplierChange = (value) => {
    setState({
      ...state,
      supplier: value
    })
  }

  const handleSubmitSearch = () => {
    let data = {
      page: '1',
      limit: state.limit,
      managementLocation: state.currentRole,
      code: state.code,
      status: state.status,
      stock: state.stock,
      type: state.type,
      startDate: state.startDate,
      endDate: state.endDate,
      customer: state.customer,
      supplier: state.supplier,
      toStock: state.toStock,
      creator: state.creator
    }
    const { group } = state
    if (group !== '') {
      data.group = group
    }
    props.getBillsByType(data)
  }

  const handleChangeStartDate = (value) => {
    if (value === '') {
      value = null
    }

    setState({
      ...state,
      startDate: value
    })
  }

  const handleChangeEndDate = (value) => {
    if (value === '') {
      value = null
    }

    setState({
      ...state,
      endDate: value
    })
  }

  const handleStockBook = async () => {
    const page = 1
    const group = ''
    await setState({
      ...state,
      page: page,
      group: group
    })
    const { limit } = state
    await props.getAllBillsByGroup({ group, managementLocation: state.currentRole })
    await props.getBillsByType({ page, limit, managementLocation: state.currentRole })
  }

  const handleGoodReceipt = async () => {
    const page = 1
    const group = '1'
    const { limit } = state
    await setState({
      ...state,
      group: group,
      page: page
    })
    await props.getAllBillsByGroup({ group, managementLocation: state.currentRole })
    await props.getBillsByType({ page, limit, group, managementLocation: state.currentRole })
  }

  const handleGoodIssue = async () => {
    const page = 1
    const group = '2'
    const { limit } = state
    await setState({
      ...state,
      group: group,
      page: page
    })
    await props.getAllBillsByGroup({ group, managementLocation: state.currentRole })
    await props.getBillsByType({ page, limit, group, managementLocation: state.currentRole })
  }

  const handleGoodReturn = async () => {
    const page = 1
    const group = '3'
    const { limit } = state
    await setState({
      ...state,
      group: group,
      page: page
    })
    await props.getAllBillsByGroup({ group, managementLocation: state.currentRole })
    await props.getBillsByType({ page, limit, group, managementLocation: state.currentRole })
  }

  const handleStockTake = async () => {
    const page = 1
    const group = '4'
    const { limit } = state
    await setState({
      ...state,
      group: group,
      page: page
    })
    await props.getAllBillsByGroup({ group, managementLocation: state.currentRole })
    await props.getBillsByType({ page, limit, group, managementLocation: state.currentRole })
  }

  // const handleStockRotate = async () => {
  //     const page = 1;
  //     const group = '5';
  //     const { limit } = state;
  //     await setState({
  //         ...state,
  //         group: group,
  //         page: page
  //     })
  //     await props.getAllBillsByGroup({ group, managementLocation: state.currentRole });
  //     await props.getBillsByType({ page, limit, group, managementLocation: state.currentRole })
  // }

  const getPartner = () => {
    const { crm } = props
    let partnerArr = []

    crm.customers.list.map((item) => {
      partnerArr.push({
        value: item._id,
        text: item.name
      })
    })

    return partnerArr
  }

  const checkRoleApprovers = (bill) => {
    const { approvers } = bill
    const userId = localStorage.getItem('userId')
    let approverIds = approvers.map((x) => x.approver._id)
    if (approverIds.includes(userId) && approvers[approverIds.indexOf(userId)].approvedTime === null) {
      return true
    }
    return false
  }

  const handleFinishedApproval = (bill) => {
    const userId = localStorage.getItem('userId')
    const data = {
      approverId: userId
    }
    props.editBill(bill._id, data)
  }

  const checkRolePerformWork = (bill) => {
    const { stockWorkAssignment } = bill
    const userId = localStorage.getItem('userId')
    let performWorkPeople = stockWorkAssignment[0].workAssignmentStaffs.map((x) => x._id)
    if (performWorkPeople.includes(userId)) {
      return true
    }
    return false
  }

  const checkRoleCanViewDetail = (bill) => {
    const { stockWorkAssignment } = bill
    const userId = localStorage.getItem('userId')
    let peopleIncharge = stockWorkAssignment[0].workAssignmentStaffs.map((x) => x._id)
    let accountables = stockWorkAssignment[1].workAssignmentStaffs.map((x) => x._id)
    let accountants = stockWorkAssignment[2].workAssignmentStaffs.map((x) => x._id)
    let peopleCanViewDetail = [...peopleIncharge, ...accountables, ...accountants]
    if (peopleCanViewDetail.includes(userId)) {
      return true
    }
    return false
  }
  const handleInProcessingStatus = (bill) => {
    const data = {
      status: '3',
      oldStatus: bill.status
      // group: bill.group,
      // fromStock: bill.fromStock,
      // code: bill.code,
      // type: bill.type,
      // group: bill.group,
      // users: bill.users,
      // approvers: bill.approvers,
      // qualityControlStaffs: bill.listQualityControlStaffs,
      // responsibles: bill.responsibles,
      // accountables: bill.accountables,
      // customer: bill.customer,
      // phone: bill.phone,
      // email: bill.email,
      // address: bill.address,
      // description: bill.description,
      // goods: bill.goods,
      // oldGoods: bill.goods
    }
    props.editBill(bill._id, data)
  }

  const handleCancelBill = (bill) => {
    const data = {
      status: '3',
      oldStatus: bill.status
    }
    props.editBill(bill._id, data)
  }

  const handleCompleteBill = (bill) => {
    const data = {
      status: '5',
      oldStatus: bill.status
      // group: bill.group,
      // fromStock: bill.fromStock,
      // toStock: bill.toStock ? bill.toStock : '',
      // code: bill.code,
      // type: bill.type,
      // group: bill.group,
      // users: bill.users,
      // approvers: bill.approvers,
      // qualityControlStaffs: bill.listQualityControlStaffs,
      // responsibles: bill.responsibles,
      // accountables: bill.accountables,
      // customer: bill.customer,
      // phone: bill.phone,
      // email: bill.email,
      // address: bill.address,
      // description: bill.description,
      // goods: bill.goods,
      // oldGoods: bill.goods
    }
    props.editBill(bill._id, data)
  }

  const checkRoleQualityControlStaffs = (bill) => {
    const { qualityControlStaffs } = bill
    const userId = localStorage.getItem('userId')
    let qualityControlStaffId = qualityControlStaffs.map((x) => x.staff._id)
    if (
      qualityControlStaffId.includes(userId) &&
      (qualityControlStaffs[qualityControlStaffId.indexOf(userId)].time === null
        ? true
        : qualityControlStaffs[qualityControlStaffId.indexOf(userId)].status === 1
          ? true
          : false)
    ) {
      return true
    }
    return false
  }

  const handleFinishedQualityControlStaff = (bill) => {
    const userId = localStorage.getItem('userId')
    const data = {
      qualityControlStaffId: userId
    }
    props.editBill(bill._id, data)
  }

  const checkRoleCanEdit = (bill) => {
    const { responsibles, accountables, creator } = bill
    const userId = localStorage.getItem('userId')
    let staffId = []
    if (responsibles.length > 0) {
      responsibles.map((x) => {
        staffId.push(x._id)
      })
    }
    if (accountables.length > 0) {
      accountables.map((x) => {
        staffId.push(x._id)
      })
    }
    if (creator) {
      staffId.push(creator._id)
    }
    if (staffId.includes(userId)) {
      return true
    }
    return false
  }

  const { translate, bills } = props
  const { group } = state
  return (
    <div className='nav-tabs-custom'>
      <ul className='nav nav-tabs'>
        <li className='active'>
          <a href='#bill-stock-book' data-toggle='tab' onClick={() => handleStockBook()}>
            {translate('manage_warehouse.bill_management.stock_book')} &nbsp;({bills.listBillByGroup.length})
          </a>
        </li>
        <li>
          <a href='#bill-good-receipts' data-toggle='tab' onClick={() => handleGoodReceipt()}>
            {translate('manage_warehouse.bill_management.good_receipt')} &nbsp;(
            {bills.listBillByGroup.filter((item) => item.group === '1').length})
          </a>
        </li>
        <li>
          <a href='#bill-good-issues' data-toggle='tab' onClick={() => handleGoodIssue()}>
            {translate('manage_warehouse.bill_management.good_issue')} &nbsp;(
            {bills.listBillByGroup.filter((item) => item.group === '2').length})
          </a>
        </li>
        <li>
          <a href='#bill-good-returns' data-toggle='tab' onClick={() => handleGoodReturn()}>
            {translate('manage_warehouse.bill_management.good_return')} &nbsp;(
            {bills.listBillByGroup.filter((item) => item.group === '3').length})
          </a>
        </li>
        <li>
          <a href='#bill-stock-takes' data-toggle='tab' onClick={() => handleStockTake()}>
            {translate('manage_warehouse.bill_management.stock_take')} &nbsp;(
            {bills.listBillByGroup.filter((item) => item.group === '4').length})
          </a>
        </li>
        {/* <li><a href="#bill-stock-rotates" data-toggle="tab" onClick={() => handleStockRotate()}>{translate('manage_warehouse.bill_management.stock_rotate')} &nbsp;({bills.listBillByGroup.filter(item => item.group === '5').length})</a></li> */}
      </ul>
      <div className='tab-content'>
        {group === '' && (
          <BookManagement
            handleEdit={handleEdit}
            formatDate={formatDate}
            setPage={setPage}
            setLimit={setLimit}
            handleStockChange={handleStockChange}
            handleCreatorChange={handleCreatorChange}
            handleTypeChange={handleTypeChange}
            handleStatusChange={handleStatusChange}
            handleCodeChange={handleCodeChange}
            handlePartnerChange={handlePartnerChange}
            handleSubmitSearch={handleSubmitSearch}
            handleChangeStartDate={handleChangeStartDate}
            handleChangeEndDate={handleChangeEndDate}
            getPartner={getPartner}
            handleShowDetailInfo={handleShowDetailInfo}
            handleInProcessingStatus={handleInProcessingStatus}
            handleCancelBill={handleCancelBill}
            handleCompleteBill={handleCompleteBill}
            handleSearchByStatus={handleSearchByStatus}
          />
        )}

        {group === '1' && (
          <ReceiptManagement
            handleEdit={handleEdit}
            formatDate={formatDate}
            setPage={setPage}
            setLimit={setLimit}
            handleStockChange={handleStockChange}
            handleCreatorChange={handleCreatorChange}
            handleTypeChange={handleTypeChange}
            handleStatusChange={handleStatusChange}
            handleCodeChange={handleCodeChange}
            handlePartnerChange={handleSupplierChange}
            handleSubmitSearch={handleSubmitSearch}
            handleChangeStartDate={handleChangeStartDate}
            handleChangeEndDate={handleChangeEndDate}
            getPartner={getPartner}
            handleShowDetailInfo={handleShowDetailInfo}
            checkRoleApprovers={checkRoleApprovers}
            handleFinishedApproval={handleFinishedApproval}
            checkRoleQualityControlStaffs={checkRoleQualityControlStaffs}
            handleFinishedQualityControlStaff={handleFinishedQualityControlStaff}
            checkRoleCanEdit={checkRoleCanEdit}
            handleInProcessingStatus={handleInProcessingStatus}
            handleCancelBill={handleCancelBill}
            handleCompleteBill={handleCompleteBill}
            handleSearchByStatus={handleSearchByStatus}
            checkRolePerformWork={checkRolePerformWork}
            checkRoleCanViewDetail={checkRoleCanViewDetail}
          />
        )}

        {group === '2' && (
          <IssueManagement
            handleEdit={handleEdit}
            formatDate={formatDate}
            setPage={setPage}
            setLimit={setLimit}
            handleStockChange={handleStockChange}
            handleCreatorChange={handleCreatorChange}
            handleTypeChange={handleTypeChange}
            handleStatusChange={handleStatusChange}
            handleCodeChange={handleCodeChange}
            handlePartnerChange={handlePartnerChange}
            handleSubmitSearch={handleSubmitSearch}
            handleChangeStartDate={handleChangeStartDate}
            handleChangeEndDate={handleChangeEndDate}
            getPartner={getPartner}
            handleShowDetailInfo={handleShowDetailInfo}
            checkRoleApprovers={checkRoleApprovers}
            handleFinishedApproval={handleFinishedApproval}
            checkRoleQualityControlStaffs={checkRoleQualityControlStaffs}
            handleFinishedQualityControlStaff={handleFinishedQualityControlStaff}
            checkRoleCanEdit={checkRoleCanEdit}
            handleInProcessingStatus={handleInProcessingStatus}
            handleCancelBill={handleCancelBill}
            handleCompleteBill={handleCompleteBill}
            handleSearchByStatus={handleSearchByStatus}
            checkRolePerformWork={checkRolePerformWork}
            checkRoleCanViewDetail={checkRoleCanViewDetail}
          />
        )}

        {group === '3' && (
          <ReturnManagement
            handleEdit={handleEdit}
            formatDate={formatDate}
            setPage={setPage}
            setLimit={setLimit}
            handleStockChange={handleStockChange}
            handleCreatorChange={handleCreatorChange}
            handleTypeChange={handleTypeChange}
            handleStatusChange={handleStatusChange}
            handleCodeChange={handleCodeChange}
            handlePartnerChange={handlePartnerChange}
            handleSubmitSearch={handleSubmitSearch}
            handleChangeStartDate={handleChangeStartDate}
            handleChangeEndDate={handleChangeEndDate}
            getPartner={getPartner}
            handleShowDetailInfo={handleShowDetailInfo}
            checkRoleApprovers={checkRoleApprovers}
            handleFinishedApproval={handleFinishedApproval}
            checkRoleQualityControlStaffs={checkRoleQualityControlStaffs}
            handleFinishedQualityControlStaff={handleFinishedQualityControlStaff}
            checkRoleCanEdit={checkRoleCanEdit}
            handleInProcessingStatus={handleInProcessingStatus}
            handleCancelBill={handleCancelBill}
            handleCompleteBill={handleCompleteBill}
            handleSearchByStatus={handleSearchByStatus}
            checkRolePerformWork={checkRolePerformWork}
            checkRoleCanViewDetail={checkRoleCanViewDetail}
          />
        )}

        {group === '4' && (
          <TakeManagement
            handleEdit={handleEdit}
            formatDate={formatDate}
            setPage={setPage}
            setLimit={setLimit}
            handleStockChange={handleStockChange}
            handleCreatorChange={handleCreatorChange}
            handleTypeChange={handleTypeChange}
            handleStatusChange={handleStatusChange}
            handleCodeChange={handleCodeChange}
            handlePartnerChange={handlePartnerChange}
            handleSubmitSearch={handleSubmitSearch}
            handleChangeStartDate={handleChangeStartDate}
            handleChangeEndDate={handleChangeEndDate}
            getPartner={getPartner}
            handleShowDetailInfo={handleShowDetailInfo}
            checkRoleApprovers={checkRoleApprovers}
            handleFinishedApproval={handleFinishedApproval}
            checkRoleQualityControlStaffs={checkRoleQualityControlStaffs}
            handleFinishedQualityControlStaff={handleFinishedQualityControlStaff}
            checkRoleCanEdit={checkRoleCanEdit}
            handleInProcessingStatus={handleInProcessingStatus}
            handleCancelBill={handleCancelBill}
            handleCompleteBill={handleCompleteBill}
            handleSearchByStatus={handleSearchByStatus}
            checkRolePerformWork={checkRolePerformWork}
            checkRoleCanViewDetail={checkRoleCanViewDetail}
          />
        )}

        {/* {group === '5' &&
                    <RotateManagement
                        handleEdit={handleEdit}
                        formatDate={formatDate}
                        setPage={setPage}
                        setLimit={setLimit}
                        handleStockChange={handleStockChange}
                        handleCreatorChange={handleCreatorChange}
                        handleTypeChange={handleTypeChange}
                        handleStatusChange={handleStatusChange}
                        handleCodeChange={handleCodeChange}
                        handlePartnerChange={handleToStockChange}
                        handleSubmitSearch={handleSubmitSearch}
                        handleChangeStartDate={handleChangeStartDate}
                        handleChangeEndDate={handleChangeEndDate}
                        getPartner={getPartner}
                        handleShowDetailInfo={handleShowDetailInfo}
                        checkRoleApprovers={checkRoleApprovers}
                        handleFinishedApproval={handleFinishedApproval}
                        checkRoleQualityControlStaffs={checkRoleQualityControlStaffs}
                        handleFinishedQualityControlStaff={handleFinishedQualityControlStaff}
                        checkRoleCanEdit={checkRoleCanEdit}
                        handleInProcessingStatus={handleInProcessingStatus}
                        handleCancelBill={handleCancelBill}
                        handleCompleteBill={handleCompleteBill}
                        handleSearchByStatus={handleSearchByStatus}

                    />
                } */}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  getBillsByType: BillActions.getBillsByType,
  getAllBillsByGroup: BillActions.getAllBillsByGroup,
  getDetailBill: BillActions.getDetailBill,
  getAllStocks: StockActions.getAllStocks,
  getUser: UserActions.get,
  getAllGoods: GoodActions.getAllGoods,
  getCustomers: CrmCustomerActions.getCustomers,
  editBill: BillActions.editBill,
  getAllManufacturingMills: millActions.getAllManufacturingMills,
  getAllManufacturingWorks: worksActions.getAllManufacturingWorks
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BillManagement))
