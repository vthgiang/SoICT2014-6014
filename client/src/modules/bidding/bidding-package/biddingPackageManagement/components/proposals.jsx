import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ErrorLabel, SelectBox } from '../../../../../common-components';
import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';
import { EmployeeManagerActions } from '../../../../human-resource/profile/employee-management/redux/actions';
import getAllEmployeeSelectBoxItems, { getAllEmployeeWithTaskSelectBoxItems, getEmployeeInfoWithTask } from './employeeHelper';
import { taskManagementActions } from '../../../../task/task-management/redux/actions';
import { ModalViewEmployee } from './modalViewEmployee';
import { ModalProposeEmpForTask } from './modalProposalTask';
import "./timelineStyle.css";

function Proposals(props) {
    const EDIT_TYPE = "EDIT_TYPE", ADD_TYPE = "ADD_TYPE" // , RESET_TYPE = "RESET_TYPE", DELETE_TYPE = "DELETE_TYPE", CANCEL_TYPE = "CANCEL_TYPE";
    const arrUnitTimeList = [
        { text: 'Ngày', value: 'days' },
        { text: 'Giờ', value: 'hours' },
        // { text: 'Tháng', value: 'months' },
    ];
    const { translate, employeesManager, user, tasks } = props;
    const allUsers = user && user.list
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []

    const initTaskData = {
        code: "",
        tag: "",
        preceedingTasks: "",
        taskName: "",
        taskDescription: "",
        directEmployees: [],
        backupEmployees: [],
        estimateTime: 1,
        unitOfTime: "days",
    }
    const initTag = {
        name: "",
        description: "",
        employees: [],
    }
    const initProposal = {
        executionTime: 0,
        unitOfTime: "days",
        tags: [],
        tasks: [],
    }
    const [state, setState] = useState({
        type: ADD_TYPE,
        currentTask: initTaskData,
        currentIndex: null,
        tagType: ADD_TYPE,
        currentTag: initTag,
        currentTagIndex: null,
    });

    const [proposals, setProposals] = useState(props.biddingPackage.proposals ? props.biddingPackage.proposals : initProposal);
    const [biddingPackage, setBiddingPackage] = useState(props.biddingPackage ? props.biddingPackage : {});
    const [step, setStep] = useState({
        currentStep: 0,
        steps: [
            {
                label: "Chuẩn bị thông tin",
                active: true,
            },
            {
                label: "Đề xuất công việc",
                active: false,
            },
        ]
    })
    const handleGoToStep = (index, e = undefined) => {
        if (e) e.preventDefault();
        if (index === 0 || index === 1) {
            let newStep = step.steps.map((x, idx) => {
                if (idx <= index) {
                    return {
                        ...x,
                        active: true
                    }
                }
                else {
                    return {
                        ...x,
                        active: false,
                    }
                }
            })
            setStep({
                ...step,
                currentStep: index,
                steps: newStep
            });
        }
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

    // Begin - hàm xử lý tasks
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

    const handleChangeUnitTime = (key, value) => {
        let newProposal = {
            ...proposals,
            [key]: value[0]
        }

        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

    const handleChangeSelectValue = (key, value) => {
        if (key === "tag") {
            setState({
                ...state,
                currentTask: {
                    ...state.currentTask,
                    [key]: value[0],
                    directEmployees: [],
                    backupEmployees: [],
                }
            })
        } else {
            setState({
                ...state,
                currentTask: {
                    ...state.currentTask,
                    [key]: value
                }
            })
        }
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
    // end --- hàm xử lý tasks


    // begin --- Các hàm xử lý TAG
    const handleChangeTagForm = (key, e) => {
        let { value } = e.target;

        setState({
            ...state,
            currentTag: {
                ...state.currentTag,
                [key]: value
            }
        })
    }
    const handleChangeTagEmployee = (key, value) => {
        setState({
            ...state,
            currentTag: {
                ...state.currentTag,
                [key]: value
            }
        })
    }

    const handleDeleteTag = (listIndex) => {
        let newList = proposals.tags
        newList.splice(listIndex, 1)

        let newProposal = {
            ...proposals,
            tags: newList,
        }
        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

    const handleResetTag = () => {
        setState({
            ...state,
            type: ADD_TYPE,
            currentTag: initTag,
            currentTagIndex: null
        })
    }

    const handleCancelTag = () => {
        setState({
            ...state,
            type: ADD_TYPE,
            currentTag: initTag,
            currentTagIndex: null
        })
    }

    const handleEditTag = (listIndex) => {
        setState({
            ...state,
            type: EDIT_TYPE,
            currentTag: proposals.tags[listIndex],
            currentTagIndex: listIndex
        })
    }

    const handleSaveTag = (listIndex) => {
        let { currentTag } = state;
        let newList = proposals.tags.map((x, idx) => {

            if (idx === listIndex) {
                x = { ...currentTag }
            }
            return x;
        })

        let newProposal = {
            ...proposals,
            tags: newList,
        }

        setState({
            ...state,
            type: ADD_TYPE,
            currentTag: initTag,
            currentTagIndex: null
        })
        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

    const handleAddTag = () => {
        let { currentTag } = state
        let newList = proposals.tags

        newList.push(currentTag)

        let newProposal = {
            ...proposals,
            tags: newList,
        }


        setState({
            ...state,
            type: ADD_TYPE,
            currentTag: initTag,
            currentTagIndex: null
        })
        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

    // end --- Các hàm xử lý tag

    const handleShowViewEmployee = (id) => {
        setTimeout(() => {
            window.$(`#modal-view-employee-${id}`).modal('show');
        }, 500);
    }

    const handelProposeModal = (id) => {
        setTimeout(() => {
            window.$(`#modal-view-propose-emp-for-task-${id}`).modal('show');
        }, 500);
    }

    const handleAcceptProposal = (newProposal) => {
        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

    useEffect(() => {
        props.getAllEmployee();
        setState({ ...state, id: props.id });
        props.getPaginateTasks({ getAll: true });
    }, [props.id]);

    let allEmployee;
    if (employeesManager && employeesManager.listAllEmployees) {
        allEmployee = employeesManager.listAllEmployees
    }

    const { id, currentIndex, currentTask, currentTag, currentTagIndex } = state;
    const { currentStep, steps } = step;
    let listEmpInfoFormated = getEmployeeInfoWithTask(allUsers, allEmployee, tasks?.tasks ?? [], proposals?.executionTime ?? 0, proposals?.unitOfTime, biddingPackage);
    useEffect(() => {
        listEmpInfoFormated = getEmployeeInfoWithTask(allUsers, allEmployee, tasks?.tasks ?? [], proposals?.executionTime ?? 0, proposals?.unitOfTime, biddingPackage);
    }, [currentTask?.estimateTime, proposals?.executionTime, proposals?.unitOfTime])

    let allEmployeeCompany = getAllEmployeeSelectBoxItems(allEmployee);
    const convertEmpIdToName = (allEmployee, id) => {
        const emp = allEmployee?.find(x => String(x._id) === String(id));
        return emp?.fullName;
    }

    let listTag = proposals?.tags?.map(x => { return { text: x.name, value: x.name } })
    // listTag ?? listTag.unshift({ text: "---Chọn thẻ---", value: "" });

    const getListEmpByTag = (tag) => {
        let emps = proposals?.tags?.find(x => x.name === tag)?.employees ?? [];
        let listEmpByTag = listEmpInfoFormated.filter(x => emps.indexOf(String(x.value)) !== -1);
        return listEmpByTag;
    }
    let listEmpbyTag = getListEmpByTag(currentTask.tag);
    console.log(402, proposals);

    return (
        <div id={id} className="tab-pane">
            {/* step timeline section */}
            <div className="timeline">
                <div className="timeline-progress" style={{ width: `${(currentStep * 100) / (steps.length - 1)}%` }}></div>
                <div className="timeline-items">
                    {steps.map((item, index) => (
                        <div
                            className={`timeline-item ${item.active ? "active" : ""}`}
                            key={`proposal-timeline-${index}`}
                            onClick={(e) => handleGoToStep(index, e)}
                        >
                            <div className={`timeline-contain ${item.active ? "active" : ""}`}>{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {currentStep === 0 && <div>
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
                    <legend className="scheduler-border">Đề xuất thẻ công việc</legend>
                    <div >
                        <div className="form-group">
                            <label>Tên thẻ<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name={`name-tag-${currentIndex}`} onChange={(value) => handleChangeTagForm("name", value)} value={currentTag?.name} placeholder="Tên thẻ" autoComplete="off" />
                            <ErrorLabel content={currentTag?.tagNameError} />
                        </div>
                        <div className="form-group">
                            <label>Mô tả thẻ</label>
                            <textarea type="text" rows={3} style={{ minHeight: '73.5px' }}
                                name={`desc-tag-${currentIndex}`}
                                onChange={(value) => handleChangeTagForm("description", value)}
                                value={currentTag?.description}
                                className="form-control"
                                placeholder="Mô tả công việc"
                                autoComplete="off"
                            />
                        </div>
                        <div className={`form-group`}>
                            <label className="control-label">Nhân sự thực hiện<span className="text-red">*</span></label>
                            {listEmpInfoFormated && <SelectBox
                                id={`tag-employees-${currentIndex}-${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={listEmpInfoFormated ? listEmpInfoFormated : []}
                                onChange={(value) => handleChangeTagEmployee("employees", value)}
                                options={{ placeholder: "Chọn nhân sự" }}
                                value={currentTag?.employees}
                                multiple={true}
                            />}
                        </div>
                    </div>

                    <div className="pull-right row" style={{ marginRight: 0, marginBottom: "15px" }}>
                        {state.tagType === EDIT_TYPE &&
                            <>
                                <button className='btn btn-danger' style={{ marginRight: '5px' }} type={"button"} onClick={() => { handleCancelTag() }}>Hủy</button>
                                <button className='btn btn-success' style={{ marginRight: '5px' }} type={"button"} onClick={() => { handleSaveTag(state.currentTagIndex) }}>Lưu</button>
                            </>
                        }
                        {state.tagType === ADD_TYPE &&
                            <button className='btn btn-success' style={{ marginRight: '5px' }} type={"button"} onClick={() => { handleAddTag() }}>Thêm</button>
                        }
                        <button className='btn btn-primary' type={"button"} onClick={() => { handleResetTag() }}>Xóa trắng</button>
                    </div>

                    <table id="project-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Tên thẻ</th>
                                <th>Mô tả</th>
                                <th>Nhân sự thực hiện</th>
                                <th>{translate('task_template.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                proposals.tags?.map((item, listIndex) => {
                                    return (
                                        <tr key={`tag-${listIndex}`}>
                                            <td>{item?.name}</td>
                                            <td>{item?.description}</td>
                                            <td>{item?.employees.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ')}</td>
                                            <td>
                                                <a className="edit" title={translate('general.delete')} onClick={() => handleEditTag(listIndex)}><i className="material-icons">edit</i></a>
                                                <a className="delete" title={translate('general.delete')} onClick={() => handleDeleteTag(listIndex)}><i className="material-icons">delete</i></a>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>

                    {proposals.tags?.length <= 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
                </fieldset>
            </div>}
            {currentStep === 1 && <div>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Đề xuất công việc</legend>
                    <div className="">{/** box-body */}
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
                                <label className="control-label">Thẻ công việc<span className="text-red">*</span></label>
                                {listTag?.length ? <SelectBox
                                    id={`tag-task-${currentIndex}-${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={listTag ? listTag : []}
                                    onChange={(value) => handleChangeSelectValue("tag", value)}
                                    options={{ placeholder: "Chọn thẻ cho công việc" }}
                                    value={currentTask?.tag}
                                    multiple={false}
                                /> : <span>Chưa có danh sách thẻ - hãy tạo thẻ ở trên!</span>}
                            </div>
                            <div className={`form-group`}>
                                {/* style={{display: "flex", justifyContent: "flex-end"}} */}
                                <div className='pull-right'>
                                    <ModalViewEmployee
                                        id={id ?? ""}
                                        listEmployee={listEmpInfoFormated}
                                    />
                                    <a style={{ cursor: "pointer" }} onClick={() => handleShowViewEmployee(id)}>Xem thông tin nhân viên</a>
                                </div>
                                <label className="control-label">Nhân sự trực tiếp<span className="text-red">*</span></label>
                                {listEmpbyTag && <SelectBox
                                    id={`direct-employee-${currentIndex}-${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={listEmpbyTag?.length > 0 ? listEmpbyTag : listEmpInfoFormated ?? []}
                                    onChange={(value) => handleChangeSelectValue("directEmployees", value)}
                                    options={{ placeholder: "Chọn nhân sự trực tiếp" }}
                                    value={currentTask?.directEmployees}
                                    multiple={true}
                                />}
                            </div>
                            <div className={`form-group`}>
                                <label className="control-label">Nhân sự dự phòng<span className="text-red">*</span></label>
                                {listEmpbyTag && <SelectBox
                                    id={`backup-employee-${currentIndex}-${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={listEmpbyTag?.length > 0 ? listEmpbyTag : listEmpInfoFormated ?? []}
                                    onChange={(value) => handleChangeSelectValue("backupEmployees", value)}
                                    options={{ placeholder: "Chọn nhân sự dự phòng" }}
                                    value={currentTask?.backupEmployees}
                                    multiple={true}
                                />}
                            </div>
                        </div>
                    </div>

                    {proposals?.tasks?.length ? <div>
                        <ModalProposeEmpForTask
                            id={id ?? ""}
                            data={{
                                proposals: proposals,
                                biddingPackage: biddingPackage,
                                unitOfTime: proposals?.unitOfTime,
                                executionTime: proposals?.executionTime,
                            }}
                            handleAcceptProposal={handleAcceptProposal}
                        />
                        <button className='btn btn-success' style={{ marginRight: '5px' }} type={"button"} onClick={() => { handelProposeModal(id) }}>Đề xuất tự động</button>
                    </div> : null
                    }
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
                                <th>Thẻ công việc</th>
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
                                            <td>{item?.tag}</td>
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
                    {proposals.tasks?.length <= 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
                </fieldset>
            </div>}
        </div>
    );
};


function mapState(state) {
    const { employeesManager, user, tasks } = state;
    return { employeesManager, user, tasks };
}

const actionCreators = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    getPaginateTasks: taskManagementActions.getPaginateTasks,
};

const connectComponent = connect(mapState, actionCreators)(withTranslate(Proposals));
export { connectComponent as Proposals };