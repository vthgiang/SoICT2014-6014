import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { DialogModal, ErrorLabel, DatePicker, SelectBox, TimePicker } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { ProjectActions } from '../redux/actions';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { formatDate } from '../../../../helpers/formatDate';
import { convertDateTime, convertDepartmentIdToDepartmentName, convertUserIdToUserName, formatTime, getListDepartments } from './functionHelper';
import { getStorage } from '../../../../config';
import ModalSalaryMembersEdit from './modalSalaryMembersEdit';
import { TaskFormValidator } from '../../../task/task-management/component/taskFormValidator';

const ProjectEditForm = (props) => {
    const { translate, user, projectEdit, projectEditId, currentProjectTasks } = props;
    const userId = getStorage('userId');
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    const listDepartments = user && user.usersInUnitsOfCompany ? getListDepartments(user.usersInUnitsOfCompany) : []
    const [currentSalaryMembers, setCurrentSalaryMembers] = useState([]);
    const fakeUnitCostList = [
        { text: 'VND', value: 'VND' },
        { text: 'USD', value: 'USD' },
    ]
    const fakeUnitTimeList = [
        { text: 'Ngày', value: 'days' },
        { text: 'Giờ', value: 'hours' },
    ]
    const fakeProjectTypeList = [
        { text: 'QLDA dạng đơn giản', value: 1 },
        { text: 'QLDA phương pháp CPM', value: 2 },
    ]
    const preprocessUsersList = useCallback((currentObject) => {
        if (typeof currentObject?.[0] === 'string') {
            return currentObject;
        }
        return currentObject?.map(item => item._id)
    }, [])
    const [state, setState] = useState({
        newProject: {
            projectName: '',
            projectType: 2,
            description: '',
            startDate: '',
            endDate: '',
            projectManager: [],
            responsibleEmployees: [],
            unitCost: fakeUnitCostList[0].value,
            unitTime: fakeUnitTimeList[0].value,
            estimatedCost: '',
            startTime:'',
            endTime: '05:30 PM',
            responsibleEmployeesWithUnit: {
                list: [],
                currentUnitRow: '',
                currentEmployeeRow: []
            },
            errorOnProjectName: undefined,
            errorOnProjectType: undefined,
            errorOnStartDate: undefined,
            errorOnEndDate: undefined,
            errorOnStartTime: undefined,
            errorOnEndTime: undefined,
            errorOnProjectManager: undefined,
            errorOnResponsibleEmployees: undefined,
        }
    });

    let { newProject } = state;

    let { projectName, projectType, description, startDate, endDate, projectManager, responsibleEmployees, unitCost, unitTime, estimatedCost,
        startTime, endTime,  responsibleEmployeesWithUnit, errorOnProjectName, errorOnProjectType, errorOnStartDate, errorOnEndDate, errorOnStartTime,
        errorOnEndTime, errorOnProjectManager, errorOnResponsibleEmployees} = state?.newProject;

    useEffect(() => {
        let newResponsibleEmployeesWithUnit = [];
        console.log('responsibleEmployeesWithUnit.list', responsibleEmployeesWithUnit.list)
        // console.log('currentSalaryMembers create project', currentSalaryMembers)
        if (responsibleEmployeesWithUnit.list) {
            for (let i = 0; i < responsibleEmployeesWithUnit.list.length; i++) {
                newResponsibleEmployeesWithUnit.push({
                    unitId: responsibleEmployeesWithUnit.list[i].unitId,
                    listUsers: responsibleEmployeesWithUnit.list[i].listUsers.map((item, index) => ({
                        userId: item,
                        salary: currentSalaryMembers?.[i]?.listUsers?.[index]?.salary,
                    }))
                })
            }
            setCurrentSalaryMembers(newResponsibleEmployeesWithUnit)
        }
    }, [responsibleEmployeesWithUnit.list])

    // Cập nhật lại các trường thông tin nếu chọn dự án khác
    useEffect(() => {
        let newResponsibleEmployeesWithUnit = [];
        for (let i = 0; i < projectEdit?.responsibleEmployeesWithUnit.length; i++) {
            newResponsibleEmployeesWithUnit.push({
                unitId: projectEdit?.responsibleEmployeesWithUnit[i].unitId,
                listUsers: projectEdit?.responsibleEmployeesWithUnit[i].listUsers.map((item, index) => ({
                    userId: item.userId,
                    salary: item.salary,
                }))
            })
        }
        setCurrentSalaryMembers(newResponsibleEmployeesWithUnit)
        setState(state => {
            return{
                ...state,
                newProject: {
                    projectName: projectEdit?.name || "",
                    projectType: projectEdit?.projectType || 2,
                    description: projectEdit?.description || "",
                    startDate: projectEdit?.startDate ? formatDate(projectEdit?.startDate) : '',
                    endDate: projectEdit?.endDate ? formatDate(projectEdit?.endDate) : '',
                    projectManager: preprocessUsersList(projectEdit?.projectManager),
                    responsibleEmployees: preprocessUsersList(projectEdit?.responsibleEmployees),
                    unitCost: projectEdit?.unitCost || fakeUnitCostList[0].text,
                    unitTime: projectEdit?.unitTime || fakeUnitTimeList[0].text,
                    estimatedCost: projectEdit?.estimatedCost || '',
                    startTime:formatTime(projectEdit?.startDate) || '',
                    endTime: formatTime(projectEdit?.endDate) || '05:30 PM',
                    responsibleEmployeesWithUnit: {
                        list: projectEdit?.responsibleEmployeesWithUnit?.map((unitItem) => {
                            return {
                                unitId: unitItem.unitId,
                                listUsers: unitItem?.listUsers?.map((userItem) => {
                                    return userItem.userId
                                })
                            }
                        }),
                        currentUnitRow: '',
                        currentEmployeeRow: []
                    },
                    errorOnProjectName: undefined,
                    errorOnProjectType: undefined,
                    errorOnStartDate: undefined,
                    errorOnEndDate: undefined,
                    errorOnStartTime: undefined,
                    errorOnEndTime: undefined,
                    errorOnProjectManager: undefined,
                    errorOnResponsibleEmployees: undefined,
                }
            }          
        })
    },[projectEditId])
    
    // if (projectEditId !== projectId) {
    //     setForm({
    //         projectId: projectEditId,
    //         projectNameError: undefined,
    //         projectName: projectEdit?.name || "",
    //         description: projectEdit?.description || "",
    //         projectType: projectEdit?.projectType || 2,
    //         startDate: projectEdit?.startDate ? formatDate(projectEdit?.startDate) : '',
    //         endDate: projectEdit?.endDate ? formatDate(projectEdit?.endDate) : '',
    //         projectManager: preprocessUsersList(projectEdit?.projectManager),
    //         responsibleEmployees: preprocessUsersList(projectEdit?.responsibleEmployees),
    //         unitCost: projectEdit?.unitCost || fakeUnitCostList[0].text,
    //         unitTime: projectEdit?.unitTime || fakeUnitTimeList[0].text,
    //         estimatedCost: projectEdit?.estimatedCost || '',
    //     })
    //     setStartTime(formatTime(projectEdit?.startDate) || '08:00 AM')
    //     setEndTime(formatTime(projectEdit?.endDate) || '05:30 PM')
    //     let newResponsibleEmployeesWithUnit = [];
    //     for (let i = 0; i < projectEdit?.responsibleEmployeesWithUnit.length; i++) {
    //         newResponsibleEmployeesWithUnit.push({
    //             unitId: projectEdit?.responsibleEmployeesWithUnit[i].unitId,
    //             listUsers: projectEdit?.responsibleEmployeesWithUnit[i].listUsers.map((item, index) => ({
    //                 userId: item.userId,
    //                 salary: item.salary,
    //             }))
    //         })
    //     }
    //     setCurrentSalaryMembers(newResponsibleEmployeesWithUnit)
    //     setTimeout(() => {
    //         setResponsibleEmployeesWithUnit({
    //             ...responsibleEmployeesWithUnit,
    //             list: projectEdit?.responsibleEmployeesWithUnit?.map((unitItem) => {
    //                 return {
    //                     unitId: unitItem.unitId,
    //                     listUsers: unitItem?.listUsers?.map((userItem) => {
    //                         return userItem.userId
    //                     })
    //                 }
    //             }),
    //         })
    //     }, 10);
    // }

    // const handleChangeForm = (event, currentKey) => {
    //     if (currentKey === 'projectName') {
    //         let { translate } = props;
    //         let { message } = ValidationHelper.validateName(translate, event.target.value, 6, 255);
    //         setForm({
    //             ...form,
    //             [currentKey]: event.target.value,
    //             projectNameError: message,
    //         })
    //         return;
    //     }
    //     const justRenderEventArr = ['projectManager', 'responsibleEmployees', 'startDate', 'endDate'];
    //     if (justRenderEventArr.includes(currentKey)) {
    //         setForm({
    //             ...form,
    //             [currentKey]: event,
    //         })
    //         return;
    //     }
    //     const renderFirstItemArr = ['unitCost', 'unitTime', 'projectType'];
    //     if (renderFirstItemArr.includes(currentKey)) {
    //         setForm({
    //             ...form,
    //             [currentKey]: event[0],
    //         })
    //         return;
    //     }
    //     if (currentKey === 'estimatedCost') {
    //         setForm({
    //             ...form,
    //             [currentKey]: event.target.value,
    //         })
    //         return;
    //     }
    //     setForm({
    //         ...form,
    //         [currentKey]: event?.target?.value,
    //     })
    // }

    const handleChangeProjectName = (event) => {
        let { value } = event.target;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);

        setState({
            ...state,
            newProject: {
                ...state.newProject,
                projectName: value,
                errorOnProjectName: message,
            }
            
        })
    }

    const handleChangeProjectType = (event) => {
        setState({
            ...state,
            newProject: {
                ...state.newProject,
                projectType: event[0]
            }
        });
    }

    const handleChangeProjectDescription = (event) => {
        let {value} = event.target
        setState({
            ...state,
            newProject: {
                ...state.newProject,
                description: value,
            } 
        });
    }

    const handleChangeProjectStartDate = (value) => {
        validateProjectStartDate(value, true);
    }
    const validateProjectStartDate = (value, willUpdateState = true) => {
        let msg = TaskFormValidator.validateTaskStartDate(value, endDate, translate);
        let _startDate = convertDateTime(value, startTime);
        let _endDate = convertDateTime(endDate, endTime);

        if (_startDate > _endDate) {
            msg = translate('project.add_err_end_date');
        }

        if (willUpdateState) {
            console.log(value)
            setState({
                ...state,
                newProject: {
                    ...state.newProject,
                    startDate: value,
                    errorOnStartDate: msg,
                    errorOnEndDate: !msg && endDate? msg: errorOnEndDate
                }
            })

        }
        return msg === undefined;
    }

    const handleStartTimeChange = (value) => {
        let _startDate = convertDateTime(startDate, value);
        let _endDate = convertDateTime(endDate, endTime);
        let err, resetErr;

        if (value.trim() === "") {
            err = translate('project.add_err_empty_start_date');
        }
        else if (_startDate > _endDate) {
            err = translate('project.add_err_end_date');
            resetErr = undefined;
        }
        setState({
            ...state,
            newProject: {
                ...state.newProject,
                startTime: value,
                errorOnStartDate: err,
                errorOnEndDate: resetErr,
            }
        });
    }

    const handleEndTimeChange = (value) => {
        let _startDate = convertDateTime(startDate, startTime);
        let _endDate = convertDateTime(endDate, value);
        let err, resetErr;

        if (value.trim() === "") {
            err = translate('project.add_err_empty_end_date');
        }
        else if (_startDate > _endDate) {
            err = translate('project.add_err_end_date');
            resetErr = undefined;
        }
        setState({
            ...state,
            newProject: {
                ...state.newProject,
                endTime: value,
                errorOnEndDate: err,
                errorOnStartDate: resetErr,
            }
        })
    }

    const handleChangeProjectEndDate = (value) => {
        validateProjectEndDate(value, true);
    }

    const validateProjectEndDate = (value, willUpdateState = true) => {
        let msg = TaskFormValidator.validateTaskEndDate(startDate, value, translate);
        if (willUpdateState) {
            console.log(value);
            setState({
                ...state,
                newProject: {
                    ...state.newProject,
                    endDate: value,
                    errorOnEndDate: msg,
                    errorOnStartDate: !msg && startDate? msg: errorOnStartDate
                }
            })
        }
        console.log(startDate,endDate)
        return msg === undefined;
    }

    const handleChangeUnitTime = (event) => {
        setState({
            ...state,
            newProject: {
                ...state.newProject,
                unitTime: event[0]
            }
        });
    }

    const handleChangeUnitCost = (event) => {
        setState({
            ...state,
            newProject: {
                ...state.newProject,
                unitCost: event[0]
            }
        });
    }

    const handleChangeProjectManager = (value) => {
        validateProjectManager(value, true);
    }
    const validateProjectManager = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateArrayLength(translate, value);

        if (willUpdateState) {
            setState({
                ...state,
                newProject: {
                    ...state.newProject,
                    projectManager: value,
                    errorOnProjectManager: message
                }
            });
        }
        return message === undefined;
    }

    const handleDeleteRow = (index) => {
        if (responsibleEmployeesWithUnit.list && responsibleEmployeesWithUnit.list.length > 0) {
            const cloneArr = [...responsibleEmployeesWithUnit.list];
            cloneArr.splice(index, 1);
            let { message } = ValidationHelper.validateArrayLength(props.translate, cloneArr);
            // responsibleEmployeesWithUnit.list.splice(responsibleEmployeesWithUnit.list.length - 1, 1);
            setState({
                ...state,
                newProject: {
                    ...state.newProject,
                    responsibleEmployeesWithUnit: {
                        ...responsibleEmployeesWithUnit,
                        list: cloneArr,
                        currentUnitRow: '',
                        currentEmployeeRow: [],
                    },
                    errorOnResponsibleEmployees: message
                }
            })
        }
    }

    const handleAddRow = () => {
        if (responsibleEmployeesWithUnit.currentEmployeeRow.length > 0) {
            // Đề phòng user không chọn gì thì lấy default là Ban giám đốc
            const currentChosenUnitRow = responsibleEmployeesWithUnit.currentUnitRow || listDepartments[0]?.value;
            const isUnitAlreadyExistedInArr = responsibleEmployeesWithUnit.list.find((item) => {
                return currentChosenUnitRow === item.unitId
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
                setState({
                    ...state,
                    newProject: {
                        ...state.newProject,
                        responsibleEmployeesWithUnit: {
                            ...responsibleEmployeesWithUnit,
                            list: newListRow,
                            currentUnitRow: '',
                            currentEmployeeRow: [],
                        },
                        errorOnResponsibleEmployees: undefined
                    }
                })
            }
            else {
                const newListRow = [...oldListRow, {
                    unitId: currentChosenUnitRow,
                    listUsers: responsibleEmployeesWithUnit.currentEmployeeRow,
                }];
                setState({
                    ...state,
                    newProject: {
                        ...state.newProject,
                        responsibleEmployeesWithUnit: {
                            ...responsibleEmployeesWithUnit,
                            list: newListRow,
                            currentUnitRow: '',
                            currentEmployeeRow: [],
                        },
                        errorOnResponsibleEmployees: undefined
                    }
                })
            }
        }
    }

    const handleOpenModalSalaryMembers = () => {
        setTimeout(() => {
            window.$(`#modal-salary-members-edit-${projectEditId}`).modal("show");
        }, 10);
    }

    const handleSaveCurrentSalaryMember = (data) => {
        setCurrentSalaryMembers(data);
    }

    const isFormValidated = () => {
        if (!ValidationHelper.validateName(translate, projectName, 6, 255).status|| projectManager.length === 0
            || responsibleEmployeesWithUnit.list.length === 0|| errorOnStartDate|| errorOnStartDate) return false;
        return true;
    }

    const save = async () => {
        if (isFormValidated()) {
            let partStartDate = convertDateTime(startDate, startTime).split('-');
            let start = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));
            console.log('start', start)

            let partEndDate = convertDateTime(endDate, endTime).split('-');
            let end = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'));
            console.log('end', end)

            // Cái này để hiển thị danh sách ra - không quan tâm user nào thuộc unit nào
            let newEmployeesArr = [];
            for (let unitItem of responsibleEmployeesWithUnit.list) {
                for (let userItem of unitItem.listUsers) {
                    // console.log(userItem.userId || userItem);
                    newEmployeesArr.push(userItem.userId || userItem)
                }
            }

            props.editProjectDispatch(projectEdit?._id, {
                name: projectName,
                projectType,
                startDate: start,
                endDate: end,
                projectManager,
                responsibleEmployees: newEmployeesArr,
                description,
                unitCost,
                unitTime,
                estimatedCost,
                creator: userId,
                responsibleEmployeesWithUnit: currentSalaryMembers,
            });

            setTimeout(() => {
                props.handleAfterCreateProject()
            }, 30 * newEmployeesArr.length);
        }
    }

    const isTasksListEmpty = (!currentProjectTasks || currentProjectTasks.length === 0);

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-project-${projectEdit?._id && projectEditId}`} isLoading={false}
                formID={`form-edit-project-${projectEdit?._id && projectEditId}`}
                title={translate('project.edit_title')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={100}
            >
                <ModalSalaryMembersEdit
                    projectDetail={projectEdit}
                    projectDetailId={projectEditId}
                    isTasksListEmpty={isTasksListEmpty}
                    createProjectCurrentSalaryMember={currentSalaryMembers}
                    responsibleEmployeesWithUnit={responsibleEmployeesWithUnit}
                    handleSaveCurrentSalaryMember={handleSaveCurrentSalaryMember}
                />
                <div className="row">
                    <div className={"col-sm-6"}>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông số dự án</legend>

                            <div className="row">
                                {/* Tên dự án */}
                                <div className={`form-group col-md-6 col-xs-6 ${!errorOnProjectName ? "" : "has-error"}`}>
                                    <label>{translate('project.name')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" value={projectName} onChange={handleChangeProjectName}></input>
                                    <ErrorLabel content={errorOnProjectName} />
                                </div>

                                <div className={`form-group col-md-6 col-xs-6`}>
                                    <label>{translate('project.projectType')}<span className="text-red">*</span></label>
                                    <SelectBox
                                        id={`edit-select-project-type`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={fakeProjectTypeList}
                                        onChange={handleChangeProjectType}
                                        value={projectType}
                                        multiple={false}
                                        disabled={!isTasksListEmpty}
                                    />
                                </div>
                            </div>

                            {/* Thời gian bắt đầu, kết thúc */}
                            <div className="row">
                                <div className={`col-md-6 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('project.startDate')}<span className="text-red">*</span></label>
                                    {
                                        isTasksListEmpty ?
                                            <DatePicker
                                                id={`edit-project-start-date`}
                                                value={startDate}
                                                onChange={e => handleChangeProjectStartDate(e)}
                                                dateFormat="day-month-year"
                                            />
                                            : startDate
                                    }
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label">{translate('project.startTime')}<span className="text-red">*</span></label>
                                    {
                                        isTasksListEmpty ?
                                            <TimePicker
                                                id={`edit-project-start-time`}
                                                value={startTime}
                                                onChange={e => handleStartTimeChange(e)}
                                                disabled={!isTasksListEmpty}
                                            />
                                            : startTime
                                    }
                                </div>
                                <ErrorLabel content={errorOnStartDate} />
                            </div>

                            <div className="row">
                                <div className={`col-md-6 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('project.endDate')}<span className="text-red">*</span></label>
                                    {
                                        isTasksListEmpty ?
                                            <DatePicker
                                                id={`edit-project-end-date`}
                                                value={endDate}
                                                onChange={e => handleChangeProjectEndDate(e)}
                                                dateFormat="day-month-year"
                                                disabled={!isTasksListEmpty}
                                            />
                                            : endDate
                                    }
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label">{translate('project.endTime')}<span className="text-red">*</span></label>
                                    {
                                        isTasksListEmpty ?
                                            <TimePicker
                                                id={`edit-project-end-time`}
                                                value={endTime}
                                                onChange={e => handleEndTimeChange(e)}
                                                disabled={!isTasksListEmpty}
                                            />
                                            : endTime
                                    }
                                </div>
                                <ErrorLabel content={errorOnEndDate} />
                            </div>
                            {/* Đơn vị tính thời gian */}
                            <div className="form-group">
                                <label>{translate('project.unitTime')}</label>
                                <SelectBox
                                    id={`edit-select-project-unitTime`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={fakeUnitTimeList}
                                    onChange={handleChangeUnitTime}
                                    value={unitTime}
                                    multiple={false}
                                    disabled={!isTasksListEmpty}
                                />
                            </div>
                            {/* Đơn vị tính chi phí */}
                            <div className="form-group">
                                <label>{translate('project.unitCost')}</label>
                                <SelectBox
                                    id={`edit-select-project-unitCost`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={fakeUnitCostList}
                                    onChange={handleChangeUnitCost}
                                    value={unitCost}
                                    multiple={false}
                                    disabled={!isTasksListEmpty}
                                />
                            </div>
                            {/* Mô tả dự án */}
                            <div className={`form-group`}>
                                <label>{translate('project.description')}</label>
                                <textarea type="text" className="form-control" value={description} onChange={handleChangeProjectDescription} />
                            </div>
                        </fieldset>
                    </div>

                    <div className={"col-sm-6"}>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Nhân lực</legend>
                            {/* Người quản trị dự án */}
                            <div className={`form-group ${errorOnProjectManager === undefined ? "" : "has-error"}`}>
                                <label>{translate('project.manager')}<span className="text-red">*</span></label>
                                {listUsers &&
                                    <SelectBox
                                        id={`edit-select-project-manager`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={listUsers}
                                        onChange={handleChangeProjectManager}
                                        value={projectManager}
                                        multiple={true}
                                    />
                                }
                                <ErrorLabel content={errorOnProjectManager} />
                            </div>
                            {/* Thành viên tham gia dự án */}
                            <div className={`form-group ${errorOnResponsibleEmployees === undefined ? "" : "has-error"}`}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <label>{translate('project.member')}<span className="text-red">*</span></label>
                                    <button className="btn-link" onClick={handleOpenModalSalaryMembers}>Xem chi tiết lương nhân viên</button>
                                </div>
                                <ErrorLabel content={errorOnResponsibleEmployees} />
                                <table id="project-table" className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Thuộc đơn vị</th>
                                            <th>Thành viên tham gia</th>
                                            {isTasksListEmpty && <th>{translate('task_template.action')}</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {responsibleEmployeesWithUnit.list && responsibleEmployeesWithUnit.list.length > 0 &&
                                            responsibleEmployeesWithUnit.list.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{convertDepartmentIdToDepartmentName(user.usersInUnitsOfCompany, item?.unitId)}</td>
                                                    <td>
                                                        {item?.listUsers.map(userItem =>
                                                            convertUserIdToUserName(listUsers, userItem.userId || userItem))
                                                            .join(', ')
                                                        }
                                                    </td>
                                                    {
                                                        isTasksListEmpty
                                                        &&
                                                        <td>
                                                            <a className="delete" title={translate('general.delete')} onClick={() => handleDeleteRow(index)}><i className="material-icons">delete</i></a>
                                                        </td>
                                                    }
                                                </tr>
                                            ))
                                        }
                                        {
                                            isTasksListEmpty
                                            &&
                                            <tr key={`add-task-input-${responsibleEmployeesWithUnit?.list?.length}`}>
                                                <td>
                                                    <div className={`form-group`}>
                                                        {listDepartments && listDepartments.length > 0 &&
                                                            <SelectBox
                                                                id={`edit-project-select-unit-${projectEdit?._id && projectEditId}`}
                                                                className="form-control select2"
                                                                style={{ width: "100%" }}
                                                                items={listDepartments}
                                                                onChange={(e) => {
                                                                    setTimeout(() => {
                                                                        setState({
                                                                            ...state,
                                                                            newProject: {
                                                                                ...state.newProject,
                                                                                responsibleEmployeesWithUnit: {
                                                                                    ...responsibleEmployeesWithUnit,
                                                                                    currentUnitRow: e[0],
                                                                                },
                                                                            },  
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
                                                                id={`edit-project-select-project-members-${projectEdit?._id && projectEditId}`}
                                                                className="form-control select2"
                                                                style={{ width: "100%" }}
                                                                items={listUsers.filter(item =>
                                                                    item.text === convertDepartmentIdToDepartmentName(user.usersInUnitsOfCompany,
                                                                        responsibleEmployeesWithUnit.currentUnitRow || listDepartments[0]?.value)
                                                                )}
                                                                onChange={(e) => {
                                                                    setTimeout(() => {
                                                                        setState({
                                                                            ...state,
                                                                            newProject: {
                                                                                ...state.newProject,
                                                                                responsibleEmployeesWithUnit: {
                                                                                    ...responsibleEmployeesWithUnit,
                                                                                    currentEmployeeRow: e,
                                                                                }
                                                                            }
                                                                        })
                                                                    }, 10);
                                                                }}
                                                                value={responsibleEmployeesWithUnit.currentEmployeeRow}
                                                                multiple={true}
                                                            />}
                                                    </div>
                                                </td>
                                                <td>
                                                    <a className="save text-green" title={translate('general.save')} onClick={handleAddRow}><i className="material-icons">add_circle</i></a>
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>


                        </fieldset>
                    </div>
                </div>
                {/* <div className="form-group">
                        <label>{translate('project.parent')}</label>
                        <TreeSelect data={list} value={projectParent} handleChange={handleParent} mode="radioSelect" />
                    </div> */}
                {/* <div className={`form-group`}>
                        <label>{translate('project.estimatedCost')}</label>
                        <input
                            type="number"
                            className="form-control"
                            value={estimatedCost}
                            onChange={(e) => handleChangeForm(e, 'estimatedCost')}
                        />
                    </div> */}
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { project, user } = state;
    return { project, user }
}

const mapDispatchToProps = {
    editProjectDispatch: ProjectActions.editProjectDispatch,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectEditForm));