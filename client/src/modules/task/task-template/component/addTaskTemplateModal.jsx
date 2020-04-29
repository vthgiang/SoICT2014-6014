import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import  {taskTemplateActions} from '../redux/actions';
import { TaskTemplateFormValidator} from './taskTemplateFormValidator';
import Sortable from 'sortablejs';

import {InformationTemplate} from '../component/informationsTemplate';
import {ActionTemplate} from '../component/actionsTemplate';

import {SelectBox, ErrorLabel} from '../../../../common-components';
import './tasktemplate.css';

class ModalAddTaskTemplate extends Component {
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
                taskActions: [],
                taskInformations: []
            },

            currentRole: localStorage.getItem('currentRole'),
        };

        this.handleSubmit = this.handleSubmit.bind(this);
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
        return msg == undefined;
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
        return msg == undefined;
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
        return msg == undefined;
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
                        unit: value,
                        errorOnUnit: msg,
                        read: [],
                        responsible: [],
                        accounatable: [],
                        consulted: [],
                        informed: [],
                    }
                };
            });
        }
        return msg == undefined;
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
        return msg == undefined;
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
        window.$("#addTaskTemplate").modal("hide");
    }

    
    handleAction =(data) =>{
        //event.preventDefault(); // Ngăn không submit
        let { newTemplate } = this.state;
        this.setState(state => {
            
            return {
                ...state,
                newTemplate: {
                    ...newTemplate,
                    taskActions: data
                },
                //action: Object.assign({}, state.EMPTY_ACTION),
            }
        })
        console.log("+++++++++++++++++++",this.state);
    
    }
    handleInformation =(data)=>{
        //event.preventDefault(); // Ngăn không submit
        let { newTemplate } = this.state;
        this.setState(state => {
            
            return {
                ...state,
                newTemplate: {
                    ...newTemplate,
                    taskInformations: data
                },
                //action: Object.assign({}, state.EMPTY_ACTION),
            }
        })
        console.log("+++++++++++++++++++",this.state);
    }

    render() {
        var units, currentUnit, taskActions, taskInformations, listRole, usercompanys, userdepartments, departmentsThatUserIsDean;
        const { newTemplate, submitted, action, information } = this.state;
        const { department, user } = this.props;
        if (newTemplate.taskActions) taskActions = newTemplate.taskActions;
        if (newTemplate.taskInformations) taskInformations = newTemplate.taskInformations;
        
        if (department.unitofuser) {
            units = department.unitofuser;
            currentUnit = units.find(item =>
                item.dean === this.state.currentRole
                || item.viceDean === this.state.currentRole
                || item.employee === this.state.currentRole);

            if (newTemplate.organizationalUnit === ""){
                newTemplate.organizationalUnit = currentUnit._id; // Khởi tạo state lưu giá trị Unit Select Box
            }
        }
        if (department.departmentsThatUserIsDean){
            departmentsThatUserIsDean = department.departmentsThatUserIsDean;
        }
        if (user.roledepartments) listRole = user.roledepartments;
        if (user.usercompanys) usercompanys = user.usercompanys;
        if (user.userdepartments) userdepartments = user.userdepartments;
        return (
            <div className="modal modal-full fade" id="addTaskTemplate" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog-full">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">×</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <h3 className="modal-title" id="myModalLabel">Thêm mẫu công việc</h3>
                        </div>
                        {/* Modal Body */}
                        <div className="modal-body" >
                            <form className="form-horizontal">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className={'form-group has-feedback' + (submitted && newTemplate.organizationalUnit==="" ? ' has-error' : '')}>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Đơn vị*:</label>
                                            <div className={`col-sm-10 form-group ${this.state.newTemplate.errorOnUnit===undefined?"":"has-error"}`} style={{ width: '100%', marginLeft: "0px" }}>
                                                {departmentsThatUserIsDean !== undefined && currentUnit !== undefined &&
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
                                                        value={currentUnit._id}
                                                    />
                                                }
                                                <ErrorLabel content={this.state.newTemplate.errorOnUnit}/>
                                            </div>
                                            {submitted && newTemplate.organizationalUnit === "" &&
                                                <div className="col-sm-4 help-block">Hãy chọn đơn vị quản lý mẫu</div>
                                            }
                                        </div>
                                        <div className={'form-group has-feedback' + (submitted && !newTemplate.name ? ' has-error' : '')}>
                                            <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Tên mẫu*</label>
                                            <div className={`col-sm-10 form-group ${this.state.newTemplate.errorOnName===undefined?"":"has-error"}`} style={{ width: '100%', marginLeft: "0px" }}>
                                                <input type="Name" className="form-control" placeholder="Tên mẫu công việc" value={newTemplate.name} onChange={this.handleTaskTemplateName} />
                                                <ErrorLabel content={this.state.newTemplate.errorOnName}/>
                                            </div>
                                        </div>
                                        <div className={'form-group has-feedback' + (submitted && newTemplate.readByEmployees === [] ? ' has-error' : '')}>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Những người được phép xem*</label>
                                            <div className={`col-sm-10 form-group ${this.state.newTemplate.errorOnRead===undefined?"":"has-error"}`} style={{ width: '100%', marginLeft: "0px" }}>
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
                                            {submitted && newTemplate.readByEmployees === "" &&
                                                <div className="col-sm-4 help-block">Hãy phân quyền những người được xem mẫu này</div>
                                            }
                                        </div>
                                        <div className='form-group has-feedback'>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người thực hiện</label>
                                            <div className="col-sm-10" style={{ width: '100%' }}>
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
                                        </div>
                                        <div className='form-group has-feedback'>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người phê duyệt</label>
                                            <div className="col-sm-10" style={{ width: '100%' }}>
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
                                        </div>
                                        <div className='form-group has-feedback'>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người hỗ trợ</label>
                                            <div className="col-sm-10" style={{ width: '100%' }}>
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
                                        </div>
                                        <div className='form-group has-feedback'>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người quan sát</label>
                                            <div className="col-sm-10" style={{ width: '100%' }}>
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
                                        <ActionTemplate  taskAction ={taskActions} handleAction={this.handleAction} />
                                    </div>
                                    <div className="col-sm-6">
                                        <div className={'form-group has-feedback' + (submitted && !newTemplate.description ? ' has-error' : '')}>
                                            <label className="col-sm-4 control-label" htmlFor="inputDescriptionTaskTemplate" style={{ width: '100%', textAlign: 'left' }}>Mô tả công việc*</label>
                                            <div className={`col-sm-10 form-group ${this.state.newTemplate.errorOnDescription===undefined?"":"has-error"}`} style={{ width: '100%', marginLeft: "0px" }}>
                                                <textarea type="Description" className="form-control" id="inputDescriptionTaskTemplate" name="description" placeholder="Mô tả công việc" value={newTemplate.description} onChange={this.handleTaskTemplateDesc} />
                                                <ErrorLabel content={this.state.newTemplate.errorOnDescription}/>
                                            </div>
                                        </div>
                                        <div className={'form-group has-feedback' + (submitted && !newTemplate.formula ? ' has-error' : '')}>
                                            <label className="col-sm-4 control-label" htmlFor="inputFormula" style={{ width: '100%', textAlign: 'left' }}>Công thức tính điểm KPI công việc*</label>
                                            <div className={`col-sm-10 form-group ${this.state.newTemplate.errorOnFormula===undefined?"":"has-error"}`} style={{ width: '100%', marginLeft: "0px" }}>
                                                <input type="text" className="form-control" id="inputFormula" placeholder="100*(1-(p1/p2)-(p3/p4)-(d0/d)-(ad/a))" value={newTemplate.formula} onChange={this.handleTaskTemplateFormula} />
                                                <ErrorLabel content={this.state.newTemplate.errorOnFormula}/>
                                            </div>
                                            
                                            <label className="col-sm-12 control-label" style={{ width: '100%', textAlign: 'left' }}>Trong công thức có thể dùng thêm các tham số tự động sau:</label>
                                            <label className="col-sm-12" style={{ fontWeight: "400" }}>D: Tổng số ngày thực hiện công việc (trừ CN)</label>
                                            <label className="col-sm-12" style={{ fontWeight: "400" }}>D0: Số ngày quá hạn</label>
                                            <label className="col-sm-12" style={{ fontWeight: "400" }}>A: Tổng số hoạt động</label>
                                            <label className="col-sm-12" style={{ fontWeight: "400" }}>AD: Tổng số lần duyệt "Chưa đạt" cho các hoạt động</label>
                                        </div>
                                    <InformationTemplate informationsTemplate ={taskInformations} handleInformation={this.handleInformation}/>


                                        
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success" disabled={!this.isTaskTemplateFormValidated()} onClick={this.handleSubmit}>Lưu</button>
                        </div>
                        {/* Modal Footer */}
                    </div>
                </div>
            </div >
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
    getDepartment: DepartmentActions.getDepartmentOfUser,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getDepartmentsThatUserIsDean: DepartmentActions.getDepartmentsThatUserIsDean,
};
const connectedModalAddTaskTemplate = connect(mapState, actionCreators)(ModalAddTaskTemplate);
export { connectedModalAddTaskTemplate as ModalAddTaskTemplate };