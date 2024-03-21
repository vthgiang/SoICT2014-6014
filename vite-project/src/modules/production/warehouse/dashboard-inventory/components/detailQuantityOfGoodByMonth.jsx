import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import 'c3/c3.css'
import './style.css'
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import { LotActions } from '../../inventory-management/redux/actions'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { SelectMulti, DatePicker, SelectBox, TreeSelect } from '../../../../../common-components'
import { GoodActions } from '../../../common-production/good-management/redux/actions'
import { StockActions } from '../../stock-management/redux/actions'
import GoodWillIssue from './goodWillIssue'
import GoodWillReceipt from './goodWillReceipt'
import QuantityNorm from './quantityNorm'
import { CategoryActions } from '../../../common-production/category-management/redux/actions'

function DetailQuantityOfGoodByMonth(props) {
  let today = new Date(),
    month = today.getMonth() + 1,
    year = today.getFullYear()
  let endMonth
  if (month < 10) {
    endMonth = '0' + month
  } else {
    endMonth = month
  }

  const INFO_SEARCH = {
    startMonth: year + '-01',
    endMonth: [year, endMonth].join('-')
  }
  const [state, setState] = useState({
    barChart: true,
    currentRole: localStorage.getItem('currentRole'),
    category: [],
    startMonth: INFO_SEARCH.startMonth,
    endMonth: INFO_SEARCH.endMonth,
    infosearch: {
      startMonth: INFO_SEARCH.startMonth,
      endMonth: INFO_SEARCH.endMonth
    },

    defaultEndMonth: [endMonth, year].join('-'),
    defaultStartMonth: ['01', year].join('-'),
    isSubmit: false
  })

  useEffect(() => {
    props.getGoodsByType({ type: 'material' })
    props.getAllStocks({ managementLocation: state.currentRole })
    props.getCategoryToTree()
    props.getInventoryByGoodAndStock({ managementLocation: state.currentRole, startMonth: state.startMonth, endMonth: state.endMonth })
  }, [])

  /** Select month start in box */
  const handleSelectMonthStart = (value) => {
    let month = value.slice(3, 7) + '-' + value.slice(0, 2)
    setState({
      ...state,
      startMonth: month
    })
  }

  /** Select month end in box */
  const handleSelectMonthEnd = async (value) => {
    let month = value.slice(3, 7) + '-' + value.slice(0, 2)
    setState({
      ...state,
      endMonth: month
    })
  }

  const handleTypeChange = async (value) => {
    let type = value[0]
    switch (type) {
      case '1':
        await props.getGoodsByType({ type: 'material' })
        break
      case '2':
        await props.getGoodsByType({ type: 'product' })
        break
      case '3':
        await props.getGoodsByType({ type: 'equipment' })
        break
      case '4':
        await props.getGoodsByType({ type: 'waste' })
        break
    }
  }

  const getType = () => {
    let typeArr = []
    typeArr = [
      { value: '1', text: 'Nguyên vật liệu' },
      { value: '2', text: 'Thành phẩm' },
      { value: '3', text: 'Công cụ dụng cụ' },
      { value: '4', text: 'Phế phẩm' }
    ]
    return typeArr
  }

  const getAllGoods = () => {
    const { translate, goods } = props
    const { category } = state
    let listGoodsByType = []
    const { listGoods } = goods
    if (listGoods) {
      listGoods.map((item) => {
        if (category && category.length > 0) {
          category.map((categoryItem) => {
            if (item.category === categoryItem) {
              listGoodsByType.push({
                value: item._id,
                text: item.code + ' - ' + item.name
              })
            }
          })
        } else {
          listGoodsByType.push({
            value: item._id,
            text: item.code + ' - ' + item.name
          })
        }
      })
    }
    return listGoodsByType
  }

  const getAllCategory = () => {
    let { categories } = props
    let categoryArr = []
    if (categories.categoryToTree.list.length > 0) {
      categories.categoryToTree.list.map((item) => {
        categoryArr.push({
          _id: item._id,
          id: item._id,
          state: { open: true },
          name: item.name,
          parent: item.parent ? item.parent.toString() : null
        })
      })
    }
    return categoryArr
  }

  const handleStockChange = (value) => {
    setState({
      ...state,
      stock: value
    })
  }

  const handleCategoryChange = (value) => {
    setState({
      ...state,
      category: value
    })
  }

  const handleGoodChange = (value) => {
    setState({
      ...state,
      goodId: value[0]
    })
  }

  const setDataIntoArrayByMonth = (arrMonth, data, dataType) => {
    let totalData = []
    let row = [...arrMonth]
    row = row.map((r) => {
      let listData = data.filter((t) => {
        let date = new Date(r)
        let endMonth = new Date(date.setMonth(date.getMonth() + 1))
        let endDate = new Date(endMonth.setDate(endMonth.getDate() - 1))
        if (new Date(r).getTime() <= new Date(t.createdAt).getTime() && new Date(t.createdAt).getTime() <= new Date(endDate)) {
          return true
        }
        return false
      })
      if (dataType === 'lot') {
        let quantityInventory = 0
        listData.forEach((element) => {
          quantityInventory += element.quantity
        })
        totalData.push(quantityInventory)
      }
      let goodId = state.isSubmit ? state.goodId : getAllGoods() && getAllGoods().length > 0 ? getAllGoods()[0].value : ''
      if (dataType === 'billReceipt' || dataType === 'billIssue') {
        let quantityBill = 0
        listData.forEach((element) => {
          element.goods.forEach((good) => {
            if (good.good.toString() === goodId) {
              quantityBill += good.quantity
            }
          })
        })
        totalData.push(quantityBill)
      }
    })
    return totalData
  }

  const getDataForChart = () => {
    const { lots } = props
    const { goodStockInventory } = lots
    const { startMonth, endMonth } = state
    const period = dayjs(endMonth).diff(startMonth, 'month')

    let arrMonth = []
    for (let i = 0; i <= period; i++) {
      arrMonth = [...arrMonth, dayjs(startMonth).add(i, 'month').format('YYYY-MM-DD')]
    }
    let title = ['x', ...arrMonth]
    let totalLots = ['Số lượng hàng tồn']
    let totalBillsWillReceipt = ['Số lượng hàng sẽ nhập']
    let totalBillsWillIssue = ['Số lượng hàng sẽ xuất']
    let listLots = goodStockInventory ? goodStockInventory.lots : []
    let listBillsWillReceipt = goodStockInventory ? goodStockInventory.billsWillReceipt : []
    let listBillsWillIssue = goodStockInventory ? goodStockInventory.billsWillIssue : []
    totalLots = totalLots.concat(setDataIntoArrayByMonth(arrMonth, listLots, 'lot'))
    totalBillsWillReceipt = totalBillsWillReceipt.concat(setDataIntoArrayByMonth(arrMonth, listBillsWillReceipt, 'billReceipt'))
    totalBillsWillIssue = totalBillsWillIssue.concat(setDataIntoArrayByMonth(arrMonth, listBillsWillIssue, 'billIssue'))
    return [
      {
        title: title,
        totalLots: totalLots,
        totalBillsWillIssue: totalBillsWillIssue,
        totalBillsWillReceipt: totalBillsWillReceipt
      }
    ]
  }

  const handleSearchData = async () => {
    let startMonth = new Date(state.startMonth)
    let endMonth = new Date(state.endMonth)
    if (startMonth.getTime() > endMonth.getTime()) {
      const { translate } = props
      Swal.fire({
        title: translate('kpi.organizational_unit.dashboard.alert_search.search'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.organizational_unit.dashboard.alert_search.confirm')
      })
    } else {
      await setState({
        ...state,
        infosearch: {
          ...state.infosearch,
          managementLocation: state.currentRole,
          stock: state.stock,
          goodId: state.goodId ? state.goodId : getAllGoods()[0].value,
          startMonth: state.startMonth,
          endMonth: state.endMonth
        },
        isSubmit: true
      })
    }
    await props.getInventoryByGoodAndStock(state.infosearch)
  }

  const { defaultEndMonth, defaultStartMonth, goodType, goodId, category, actionSearch } = state

  const { translate, lots, stocks } = props
  const { listStocks } = stocks

  const dataCategory = getAllCategory()
  const dataForChart = getDataForChart()
  return (
    <React.Fragment>
      <div className='box' style={{ paddingBottom: '20px' }}>
        <div className='box-body qlcv'>
          <div className='form-inline'>
            <div className='form-group'>
              <label>{'Kho'}</label>
              <SelectMulti
                id={`select-multi-stock-good-will-receipt`}
                multiple='multiple'
                options={{ nonSelectedText: 'Tổng các kho', allSelectedText: 'Tổng các kho' }}
                className='form-control select2'
                style={{ width: '100%' }}
                items={listStocks.map((x, index) => {
                  return { value: x._id, text: x.name }
                })}
                onChange={handleStockChange}
              />
            </div>
            <div className='form-group'>
              <label className='form-control-static'>{'Loại hàng hóa'}</label>
              <SelectBox
                id={`select-type`}
                className='form-control select2'
                style={{ width: '100%', paddingBottom: '15px' }}
                value={goodType}
                items={getType()}
                onChange={handleTypeChange}
                multiple={false}
              />
            </div>
            <div className='form-group'>
              <label>{'Danh mục'}</label>
              <TreeSelect data={dataCategory} value={category} handleChange={handleCategoryChange} mode='hierarchical' />
            </div>
            <div className='form-group'>
              <label className='form-control-static'>{translate('production.request_management.good_code')}</label>
              <SelectBox
                id={`select-good-purchasing-request`}
                className='form-control select2'
                style={{ width: '100%', paddingBottom: '15px' }}
                value={goodId}
                items={getAllGoods()}
                onChange={handleGoodChange}
                multiple={false}
              />
            </div>
          </div>
          <div className='form-inline'>
            <div className='form-group'>
              <label className='form-control-static'>{'Từ Tháng'}</label>
              <DatePicker
                id='monthStartInGoodWillReceipt'
                dateFormat='month-year'
                value={defaultStartMonth}
                onChange={handleSelectMonthStart}
                disabled={false}
              />
            </div>
            <div className='form-group'>
              <label className='form-control-static'>{'Đến Tháng'}</label>
              <DatePicker
                id='monthEndInGoodWillReceipt'
                dateFormat='month-year'
                value={defaultEndMonth}
                onChange={handleSelectMonthEnd}
                disabled={false}
              />
            </div>
            <div className='form-group'>
              <button
                type='button'
                className='btn btn-success'
                title={translate('manage_warehouse.bill_management.search')}
                onClick={handleSearchData}
              >
                {translate('manage_warehouse.bill_management.search')}
              </button>
            </div>
          </div>
        </div>
        <div className='box-header with-border'>
          <div className=' col-lg-12 col-md-12 col-md-sm-12 col-xs-12'>
            <QuantityNorm dataForChart={dataForChart[0].totalLots} title={dataForChart[0].title} />
          </div>
          <div className=' col-lg-6 col-md-6 col-md-sm-12 col-xs-12'>
            <GoodWillIssue dataForChart={dataForChart[0].totalBillsWillIssue} title={dataForChart[0].title} />
          </div>
          <div className=' col-lg-6 col-md-6 col-md-sm-12 col-xs-12'>
            <GoodWillReceipt dataForChart={dataForChart[0].totalBillsWillReceipt} title={dataForChart[0].title} />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  getInventoriesDashboard: LotActions.getInventoriesDashboard,
  getGoodsByType: GoodActions.getGoodsByType,
  getAllStocks: StockActions.getAllStocks,
  getCategoryToTree: CategoryActions.getCategoryToTree,
  getInventoryByGoodAndStock: LotActions.getInventoryByGoodAndStock
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DetailQuantityOfGoodByMonth))
