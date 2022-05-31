import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { EmployeeManagerActions } from '../../../human-resource/profile/employee-management/redux/actions';
import getAllEmployeeSelectBoxItems from '../../bidding-package/biddingPackageManagement/components/employeeHelper';
import { convertDepartmentIdToDepartmentName, convertUserIdToUserName, getListDepartments } from '../../../project/projects/components/functionHelper';

function ViewDecisionForImplement(props) {
    const { translate, employeesManager, user } = props;
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    const listDepartments = user && user.usersInUnitsOfCompany ? getListDepartments(user.usersInUnitsOfCompany) : []
    const arrUnitTimeList = [
        { text: 'Ngày', value: 'days' },
        { text: 'Giờ', value: 'hours' },
        { text: 'Tháng', value: 'months' },
    ]
    const initDecision = {
        tasks: [],
        projectManager: [],
        responsibleEmployees: [],
        responsibleEmployeesWithUnit: [],
    }
    const [state, setState] = useState({
    });
    const [decision, setDecision] = useState(props.biddingContract?.decideToImplement ? props.biddingContract?.decideToImplement : initDecision)

    const { id } = state;

    useEffect(() => {
        props.getAllEmployee();
        setState({ ...state, id: props.id })
        setDecision(props.biddingContract?.decideToImplement ? props.biddingContract?.decideToImplement : initDecision)
    }, [props.id])

    let allEmployee;
    if (employeesManager && employeesManager.listAllEmployees) {
        allEmployee = employeesManager.listAllEmployees
    }

    let allEmployeeCompany = getAllEmployeeSelectBoxItems(allEmployee)

    const renderMembers = () => {
        return (
            <>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Nhân lực</legend>
                    <div>
                        <label>{translate('project.manager')}: &nbsp;</label>
                        {decision.projectManager?.map(userItem =>
                            convertUserIdToUserName(listUsers, userItem))
                            .join(', ')}
                    </div>
                    <div>
                        <label>Thành viên dự án:</label>
                        <ul>
                            {decision.responsibleEmployeesWithUnit && decision.responsibleEmployeesWithUnit.length > 0 &&
                                decision.responsibleEmployeesWithUnit.map((item, index) => (
                                    <li key={index}> {convertDepartmentIdToDepartmentName(user.usersInUnitsOfCompany, item?.unitId)}: &nbsp;
                                        <span>
                                            {item?.listUsers.map(userItem =>
                                                convertUserIdToUserName(listUsers, userItem.userId))
                                                .join(', ')
                                            }
                                        </span>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </fieldset>
            </>
        )
    }

    const renderTasks = () => {
        return (
            <>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Danh sách công việc</legend>
                    {decision.tasks?.length === 0 && <span style={{ display: "flex", justifyContent: "center" }}>Không có thông tin công việc</span>}
                    {decision.tasks?.map((item, index) => {
                        return (

                            <section className="col-lg-12 col-md-12" key={`section-${index}`}>

                                <div className="box">
                                    <div className="box-header with-border">
                                        <p data-toggle="collapse" data-target={`#task-proposal-${index}`} aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "600", cursor: "pointer" }} onClick={() => {
                                            window.$(`#arrow-up-${index}`).toggle();
                                            window.$(`#arrow-down-${index}`).toggle();
                                        }}>
                                            <span id={`arrow-up-${index}`} className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                                {`keyboard_arrow_up`}
                                            </span>
                                            <span id={`arrow-down-${index}`} className="material-icons" style={{ display: 'none', fontWeight: "bold", marginRight: '10px' }}>
                                                {`keyboard_arrow_down`}
                                            </span>
                                            Công việc: {item.name}</p>
                                    </div>
                                    <div className="box-body collapse" data-toggle="collapse" id={`task-proposal-${index}`} style={{ lineHeight: 2 }}>
                                        <div><strong>Tên công việc: </strong><span>{item.name}</span></div>
                                        <div><strong>Mô tả công việc: </strong><span>{item.description}</span></div>
                                        <div><strong>Thời gian thực hiện: </strong><span>{item.estimateTime} ({arrUnitTimeList.find(x => x.value === item.unitOfTime)?.text})</span></div>
                                    </div>
                                </div>
                            </section>
                        );
                    }
                    )
                    }
                </fieldset>
            </>
        )
    }

    return (
        // <div id={id} className="tab-pane">
        <div>
            {renderMembers()}
            {renderTasks()}
        </div>
    );
};


function mapState(state) {
    const { employeesManager, user } = state;
    return { employeesManager, user };
}

const actionCreators = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
};

const connectComponent = connect(mapState, actionCreators)(withTranslate(ViewDecisionForImplement));
export { connectComponent as ViewDecisionForImplement };