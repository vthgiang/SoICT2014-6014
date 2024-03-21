import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { SlimScroll } from '../../index'

import './customLegendC3js.css'
import * as d3 from 'd3'

function CustomLegendC3js(props) {
  const { title, legendId, maxHeight = 100, activate = true, verticalScroll = true, dataChartLegend, chart, chartId } = props

  useEffect(() => {
    customLegend(chart, chartId, legendId, dataChartLegend, maxHeight, activate)
  })

  const customLegend = (chart, chartId, legendId, dataChartLegend, maxHeight, activate) => {
    let legend = window.$(`#${legendId}`).remove()

    if (chart && chartId && legendId && dataChartLegend && dataChartLegend.length > 0) {
      d3.select(`#${chartId}`)
        .insert('div', '.tooltip2')
        .attr('id', legendId)
        .attr('class', 'legend-c3js')
        .selectAll('span')
        .data(dataChartLegend)
        .enter()
        .append('div')
        .attr('id', function (id, index) {
          return index
        })
        .attr('data-id', function (id) {
          return id
        })
        .attr('title', function (id) {
          return id
        })
        .html(function (id, index) {
          return index + 1 + '. ' + id
        })
        .each(function (id) {
          d3.select(this).style('border-left', `8px solid ${chart.color(id)}`)
          d3.select(this).style('padding-left', `5px`)
        })
        .on('mouseover', (id, index) => {
          chart.focus(id)

          window.$(`#${legendId} > #${index}`).addClass('not-opacity')
          window.$(`#${legendId} > div`).addClass('opacity')
        })
        .on('mouseout', (id, index) => {
          chart.revert()

          window.$(`#${legendId} > #${index}`).removeClass('not-opacity')
          window.$(`#${legendId} > div`).removeClass('opacity')
        })
        .on('click', function (id, index) {
          chart.toggle(id)

          window.$(`#${legendId} > #${index}`).removeClass('not-opacity')
          window.$(`#${legendId} > div`).removeClass('opacity')
          window.$(`#${legendId} > #${index}`).toggleClass('opacity-click')
        })

      SlimScroll.addVerticalScrollStyleCSS(legendId, maxHeight, activate)
    }
  }

  return (
    <React.Fragment>
      <label>{title}</label>
      <SlimScroll outerComponentId={legendId} maxHeight={maxHeight} activate={activate} verticalScroll={verticalScroll} />
    </React.Fragment>
  )
}

const connectedCustomLegendC3js = connect(null, null)(CustomLegendC3js)
export { connectedCustomLegendC3js as CustomLegendC3js }
