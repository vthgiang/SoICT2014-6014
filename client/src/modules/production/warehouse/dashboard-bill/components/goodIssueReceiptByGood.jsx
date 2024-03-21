import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import c3 from 'c3'
import 'c3/c3.css'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { SelectMulti, DatePicker, SelectBox, TreeSelect } from '../../../../../common-components'
import { CategoryActions } from '../../../common-production/category-management/redux/actions'
import { LotActions } from '../../inventory-management/redux/actions'

function GoodIssueReceiptByGood(props) {
  const [state, setState] = useState({
    barChart: true,
    type: 'product',
    currentRole: localStorage.getItem('currentRole'),
    category: [],
    dataChart: [],
    name: []
  })

  let { translate, lots, stocks } = props
  const { inventoryDashboard } = lots
  const { type, category, startDate, endDate } = state
  const { listStocks } = stocks

  useEffect(() => {
    if (inventoryDashboard.length > 0) {
      let name = []
      let inventory = ['Tồn kho']
      let goodReceipted = ['Nhập kho']
      let goodIssued = ['Xuất kho']
      for (let i = 0; i < inventoryDashboard.length; i++) {
        name = [...name, inventoryDashboard[i].name]
        inventory = [...inventory, inventoryDashboard[i].inventory]
        goodReceipted = [...goodReceipted, inventoryDashboard[i].goodReceipted]
        goodIssued = [...goodIssued, inventoryDashboard[i].goodIssued]
      }
      setState({
        ...state,
        name,
        dataChart: [inventory, goodReceipted, goodIssued]
      })
    }
  }, [inventoryDashboard])

  useEffect(() => {
    barAndChart(state.name, state.dataChart)
  }, [state.dataChart])

  const refBarChart = React.createRef()

  useEffect(() => {
    const { type } = state
    props.getInventoriesDashboard({ type, managementLocation: state.currentRole })
    props.getCategoryToTree()
  }, [])

  const handleCategoryChange = (value) => {
    setState({
      ...state,
      category: value
    })
  }

  const handleTypeChange = (value) => {
    setState({
      ...state,
      type: value
    })
  }

  const handleStockChange = (value) => {
    setState({
      ...state,
      stock: value
    })
  }

  const handleSubmitSearch = () => {
    let data = {
      stock: state.stock,
      category: state.category,
      type: state.type,
      managementLocation: state.currentRole
      // startDate: state.startDate,
      // endDate: state.endDate,
    }
    props.getInventoriesDashboard(data)
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

  // Khởi tạo BarChart bằng C3
  const barAndChart = (name, dataChart) => {
    const { barChart } = state
    c3.generate({
      bindto: refBarChart.current,
      data: {
        // x: 'x',
        columns: dataChart,
        type: barChart ? 'bar' : 'line'
      },
      axis: {
        x: {
          type: 'category',
          tick: {
            rotate: 75,
            multiline: false
          },
          categories: name,
          height: 100
        }
      }
    })
  }

  const dataCategory = getAllCategory()

  return (
    <React.Fragment>
      <div className='box'>
        <div className='box-header with-border'>
          <i className='fa fa-bar-chart-o' />
          <h3 className='box-title'>{'Số lượng xuất, nhập, tồn trong tất cả các kho'}</h3>
          <div className='box-body qlcv'>
            <div className='form-inline'>
              <div className='form-group'>
                <label>{'Kho'}</label>
                <SelectMulti
                  id={`select-multi-stock-dashboard-inventory`}
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
                <label>{'Loại hàng hóa'}</label>
                <SelectMulti
                  id={`select-multi-type-dashboard-bill`}
                  multiple='multiple'
                  options={{ nonSelectedText: 'Loại hàng hóa', allSelectedText: 'Chọn tất cả' }}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={[
                    { value: 'product', text: 'Sản phẩm' },
                    { value: 'material', text: 'Nguyên vật liệu' },
                    { value: 'equipment', text: 'Công cụ, dụng cụ' },
                    { value: 'waste', text: 'Phế phẩm' }
                  ]}
                  onChange={handleTypeChange}
                />
              </div>
              <div className='form-group good-category-select-tree'>
                <label>{'Danh mục'}</label>
                <TreeSelect data={dataCategory} value={category} handleChange={handleCategoryChange} mode='hierarchical' />
              </div>
              <div className='form-group'>
                <button
                  type='button'
                  className='btn btn-success'
                  title={translate('manage_warehouse.bill_management.search')}
                  onClick={() => handleSubmitSearch()}
                >
                  {translate('manage_warehouse.bill_management.search')}
                </button>
              </div>
            </div>
          </div>
          <div ref={refBarChart}></div>
        </div>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  getCategoryToTree: CategoryActions.getCategoryToTree,
  getInventoriesDashboard: LotActions.getInventoriesDashboard
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodIssueReceiptByGood))
