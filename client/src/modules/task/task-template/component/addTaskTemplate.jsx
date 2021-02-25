import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../redux/actions';
import { InformationForm } from '../component/informationsTemplate';
import { ActionForm } from '../component/actionsTemplate';
import { SelectBox, ErrorLabel, QuillEditor } from '../../../../common-components';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import { TaskTemplateFormValidator } from './taskTemplateFormValidator';
import { getStorage } from '../../../../config';
import ValidationHelper from '../../../../helpers/validationHelper';
import parse from 'html-react-parser';

class AddTaskTemplate extends Component {
    constructor(props) {
        super(props);
        let userId = getStorage("userId")
        this.state = {
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
            showMore: this.props.isProcess ? false : true,
            currentRole: localStorage.getItem('currentRole'),
        };
    }

    componentDidMount() {
        // this.props.getDepartment(); // => user.organizationalUnitsOfUser
        // this.props.getAllUserOfCompany(); // => user.usercompanys
        this.props.getRoleSameDepartment(localStorage.getItem("currentRole")); // => user.roledepartments
        this.props.getDepartmentsThatUserIsManager(); // => department.departmentsThatUserIsManager
        this.props.getAllUserInAllUnitsOfCompany(); // => user.usersInUnitsOfCompany
    }

    handleTaskTemplateName = (e) => {
        let { value } = e.target;
        let { isProcess, translate } = this.props
        isProcess && this.props.handleChangeName(value);
        let { message } = ValidationHelper.validateName(translate, value, 1, 255);
        let { newTemplate } = this.state;
        newTemplate.name = value;
        newTemplate.errorOnName = message;
        this.props.onChangeTemplateData(newTemplate);
        this.setState({ newTemplate });
    }

    // handleTaskTemplateDesc = (e) => {
    //     let { value } = e.target;
    //     let { isProcess, translate } = this.props
    //     isProcess && this.props.handleChangeName(value);
    //     let { message } = ValidationHelper.validateName(translate, value, 1, 255);
    //     let { newTemplate } = this.state;
    //     newTemplate.description = value;
    //     newTemplate.errorDescription = message;
    //     this.props.onChangeTemplateData(newTemplate);
    //     this.setState({ newTemplate });
    // }

    handleTaskTemplateDesc = (value, imgs) => {
        this.setState(state => {
            return {
                ...state,
                newTemplate: {
                    ...state.newTemplate,
                    description: value,
                }
            };
        });

        this.props.onChangeTemplateData(this.state.newTemplate);
    }

