import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import c3 from 'c3'
import 'c3/c3.css'
import { DataTableSetting, PaginateBar } from '../../../../../../common-components'
import { getTableConfiguration } from '../../../../../../helpers/tableConfiguration'
import _deepClone from 'lodash/cloneDeep'

function ExistBarChart(props) {
  const [state, setState] = useState(() => initState())

  const { perPage, nameSupplies, supplyCount, page, pageTotal, total, display } = state
  function initState() {
    const defaultConfig = { limit: 10 }
    const boughtSupplyId = 'exist'
    const boughtSupplyPerPage = getTableConfiguration(boughtSupplyId, defaultConfig).limit

    return {
      perPage: boughtSupplyPerPage
    }
  }

  const { translate, existSupplies } = props

  const getDataChart = () => {
    let valueSupplies = []

    for (let i = 0; i < existSupplies.length; i++) {
      valueSupplies.push([existSupplies[i].name, existSupplies[i].price])
    }

    let lineBarChart = [[translate('asset.dashboard.value')]]

    const indices = { value: 0 }

    for (const [key, value] of valueSupplies) {
      lineBarChart[indices.value].push(value)
    }

    return lineBarChart
  }

  useEffect(() => {
    let data = _deepClone(getDataChart())
    let nameSupplies = existSupplies?.map((item) => item.supplyName)?.slice(0, perPage)
    let supplyCount = data
    for (let i in supplyCount) {
      supplyCount[i] = supplyCount[i].slice(0, 1).concat(supplyCount[i].slice(1, perPage + 1))
    }
    setState({
      ...state,
      nameSupplies: nameSupplies,
      supplyCount: supplyCount,
      total: existSupplies?.length,
      pageTotal: Math.ceil(existSupplies?.length / perPage),
      page: 1,
      display: nameSupplies.length
    })
    console.log('state: ', state)
  }, [JSON.stringify(existSupplies)])

  useEffect(() => {
    if (state.nameSupplies && state.supplyCount) {
      barLineChart()
    }
  }, [JSON.stringify(state.nameSupplies), JSON.stringify(state.supplyCount)])

  const handlePaginationDistributionOfEmployeeChart = (page) => {
    let dataChart = getDataChart()
    if (dataChart) {
      let data = _deepClone(dataChart)
      let begin = (Number(page) - 1) * perPage
      let end = (Number(page) - 1) * perPage + perPage
      let nameSupplies = existSupplies?.map((item) => item.supplyName)?.slice(begin, end)
      let supplyCount = data
      for (let i in supplyCount) {
        supplyCount[i] = supplyCount[i].slice(0, 1).concat(supplyCount[i].slice(begin + 1, end + 1))
      }

      setState({
        ...state,
        nameSupplies: nameSupplies,
        supplyCount: supplyCount,
        page: page,
        display: nameSupplies.length
      })
    }
  }
  const setLimitDistributionOfEmployeeChart = (limit) => {
    const dataChart = getDataChart()

    if (dataChart) {
      let data = _deepClone(dataChart)
      let nameSupplies = existSupplies?.map((item) => item.supplyName)?.slice(0, Number(limit))
      let supplyCount = data
      for (let i in supplyCount) {
        supplyCount[i] = supplyCount[i].slice(0, 1).concat(supplyCount[i].slice(1, Number(limit) + 1))
      }

      setState({
        ...state,
        nameSupplies: nameSupplies,
        supplyCount: supplyCount,
        total: existSupplies?.length,
        pageTotal: Math.ceil(existSupplies?.length / Number(limit)),
        page: 1,
        perPage: Number(limit),
        display: nameSupplies.length
      })
    }
  }
  const removePreviousChart = () => {
    const chart = document.getElementById('exist')

    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }

  const barLineChart = () => {
    removePreviousChart()

    let data = supplyCount
    let value = 'Giá trị'
    const types = {
      [value]: 'bar'
    }
    const groups = [[value]]
    // thay đổi bằng giá trị name trong phần existSupplies
    const category = nameSupplies ? nameSupplies : []

    const customAxes = {
      [value]: 'y'
    }

    c3.generate({
      bindto: document.getElementById('exist'),

      data: {
        columns: data,
        types: types,
        axes: customAxes,
        groups: groups
      },

      padding: {
        bottom: 20,
        right: 20
      },

      axis: {
        x: {
          type: 'category',
          categories: category,
          tick: {
            multiline: false
          }
        },
        y: {
          label: 'Tiền (vnđ)',
          tick: {
            format: function (value) {
              let valueByUnit, unit
              if (value >= 1000000000) {
                valueByUnit = Math.round(value / 1000000000)
                unit = 'B'
              } else {
                valueByUnit = Math.round(value / 1000000)
                unit = 'M'
              }
              return valueByUnit + unit
            }
          }
        }
      }
    })
  }

  return (
    <>
      <DataTableSetting tableId={'exist-table'} setLimit={setLimitDistributionOfEmployeeChart} />

      <div className='box box-solid' style={{ marginTop: '30px' }}>
        <div className='box-body qlcv'>
          <div id='exist' />
        </div>

        <PaginateBar
          display={display}
          total={total}
          pageTotal={pageTotal}
          currentPage={page}
          func={handlePaginationDistributionOfEmployeeChart}
        />
      </div>
    </>
  )
}

export default connect(null, null)(withTranslate(ExistBarChart))
