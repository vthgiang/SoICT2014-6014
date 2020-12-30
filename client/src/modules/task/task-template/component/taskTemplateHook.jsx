import React, { useEffect, useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../redux/actions';
import { InformationForm } from '../component/informationsTemplate';
import { ActionForm } from '../component/actionsTemplate';
import { SelectBox, ErrorLabel } from '../../../../common-components';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import { TaskTemplateFormValidator } from './taskTemplateFormValidator';
import { getStorage } from '../../../../config';

const AddTaskTemplate = (props) => {
    let userId = getStorage("userId");
    const [state, setState] = useState({
        newTemplate: {
            organizationalUnit: '',
            name: '',
            readByEmployees: [],
            responsibleEmployees: [],
            accountableEmployees: [],
            consultedEmployees: [],
            informedEmployees: [],
            description: '',
            creator: userId,
            numberOfDaysTaken: '',
            formula: '',
            priority: 3,
            taskActions: [],
            taskInformations: [],
        },
        showMore: props.isProcess ? false : true,
        currentRole: localStorage.getItem('currentRole'),
    })


    useEffect(() => {
        // props.getDepartment(); // => user.organizationalUnitsOfUser
        // props.getAllUserOfCompany(); // => user.usercompanys
        props.getRoleSameDepartment(localStorage.getItem("currentRole")); // => user.roledepartments
        props.getDepartmentsThatUserIsManager(); // => department.departmentsThatUserIsManager
        props.getAllUserInAllUnitsOfCompany(); // => user.usersInUnitsOfCompany
    }, [])

    useEffect(() => {
        const { department, user } = props;
        const { newTemplate } = state;

        if (props.isProcess && props.id) {
            let { info, listOrganizationalUnit } = props;
            setState({
                ...state,
                id: props.id,
                newTemplate: {
                    organizationalUnit: (info && info.organizationalUnit) ? info.organizationalUnit : "",
                    collaboratedWithOrganizationalUnits: (info && info.collaboratedWithOrganizationalUnits) ? info.collaboratedWithOrganizationalUnits : [],
                    name: (info && info.name) ? info.name : '',
                    responsibleEmployees: (info && info.responsibleEmployees) ? info.responsibleEmployees : [],
                    accountableEmployees: (info && info.accountableEmployees) ? info.accountableEmployees : [],
                    consultedEmployees: (info && info.consultedEmployees) ? info.consultedEmployees : [],
                    informedEmployees: (info && info.informedEmployees) ? info.informedEmployees : [],
                    description: (info && info.description) ? info.description : '',
                    creator: (info && info.creator) ? info.creator : getStorage("userId"),
                    numberOfDaysTaken: (info && info.numberOfDaysTaken) ? info.numberOfDaysTaken : '',
                    formula: (info && info.formula) ? info.formula : '',
                    priority: (info && info.priority) ? info.priority : 3,
                    taskActions: (info && info.taskActions) ? info.taskActions : [],
                    taskInformations: (info && info.taskInformations) ? info.taskInformations : [],
                },
                showMore: props.isProcess ? false : true,

            })

            let defaultUnit;
            if (user && user.organizationalUnitsOfUser) defaultUnit = user.organizationalUnitsOfUser.find(item =>
                item.manager === state.currentRole
                || item.deputyManager === state.currentRole
                || item.employee === state.currentRole);
            if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
                // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
                defaultUnit = user.organizationalUnitsOfUser[0]
            }
        }

        if (!user.organizationalUnitsOfUser) {
            props.getDepartment(); // => user.organizationalUnitsOfUser
        }

        // Khi truy vấn lấy các đơn vị mà user là manager đã có kết quả, và thuộc tính đơn vị của newTemplate chưa được thiết lập
        if (newTemplate.organizationalUnit === "" && user.organizationalUnitsOfUser) {
            // Tìm unit mà currentRole của user đang thuộc về
            let defaultUnit = user.organizationalUnitsOfUser.find(item =>
                item.managers.includes(state.currentRole)
                || item.deputyManagers.includes(state.currentRole)
                || item.employees.includes(state.currentRole)
            );

            if (defaultUnit) {
                setState({
                    ...state,
                    newTemplate: {
                        ...state.newTemplate,
                        organizationalUnit: defaultUnit._id
                    }
                });
            }
        }
    }, [props.id, props.user.organizationalUnitsOfUser])

    /**Submit new template in data */
    const handleSubmit = async (event) => {
        let { newTemplate } = state;
        const { department, user, translate, tasktemplates, isProcess } = props;

        let listRoles = [];
        if (user.roledepartments) {
            let listRole = user.roledepartments;
            for (let x in listRole.employees)
                listRoles.push(listRole.employees[x]);
        }
        if (state.readByEmployees.length === 0) {
            state.newTemplate.readByEmployees = listRoles
            await setState({
                ...state,
            });
        }



        props.addNewTemplate(newTemplate);
        window.$("#addTaskTemplate").modal("hide");
    }


    /**
     * Xử lý form lớn tasktemplate
     */
    const isTaskTemplateFormValidated = () => {
        let result =
            validateTaskTemplateUnit(state.newTemplate.organizationalUnit, false) &&
            validateTaskTemplateRead(state.newTemplate.readByEmployees, false) &&
            validateTaskTemplateName(state.newTemplate.name, false) &&
            validateTaskTemplateDescription(state.newTemplate.description, false) &&
            validateTaskTemplateFormula(state.newTemplate.formula, false);
        return result;
    }
    const handleTaskTemplateName = (event) => {
        let value = event.target.value;
        let { isProcess } = props
        isProcess && props.handleChangeName(value)
        validateTaskTemplateName(value, true);
    }

    const validateTaskTemplateName = async (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateName(value);

        if (willUpdateState) {
            state.newTemplate.name = value;
            state.newTemplate.errorOnName = msg;
            setState({
                ...state,
            });
        }
        // console.log('stst', state.newTemplate);
        props.onChangeTemplateData(state.newTemplate);
        return msg === undefined;
    }

    const handleTaskTemplateDesc = (event) => {
        let value = event.target.value;
        validateTaskTemplateDescription(value, true);
    }

    const validateTaskTemplateDescription = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateDescription(value);

        if (willUpdateState) {
            state.newTemplate.description = value;
            // state.newTemplate.errorOnDescription = msg;
            setState({
                ...state,
            });
        }
        props.onChangeTemplateData(state.newTemplate);
        return msg === undefined;
    }

    const handleTaskTemplateFormula = (event) => {
        let value = event.target.value;
        validateTaskTemplateFormula(value, true);
    }

    const validateTaskTemplateFormula = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value);

        if (willUpdateState) {
            state.newTemplate.formula = value;
            // state.newTemplate.errorOnFormula = msg;
            setState({
                ...state,
            });
        }
        props.onChangeTemplateData(state.newTemplate);
        return msg === undefined;
    }

    const handleTaskTemplateNumberOfDaysTaken = (event) => {
        let value = event.target.value;
        validateTaskTemplateNumberOfDaysTaken(value, true);
    }

    const validateTaskTemplateNumberOfDaysTaken = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateNumberOfDaysTaken(value);

        if (willUpdateState) {
            state.newTemplate.numberOfDaysTaken = value;
            state.newTemplate.errorOnNumberOfDaysTaken = msg;
            setState({
                ...state,
            });
        }
        props.onChangeTemplateData(state.newTemplate);
        return msg === undefined;
    }

    const handleChangeTaskPriority = (event) => {
        state.newTemplate.priority = event.target.value;
        setState({
            ...state,
        });
        props.onChangeTemplateData(state.newTemplate);
    }

    const handleTaskTemplateUnit = (value) => {
        let singleValue = value[0]; // SelectBox một lựa chọn
        if (validateTaskTemplateUnit(singleValue, true)) {
            const { department } = props;
            if (department !== undefined && department.departmentsThatUserIsManager !== undefined) {
                // Khi đổi department, cần lấy lại dữ liệu cho các selectbox (ai được xem, các vai trò)
                let dept = department.departmentsThatUserIsManager.find(item => item._id === singleValue);
                if (dept) {
                    console.log('oooo', dept);
                    // props.getChildrenOfOrganizationalUnits(singleValue);
                    props.getRoleSameDepartment(dept.managers);
                }
            }
        }
    }

    const validateTaskTemplateUnit = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateUnit(value);

        if (willUpdateState) {
            setState({
                ...state,
                newTemplate: { // update lại unit, và reset các selection phía sau
                    ...state.newTemplate,
                    organizationalUnit: value,
                    collaboratedWithOrganizationalUnits: [],
                    errorOnUnit: msg,
                    readByEmployees: [],
                    responsibleEmployees: [],
                    accountableEmployees: [],
                    consultedEmployees: [],
                    informedEmployees: [],
                }
            });
        }
        props.onChangeTemplateData(state.newTemplate);
        return msg === undefined;
    }

    const handleChangeCollaboratedWithOrganizationalUnits = (value) => {
        setState({
            ...state,
            newTemplate: { // update lại name,description và reset các selection phía sau
                ...state.newTemplate,
                collaboratedWithOrganizationalUnits: value
            }
        });
        props.onChangeTemplateData(state.newTemplate);
    }

    const handleTaskTemplateRead = (value) => {
        validateTaskTemplateRead(value, true);
    }

    const validateTaskTemplateRead = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateRead(value);

        if (willUpdateState) {
            let { newTemplate } = state;
            newTemplate.readByEmployees = value;
            newTemplate.errorOnRead = msg;
            setState({
                ...state,
                newTemplate
            });
        }
        props.onChangeTemplateData(state.newTemplate);
        return msg === undefined;
    }

    const handleTaskTemplateResponsible = (value) => {
        let { newTemplate } = state;
        newTemplate.responsibleEmployees = value;
        setState({
            ...state,
            newTemplate
        });
        props.isProcess && props.handleChangeResponsible(value)
        props.onChangeTemplateData(state.newTemplate);
    }

    const handleTaskTemplateAccountable = async (value) => {
        let { newTemplate } = state;
        newTemplate.accountableEmployees = value;
        await setState({
            ...state,
            newTemplate
        });
        props.isProcess && props.handleChangeAccountable(value)
        props.onChangeTemplateData(state.newTemplate);
    }

    const handleTaskTemplateConsult = (value) => {
        let { newTemplate } = state;
        newTemplate.consultedEmployees = value;
        setState({
            ...state,
            newTemplate
        });
        props.onChangeTemplateData(state.newTemplate);
    }

    const handleTaskTemplateInform = (value) => {
        let { newTemplate } = state;
        newTemplate.informedEmployees = value;
        setState({
            ...state,
            newTemplate
        });
        props.onChangeTemplateData(state.newTemplate);
    }

    const handleTaskActionsChange = (data) => {
        let { newTemplate } = state;
        setState({
            ...state,
            newTemplate: {
                ...newTemplate,
                taskActions: data
            },

        })

        props.onChangeTemplateData(state.newTemplate);
    }

    const handleTaskInformationsChange = (data) => {
        let { newTemplate } = state;
        setState({
            ...state,
            newTemplate: {
                ...newTemplate,
                taskInformations: data
            },

        })
        props.onChangeTemplateData(state.newTemplate);
    }

    const clickShowMore = () => {
        setState({
            ...state,
            showMore: !state.showMore,
        });
    }


    var units, taskActions, taskInformations, listRole, usercompanys, userdepartments, departmentsThatUserIsManager, listRoles = [];
    const { newTemplate, showMore, accountableEmployees, responsibleEmployees, id } = state;
    const { department, user, translate, tasktemplates, isProcess } = props;
    if (newTemplate.taskActions) taskActions = newTemplate.taskActions;
    if (newTemplate.taskInformations) taskInformations = newTemplate.taskInformations;

    if (user.organizationalUnitsOfUser) {
        units = user.organizationalUnitsOfUser;
    }
    if (department.departmentsThatUserIsManager) {
        departmentsThatUserIsManager = department.departmentsThatUserIsManager;
    }
    if (user.usersInUnitsOfCompany) {
        listRole = user.usersInUnitsOfCompany;
        for (let x in listRole) {
            listRoles.push(Object.values(listRole[x].managers));
            listRoles.push(Object.values(listRole[x].deputyManagers));
            listRoles.push(Object.values(listRole[x].employees));
        }
        listRole = [];
        for (let x in listRoles) {
            for (let i in listRoles[x]) {
                if (listRole.indexOf(listRoles[x][i]) === -1) {
                    listRole = listRole.concat(listRoles[x][i]);
                }
            }
        }
        listRoles = listRole;
    }
    // if (user.usercompanys) usercompanys = user.usercompanys;
    if (user.userdepartments) userdepartments = user.userdepartments;

    // var usersOfChildrenOrganizationalUnit;
    // if (user && user.usersOfChildrenOrganizationalUnit) {
    //     usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
    // }
    var usersInUnitsOfCompany;
    if (user && user.usersInUnitsOfCompany) {
        usersInUnitsOfCompany = user.usersInUnitsOfCompany;
    }

    var allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany);
    // let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);


    return (
        <React.Fragment>

            {/**Form chứa các thông tin của 1 task template */}

            <div className="row">
                <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                    {/**Tên mẫu công việc */}
                    <div className={`form-group ${state.newTemplate.errorOnName === undefined ? "" : "has-error"}`} >
                        <label className="control-label">{translate('task_template.name')} <span style={{ color: "red" }}>*</span></label>
                        <input type="Name" className="form-control" placeholder={translate('task_template.name')} value={newTemplate.name} onChange={handleTaskTemplateName} />
                        <ErrorLabel content={state.newTemplate.errorOnName} />
                    </div>

                    {/**Đơn vị(phòng ban) của Task template*/}
                    <div className={`form-group ${state.newTemplate.errorOnUnit === undefined ? "" : "has-error"}`} style={{ marginLeft: 0, marginRight: 0 }}>
                        <label className="control-label">{translate('task_template.unit')} <span style={{ color: "red" }}> <span style={{ color: "red" }}>*</span></span></label>
                        {usersInUnitsOfCompany !== undefined && newTemplate.organizationalUnit !== "" &&
                            <SelectBox
                                id={`unit-select-box`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    usersInUnitsOfCompany.map(x => {
                                        return { value: x.id, text: x.department };
                                    })
                                }
                                value={newTemplate.organizationalUnit}
                                onChange={handleTaskTemplateUnit}
                                multiple={false}
                                value={newTemplate.organizationalUnit}
                            />
                        }
                        <ErrorLabel content={newTemplate.errorOnUnit} />
                    </div>

                    {/* Chọn đơn vị phối hợp công việc */}
                    {usersInUnitsOfCompany &&
                        <div className="form-group">
                            <label>{translate('task.task_management.collaborated_with_organizational_units')}</label>
                            <SelectBox
                                id="multiSelectUnitThatHaveCollaboratedTemplate"
                                lassName="form-control select2"
                                style={{ width: "100%" }}
                                items={usersInUnitsOfCompany.filter(item => String(item.id) !== String(newTemplate.organizationalUnit)).map(x => {
                                    return { text: x.department, value: x.id }
                                })}
                                options={{ placeholder: translate('kpi.evaluation.dashboard.select_units') }}
                                onChange={handleChangeCollaboratedWithOrganizationalUnits}
                                value={newTemplate.collaboratedWithOrganizationalUnits}
                                multiple={true}
                            />
                        </div>
                    }
                </div>

                {/**Những Role có quyền xem mẫu công việc này*/}
                {!isProcess &&
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                        <div className={`form-group ${state.newTemplate.errorOnRead === undefined ? "" : "has-error"}`} >
                            <label className="control-label">{translate('task_template.permission_view')} </label>
                            {listRoles &&
                                <SelectBox
                                    id={`read-select-box`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        listRoles.map(x => { return { value: x._id, text: x.name } })
                                    }
                                    value={newTemplate.readByEmployees}
                                    onChange={handleTaskTemplateRead}
                                    multiple={true}
                                    options={{ placeholder: `${translate('task_template.permission_view')}` }}
                                />
                            }
                            {/* <ErrorLabel content={state.newTemplate.errorOnRead} /> */}
                        </div>
                    </div>
                }

                <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                    {/**Độ ưu tiên mẫu công việc */}
                    <div className="form-group" >
                        <label className="control-label">{translate('task.task_management.priority')}</label>
                        <select className="form-control" value={newTemplate.priority} onChange={handleChangeTaskPriority}>
                            <option value={5}>{translate('task.task_management.urgent')}</option>
                            <option value={4}>{translate('task.task_management.high')}</option>
                            <option value={3}>{translate('task.task_management.standard')}</option>
                            <option value={2}>{translate('task.task_management.average')}</option>
                            <option value={1}>{translate('task.task_management.low')}</option>
                        </select>
                    </div>
                </div>

                {/**Mô tả mẫu công việc */}
                <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                    {/* <div className={`form-group ${state.newTemplate.errorOnDescription === undefined ? "" : "has-error"}`} > */}
                    <div className={`form-group`} >
                        <label className="control-label" htmlFor="inputDescriptionTaskTemplate" style={{ width: '100%', textAlign: 'left' }}>{translate('task_template.description')}</label>
                        <textarea rows={5} type="Description" className="form-control" id="inputDescriptionTaskTemplate" name="description" placeholder={translate('task_template.description')} value={newTemplate.description} onChange={handleTaskTemplateDesc} />
                        {/* <ErrorLabel content={state.newTemplate.errorOnDescription} /> */}
                    </div>
                </div>
            </div>
            {/* </div> */}

            <div className="row">
                <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>

                    {/**Người chịu trách nhiệm mẫu công việc */}
                    <div className='form-group' >
                        <label className="control-label">{translate('task_template.performer')}</label>
                        {allUnitsMember &&
                            <SelectBox
                                id={isProcess ? `responsible-select-box-${id}` : "responsible-select-box"}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={allUnitsMember}
                                value={newTemplate.responsibleEmployees}
                                onChange={handleTaskTemplateResponsible}
                                multiple={true}
                                options={{ placeholder: `${translate('task_template.performer')}` }}
                            />
                        }
                    </div>
                    {/**Người phê duyệt mẫu công việc */}
                    <div className='form-group' >
                        <label className="control-label">{translate('task_template.approver')}</label>
                        {allUnitsMember &&
                            <SelectBox
                                id={isProcess ? `accountable-select-box-${id}` : "accountable-select-box"}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={allUnitsMember}
                                value={newTemplate.accountableEmployees}
                                onChange={handleTaskTemplateAccountable}
                                multiple={true}
                                options={{ placeholder: `${translate('task_template.approver')}` }}
                            />
                        }
                    </div>

                    {showMore &&
                        <div>
                            {/**Người tư vấn trong mẫu công việc */}
                            <div className='form-group' >
                                <label className="control-label">{translate('task_template.consultant')}</label>
                                {allUnitsMember &&
                                    <SelectBox
                                        id={isProcess ? `consulted-select-box-${id}` : "consulted-select-box"}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={allUnitsMember}
                                        value={newTemplate.consultedEmployees}
                                        onChange={handleTaskTemplateConsult}
                                        multiple={true}
                                        options={{ placeholder: `${translate('task_template.consultant')}` }}
                                    />
                                }
                            </div>
                            {/**Người quan sát mẫu công việc */}
                            <div className='form-group' >
                                <label className="control-label">{translate('task_template.observer')}</label>
                                {allUnitsMember &&
                                    <SelectBox
                                        id={isProcess ? `informed-select-box-${id}` : "informed-select-box"}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={allUnitsMember}
                                        value={newTemplate.informedEmployees}
                                        onChange={handleTaskTemplateInform}
                                        multiple={true}
                                        options={{ placeholder: `${translate('task_template.observer')}` }}
                                    />
                                }
                            </div>
                        </div>
                    }
                </div>

                {showMore &&
                    <div>
                        {isProcess &&
                            <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                                {/**Số ngày hoàn thành công việc dự kiến */}
                                <div className={`form-group ${state.newTemplate.errorOnNumberOfDaysTaken === undefined ? "" : "has-error"}`} >
                                    <label className="control-label" htmlFor="inputNumberOfDaysTaken">{translate('task_template.numberOfDaysTaken')}</label>
                                    <input type="number" className="form-control" id="inputNumberOfDaysTaken" value={newTemplate.numberOfDaysTaken}
                                        placeholder={'Nhập số ngày hoàn thành dự kiến'}
                                        onChange={handleTaskTemplateNumberOfDaysTaken} />
                                    <ErrorLabel content={state.newTemplate.errorOnNumberOfDaysTaken} />
                                </div>
                            </div>
                        }
                        <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                            {/**Công thức tính của mẫu công việc */}
                            <div className={`form-group ${state.newTemplate.errorOnFormula === undefined ? "" : "has-error"}`} >
                                <label className="control-label" htmlFor="inputFormula">{translate('task_template.formula')}</label>
                                <input type="text" className="form-control" id="inputFormula" placeholder="progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100" value={newTemplate.formula} onChange={handleTaskTemplateFormula} />
                                <ErrorLabel content={state.newTemplate.errorOnFormula} />

                                <br />
                                <div><span style={{ fontWeight: 800 }}>Ví dụ: </span>progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100</div>
                                <br />
                                <div><span style={{ fontWeight: 800 }}>{translate('task_template.parameters')}:</span></div>
                                <div><span style={{ fontWeight: 600 }}>daysOverdue</span> - Thời gian quá hạn (ngày)</div>
                                <div><span style={{ fontWeight: 600 }}>daysUsed</span> - Thời gian làm việc tính đến ngày đánh giá (ngày)</div>
                                <div><span style={{ fontWeight: 600 }}>totalDays</span> - Thời gian từ ngày bắt đầu đến ngày kết thúc công việc (ngày)</div>
                                <div><span style={{ fontWeight: 600 }}>averageActionRating</span> - Trung bình điểm đánh giá (rating) hoạt động của công việc</div>
                                <div><span style={{ fontWeight: 600 }}>numberOfFailedActions</span> - Số hoạt động không đạt (rating &lt; 5)</div>
                                <div><span style={{ fontWeight: 600 }}>numberOfPassedActions</span> - Số hoạt động đạt (rating &ge; 5)</div>
                                <div><span style={{ fontWeight: 600 }}>progress</span> - % Tiến độ công việc (0-100)</div>
                                <div><span style={{ fontWeight: 600 }}>p1, p2,...</span> - Thông tin công việc kiểu số có trong mẫu</div>
                            </div>
                        </div>
                    </div>
                }
            </div>
            {showMore &&
                <div className="row">
                    {/**Các hoạt động trong mẫu công việc */}
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                        <ActionForm initialData={taskActions} onDataChange={handleTaskActionsChange} />
                    </div>
                    {/**Các thông tin cần có mẫu công việc */}
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                        <InformationForm initialData={taskInformations} onDataChange={handleTaskInformationsChange} />
                    </div>
                </div>
            }

            {
                isProcess &&
                <div>
                    <a style={{ cursor: "pointer" }} onClick={clickShowMore}>
                        {showMore ?
                            <span>
                                Show less <i className="fa fa-angle-double-up"></i>
                            </span>
                            : <span>
                                Show more <i className="fa fa-angle-double-down"></i>
                            </span>
                        }
                    </a>
                    <br />
                </div>
            }
        </React.Fragment>
    );

}

