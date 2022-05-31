import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ErrorLabel, SelectBox } from '../../../../common-components';
import { UserActions } from '../../../super-admin/user/redux/actions';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { EmployeeManagerActions } from '../../../human-resource/profile/employee-management/redux/actions';
import getAllEmployeeSelectBoxItems from '../../bidding-package/biddingPackageManagement/components/employeeHelper';
import { convertDepartmentIdToDepartmentName, convertUserIdToUserName, getListDepartments } from '../../../project/projects/components/functionHelper';

function DecisionForImplement(props) {
    const EDIT_TYPE = "EDIT_TYPE", ADD_TYPE = "ADD_TYPE" // , RESET_TYPE = "RESET_TYPE", DELETE_TYPE = "DELETE_TYPE", CANCEL_TYPE = "CANCEL_TYPE";
    const { translate, employeesManager, user } = props;
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    const listDepartments = user && user.usersInUnitsOfCompany ? getListDepartments(user.usersInUnitsOfCompany) : []
    const arrUnitTimeList = [
        { text: 'Ngày', value: 'days' },
        { text: 'Giờ', value: 'hours' },
        { text: 'Tháng', value: 'months' },
    ]
    const initTaskData = {
        name: "",
        description: "",
        // directEmployees: [],
        // backupEmployees: [],
        estimateTime: "",
        unitOfTime: "days",
    }
    const initDecision = {
        tasks: [],
        projectManager: [],
        responsibleEmployees: [],
        responsibleEmployeesWithUnit: [],
    }
    const [state, setState] = useState({
        type: ADD_TYPE,
        currentTask: initTaskData,
        currentIndex: null
    });

    // dùng để xử lý trên client dữ liệu form reps_with_unit
    const [responsibleEmployeesWithUnit, setResponsibleEmployeesWithUnit] = useState({
        list: [],
        currentUnitRow: '',
        currentEmployeeRow: [],
    })

    // dùng để cập nhật dữ liệu resp_with_unit gửi về phía server
    const [responsibleEmployeesWithUnitDataReq, setResponsibleEmployeesWithUnitDataReq] = useState([]);

    const [decision, setDecision] = useState(props.biddingContract?.decideToImplement ? props.biddingContract?.decideToImplement : initDecision)

    const { id } = state;

    useEffect(() => {
        const decisionData = props.biddingContract?.decideToImplement ? props.biddingContract?.decideToImplement : initDecision;
        const resWithUnitCopy = [...decisionData.responsibleEmployeesWithUnit]
        props.getAllEmployee();
        setState({ ...state, id: props.id })
        setDecision(decisionData)
        setResponsibleEmployeesWithUnit({
            ...responsibleEmployeesWithUnit,
            list: resWithUnitCopy?.map(x => {
                return {
                    unitId: x.unitId,
                    listUsers: x.listUsers?.map(o => o.userId)
                }
            })
        })
    }, [props.id, JSON.stringify(props.biddingContract?.decideToImplement)])

    let allEmployee;
    if (employeesManager && employeesManager.listAllEmployees) {
        allEmployee = employeesManager.listAllEmployees
    }

    let allEmployeeCompany = getAllEmployeeSelectBoxItems(allEmployee)

    const handleChangeForm = (key, e) => {
        let { value } = e.target;

        setState({
            ...state,
            currentTask: {
                ...state.currentTask,
                [key]: value
            }
        })
    }

    const handleChangeSingleSelectForm = (key, value) => {
        setState({
            ...state,
            currentTask: {
                ...state.currentTask,
                [key]: value[0]
            }
        })
    }

    const handleDeleteTask = (listIndex) => {
        let newList = decision.tasks
        newList.splice(listIndex, 1)

        let newDecision = {
            ...decision,
            tasks: newList,
        }
        setDecision(newDecision);
        props.handleChange("decideToImplement", newDecision);
    }

    const handleResetTask = () => {
        setState({
            ...state,
            type: ADD_TYPE,
            currentTask: initTaskData,
            currentIndex: null
        })
    }

    const handleCancel = () => {
        setState({
            ...state,
            type: ADD_TYPE,
            currentTask: initTaskData,
            currentIndex: null
        })
    }

    const handleEditTask = (listIndex) => {
        setState({
            ...state,
            type: EDIT_TYPE,
            currentTask: decision.tasks[listIndex],
            currentIndex: listIndex
        })
    }

    const handleSaveTask = (listIndex) => {
        let { currentTask } = state
        let newList = decision.tasks.map((x, idx) => {

            if (idx === listIndex) {
                x = { ...currentTask }
            }
            return x;
        })

        let newDecision = {
            ...decision,
            tasks: newList,
        }

        setState({
            ...state,
            type: ADD_TYPE,
            currentTask: initTaskData,
            currentIndex: null
        })
        setDecision(newDecision);
        props.handleChange("decideToImplement", newDecision);
    }

    const handleAddTask = () => {
        let { currentTask } = state
        let newList = decision.tasks

        newList.push(currentTask)

        let newDecision = {
            ...decision,
            tasks: newList,
        }


        setState({
            ...state,
            type: ADD_TYPE,
            currentTask: initTaskData,
            currentIndex: null
        })
        setDecision(newDecision);
        props.handleChange("decideToImplement", newDecision);
    }

    const handleProjectManager = (value) => {
        let newDecision = {
            ...decision,
            projectManager: value
        }
        setDecision(newDecision)
        console.log(193, newDecision);
        props.handleChange("decideToImplement", newDecision);
    }

    const handleDeleteMemberRow = (index) => {
        if (responsibleEmployeesWithUnit.list && responsibleEmployeesWithUnit.list.length > 0) {
            const cloneArr = [...responsibleEmployeesWithUnit.list];
            cloneArr.splice(index, 1);
            // responsibleEmployeesWithUnit.list.splice(responsibleEmployeesWithUnit.list.length - 1, 1);
            setResponsibleEmployeesWithUnit({
                ...responsibleEmployeesWithUnit,
                list: cloneArr,
                currentUnitRow: '',
                currentEmployeeRow: [],
            })
        }
    }

    const handleAddMemberRow = () => {
        if (responsibleEmployeesWithUnit.currentEmployeeRow.length > 0) {
            // Đề phòng user không chọn gì thì lấy default là Ban giám đốc
            const currentChoosenUnitRow = responsibleEmployeesWithUnit.currentUnitRow || listDepartments[0]?.value;
            const isUnitAlreadyExistedInArr = responsibleEmployeesWithUnit.list.find((item) => {
                return currentChoosenUnitRow === item.unitId
            })
            const oldListRow = responsibleEmployeesWithUnit.list;
            // Nếu unit đã có trong array rồi
            if (isUnitAlreadyExistedInArr) {
                let newListRow = oldListRow.map((oldListRowItem) => {
                    if (String(oldListRowItem.unitId) === String(isUnitAlreadyExistedInArr.unitId)) {
                        let currentListUsers = oldListRowItem.listUsers;
                        for (let currentEmployeeRowItem of responsibleEmployeesWithUnit.currentEmployeeRow) {
                            if (!currentListUsers.includes(currentEmployeeRowItem)) {
                                currentListUsers.push(currentEmployeeRowItem)
                            }
                        }
                        return {
                            unitId: oldListRowItem.unitId,
                            listUsers: currentListUsers,
                        }
                    }
                    return oldListRowItem;
                })
                setResponsibleEmployeesWithUnit({
                    ...responsibleEmployeesWithUnit,
                    list: newListRow,
                    currentUnitRow: '',
                    currentEmployeeRow: [],
                })
            }
            else {
                const newListRow = [...oldListRow, {
                    unitId: currentChoosenUnitRow,
                    listUsers: responsibleEmployeesWithUnit.currentEmployeeRow,
                }];
                setResponsibleEmployeesWithUnit({
                    ...responsibleEmployeesWithUnit,
                    list: newListRow,
                    currentUnitRow: '',
                    currentEmployeeRow: [],
                })
            }
        }
    }

    useEffect(() => {
        // xử lý dữ liệu cho giống với db -> để dùng cho việc gửi dữ liệu xuống server
        let newResponsibleEmployeesWithUnit = [];
        for (let i = 0; i < responsibleEmployeesWithUnit.list.length; i++) {
            newResponsibleEmployeesWithUnit.push({
                unitId: responsibleEmployeesWithUnit.list[i].unitId,
                listUsers: responsibleEmployeesWithUnit.list[i].listUsers.map((item, index) => ({
                    userId: item,
                    // salary: currentSalaryMembers?.[i]?.listUsers?.[index]?.salary, // ở hợp đồng đang không định xử lý dữ liệu lương
                }))
            })
        }
        let newEmployeesArr = [];
        for (let unitItem of responsibleEmployeesWithUnit.list) {
            for (let userItem of unitItem.listUsers) {
                newEmployeesArr.push(userItem)
            }
        }
        let newDecision = {
            ...decision,
            responsibleEmployees: newEmployeesArr,
            responsibleEmployeesWithUnit: newResponsibleEmployeesWithUnit,
        }

        // cập nhật state
        setResponsibleEmployeesWithUnitDataReq(newResponsibleEmployeesWithUnit)
        setDecision(newDecision);
        props.handleChange("decideToImplement", newDecision);
    }, [responsibleEmployeesWithUnit.list])

    // console.log(275, decision)
    // console.log(276, responsibleEmployeesWithUnit)

    const renderMembers = () => {
        return (
            <fieldset className="scheduler-border">
                <legend className="scheduler-border">Nhân lực</legend>
                <div className="form-group">
                    <label>{translate('project.manager')}<span className="text-red">*</span></label>
                    {listUsers &&
                        <SelectBox
                            id={`${props.type}-select-project-manager--${id}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={listUsers}
                            onChange={handleProjectManager}
                            value={decision.projectManager}
                            multiple={true}
                        />
                    }
                </div>
                <div className="form-group">
                    <table id="project-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Thuộc đơn vị</th>
                                <th>Thành viên tham gia</th>
                                <th>{translate('task_template.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {responsibleEmployeesWithUnit.list && responsibleEmployeesWithUnit.list.length > 0 &&
                                responsibleEmployeesWithUnit.list.map((item, index) => (
                                    <tr key={index}>
                                        <td>{convertDepartmentIdToDepartmentName(user.usersInUnitsOfCompany, item?.unitId)}</td>
                                        <td>
                                            {item?.listUsers.map(userItem =>
                                                convertUserIdToUserName(listUsers, userItem))
                                                .join(', ')
                                            }
                                        </td>
                                        <td>
                                            <a className="delete" title={translate('general.delete')} onClick={() => handleDeleteMemberRow(index)}><i className="material-icons">delete</i></a>
                                        </td>
                                    </tr>
                                ))
                            }
                            <tr key={`add-task-input-${responsibleEmployeesWithUnit.list.length}-${id}`}>
                                <td>
                                    <div className={`form-group`}>
                                        {listDepartments && listDepartments.length > 0 &&
                                            <SelectBox
                                                id={`decision-department-${responsibleEmployeesWithUnit.list.length}-${id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={listDepartments}
                                                onChange={(e) => {
                                                    setTimeout(() => {
                                                        setResponsibleEmployeesWithUnit({
                                                            ...responsibleEmployeesWithUnit,
                                                            currentUnitRow: e[0],
                                                        })
                                                    }, 10);
                                                }}
                                                value={responsibleEmployeesWithUnit.currentUnitRow}
                                                multiple={false}
                                            />}
                                    </div>
                                </td>
                                <td style={{ maxWidth: 250 }}>
                                    <div className={`form-group`}>
                                        {listDepartments && listDepartments.length > 0 &&
                                            <SelectBox
                                                id={`decision-member--${responsibleEmployeesWithUnit.list.length}-${id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={listUsers.filter(item =>
                                                    item.text === convertDepartmentIdToDepartmentName(user.usersInUnitsOfCompany,
                                                        responsibleEmployeesWithUnit.currentUnitRow || listDepartments[0]?.value)
                                                )}
                                                onChange={(e) => {
                                                    setTimeout(() => {
                                                        setResponsibleEmployeesWithUnit({
                                                            ...responsibleEmployeesWithUnit,
                                                            currentEmployeeRow: e,
                                                        })
                                                    }, 10);
                                                }}
                                                value={responsibleEmployeesWithUnit.currentEmployeeRow}
                                                multiple={true}
                                            />}
                                    </div>
                                </td>
                                <td>
                                    <a className="save text-green" title={translate('general.save')} onClick={handleAddMemberRow}><i className="material-icons">add_circle</i></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </fieldset>
        )
    }

    const renderTasks = () => {
        return (
            <fieldset className="scheduler-border">
                <legend className="scheduler-border">Danh sách công việc</legend>

                {/* Form create task */}
                <div style={{ paddingTop: '10px' }}>
                    <div className="form-group">
                        <label>Tên công việc<span className="text-red">*</span></label>
                        <input type="text" className="form-control" name={`name-${state.currentIndex}`} onChange={(value) => handleChangeForm("name", value)} value={state.currentTask?.name} placeholder="Tên công việc" autoComplete="off" />
                        <ErrorLabel content={state.currentTask?.nameError} />
                    </div>

                    <div className="form-group">
                        <label>Mô tả công việc</label>
                        <textarea type="text" rows={3} style={{ minHeight: '103.5px' }}
                            name={`count-${state.currentIndex}`}
                            onChange={(value) => handleChangeForm("description", value)}
                            value={state.currentTask?.description}
                            className="form-control"
                            placeholder="Mô tả công việc"
                            autoComplete="off"
                        />
                    </div>
                    <div className="form-group">
                        <label>Thời gian thực hiện<span className="text-red">*</span></label>
                        <input type="number" className="form-control" name={`estimateTime-${state.currentIndex}`} onChange={(value) => handleChangeForm("estimateTime", value)} value={state.currentTask?.estimateTime} placeholder="Thời gian thực hiện" autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label>Đơn vị thời gian<span className="text-red">*</span></label>
                        <SelectBox
                            id={`${props.type}-select-decision-bidding-contract-unitTime-${id}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={arrUnitTimeList}
                            onChange={(value) => handleChangeSingleSelectForm("unitOfTime", value)}
                            value={state.currentTask?.unitOfTime}
                            multiple={false}
                        />
                    </div>
                </div>


                <div className="pull-right row" style={{ marginRight: 0, marginBottom: "15px" }}>
                    {state.type === EDIT_TYPE &&
                        <>
                            <button className='btn btn-danger' style={{ marginRight: '5px' }} type={"button"} onClick={() => { handleCancel() }}>Hủy</button>
                            <button className='btn btn-success' style={{ marginRight: '5px' }} type={"button"} onClick={() => { handleSaveTask(state.currentIndex) }}>Lưu</button>
                        </>
                    }
                    {state.type === ADD_TYPE &&
                        <button className='btn btn-success' style={{ marginRight: '5px' }} type={"button"} onClick={() => { handleAddTask() }}>Thêm</button>
                    }
                    <button className='btn btn-primary' type={"button"} onClick={() => { handleResetTask() }}>Xóa trắng</button>
                </div>

                <table id="project-table" className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Tên công việc</th>
                            <th>Thời gian thực hiện</th>
                            <th>Mô tả công việc</th>
                            <th>{translate('task_template.action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            decision.tasks?.map((item, listIndex) => {
                                return (
                                    <tr key={listIndex}>
                                        <td>{item?.name}</td>
                                        <td>{item?.estimateTime} ({arrUnitTimeList.find(x => x.value === item?.unitOfTime)?.text || ""})</td>
                                        <td>{item?.description}</td>
                                        {/* <td>{item?.description?.length > 50 ? `${item?.description?.subString(0, 50)} ...` : item?.description}</td> */}
                                        <td>
                                            <a className="edit" title={translate('general.delete')} onClick={() => handleEditTask(listIndex)}><i className="material-icons">edit</i></a>
                                            <a className="delete" title={translate('general.delete')} onClick={() => handleDeleteTask(listIndex)}><i className="material-icons">delete</i></a>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </fieldset>
        )
    }

    return (
        <div id={id} className="tab-pane">
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

const connectComponent = connect(mapState, actionCreators)(withTranslate(DecisionForImplement));
export { connectComponent as DecisionForImplement };