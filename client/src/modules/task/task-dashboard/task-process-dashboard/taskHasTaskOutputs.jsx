import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { SelectMulti } from '../../../../common-components/index';

import { withTranslate } from 'react-redux-multilingual';
import { filterDifference } from '../../../../helpers/taskModuleHelpers';

import c3 from 'c3';
import 'c3/c3.css';

function TaskHasTaskOutputs(props) {
    // Khai báo props
    const { translate, tasks, taskProcess } = props;
    const { listTaskProcess } = taskProcess;
    const LABEL = {
        TASK_HAVE_OUTPUTS: "Công việc có kết quả giao nộp",
        NO_TASK_OUTPUTS: "Công việc bình thường",
        TASK_OUTPUTS_APPROVED: "Công việc có kết quả giao nộp đã phê duyệt",
    }

    const [state, setState] = useState();
    const CHART = React.createRef();
    // Khai báo state

    useEffect(() => {

        let dataPieChart, numberHasTaskOutputs = 0, numberNoTaskOutput = 0, numberTaskOutputsApproved = 0;
        let listTask = [];

        if (listTaskProcess && listTaskProcess.length) {
            for (let i in listTaskProcess) {
                for (let j in listTaskProcess[i].tasks) {
                    listTask.push(listTaskProcess[i].tasks[j]);
                }
            }
        };
        if (listTask) {
            listTask.map(task => {
                if (task.taskOutputs.length) {
                    numberHasTaskOutputs = numberHasTaskOutputs + 1;
                    let taskOutputsApproved = task.taskOutputs?.filter((item) => item.status === "approved");
                    if (taskOutputsApproved?.length > 0 && taskOutputsApproved?.length === task.taskOutputs.length) {
                        numberTaskOutputsApproved = numberTaskOutputsApproved + 1
                    }
                } else {
                    numberNoTaskOutput = numberNoTaskOutput + 1;
                }
            });
        }

        dataPieChart = [
            [LABEL.TASK_HAVE_OUTPUTS, numberHasTaskOutputs],
            [LABEL.NO_TASK_OUTPUTS, numberNoTaskOutput],
            [LABEL.TASK_OUTPUTS_APPROVED, numberTaskOutputsApproved],
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

const connectedTaskHasTaskOutputs = connect(mapState, actions)(withTranslate(TaskHasTaskOutputs));
export { connectedTaskHasTaskOutputs as TaskHasTaskOutputs };