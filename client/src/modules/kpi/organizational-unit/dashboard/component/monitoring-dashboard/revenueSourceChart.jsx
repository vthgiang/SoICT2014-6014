import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import { useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';

function RevenueSourceChart(props) {
    const { data } = props;
    const [dataChart, setDataChart] = useState(['Doanh thu']);
    const [labels, setLabels] = useState();

    useEffect(() => {
        const dataChart = ['Doanh thu'];
        const labels = [];

        for (let item of data.revenueSource) {
            dataChart.push(item.value);
            labels.push(item.from);
        }

        barChart(dataChart, labels);
    }, [data])

    const removePreviousChart = () => {
        const chart = document.getElementById("revenueSourceChart");

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    const barChart = (data, labels) => {
        removePreviousChart();
        c3.generate({
            bindto: document.getElementById("revenueSourceChart"),

            data: {
                columns: [data],
                type: 'bar'
            },

            legend: {
                show: true
            },

            padding: {
                top: 20,
                bottom: 20,
                right: 20,
            },

            axis: {
                x: {
                    type: 'category',
                    categories: labels,
                    rotate: true
                }
            },
        });
    }
    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <section id="revenueSourceChart"></section>
            </div>
        </React.Fragment>
    )
}


const mapState = (state) => {
    const { user, tasks, dashboardEvaluationEmployeeKpiSet } = state;
    return { user, tasks, dashboardEvaluationEmployeeKpiSet };
}

const actions = {
};

const connectedRevenueSourceChart = connect(mapState, actions)(withTranslate(RevenueSourceChart));
export { connectedRevenueSourceChart as RevenueSourceChart };
