import React, { useEffect, memo } from 'react';
import { withTranslate } from 'react-redux-multilingual';

import './hoursSpentOfEmployeeChart.css';
import c3 from 'c3';
import 'c3/c3.css';

function HoursSpentOfEmployeeChart(props) {
    const { data, refs } = props;

    useEffect(() => {
        if (data) {
            pieChart(refs, data);
        }
    })

    const removePreviousChart = (refs) => {
        const chart = document.getElementById(refs);

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    const getTimes = (ms) => {
        if (!ms) return '00:00:00';
        let hour = Math.floor(ms / (60 * 60 * 1000));
        let minute = Math.floor((ms - hour * 60 * 60 * 1000) / (60 * 1000));
        let second = Math.floor((ms - hour * 60 * 60 * 1000 - minute * 60 * 1000) / 1000);

        return `${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}:${second > 9 ? second : `0${second}`}`;
    }

    const setDataPieChart = (data) => {
        // console.log("data time", data);
        let dataChart;
        dataChart = Object.entries(data);
        if (dataChart && dataChart.length !== 0) {
            dataChart = dataChart.map(item => {
                return [item[0] + " (" + getTimes(item[1]) + ")", item[1]]
            })
        }
        return dataChart;
    }

    const pieChart = (refs, data) => {
        removePreviousChart(refs);

        let dataPieChart;
        dataPieChart = setDataPieChart(data);

        const chart = c3.generate({
            bindto: document.getElementById(refs),
            size: {
                height: 160,
            },

            data: {
                columns: dataPieChart,
                type: 'pie',
            },

            tooltip: {
                format: {
                    name: function (name) {
                        name = name.split("(");
                        return name[0];
                    },
                    value: function (value) {
                        return (value  / (60 * 60 * 1000)).toFixed(2) + "h"
                    }
                }
            },

            legend: {
                position: 'right'
            }
        });
    }

    return (
        <React.Fragment>
            <div id={refs} className={"hoursSpentOfEmployee " + refs}></div>
        </React.Fragment>
    )
}

const shouldNotComponentUpdate = (prevProps, nextProps) => {
    if (nextProps.refs !== prevProps.refs) {
        return false;
    }
};

const connectedHoursSpentOfEmployeeChart = withTranslate(memo(HoursSpentOfEmployeeChart, shouldNotComponentUpdate));
export { connectedHoursSpentOfEmployeeChart as HoursSpentOfEmployeeChart }
