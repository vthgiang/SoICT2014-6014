import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectBox } from '../../../../../common-components';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';
import parse from 'html-react-parser';

const EditTaskTemplate = (props) => {

    const { translate, info, id, user } = props;

    const [state, setState] = useState({
        code: info.code,
        taskName: info.name,
        taskActions: info.taskActions ? info.taskActions : []
    })

    useEffect(() => {
        // Lấy tất cả nhân viên trong công ty
        props.getAllUserInAllUnitsOfCompany();
    }, [])

    useEffect(() => {
        setState({
            code: info.code,
            taskName: info.name,
            taskActions: info.taskActions ? info.taskActions : []
        })
    }, [props.info])

    const handleChangeTaskPerformerEmployee = (value, index) => {
        let performerEmployee = state.taskActions[index] ? state.taskActions[index] : undefined;
        let listActivity = state.taskActions ? state.taskActions : [];
        if (performerEmployee) {
            let updatePerformerEmployee = {
                ...performerEmployee,
                performer: value
            }
            listActivity.splice(index, 1, updatePerformerEmployee)
            setState({
                ...state,
                taskActions: listActivity
            })
        }
        props.onChangeTaskActionEmployee(state)
    }

    let usersInUnitsOfCompany;
    if (user && user.usersInUnitsOfCompany) {
        usersInUnitsOfCompany = user.usersInUnitsOfCompany;
    }
    let allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany);
    let { taskActions } = state
    return (
        <React.Fragment>

            <div className="row" style={{ marginLeft: "0px" }}>
                <fieldset className="scheduler-border" >
                    <legend className="scheduler-border">{translate('task_template.activity_list')}</legend>
                    <table className="table table-hover table-striped table-bordered">
                        <thead>
                            <tr>
                                <th style={{ width: '10%' }} className="col-fixed">STT</th>
                                <th style={{ width: '20%' }} title="Tên hoạt động">{translate('task_template.action_name')}</th>
                                <th style={{ width: '20%' }} title="Mô tả">{translate('task_template.description')}</th>
                                <th style={{ width: '10%' }} title="Bắt buộc">{translate('task_template.mandatory')}</th>
                                <th style={{ width: '40%' }} title="Người thực hiện">{translate('task_template.action')}</th>
                            </tr>
                        </thead>
                        <tbody id="actions">
                            {
                                (typeof taskActions === 'undefined' || taskActions.length === 0) ? <tr><td colSpan={5}><center>{translate('task_template.no_data')}</center></td></tr> :
                                    taskActions.map((item, index) =>
                                        <tr key={`${index}`}>
                                            <td>{index + 1}</td>
                                            <td>{parse(item.name)}</td>
                                            <td>{parse(item.description)}</td>
                                            <td>{item.mandatory ? "Có" : "Không"}</td>
                                            <td>
                                                <div className={`form-group`}>
                                                    {allUnitsMember &&
                                                        <SelectBox
                                                            id={`task-performer-employee-select-box-${index}-${item.code}-${item.performer}`}
                                                            className="form-control select2"
                                                            style={{ width: "100%" }}
                                                            items={allUnitsMember}
                                                            value={item.performer}
                                                            onChange={(value) => handleChangeTaskPerformerEmployee(value, index)}
                                                            multiple={true}
                                                        />
                                                    }
                                                    {/* <ErrorLabel content={newChainInformation.errorValidateApprover.message} /> */}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                            }
                        </tbody>
                    </table>
                </fieldset>
            </div>
        </React.Fragment>
    );
}

function mapState(state) {
    const { department, user, tasktemplates } = state;
    return { department, user, tasktemplates };
}

const actionCreators = {
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany

};
const connectedEditTaskTemplate = connect(mapState, actionCreators)(withTranslate(EditTaskTemplate));
export { connectedEditTaskTemplate as EditTaskTemplate };