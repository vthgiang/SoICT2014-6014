import React, { Component } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { DatePicker, SelectBox, TreeSelect } from '../../../../../../common-components'
import Swal from 'sweetalert2'
import { AssetManagerActions } from '../../../asset-information/redux/actions'
import c3 from 'c3'
import 'c3/c3.css'

class AssetDisposalChart extends Component {
  constructor(props) {
    super(props)

    let d = new Date(),
      month = d.getMonth() + 1,
      year = d.getFullYear()
    let startMonth, endMonth, startYear

    if (month > 3) {
      startMonth = month - 3
      startYear = year
    } else {
      startMonth = month - 3 + 12
      startYear = year - 1
    }
    if (startMonth < 10) startMonth = '0' + startMonth
    if (month < 10) {
      endMonth = '0' + month
    } else {
      endMonth = month
    }

    this.INFO_SEARCH = {
      disposalDateAfter: [startYear, startMonth].join('-'),
      disposalDateBefore: [year, endMonth].join('-'),
      type: []
    }

    this.state = {
      disposalDateAfter: this.INFO_SEARCH.disposalDateAfter,
      disposalDateBefore: this.INFO_SEARCH.disposalDateBefore,
      defaultStartMonth: [startMonth, startYear].join('-'),
      defaultEndMonth: [endMonth, year].join('-'),
      year: 'false',
      type: this.INFO_SEARCH.type
    }
  }
  // Lấy dữ liệu biểu đồ trường hợp chọn hiển thị theo tháng
  setDataColumnChartForMonth = (type) => {
    const { getDisposalData, translate, chartAsset } = this.props
    let category1 = ['x'],
      count1 = ['Số lượng'],
      value1 = ['Giá trị'],
      yValue1 = [],
      max = []
    const maxVa = (a, b) => Math.max(a, b)
    if (chartAsset.disposalChart) {
      chartAsset.disposalChart.forEach((element) => {
        if (type.length !== 0) {
          let sumCate = 0,
            sumValue = 0
          type.forEach((value) => {
            let index = element.idAssetTypeDisposal.indexOf(value)
            sumCate += element.countAssetcount[index]
            sumValue += element.valueAsset[index]
          })
          category1.push(element.xTypeDipsosal)
          count1.push(sumCate)
          value1.push(sumValue)
        } else {
          const reducer = (a, b) => a + b
          category1.push(element.xTypeDipsosal)
          count1.push(element.countAssetcount.reduce(reducer))
          value1.push(element.valueAsset.reduce(reducer))
        }
      })
    }

    let maxCout = count1.slice(1)

    let yMaxValue = count1.slice(1).reduce(maxVa, 0)

    for (let i = 0; i <= yMaxValue; i++) {
      yValue1.push(i)
    }
    let dataColumnChart = {
      category: category1,
      count: count1,
      value: value1,
      yValues: yValue1
    }

    if (getDisposalData && chartAsset) {
      getDisposalData(dataColumnChart)
    }

    return dataColumnChart
  }

  // Lấy dữ liệu biểu đồ trường hợp chọn hiển thị theo năm
  setDataColumnChartForYear = (type) => {
    const { getDisposalData, translate, chartAsset } = this.props
    let category1 = ['x'],
      count1 = ['Số lượng'],
      value1 = ['Giá trị'],
      yValue1 = [],
      max = []
    const maxVa = (a, b) => Math.max(a, b)
    if (chartAsset.disposalChartYear) {
      chartAsset.disposalChartYear.forEach((element) => {
        if (type.length !== 0) {
          let sumCate = 0,
            sumValue = 0
          type.forEach((value) => {
            let index = element.idAssetTypeDisposalYear.indexOf(value)
            sumCate += element.countAssetcountYear[index]
            sumValue += element.valueAssetYear[index]
          })
          category1.push(element.xType)
          count1.push(sumCate)
          value1.push(sumValue)
        } else {
          const reducer = (a, b) => a + b
          category1.push(element.xType)
          count1.push(element.countAssetcountYear.reduce(reducer))
          value1.push(element.valueAssetYear.reduce(reducer))
        }
      })
    }

    let maxCout = count1.slice(1)

    let yMaxValue = count1.slice(1).reduce(maxVa, 0)

    for (let i = 0; i <= yMaxValue; i++) {
      yValue1.push(i)
    }

    let dataColumnChart = {
      category: category1,
      count: count1,
      value: value1,
      yValues: yValue1
    }

    if (getDisposalData && chartAsset) {
      getDisposalData(dataColumnChart)
    }

    return dataColumnChart
  }