function mapState(state) {
    const { department, user, tasktemplates } = state;
    const adding = state.tasktemplates;
    return { adding, department, user, tasktemplates };
}

const actionCreators = {
    addNewTemplate: taskTemplateActions.addTaskTemplate,
    getDepartment: UserActions.getDepartmentOfUser,
    // getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
    getDepartmentsThatUserIsManager: DepartmentActions.getDepartmentsThatUserIsManager,
    // getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany
};
const connectedAddTaskTemplate = connect(mapState, actionCreators)(withTranslate(AddTaskTemplate));
export { connectedAddTaskTemplate as AddTaskTemplate };




// import React, { useEffect, useState } from 'react';
// import { connect } from 'react-redux';
// import { withTranslate } from 'react-redux-multilingual';

// import { UserActions } from '../../../super-admin/user/redux/actions';
// import { RoleActions } from '../../../super-admin/role/redux/actions';
// import { taskTemplateActions } from '../redux/actions';
// import { PaginateBar, SelectMulti, DataTableSetting } from '../../../../common-components';
// import { ExportExcel } from '../../../../common-components';
// import Swal from 'sweetalert2';
// import { ModalAddTaskTemplate } from './addTaskTemplateModal';
// import { ModalViewTaskTemplate } from './viewTaskTemplateModal';
// import { ModalEditTaskTemplate } from './editTaskTemplateModal';
// import { TaskTemplateImportForm } from './taskTemplateImportForm';
// import './tasktemplate.css';

