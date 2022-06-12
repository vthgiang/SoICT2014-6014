import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, TreeSelect, DatePicker, SelectBox, TimePicker, QuillEditor } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { ProjectActions } from '../redux/actions';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { getStorage } from '../../../../config';
import { convertDateTime, convertDepartmentIdToDepartmentName, convertUserIdToUserName, getListDepartments, formatTime } from './functionHelper';
import ModalSalaryMembers from './modalSalaryMembers';
import { TaskFormValidator } from '../../../task/task-management/component/taskFormValidator';

const ProjectCreateForm = (props) => {
    const { translate, project, user } = props;
    const userId = getStorage('userId');
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    const listDepartments = user && user.usersInUnitsOfCompany ? getListDepartments(user.usersInUnitsOfCompany) : []
    const [currentSalaryMembers, setCurrentSalaryMembers] = useState([]);
    // console.log('listUsers', listUsers)
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

    // const handleChangeForm = (event, currentKey) => {
    //     if (currentKey === 'projectName') {
    //         let { translate } = props;
    //         let { message } = ValidationHelper.validateName(translate, event.target.value, 6, 255);
    //         setForm({
    //             ...form,
    //             [currentKey]: event.target.value,
    //             errorOnProjectName: message,
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

    useEffect(() => {
        //Đặt lại thời gian mặc định khi mở modal
        window.$(`#modal-create-project`).on('shown.bs.modal', regenerateTime);
        return () => {
            window.$(`#modal-create-project`).unbind('shown.bs.modal', regenerateTime)
        }
    }, [])

    useEffect(() => {
        let newResponsibleEmployeesWithUnit = [];
        // console.log('currentSalaryMembers create project', currentSalaryMembers)
        for (let i = 0; i < responsibleEmployeesWithUnit.list.length; i++) {
            newResponsibleEmployeesWithUnit.push({
                unitId: responsibleEmployeesWithUnit.list[i].unitId,
                listUsers: responsibleEmployeesWithUnit.list[i].listUsers.map((item, index) => ({
                    userId: item,
                    salary: currentSalaryMembers?.[i]?.listUsers?.[index]?.salary,
                }))
            })
        }
        setCurrentSalaryMembers(newResponsibleEmployeesWithUnit);
    }, [responsibleEmployeesWithUnit.list])

    // Thay đổi tên dự án
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

    // Thay đổi hình thức quản lý dự án
    const handleChangeProjectType = (event) => {
        setState({
            ...state,
            newProject: {
                ...state.newProject,
                projectType: event[0]
            }
        });
    }

    // Thay đổi mô tả dự án
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

    // Thay đổi ngày bắt đầu
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

    // Thay đổi thời điểm bắt đầu
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

    // Thay đổi thời điểm kết thúc
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

    // Thay đổi ngày kết thúc
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

    // Thay đổi đơn vị tính thời gian
    const handleChangeUnitTime = (event) => {
        setState({
            ...state,
            newProject: {
                ...state.newProject,
                unitTime: event[0]
            }
        });
    }

    // Thay đổi đon vị tính chi phí
    const handleChangeUnitCost = (event) => {
        setState({
            ...state,
            newProject: {
                ...state.newProject,
                unitCost: event[0]
            }
        });
    }

    // Thay đổi người quản lý dự án
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

    // Xoá thành viên tham gia
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

    // Thêm thành viên tham gia
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
            window.$("#modal-salary-members").modal("show");
        }, 10);
    }

    const handleSaveCurrentSalaryMember = (data) => {
        setCurrentSalaryMembers(data);
    }


    // Đặt lại thời gian
    const regenerateTime = () => {
        let currentTime = formatTime(new Date())
        setState(state => {
            return {
                ...state,
                newProject: {
                    ...state.newProject,
                    startTime: currentTime
                }
            }     
        });
    }

    const isFormValidated = () => {
        // console.log('\n----------------')
        // console.log(!ValidationHelper.validateName(translate, projectName, 6, 255).status)
        // console.log(!ValidationHelper.validateName(translate, code, 6, 6).status)
        // console.log(projectManager.length === 0)
        // console.log(responsibleEmployeesWithUnit.list.length === 0)
        // console.log(startDate.length === 0)
        // console.log(endDate.length === 0)
        if (!ValidationHelper.validateName(translate, projectName, 6, 255).status|| projectManager.length === 0
            || responsibleEmployeesWithUnit.list.length === 0|| errorOnStartDate|| errorOnStartDate) return false;
        return true;
    }

    const save = () => {
        if (isFormValidated()) {
            let partStartDate = convertDateTime(startDate, startTime).split('-');
            let start = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));

            let partEndDate = convertDateTime(endDate, endTime).split('-');
            let end = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'));

            // Cái này để hiển thị danh sách ra - không quan tâm user nào thuộc unit nào
            let newEmployeesArr = [];
            for (let unitItem of responsibleEmployeesWithUnit.list) {
                for (let userItem of unitItem.listUsers) {
                    newEmployeesArr.push(userItem)
                }
            }

            props.createProjectDispatch({
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

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-project" isLoading={false}
                formID="form-create-project"
                title={translate('project.add_title')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={100}
            >
                <ModalSalaryMembers
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

                                {/* Hình thức quản lý dự án */}
                                <div className={`form-group col-md-6 col-xs-6`}>
                                    <label>{translate('project.projectType')}<span className="text-red">*</span></label>
                                    <SelectBox
                                        id={`select-project-type`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={fakeProjectTypeList}
                                        onChange={handleChangeProjectType}
                                        value={projectType}
                                        multiple={false}
                                    />
                                </div>

                            </div>

                            {/* Thời gian bắt đầu, kết thúc */}
                            <div className="row">
                                <div className={`col-md-6 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('project.startDate')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`create-project-start-date`}
                                        value={startDate}
                                        onChange={e => handleChangeProjectStartDate(e)}
                                        dateFormat="day-month-year"
                                        disabled={false}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label">{translate('project.startTime')}<span className="text-red">*</span></label>
                                    <TimePicker
                                        id={`create-project-start-time`}
                                        value={startTime}
                                        onChange={e => handleStartTimeChange(e)}
                                        disabled={false}
                                    />
                                </div>
                                <ErrorLabel content={errorOnStartDate} />
                            </div>

                            <div className="row">
                                <div className={`col-md-6 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('project.endDate')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`create-project-end-date`}
                                        value={endDate}
                                        onChange={e => handleChangeProjectEndDate(e)}
                                        dateFormat="day-month-year"
                                        disabled={false}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label">{translate('project.endTime')}<span className="text-red">*</span></label>
                                    <TimePicker
                                        id={`create-project-end-time`}
                                        value={endTime}
                                        onChange={e => handleEndTimeChange(e)}
                                        disabled={false}
                                    />
                                </div>
                                <ErrorLabel content={errorOnEndDate} />
                            </div>

                            {/* Đơn vị tính thời gian */}
                            <div className="form-group">
                                <label>{translate('project.unitTime')}</label>
                                <SelectBox
                                    id={`select-project-unitTime`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={fakeUnitTimeList}
                                    onChange={handleChangeUnitTime}
                                    value={unitTime}
                                    multiple={false}
                                />
                            </div>

                            {/* Đơn vị tính chi phí */}
                            <div className="form-group">
                                <label>{translate('project.unitCost')}</label>
                                <SelectBox
                                    id={`select-project-unitCost`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={fakeUnitCostList}
                                    onChange={handleChangeUnitCost}
                                    value={unitCost}
                                    multiple={false}
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
                                        id={`select-project-manager`}
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
                                                        <a className="delete" title={translate('general.delete')} onClick={() => handleDeleteRow(index)}><i className="material-icons">delete</i></a>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        <tr key={`add-task-input-${responsibleEmployeesWithUnit.list.length}`}>
                                            <td>
                                                <div className={`form-group`}>
                                                    {listDepartments && listDepartments.length > 0 &&
                                                        <SelectBox
                                                            id={`create-project-${responsibleEmployeesWithUnit.list.length}`}
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
                                                            id={`select-project-members`}
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
    createProjectDispatch: ProjectActions.createProjectDispatch,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectCreateForm));