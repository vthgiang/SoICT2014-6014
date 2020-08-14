import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getStorage } from '../../../../config';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from './../../task-template/redux/actions';

import { SelectBox, ErrorLabel, DatePicker } from '../../../../common-components';

import { TaskTemplateFormValidator } from './../../task-template/component/taskTemplateFormValidator';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import './../../task-template/component/tasktemplate.css';
import { TaskFormValidator } from '../../task-management/component/taskFormValidator';

class FormCreateTaskByProcess extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentRole: localStorage.getItem('currentRole'),
            editingTemplate: {
                organizationalUnit: '',
                name: '',
                responsibleEmployees: [],
                accountableEmployees: [],
                consultedEmployees: [],
                informedEmployees: [],
                description: '',
                startDate: '',
                endDate: '',
                priority: 3,
            },

        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // get department of current user 
        this.props.getDepartment();
        // lấy tất cả nhân viên của công ty
        this.props.getAllUserOfCompany();
        // Lấy tất cả vai trò cùng phòng ban
        this.props.getRoleSameDepartment(localStorage.getItem("currentRole"));
        // Lấy tất cả các role là dean 
        this.props.getDepartmentsThatUserIsDean();
        // Lấy tất cả nhân viên trong công ty
        this.props.getAllUserInAllUnitsOfCompany();
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.taskTemplateId !== prevState.taskTemplateId) {
            return {
                ...prevState,
                taskTemplate: nextProps.taskTemplate,
                errorOnName: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnDescription: undefined,
                errorOnRead: undefined,
                errorOnFormula: undefined,
                errorOnUnit: undefined,
                showActionForm: undefined
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        const { department } = this.props;
        const { editingTemplate } = this.state;
        if (nextProps.isProcess && nextProps.id !== this.state.id) {
            let { info, listOrganizationalUnit } = nextProps;
            this.setState(state => {
                return {
                    id: nextProps.id,
                    editingTemplate: {
                        startDate: (info && info.startDate) ? info.startDate : "",
                        endDate: (info && info.endDate) ? info.endDate : "",
                        organizationalUnit: (info && info.organizationalUnit) ? info.organizationalUnit : [],
                        name: (info && info.name) ? info.name : '',
                        responsibleEmployees: (info && info.responsibleEmployees) ? info.responsibleEmployees : [],
                        accountableEmployees: (info && info.accountableEmployees) ? info.accountableEmployees : [],
                        consultedEmployees: (info && info.consultedEmployees) ? info.consultedEmployees : [],
                        informedEmployees: (info && info.informedEmployees) ? info.informedEmployees : [],
                        description: (info && info.description) ? info.description : '',
                        creator: (info && info.creator) ? info.creator : getStorage("userId"),
                        formula: (info && info.formula) ? info.formula : '',
                        priority: (info && info.priority) ? info.priority : 3,
                        taskActions: (info && info.taskActions) ? info.taskActions : [],
                        taskInformations: (info && info.taskInformations) ? info.taskInformations : [],
                    },
                    showMore: this.props.isProcess ? false : true,
                    showActionForm: true,
                }
            })
            this.props.getDepartment();
            let { user } = this.props;
            let defaultUnit;
            if (user && user.organizationalUnitsOfUser) defaultUnit = user.organizationalUnitsOfUser.find(item =>
                item.dean === this.state.currentRole
                || item.viceDean === this.state.currentRole
                || item.employee === this.state.currentRole);
            if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
                // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
                defaultUnit = user.organizationalUnitsOfUser[0]
            }
            this.props.getChildrenOfOrganizationalUnits(defaultUnit && defaultUnit._id);
            return false;
        }

        if (nextProps.isTaskTemplate && nextProps.taskTemplateId !== this.props.taskTemplateId) {

            this.setState({
                taskTemplateId: nextProps.taskTemplateId,
                taskTemplate: nextProps.taskTemplate,
                editingTemplate: {
                    _id: nextProps.taskTemplate._id,
                    organizationalUnit: nextProps.taskTemplate.organizationalUnit._id,
                    name: nextProps.taskTemplate.name,
                    readByEmployees: nextProps.taskTemplate.readByEmployees.map(item => item._id),
                    responsibleEmployees: nextProps.taskTemplate.responsibleEmployees.map(item => item._id),
                    accountableEmployees: nextProps.taskTemplate.accountableEmployees.map(item => item._id),
                    consultedEmployees: nextProps.taskTemplate.consultedEmployees.map(item => item._id),
                    informedEmployees: nextProps.taskTemplate.informedEmployees.map(item => item._id),
                    description: nextProps.taskTemplate.description,
                    formula: nextProps.taskTemplate.formula,
                    priority: nextProps.taskTemplate.priority,
                    taskActions: nextProps.taskTemplate.taskActions,
                    taskInformations: nextProps.taskTemplate.taskInformations,
                    startDate: nextProps.taskTemplate.startDate,
                    endDate: nextProps.taskTemplate.endDate,
                },
                showActionForm: true,
            });
            return true;
        }

        // Khi truy vấn lấy các đơn vị mà user là dean đã có kết quả, và thuộc tính đơn vị của newTemplate chưa được thiết lập
        if (editingTemplate.organizationalUnit === "" && department.departmentsThatUserIsDean) {
            // Tìm unit mà currentRole của user đang thuộc về
            let defaultUnit = department.departmentsThatUserIsDean.find(item =>
                item.deans.includes(this.state.currentRole)
                || item.viceDeans.includes(this.state.currentRole)
                || item.employees.includes(this.state.currentRole
                ));

            if (defaultUnit) {
                this.setState(state => {
                    return {
                        ...state,
                        editingTemplate: {
                            ...this.state.newTemplate,
                            organizationalUnit: defaultUnit._id
                        }
                    };
                });

                this.props.getChildrenOfOrganizationalUnits(defaultUnit._id);
                return false; // Sẽ cập nhật lại state nên không cần render
            }
        }
        return true;
    }

    /**Gửi req sửa mẫu công việc này */
    handleSubmit = async (event) => {
        const { editingTemplate } = this.state;

        this.props.editTaskTemplate(editingTemplate._id, editingTemplate);
    }

    /**
     * Xử lý form lớn tasktemplate
     */
    isTaskTemplateFormValidated = () => {
        if (!this.state.editingTemplate._id)
            return false;
        let result =
            this.validateTaskTemplateRead(this.state.editingTemplate.readByEmployees, false) &&
            this.validateTaskTemplateName(this.state.editingTemplate.name, false) &&
            this.validateTaskTemplateDesc(this.state.editingTemplate.description, false) &&
            this.validateTaskTemplateFormula(this.state.editingTemplate.formula, false) &&
            this.validateTaskTemplateUnit(this.state.editingTemplate.organizationalUnit, false);
        return result;
    }
    handleTaskTemplateName = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateName(value, true);
    }
    validateTaskTemplateName = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateName(value);

        if (willUpdateState) {
            this.state.editingTemplate.name = value;
            this.state.editingTemplate.errorOnName = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        this.props.onChangeTemplateData(this.state.editingTemplate);
        return msg == undefined;
    }

    handleTaskTemplateDesc = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateDesc(value, true);
    }
    validateTaskTemplateDesc = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateDescription(value);

        if (willUpdateState) {
            this.state.editingTemplate.description = value;
            this.state.editingTemplate.errorOnDescription = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        this.props.onChangeTemplateData(this.state.editingTemplate);
        return msg == undefined;
    }

    handleTaskTemplateFormula = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateFormula(value, true);
    }
    validateTaskTemplateFormula = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value);

        if (willUpdateState) {
            this.state.editingTemplate.formula = value;
            this.state.editingTemplate.errorOnFormula = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        this.props.onChangeTemplateData(this.state.editingTemplate);
        return msg == undefined;
    }
    handleChangeTaskPriority = (event) => {
        this.state.editingTemplate.priority = event.target.value;
        this.setState(state => {
            return {
                ...state,
            };
        });
        this.props.onChangeTemplateData(this.state.editingTemplate);
    }
    handleTaskTemplateUnit = (value) => {
        let singleValue = value[0]; // SelectBox một lựa chọn
        if (this.validateTaskTemplateUnit(singleValue, true)) {
            const { department } = this.props;

            if (department !== undefined && department.departmentsThatUserIsDean !== undefined) {
                // Khi đổi department, cần lấy lại dữ liệu cho các selectbox (ai được xem, các vai trò)
                let dept = department.departmentsThatUserIsDean.find(item => item._id === singleValue);
                if (dept) {
                    this.props.getChildrenOfOrganizationalUnits(singleValue);
                    this.props.getRoleSameDepartment(dept.dean);
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
                    editingTemplate: { // update lại unit, và reset các selection phía sau
                        ...this.state.editingTemplate,
                        organizationalUnit: value,
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
        this.props.onChangeTemplateData(this.state.editingTemplate);
        return msg == undefined;
    }

    handleTaskTemplateRead = (value) => {
        this.validateTaskTemplateRead(value, true);
    }
    validateTaskTemplateRead = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateRead(value);

        if (willUpdateState) {
            this.state.editingTemplate.readByEmployees = value;
            this.state.editingTemplate.errorOnRead = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        this.props.onChangeTemplateData(this.state.editingTemplate);
        return msg == undefined;
    }

    handleTaskTemplateResponsible = (value) => {
        this.state.editingTemplate.responsibleEmployees = value;

        this.setState(state => {
            return {
                ...state,
            };
        });
        this.props.onChangeTemplateData(this.state.editingTemplate);
    }
    handleTaskTemplateAccountable = (value) => {
        this.state.editingTemplate.accountableEmployees = value;
        this.setState(state => {
            return {
                ...state,
            };
        });
        this.props.onChangeTemplateData(this.state.editingTemplate);
    }
    handleTaskTemplateConsult = (value) => {
        this.state.editingTemplate.consultedEmployees = value;
        this.setState(state => {
            return {
                ...state,
            };
        });
        this.props.onChangeTemplateData(this.state.editingTemplate);
    }
    handleTaskTemplateInform = (value) => {
        this.state.editingTemplate.informedEmployees = value;

        this.setState(state => {
            return {
                ...state,
            };
        });
        this.props.onChangeTemplateData(this.state.editingTemplate);
    }

    // handleChangeTaskStartDate = (value) => {
    //     this.setState({
    //         startDate: value,
    //     })
    //     // this.props.handleChangeTaskStartDate(value);
    // }

    // handleChangeTaskEndDate = (value) => {
    //     this.setState({
    //         endDate: value,
    //     });

    //     // this.props.handleChangeTaskEndDate(value)
    // }


    handleChangeTaskStartDate = (value) => {
        this.validateTaskStartDate(value, true);
    }
    validateTaskStartDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = TaskFormValidator.validateTaskStartDate(value, this.state.editingTemplate.endDate ? this.state.editingTemplate.endDate : "", translate);

        if (willUpdateState) {
            this.state.editingTemplate.startDate = value;
            this.state.editingTemplate.errorOnStartDate = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
            this.props.onChangeTemplateData(this.state.editingTemplate);
        }
        
        return msg === undefined;
    }

    handleChangeTaskEndDate = (value) => {
        this.validateTaskEndDate(value, true);
    }
    validateTaskEndDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = TaskFormValidator.validateTaskEndDate(this.state.editingTemplate.startDate ? this.state.editingTemplate.startDate : "", value, translate);

        if (willUpdateState) {
            this.state.editingTemplate.endDate = value;
            this.state.editingTemplate.errorOnEndDate = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
            this.props.onChangeTemplateData(this.state.editingTemplate);
        }
        return msg === undefined;
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
        const { department, user, translate } = this.props;
        const { isProcess } = this.props;

        var units, taskActions, taskInformations, listRole, departmentsThatUserIsDean, listRoles, usercompanys, userdepartments = [];
        var { editingTemplate, id, showMore } = this.state;

        if (editingTemplate && editingTemplate.taskActions) taskActions = editingTemplate.taskActions;
        if (editingTemplate && editingTemplate.taskInformations) taskInformations = editingTemplate.taskInformations;

        if (user.organizationalUnitsOfUser) {
            units = user.organizationalUnitsOfUser;
        }
        if (department.departmentsThatUserIsDean) {
            departmentsThatUserIsDean = department.departmentsThatUserIsDean;
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

        var allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany);
        let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);

        return (
            <React.Fragment>
                {/**Form chứa thông tin của mẫu công việc đang sửa */}
                <div className="row">
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                        {/**Đơn vị của mẫu công việc */}
                        <div className={`form-group ${editingTemplate.errorOnUnit === undefined ? "" : "has-error"}`} >
                            <label className="control-label">{translate('task_template.unit')}*:</label>
                            {departmentsThatUserIsDean !== undefined && editingTemplate.organizationalUnit !== "" &&
                                <SelectBox
                                    id={`edit-unit-select-box-${editingTemplate._id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        departmentsThatUserIsDean.map(x => {
                                            return { value: x._id, text: x.name };
                                        })
                                    }
                                    onChange={this.handleTaskTemplateUnit}
                                    value={editingTemplate.organizationalUnit}
                                    multiple={false}

                                />
                            }
                            <ErrorLabel content={this.state.editingTemplate.errorOnUnit} />
                        </div>
                    </div>

                </div>

                <div className="row">
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>

                        {/**Tên mẫu công việc này */}
                        <div className={`form-group ${this.state.editingTemplate.errorOnName === undefined ? "" : "has-error"}`} >
                            <label className="control-label">{translate('task_template.tasktemplate_name')}*</label>
                            <input type="Name" className="form-control" placeholder={translate('task_template.tasktemplate_name')} value={editingTemplate.name} onChange={this.handleTaskTemplateName} />
                            <ErrorLabel content={this.state.editingTemplate.errorOnName} />
                        </div>

                        {/* độ ưu tiên cviec ---- older*/}
                    </div>

                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>

                        {/**Mô tả mẫu công việc này */}
                        <div className={`form-group ${this.state.editingTemplate.errorOnDescription === undefined ? "" : "has-error"}`} >
                            <label className="control-label" htmlFor="inputDescriptionTaskTemplate">{translate('task_template.description')}*</label>
                            <textarea rows={4} type="Description" className="form-control" id="inputDescriptionTaskTemplate" name="description" placeholder={translate('task_template.description')} value={editingTemplate.description} onChange={this.handleTaskTemplateDesc} />
                            <ErrorLabel content={this.state.editingTemplate.errorOnDescription} />
                        </div>
                    </div>
                </div>
                {/**Độ ưu tiên mẫu công việc này */}
                <div className="form-group" >
                    <label className="control-label">{translate('task_template.priority')}</label>
                    <select className="form-control" value={editingTemplate.priority} onChange={this.handleChangeTaskPriority}>
                        <option value={3}>{translate('task_template.high')}</option>
                        <option value={2}>{translate('task_template.medium')}</option>
                        <option value={1}>{translate('task_template.low')}</option>
                    </select>
                </div>
                {/* Ngay bat dau - ngay ket thuc */}
                <div className=" row form-group">
                    <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${this.state.editingTemplate.errorOnStartDate === undefined ? "" : "has-error"}`}>
                        <label className="control-label">{translate('task.task_management.start_date')}*</label>
                        <DatePicker
                            id={`datepicker1-${id}`}
                            dateFormat="day-month-year"
                            value={editingTemplate.startDate}
                            onChange={this.handleChangeTaskStartDate}
                        />
                        {/* <ErrorLabel content={errorOnStartDate} /> */}
                    </div>
                    <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${this.state.editingTemplate.errorOnEndDate === undefined ? "" : "has-error"}`}>
                        <label className="control-label">{translate('task.task_management.end_date')}*</label>
                        <DatePicker
                            id={`datepicker2-${id}`}
                            value={editingTemplate.endDate}
                            onChange={this.handleChangeTaskEndDate}
                        />
                        {/* <ErrorLabel content={errorOnEndDate} /> */}
                    </div>
                </div>

                <div className="row">
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                        <div className='form-group' >

                            {/**Người thực hiện mẫu công việc này */}
                            <label className="control-label" >{translate('task_template.performer')}</label>
                            {unitMembers && editingTemplate.responsibleEmployees &&
                                <SelectBox
                                    id={isProcess ? `edit-responsible-select-box-${editingTemplate._id}-${id}` : "edit-responsible-select-box"}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={unitMembers}
                                    onChange={this.handleTaskTemplateResponsible}
                                    value={editingTemplate.responsibleEmployees}
                                    multiple={true}
                                    options={{ placeholder: `${translate('task_template.performer')}` }}
                                />
                            }
                        </div>
                        <div className='form-group' >

                            {/**Người phê duyệt mẫu công việc này */}
                            <label className="control-label">{translate('task_template.approver')}</label>
                            {unitMembers && editingTemplate.accountableEmployees &&
                                <SelectBox
                                    id={isProcess ? `edit-accountable-select-box-${editingTemplate._id}-${id}` : "edit-accountable-select-box"}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={unitMembers}
                                    onChange={this.handleTaskTemplateAccountable}
                                    value={editingTemplate.accountableEmployees}
                                    multiple={true}
                                    options={{ placeholder: `${translate('task_template.approver')}` }}
                                />
                            }
                        </div>
                        {
                            // showMore &&
                            <div>
                                <div className='form-group' >
                                    {/**Người hỗ trọ mẫu công việc này */}
                                    <label className="control-label">{translate('task_template.supporter')}</label>
                                    {allUnitsMember && editingTemplate.consultedEmployees &&
                                        <SelectBox
                                            id={isProcess ? `edit-consulted-select-box-${editingTemplate._id}-${id}` : "edit-consulted-select-box"}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={allUnitsMember}
                                            onChange={this.handleTaskTemplateConsult}
                                            value={editingTemplate.consultedEmployees}
                                            multiple={true}
                                            options={{ placeholder: `${translate('task_template.supporter')}` }}
                                        />
                                    }
                                </div>
                                <div className='form-group' >

                                    {/**Người quan sát mẫu công việc này */}
                                    <label className="control-label">{translate('task_template.observer')}</label>
                                    {allUnitsMember && editingTemplate.informedEmployees &&
                                        <SelectBox
                                            id={isProcess ? `edit-informed-select-box-${editingTemplate._id}-${id}` : "edit-informed-select-box"}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={allUnitsMember}
                                            onChange={this.handleTaskTemplateInform}
                                            multiple={true}
                                            value={editingTemplate.informedEmployees}
                                            options={{ placeholder: `${translate('task_template.observer')}` }}
                                        />
                                    }
                                </div>
                            </div>

                        }
                    </div>

                </div>

                {/* {
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
                } */}
            </React.Fragment>
        );
    }
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
    getDepartmentsThatUserIsDean: DepartmentActions.getDepartmentsThatUserIsDean,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany

};
const connectedFormCreateTaskByProcess = connect(mapState, actionCreators)(withTranslate(FormCreateTaskByProcess));
export { connectedFormCreateTaskByProcess as FormCreateTaskByProcess };