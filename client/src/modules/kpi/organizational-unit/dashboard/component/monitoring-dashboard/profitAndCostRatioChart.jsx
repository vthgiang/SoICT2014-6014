import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import { withTranslate } from 'react-redux-multilingual';

function ProfitAndCostChartChart(props) {
    const { data } = props;

    useEffect(() => {
        pieChart();
    }, [data])

    const removePreviousChart = () => {
        const chart = document.getElementById("profit-and-cost-ratio");

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    const pieChart = () => {
        removePreviousChart();
        c3.generate({
            bindto: document.getElementById("profit-and-cost-ratio"),

            data: {
                columns: [
                    ['Lợi nhuận', data.profit],
                    ['Chi phí', data.cost],
                ],
                type: 'donut',
            },
            donut: {
                title: "Profit and Cost"
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
                <section id="profit-and-cost-ratio"></section>
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

const connectedProfitAndCostChart = connect(mapState, actions)(withTranslate(ProfitAndCostChartChart));
export { connectedProfitAndCostChart as ProfitAndCostChartChart };
