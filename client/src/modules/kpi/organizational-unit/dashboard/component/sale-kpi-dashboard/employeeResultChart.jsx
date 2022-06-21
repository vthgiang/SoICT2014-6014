import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import { useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';

function EmployeeResultChart(props) {
    const { data } = props;
    const [dataChart, setDataChart] = useState(['Doanh thu']);
    const [labels, setLabels] = useState();

    useEffect(() => {

        barChart();
    }, [])

    const removePreviousChart = () => {
        const chart = document.getElementById("employeeResultChart");

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    const barChart = () => {
        removePreviousChart();
        c3.generate({
            bindto: document.getElementById("employeeResultChart"),

            data: {
                columns: [['Đóng góp', 90, 85, 70, 80, 92]],
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
                    categories: ['Nguyễn Văn A', 'Hoàng Thị B', 'Lê Đức C', 'Bùi Văn D', 'Thị Văn E'],
                },
                rotate: true
            },
        });
    }
    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <section id="employeeResultChart"></section>
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

const connectedEmployeeResultChart = connect(mapState, actions)(withTranslate(EmployeeResultChart));
export { connectedEmployeeResultChart as EmployeeResultChart };