// const TaskTemplate = (props) => {

//     // Khởi tạo state
//     const [state, setState] = useState({
//         status: 'start',
//         currentPage: 1,
//         perPage: 10,
//         unit: [],
//         name: '',
//         currentRole: localStorage.getItem("currentRole"),
//     })

//     useEffect(() => {
//         const { currentPage, perPage, unit, name, currentRole } = state;
//         props.getDepartment();
//         props.getTaskTemplateByUser(currentPage, perPage, unit, name);
//         props.show(currentRole);
//     }, [])

//     const handleChangeTaskTemplateName = (e) => {
//         let { value } = e.target;
//         setState({
//             ...state,
//             name: value
//         });
//     }

//     /**Cập nhật số dòng trên một trang hiển thị */
//     const setLimit = (limit) => {
//         let { perPage, unit, name } = state;
//         if (limit !== perPage) {
//             setState({
//                 ...state,
//                 perPage: limit,
//                 currentPage: 1
//             });
//             props.getTaskTemplateByUser(1, limit, unit, name);
//         }
//     }

//     const myFunction = () => {
//         var input, filter, table, tr, td, i, txtValue;
//         input = document.getElementById("myInput");
//         filter = input.value.toLowerCase();
//         table = document.getElementById("myTable");
//         tr = table.getElementsByTagName("tr");
//         for (i = 0; i < tr.length; i++) {
//             td = tr[i].getElementsByTagName("td")[0];
//             if (td) {
//                 txtValue = td.textContent || td.innerText;
//                 if (txtValue.toLowerCase().indexOf(filter) > -1) {
//                     tr[i].style.display = "";
//                 } else {
//                     tr[i].style.display = "none";
//                 }
//             }
//         }
//     }