    handleTaskTemplateFormula = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateFormula(value, true);
    }

    validateTaskTemplateFormula = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value);

        if (willUpdateState) {
            this.state.newTemplate.formula = value;
            this.state.newTemplate.errorOnFormula = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        this.props.onChangeTemplateData(this.state.newTemplate);
        return msg === undefined;
    }

    handleTaskTemplateNumberOfDaysTaken = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateNumberOfDaysTaken(value, true);
    }

    validateTaskTemplateNumberOfDaysTaken = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateNumberOfDaysTaken(value);

        if (willUpdateState) {
            this.state.newTemplate.numberOfDaysTaken = value;
            this.state.newTemplate.errorOnNumberOfDaysTaken = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        this.props.onChangeTemplateData(this.state.newTemplate);
        return msg === undefined;
    }

    handleChangeTaskPriority = (e) => {
        let { newTemplate } = this.state;
        let { value } = e.target;
        newTemplate.priority = value;
        this.props.onChangeTemplateData(newTemplate);
        this.setState({ newTemplate });
    }

    handleTaskTemplateUnit = (value) => {
        let singleValue = value[0]; // SelectBox một lựa chọn
        if (this.validateTaskTemplateUnit(singleValue, true)) {
            const { department } = this.props;
            if (department !== undefined && department.departmentsThatUserIsManager !== undefined) {
                // Khi đổi department, cần lấy lại dữ liệu cho các selectbox (ai được xem, các vai trò)
                let dept = department.departmentsThatUserIsManager.find(item => item._id === singleValue);
                if (dept) {
                    this.props.getRoleSameDepartment(dept.managers);
                }
            }
        }
    }

    validateTaskTemplateUnit = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateUnit(value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    newTemplate: { // update lại unit, và reset các selection phía sau
                        ...this.state.newTemplate,
                        organizationalUnit: value,
                        collaboratedWithOrganizationalUnits: [],
                        errorOnUnit: msg,
                        readByEmployees: [],
                        responsibleEmployees: [],
                        accountableEmployees: [],
                        consultedEmployees: [],
                        informedEmployees: [],
                    }
                };
            });
        }
        this.props.onChangeTemplateData(this.state.newTemplate);
        return msg === undefined;
    }

    handleChangeCollaboratedWithOrganizationalUnits = (value) => {
        let { newTemplate } = this.state;
        newTemplate.collaboratedWithOrganizationalUnits = value;
        this.props.onChangeTemplateData(newTemplate);
        this.setState({ newTemplate });
    }

    handleTaskTemplateRead = (value) => {
        let { newTemplate } = this.state;
        newTemplate.readByEmployees = value;
        this.props.onChangeTemplateData(newTemplate);
        this.setState({ newTemplate });
    }

    handleTaskTemplateResponsible = (value) => {
        let { newTemplate } = this.state;
        newTemplate.responsibleEmployees = value;
        this.props.isProcess && this.props.handleChangeResponsible(value)
        this.props.onChangeTemplateData(newTemplate);
        this.setState({ newTemplate });
    }

    handleTaskTemplateAccountable = async (value) => {
        let { newTemplate } = this.state;
        newTemplate.accountableEmployees = value;
        this.props.isProcess && this.props.handleChangeAccountable(value)
        this.props.onChangeTemplateData(newTemplate);
        this.setState({ newTemplate });
    }

    handleTaskTemplateConsult = (value) => {
        let { newTemplate } = this.state;
        newTemplate.consultedEmployees = value;
        this.props.onChangeTemplateData(newTemplate);
        this.setState({ newTemplate });
    }

    handleTaskTemplateInform = (value) => {
        let { newTemplate } = this.state;
        newTemplate.informedEmployees = value;
        this.props.onChangeTemplateData(newTemplate);
        this.setState({
            newTemplate
        });
    }

    handleTaskActionsChange = (data) => {
        let { newTemplate } = this.state;
        newTemplate.taskActions = data;
        this.props.onChangeTemplateData(newTemplate);
        this.setState({ newTemplate })
    }

    handleTaskInformationsChange = (data) => {
        let { newTemplate } = this.state;
        newTemplate.taskInformations = data;
        this.props.onChangeTemplateData(newTemplate);
        this.setState({ newTemplate })
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        const { department, user } = this.props;
        const { newTemplate } = this.state;

        // dùng cho chức năng tạo task process
        if (nextProps.isProcess && nextProps.id !== this.state.id) {
            let { info, listOrganizationalUnit } = nextProps;
            this.setState(state => {
                return {
                    id: nextProps.id,
                    newTemplate: {
                        organizationalUnit: (info && info.organizationalUnit) ? info.organizationalUnit : "",
                        collaboratedWithOrganizationalUnits: (info && info.collaboratedWithOrganizationalUnits) ? info.collaboratedWithOrganizationalUnits : [],
                        name: (info && info.name) ? info.name : '',
                        responsibleEmployees: (info && info.responsibleEmployees) ? info.responsibleEmployees : [],
                        accountableEmployees: (info && info.accountableEmployees) ? info.accountableEmployees : [],
                        consultedEmployees: (info && info.consultedEmployees) ? info.consultedEmployees : [],
                        informedEmployees: (info && info.informedEmployees) ? info.informedEmployees : [],
                        description: (info && info.description) ? info.description : '',
                        quillDescriptionDefault: (info && info.description) ? info.description : '',
                        creator: (info && info.creator) ? info.creator : getStorage("userId"),
                        numberOfDaysTaken: (info && info.numberOfDaysTaken) ? info.numberOfDaysTaken : '',
                        formula: (info && info.formula) ? info.formula : '',
                        priority: (info && info.priority) ? info.priority : 3,
                        taskActions: (info && info.taskActions) ? info.taskActions : [],
                        taskInformations: (info && info.taskInformations) ? info.taskInformations : [],
                    },
                    showMore: this.props.isProcess ? false : true,
                }
            })

            // this.props.getDepartment(); // => user.organizationalUnitsOfUser

            // let { user } = this.props;
            let defaultUnit;
            if (user && user.organizationalUnitsOfUser) defaultUnit = user.organizationalUnitsOfUser.find(item =>
                item.manager === this.state.currentRole
                || item.deputyManager === this.state.currentRole
                || item.employee === this.state.currentRole);
            if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
                // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
                defaultUnit = user.organizationalUnitsOfUser[0]
            }
            // this.props.getChildrenOfOrganizationalUnits(defaultUnit && defaultUnit._id); // => user.usersOfChildrenOrganizationalUnit
            return false;
        }

        // dùng cho chức năng lưu task thành template
        if (nextProps.savedTaskAsTemplate && nextProps.savedTaskId !== this.state.savedTaskId) {
            this.setState(state => {
                return {
                    ...state,
                    savedTaskId: nextProps.savedTaskId,
                    id: nextProps.savedTaskId,
                    savedTaskAsTemplate: nextProps.savedTaskAsTemplate,
                    newTemplate: {
                        organizationalUnit: nextProps.savedTaskItem.organizationalUnit._id,
                        collaboratedWithOrganizationalUnits: nextProps.savedTaskItem.collaboratedWithOrganizationalUnits.map(e => e.organizationalUnit._id),
                        name: nextProps.savedTaskItem.name,
                        // readByEmployees: nextProps.savedTaskItem.readByEmployees,
                        responsibleEmployees: nextProps.savedTaskItem.responsibleEmployees.map(e => e._id),
                        accountableEmployees: nextProps.savedTaskItem.accountableEmployees.map(e => e._id),
                        consultedEmployees: nextProps.savedTaskItem.consultedEmployees.map(e => e._id),
                        informedEmployees: nextProps.savedTaskItem.informedEmployees.map(e => e._id),
                        description: nextProps.savedTaskItem.description,
                        quillDescriptionDefault: nextProps.savedTaskItem.description,
                        // numberOfDaysTaken: nextProps.savedTaskItem.numberOfDaysTaken,
                        formula: nextProps.savedTaskItem.formula,
                        priority: nextProps.savedTaskItem.priority,
                        taskActions: nextProps.savedTaskItem.taskActions.map(e => {
                            return {
                                mandatory: e.mandatory,
                                name: e.description,
                                description: e.description,
                            }
                        }),
                        taskInformations: nextProps.savedTaskItem.taskInformations.map(e => {
                            return {
                                filledByAccountableEmployeesOnly: e.filledByAccountableEmployeesOnly,
                                code: e.code,
                                name: e.name,
                                description: e.description,
                                type: e.type,
                                extra: e.extra,
                            }
                        }),
                        creator: getStorage("userId"),
                    },
                }
            })

            let defaultUnit;
            if (user && user.organizationalUnitsOfUser) defaultUnit = user.organizationalUnitsOfUser.find(item =>
                item.manager === this.state.currentRole
                || item.deputyManager === this.state.currentRole
                || item.employee === this.state.currentRole);
            if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
                // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
                defaultUnit = user.organizationalUnitsOfUser[0]
            }
            return false;
        }

        if (!user.organizationalUnitsOfUser) {
            this.props.getDepartment(); // => user.organizationalUnitsOfUser
            return false;
        }

        // Khi truy vấn lấy các đơn vị mà user là manager đã có kết quả, và thuộc tính đơn vị của newTemplate chưa được thiết lập
        if (newTemplate.organizationalUnit === "" && user.organizationalUnitsOfUser) {
            // Tìm unit mà currentRole của user đang thuộc về
            let defaultUnit = user.organizationalUnitsOfUser.find(item =>
                item.managers.includes(this.state.currentRole)
                || item.deputyManagers.includes(this.state.currentRole)
                || item.employees.includes(this.state.currentRole)
            );

            if (defaultUnit) {
                this.setState(state => {
                    return {
                        ...state,
                        newTemplate: {
                            ...this.state.newTemplate,
                            organizationalUnit: defaultUnit._id
                        }
                    };
                });

                // this.props.getChildrenOfOrganizationalUnits(defaultUnit._id); // => user.usersOfChildrenOrganizationalUnit
                return false; // Sẽ cập nhật lại state nên không cần render
            }
        }
        return true;
    }

    clickShowMore = () => {
        this.setState(state => {
            return {
                ...state,
                showMore: !state.showMore,
            }
        });
    }

    render() {

        var units, taskActions, taskInformations, listRole, usercompanys, userdepartments, departmentsThatUserIsManager, listRoles = [];
        const { savedTaskAsTemplate, newTemplate, showMore, accountableEmployees, responsibleEmployees, id } = this.state;
        const { department, user, translate, tasktemplates, isProcess } = this.props;
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
                        <div className={`form-group ${this.state.newTemplate.errorOnName === undefined ? "" : "has-error"}`} >
                            <label className="control-label">{translate('task_template.name')} <span style={{ color: "red" }}>*</span></label>
                            <input type="Name" className="form-control" placeholder={translate('task_template.name')} value={newTemplate.name} onChange={this.handleTaskTemplateName} />
                            <ErrorLabel content={this.state.newTemplate.errorOnName} />
                        </div>

                        {/**Đơn vị(phòng ban) của Task template*/}
                        <div className={`form-group ${this.state.newTemplate.errorOnUnit === undefined ? "" : "has-error"}`} style={{ marginLeft: 0, marginRight: 0 }}>
                            <label className="control-label">{translate('task_template.unit')}</label>
                            {usersInUnitsOfCompany !== undefined && newTemplate.organizationalUnit !== "" &&
                                <SelectBox
                                    id={`unit-select-box-${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        usersInUnitsOfCompany.map(x => {
                                            return { value: x.id, text: x.department };
                                        })
                                    }
                                    value={newTemplate.organizationalUnit}
                                    onChange={this.handleTaskTemplateUnit}
                                    multiple={false}
                                    value={newTemplate.organizationalUnit}
                                />
                            }
                        </div>

                        {/* Chọn đơn vị phối hợp công việc */}
                        {usersInUnitsOfCompany &&
                            <div className="form-group">
                                <label>{translate('task.task_management.collaborated_with_organizational_units')}</label>
                                <SelectBox
                                    id={`multiSelectUnitThatHaveCollaboratedTemplate-${id}`}
                                    lassName="form-control select2"
                                    style={{ width: "100%" }}
                                    items={usersInUnitsOfCompany.filter(item => String(item.id) !== String(newTemplate.organizationalUnit)).map(x => {
                                        return { text: x.department, value: x.id }
                                    })}
                                    options={{ placeholder: translate('kpi.evaluation.dashboard.select_units') }}
                                    onChange={this.handleChangeCollaboratedWithOrganizationalUnits}
                                    value={newTemplate.collaboratedWithOrganizationalUnits}
                                    multiple={true}
                                />
                            </div>
                        }
                    </div>

                    {/**Những Role có quyền xem mẫu công việc này*/}
                    {!isProcess &&
                        <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                            <div className={`form-group ${this.state.newTemplate.errorOnRead === undefined ? "" : "has-error"}`} >
                                <label className="control-label">{translate('task_template.permission_view')} </label>
                                {listRoles &&
                                    <SelectBox
                                        id={`read-select-box-${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            listRoles.map(x => { return { value: x._id, text: x.name } })
                                        }
                                        value={newTemplate.readByEmployees}
                                        onChange={this.handleTaskTemplateRead}
                                        multiple={true}
                                        options={{ placeholder: `${translate('task_template.permission_view')}` }}
                                    />
                                }
                                {/* <ErrorLabel content={this.state.newTemplate.errorOnRead} /> */}
                            </div>
                        </div>
                    }

                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                        {/**Độ ưu tiên mẫu công việc */}
                        <div className="form-group" >
                            <label className="control-label">{translate('task.task_management.priority')}</label>
                            <select className="form-control" value={newTemplate.priority} onChange={this.handleChangeTaskPriority}>
                                <option value={5}>{translate('task.task_management.urgent')}</option>
                                <option value={4}>{translate('task.task_management.high')}</option>
                                <option value={3}>{translate('task.task_management.standard')}</option>
                                <option value={2}>{translate('task.task_management.average')}</option>
                                <option value={1}>{translate('task.task_management.low')}</option>
                            </select>
                        </div>
                    </div>

                    {/* Mô tả công việc */}
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                        <div className={`form-group`}>
                            <label className="control-label">{translate('task.task_management.detail_description')}</label>
                            <QuillEditor
                                id={`task-template-add-modal-quill-${id}`}
                                table={false}
                                embeds={false}
                                getTextData={this.handleTaskTemplateDesc}
                                height={80}
                                quillValueDefault={newTemplate.quillDescriptionDefault}
                                placeholder={translate('task_template.description')}
                            />
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
                                    onChange={this.handleTaskTemplateResponsible}
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
                                    onChange={this.handleTaskTemplateAccountable}
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
                                            onChange={this.handleTaskTemplateConsult}
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
                                            onChange={this.handleTaskTemplateInform}
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
                                    <div className={`form-group ${this.state.newTemplate.errorOnNumberOfDaysTaken === undefined ? "" : "has-error"}`} >
                                        <label className="control-label" htmlFor="inputNumberOfDaysTaken">{translate('task_template.numberOfDaysTaken')}</label>
                                        <input type="number" className="form-control" id="inputNumberOfDaysTaken" value={newTemplate.numberOfDaysTaken}
                                            placeholder={'Nhập số ngày hoàn thành dự kiến'}
                                            onChange={this.handleTaskTemplateNumberOfDaysTaken} />
                                        <ErrorLabel content={this.state.newTemplate.errorOnNumberOfDaysTaken} />
                                    </div>
                                </div>
                            }
                            <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                                {/**Công thức tính của mẫu công việc */}
                                <div className={`form-group ${this.state.newTemplate.errorOnFormula === undefined ? "" : "has-error"}`} >
                                    <label className="control-label" htmlFor="inputFormula">{translate('task_template.formula')}</label>
                                    <input type="text" className="form-control" id="inputFormula" placeholder="progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100" value={newTemplate.formula} onChange={this.handleTaskTemplateFormula} />
                                    <ErrorLabel content={this.state.newTemplate.errorOnFormula} />

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
                            <ActionForm initialData={taskActions} onDataChange={this.handleTaskActionsChange} savedTaskAsTemplate={savedTaskAsTemplate} />
                        </div>
                        {/**Các thông tin cần có mẫu công việc */}
                        <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                            <InformationForm initialData={taskInformations} onDataChange={this.handleTaskInformationsChange} savedTaskAsTemplate={savedTaskAsTemplate} />
                        </div>
                    </div>
                }

                {
                    isProcess &&
                    <div>
                        <a style={{ cursor: "pointer" }} onClick={this.clickShowMore}>
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