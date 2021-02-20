import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { SlimScroll, ToolTip } from '../../index';

import * as d3 from "d3";

function CustomLegendC3js(props) {
    const { title, legendId, maxHeight=100, activate=true, verticalScroll=true, dataChartLegend, chart, chartId } = props;

    const [state, setState] = useState({
        dataTooltip: null
    });
    const { dataTooltip } = state;

    useEffect(() => {
        if (!dataTooltip) {
            customLegend(chart, chartId, legendId, dataChartLegend, maxHeight, activate);
        }
    })

    const customLegend = (chart, chartId, legendId, dataChartLegend, maxHeight, activate) => {
        let legend = window.$(`#${legendId}`).remove();

        if (chart && chartId && legendId && dataChartLegend && dataChartLegend.length > 0) {
            d3.select(`#${chartId}`).insert('div', '.tooltip2')
                .attr('id', legendId)
                .attr('class', 'legend')
                .selectAll('span')
                .data(dataChartLegend)
                .enter().append('div')
                .attr('data-id', function (id) { return id; })
                .html(function (id, index) { return (index + 1) + '. ' + id; })
                .each(function (id) {
                    d3.select(this).style('border-left', `8px solid ${chart.color(id)}`);
                    d3.select(this).style('padding-left', `5px`);
                })
                .on('mouseover',(id) => {
                    chart.focus(id);
                    setState({
                        ...state,
                        dataTooltip: id
                    })
                })
                .on('mouseout', (id) => {
                    chart.revert();
                    setState({
                        ...state,
                        dataTooltip: []
                    })
                })
                .on('click', function (id) {
                    chart.toggle(id);
                });
            
            SlimScroll.addVerticalScrollStyleCSS(legendId, maxHeight, activate);
        }
    }

    return (
        <React.Fragment>
            <label><i className="fa fa-exclamation-circle" style={{ color: '#06c', paddingRight: '5px' }} />{title}</label>
            <SlimScroll
                outerComponentId={legendId}
                maxHeight={maxHeight}
                activate={activate}
                verticalScroll={verticalScroll}
            />
            {dataTooltip && dataTooltip.length !== 0 && <ToolTip dataTooltip={[dataTooltip]} type={'latest_history'}/>}
        </React.Fragment>
    )
}

const connectedCustomLegendC3js = connect(null, null)(CustomLegendC3js);
export { connectedCustomLegendC3js as CustomLegendC3js }