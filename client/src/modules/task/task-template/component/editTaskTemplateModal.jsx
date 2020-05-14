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
                creator: '',
                formula: '',
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
                errorOnUnit:undefined
            } 
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        console.log("SHOULD*****",nextProps.tasktemplates.template, this.props.tasktemplates.template)
        if (nextProps.taskTemplateId !== this.state.taskTemplateId) {
            console.log("GUI............")
            this.props.getTaskTemplate(nextProps.taskTemplateId); // Gửi truy vấn lấy dữ liệu
        }

        let newDataArrived = nextProps.tasktemplates.template !== undefined && nextProps.tasktemplates.template !== null;
        newDataArrived = newDataArrived && (nextProps.tasktemplates.template !== this.props.tasktemplates.template);

        if (newDataArrived){ // Dữ liệu đã về, bind vào prop
            console.log("VE............")
            this.setState(state =>{
                return {
                    ...state,
                    editingTemplate: nextProps.tasktemplates.template.info,
                };
            });
        }

        return true;
    }
  
    // static getDerivedStateFromProps(nextProps, prevState){
    //     if (nextProps.id !== prevState.id) {
    //         return {
    //             ...prevState,
    //             id: nextProps.id,
    //             editingTemplate:    nextProps.taskTemplate,
    //         } 
    //     } else {
    //         return null;
    //     }
    // }
    
    /**
     * Xử lý form lớn tasktemplate
     */
    isTaskTemplateFormValidated = () => {

        let result = 
            this.validateTaskTemplateRead(this.state.editingTemplate.readByEmployees, false) &&
            this.validateTaskTemplateName(this.state.editingTemplate.name, false) &&
            this.validateTaskTemplateDesc(this.state.editingTemplate.description, false) &&
            this.validateTaskTemplateFormula(this.state.editingTemplate.formula, false) &&
            this.validateTaskTemplateUnit(this.state.editingTemplate.organizationalUnit._id, false) ;
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
    
    
    handleCloseModal = (id) => {
        var modal = document.getElementById(`editTaskTemplate${id}`);
        modal.classList.remove("in");
        modal.style = "display: none;";
    }
    // Submit new template in data
    handleSubmit = async (event) => {
        const { editingTemplate } = this.state;
  
        this.props.editTaskTemplate(this.state.id,editingTemplate);

        this.handleCloseModal(this.props.id);
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
        var units, currentUnit, taskActions, taskInformations, listRole, usercompanys, userdepartments, departmentsThatUserIsDean;
        var { editingTemplate, submitted} = this.state;
  
        const { department, user,translate } = this.props;
        if (editingTemplate.taskActions) taskActions = editingTemplate.taskActions;
        if (editingTemplate.taskInformations) taskInformations = editingTemplate.taskInformations;
        
        if (user.organizationalUnitsOfUser) {
            units = user.organizationalUnitsOfUser;
            currentUnit = editingTemplate.organizationalUnit
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
                <form className="form-horizontal">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className={'form-group has-feedback' + (submitted && editingTemplate.organizationalUnit==="" ? ' has-error' : '')}>
                                <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Đơn vị*:</label>
                                <div className={`col-sm-10 form-group ${this.state.editingTemplate.errorOnUnit===undefined?"":"has-error"}`} style={{ width: '100%', marginLeft: "0px" }}>
                                    {departmentsThatUserIsDean !== undefined && currentUnit !== undefined &&
                                        <SelectBox
                                            id={`unit-select-box-edit`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items={
                                                departmentsThatUserIsDean.map(x => {
                                                    return {value: x._id, text: x.name};
                                                })
                                            }
                                            onChange={this.handleTaskTemplateUnit}
                                            value = {currentUnit._id} ////////////////////////////
                                            multiple={false}

                                        />
                                    }
                                    <ErrorLabel content={this.state.editingTemplate.errorOnUnit}/>
                                </div>
                                {submitted && editingTemplate.organizationalUnit === "" &&
                                    <div className="col-sm-4 help-block">Hãy chọn đơn vị quản lý mẫu</div>
                                }
                            </div>
                            <div className={'form-group has-feedback' + (submitted && !editingTemplate.name ? ' has-error' : '')}>
                                <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Tên mẫu*</label>
                                <div className={`col-sm-10 form-group ${this.state.editingTemplate.errorOnName===undefined?"":"has-error"}`} style={{ width: '100%', marginLeft: "0px" }}>
                                    <input type="Name" className="form-control" placeholder="Tên mẫu công việc" defaultValue ={editingTemplate.name} onChange={this.handleTaskTemplateName} />
                                    <ErrorLabel content={this.state.editingTemplate.errorOnName}/>
                                </div>
                            </div>
                            <div className={'form-group has-feedback' + (submitted && editingTemplate.readByEmployees === [] ? ' has-error' : '')}>
                                <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Những người được phép xem*</label>
                                <div className={`col-sm-10 form-group ${this.state.editingTemplate.errorOnRead===undefined?"":"has-error"}`} style={{ width: '100%', marginLeft: "0px" }}>
                                    {listRole &&
                                        <SelectBox
                                            id={`edit-read-select-box`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items={[
                                                {value: listRole.dean._id, text: listRole.dean.name},
                                                {value: listRole.viceDean._id, text: listRole.viceDean.name},
                                                {value: listRole.employee._id, text: listRole.employee.name},
                                            ]}
                                            onChange={this.handleTaskTemplateRead}
                                            value={editingTemplate.readByEmployees.map(item => {
                                                    return item._id;
                                                })
                                            }
                                            multiple={true}
                                            options={{placeholder: "Chọn người được phép xem mẫu"}}
                                        />
                                    }
                                    <ErrorLabel content={this.state.editingTemplate.errorOnRead}/>
                                </div>
                                {submitted && editingTemplate.readByEmployees === "" &&
                                    <div className="col-sm-4 help-block">Hãy phân quyền những người được xem mẫu này</div>
                                }
                            </div>
                            <div className='form-group has-feedback'>
                                <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người thực hiện</label>
                                <div className="col-sm-10" style={{ width: '100%' }}>
                                    {userdepartments &&
                                        <SelectBox
                                            id={`edit-responsible-select-box`}
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
                            </div>
                            <div className='form-group has-feedback'>
                                <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người phê duyệt</label>
                                <div className="col-sm-10" style={{ width: '100%' }}>
                                    {userdepartments &&
                                        <SelectBox
                                            id={`edit-accounatable-select-box`}
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
                            </div>
                            <div className='form-group has-feedback'>
                                <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người hỗ trợ</label>
                                <div className="col-sm-10" style={{ width: '100%' }}>
                                    {usercompanys &&
                                        <SelectBox
                                            id={`edit-consulted-select-box`}
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
                            </div>
                            <div className='form-group has-feedback'>
                                <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người quan sát</label>
                                <div className="col-sm-10" style={{ width: '100%' }}>
                                    {usercompanys &&
                                        <SelectBox
                                            id={`edit-informed-select-box`}
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
                            <ActionForm  initialData ={editingTemplate.taskActions} onDataChange={this.handleTaskActionsChange} />
                        </div>

                        <div className="col-sm-6">
                            <div className={'form-group has-feedback' + (submitted && !editingTemplate.description ? ' has-error' : '')}>
                                <label className="col-sm-4 control-label" htmlFor="inputDescriptionTaskTemplate" style={{ width: '100%', textAlign: 'left' }}>Mô tả công việc*</label>
                                <div className={`col-sm-10 form-group ${this.state.editingTemplate.errorOnDescription===undefined?"":"has-error"}`} style={{ width: '100%', marginLeft: "0px" }}>
                                    <textarea type="Description" className="form-control" id="inputDescriptionTaskTemplate" name="description" placeholder="Mô tả công việc" defaultValue={editingTemplate.description} onChange={this.handleTaskTemplateDesc} />
                                    <ErrorLabel content={this.state.editingTemplate.errorOnDescription}/>
                                </div>
                            </div>
                            <div className={'form-group has-feedback' + (submitted && !editingTemplate.formula ? ' has-error' : '')}>
                                <label className="col-sm-4 control-label" htmlFor="inputFormula" style={{ width: '100%', textAlign: 'left' }}>Công thức tính điểm KPI công việc*</label>
                                <div className={`col-sm-10 form-group ${this.state.editingTemplate.errorOnFormula===undefined?"":"has-error"}`} style={{ width: '100%', marginLeft: "0px" }}>
                                    <input type="text" className="form-control" id="inputFormula" placeholder="100*(1-(p1/p2)-(p3/p4)-(d0/d)-(ad/a))" defaultValue={editingTemplate.formula} onChange={this.handleTaskTemplateFormula} />
                                    <ErrorLabel content={this.state.editingTemplate.errorOnFormula}/>
                                </div>
                                
                                <label className="col-sm-12 control-label" style={{ width: '100%', textAlign: 'left' }}>Trong công thức có thể dùng thêm các tham số tự động sau:</label>
                                <label className="col-sm-12" style={{ fontWeight: "400" }}>D: Tổng số ngày thực hiện công việc (trừ CN)</label>
                                <label className="col-sm-12" style={{ fontWeight: "400" }}>D0: Số ngày quá hạn</label>
                                <label className="col-sm-12" style={{ fontWeight: "400" }}>A: Tổng số hoạt động</label>
                                <label className="col-sm-12" style={{ fontWeight: "400" }}>AD: Tổng số lần duyệt "Chưa đạt" cho các hoạt động</label>
                            </div>
                            <div className="col-sm-6" style={{ marginTop: "15px" }} >
                                <div className="box box-primary" style={{ borderTop: "-15px", paddingLeft: "15px",paddingBottom: "5px" }}>
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <div className='form-group' style={{ marginTop: "5px" }}>
                                                <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>{translate('task_template.information_list')} </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="control-group" style={{ marginLeft: "-5px" }}>

                                        {/* <ol>{
                                            (typeof template__________ === 'undefined' || editingTemplate.taskInformations.length === 0) ? <p style={{ color: 'red', textAlign: 'left' }}>{translate('task_template.no_data')}</p> :
                                                template__________.taskInformations.map((item, index) =>
                                                    <li style={{ textAlign: 'left' }}>{item.name} - Kiểu {item.type} {item.filledByAccountableEmployeesOnly ? "- Chỉ quản lý được điền" : ""}<p>Mô tả: {item.description}</p></li>
                                                )
                                        }
                                        </ol> */}
                                    </div>
                                </div>
                            </div>   
                        </div>
                    </div>
                </form>

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