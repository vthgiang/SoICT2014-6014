import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import  {taskTemplateActions} from '../redux/actions';

import {ActionForm} from '../component/actionsTemplate';
import {DialogModal, SelectBox, ErrorLabel} from '../../../../common-components';

import { TaskTemplateFormValidator} from './taskTemplateFormValidator';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import './tasktemplate.css';

class ModalEditTaskTemplate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentRole: localStorage.getItem('currentRole'),
            editingTemplate: {
                organizationalUnit: '',
                name: '',
                readByEmployees: [],
                responsibleEmployees: [],
                accountableEmployees: [],
                consultedEmployees: [],
                informedEmployees: [],
                description: '',
                formula: '',
                priority: 3,
                taskActions: [],
                taskInformations: []
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
                taskTemplateId: nextProps.taskTemplateId,
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
        if (nextProps.taskTemplateId !== this.state.taskTemplateId) {
            this.props.getTaskTemplate(nextProps.taskTemplateId); // Gửi truy vấn lấy dữ liệu
            return false;
        }

        let newDataArrived = nextProps.tasktemplates.taskTemplate !== undefined && nextProps.tasktemplates.taskTemplate !== null;
        if (!newDataArrived) {
            return false; // Đang lấy dữ liệu, không cần render
        }
        if (this.props.tasktemplates.taskTemplate) {
            newDataArrived = newDataArrived && (nextProps.tasktemplates.taskTemplate._id !== this.props.tasktemplates.taskTemplate._id);
        }
        if (newDataArrived) { // Dữ liệu đã về vầ được bind vào prop
            let taskTemplate = nextProps.tasktemplates.taskTemplate;

            this.props.getChildrenOfOrganizationalUnits(taskTemplate.organizationalUnit._id);

            let editingTemplate = { // Những trường đã populate sẽ bỏ đi, chỉ lấy lại id
                ...taskTemplate,
                organizationalUnit: taskTemplate.organizationalUnit._id,
                accountableEmployees: taskTemplate.accountableEmployees.map(item => item._id),
                consultedEmployees: taskTemplate.consultedEmployees.map(item => item._id),
                informedEmployees: taskTemplate.informedEmployees.map(item => item._id),
                readByEmployees: taskTemplate.readByEmployees.map(item => item._id),
                responsibleEmployees: taskTemplate.responsibleEmployees.map(item => item._id),
            };
            this.setState(state => {
                return {
                    ...state,
                    editingTemplate: editingTemplate,
                    showActionForm: true,
                };
            });
            return true; // Cần cập nhật lại state, không cần render
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
        return msg == undefined;
    }
    handleChangeTaskPriority = (event) => {
        this.state.editingTemplate.priority = event.target.value;
        this.setState(state => {
            return {
                ...state,
            };
        });
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
        return msg == undefined;
    }

    handleTaskTemplateResponsible = (value) => {
        this.state.editingTemplate.responsibleEmployees = value;

        this.setState(state => {
            return {
                ...state,
            };
        });
    }
    handleTaskTemplateAccountable = (value) => {
        this.state.editingTemplate.accountableEmployees = value;
        this.setState(state => {
            return {
                ...state,
            };
        });
    }
    handleTaskTemplateConsult = (value) => {
        this.state.editingTemplate.consultedEmployees = value;
        this.setState(state => {
            return {
                ...state,
            };
        });
    }
    handleTaskTemplateInform = (value) => {
        this.state.editingTemplate.informedEmployees = value;

        this.setState(state => {
            return {
                ...state,
            };
        });
    }
    
    handleTaskActionsChange =(data) =>{
        let { editingTemplate } = this.state;
        this.setState(state => {

            return {
                ...state,
                editingTemplate: {
                    ...editingTemplate,
                    taskActions: data
                },
            }
        })
    }


    render() {
        var units, taskActions, taskInformations, listRole, usercompanys, userdepartments, departmentsThatUserIsDean, listRoles = [];
        var { editingTemplate } = this.state;

        const { department, user, translate, tasktemplates } = this.props;
        if (editingTemplate && editingTemplate.taskActions) taskActions = editingTemplate.taskActions;
        if (editingTemplate && editingTemplate.taskInformations) taskInformations = editingTemplate.taskInformations;

        if (user.organizationalUnitsOfUser) {
            units = user.organizationalUnitsOfUser;
        }
        if (department.departmentsThatUserIsDean) {
            departmentsThatUserIsDean = department.departmentsThatUserIsDean;
        }
        if (user.roledepartments) {
            listRole = user.roledepartments;
            for (let x in listRole.deans)
                listRoles[x] = listRole.deans[x];
            for (let x in listRole.viceDeans)
                listRoles.push(listRole.viceDeans[x]);
            for (let x in listRole.employees)
                listRoles.push(listRole.employees[x]);
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
            <DialogModal
                modalID="modal-edit-task-template" isLoading={user.isLoading}
                formID="form-edit-task-template"
                title={translate('task_template.edit_tasktemplate')}
                func={this.handleSubmit}
                disableSubmit={!this.isTaskTemplateFormValidated()}
                size={100}
            >
                {/**Form chứa thông tin của mẫu công việc đang sửa */}
                <div className="row">
                    <div className="col-sm-6">
                        {/**Đơn vị của mẫu công việc */}
                        <div className={`form-group ${editingTemplate.errorOnUnit===undefined?"":"has-error"}`} >
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
                    <div className="col-sm-6">
                        {/**Role có quyền xem mẫu công việc này */}
                        <div className={`form-group ${this.state.editingTemplate.errorOnRead===undefined?"":"has-error"}`} >
                            <label className="control-label">{translate('task_template.permission_view')}*</label>
                            {listRole && editingTemplate.readByEmployees &&
                                <SelectBox
                                    id={`edit-read-select-box-${editingTemplate._id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        listRoles.map(x => { return { value: x._id, text: x.name } })
                                    }
                                    onChange={this.handleTaskTemplateRead}
                                    value={editingTemplate.readByEmployees}
                                    multiple={true}
                                    options={{ placeholder: `${translate('task_template.permission_view')}` }}
                                />
                            }
                            <ErrorLabel content={this.state.editingTemplate.errorOnRead} />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6">

                        {/**Tên mẫu công việc này */}
                        <div className={`form-group ${this.state.editingTemplate.errorOnName===undefined?"":"has-error"}`} >
                            <label className="control-label">{translate('task_template.tasktemplate_name')}*</label>
                            <input type="Name" className="form-control" placeholder={translate('task_template.tasktemplate_name')} value={editingTemplate.name} onChange={this.handleTaskTemplateName} />
                            <ErrorLabel content={this.state.editingTemplate.errorOnName} />
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
                    </div>

                    <div className="col-sm-6">

                        {/**Mô tả mẫu công việc này */}
                        <div className={`form-group ${this.state.editingTemplate.errorOnDescription===undefined?"":"has-error"}`} >
                            <label className="control-label" htmlFor="inputDescriptionTaskTemplate">{translate('task_template.description')}*</label>
                            <textarea rows={5} type="Description" className="form-control" id="inputDescriptionTaskTemplate" name="description" placeholder={translate('task_template.description')} value={editingTemplate.description} onChange={this.handleTaskTemplateDesc} />
                            <ErrorLabel content={this.state.editingTemplate.errorOnDescription} />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6">
                        <div className='form-group' >

                            {/**Người thực hiện mẫu công việc này */}
                            <label className="control-label" >{translate('task_template.performer')}</label>
                            {unitMembers && editingTemplate.responsibleEmployees &&
                                <SelectBox
                                    id={`edit-responsible-select-box-${editingTemplate._id}`}
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
                                    id={`edit-accounatable-select-box-${editingTemplate._id}`}
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
                        <div className='form-group' >

                            {/**Người hỗ trọ mẫu công việc này */}
                            <label className="control-label">{translate('task_template.supporter')}</label>
                            {allUnitsMember && editingTemplate.consultedEmployees &&
                                <SelectBox
                                    id={`edit-consulted-select-box-${editingTemplate._id}`}
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
                                    id={`edit-informed-select-box-${editingTemplate._id}`}
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

                    <div className="col-sm-6">
                        {/**Công thức tính điểm mẫu công việc này */}
                        <div className={`form-group ${this.state.editingTemplate.errorOnFormula===undefined?"":"has-error"}`} >
                            <label className="control-label" htmlFor="inputFormula">{translate('task_template.formula')}*</label>
                            <input type="text" className="form-control" id="inputFormula" placeholder="progress/(dayUsed/totalDay) - (10-averageActionRating)*10 - 100*(1-p1/p2)" value={editingTemplate.formula} onChange={this.handleTaskTemplateFormula} />
                            <ErrorLabel content={this.state.editingTemplate.errorOnFormula} />

                            <br />
                            <div><span style={{ fontWeight: 800 }}>Ví dụ: </span>progress/(dayUsed/totalDay) - (10-averageActionRating)*10 - 100*(1-p1/p2)</div>
                            <br />
                            <div><span style={{ fontWeight: 800 }}>{translate('task_template.parameters')}:</span></div>
                            <div><span style={{ fontWeight: 600 }}>overdueDate</span> - Thời gian quá hạn (ngày)</div>
                            <div><span style={{ fontWeight: 600 }}>dayUsed</span> - Thời gian làm việc tính đến ngày đánh giá (ngày)</div>
                            <div><span style={{ fontWeight: 600 }}>totalDay</span> - Thời gian từ ngày bắt đầu đến ngày kết thúc công việc (ngày)</div>
                            <div><span style={{ fontWeight: 600 }}>averageActionRating</span> -  Trung bình cộng điểm đánh giá hoạt động (1-10)</div>
                            <div><span style={{ fontWeight: 600 }}>progress</span> - % Tiến độ công việc (0-100)</div>
                            <div><span style={{ fontWeight: 600 }}>dayUsed</span> - Thời gian làm việc tính đến ngày đánh giá (ngày)</div>
                        </div>
                    </div>
                </div>


                <div className="row">
                    <div className="col-sm-6">
                        {/**Các hoạt động mẫu công việc này */}
                        { this.state.showActionForm &&                        
                            <ActionForm initialData ={editingTemplate.taskActions} onDataChange={this.handleTaskActionsChange} /> 
                        }    
                    </div>
                    <div className="col-sm-6">
                        <fieldset className="scheduler-border">
                            {/**Các thông tin cần có của mẫu công việc này */}
                            <legend className="scheduler-border">{translate('task_template.information_list')}</legend>
                            {
                                (!editingTemplate.taskInformations || editingTemplate.taskInformations.length === 0) ?
                                    <span>{translate('task_template.no_data')}</span> :
                                    editingTemplate.taskInformations.map((item, index) =>
                                        <div style={{ paddingBottom: "20px" }} key={index}>
                                            <div>
                                                <label>{item.code} - {item.name} - Kiểu {item.type}</label>
                                                {item.filledByAccountableEmployeesOnly ? `- ${translate('task_template.manager_fill')}` : ""}
                                            </div>
                                            {item.description}
                                        </div>
                                    )
                            }
                        </fieldset>
                    </div>
                </div>
            </DialogModal>
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
const connectedModalEditTaskTemplate = connect(mapState, actionCreators)(withTranslate(ModalEditTaskTemplate));
export { connectedModalEditTaskTemplate as ModalEditTaskTemplate };