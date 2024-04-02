import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { DatePicker, TimePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';

import ValidationHelper from '../../../../helpers/validationHelper'
import getEmployeeSelectBoxItems from '../../../../modules/task/organizationalUnitHelper';
import { IssueReportAction } from "../redux/actions";
import { getStorage } from './../../../../config';

function AddIssueModal(props) {

    const [state, setState] = useState({
        issue: {
            manufacturingProcess: "",
            activityTask: "",
            issueName: "",
            onDate: "",
            startTime: "",
            endTime: "",
            byRepaire: "",
            repaireDate: "",

            issueTypeCategory: "",
            issueStatus: "",
        },
        errorValidateRepairer: {
            status: true,
            message: undefined,
        },
        errorValidateIssueName: {
            status: true,
            message: undefined,
        }
    })

    const { translate, id, manufacturingProcess, user } = props;
    const { issue, errorValidateRepairer, errorValidateIssueName } = state;

    const issueStatus = [
        { name: "Đã ghi nhận yêu cầu", value: "waitting" },
        { name: "Đã xác nhận, chờ tiến hành", value: "confirmed" },
        { name: "Đang thực thi", value: "processing" },
        { name: "Đã hoàn thành", value: "completed" },
        { name: "Lỗi", value: "error" },
    ];

    const issueCate = [
        { name: "Lỗi thiết bị sản xuất", value: "device_error" },
        { name: "Cần sự hỗ trợ", value: "help" },
    ]

    useEffect(() => {

    }, [])

    const isFormValidate = () => {
        return false;
    }

    const save = () => {
        props.createReportIssue({
            manufacturingProcess: issue.manufacturingProcess,
            productionActivityId: issue.activityTask,
            activityIssueName: issue.issueName,
            onDate: issue.onDate,
            startTime: issue.startTime,
            endTime: issue.endTime,
            byRepairer: issue.byRepaire,
            repaireDate: issue.repaireDate,
            byReporter: getStorage('userId'),

            activityCategoryIssue: issue.issueTypeCategory,
            issueStatus: issue.issueStatus,
        })
    }

    const handleChangeDateStart = (value) => {

    }

    const handleChangeTimeStart = (value) => {

    }

    const handleChangeDateEnd = (value) => {

    }

    const handleChangeTimeEnd = (value) => {

    }

    const handleChangeIssueActivityTask = (value) => {

    }

    const handleChangeIssueName = (event) => {
        let issueName = event.target.value;
        let errorValidate = ValidationHelper.validateName(translate, issueName, 1, 255)
        setState({
            ...state,
            issue: {
                ...state.issue,
                issueName: issueName
            },
            errorValidateIssueName: errorValidate
        })
    }

    const handleChangeRepaireEmployees = (value) => {
        let errorValidate = ValidationHelper.validateArrayLength(translate, value);
        setState({
            ...state,
            issue: {
                ...state.issue,
                byRepaire: value,
            },
            errorValidateRepairer: errorValidate
        })
    }

    const handleChangeManufacturingProcess = (event) => {
        let value = event.target.value;
        setState({
            ...state,
            issue: {
                ...state.issue,
                manufacturingProcess: value
            }
        })
    }

    const handleChangeCategoryIssue = (event) => {
        let value = event.target.value;
        setState({
            ...state,
            issue: {
                ...state.issue,
                issueTypeCategory: value
            }
        })
    }

    const handleChangeIssueStatus = (event) => {
        let value = event.target.value;
        setState({
            ...state,
            issue: {
                ...state.issue,
                issueStatus: value
            }
        })
    }

    let listAllProcess = manufacturingProcess.list ? manufacturingProcess.list : [];
    let usersInUnitsOfCompany;
    if (user && user.usersInUnitsOfCompany) {
        usersInUnitsOfCompany = user.usersInUnitsOfCompany;
    }
    let allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany);

    console.log("memberrrr: ", user)
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-add-issue`}
                isLoading={false}
                formID={`modal-add-issue`}
                title={`${translate('manufacturing_managerment.management_issue.add_issue_form')}`}
                disableSubmit={isFormValidate()}
                func={save}
                size="75"
                width="160"
            >
                <div id={`${id}`}>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">Báo cáo sự cố</legend>
                        <div className="row">
                            <div className="form-group col-xs-6 col-md-6 col-sm-12">
                                <label className="control-label">Dây chuyền sản xuất<span className="text-red">*</span></label>
                                {/* <input className="form-control" type="text"></input> */}
                                {(listAllProcess || listAllProcess.length === 0) ? (listAllProcess &&
                                    <select value={issue.manufacturingProcess} className="form-control" onChange={(event) => handleChangeManufacturingProcess(event)}>
                                        {listAllProcess.map(x => {
                                            return <option key={x._id} value={x._id}>{x.manufacturingName}</option>
                                        })}
                                    </select>) :
                                    <select className="form-control">
                                        <option>Organization not found result</option>
                                    </select>
                                }
                            </div>
                            <div className="form-group col-xs-6 col-md-6 col-sm-12">
                                <label className="control-label">Hoạt động xảy ra sự cố<span className="text-red">*</span></label>
                                <input className="form-control" type="text" onChange={(event) => handleChangeIssueActivityTask(event)}></input>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-xs-6 col-md-6 col-sm-12">
                                <label className="control-label">Tên sự cố<span className="text-red">*</span></label>
                                <input className={`form-control ${errorValidateIssueName.status ? "" : "has-error"}`}
                                    type="text"
                                    onChange={(event) => handleChangeIssueName(event)}>
                                </input>
                                <ErrorLabel content={errorValidateIssueName.message} />
                            </div>
                            <div className="form-group col-xs-6 col-md-6 col-sm-12">
                                <label className="control-label">Thời gian xảy ra<span className="text-red">*</span></label>
                                <DatePicker
                                    id="issue-start-date"
                                    dateFormat="date-month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                    onChange={(value) => handleChangeDateStart(value)}
                                    disabled={false} />
                                < TimePicker
                                    id={`time-picker-start`}
                                    // ref={`time-picker-start`}
                                    value={issue.startTime}
                                    onChange={(value) => handleChangeTimeStart(value)}
                                />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">Khắc phục sự cố</legend>
                        <div className="row">
                            <div className="form-group col-xs-6 col-md-6 col-sm-12">
                                <label className="control-label">Người khắc phục</label>
                                <div className={`form-group ${errorValidateRepairer.status ? "" : "has-error"}`}>
                                    {allUnitsMember &&
                                        <SelectBox
                                            id="repairer-select-box"
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={allUnitsMember}
                                            onChange={(value) => handleChangeRepaireEmployees(value)}
                                            value={issue.byRepaire}
                                            multiple={true}
                                        />
                                    }
                                    <ErrorLabel content={errorValidateRepairer.message} />
                                </div>
                            </div>
                            <div className="form-group col-xs-6 col-md-6 col-sm-12">
                                <label className="control-label">Thời gian khắc phục sự cố</label>
                                <DatePicker
                                    id="issue-end-date"
                                    dateFormat="date-month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                    onChange={(value) => handleChangeDateEnd(value)}
                                    disabled={false} />
                                < TimePicker
                                    id={`time-picker-end`}
                                    // ref={`time-picker-start`}
                                    value={issue.endTime}
                                    onChange={(value) => handleChangeTimeEnd(value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-xs-6 col-md-6 col-sm-12">
                                <label className="control-label">Loại sự cố</label>
                                <select value={issue.activityCategoryIssue}
                                    className="form-control"
                                    onChange={(event) => handleChangeCategoryIssue(event)}
                                >
                                    {
                                        issueCate.map((cate, id) => {
                                            return <option key={id} value={cate.value}>{cate.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group col-xs-6 col-md-6 col-sm-12">
                                <label className="control-label">Trạng thái sau khắc phục</label>
                                <select value={issue.issueStatus}
                                    className="form-control"
                                    onChange={(event) => handleChangeIssueStatus(event)}
                                >
                                    {
                                        issueStatus.map((cate, id) => {
                                            return <option key={id} value={cate.value}>{cate.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    const { user, department, role, auth, manufacturingProcess } = state;
    return { user, department, role, auth, manufacturingProcess }
}

const mapDispatchToProps = {
    createReportIssue: IssueReportAction.createReportIssue
}

const connectAddIssueModal = connect(mapStateToProps, mapDispatchToProps)(withTranslate(AddIssueModal))
export { connectAddIssueModal as AddIssueModal }