//     /**Khi người dùng chuyển trang, update data của trang mới đó */
//     const handleGetDataPagination = async (number) => {
//         let { currentPage, perPage, name } = state;
//         let units = window.$("#multiSelectUnit").val();
//         if (currentPage !== number) {
//             setState({
//                 ...state,
//                 currentPage: number
//             });
//             props.getTaskTemplateByUser(number, perPage, units, name);
//         }
//     }

//     /**Khi có hành động thay đổi data(thêm sửa xóa 1 mẫu công việc...), Hiển thị dữ liệu về trang 1 */
//     const handleUpdateData = () => {
//         let { perPage, name } = state;
//         let units = window.$("#multiSelectUnit").val();
//         setState({
//             ...state,
//             currentPage: 1
//         });
//         props.getTaskTemplateByUser(1, perPage, units, name);
//     }

//     /**Xoa tasktemplate theo id */
//     const handleDelete = (id, numberOfUse) => {
//         const { translate } = props;
//         if (numberOfUse === 0) {
//             Swal.fire({
//                 title: translate('task_template.confirm_title'),
//                 type: 'success',
//                 showCancelButton: true,
//                 cancelButtonColor: '#d33',
//                 confirmButtonColor: '#3085d6',
//                 confirmButtonText: translate('task_template.confirm')
//             }).then((res) => {
//                 if (res.value) {
//                     props._delete(id);

