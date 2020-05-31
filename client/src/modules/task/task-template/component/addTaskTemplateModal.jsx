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
        // Lấy tất cả nhân viên của phòng ban
        // this.props.getAllUserOfDepartment();
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        // Lấy tất cả vai trò cùng phòng ban
        this.props.getRoleSameDepartment(localStorage.getItem("currentRole"));
        // Lấy tất cả các role là dean 
        this.props.getDepartmentsThatUserIsDean();
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
                    this.props.getAllUserSameDepartment(dept.dean);
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
                item.dean === this.state.currentRole
                || item.viceDean === this.state.currentRole
                || item.employee === this.state.currentRole);
            
            this.setState(state =>{
                return{
                    ...state,
                    newTemplate: {
                        ...this.state.newTemplate,
                        organizationalUnit: defaultUnit._id
                    }
                };
            });
            return false; // Sẽ cập nhật lại state nên không cần render
        }

        return true;
    }
    
    render() {
        var units, taskActions, taskInformations, listRole, usercompanys, userdepartments, departmentsThatUserIsDean;
        const { newTemplate } = this.state;
        const { department, user, translate } = this.props;
        if (newTemplate.taskActions) taskActions = newTemplate.taskActions;
        if (newTemplate.taskInformations) taskInformations = newTemplate.taskInformations;
        
        if (user.organizationalUnitsOfUser) {
            units = user.organizationalUnitsOfUser;
        }
        if (department.departmentsThatUserIsDean){
            departmentsThatUserIsDean = department.departmentsThatUserIsDean;
        }
        if (user.roledepartments) listRole = user.roledepartments;
        if (user.usercompanys) usercompanys = user.usercompanys;
        if (user.userdepartments) userdepartments = user.userdepartments;

        return (
            <React.Fragment>
                <ButtonModal modalID="modal-add-task-template" button_name={translate('task_template.add')} title="Thêm mới mẫu công việc"/>
                <DialogModal
                    modalID="modal-add-task-template" isLoading={user.isLoading}
                    formID="form-add-task-template"
                    title={"Thêm mẫu công việc"}
                    func={this.handleSubmit}
                    disableSubmit={!this.isTaskTemplateFormValidated()}
                    size={100}
                >
                    <form className="form-horizontal">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className={`form-group ${this.state.newTemplate.errorOnUnit===undefined?"":"has-error"}`}  style={{marginLeft: 0, marginRight: 0}}>
                                    <label className="control-label">Đơn vị*:</label>
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
                                <div className={`form-group ${this.state.newTemplate.errorOnRead===undefined?"":"has-error"}`} style={{ marginLeft: 0, marginRight: 0 }}>
                                    <label className="control-label">Những người được phép xem*</label>
                                    <div>
                                        {listRole &&
                                            <SelectBox
                                                id={`read-select-box`}
                                                className="form-control select2"
                                                style={{width: "100%"}}
                                                items={[
                                                    {value: listRole.dean._id, text: listRole.dean.name},
                                                    {value: listRole.viceDean._id, text: listRole.viceDean.name},
                                                    {value: listRole.employee._id, text: listRole.employee.name},
                                                ]}
                                                onChange={this.handleTaskTemplateRead}
                                                multiple={true}
                                                options={{placeholder: "Chọn người được phép xem mẫu"}}
                                            />
                                        }
                                        <ErrorLabel content={this.state.newTemplate.errorOnRead}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-6">
                                <div className={`form-group ${this.state.newTemplate.errorOnName===undefined?"":"has-error"}`} style={{ marginLeft: 0, marginRight: 0 }}>
                                    <label className="control-label">Tên mẫu*</label>
                                    <div>
                                        <input type="Name" className="form-control" placeholder="Tên mẫu công việc" value={newTemplate.name} onChange={this.handleTaskTemplateName} />
                                        <ErrorLabel content={this.state.newTemplate.errorOnName}/>
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginLeft: 0, marginRight: 0 }}>
                                    <label className="control-label">Mức độ ưu tiên</label>
                                    <select className="form-control" value={newTemplate.priority} onChange={this.handleChangeTaskPriority}>
                                        <option value={3}>Cao</option>
                                        <option value={2}>Trung bình</option>
                                        <option value={1}>Thấp</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className={`form-group ${this.state.newTemplate.errorOnDescription===undefined?"":"has-error"}`} style={{ marginLeft: 0, marginRight: 0 }}>
                                    <label className="control-label" htmlFor="inputDescriptionTaskTemplate" style={{ width: '100%', textAlign: 'left' }}>Mô tả công việc*</label>
                                    <div>
                                        <textarea rows={5} type="Description" className="form-control" id="inputDescriptionTaskTemplate" name="description" placeholder="Mô tả công việc" value={newTemplate.description} onChange={this.handleTaskTemplateDesc} />
                                        <ErrorLabel content={this.state.newTemplate.errorOnDescription}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-sm-6">
                                <div className='form-group' style={{ marginLeft: 0, marginRight: 0 }}>
                                    <label className="control-label">Người thực hiện</label>
                                    
                                    {userdepartments &&
                                        <SelectBox
                                            id={`responsible-select-box`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items={[
                                                {
                                                    text: userdepartments[1].roleId.name,
                                                    value: [{text: userdepartments[1].userId.name, value: userdepartments[1].userId._id}]
                                                },
                                                {
                                                    text: userdepartments[2].roleId.name,
                                                    value: [{text: userdepartments[2].userId.name, value: userdepartments[2].userId._id}]
                                                },
                                            ]}
                                            onChange={this.handleTaskTemplateResponsible}
                                            multiple={true}
                                            options={{placeholder: "Chọn người thực hiện"}}
                                        />
                                    }
                                </div>
                                <div className='form-group' style={{ marginLeft: 0, marginRight: 0 }}>
                                    <label className="control-label">Người phê duyệt</label>
                                    {userdepartments &&
                                        <SelectBox
                                            id={`accounatable-select-box`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items={[
                                                {
                                                    text: userdepartments[0].roleId.name,
                                                    value: [{text: userdepartments[0].userId.name, value: userdepartments[0].userId._id}]
                                                },
                                                {
                                                    text: userdepartments[1].roleId.name,
                                                    value: [{text: userdepartments[1].userId.name, value: userdepartments[1].userId._id}]
                                                },
                                            ]}
                                            onChange={this.handleTaskTemplateAccountable}
                                            multiple={true}
                                            options={{placeholder: "Chọn người phê duyệt"}}
                                        />
                                    }
                                </div>
                                <div className='form-group' style={{ marginLeft: 0, marginRight: 0 }}>
                                    <label className="ontrol-label">Người hỗ trợ</label>
                                    {usercompanys &&
                                        <SelectBox
                                            id={`consulted-select-box`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items={
                                                usercompanys.map(x => {
                                                    return {value: x._id, text: x.name};
                                                })
                                            }
                                            onChange={this.handleTaskTemplateConsult}
                                            multiple={true}
                                            options={{placeholder: "Chọn người hỗ trợ"}}
                                        />
                                    }
                                </div>
                                <div className='form-group' style={{ marginLeft: 0, marginRight: 0 }}>
                                    <label className="control-label">Người quan sát</label>
                                    {usercompanys &&
                                        <SelectBox
                                            id={`informed-select-box`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items={
                                                usercompanys.map(x => {
                                                    return {value: x._id, text: x.name};
                                                })
                                            }
                                            onChange={this.handleTaskTemplateInform}
                                            multiple={true}
                                            options={{placeholder: "Chọn người quan sát"}}
                                        />
                                    }
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className={`form-group ${this.state.newTemplate.errorOnFormula===undefined?"":"has-error"}`} style={{ marginLeft: 0, marginRight: 0 }}>
                                    <label className="control-label" htmlFor="inputFormula">Công thức tính điểm KPI công việc*</label>
                                    <div>
                                        <input type="text" className="form-control" id="inputFormula" placeholder="100*(1-(p1/p2)-(p3/p4)-(d0/d)-(ad/a))" value={newTemplate.formula} onChange={this.handleTaskTemplateFormula} />
                                        <ErrorLabel content={this.state.newTemplate.errorOnFormula}/>
                                    </div>
                                    
                                    <label className="control-label" style={{ width: '100%', textAlign: 'left' }}>Trong công thức có thể dùng thêm các tham số tự động sau:</label>
                                    <label className="col-xs-12" style={{ fontWeight: "400" }}>D: Tổng số ngày thực hiện công việc (trừ CN)</label>
                                    <label className="col-xs-12"  style={{ fontWeight: "400" }}>D0: Số ngày quá hạn</label>
                                    <label className="col-xs-12"  style={{ fontWeight: "400" }}>A: Tổng số hoạt động</label>
                                    <label className="col-xs-12"  style={{ fontWeight: "400" }}>AD: Tổng số lần duyệt "Chưa đạt" cho các hoạt động</label>
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
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { department, user } = state;
    const adding = state.tasktemplates;
    return { adding, department, user };
}

const actionCreators = {
    addNewTemplate: taskTemplateActions.addTaskTemplate,
    getDepartment: UserActions.getDepartmentOfUser,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getDepartmentsThatUserIsDean: DepartmentActions.getDepartmentsThatUserIsDean,
};
const connectedModalAddTaskTemplate = connect(mapState, actionCreators)(withTranslate(ModalAddTaskTemplate));
export { connectedModalAddTaskTemplate as ModalAddTaskTemplate };