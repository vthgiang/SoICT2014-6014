import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DataTableSetting, ErrorLabel, SelectBox } from '../../../../../common-components';
import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';
import { EmployeeManagerActions } from '../../../../human-resource/profile/employee-management/redux/actions';
import getAllEmployeeSelectBoxItems, { convertTagIdToTagName, getAllEmployeeWithTaskSelectBoxItems, getEmployeeInfoWithTask } from './employeeHelper';
import { taskManagementActions } from '../../../../task/task-management/redux/actions';
import { ModalViewEmployee } from './modalViewEmployee';
import { ModalProposeEmpForTask } from './modalProposalTask';
import "./timelineStyle.css";
import { ViewTaskInGantt } from './viewTaskInGantt';
import { TagActions } from '../../../tags/redux/actions';
import CreateTagForm from '../../../tags/component/createForm';

function Proposals(props) {
    const EDIT_TYPE = "EDIT_TYPE", ADD_TYPE = "ADD_TYPE" // , RESET_TYPE = "RESET_TYPE", DELETE_TYPE = "DELETE_TYPE", CANCEL_TYPE = "CANCEL_TYPE";
    const arrUnitTimeList = [
        { text: 'Ngày', value: 'days' },
        { text: 'Giờ', value: 'hours' },
        // { text: 'Tháng', value: 'months' },
    ];
    const { translate, employeesManager, user, tasks, tag } = props;
    const allUsers = user && user.list
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []

    const initTaskData = {
        code: "",
        // tag: proposals.tags?.length ? proposals.tags[0].name : "",
        tag: null,
        preceedingTasks: [],
        taskName: "",
        taskDescription: "",
        numberOfEmployees: 1,
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
    const [proposals, setProposals] = useState(props.biddingPackage.proposals ? props.biddingPackage.proposals : initProposal);
    const [biddingPackage, setBiddingPackage] = useState(props.biddingPackage ? props.biddingPackage : {});
    const [isTable, setIsTable] = useState(true);
    const [state, setState] = useState({
        type: ADD_TYPE,
        currentTask: initTaskData,
        currentIndex: null,
        tagType: ADD_TYPE,
        currentTag: initTag,
        currentTagIndex: null,
        showFormTask: proposals?.tasks?.length === 0 ? true : false,
        showFormTag: proposals?.tags?.length === 0 ? true : false,
    });
    const [step, setStep] = useState({
        currentStep: 0,
        steps: [
            {
                label: "Chuẩn bị thông tin",
                active: true,
            },
            {
                label: "Tối ưu đề xuất",
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
        setState({
            ...state,
            currentTask: initTaskData,
            currentIndex: null
        })
        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

    const handleResetTask = () => {
        setState({
            ...state,
            // type: ADD_TYPE,
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
            currentIndex: listIndex,
            showFormTask: true,
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

    const handleShowViewEmployee = (id) => {
        setTimeout(() => {
            window.$(`#modal-view-employee-${id}`).modal('show');
        }, 500);
    }

    const handleShowCreateTag = (id) => {
        setTimeout(() => {
            window.$(`#modal-create-tag-${id}`).modal('show');
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
        setState({
            ...state,
            id: props.id,
            proposalType: props.type,
            bidId: props.bidId,
            listCareer: props.listCareer,
        });
        props.getPaginateTasks({ getAll: true });
    }, [props.id]);

    useEffect(() => {
        props.getListTag({});
    }, [])

    let allEmployee;
    if (employeesManager && employeesManager.listAllEmployees) {
        allEmployee = employeesManager.listAllEmployees
    }

    const { id, currentIndex, currentTask, currentTag, currentTagIndex, bidId, proposalType, listCareer, showFormTag, showFormTask } = state;
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

    let alltag = [];
    if (tag && tag.listTag) {
        alltag = tag?.listTag
    }

    let listTag = alltag?.map(x => { return { text: x?.name, value: x?._id } })

    const getListEmpByTag = (tag) => {
        let emps = proposals?.tags?.find(x => x.name === tag)?.employees ?? [];
        let listEmpByTag = listEmpInfoFormated.filter(x => emps.indexOf(String(x.value)) !== -1);
        return listEmpByTag;
    }
    let listEmpbyTag = getListEmpByTag(currentTask.tag);

    let listPreTask = proposals?.tasks?.map(x => { return { text: x.code, value: x.code?.trim() } }) ?? []

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
                    <legend className="scheduler-border">Đề xuất công việc</legend>
                    <a style={{ cursor: 'pointer' }} onClick={() => setState({ ...state, showFormTask: !showFormTask })}>{showFormTask ? "Ẩn form" : "Hiển thị form"}</a>
                    <br />
                    <CreateTagForm
                        id={`${currentIndex}-${id}`}
                    />
                    {!showFormTask ? null : <div>
                        <div>
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
                                        <SelectBox
                                            id={`${proposalType}--preceeding-task-${currentIndex}-${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={listPreTask ? listPreTask : []}
                                            onChange={(value) => handleChangeSelectValue("preceedingTasks", value)}
                                            options={{ placeholder: "Chọn công việc tiền nhiệm" }}
                                            value={currentTask?.preceedingTasks}
                                            multiple={true}
                                        />
                                        {/* <input type="text" className="form-control" name={`preceedingTasks-${currentIndex}`} onChange={(value) => handleChangeForm("preceedingTasks", value)} value={currentTask?.preceedingTasks} placeholder="Công việc tiền nhiệm" autoComplete="off" /> */}
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
                                    <label className="control-label">Thẻ công việc<span className="text-red">*</span>
                                        ( <a style={{ cursor: "pointer" }} onClick={() => handleShowCreateTag(`${currentIndex}-${id}`)}>Quản lý</a> )
                                    </label>
                                    {<SelectBox
                                        id={`${proposalType}--tag-task-${currentIndex}-${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={listTag ? listTag : []}
                                        onChange={(value) => handleChangeSelectValue("tag", value)}
                                        options={{ placeholder: "Chọn thẻ cho công việc" }}
                                        value={currentTask?.tag}
                                        multiple={false}
                                    />}
                                </div>
                                <div className="form-group">
                                    {/* style={{display: "flex", justifyContent: "flex-end"}} */}
                                    <div className='pull-right'>
                                        <ModalViewEmployee
                                            id={id ?? ""}
                                            listEmployee={listEmpInfoFormated}
                                        />
                                        <a style={{ cursor: "pointer" }} onClick={() => handleShowViewEmployee(id)}>Xem thông tin nhân viên</a>
                                    </div>
                                    <label>Số người thực hiện<span className="text-red">*</span></label>
                                    <input type="number" className="form-control" name={`numberOfEmployees-${currentIndex}`} onChange={(value) => handleChangeForm("numberOfEmployees", value)} value={currentTask?.numberOfEmployees} placeholder="Số người thực hiện" autoComplete="off" />
                                </div>
                            </div>
                        </div>
                        <div className="row" style={{ marginRight: 0, marginBottom: "15px", display: "flex", justifyContent: "flex-end" }}>
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
                    </div>
                    }

                    <div style={{ display: 'flex', justifyContent: "space-between" }}>
                        <div className="box-tools" style={{ marginBottom: '5px' }}>
                            <div className="btn-group">
                                <button type="button" onClick={() => setIsTable(!isTable)} className={`btn btn-xs ${isTable ? "btn-danger" : "active"}`}>Bảng</button>
                                <button type="button" onClick={() => setIsTable(!isTable)} className={`btn btn-xs ${!isTable ? "btn-danger" : "active"}`}>Biểu đồ Gantt</button>
                            </div>
                        </div>
                    </div>
                    <br />
                    {
                        !isTable ? <ViewTaskInGantt
                            taskList={proposals?.tasks}
                            allEmployee={allEmployee}
                        /> : <table id="task-proposal-table" className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Mã công việc</th>
                                    <th>Tên công việc</th>
                                    <th>Công việc tiền nhiệm</th>
                                    <th>Thẻ công việc</th>
                                    <th>Thời gian thực hiện</th>
                                    <th>Mô tả công việc</th>
                                    {/* <th>Nhân sự trực tiếp</th>
                                    <th>Nhân sự dự phòng</th> */}
                                    <th>Số người thực hiện</th>
                                    <th style={{ width: '90px', textAlign: 'center' }}>
                                        {translate('table.action')}
                                        <DataTableSetting
                                            columnName={translate('table.action')}
                                            columnArr={[
                                                "Mã công việc",
                                                "Tên công việc",
                                                "Công việc tiền nhiệm",
                                                "Thẻ công việc",
                                                "Thời gian thực hiện",
                                                "Mô tả công việc",
                                                // "Nhân sự trực tiếp",
                                                // "Nhân sự dự phòng",
                                                "Số người thực hiện",
                                            ]}
                                            tableId={`task-proposal-table`}
                                            tableContainerId="task-proposal-table-container"
                                            tableWidth="1300px"
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    proposals.tasks?.map((item, listIndex) => {
                                        return (
                                            <tr key={listIndex}>
                                                <td>{item?.code}</td>
                                                <td>{item?.taskName}</td>
                                                <td>{item?.preceedingTasks?.join(", ")}</td>
                                                <td>{convertTagIdToTagName(alltag, item?.tag)}</td>
                                                <td>{item?.estimateTime} ({arrUnitTimeList.find(x => x.value === item?.unitOfTime)?.text || ""})</td>
                                                <td>{item?.taskDescription}</td>
                                                <td>{item?.numberOfEmployees}</td>
                                                {/* <td>{item?.directEmployees.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ')}</td>
                                                <td>{item?.backupEmployees.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ')}</td> */}
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
                    }

                    {proposals.tasks?.length <= 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
                </fieldset>
            </div>}
            {currentStep === 1 && <div>
                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                    <div className="box-tools" style={{ marginBottom: '5px' }}>
                        <div className="btn-group">
                            <button type="button" onClick={() => setIsTable(!isTable)} className={`btn btn-xs ${isTable ? "btn-danger" : "active"}`}>Bảng</button>
                            <button type="button" onClick={() => setIsTable(!isTable)} className={`btn btn-xs ${!isTable ? "btn-danger" : "active"}`}>Biểu đồ Gantt</button>
                        </div>
                    </div>
                    {proposals?.tasks?.length ? <div>
                        <ModalProposeEmpForTask
                            id={id ?? ""}
                            bidId={bidId}
                            proposalType={proposalType}
                            allEmployee={allEmployee}
                            listCareer={listCareer}
                            allTag={alltag}
                            data={{
                                bidId: bidId,
                                type: proposalType,
                                proposals: proposals,
                                biddingPackage: biddingPackage,
                                unitOfTime: proposals?.unitOfTime,
                                executionTime: proposals?.executionTime,
                            }}
                            handleAcceptProposal={handleAcceptProposal}
                        />
                        <a style={{ margin: '0 0 5px 5px', textDecoration: "underline", fontWeight: "600", cursor: "pointer" }} onClick={() => { handelProposeModal(id) }}>
                            Tối ưu đề xuất nhân sự<i className='fa fa-arrow-circle-right'></i>
                        </a>
                    </div> : null
                    }
                </div>
                <br />

                {/* <DataTableSetting
                    columnName={translate('table.action')}
                    columnArr={[
                        "Mã công việc",
                        "Tên công việc",
                        "Công việc tiền nhiệm",
                        "Thẻ công việc",
                        "Thời gian thực hiện",
                        "Mô tả công việc",
                        "Nhân sự trực tiếp",
                        "Nhân sự dự phòng",
                        // "Số người thực hiện",
                    ]}
                    tableId={`task-proposal-table-result`}
                    tableContainerId="task-proposal-table-result-container"
                    tableWidth="1300px"
                /> */}
                {
                    !isTable ? <ViewTaskInGantt
                        taskList={proposals?.tasks}
                        allEmployee={allEmployee}
                    /> : <table id="task-proposal-table-result" className="table not-has-action table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Mã công việc</th>
                                <th>Tên công việc</th>
                                <th>Công việc tiền nhiệm</th>
                                <th>Thẻ công việc</th>
                                <th>Thời gian thực hiện</th>
                                <th>Mô tả công việc</th>
                                {proposals?.tasks[0]?.directEmployees?.length > 0 && <th>Nhân sự trực tiếp</th>}
                                {proposals?.tasks[0]?.backupEmployees?.length > 0 && <th>Nhân sự dự phòng</th>}
                                {proposals?.tasks[0]?.directEmployees?.length <= 0 && <th>Số người thực hiện</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                proposals.tasks?.map((item, listIndex) => {
                                    return (
                                        <tr key={listIndex}>
                                            <td>{item?.code}</td>
                                            <td>{item?.taskName}</td>
                                            <td>{item?.preceedingTasks?.join(", ")}</td>
                                            <td>{convertTagIdToTagName(alltag, item?.tag)}</td>
                                            <td>{item?.estimateTime} ({arrUnitTimeList.find(x => x.value === item?.unitOfTime)?.text || ""})</td>
                                            <td>{item?.taskDescription}</td>
                                            {item?.directEmployees?.length > 0 && <td>{item?.directEmployees.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ')}</td>}
                                            {item?.backupEmployees?.length > 0 && <td>{item?.backupEmployees.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ')}</td>}
                                            {item?.directEmployees?.length <= 0 && <td>{item?.numberOfEmployees}</td>}
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                }

                {proposals.tasks?.length <= 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
            </div>}
        </div>
    );
};


function mapState(state) {
    const { employeesManager, user, tasks, tag } = state;
    return { employeesManager, user, tasks, tag };
}

const actionCreators = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    getPaginateTasks: taskManagementActions.getPaginateTasks,
    getListTag: TagActions.getListTag,
};

const connectComponent = connect(mapState, actionCreators)(withTranslate(Proposals));
export { connectComponent as Proposals };