import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import c3 from 'c3';
import 'c3/c3.css';

function TaskHasDepartments(props) {
    // Khai báo props
    const { translate, tasks, taskProcess } = props;
    const { listTaskProcess } = taskProcess;
    const LABEL = {
        TASK_HAS_DEPARTMENTS: "Quy trình đồng trình",
        NORMALLY_TASK: "Quy trình thông thường",
    }

    const [state, setState] = useState();
    const CHART = React.createRef();
    // Khai báo state

    useEffect(() => {

        let dataPieChart, numberHasDepartment = 0, numberNomarmallyTask = 0;
        let listTask = [];

        if (listTaskProcess && listTaskProcess.length) {
            for (let i in listTaskProcess) {
                let checkProcessHasDepartment = 0;
                for (let j in listTaskProcess[i].tasks) {
                    if (listTaskProcess[i].tasks[j].collaboratedWithOrganizationalUnits.length) {
                        checkProcessHasDepartment = checkProcessHasDepartment + 1;
                        break;
                    }
                }

                if (checkProcessHasDepartment) {
                    numberHasDepartment = numberHasDepartment + 1;
                } else {
                    numberNomarmallyTask = numberNomarmallyTask + 1;
                }
            }
        };

        dataPieChart = [
            [LABEL.TASK_HAS_DEPARTMENTS, numberHasDepartment],
            [LABEL.NORMALLY_TASK, numberNomarmallyTask],
        ];
        setState({
            ...state,
            dataChart: dataPieChart
        });
    }, [JSON.stringify(listTaskProcess)])

    useEffect(() => {
        if (state?.dataChart) {
            pieChart();
        }
    }, [JSON.stringify(state?.dataChart)])

    // Xóa các chart đã render khi chưa đủ dữ liệu
    const removePreviousChart = () => {
        const chart = CHART.current;
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    // Khởi tạo PieChart bằng C3
    const pieChart = () => {
        removePreviousChart();
        const { dataChart } = state;
        c3.generate({
            bindto: CHART.current,

            data: {                                 // Dữ liệu biểu đồ
                columns: dataChart,
                type: 'pie',
            },

            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            tooltip: {
                format: {
                    value: function (value, ratio, id, index) {
                        return value;

                    }
                }
            }
        });
    }
    return (
        <React.Fragment>
            <div ref={CHART}></div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { tasks, taskProcess } = state;
    return { tasks, taskProcess }
}
const actions = {
}

const connectedTaskHasDepartments = connect(mapState, actions)(withTranslate(TaskHasDepartments));
export { connectedTaskHasDepartments as TaskHasDepartments };