//                     var test = window.$("#multiSelectUnit").val();
//                     props.getTaskTemplateByUser(state.currentPage, state.perPage, test, "");
//                 }
//             });
//         } else {
//             Swal.fire({
//                 title: translate('task_template.error_title'),
//                 type: 'warning',
//                 confirmButtonColor: '#3085d6',
//                 confirmButtonText: translate('task_template.confirm')
//             })
//         }
//     }

//     /** Kiểm tra quyền thêm mới,... */
//     const checkPermisson = (managerCurrentUnit, creatorId) => {
//         let currentRole = localStorage.getItem("currentRole");
//         for (let i in managerCurrentUnit) {
//             if (currentRole === managerCurrentUnit[i]) {
//                 return true;
//             }
//         }
//         if (creatorId === localStorage.getItem("userId")) {
//             return true;
//         }
//         return false;
//     }

//     /** Kiểm tra phân quyền component */ 
//     const checkHasComponent = (name) => {
//         var { auth } = props;
//         var result = false;
//         auth.components.forEach(component => {
//             if (component.name === name) result = true;
//         });
//         return result;
//     }

//     /**Hiển thị số thứ tự của trang đang xem ở paginate bar */
//     const setPage = async (number) => {
//         let { currentPage, perPage, name } = state;
//         let units = window.$("#multiSelectUnit").val();
//         if (currentPage !== number) {
//             setState({
//                 ...state,
//                 currentPage: number
//             });
//             props.getTaskTemplateByUser(number, perPage, units, name);
//         }
//     }

//     /**Mở modal xem thông tin chi tiết 1 mẫu công việc */
//     const handleView = async (taskTemplateId) => {
//         await setState({
//             ...state,
//             currentViewRow: taskTemplateId
//         });
//         window.$('#modal-view-tasktemplate').modal('show');
//     }

//     /**Mở modal chỉnh sửa 1 mẫu công việc */
//     const handleEdit = async (taskTemplate) => {
//         await setState({
//             ...state,
//             currentEditRow: taskTemplate,
//             currentEditRowId: taskTemplate._id,
//         });
//         window.$('#modal-edit-task-template').modal('show');
//     }

//     /**Mở modal import file excel */
//     const handImportFile = (event) => {
//         event.preventDefault();
//         window.$('#modal_import_file').modal('show');
//     }

//     /**Mở modal thêm mới 1 mẫu công việc */
//     const handleAddTaskTemplate = (event) => {
//         event.preventDefault();
//         window.$('#modal-add-task-template').modal('show');
//     }

//     // Function chyển đổi dữ liệu mẫu công việc thành dạng dữ liệu dùng export
//     const convertDataToExportData = (data) => {
//         let datas = [];
//         if (data) {
//             for (let k = 0; k < data.length; k++) {
//                 const { auth, role } = props;
//                 let annunciator;
//                 let x = data[k];
//                 let length = 0;
//                 let actionName = [], actionDescription = [], mandatory = [];

//                 if (!role.isLoading && !auth.isLoading) {
//                     annunciator = auth.user.name + " - " + role.item.name;
//                 }
//                 if (x.taskActions) {
//                     if (x.taskActions.length > length) {
//                         length = x.taskActions.length;
//                     }
//                     for (let i = 0; i < x.taskActions.length; i++) {
//                         actionName[i] = x.taskActions[i].name;
//                         actionDescription[i] = x.taskActions[i].description;
//                         if (x.taskActions[i].mandatory) {
//                             mandatory[i] = "Bắt buộc";
//                         } else {
//                             mandatory[i] = "Không bắt buộc";
//                         }
//                     }
//                     for (let i in x.taskActions) {
//                         if (x.taskActions[i].description) {
//                             let str = x.taskActions[i].description;
//                             let vt = str.indexOf("&nbsp;");
//                             let st;
//                             while (vt >= 0) {
//                                 if (vt == 0) {
//                                     st = str.slice(vt + 6);
//                                 } else {
//                                     st = str.slice(0, vt - 1) + str.slice(vt + 6);
//                                 }
//                                 str = st;
//                                 vt = str.indexOf("&nbsp;");
//                             }
//                             vt = str.indexOf("<");
//                             while (vt >= 0) {
//                                 let vt2 = str.indexOf(">");
//                                 if (vt == 0) {
//                                     st = str.slice(vt2 + 1);
//                                 } else {
//                                     st = str.slice(0, vt - 1) + str.slice(vt2 + 1);
//                                 }
//                                 str = st;
//                                 vt = str.indexOf("<");
//                             }
//                             x.taskActions[i].description = str;
//                         }
//                     }
//                 }
//                 let infomationName = [], type = [], infomationDescription = [], filledByAccountableEmployeesOnly = [];
//                 if (x.taskInformations) {
//                     if (x.taskInformations.length > length) {
//                         length = x.taskInformations.length;
//                     }
//                     for (let i = 0; i < x.taskInformations.length; i++) {
//                         infomationName[i] = x.taskInformations[i].name;
//                         infomationDescription[i] = x.taskInformations[i].description;
//                         type[i] = x.taskInformations[i].type;
//                         if (x.taskInformations[i].filledByAccountableEmployeesOnly) {
//                             filledByAccountableEmployeesOnly[i] = "true";
//                         } else {
//                             filledByAccountableEmployeesOnly[i] = "false";
//                         }

//                     }
//                     for (let i in x.taskInformations) {
//                         if (x.taskInformations[i].description) {
//                             let str = x.taskInformations[i].description;
//                             let vt = str.indexOf("&nbsp;");
//                             let st;
//                             while (vt >= 0) {
//                                 if (vt == 0) {
//                                     st = str.slice(vt + 6);
//                                 } else {
//                                     st = str.slice(0, vt - 1) + str.slice(vt + 6);
//                                 }
//                                 str = st;
//                                 vt = str.indexOf("&nbsp;");
//                             }
//                             vt = str.indexOf("<");
//                             while (vt >= 0) {
//                                 let vt2 = str.indexOf(">");
//                                 if (vt == 0) {
//                                     st = str.slice(vt2 + 1);
//                                 } else {
//                                     st = str.slice(0, vt - 1) + str.slice(vt2 + 1);
//                                 }
//                                 str = st;
//                                 vt = str.indexOf("<");
//                             }
//                             x.taskInformations[i].description = str;
//                         }
//                     }
//                 }
//                 let numberOfUse = 0;
//                 if (x.numberOfUse !== 0) {
//                     numberOfUse = x.numberOfUse;
//                 }
//                 let collaboratedWithOrganizationalUnits = [], readByEmployees = [], responsibleEmployees = [], accountableEmployees = [], consultedEmployees = [], informedEmployees = [];

//                 if (x.readByEmployees && x.readByEmployees[0]) {
//                     readByEmployees = x.readByEmployees.map(item => item.name);
//                     if (length < readByEmployees.length) {
//                         length = readByEmployees.length
//                     }
//                 }
//                 if (x.collaboratedWithOrganizationalUnits && x.collaboratedWithOrganizationalUnits[0]) {
//                     collaboratedWithOrganizationalUnits = x.collaboratedWithOrganizationalUnits.map(item => item.name);
//                     if (length < collaboratedWithOrganizationalUnits.length) {
//                         length = collaboratedWithOrganizationalUnits.length
//                     }
//                 }
//                 if (x.responsibleEmployees && x.responsibleEmployees[0]) {
//                     responsibleEmployees = x.responsibleEmployees.map(item => item.email);
//                 }
//                 if (x.accountableEmployees && x.accountableEmployees[0]) {
//                     accountableEmployees = x.accountableEmployees.map(item => item.email);
//                 }
//                 if (x.consultedEmployees && x.consultedEmployees[0]) {
//                     consultedEmployees = x.consultedEmployees.map(item => item.email);
//                 }
//                 if (x.informedEmployees && x.informedEmployees[0]) {
//                     informedEmployees = x.informedEmployees.map(item => item.email);
//                 }

//                 let out = {
//                     STT: k + 1,
//                     name: x.name,
//                     description: x.description,
//                     numberOfUse: numberOfUse,
//                     readByEmployees: readByEmployees[0],
//                     responsibleEmployees: responsibleEmployees.join(', '),
//                     accountableEmployees: accountableEmployees.join(', '),
//                     consultedEmployees: consultedEmployees.join(', '),
//                     informedEmployees: informedEmployees.join(', '),
//                     organizationalUnits: x.organizationalUnit.name,
//                     collaboratedWithOrganizationalUnits: collaboratedWithOrganizationalUnits[0],
//                     creator: x.creator.email,
//                     annunciator: annunciator,
//                     priority: x.priority,
//                     formula: x.formula,
//                     actionName: actionName[0],
//                     actionDescription: actionDescription[0],
//                     mandatory: mandatory[0],
//                     infomationName: infomationName[0],
//                     infomationDescription: infomationDescription[0],
//                     type: type[0],
//                     filledByAccountableEmployeesOnly: filledByAccountableEmployeesOnly[0]
//                 }
//                 datas = [...datas, out];
//                 if (length > 1) {
//                     for (let i = 1; i < length; i++) {
//                         out = {
//                             STT: "",
//                             name: "",
//                             description: "",
//                             numberOfUse: "",
//                             readByEmployees: readByEmployees[i],
//                             responsibleEmployees: "",
//                             accountableEmployees: "",
//                             consultedEmployees: "",
//                             informedEmployees: "",
//                             organizationalUnits: "",
//                             collaboratedWithOrganizationalUnits: collaboratedWithOrganizationalUnits[i],
//                             creator: "",
//                             annunciator: "",
//                             priority: "",
//                             formula: "",
//                             actionName: actionName[i],
//                             actionDescription: actionDescription[i],
//                             mandatory: mandatory[i],
//                             infomationName: infomationName[i],
//                             infomationDescription: infomationDescription[i],
//                             type: type[i],
//                             filledByAccountableEmployeesOnly: filledByAccountableEmployeesOnly[i]
//                         };
//                         datas = [...datas, out];
//                     }
//                 }
//             }
//         }

//         let exportData = {
//             fileName: "Bảng thống kê mẫu công việc",
//             dataSheets: [
//                 {
//                     sheetName: "sheet1",
//                     sheetTitle: 'Danh sách mẫu công việc',
//                     tables: [
//                         {
//                             merges: [{
//                                 key: "taskActions",
//                                 columnName: "Danh sách hoạt động",
//                                 keyMerge: 'actionName',
//                                 colspan: 3
//                             }, {
//                                 key: "taskInfomations",
//                                 columnName: "Danh sách thông tin",
//                                 keyMerge: 'infomationName',
//                                 colspan: 4
//                             }],
//                             rowHeader: 2,
//                             columns: [
//                                 { key: "STT", value: "STT" },
//                                 { key: "name", value: "Tên mẫu" },
//                                 { key: "description", value: "Mô tả" },
//                                 { key: "organizationalUnits", value: "Đơn vị" },
//                                 { key: "collaboratedWithOrganizationalUnits", value: "Đơn vị phối hợp thực hiện công việc" },
//                                 { key: "numberOfUse", value: "Số lần sử dụng" },
//                                 { key: "creator", value: "Người tạo mẫu" },
//                                 { key: "annunciator", value: "Người xuất báo cáo" },
//                                 { key: "readByEmployees", value: "Người được xem" },
//                                 { key: "priority", value: "Độ ưu tiên" },
//                                 { key: "responsibleEmployees", value: "Người thực hiện" },
//                                 { key: "accountableEmployees", value: "Người phê duyệt" },
//                                 { key: "consultedEmployees", value: "Người tư vấn" },
//                                 { key: "informedEmployees", value: "Người quan sát" },
//                                 { key: "formula", value: "Công thức tính điểm" },
//                                 { key: "actionName", value: "Tên hoạt động" },
//                                 { key: "actionDescription", value: "Mô tả hoạt động" },
//                                 { key: "mandatory", value: "Bắt buộc" },
//                                 { key: "infomationName", value: "Tên thông tin" },
//                                 { key: "infomationDescription", value: "Mô tả thông tin" },
//                                 { key: "type", value: "Kiểu dữ liệu" },
//                                 { key: "filledByAccountableEmployeesOnly", value: "Chỉ quản lý được điền" }
//                             ],
//                             data: datas
//                         }
//                     ]
//                 },
//             ]
//         }
//         return exportData
//     }


//     // Khai báo biến dữ liệu cần dùng
//     const { translate, tasktemplates, user } = props;
//     const { currentPage, currentEditRow, currentViewRow, currentEditRowId } = state;

//     var listTaskTemplates, pageTotal, units = [], currentUnit;

//     if (tasktemplates.pageTotal) {
//         pageTotal = tasktemplates.pageTotal;
//     }
//     if (user.organizationalUnitsOfUser) {
//         units = user.organizationalUnitsOfUser;
//         currentUnit = units.filter(item =>
//             item.managers.includes(localStorage.getItem("currentRole"))
//             || item.deputyManagers.includes(localStorage.getItem("currentRole"))
//             || item.employees.includes(localStorage.getItem("currentRole")));
//     }

//     if (tasktemplates.items) {
//         listTaskTemplates = tasktemplates.items;
//     }
//     let list = [];
//     if (tasktemplates.isLoading === false) {
//         list = tasktemplates.items;
//     }
//     let exportData = convertDataToExportData(list);


//     return (
//         <div className="box">
//             <div className="box-body qlcv" id="table-task-template">
//                 {
//                     currentViewRow &&
//                     <ModalViewTaskTemplate
//                         taskTemplateId={currentViewRow}
//                     />
//                 }
//                 {
//                     currentEditRow &&
//                     <ModalEditTaskTemplate
//                         taskTemplate={currentEditRow}
//                         taskTemplateId={currentEditRowId}
//                     />
//                 }

