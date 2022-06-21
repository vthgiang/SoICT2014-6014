import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import { withTranslate } from 'react-redux-multilingual';

function CompleteTargetKpiRatioChart(props) {
    const { data } = props;

    useEffect(() => {
        pieChart();
    }, [])

    const removePreviousChart = () => {
        const chart = document.getElementById("complete-target-kpi-ratio");

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    const pieChart = () => {
        removePreviousChart();
        c3.generate({
            bindto: document.getElementById("complete-target-kpi-ratio"),

            data: {
                columns: [
                    ['Đạt', 50],
                    ['Chưa đạt', 50],
                ],
                type: 'donut',
            },
            donut: {
                title: "Tỉ lệ hoàn thành tiêu chí"
            },

            legend: {
                show: true
            },

            padding: {
                top: 20,
                bottom: 20,
                right: 20,
            },

        });
    }
    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <section id="complete-target-kpi-ratio"></section>
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

const connectedProfitAndCostChart = connect(mapState, actions)(withTranslate(CompleteTargetKpiRatioChart));
export { connectedProfitAndCostChart as CompleteTargetKpiRatioChart };
