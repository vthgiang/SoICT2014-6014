import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import  {taskTemplateActions} from '../redux/actions';
import { TaskTemplateFormValidator} from './taskTemplateFormValidator';
import {InformationForm} from '../component/informationsTemplate';
import {ActionForm} from '../component/actionsTemplate';

import {DialogModal, ButtonModal, SelectBox, ErrorLabel} from '../../../../common-components';
import './tasktemplate.css';

import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';

class ModalAddTaskTemplate extends Component {
    constructor(props) {
        super(props);

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
                creator: '',
                formula: '',
                priority:3,
                taskActions: [],
                taskInformations: []
            },
            currentRole: localStorage.getItem('currentRole'),
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
        this.props.getAllUserInAllUnitsOfCompany();
    }
    
    
    
    /**
     * Xử lý form lớn tasktemplate
     */
    isTaskTemplateFormValidated = () => {
        let result = 
            this.validateTaskTemplateUnit(this.state.newTemplate.organizationalUnit, false) &&
            this.validateTaskTemplateRead(this.state.newTemplate.readByEmployees, false) &&
            this.validateTaskTemplateName(this.state.newTemplate.name, false) &&
            this.validateTaskTemplateDesc(this.state.newTemplate.description, false) &&
            this.validateTaskTemplateFormula(this.state.newTemplate.formula, false);
        return result;
    }
    handleTaskTemplateName = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateName(value, true);
    }
    validateTaskTemplateName = (value, willUpdateState=true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateName(value);

        if (willUpdateState){
            this.state.newTemplate.name = value;
            this.state.newTemplate.errorOnName = msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg === undefined;
    }

    handleTaskTemplateDesc = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateDesc(value, true);
    }
    validateTaskTemplateDesc = (value, willUpdateState=true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateDescription(value);

        if (willUpdateState){
            this.state.newTemplate.description = value;
            this.state.newTemplate.errorOnDescription = msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg === undefined;
    }

    handleTaskTemplateFormula = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateFormula(value, true);
    }
    validateTaskTemplateFormula = (value, willUpdateState=true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value);

        if (willUpdateState){
            this.state.newTemplate.formula = value;
            this.state.newTemplate.errorOnFormula = msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg === undefined;
    }
    handleChangeTaskPriority = (event) => {
        this.state.newTemplate.priority = event.target.value;
        this.setState(state =>{
            return{
                ...state,
            };
        });
    }
    handleTaskTemplateUnit = (value) => {
        let singleValue = value[0]; // SelectBox một lựa chọn
        if (this.validateTaskTemplateUnit(singleValue, true)) { 
            const {department} = this.props;
                
            if (department !== undefined && department.departmentsThatUserIsDean !== undefined){
                // Khi đổi department, cần lấy lại dữ liệu cho các selectbox (ai được xem, các vai trò)
                let dept = department.departmentsThatUserIsDean.find(item => item._id === singleValue);
                if (dept){
                    this.props.getChildrenOfOrganizationalUnits(singleValue);
                    this.props.getRoleSameDepartment(dept.dean);
                }
            }
        }
    }
    validateTaskTemplateUnit = (value, willUpdateState=true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateUnit(value);

        if (willUpdateState){
            this.setState(state =>{
                return{
                    ...state,
                    newTemplate: { // update lại unit, và reset các selection phía sau
                        ...this.state.newTemplate,
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
        return msg === undefined;
    }

    handleTaskTemplateRead = (value) => {
        this.validateTaskTemplateRead(value, true);
    }
    validateTaskTemplateRead = (value, willUpdateState=true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateRead(value);

        if (willUpdateState){
            this.state.newTemplate.readByEmployees = value;
            this.state.newTemplate.errorOnRead = msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg === undefined;
    }

    handleTaskTemplateResponsible = (value) => {
        this.state.newTemplate.responsibleEmployees = value;
        this.setState(state =>{
            return{
                ...state,
            };
        });
    }
    handleTaskTemplateAccountable = (value) => {
        this.state.newTemplate.accountableEmployees = value;
        this.setState(state =>{
            return{
                ...state,
            };
        });
    }
    handleTaskTemplateConsult = (value) => {
        this.state.newTemplate.consultedEmployees = value;
        this.setState(state =>{
            return{
                ...state,
            };
        });
    }
    handleTaskTemplateInform = (value) => {
        this.state.newTemplate.informedEmployees = value;
        this.setState(state =>{
            return{
                ...state,
            };
        });
    }  

    // Submit new template in data
    handleSubmit = async (event) => {
        const { newTemplate } = this.state;
        this.props.addNewTemplate(newTemplate);
    }

    
    handleTaskActionsChange =(data) =>{
        let { newTemplate } = this.state;
        this.setState(state => {
            return {
                ...state,
                newTemplate: {
                    ...newTemplate,
                    taskActions: data
                },
            }
        })
    
    }
    handleTaskInformationsChange =(data)=>{
        let { newTemplate } = this.state;
        this.setState(state => {
            return {
                ...state,
                newTemplate: {
                    ...newTemplate,
                    taskInformations: data
                },
            }
        })
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        const { department } = this.props;
        const { newTemplate } = this.state;

        // Khi truy vấn lấy các đơn vị mà user là dean đã có kết quả, và thuộc tính đơn vị của newTemplate chưa được thiết lập
        if (newTemplate.organizationalUnit === "" && department.departmentsThatUserIsDean) {
            // Tìm unit mà currentRole của user đang thuộc về
            let defaultUnit = department.departmentsThatUserIsDean.find(item =>
                item.deans.includes(this.state.currentRole)
                || item.viceDeans.includes(this.state.currentRole)
                || item.employees.includes(this.state.currentRole
            ));
            
            if (defaultUnit){
                this.setState(state =>{
                    return{
                        ...state,
                        newTemplate: {
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
    
    render() {
        var units, taskActions, taskInformations, listRole, usercompanys, userdepartments, departmentsThatUserIsDean, listRoles=[];
        const { newTemplate } = this.state;
        const { department, user, translate, tasktemplates } = this.props;
        if (newTemplate.taskActions) taskActions = newTemplate.taskActions;
        if (newTemplate.taskInformations) taskInformations = newTemplate.taskInformations;
        
        if (user.organizationalUnitsOfUser) {
            units = user.organizationalUnitsOfUser;
        }
        if (department.departmentsThatUserIsDean){
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
        if(user && user.usersOfChildrenOrganizationalUnit){
            usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
        }
        var usersInUnitsOfCompany;
        if(user&&user.usersInUnitsOfCompany){
            usersInUnitsOfCompany = user.usersInUnitsOfCompany;
        }
        
        var allUnitsMember =getEmployeeSelectBoxItems(usersInUnitsOfCompany);
        let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);

        return (
            <React.Fragment>
                {/* <ButtonModal modalID="modal-add-task-template" button_name={translate('task_template.add')} title="Thêm mới mẫu công việc"/> */}
                <DialogModal
                    modalID="modal-add-task-template" isLoading={user.isLoading}
                    formID="form-add-task-template"
                    title={translate('task_template.add_tasktemplate')}
                    func={this.handleSubmit}
                    disableSubmit={!this.isTaskTemplateFormValidated()}
                    size={100}
                >
                    <div className="row">
                        <div className="col-sm-6">
                            <div className={`form-group ${this.state.newTemplate.errorOnUnit===undefined?"":"has-error"}`}  style={{marginLeft: 0, marginRight: 0}}>
                                <label className="control-label">{translate('task_template.unit')}*:</label>
                                {departmentsThatUserIsDean !== undefined && newTemplate.organizationalUnit !== "" &&
                                    <SelectBox
                                        id={`unit-select-box`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        items={
                                            departmentsThatUserIsDean.map(x => {
                                                return {value: x._id, text: x.name};
                                            })
                                        }
                                        onChange={this.handleTaskTemplateUnit}
                                        multiple={false}
                                        value={newTemplate.organizationalUnit}
                                    />
                                }
                                <ErrorLabel content={this.state.newTemplate.errorOnUnit}/>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className={`form-group ${this.state.newTemplate.errorOnRead===undefined?"":"has-error"}`} >
                                <label className="control-label">{translate('task_template.permission_view')}*</label>
                                {listRoles &&
                                    <SelectBox
                                        id={`read-select-box`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        items={
                                            listRoles.map( x => { return { value : x._id, text : x.name}})
                                        }
                                        onChange={this.handleTaskTemplateRead}
                                        multiple={true}
                                        options={{placeholder: `${translate('task_template.permission_view')}`}}
                                    />
                                }
                                <ErrorLabel content={this.state.newTemplate.errorOnRead}/>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                            <div className={`form-group ${this.state.newTemplate.errorOnName===undefined?"":"has-error"}`} >
                                <label className="control-label">{translate('task_template.name')}*</label>
                                <input type="Name" className="form-control" placeholder={translate('task_template.name')} value={newTemplate.name} onChange={this.handleTaskTemplateName} />
                                <ErrorLabel content={this.state.newTemplate.errorOnName}/>
                            </div>

                            <div className="form-group" >
                                <label className="control-label">{translate('task_template.priority')}</label>
                                <select className="form-control" value={newTemplate.priority} onChange={this.handleChangeTaskPriority}>
                                    <option value={3}>{translate('task_template.high')}</option>
                                    <option value={2}>{translate('task_template.medium')}</option>
                                    <option value={1}>{translate('task_template.low')}</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-6">
                            <div className={`form-group ${this.state.newTemplate.errorOnDescription===undefined?"":"has-error"}`} >
                                <label className="control-label" htmlFor="inputDescriptionTaskTemplate" style={{ width: '100%', textAlign: 'left' }}>{translate('task_template.description')}*</label>
                                <textarea rows={5} type="Description" className="form-control" id="inputDescriptionTaskTemplate" name="description" placeholder={translate('task_template.description')} value={newTemplate.description} onChange={this.handleTaskTemplateDesc} />
                                <ErrorLabel content={this.state.newTemplate.errorOnDescription}/>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-sm-6">
                            <div className='form-group' >
                                <label className="control-label">{translate('task_template.performer')}</label>
                                
                                {unitMembers &&
                                    <SelectBox
                                        id={`responsible-select-box`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        items={unitMembers}
                                        onChange={this.handleTaskTemplateResponsible}
                                        multiple={true}
                                        options={{placeholder: `${translate('task_template.performer')}`}}
                                    />
                                }
                            </div>
                            <div className='form-group' >
                                <label className="control-label">{translate('task_template.approver')}</label>
                                {unitMembers &&
                                    <SelectBox
                                        id={`accounatable-select-box`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        items={unitMembers}
                                        onChange={this.handleTaskTemplateAccountable}
                                        multiple={true}
                                        options={{placeholder: `${translate('task_template.approver')}`}}
                                    />
                                }
                            </div>
                            <div className='form-group' >
                                <label className="ontrol-label">{translate('task_template.supporter')}</label>
                                {allUnitsMember &&
                                    <SelectBox
                                        id={`consulted-select-box`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        items={allUnitsMember}
                                        onChange={this.handleTaskTemplateConsult}
                                        multiple={true}
                                        options={{placeholder: `${translate('task_template.supporter')}`}}
                                    />
                                }
                            </div>
                            <div className='form-group' >
                                <label className="control-label">{translate('task_template.observer')}</label>
                                {allUnitsMember &&
                                    <SelectBox
                                        id={`informed-select-box`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        items={allUnitsMember}
                                        onChange={this.handleTaskTemplateInform}
                                        multiple={true}
                                        options={{placeholder: `${translate('task_template.observer')}`}}
                                    />
                                }
                            </div>
                        </div>

                        <div className="col-sm-6">
                            <div className={`form-group ${this.state.newTemplate.errorOnFormula===undefined?"":"has-error"}`} >
                                <label className="control-label" htmlFor="inputFormula">{translate('task_template.formula')}*</label>
                                <input type="text" className="form-control" id="inputFormula" placeholder="progress/(dayUsed/totalDay) - (10-averageActionRating)*10 - 100*(1-p1/p2)" value={newTemplate.formula} onChange={this.handleTaskTemplateFormula} />
                                <ErrorLabel content={this.state.newTemplate.errorOnFormula}/>
                                
                                <br/>
                                <div><span style={{fontWeight: 800}}>Ví dụ: </span>progress/(dayUsed/totalDay) - (10-averageActionRating)*10 - 100*(1-p1/p2)</div>
                                <br/>
                                <div><span style={{fontWeight: 800}}>{translate('task_template.parameters')}:</span></div>
                                <div><span style={{fontWeight: 600}}>overdueDate</span> - Thời gian quá hạn (ngày)</div>
                                <div><span style={{fontWeight: 600}}>dayUsed</span> - Thời gian làm việc tính đến ngày đánh giá (ngày)</div>
                                <div><span style={{fontWeight: 600}}>totalDay</span> - Thời gian từ ngày bắt đầu đến ngày kết thúc công việc (ngày)</div>
                                <div><span style={{fontWeight: 600}}>averageActionRating</span> -  Trung bình cộng điểm đánh giá hoạt động (1-10)</div>
                                <div><span style={{fontWeight: 600}}>progress</span> - % Tiến độ công việc (0-100)</div>
                                <div><span style={{fontWeight: 600}}>dayUsed</span> - Thời gian làm việc tính đến ngày đánh giá (ngày)</div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                            <ActionForm  initialData ={taskActions} onDataChange={this.handleTaskActionsChange} />
                        </div>
                        <div className="col-sm-6">
                            <InformationForm initialData ={taskInformations} onDataChange={this.handleTaskInformationsChange}/>
                        </div>
                    </div>
                </DialogModal>
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
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
    getDepartmentsThatUserIsDean: DepartmentActions.getDepartmentsThatUserIsDean,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany
};
const connectedModalAddTaskTemplate = connect(mapState, actionCreators)(withTranslate(ModalAddTaskTemplate));
export { connectedModalAddTaskTemplate as ModalAddTaskTemplate };