//                 <TaskTemplateImportForm />
//                 <ExportExcel id="export-taskTemplate" exportData={exportData} style={{ marginLeft: 5 }} />
//                 {/**Kiểm tra xem role hiện tại có quyền thêm mới mẫu công việc không(chỉ trưởng đơn vị) */}
//                 {checkHasComponent('create-task-template-button') &&
//                     <React.Fragment>
//                         <ModalAddTaskTemplate />
//                         <div className="form-inline">
//                             <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
//                                 <button type="button" className="btn btn-success dropdown-toggler pull-right" data-toggle="dropdown" aria-expanded="true" title='Thêm'>{translate('task_template.add')}</button>
//                                 <ul className="dropdown-menu pull-right">
//                                     <li><a href="#modal-add-task-template" title="ImportForm" onClick={(event) => { handleAddTaskTemplate(event) }}>{translate('task_template.add')}</a></li>
//                                     <li><a href="#modal_import_file" title="Import file excell" onClick={(event) => { handImportFile(event) }}>{translate('task_template.import')}</a></li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </React.Fragment>
//                 }

//                 {/**Các ô input để nhập điều kiện tìm mẫu công việc */}
//                 <div className="form-inline">
//                     <div className="form-group">
//                         <label className="form-control-static">{translate('task_template.name')}</label>
//                         <input className="form-control" type="text" placeholder={translate('task_template.search_by_name')} onChange={handleChangeTaskTemplateName} />
//                     </div>
//                 </div>

//                 <div className="form-inline">
//                     <div className="form-group">
//                         <label className="form-control-static">{translate('task_template.unit')}</label>
//                         {units &&
//                             <SelectMulti id="multiSelectUnit"
//                                 defaultValue={units.map(item => { return item._id })}
//                                 items={units.map(item => { return { value: item._id, text: item.name } })}
//                                 options={{ nonSelectedText: translate('task_template.select_all_units'), allSelectedText: "Tất cả các đơn vị" }}>
//                             </SelectMulti>
//                         }
//                         <button type="button" className="btn btn-success" title="Tìm tiếm mẫu công việc" onClick={handleUpdateData}>{translate('task_template.search')}</button>
//                     </div>
//                 </div>

//                 <DataTableSetting
//                     tableId="table-task-template"
//                     columnArr={[
//                         'Tên mẫu công việc',
//                         'Mô tả',
//                         'Số lần sử dụng',
//                         'Người tạo mẫu',
//                         'Đơn vị'
//                     ]}
//                     limit={state.perPage}
//                     setLimit={setLimit}
//                     hideColumnOption={true}
//                 />

//                 {/**Table chứa các mẫu công việc trong 1 trang */}
//                 <table className="table table-bordered table-striped table-hover" id="table-task-template">
//                     <thead>
//                         <tr>
//                             <th title={translate('task_template.tasktemplate_name')}>{translate('task_template.tasktemplate_name')}</th>
//                             <th title={translate('task_template.description')}>{translate('task_template.description')}</th>
//                             <th title={translate('task_template.count')}>{translate('task_template.count')}</th>
//                             <th title={translate('task_template.creator')}>{translate('task_template.creator')}</th>
//                             <th title={translate('task_template.unit')}>{translate('task_template.unit')}</th>
//                             <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
//                         </tr>
//                     </thead>
//                     <tbody className="task-table">
//                         {
//                             (typeof listTaskTemplates !== 'undefined' && listTaskTemplates.length !== 0) ?
//                                 listTaskTemplates.map(item => item &&
//                                     <tr key={item._id}>
//                                         <td title={item.name}>{item.name}</td>
//                                         <td title={item.description}>{item.description}</td>
//                                         <td title={item.numberOfUse}>{item.numberOfUse}</td>
//                                         <td title={item.creator && item.creator.name}>{item.creator ? item.creator.name : translate('task.task_template.error_task_template_creator_null')}</td>
//                                         <td title={item.organizationalUnit && item.organizationalUnit.name}>{item.organizationalUnit ? item.organizationalUnit.name : translate('task_template.error_task_template_organizational_unit_null')}</td>
//                                         <td>
//                                             <a href="#abc" onClick={() => handleView(item._id)} title={translate('task.task_template.view_detail_of_this_task_template')}>
//                                                 <i className="material-icons" style={!checkPermisson(currentUnit && currentUnit[0].managers, "") ? { paddingLeft: "35px" } : { paddingLeft: "0px" }}>view_list</i>
//                                             </a>

//                                             {/**Check quyền xem có được xóa hay sửa mẫu công việc không */}
//                                             {checkPermisson(item.organizationalUnit.managers, item.creator._id) &&
//                                                 <React.Fragment>
//                                                     <a href="cursor:{'pointer'}" onClick={() => handleEdit(item)} className="edit" title={translate('task_template.edit_this_task_template')}>
//                                                         <i className="material-icons">edit</i>
//                                                     </a>
//                                                     <a href="cursor:{'pointer'}" onClick={() => handleDelete(item._id, item.numberOfUse)} className="delete" title={translate('task_template.delete_this_task_template')}>
//                                                         <i className="material-icons"></i>
//                                                     </a>
//                                                 </React.Fragment>
//                                             }
//                                         </td>
//                                     </tr>
//                                 ) :
//                                 <tr><td colSpan={6}><center>{translate('task_template.no_data')}</center></td></tr>
//                         }
//                     </tbody>
//                 </table>
//                 <PaginateBar pageTotal={pageTotal} currentPage={currentPage} func={setPage} />
//             </div>
//         </div>
//     );
// }

// function mapState(state) {
//     const { tasktemplates, user, auth, role } = state;
//     return { tasktemplates, user, auth, role };
// }

// const actionCreators = {
//     getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,
//     getDepartment: UserActions.getDepartmentOfUser,
//     _delete: taskTemplateActions._delete,
//     show: RoleActions.show,
// };
// const connectedTaskTemplate = connect(mapState, actionCreators)(withTranslate(TaskTemplate));
// export { connectedTaskTemplate as TaskTemplate };