  // Thiết lập biểu đồ
  columnChart = () => {
    let { translate, listAssets } = this.props
    let { year, type } = this.state
    let filterAsset = []

    if (type && type.length) {
      listAssets.map((x) => {
        if (x.assetType.length) {
          for (let i in x.assetType) {
            for (let j in type) {
              type[j] === x.assetType[i]._id && filterAsset.push(x)
            }
          }
        }
      })
    } else {
      filterAsset = listAssets
    }

    let dataColumnChart = year == 'true' ? this.setDataColumnChartForYear(type) : this.setDataColumnChartForMonth(type)
    if (translate('asset.dashboard.amount') === 'Số lượng') {
      let chart = c3.generate({
        bindto: this.refs.DisposalColumnChart,

        data: {
          x: 'x',
          columns: [dataColumnChart.category, dataColumnChart.count, dataColumnChart.value],
          type: 'bar',
          labels: true,
          axes: {
            'Giá trị': 'y2',
            'Số lượng': 'y'
          }
        },
        axis: {
          x: {
            type: 'category'
          },
          y: {
            tick: {
              values: dataColumnChart.yValues
            },
            label: {
              text: translate('asset.dashboard.amount'),
              position: 'outer-top'
            }
          },
          y2: {
            show: true,
            label: {
              text: translate('asset.dashboard.sum_value'),
              position: 'outer-top'
            }
          }
        },
        padding: {
          top: 20,
          bottom: 20
        },
        legend: {
          show: true
        }
      })
    } else {
      let chart = c3.generate({
        bindto: this.refs.DisposalColumnChart,

        data: {
          x: 'x',
          columns: [dataColumnChart.category, dataColumnChart.count, dataColumnChart.value],
          type: 'bar',
          labels: true,
          axes: {
            Value: 'y2',
            Amount: 'y'
          }
        },
        axis: {
          x: {
            type: 'category'
          },
          y: {
            tick: {
              values: dataColumnChart.yValues
            },
            label: {
              text: translate('asset.dashboard.amount'),
              position: 'outer-top'
            }
          },
          y2: {
            show: true,
            label: {
              text: translate('asset.dashboard.sum_value'),
              position: 'outer-top'
            }
          }
        },
        padding: {
          bottom: 20
        },

        legend: {
          show: true
        }
      })
    }
  }

  //Bắt sự kiện thay đổi ngày bắt đầu
  handleChangeDateAfter = async (value) => {
    let month = value.length == 4 ? value : value.slice(3, 7) + '-' + new Number(value.slice(0, 2))
    this.INFO_SEARCH.disposalDateAfter = month
  }

  //Bắt sự kiện thay đổi ngày kết thúc
  handleChangeDateBefore = async (value) => {
    let month = value.length == 4 ? value : value.slice(3, 7) + '-' + new Number(value.slice(0, 2))
    this.INFO_SEARCH.disposalDateBefore = month
  }

  handleChangeTypeAsset = (value) => {
    if (value.length === 0) {
      value = []
    }
    this.setState((state) => {
      return {
        ...state,
        type: value
      }
    })
  }

