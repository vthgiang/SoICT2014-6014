import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import useDeepCompareEffect from 'use-deep-compare-effect'
import c3 from 'c3'
import 'c3/c3.css'
function StatisticalSuppliesByType(props) {
  const [state, setState] = useState([])
  const { translate } = props
  useDeepCompareEffect(() => {
    let dataStatistical = [
      [translate('supplies.dashboard.valueInvoice')],
      [translate('supplies.dashboard.countInvoice')],
      [translate('supplies.dashboard.countAllocation')]
    ]

    let category = []
    if (props.suppliesData) {
      for (let i = 0; i < props.suppliesData.length; i++) {
        category.push(props.suppliesData[i].suppliesName)
      }
    }

    if (props.countInvoice) {
      for (let i = 0; i < props.countInvoice.length; i++) {
        dataStatistical[1].push(props.countInvoice[i])
      }
    }
    if (props.valueInvoice) {
      for (let i = 0; i < props.valueInvoice.length; i++) {
        dataStatistical[0].push(props.valueInvoice[i] / 1000000)
      }
    }

    if (props.countAllocation) {
      for (let i = 0; i < props.countAllocation.length; i++) {
        dataStatistical[2].push(props.countAllocation[i])
      }
    }

    let valueInvoice = translate('supplies.dashboard.valueInvoice')
    let countInvoice = translate('supplies.dashboard.countInvoice')
    let countAllocation = translate('supplies.dashboard.countAllocation')
    const types = {
      [valueInvoice]: 'line',
      [countInvoice]: 'bar',
      [countAllocation]: 'bar'
    }
    barLineChart(dataStatistical, types, category)
  }, [props.valueInvoice, props.countInvoice, props.countAllocation, props.suppliesData])

  const barLineChart = (data, types, category) => {
    let { translate } = props
    let valueInvoice = translate('supplies.dashboard.valueInvoice')
    let countInvoice = translate('supplies.dashboard.countInvoice')
    let countAllocation = translate('supplies.dashboard.countAllocation')

    const customAxes = {
      [valueInvoice]: 'y2',
      [countInvoice]: 'y',
      [countAllocation]: 'y'
    }
    const groups = [[countInvoice, countAllocation]]

    c3.generate({
      bindto: document.getElementById('statisticalSuppliesByType'),

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
          label: 'Số lượng'
        },
        y2: {
          show: true,
          label: 'Tiền ( Triệu VND)'
        }
      }
    })
  }

  return <div id='statisticalSuppliesByType'></div>
}

export default connect(null, null)(withTranslate(StatisticalSuppliesByType))
