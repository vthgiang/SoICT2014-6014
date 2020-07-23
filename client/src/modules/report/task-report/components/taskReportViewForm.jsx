import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TaskReportActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../common-components';
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";
class TaskReportViewForm extends Component {
    constructor(props) {
        super(props);

    }

    formatPriority = (data) => {
        if (data === 1) return "Thấp";
        if (data === 2) return "Trung bình";
        if (data === 3) return "Cao";
    }

    render() {
        const { tasks, user, passState, reports, translate } = this.props;
        let listTaskInfo = tasks.listTaskEvaluations;
        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID="modal-view-taskreport" isLoading={false}
                    formID="form-view-tasktemplate"
                    title="Xem chi tiết báo cáo"
                    hasSaveButton={false}
                >
                    {/* Modal Body */}
                    <div id="chart"></div>
                    <div className="form-inline">
                        <button id="exportButton" className="btn btn-sm btn-success " style={{ marginBottom: '10px' }}><span className="fa fa-file-excel-o"></span> Export to Excel</button>
                    </div>
                    <div className="row row-equal-height box" >
                        <table className="table table-hover table-striped table-bordered" id="report_manager" style={{ marginBottom: '0px !important' }}>
                            <thead>
                                <tr>
                                    <th style={{ width: '120px', textAlign: 'center' }}>Công việc</th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>Người thực hiện</th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>Người phê duyệt</th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>
                                        Điểm hệ thống tự tính
                                    </th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>
                                        Ngày bắt đầu
                                    </th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>
                                        Ngày kết thúc
                                    </th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>
                                        Ngày đánh giá
                                    </th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>
                                        Mức độ ưu tiên
                                    </th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>
                                        Trạng thái công việc
                                    </th>
                                    {
                                        (passState && tasks && listTaskInfo) && listTaskInfo.map(i => (
                                            i.taskInformations.map((ii, key) => {
                                                if (passState.includes(`${ii.name}`) === true) {
                                                    return <th key={key} style={{ width: '120px', textAlign: 'center' }}>
                                                        {ii.name}
                                                    </th>
                                                }
                                            })
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tasks.listTaskEvaluations && tasks.listTaskEvaluations.map((item, key) => {
                                        let getNameResponsibleEmployees = user.usercompanys.filter(item1 => item1._id === item.responsibleEmployees);
                                        let getNameAccountableEmployees = user.usercompanys.filter(item2 => item2._id === item.accountableEmployees);
                                        getNameResponsibleEmployees = getNameResponsibleEmployees.map(x1 => x1.name);
                                        getNameAccountableEmployees = getNameAccountableEmployees.map(x2 => x2.name);
                                        return (
                                            <tr key={key}>
                                                <td>{item.name}</td>
                                                <td>
                                                    {
                                                        getNameResponsibleEmployees.join(', ')
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        getNameAccountableEmployees.join(',')
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        item.results.map(item3 => item3.automaticPoint)
                                                    }
                                                </td>
                                                <td>{item.startDate.slice(0, 10)}</td>
                                                <td>{item.endDate.slice(0, 10)}</td>
                                                <td>{item.date.slice(0, 10)}</td>
                                                <td>
                                                    {
                                                        item.priority === 1 ? 'Thấp' : (item.priority === 2 ? 'Trung bình' : 'Cao')
                                                    }
                                                </td>
                                                <td>{item.status}</td>
                                                <td>{}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        {reports.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            tasks.listTaskEvaluations && tasks.listTaskEvaluations.length === 0 && <div className="table-info-panel" style={{ width: '100%' }}>{translate('confirm.no_data')}</div>}
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapState = state => state;
const actionCreators = {
    getTaskEvaluations: taskManagementActions.getTaskEvaluations,
}
const viewForm = connect(mapState, actionCreators)(withTranslate(TaskReportViewForm));

export { viewForm as TaskReportViewForm };