  //Bắt sự kiện tìm kiếm
  handleSearchData = async () => {
    let disposalDateAfter = new Date(this.INFO_SEARCH.disposalDateAfter)
    let disposalDateBefore = new Date(this.INFO_SEARCH.disposalDateBefore)

    if (disposalDateAfter.getTime() > disposalDateBefore.getTime()) {
      const { translate } = this.props
      Swal.fire({
        title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
      })
    } else {
      this.props.getAllAssetGroup([
        { name: 'disposal-date-data', endTimeDisposal: disposalDateBefore, startTimeDisposal: disposalDateAfter }
      ])
    }
  }

  //Bắt sự kiện thay đổi kiểu hiển thị
  handleChangeViewChart = async (value) => {
    await this.setState((state) => {
      return {
        ...state,
        year: value[0]
      }
    })
  }

  getAssetTypes = () => {
    let { assetType } = this.props
    let typeArr = []
    assetType &&
      assetType.map((item) => {
        typeArr.push({
          _id: item._id,
          id: item._id,
          name: item.typeName,
          parent: item.parent ? item.parent._id : null
        })
      })
    return typeArr
  }

  render() {
    const { translate } = this.props
    let { year, type } = this.state
    let { disposalDateAfter, disposalDateBefore } = this.INFO_SEARCH
    let typeArr = this.getAssetTypes()

    let dateFormat = year === 'true' ? 'year' : 'month-year'
    let startValue = year === 'true' ? disposalDateAfter.slice(0, 4) : disposalDateAfter.slice(5, 7) + ' - ' + disposalDateAfter.slice(0, 4)
    let endValue =
      year === 'true' ? disposalDateBefore.slice(0, 4) : disposalDateBefore.slice(5, 7) + ' - ' + disposalDateBefore.slice(0, 4)

    this.columnChart()
    return (
      <React.Fragment>
        <div className='form-inline'>
          {/* Chọn hiển thị theo tháng/năm */}
          <div className='form-group'>
            <label>{translate('asset.dashboard.statistic_by')}</label>
            <SelectBox
              id='selectTypeOfStatistic'
              className='form-control select2'
              style={{ width: '100%' }}
              items={[
                { value: false, text: `${translate('general.month')}` },
                { value: true, text: `${translate('general.year')}` }
              ]}
              onChange={this.handleChangeViewChart}
              value={year}
              multiple={false}
              options={{ minimumResultsForSearch: 3 }}
            />
          </div>
          {/* Chọn loại tài sản */}
          <div className='form-group'>
            <label>{translate('asset.general_information.asset_type')}</label>
            <TreeSelect data={typeArr} value={type} handleChange={this.handleChangeTypeAsset} mode='hierarchical' />
          </div>
        </div>
        <div className='form-inline'>
          {/* Chọn ngày bắt đầu và kết thúc để tìm kiếm */}
          <div className='form-group'>
            <label>{translate('task.task_management.from')}</label>
            <DatePicker
              id={`disposal_after${dateFormat}`}
              dateFormat={dateFormat}
              value={startValue}
              onChange={this.handleChangeDateAfter}
              disabled={false}
            />
          </div>
          <div className='form-group'>
            <label>{translate('task.task_management.to')}</label>
            <DatePicker
              id={`disposal_before${dateFormat}`}
              dateFormat={dateFormat}
              value={endValue}
              onChange={this.handleChangeDateBefore}
              disabled={false}
            />
          </div>
          <button className='btn btn-success' onClick={this.handleSearchData}>
            {translate('task.task_management.search')}
          </button>
        </div>

        {/* Biểu đồ */}
        <div ref='DisposalColumnChart'></div>
      </React.Fragment>
    )
  }
}
function mapState(state) {
  const { chartAsset } = state.assetsManager
  return { chartAsset }
}

const mapDispatchToProps = {
  getAllAssetGroup: AssetManagerActions.getAllAssetGroup
}

const AssetDisposalChartConnect = connect(mapState, mapDispatchToProps)(withTranslate(AssetDisposalChart))
export { AssetDisposalChartConnect as AssetDisposalChart }
