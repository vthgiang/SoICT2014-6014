import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getStorage } from '../../../../../config';

import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../../../task-template/redux/actions';

import { SelectBox, ErrorLabel, DatePicker, QuillEditor } from '../../../../../common-components';

import getEmployeeSelectBoxItems from '../../../organizationalUnitHelper';
import './../../../task-template/component/tasktemplate.css';
import { TaskFormValidator } from '../../../task-management/component/taskFormValidator';
import ValidationHelper from '../../../../../helpers/validationHelper';

function FormCreateTaskByProcess(props) {

    const [state, setState] = useState({
        currentRole: localStorage.getItem('currentRole'),
        taskItem: {
            organizationalUnit: '',
            name: '',
            responsibleEmployees: [],
            accountableEmployees: [],
            consultedEmployees: [],
            informedEmployees: [],
            description: '',
            startDate: '',
            endDate: '',
            numberOfDaysTaken: '',
            priority: 3,
            preceedingTasks: [],
            followingTasks: [],
            formula: '',
            id: ""
        },

    });
    useEffect(() => {
        // get department of current user 
        props.getDepartment();
        // lấy tất cả nhân viên của công ty
        props.getAllUserOfCompany();
        // Lấy tất cả vai trò cùng phòng ban
        props.getRoleSameDepartment(localStorage.getItem("currentRole"));
        // Lấy tất cả các role là manager 
        props.getDepartmentsThatUserIsManager();
        // Lấy tất cả nhân viên trong công ty
        props.getAllUserInAllUnitsOfCompany();
    }, [])
    useEffect(() => {
        const { department } = props;
        const { taskItem } = state;
        if (props.isProcess && props.id !== state.id) {
            let { info, listOrganizationalUnit } = props;
            setState(state => {
                return {
                    ...state,
                    id: props.id,
                    taskItem: {
                        numberOfDaysTaken: (info && info.numberOfDaysTaken) ? info.numberOfDaysTaken : null,
                        collaboratedWithOrganizationalUnits: (info && info.collaboratedWithOrganizationalUnits) ? info.collaboratedWithOrganizationalUnits.map(item => { if (item) return item._id }) : [],
                        // code: (info && info.code) ? info.code : "",
                        startDate: (info && info.startDate) ? info.startDate : props.startDate,
                        endDate: (info && info.endDate) ? info.endDate : props.endDate,
                        organizationalUnit: (info && info.organizationalUnit) ? info.organizationalUnit._id : [],
                        name: (info && info.name) ? info.name : '',
                        responsibleEmployees: (info && info.responsibleEmployees) ? info.responsibleEmployees.map(x => x?._id) : [],
                        accountableEmployees: (info && info.accountableEmployees) ? info.accountableEmployees.map(x => x?._id) : [],
                        consultedEmployees: (info && info.consultedEmployees) ? info.consultedEmployees.map(x => x?._id) : [],
                        informedEmployees: (info && info.informedEmployees) ? info.informedEmployees.map(x => x?._id) : [],
                        description: (info && info.description) ? info.description : '',
                        creator: (info && info.creator) ? info.creator._id : getStorage("userId"),
                        formula: (info && info.formula) ? info.formula : '',
                        priority: (info && info.priority) ? info.priority : 3,
                        taskActions: (info && info.taskActions) ? info.taskActions : [],
                        taskInformations: (info && info.taskInformations) ? info.taskInformations : [],
                        followingTasks: (info && info.followingTasks) ? info.followingTasks : [],
                        preceedingTasks: (info && info.preceedingTasks) ? info.preceedingTasks : [],
                    },
                    showMore: props.isProcess ? false : true,
                    showActionForm: true,
                }
            })
            props.getDepartment();
            let { user } = props;
            let defaultUnit;
            if (user && user.organizationalUnitsOfUser) defaultUnit = user.organizationalUnitsOfUser.find(item =>
                item.manager === state.currentRole
                || item.deputyManager === state.currentRole
                || item.employee === state.currentRole);
            if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
                // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
                defaultUnit = user.organizationalUnitsOfUser[0]
            }
            props.getChildrenOfOrganizationalUnits(defaultUnit && defaultUnit._id);
        }

        // Khi truy vấn lấy các đơn vị mà user là manager đã có kết quả, và thuộc tính đơn vị của newTemplate chưa được thiết lập
        if (taskItem.organizationalUnit === "" && department.departmentsThatUserIsManager) {
            // Tìm unit mà currentRole của user đang thuộc về
            let defaultUnit = department.departmentsThatUserIsManager.find(item =>
                item.managers.includes(state.currentRole)
                || item.deputyManagers.includes(state.currentRole)
                || item.employees.includes(state.currentRole
                ));

            if (defaultUnit) {
                setState(state => {
                    return {
                        ...state,
                        taskItem: {
                            ...state.taskItem,
                            organizationalUnit: defaultUnit._id
                        }
                    };
                });

                props.getChildrenOfOrganizationalUnits(defaultUnit._id);
            }
        }
    }, [props.isProcess,props.id])
    // static getDerivedStateFromProps = (props, prevState) => {
    //     if (props.taskTemplateId !== prevState.taskTemplateId) {
    //         return {
    //             ...prevState,
    //             taskTemplate: props.taskTemplate,
    //             errorOnName: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
    //             errorOnDescription: undefined,
    //             errorOnRead: undefined,
    //             errorOnFormula: undefined,
    //             errorOnUnit: undefined,
    //             showActionForm: undefined
    //         }
    //     } else {
    //         return null;
    //     }
    // }


    /**Gửi req sửa mẫu công việc này */
    const handleSubmit = async (event) => {
        const { taskItem } = state;

        props.editTaskTemplate(taskItem._id, taskItem);
    }

    /**
     * Xử lý form lớn tasktemplate
     */
    // const isTaskTemplateFormValidated = () => {
    //     if (!state.taskItem._id)
    //         return false;
    //     let result =
    //         validateTaskTemplateRead(state.taskItem.readByEmployees, false) &&
    //         validateTaskTemplateName(state.taskItem.name, false) &&
    //         validateTaskTemplateDesc(state.taskItem.description, false) &&
    //         validateTaskTemplateFormula(state.taskItem.formula, false) &&
    //         validateTaskTemplateUnit(state.taskItem.organizationalUnit, false);
    //     return result;
    // }
    const handleTaskTemplateName = (event) => {
        let value = event.target.value;
        validateTaskTemplateName(value, true);
    }
    const validateTaskTemplateName = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateName(props.translate, value);

        if (willUpdateState) {
            state.taskItem.name = value;
            state.taskItem.errorOnName = message;
            setState(state => {
                return {
                    ...state,
                };
            });
        }
        props.handleChangeName(value);
        props.onChangeTemplateData(state.taskItem);
        return message == undefined;
    }

    const handleTaskTemplateDesc = (value, imgs) => {
        validateTaskTemplateDesc(value, true);
    }
    const validateTaskTemplateDesc = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            state.taskItem.description = value;
            state.taskItem.errorOnDescription = message;
            setState(state => {
                return {
                    ...state,
                };
            });
        }
        props.onChangeTemplateData(state.taskItem);
        return message == undefined;
    }

    const handleChangeTaskPriority = (event) => {
        state.taskItem.priority = event.target.value;
        setState(state => {
            return {
                ...state,
            };
        });
        props.onChangeTemplateData(state.taskItem);
    }
    const handleTaskTemplateUnit = (value) => {
        let singleValue = value[0]; // SelectBox một lựa chọn
        if (validateTaskTemplateUnit(singleValue, true)) {
            const { department } = props;

            if (department !== undefined && department.departmentsThatUserIsManager !== undefined) {
                // Khi đổi department, cần lấy lại dữ liệu cho các selectbox (ai được xem, các vai trò)
                let dept = department.departmentsThatUserIsManager.find(item => item._id === singleValue);
                if (dept) {
                    props.getChildrenOfOrganizationalUnits(singleValue);
                    props.getRoleSameDepartment(dept.manager);
                }
            }
        }
    }

    const validateTaskTemplateUnit = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    taskItem: { // update lại unit, và reset các selection phía sau
                        ...state.taskItem,
                        organizationalUnit: value,
                        errorOnUnit: message,
                        readByEmployees: [],
                        responsibleEmployees: [],
                        accountableEmployees: [],
                        consultedEmployees: [],
                        informedEmployees: [],
                    }
                };
            });
        }
        props.onChangeTemplateData(state.taskItem);
        return message == undefined;
    }

    const handleChangeCollaboratedWithOrganizationalUnits = (value) => {
        // console.log(state);
        setState(state => {
            return {
                ...state,
                taskItem: {
                    ...state.taskItem,
                    collaboratedWithOrganizationalUnits: value
                }
            };
        });
        props.onChangeTemplateData(state.taskItem);
    }

    const handleTaskTemplateResponsible = (value) => {
        state.taskItem.responsibleEmployees = value;

        setState(state => {
            return {
                ...state,
            };
        });
        props.handleChangeResponsible(value);
        props.onChangeTemplateData(state.taskItem);
    }
    const handleTaskTemplateAccountable = (value) => {
        state.taskItem.accountableEmployees = value;
        setState(state => {
            return {
                ...state,
            };
        });
        props.handleChangeAccountable(value);
        props.onChangeTemplateData(state.taskItem);
    }
    const handleTaskTemplateConsult = (value) => {
        state.taskItem.consultedEmployees = value;
        setState(state => {
            return {
                ...state,
            };
        });
        props.onChangeTemplateData(state.taskItem);
    }
    const handleTaskTemplateInform = (value) => {
        state.taskItem.informedEmployees = value;

        setState(state => {
            return {
                ...state,
            };
        });
        props.onChangeTemplateData(state.taskItem);
    }

    const formatDate=(date) => {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }
    const formatMonth=(date) => {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    const handleTaskTemplateNumberOfDaysTaken = (event) => {
        let value = event.target.value;
        validateTaskTemplateNumberOfDaysTaken(value, true);
    }

    const validateTaskTemplateNumberOfDaysTaken = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateNumberInputMin(props.translate, value, 0);

        if (willUpdateState) {
            state.taskItem.numberOfDaysTaken = value;
            state.taskItem.errorOnNumberOfDaysTaken = message;
            setState(state => {
                return {
                    ...state,
                };
            });
        }
        props.onChangeTemplateData(state.taskItem);
        return message === undefined;
    }

    const handleChangeTaskStartDate = (value) => {
        validateTaskStartDate(value, true);
    }
    const validateTaskStartDate = (value, willUpdateState = true) => {
        let { translate } = props;
        let msg = TaskFormValidator.validateTaskStartDate(value, state.taskItem.endDate ? state.taskItem.endDate : "", translate);

        if (willUpdateState) {
            // let splitter = value.split('-');
            // let startDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
            // let timer = startDate.getTime() + state.taskItem.numberOfDaysTaken * 24 * 60 * 60 * 1000;

            // let endDateISO = new Date(timer).toISOString();
            // let endDate = formatDate(endDateISO);

            state.taskItem.startDate = value;
            // state.taskItem.endDate = endDate;
            state.taskItem.errorOnStartDate = msg;
            setState(state => {
                return {
                    ...state,
                };
            });
            props.onChangeTemplateData(state.taskItem);
        }

        return msg === undefined;
    }

    const handleChangeTaskEndDate = (value) => {
        validateTaskEndDate(value, true);
    }
    const validateTaskEndDate = (value, willUpdateState = true) => {
        let { translate } = props;
        let msg = TaskFormValidator.validateTaskEndDate(state.taskItem.startDate ? state.taskItem.startDate : "", value, translate);

        if (willUpdateState) {
            state.taskItem.endDate = value;
            state.taskItem.errorOnEndDate = msg;
            setState(state => {
                return {
                    ...state,
                };
            });
            props.onChangeTemplateData(state.taskItem);
        }
        return msg === undefined;
    }

    const clickShowMore = () => {
        setState(state => {
            return {
                ...state,
                showMore: !state.showMore,
            }
        });
    }

    const { department, user, translate } = props;
    const { isProcess } = props;
    // console.log(state);
    var units, taskActions, taskInformations, listRole, departmentsThatUserIsManager, listRoles, usercompanys, userdepartments = [];
    var { taskItem, id, showMore } = state;
    // console.log(taskItem)
    if (taskItem && taskItem.taskActions) taskActions = taskItem.taskActions;
    if (taskItem && taskItem.taskInformations) taskInformations = taskItem.taskInformations;

    if (user.organizationalUnitsOfUser) {
        units = user.organizationalUnitsOfUser;
    }
    if (department.departmentsThatUserIsManager) {
        departmentsThatUserIsManager = department.departmentsThatUserIsManager;
    }
    if (user.usercompanys) usercompanys = user.usercompanys;
    if (user.userdepartments) userdepartments = user.userdepartments;

    var usersOfChildrenOrganizationalUnit;
    if (user && user.usersOfChildrenOrganizationalUnit) {
        usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
    }
    var usersInUnitsOfCompany;
    if (user && user.usersInUnitsOfCompany) {
        usersInUnitsOfCompany = user.usersInUnitsOfCompany;
    }

    let allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany);
    return (
        <React.Fragment>
            {/**Form chứa thông tin của mẫu công việc đang sửa */}
            <div className="row">
                <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                    {/**Đơn vị của mẫu công việc */}
                    <div className={`form-group ${taskItem.errorOnUnit === undefined ? "" : "has-error"}`} >
                        <label className="control-label">{translate('task_template.unit')} <span style={{ color: "red" }}>*</span></label>
                        {departmentsThatUserIsManager !== undefined && taskItem.organizationalUnit !== "" &&
                            <SelectBox
                                id={`edit-unit-select-box-${taskItem._id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    departmentsThatUserIsManager.map(x => {
                                        return { value: x._id, text: x.name };
                                    })
                                }
                                onChange={handleTaskTemplateUnit}
                                value={taskItem.organizationalUnit}
                                multiple={false}

                            />
                        }
                        <ErrorLabel content={state.taskItem.errorOnUnit} />
                    </div>

                    {/* Chọn đơn vị phối hợp công việc */}
                    {usersInUnitsOfCompany &&
                        <div className="form-group">
                            <label>{translate('task.task_management.collaborated_with_organizational_units')}</label>
                            <SelectBox
                                id="multiSelectUnitThatHaveCollaboratedTaskByProcess"
                                lassName="form-control select2"
                                style={{ width: "100%" }}
                                items={usersInUnitsOfCompany.filter(item => String(item.id) !== String(taskItem.organizationalUnit)).map(x => {
                                    return { text: x.department, value: x.id }
                                })}
                                options={{ placeholder: translate('kpi.evaluation.dashboard.select_units') }}
                                onChange={handleChangeCollaboratedWithOrganizationalUnits}
                                value={taskItem.collaboratedWithOrganizationalUnits}
                                multiple={true}
                            />
                        </div>
                    }
                </div>
            </div>

            <div className="row">
                <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>

                    {/**Tên mẫu công việc này */}
                    <div className={`form-group ${state.taskItem.errorOnName === undefined ? "" : "has-error"}`} >
                        <label className="control-label">{translate('task_template.tasktemplate_name')} <span style={{ color: "red" }}>*</span></label>
                        <input type="Name" className="form-control" placeholder={translate('task_template.tasktemplate_name')} value={taskItem.name} onChange={handleTaskTemplateName} />
                        <ErrorLabel content={state.taskItem.errorOnName} />
                    </div>
                </div>

                <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>

                    {/**Mô tả mẫu công việc này */}
                    <div className={`form-group ${state.taskItem.errorOnDescription === undefined ? "" : "has-error"}`} >
                        <label className="control-label" htmlFor="inputDescriptionTaskTemplate">{translate('task_template.description')} <span style={{ color: "red" }}>*</span></label>
                        <QuillEditor
                            id={`inputDescriptionTaskTemplate`}
                            table={false}
                            embeds={false}
                            getTextData={handleTaskTemplateDesc}
                            maxHeight={80}
                            quillValueDefault={taskItem.description}
                            placeholder={translate('task_template.description')}
                        />
                        
                        <ErrorLabel content={state.taskItem.errorOnDescription} />
                    </div>
                </div>
            </div>
            {/**Độ ưu tiên mẫu công việc này */}
            <div className="form-group" >
                <label className="control-label">{translate('task.task_management.priority')}</label>
                <select className="form-control" value={taskItem.priority} onChange={handleChangeTaskPriority}>
                    <option value={5}>{translate('task.task_management.urgent')}</option>
                    <option value={4}>{translate('task.task_management.high')}</option>
                    <option value={3}>{translate('task.task_management.standard')}</option>
                    <option value={2}>{translate('task.task_management.average')}</option>
                    <option value={1}>{translate('task.task_management.low')}</option>
                </select>
            </div>
            {/**Số ngày hoàn thành công việc dự kiến */}
            {/* <div className={`form-group ${state.taskItem.errorOnNumberOfDaysTaken === undefined ? "" : "has-error"}`} >
                    <label className="control-label" htmlFor="inputNumberOfDaysTaken">{translate('task_template.numberOfDaysTaken')}</label>
                    <input type="number" className="form-control" id="inputNumberOfDaysTaken" value={taskItem.numberOfDaysTaken}
                        placeholder={'Không có dữ liệu'}
                        disabled={true}
                        onChange={handleTaskTemplateNumberOfDaysTaken} />
                    <ErrorLabel content={state.taskItem.errorOnNumberOfDaysTaken} />
                </div> */}

            {/* Ngay bat dau - ngay ket thuc */}
            <div className=" row ">
                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${state.taskItem.errorOnStartDate === undefined ? "" : "has-error"}`}>
                    <label className="control-label">{translate('task.task_management.start_date')} <span style={{ color: "red" }}>*</span></label>
                    <DatePicker
                        id={`datepicker1-${id}`}
                        dateFormat="day-month-year"
                        value={taskItem.startDate}
                        onChange={handleChangeTaskStartDate}
                    />
                    <ErrorLabel content={state.taskItem.errorOnStartDate} />
                </div>
                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${state.taskItem.errorOnEndDate === undefined ? "" : "has-error"}`}>
                    <label className="control-label">{translate('task.task_management.end_date')} <span style={{ color: "red" }}>*</span></label>
                    <DatePicker
                        id={`datepicker2-${id}`}
                        value={taskItem.endDate}
                        onChange={handleChangeTaskEndDate}
                    />
                    <ErrorLabel content={state.taskItem.errorOnEndDate} />
                </div>
            </div>

            {/* <label className="control-label" htmlFor="inputNumberOfDaysTaken">{translate('task_template.numberOfDaysTaken')}: </label> */}

            <div className="form-group">
                <small><i>({translate('task_template.numberOfDaysTaken')}: </i></small>
                {taskItem.numberOfDaysTaken ?
                    <small><i>{taskItem.numberOfDaysTaken + " ngày )"}</i></small> :
                    <small><i>Không có dữ liệu. )</i></small>
                }
            </div>

            <div className="row">
                <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                    <div className='form-group' >

                        {/**Người thực hiện mẫu công việc này */}
                        <label className="control-label" >{translate('task_template.performer')} <span style={{ color: "red" }}>*</span></label>
                        {allUnitsMember &&
                            <SelectBox
                                id={isProcess ? `create-task-responsible-select-box-${taskItem._id}-${id}` : "edit-responsible-select-box"}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={allUnitsMember}
                                onChange={handleTaskTemplateResponsible}
                                value={taskItem.responsibleEmployees}
                                multiple={true}
                                options={{ placeholder: `${translate('task_template.performer')}` }}
                            />
                        }
                    </div>
                    <div className='form-group' >

                        {/**Người phê duyệt mẫu công việc này */}
                        <label className="control-label">{translate('task_template.approver')} <span style={{ color: "red" }}>*</span></label>
                        {allUnitsMember &&
                            <SelectBox
                                id={isProcess ? `create-task-accountable-select-box-${taskItem._id}-${id}` : "edit-accountable-select-box"}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={allUnitsMember}
                                onChange={handleTaskTemplateAccountable}
                                value={taskItem.accountableEmployees}
                                multiple={true}
                                options={{ placeholder: `${translate('task_template.approver')}` }}
                            />
                        }
                    </div>
                    <div>
                        <div className='form-group' >
                            {/**Người hỗ trọ mẫu công việc này */}
                            <label className="control-label">{translate('task_template.consultant')}</label>
                            {allUnitsMember &&
                                <SelectBox
                                    id={isProcess ? `create-task-consulted-select-box-${taskItem._id}-${id}` : "edit-consulted-select-box"}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={allUnitsMember}
                                    onChange={handleTaskTemplateConsult}
                                    value={taskItem.consultedEmployees}
                                    multiple={true}
                                    options={{ placeholder: `${translate('task_template.consultant')}` }}
                                />
                            }
                        </div>
                        <div className='form-group' >

                            {/**Người quan sát mẫu công việc này */}
                            <label className="control-label">{translate('task_template.observer')}</label>
                            {allUnitsMember &&
                                <SelectBox
                                    id={isProcess ? `create-task-informed-select-box-${taskItem._id}-${id}` : "edit-informed-select-box"}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={allUnitsMember}
                                    onChange={handleTaskTemplateInform}
                                    multiple={true}
                                    value={taskItem.informedEmployees}
                                    options={{ placeholder: `${translate('task_template.observer')}` }}
                                />
                            }
                        </div>
                    </div>

                </div>
            </div>
        </React.Fragment>
    );
}

function mapState(state) {
    const { department, user, tasktemplates } = state;
    return { department, user, tasktemplates };
}

const actionCreators = {
    getTaskTemplate: taskTemplateActions.getTaskTemplateById,
    editTaskTemplate: taskTemplateActions.editTaskTemplate,
    addNewTemplate: taskTemplateActions.addTaskTemplate,
    getDepartment: UserActions.getDepartmentOfUser,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
    getDepartmentsThatUserIsManager: DepartmentActions.getDepartmentsThatUserIsManager,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany

};
const connectedFormCreateTaskByProcess = connect(mapState, actionCreators)(withTranslate(FormCreateTaskByProcess));
export { connectedFormCreateTaskByProcess as FormCreateTaskByProcess };