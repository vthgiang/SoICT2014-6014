import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import  {taskTemplateActions} from '../redux/actions';
import { TaskTemplateFormValidator} from './taskTemplateFormValidator';
import { withTranslate } from 'react-redux-multilingual';
import {ActionForm} from '../component/actionsTemplate';

import {DialogModal, SelectBox, ErrorLabel} from '../../../../common-components';
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
                priority:3,
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
        // Lấy tất cả nhân viên của phòng ban
        // this.props.getAllUserOfDepartment();
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        // Lấy tất cả vai trò cùng phòng ban
        this.props.getRoleSameDepartment(localStorage.getItem("currentRole"));
        // Lấy tất cả các role là dean 
        this.props.getDepartmentsThatUserIsDean();
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.taskTemplateId !== prevState.taskTemplateId) {
            return {
                ...prevState,
                taskTemplateId: nextProps.taskTemplateId,

                errorOnName: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnDescription:undefined,
                errorOnRead:undefined,
                errorOnFormula:undefined,
                errorOnUnit:undefined,
                showActionForm:undefined              
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
        if (!newDataArrived){
            return false; // Đang lấy dữ liệu, không cần render
        }
        if (this.props.tasktemplates.taskTemplate){
            newDataArrived = newDataArrived && (nextProps.tasktemplates.taskTemplate._id !== this.props.tasktemplates.taskTemplate._id);
        }
        if (newDataArrived){ // Dữ liệu đã về vầ được bind vào prop
            let taskTemplate = nextProps.tasktemplates.taskTemplate;
            let editingTemplate = { // Những trường đã populate sẽ bỏ đi, chỉ lấy lại id
                ...taskTemplate,
                organizationalUnit: taskTemplate.organizationalUnit._id,
                accountableEmployees: taskTemplate.accountableEmployees.map(item => item._id),
                consultedEmployees: taskTemplate.consultedEmployees.map(item => item._id),
                informedEmployees: taskTemplate.informedEmployees.map(item => item._id),
                readByEmployees: taskTemplate.readByEmployees.map(item => item._id),
                responsibleEmployees: taskTemplate.responsibleEmployees.map(item => item._id),
            };
            this.setState(state =>{
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
            this.validateTaskTemplateUnit(this.state.editingTemplate.organizationalUnit, false) ;
        return result;
    }
    handleTaskTemplateName = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateName(value, true);
    }
    validateTaskTemplateName = (value, willUpdateState=true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateName(value);

        if (willUpdateState){
            this.state.editingTemplate.name = value;
            this.state.editingTemplate.errorOnName = msg;
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
            this.state.editingTemplate.description = value;
            this.state.editingTemplate.errorOnDescription = msg;
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
            this.state.editingTemplate.formula = value;
            this.state.editingTemplate.errorOnFormula = msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg == undefined;
    }
    handleChangeTaskPriority = (event) => {
        this.state.editingTemplate.priority = event.target.value;
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
    validateTaskTemplateRead = (value, willUpdateState=true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateRead(value);
        
        if (willUpdateState){
            this.state.editingTemplate.readByEmployees = value;
            this.state.editingTemplate.errorOnRead = msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg == undefined;
    }

    handleTaskTemplateResponsible = (value) => {
        this.state.editingTemplate.responsibleEmployees = value;
        
        this.setState(state =>{
            return{
                ...state,              
            };
        });
    }
    handleTaskTemplateAccountable = (value) => {
        this.state.editingTemplate.accountableEmployees = value;
        this.setState(state =>{
            return{
                ...state,
            };
        });
    }
    handleTaskTemplateConsult = (value) => {
        this.state.editingTemplate.consultedEmployees = value;
        this.setState(state =>{
            return{
                ...state,
            };
        });
    }
    handleTaskTemplateInform = (value) => {        
        this.state.editingTemplate.informedEmployees = value;
     
        this.setState(state =>{
            return{
                ...state,
            };
        });
    }
    
    
    // Submit new template in data
    handleSubmit = async (event) => {
        const { editingTemplate } = this.state;
  
        this.props.editTaskTemplate(editingTemplate._id, editingTemplate);
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
        var units, taskActions, taskInformations, listRole, usercompanys, userdepartments, departmentsThatUserIsDean;
        var { editingTemplate } = this.state;
  
        const { department, user,translate } = this.props;
        if (editingTemplate && editingTemplate.taskActions) taskActions = editingTemplate.taskActions;
        if (editingTemplate && editingTemplate.taskInformations) taskInformations = editingTemplate.taskInformations;
        
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
            <DialogModal
                modalID="modal-edit-task-template" isLoading={user.isLoading}
                formID="form-edit-task-template"
                title={"Sửa mẫu công việc"}
                func={this.handleSubmit}
                disableSubmit={!this.isTaskTemplateFormValidated()}
                size={100}
            >
                <div className="row">
                    <div className="col-sm-6">
                        <div className={`form-group ${editingTemplate.errorOnUnit===undefined?"":"has-error"}`} >
                            <label className="control-label">Đơn vị*:</label>
                            {departmentsThatUserIsDean !== undefined && editingTemplate.organizationalUnit !== "" &&
                                <SelectBox
                                    id={`edit-unit-select-box-${editingTemplate._id}`}
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items={
                                        departmentsThatUserIsDean.map(x => {
                                            return {value: x._id, text: x.name};
                                        })
                                    }
                                    onChange={this.handleTaskTemplateUnit}
                                    value = {editingTemplate.organizationalUnit}
                                    multiple={false}

                                />
                            }
                            <ErrorLabel content={this.state.editingTemplate.errorOnUnit}/>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className={`form-group ${this.state.editingTemplate.errorOnRead===undefined?"":"has-error"}`} >
                            <label className="control-label">Những người được phép xem*</label>
                            {listRole && editingTemplate.readByEmployees &&
                                <SelectBox
                                    id={`edit-read-select-box-${editingTemplate._id}`}
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items={[
                                        {value: listRole.dean._id, text: listRole.dean.name},
                                        {value: listRole.viceDean._id, text: listRole.viceDean.name},
                                        {value: listRole.employee._id, text: listRole.employee.name},
                                    ]}
                                    onChange={this.handleTaskTemplateRead}
                                    value={editingTemplate.readByEmployees}
                                    multiple={true}
                                    options={{placeholder: "Chọn người được phép xem mẫu"}}
                                />
                            }
                            <ErrorLabel content={this.state.editingTemplate.errorOnRead}/>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6">
                        <div className={`form-group ${this.state.editingTemplate.errorOnName===undefined?"":"has-error"}`} >
                            <label className="control-label">Tên mẫu*</label>
                            <input type="Name" className="form-control" placeholder="Tên mẫu công việc" value ={editingTemplate.name} onChange={this.handleTaskTemplateName} />
                            <ErrorLabel content={this.state.editingTemplate.errorOnName}/>
                        </div>

                        <div className="form-group" >
                            <label className="control-label">Mức độ ưu tiên</label>
                            <select className="form-control" value={editingTemplate.priority} onChange={this.handleChangeTaskPriority}>
                                <option value={3}>Cao</option>
                                <option value={2}>Trung bình</option>
                                <option value={1}>Thấp</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className={`form-group ${this.state.editingTemplate.errorOnDescription===undefined?"":"has-error"}`} >
                            <label className="control-label" htmlFor="inputDescriptionTaskTemplate">Mô tả công việc*</label>
                            <textarea rows={5} type="Description" className="form-control" id="inputDescriptionTaskTemplate" name="description" placeholder="Mô tả công việc" value={editingTemplate.description} onChange={this.handleTaskTemplateDesc} />
                            <ErrorLabel content={this.state.editingTemplate.errorOnDescription}/>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6">
                        <div className='form-group' >
                            <label className="control-label" >Người thực hiện</label>
                            {userdepartments && editingTemplate.responsibleEmployees &&
                                <SelectBox
                                    id={`edit-responsible-select-box-${editingTemplate._id}`}
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
                                    value={editingTemplate.responsibleEmployees}
                                    multiple={true}
                                    options={{placeholder: "Chọn người thực hiện"}}
                                />
                            }
                        </div>
                        <div className='form-group' >
                            <label className="control-label">Người phê duyệt</label>
                            {userdepartments && editingTemplate.accountableEmployees &&
                                <SelectBox
                                    id={`edit-accounatable-select-box-${editingTemplate._id}`}
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
                                    value ={editingTemplate.accountableEmployees}
                                    multiple={true}
                                    options={{placeholder: "Chọn người phê duyệt"}}
                                />
                            }
                        </div>
                        <div className='form-group' >
                            <label className="control-label">Người hỗ trợ</label>
                            {usercompanys && editingTemplate.consultedEmployees &&
                                <SelectBox
                                    id={`edit-consulted-select-box-${editingTemplate._id}`}
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items={
                                        usercompanys.map(x => {
                                            return {value: x._id, text: x.name};
                                        })
                                    }
                                    onChange={this.handleTaskTemplateConsult}
                                    value ={editingTemplate.consultedEmployees}
                                    multiple={true}
                                    options={{placeholder: "Chọn người hỗ trợ"}}
                                />
                            }
                        </div>
                        <div className='form-group' >
                            <label className="control-label">Người quan sát</label>
                            {usercompanys && editingTemplate.informedEmployees &&
                                <SelectBox
                                    id={`edit-informed-select-box-${editingTemplate._id}`}
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items={
                                        usercompanys.map(x => {
                                            return {value: x._id, text: x.name};
                                        })
                                    }
                                    onChange={this.handleTaskTemplateInform}
                                    multiple={true}
                                    value = {editingTemplate.informedEmployees}
                                    options={{placeholder: "Chọn người quan sát"}}
                                />
                            }
                        </div>                       
                    </div>

                    <div className="col-sm-6">
                        <div className={`form-group ${this.state.editingTemplate.errorOnFormula===undefined?"":"has-error"}`} >
                            <label className="control-label" htmlFor="inputFormula">Công thức tính điểm KPI công việc*</label>
                            <input type="text" className="form-control" id="inputFormula" placeholder="100*(1-(p1/p2)-(p3/p4)-(d0/d)-(ad/a))" value={editingTemplate.formula} onChange={this.handleTaskTemplateFormula} />
                            <ErrorLabel content={this.state.editingTemplate.errorOnFormula}/>
                            
                            <label className="control-label" style={{ width: '100%', textAlign: 'left' }}>Trong công thức có thể dùng thêm các tham số tự động sau:</label>
                            <label className="col-sm-12" style={{ fontWeight: "400" }}>D: Tổng số ngày thực hiện công việc (trừ CN)</label>
                            <label className="col-sm-12" style={{ fontWeight: "400" }}>D0: Số ngày quá hạn</label>
                            <label className="col-sm-12" style={{ fontWeight: "400" }}>A: Tổng số hoạt động</label>
                            <label className="col-sm-12" style={{ fontWeight: "400" }}>AD: Tổng số lần duyệt "Chưa đạt" cho các hoạt động</label>
                        </div>
                    </div>
                </div>


                <div className="row">
                    <div className="col-sm-6">
                        { this.state.showActionForm &&                        
                            <ActionForm initialData ={editingTemplate.taskActions} onDataChange={this.handleTaskActionsChange} /> 
                        }    
                    </div>
                    <div className="col-sm-6">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Danh sách các trường thông tin</legend>
                            {
                                (!editingTemplate.taskInformations || editingTemplate.taskInformations.length === 0)?
                                    <span>{translate('task_template.no_data')}</span>:
                                    editingTemplate.taskInformations.map((item, index) => 
                                        <div style={{paddingBottom: "20px"}} key={index}>
                                            <div>
                                                <label>{item.name} - Kiểu {item.type}</label>
                                                {item.filledByAccountableEmployeesOnly ? "- Chỉ quản lý được điền" : ""}
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
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getDepartmentsThatUserIsDean: DepartmentActions.getDepartmentsThatUserIsDean,
};
const connectedModalEditTaskTemplate = connect(mapState, actionCreators)(withTranslate(ModalEditTaskTemplate));
export { connectedModalEditTaskTemplate as ModalEditTaskTemplate };