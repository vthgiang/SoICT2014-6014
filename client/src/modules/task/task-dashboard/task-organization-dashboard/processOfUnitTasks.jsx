import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import c3 from 'c3';
import 'c3/c3.css';

const InprocessOfUnitTask = (props) => {
    const { translate, tasks, } = props;
    const { unitNameSelected } = props
    const { taskDashboardCharts } = tasks
    const [state, setState] = useState()
    useEffect(() => {
        let dataChart = getDataChart("in-process-unit-chart")
        if (dataChart) {
            dataChart[0][0] = translate('task.task_management.delayed_time')
            dataChart[1][0] = translate('task.task_management.in_time')
            dataChart[2][0] = translate('task.task_management.not_achieved')
            setState({
                ...state,
                dataChart: dataChart
            })
        }

    }, [JSON.stringify(taskDashboardCharts)])

    useEffect(() => {
        if (state?.dataChart) {
            barChart();
        }
    }, [JSON.stringify(state?.dataChart)])

    function getDataChart(chartName) {
        let dataChart;
        let data = taskDashboardCharts?.[chartName]
        if (data) {
            dataChart = data.dataChart
        }
        return dataChart;
    }

    const barChart = () => {
        const { dataChart } = state
        let height = unitNameSelected?.length ? unitNameSelected.length * 60 : 0;
        let heightOfChart = height > 500 ? height : 500;
        c3.generate({
            bindto: document.getElementById("inprocessOfUnitTask"),

            data: {
                columns: dataChart,
                type: 'bar',
                groups: [
                    [translate('task.task_management.delayed_time'),
                    translate('task.task_management.in_time'),
                    translate('task.task_management.not_achieved')]
                ]
            },

            size: {
                height: heightOfChart
            },

            color: {
                pattern: ['#f39c12 ', '#28A745', '#DD4B39']
            },

            axis: {
                x: {
                    type: 'category',
                    categories: unitNameSelected?.length > 0 ? unitNameSelected : []
                },
                rotated: true
            },
            bar: {
                width: {
                    ratio: unitNameSelected?.length < 4 ? 0.1 : 0.5 // this makes bar width 50% of length between ticks
                }
            }
        });
    }

    return (
        <React.Fragment>
            <section id="inprocessOfUnitTask"></section>
        </React.Fragment>
    )
}

function mapState(state) {
    const { tasks } = state
    return { tasks }
}

const connectedInprocessOfUnitTask = connect(mapState, null)(withTranslate(InprocessOfUnitTask));
export { connectedInprocessOfUnitTask as InprocessOfUnitTask };
