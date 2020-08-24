import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TaskReportActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../common-components';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { LineBarChart } from './lineBarChart';
import { PieChart } from './pieChart';
class TaskReportViewForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartType: '',
            aggregationType: '',
        }
    }

    formatPriority = (data) => {
        if (data === 1) return "Thấp";
        if (data === 2) return "Trung bình";
        if (data === 3) return "Cao";
    }

    formatChartType = (chartType) => {
        if (chartType === '0') return "bar";
        if (chartType === '1') return "line";
        if (chartType === '2') return "pie";
    }

    // hamf convert month-year gom nhóm công viêc theo tháng
    convertMonthYear = (data) => {
        const time = new Date(data);
        const month = time.getMonth();
        const year = time.getFullYear();
        return `${year}-${month + 1}`;
    }

    // Hmaf convert year, gom nhóm công việc theo năm
    convertYear = (data) => {
        const time = new Date(data);
        const year = time.getFullYear();
        return `${year}`;
    }

    //Hàm convert gom nhóm công việc theo quý
    getQuarter = (data) => {
        const time = new Date(data);
        let quarter = Math.floor((time.getMonth() + 3) / 3);
        let year = (`Quý${quarter}-`) + time.getFullYear();
        return `${year}`;
    }

    // Hàm tính tổng và trung bình cộng task evaluation 
    aggregate = (tasks) => {
        let map = new Map;
        for (let { aggregationType, coefficient, code, value, chartType, showInReport } of tasks) {
            let entry = map.get(code);
            if (!entry) map.set(code, entry = { aggregationType, chartType, showInReport, coefficient, sum: 0, count: 0 });
            entry.sum += value;
            entry.count++;
        }
        return Array.from(map, ([code, { aggregationType, chartType, showInReport, coefficient, sum, count }]) =>
            [code, (+aggregationType ? sum : sum / count) * coefficient, this.formatChartType(chartType), showInReport]
        );
    }


    render() {
        const { tasks, user, reports, translate } = this.props;
        let formater = new Intl.NumberFormat();
        let listTaskEvaluation = tasks.listTaskEvaluations;
        let taskInfoName, headTable = [], frequency, newlistTaskEvaluation;


        // hiển thị trường thông tin hiện trong báo cáo
        if (listTaskEvaluation && listTaskEvaluation.length !== 0) {
            taskInfoName = listTaskEvaluation[0];
            taskInfoName.taskInformations.forEach(x => {
                if (x.type === "Number") {
                    headTable = [...headTable, x.name];
                }
            })
        }


        if (listTaskEvaluation) {
            // Lấy tần suất từ server gửi
            let taskEvaluation = listTaskEvaluation[0];
            frequency = taskEvaluation.frequency;

            // Lọc lấy các trường cần thiết.
            newlistTaskEvaluation = listTaskEvaluation.map(item => {
                return {
                    time: (frequency && frequency === 'month') ? this.convertMonthYear(item.date)
                        : (frequency === 'quarter' ? this.getQuarter(item.date) : this.convertYear(item.date)),
                    task: item.taskInformations.filter(task => {
                        if (task.type === 'Number')
                            return task;
                    })
                }
            });
        }

        //Gom nhóm công việc theo tháng-năm-quys
        let groupDataByDate;
        if (newlistTaskEvaluation) {
            groupDataByDate = newlistTaskEvaluation.reduce((groups, item) => {
                groups[item.time] = [...groups[item.time] || [], item];
                return groups;
            }, {});
        }

        let output, pieChartData = [], barLineChartData = [], pieDataConvert;

        if (groupDataByDate) {
            output = Object.entries(groupDataByDate).map(([time, datapoints]) => {
                let allTasks = datapoints.flatMap(point => point.task);
                // Gán newName cho code 
                allTasks.map(item => {
                    if (item.newName) {
                        item.code = item.newName;
                    } else {
                        item.code = item.code;
                    }
                    return item;
                })

                let result = this.aggregate(allTasks); // gọi hàm tính trung bình cộng và tổng 
                return {
                    time,
                    tasks: result.map(([code, value, chartType, showInReport]) => ({ code, value, chartType, showInReport })),
                }
            });

            // tách data vẽ biểu đồ cột+đường với tròn
            output.forEach(x => {
                let tasks = x.tasks.filter(y =>
                    y.chartType === "pie" ? (pieChartData.push({ tasks: [y], time: x.time }), false) : true)
                if (tasks.length > 0) {
                    barLineChartData.push({
                        time: x.time,
                        tasks: tasks,
                    })
                }

            })
        }


        if (pieChartData && pieChartData.length > 0) {
            // convert Data pieChart
            let groupByCode = {};
            pieChartData.flatMap(item => item.tasks.map(task => ({ ...task, time: item.time }))
            ).forEach(childTask => {
                if (groupByCode[childTask.code]) {
                    groupByCode[childTask.code].push(childTask)
                } else {
                    groupByCode[childTask.code] = [childTask];
                }
            })

            pieDataConvert = Object.entries(groupByCode).map(([code, tasks]) => ({
                [code]: tasks.map((task) => [task.time, task.value])
            }))
        }


        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-view-taskreport" isLoading={false}
                    formID="form-view-tasktemplate"
                    title="Xem chi tiết báo cáo"
                    hasSaveButton={true}
                    func={this.save}
                    size={100}
                    hasNote={false}
                >
                    {/* Modal Body */}
                    <div className="row">
                        {
                            barLineChartData.length > 0 &&
                            <div className=" col-lg-6 col-md-6 col-md-sm-6 col-xs-12">
                                <LineBarChart barLineChartData={barLineChartData} />
                            </div>
                        }

                        {
                            pieDataConvert && pieDataConvert.map((item, index) => (
                                Object.entries(item).map(([code, data]) => (
                                    <div key={index} className=" col-lg-6 col-md-6 col-md-sm-6 col-xs-12">
                                        <PieChart pieChartData={data} namePieChart={code} />
                                    </div>
                                ))
                            ))

                        }
                    </div>
                    <div className="form-inline">
                        <button id="exportButton" className="btn btn-sm btn-success " style={{ marginBottom: '10px' }}><span className="fa fa-file-excel-o"></span> Export to Excel</button>
                    </div>
                    <div className="row box" >
                        <div className="box-header">
                            <div class="box-tools pull-right">
                                <button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                            </div>
                        </div>

                        <div className="col-md-12 box-body">
                            <table className="table table-hover table-striped table-bordered" id="report_manager" style={{ marginBottom: '0px !important' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'center' }}>Công việc</th>
                                        <th style={{ textAlign: 'center' }}>Người thực hiện</th>
                                        <th style={{ textAlign: 'center' }}>Người phê duyệt</th>
                                        <th style={{ textAlign: 'center' }}>
                                            Điểm hệ thống tự tính
                                    </th>
                                        <th style={{ textAlign: 'center' }}>
                                            Ngày bắt đầu
                                    </th>
                                        <th style={{ textAlign: 'center' }}>
                                            Ngày kết thúc
                                    </th>
                                        <th style={{ textAlign: 'center' }}>
                                            Ngày đánh giá
                                    </th>
                                        <th style={{ textAlign: 'center' }}>
                                            Mức độ ưu tiên
                                    </th>
                                        <th style={{ textAlign: 'center' }}>
                                            Trạng thái công việc
                                    </th>
                                        {
                                            headTable && headTable.map((x, key) => (<th key={key}>{x}</th>))
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        tasks.listTaskEvaluations && tasks.listTaskEvaluations.map((item, key) => {
                                            //Lấy tên người thực hiện 
                                            let getNameResponsibleEmployees = user.usercompanys.filter(item1 => item1._id === item.responsibleEmployees);
                                            getNameResponsibleEmployees = getNameResponsibleEmployees.map(x1 => x1.name);

                                            //Lấy tên người phê duyệt
                                            let getNameAccountableEmployees = user.usercompanys.filter(item2 => item2._id === item.accountableEmployees);
                                            getNameAccountableEmployees = getNameAccountableEmployees.map(x2 => x2.name);

                                            // lấy điểm tự động của các công việc
                                            let result = item.results, point = [];
                                            if (result) {
                                                result = result[0];
                                                point = result.automaticPoint;
                                            }

                                            let contentTable = [];
                                            if (headTable) {
                                                item.taskInformations.forEach(element => {
                                                    if (element.type === 'Number') {
                                                        contentTable = [...contentTable, element.value]
                                                    }
                                                })
                                            }
                                            return (
                                                <tr key={key}>
                                                    <td className="text-center" className="text-center">{item.name}</td>
                                                    <td className="text-center">
                                                        {
                                                            getNameResponsibleEmployees.join(', ')
                                                        }
                                                    </td>
                                                    <td className="text-center">
                                                        {
                                                            getNameAccountableEmployees.join(',')
                                                        }
                                                    </td>
                                                    <td className="text-center">
                                                        {
                                                            point
                                                        }
                                                    </td>
                                                    <td className="text-center">{item.startDate.slice(0, 10)}</td>
                                                    <td className="text-center">{item.endDate.slice(0, 10)}</td>
                                                    <td className="text-center">{item.date.slice(0, 10)}</td>
                                                    <td className="text-center">
                                                        {
                                                            item.priority === 1 ? 'Thấp' : (item.priority === 2 ? 'Trung bình' : 'Cao')
                                                        }
                                                    </td>
                                                    <td className="text-center">{item.status}</td>

                                                    {
                                                        contentTable && contentTable.map((x, index) => (<td key={index}>{formater.format(parseInt(x))} VNĐ</td>))
                                                    }

                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        {reports.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            tasks.listTaskEvaluations && tasks.listTaskEvaluations.length === 0 && <div className="table-info-panel" style={{ width: '100%' }}>{translate('confirm.no_data')}</div>}
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks, user, reports } = state;
    return { tasks, user, reports };
}

const actionCreators = {
    createTaskReport: TaskReportActions.createTaskReport,
    getTaskEvaluations: taskManagementActions.getTaskEvaluations,
}

const viewForm = connect(mapState, actionCreators)(withTranslate(TaskReportViewForm));

export { viewForm as TaskReportViewForm };