import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TaskReportActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../common-components';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { TwoBarChart } from './twoBarChart';
class TaskReportViewForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    formatPriority = (data) => {
        if (data === 1) return "Thấp";
        if (data === 2) return "Trung bình";
        if (data === 3) return "Cao";
    }

    convertMonthYear = (data) => {
        const time = new Date(data);
        const m = time.getMonth();
        const y = time.getFullYear();
        return `${m + 1}-${y}`;
    }
    render() {
        const { tasks, user, reports, translate } = this.props;
        const { startDate, endDate } = this.props;

        let formater = new Intl.NumberFormat();
        let taskInfoName, headTable = [];

        // Nếu không có ngày bắt đầu và kết thúc thì lấy công việc mới nhất
        let listTaskEvaluation = [];
        if (tasks.listTaskEvaluations && !startDate && !endDate) {
            let listTaskEvaluations = tasks.listTaskEvaluations[0]; // lấy công việc đầu mới nhất
            listTaskEvaluation = [...listTaskEvaluation, listTaskEvaluations];
        } else {

            listTaskEvaluation = tasks.listTaskEvaluations; // lấy toàn bộ
        }

        // hiển thị trường thông tin hiện trong báo cáo
        if (listTaskEvaluation && listTaskEvaluation.length !== 0) {
            taskInfoName = listTaskEvaluation[0];
            taskInfoName.taskInformations.forEach(x => {
                if (x.type === "Number") {
                    headTable = [...headTable, x.name];
                }
            })
        }

        // Convert listTaskEvaluation loại bỏ trường dư thừa
        let newlistTaskEvaluation;
        if (listTaskEvaluation) {
            newlistTaskEvaluation = listTaskEvaluation.map(item => {
                return {
                    time: this.convertMonthYear(item.date),
                    task: item.taskInformations.map(task => {
                        return {
                            code: task.code,
                            value: task.value,
                            name: task.name,
                        }

                    })
                }
            });
        }

        // gom các công việc theo tháng-năm
        let groupDataByMonth;
        if (newlistTaskEvaluation) {
            groupDataByMonth = newlistTaskEvaluation.reduce((groups, item) => {
                groups[item.time] = [...groups[item.time] || [], item];
                return groups;
            }, {});
        }

        console.log('groupDataByMonth', groupDataByMonth);

        // Tính  tổng các công việc
        let output;
        if (groupDataByMonth) {
            output = Object.entries(groupDataByMonth).map(([time, datapoints]) => {
                const codes = {}
                const allTasks = datapoints.flatMap(point => point.task);
                // console.log('allTasks', allTasks);
                for (const { code, value, name } of allTasks) {
                    codes[code] = (codes[code] || 0) + value;
                }
                return {
                    time,
                    tasks: Object.entries(codes).map(([code, value]) => ({ code, value }))
                }
            }
            )
        }
        console.log('output', output);

        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID="modal-view-taskreport" isLoading={false}
                    formID="form-view-tasktemplate"
                    title="Xem chi tiết báo cáo"
                    hasSaveButton={true}
                    func={this.save}
                    size={100}
                >
                    {/* Modal Body */}
                    {/* <div className="row">
                        {
                            <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                                <TwoBarChart nameData={headTable.map(x => x)} data={output} nameChart={'Báo cáo công việc tháng 7'} />
                            </div>
                        }
                    </div> */}
                    <div className="form-inline">
                        <button id="exportButton" className="btn btn-sm btn-success " style={{ marginBottom: '10px' }}><span className="fa fa-file-excel-o"></span> Export to Excel</button>
                    </div>
                    <div className="row row-equal-height box" >
                        <div className="col-md-12">
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
                                        listTaskEvaluation && listTaskEvaluation.map((item, key) => {
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