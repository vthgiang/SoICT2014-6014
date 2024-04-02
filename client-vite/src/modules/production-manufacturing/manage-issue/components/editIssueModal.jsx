import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';

import { ErrorLabel, QuillEditor, SelectBox, DatePicker, TimePicker } from '../../../../common-components';
import getEmployeeSelectBoxItems from '../../../../modules/task/organizationalUnitHelper';

import { DialogModal } from "../../../../common-components";

const EditIssueModal = (props) => {


    const handleChangeDateIssue = () => {

    }

    const handleChangeTimeIssue = () => {

    }

    function isFormValidate() {

    }

    function save() {

    }

    const { translate } = props
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-issue`}
                isLoading={false}
                formID={`modal-edit-issue`}
                title={`${translate('manufacturing_managerment.management_issue.edit_issue_form')}`}
                disableSubmit={!isFormValidate()}
                func={save}
                size="60"
                width="100"
            >
                <div>
                    <div className="row">
                        <div className="form-group col-sm-6 col-md-6">
                            <label className="control-label">{translate('manufacturing_managerment.management_issue.issue_name')}</label>
                            <div>
                                <input type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="form-group col-sm-6 col-md-6">
                            <label className="control-label">{translate('manufacturing_managerment.management_issue.issue_on_time')}</label>
                            <div>
                                <DatePicker
                                    id='issue-on-date-picker'
                                    dateFormat="day-month-year"
                                    value={""}
                                    onChange={() => handleChangeDateIssue()}
                                />
                                < TimePicker
                                    id='issue-on-time-picker'
                                    // ref={`time-picker-end`}
                                    value={""}
                                    onChange={() => handleChangeTimeIssue()}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="control-label">{translate('manufacturing_managerment.management_issue.issue_action')}</label>
                        <div>
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="control-label">{translate('manufacturing_managerment.management_issue.issue_status')}</label>
                        <div>
                            <select className="form-control">
                                <option>Trang thai 1</option>
                                <option>Trang thai 2</option>
                                <option>Trang thai 3</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="control-label">{translate('manufacturing_managerment.management_issue.issue_repairer')}</label>
                        <div>
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

const connectEditIssueModal = connect()(withTranslate(EditIssueModal))
export { connectEditIssueModal as EditIssueModal }