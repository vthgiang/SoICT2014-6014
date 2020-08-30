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


    /**
     * @param {*} data:time
     * 
     * Hàm convert thời gian ra tháng
     */
    convertMonthYear = (data) => {
        const time = new Date(data);
        const month = time.getMonth();
        const year = time.getFullYear();
        return `${year}-${month + 1}`;
    }


    // 
    /**
     * @param {*} data : Time
     * 
     * Hàm convert thời gian ra năm
     */
    convertYear = (data) => {
        const time = new Date(data);
        const year = time.getFullYear();
        return `${year}`;
    }


    /**
     * @param {*} data Time
     * 
     * Hàm convert thời gian ra quý
     */
    getQuarter = (data) => {
        const time = new Date(data);
        let quarter = Math.floor((time.getMonth() + 3) / 3);
        let year = (`Quý${quarter}-`) + time.getFullYear();
        return `${year}`;
    }


    /**
     * @param {*} tasks Danh sách công việc
     * 
     * Hàm gom nhóm các công việc theo thời gian
     */
    groupByDate = (tasks) => {
        return tasks.reduce((groups, item) => {
            groups[item.time] = [...groups[item.time] || [], item];
            return groups;
        }, {});
    }


    /**
     * @param {*} tasks Danh sách các công việc
     * 
     * Hàm gom nhóm các công việc theo người thực hiện
     */
    groupByResponsibleEmployees = (tasks) => {
        return tasks.reduce((groups, item) => {
            groups[item.responsibleEmployees.toString()] = [...groups[item.responsibleEmployees.toString()] || [], item];
            return groups;
        }, {});
    }


    /**
     * @param {*} tasks Danh sách các công việc
     * 
     * Hàm gom nhóm các công việc theo người phê duyệt
     */
    groupByAccountableEmployees = (tasks) => {
        return tasks.reduce((groups, item) => {
            groups[item.accountableEmployees.toString()] = [...groups[item.accountableEmployees.toString()] || [], item];
            return groups;
        }, {});
    }


    /**
     * @param {*} tasks Danh sách các công việc đã convert đúng định dạng đầu vào
     * 
     * Hàm tính tổng và trung bình cộng các công việc
     */
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


    /**
     * @param {*} input 
     * 
     * Hàm Convert data sau khi tính toán
     */
    dataAfterAggregate = (input) => {
        return Object.entries(input).map(([time, datapoints]) => {
            console.log('datapoints', datapoints)
            let allTasks = datapoints.flatMap(point => point.task.map(x => ({ ...x, responsibleEmployees: point.responsibleEmployees, accountableEmployees: point.accountableEmployees })))
            // Tên mới cho trường thông tin
            allTasks.map(item => {
                if (item.newName) {
                    item.code = item.newName;
                } else {
                    item.code = item.code;
                }
                return item;
            })

            let result = this.aggregate(allTasks); // gọi hàm tính trung bình cộng và tổng. 

            return {
                time,
                tasks: result.map(([code, value, chartType, showInReport]) => ({ code, value, chartType, showInReport })),
            }
        });
    }


    /**
     * @param {*} input 
     * 
     * Hàm convert data qua dạng pieChart khi chọn 1 chiều dữ liệu
     */
    convertDataPieChartOneWay = (input) => {
        let groupByCode = {}, pieDataConvert;

        input.flatMap(item => item.tasks.map(task => ({ ...task, time: item.time }))
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
        return pieDataConvert;
    }


    render() {
        const { tasks, reports, translate } = this.props;
        let formater = new Intl.NumberFormat();
        let listTaskEvaluation = tasks.listTaskEvaluations;
        console.log('taskEvaluation', listTaskEvaluation)

        let taskInfoName, headTable = [], frequency, newlistTaskEvaluation, dataForAxisXInChart = [];

        // hiển thị trường thông tin hiện trong bảng báo cáo form preview view
        if (listTaskEvaluation && listTaskEvaluation.length !== 0) {
            taskInfoName = listTaskEvaluation[0];
            taskInfoName.taskInformations.forEach(x => {
                if (x.type === "Number") {
                    headTable = [...headTable, x.name];
                }
            })
        }


        if (listTaskEvaluation) {
            // Lấy tần suất và chiều dữ liệu vẽ biểu đồ từ server gửi
            let taskEvaluation = listTaskEvaluation[0];
            frequency = taskEvaluation.frequency;

            dataForAxisXInChart = taskEvaluation.dataForAxisXInChart;
            if (dataForAxisXInChart.length > 0) {
                dataForAxisXInChart = dataForAxisXInChart.map(x => x.id).toString();
            } else {
                dataForAxisXInChart = dataForAxisXInChart;
            }

            // Lọc lấy các trường cần thiết.
            newlistTaskEvaluation = listTaskEvaluation.map(item => {
                return {
                    time: (frequency && frequency === 'month') ? this.convertMonthYear(item.date)
                        : (frequency === 'quarter' ? this.getQuarter(item.date) : this.convertYear(item.date)),
                    task: item.taskInformations.filter(task => {
                        if (task.type === 'Number')
                            return task;
                    }),
                    responsibleEmployees: item.responsibleEmployees.map(x => x.name),
                    accountableEmployees: item.accountableEmployees.map(x => x.name),
                }
            });

        }

        console.log('dataForAxisXInChart', dataForAxisXInChart)
        let output, pieChartData = [], barLineChartData = [], pieDataConvert;

        /**
       * Convert data gom nhóm, tính tổng và tính trung bình cộng các trường thông tin.
       *  Nếu chọn trục hoành là thời gian
       */

        if (dataForAxisXInChart === "1" || dataForAxisXInChart.length === 0) {
            let groupDataByDate;
            if (newlistTaskEvaluation) {
                groupDataByDate = this.groupByDate(newlistTaskEvaluation);
            }

            if (groupDataByDate) {
                output = this.dataAfterAggregate(groupDataByDate);

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
                pieDataConvert = this.convertDataPieChartOneWay(pieChartData);
            }

        } else if (dataForAxisXInChart === "2") {

            /**
             * Convert data, gom nhóm theo người thực hiện, tính trung bình cộng các trường thông tin.
             * Nếu trục hoành là người thực hiện dataForAxisXInChart = '2'
             */

            let groupDataByResponsibleEmployees;
            if (newlistTaskEvaluation) {
                let results = [];

                // tách người thực hiện 
                newlistTaskEvaluation.forEach(x => {
                    x.responsibleEmployees.forEach(y => {
                        results.push({
                            time: x.time,
                            task: x.task,
                            responsibleEmployees: y,
                        })
                    })
                })
                groupDataByResponsibleEmployees = this.groupByResponsibleEmployees(results);
            }


            if (groupDataByResponsibleEmployees) {
                output = this.dataAfterAggregate(groupDataByResponsibleEmployees);
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
                pieDataConvert = this.convertDataPieChartOneWay(pieChartData);
            }

        } else if (dataForAxisXInChart === "3") {
            /**
            * Convert data, gom nhóm theo người phê duyệt, tính trung bình cộng các trường thông tin.
            * Nếu trục hoành là người phê duyệt dataForAxisXInChart = '3'
            */

            let groupDataByAccountableEmployees;
            if (newlistTaskEvaluation) {
                let results = [];

                // tách người thực hiện 
                newlistTaskEvaluation.forEach(x => {
                    x.accountableEmployees.forEach(y => {
                        results.push({
                            time: x.time,
                            task: x.task,
                            accountableEmployees: y,
                        })
                    })
                })
                groupDataByAccountableEmployees = this.groupByAccountableEmployees(results);
            }

            if (groupDataByAccountableEmployees) {
                output = this.dataAfterAggregate(groupDataByAccountableEmployees);
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

            // convert Data pieChart theo dạng c3
            if (pieChartData && pieChartData.length > 0) {
                pieDataConvert = this.convertDataPieChartOneWay(pieChartData);
            }
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
                            <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <LineBarChart barLineChartData={barLineChartData} />
                            </div>
                        }

                        {
                            pieDataConvert && pieDataConvert.map((item, index) => (
                                Object.entries(item).map(([code, data]) => (
                                    <div key={index} className=" col-lg-6 col-md-6 col-sm-12 col-xs-12">
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
                            <div className="box-tools pull-right">
                                <button className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
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
                                            let getNameResponsibleEmployees = item.responsibleEmployees.map(x1 => x1.name);

                                            //Lấy tên người phê duyệt
                                            let getNameAccountableEmployees = item.accountableEmployees.map(x2 => x2.name);

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
                                                            getNameAccountableEmployees.join(', ')
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
    const { tasks, reports } = state;
    return { tasks, reports };
}

const actionCreators = {
    createTaskReport: TaskReportActions.createTaskReport,
    getTaskEvaluations: taskManagementActions.getTaskEvaluations,
}

const viewForm = connect(mapState, actionCreators)(withTranslate(TaskReportViewForm));

export { viewForm as TaskReportViewForm };