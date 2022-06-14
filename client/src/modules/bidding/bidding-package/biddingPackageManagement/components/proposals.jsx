import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ErrorLabel, SelectBox } from '../../../../../common-components';
import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';
import { EmployeeManagerActions } from '../../../../human-resource/profile/employee-management/redux/actions';
import getAllEmployeeSelectBoxItems from './employeeHelper';

function Proposals(props) {
    const EDIT_TYPE = "EDIT_TYPE", ADD_TYPE = "ADD_TYPE" // , RESET_TYPE = "RESET_TYPE", DELETE_TYPE = "DELETE_TYPE", CANCEL_TYPE = "CANCEL_TYPE";
    const arrUnitTimeList = [
        { text: 'Ngày', value: 'days' },
        { text: 'Giờ', value: 'hours' },
        { text: 'Tháng', value: 'months' },
    ];
    const { translate, employeesManager, user } = props;
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []

    const initTaskData = {
        code: "",
        preceedingTasks: "",
        taskName: "",
        taskDescription: "",
        directEmployees: [],
        backupEmployees: [],
        estimateTime: "",
        unitOfTime: "days",
    }
    const initProposal = {
        executionTime: 0,
        unitOfTime: "days",
        tasks: [],
    }
    const [state, setState] = useState({
        type: ADD_TYPE,
        currentTask: initTaskData,
        currentIndex: null
    });

    const [proposals, setProposals] = useState(props.biddingPackage.proposals ? props.biddingPackage.proposals : initProposal);

    const handleChangeFormV2 = (key, e, listIndex) => {
        let unitTime = proposals.unitOfTime;
        let { value } = e.target;

        let newList = proposals.tasks.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    [key]: value,
                    unitOfTime: unitTime,
                }
            }
            return item;
        })

        let newProposal = {
            ...proposals,
            tasks: newList,
        }

        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

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

    const handleChangeData = (key, e) => {
        let { value } = e.target;

        let newProposal = {
            ...proposals,
            [key]: value
        }

        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

    const handleChangeUnitTime = (key, value) => {
        let newProposal = {
            ...proposals,
            [key]: value[0]
        }

        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

    const handleChangeSelectValue = (key, value) => {
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
        let newList = proposals.tasks
        newList.splice(listIndex, 1)

        let newProposal = {
            ...proposals,
            tasks: newList,
        }
        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
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
            currentTask: proposals.tasks[listIndex],
            currentIndex: listIndex
        })
    }

    const handleSaveTask = (listIndex) => {
        let unitTime = proposals.unitOfTime;
        let { currentTask } = state;
        currentTask.unitOfTime = unitTime;
        let newList = proposals.tasks.map((x, idx) => {

            if (idx === listIndex) {
                x = { ...currentTask }
            }
            return x;
        })

        let newProposal = {
            ...proposals,
            tasks: newList,
        }

        setState({
            ...state,
            type: ADD_TYPE,
            currentTask: initTaskData,
            currentIndex: null
        })
        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

    const handleAddTask = () => {
        let { currentTask } = state
        let newList = proposals.tasks

        newList.push(currentTask)

        let newProposal = {
            ...proposals,
            tasks: newList,
        }


        setState({
            ...state,
            type: ADD_TYPE,
            currentTask: initTaskData,
            currentIndex: null
        })
        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

    useEffect(() => {
        props.getAllEmployee();
        setState({ ...state, id: props.id })
    }, [props.id])

    let allEmployee;
    if (employeesManager && employeesManager.listAllEmployees) {
        allEmployee = employeesManager.listAllEmployees
    }

    let allEmployeeCompany = getAllEmployeeSelectBoxItems(allEmployee);
    const convertEmpIdToName = (allEmployee, id) => {
        const emp = allEmployee?.find(x => String(x._id) === String(id));
        return emp?.fullName;
    }
    const { id, currentIndex, currentTask } = state;

    return (
        <div id={id} className="tab-pane">

            <fieldset className="scheduler-border">
                <legend className="scheduler-border">Đề xuất thời gian</legend>
                <div className="form-group">
                    <label>Thời gian thực hiện<span className="text-red">*</span></label>
                    <input type="number" className="form-control" name={`executeTime`} onChange={(value) => handleChangeData("executionTime", value)} value={proposals.executionTime} placeholder="Thời gian thực hiện" autoComplete="off" />
                </div>
                <div className="form-group">
                    <label>Đơn vị thời gian<span className="text-red">*</span></label>
                    <SelectBox
                        id={`select-proposal-bidding-unitOfTime`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        items={arrUnitTimeList}
                        onChange={(value) => handleChangeUnitTime("unitOfTime", value)}
                        value={proposals.unitOfTime}
                        multiple={false}
                    />
                </div>
            </fieldset>
            <fieldset className="scheduler-border">
                <legend className="scheduler-border">Đề xuất công việc</legend>
                <div className="box-body">
                    <div className="row" style={{ paddingTop: '10px' }}>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Tên công việc<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name={`taskName-${currentIndex}`} onChange={(value) => handleChangeForm("taskName", value)} value={currentTask?.taskName} placeholder="Tên công việc" autoComplete="off" />
                                <ErrorLabel content={currentTask?.taskNameError} />
                            </div>
                            <div className="form-group">
                                <label>Mã công việc<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name={`code-${currentIndex}`} onChange={(value) => handleChangeForm("code", value)} value={currentTask?.code} placeholder="Mã công việc" autoComplete="off" />
                            </div>
                            <div className="form-group">
                                <label>Công việc tiền nhiệm</label>
                                <input type="text" className="form-control" name={`preceedingTasks-${currentIndex}`} onChange={(value) => handleChangeForm("preceedingTasks", value)} value={currentTask?.preceedingTasks} placeholder="Công việc tiền nhiệm" autoComplete="off" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Thời gian thực hiện<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name={`estimateTime-${currentIndex}`} onChange={(value) => handleChangeForm("estimateTime", value)} value={currentTask?.estimateTime} placeholder="Thời gian thực hiện" autoComplete="off" />
                                <ErrorLabel content={currentTask?.estimateTimeError} />
                            </div>
                            <div className="form-group">
                                <label>Mô tả công việc</label>
                                <textarea type="text" rows={4} style={{ minHeight: '103.5px' }}
                                    name={`desc-${currentIndex}`}
                                    onChange={(value) => handleChangeForm("taskDescription", value)}
                                    value={currentTask?.taskDescription}
                                    className="form-control"
                                    placeholder="Mô tả công việc"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={`form-group`}>
                            <label className="control-label">Nhân sự trực tiếp<span className="text-red">*</span></label>
                            {allEmployeeCompany && <SelectBox
                                id={`direct-employee-${currentIndex}-${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={allEmployeeCompany ? allEmployeeCompany : []}
                                onChange={(value) => handleChangeSelectValue("directEmployees", value)}
                                options={{ placeholder: "Chọn nhân sự trực tiếp" }}
                                value={currentTask?.directEmployees}
                                multiple={true}
                            />}
                        </div>
                        <div className={`form-group`}>
                            <label className="control-label">Nhân sự dự phòng<span className="text-red">*</span></label>
                            {allEmployeeCompany && <SelectBox
                                id={`backup-employee-${currentIndex}-${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={allEmployeeCompany ? allEmployeeCompany : []}
                                onChange={(value) => handleChangeSelectValue("backupEmployees", value)}
                                options={{ placeholder: "Chọn nhân sự dự phòng" }}
                                value={currentTask?.backupEmployees}
                                multiple={true}
                            />}
                        </div>
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
                            <th>Mã công việc</th>
                            <th>Tên công việc</th>
                            <th>Công việc tiền nhiệm</th>
                            <th>Thời gian thực hiện</th>
                            <th>Mô tả công việc</th>
                            <th>Nhân sự trực tiếp</th>
                            <th>Nhân sự dự phòng</th>
                            <th>{translate('task_template.action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            proposals.tasks?.map((item, listIndex) => {
                                return (
                                    <tr key={listIndex}>
                                        <td>{item?.code}</td>
                                        <td>{item?.taskName}</td>
                                        <td>{item?.preceedingTasks}</td>
                                        <td>{item?.estimateTime} ({arrUnitTimeList.find(x => x.value === item?.unitOfTime)?.text || ""})</td>
                                        <td>{item?.taskDescription}</td>
                                        <td>{item?.directEmployees.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ')}</td>
                                        <td>{item?.backupEmployees.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ')}</td>
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

                {/* <button className='btn btn-success' onClick={() => { handleAddProposal() }}>Thêm</button> */}
            </fieldset>
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

const connectComponent = connect(mapState, actionCreators)(withTranslate(Proposals));
export { connectComponent as Proposals };