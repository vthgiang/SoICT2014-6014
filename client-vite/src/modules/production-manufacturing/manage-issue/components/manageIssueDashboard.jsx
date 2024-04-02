import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { DataTableSetting, DatePicker, PaginateBar, SelectBox, SelectMulti, Tree, TreeTable, DeleteNotification } from '../../../../common-components';

import { UserActions } from '../../../../modules/super-admin/user/redux/actions';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import { EditIssueModal } from "./editIssueModal";
import { AddIssueModal } from "./addIssueModal";
import { ManufacturingProcessActions } from './../../manufacturing-process/redux/actions';
import { IssueReportAction } from "../redux/actions";

const ManageIssueDashboard = (props) => {
    const tableId = "issue-manager-tableID";
    const defaultConfig = { limit: 10 };
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        issueName: "",
        page: 1,
        perPage: limit,
        tableId
    })

    useEffect(() => {
        props.getUsers()
        props.getAllUserInAllUnitsOfCompany()
        props.getAllManufacturingProcess()
        props.getAllReportIssue()
    }, [])

    const setLimit = (number) => {
        setState({
            ...state,
            perPage: parseInt(number),
            page: 1,
        })

        props.getAllReportIssue({
            issueName,
            perPage: parseInt(number),
            page: 1,
        })
    }

    const setPage = (pageNumber) => {
        setState({
            ...state,
            page: parseInt(pageNumber)
        });

        props.getAllReportIssue({
            issueName,
            perPage,
            page: parseInt(pageNumber)
        })
    }

    const handleShowDetailChain = (item) => {

    }

    const handleEdit = (item) => {
        window.$('#modal-edit-issue').modal('show');
    }

    const handleDeleteReportIssue = (id) => {
        props.deleteReportIssue(id);
        props.getAllReportIssue()
    }

    const handleChangeStartDate = () => {

    }

    const handleChangeEndDate = () => {

    }

    const handleUpdateData = () => {

    }

    const handleAddIssueForm = () => {
        window.$('#modal-add-issue').modal('show');
    }

    const { page, perPage, issueName } = state
    const { translate, issueReport } = props;
    const issueManagerList = issueReport.listIssue;
    const totalPage = issueReport && Math.ceil(issueReport.totalList / perPage);

    return (
        <React.Fragment>
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body qlcv">
                    <AddIssueModal/>
                    <div id="tasks-filter" className="form-inline">
                        <div className="form-group">
                            <label>{translate('manufacturing_managerment.management_issue.issue_task')}</label>
                            <input className="form-control" type="text" placeholder={translate('manufacturing_managerment.management_issue.issue_task')} name="name" />
                        </div>

                        <div className="form-group">
                            <label>{translate('manufacturing_managerment.management_issue.issue_action')}</label>
                            <input className="form-control" type="text" placeholder={translate('manufacturing_managerment.management_issue.issue_action')} name="name" />
                        </div>

                        <div className="form-group">
                            <label>{translate('manufacturing_managerment.management_issue.issue_name')}</label>
                            <input className="form-control" type="text" placeholder={translate('manufacturing_managerment.management_issue.issue_name')} name="name" />
                        </div>

                        <div className="form-group">
                            <label>{translate('manufacturing_managerment.management_issue.issue_repairer')}</label>
                            <input className="form-control" type="text" placeholder={translate('manufacturing_managerment.management_issue.issue_repairer')} name="name" />
                        </div>

                        <div className="form-group">
                            <label>{translate('task.task_management.start_date')}</label>
                            <DatePicker
                                id="start-date"
                                dateFormat="date-month-year"
                                value={""}
                                onChange={handleChangeStartDate}
                                disabled={false}
                            />
                        </div>

                        <div className="form-group">
                            <label>{translate('task.task_management.end_date')}</label>
                            <DatePicker
                                id="end-date"
                                dateFormat="date-month-year"
                                value={""}
                                onChange={handleChangeEndDate}
                                disabled={false}
                            />
                        </div>

                        <div className="form-group">
                            <button type="button" className="btn btn-success" onClick={handleUpdateData}>{translate('task.task_management.search')}</button>
                        </div>
                    </div>

                    <div style={{ height: "40px" }}>
                        <button type="button"
                            className="btn btn-success pull-right"
                            title={translate('task.task_management.add_title')}
                            onClick={handleAddIssueForm}
                        >
                            {translate('task.task_management.add_task')}
                        </button>
                    </div>
                    <table id={tableId} className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th className="col-fixed" style={{ width: 60 }}>{translate('manufacturing_managerment.management_issue.index')}</th>
                                <th>{translate('manufacturing_managerment.management_issue.issue_task')}</th>
                                <th>{translate('manufacturing_managerment.management_issue.issue_action')}</th>
                                <th>{translate('manufacturing_managerment.management_issue.issue_name')}</th>
                                <th>{translate('manufacturing_managerment.management_issue.issue_on_time')}</th>
                                <th>{translate('manufacturing_managerment.management_issue.issue_status')}</th>
                                <th>{translate('manufacturing_managerment.management_issue.issue_fix_time')}</th>
                                <th>{translate('manufacturing_managerment.management_issue.issue_repair_date')}</th>
                                <th>{translate('manufacturing_managerment.management_issue.issue_repairer')}</th>
                                <th>{translate('manufacturing_managerment.management_issue.issue_cate')}</th>
                                <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={[
                                            translate('manufacturing_managerment.management_issue.index'),
                                            translate('manufacturing_managerment.management_issue.issue_task'),
                                            translate('manufacturing_managerment.management_issue.issue_action'),
                                            translate('manufacturing_managerment.management_issue.issue_name'),
                                            translate('manufacturing_managerment.management_issue.issue_on_time'),
                                            translate('manufacturing_managerment.management_issue.issue_status'),
                                            translate('manufacturing_managerment.management_issue.issue_fix_time'),
                                            translate('manufacturing_managerment.management_issue.issue_repair_date'),
                                            translate('manufacturing_managerment.management_issue.issue_repairer'),
                                            translate('manufacturing_managerment.management_issue.issue_cate'),
                                        ]}
                                        setLimit={setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(issueManagerList && issueManagerList.length !== 0) &&
                                issueManagerList.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1 + (page - 1) * perPage}</td>
                                        <td>{item.manufacturingProcess?.manufacturingName}</td>
                                        <td>{item.productionActivity}</td>
                                        <td>{item.activityIssueName}</td>
                                        <td>{item.createdAt}</td>
                                        <td>{item.activityIssueStatus}</td>
                                        <td>0</td>
                                        <td>{item.updatedAt}</td>
                                        <td>{item.byRepairer.map(u => u.name).join(', ')}</td>
                                        <td>{item.activityCategoryIssue}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={translate('general.edit')} onClick={(item) => handleEdit(item)}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('manage_example.delete')}
                                                data={{
                                                    id: item._id,
                                                    info: item.activityIssueName
                                                }}
                                                func={handleDeleteReportIssue}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {
                        (typeof issueManagerList === 'undefined' || issueManagerList.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar
                        pageTotal={totalPage ? totalPage : 0}
                        currentPage={page}
                        display={issueManagerList && issueManagerList.length !== 0 && issueManagerList.length}
                        total={10}
                        func={setPage}
                    />
                    <EditIssueModal />
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const { user, role, department, auth, manufacturingProcess, issueReport } = state;
    return { user, role, department, auth, manufacturingProcess, issueReport }
}

const mapDispatchToProps = {
    getUsers: UserActions.get,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getAllManufacturingProcess: ManufacturingProcessActions.getAllManufacturingProcess,
    getAllReportIssue: IssueReportAction.getAllIssueReport,
    deleteReportIssue: IssueReportAction.deleteReportIssue,
}

const connectManageIssueDashboard = connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManageIssueDashboard))
export { connectManageIssueDashboard as ManageIssueDashboard }