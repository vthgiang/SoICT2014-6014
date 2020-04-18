import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DepartmentActions } from '../../super-admin-management/departments-management/redux/actions';
import { UserActions } from '../../super-admin-management/users-management/redux/actions';
import  {taskTemplateActions} from '../redux/actions';
import { TaskTemplateFormValidator} from './TaskTemplateFormValidator';
import Sortable from 'sortablejs';

import {SelectBox, ErrorLabel} from '../../../common-components';
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
        this.props.getRoleDeanOfUser(localStorage.getItem("currentRole"));

        // Load library for sort action table
        this.handleSortable();
    }

    constructor(props) {
        super(props);

        let INFO_TYPE = {
            TEXT: "Văn bản",
            NUMBER: "Số",
            DATE: "Ngày tháng",
            BOOLEAN: "Boolean",
            SET: "Tập giá trị",
        };

        let EMPTY_INFORMATION = {
            name: '',
            description: '',
            type: INFO_TYPE.TEXT,
            extra: '',
            mandatary: false
        };

        let EMPTY_ACTION = {
            name: '',
            description: '',
            mandatary: true,
        };

        this.state = {
            INFO_TYPE: INFO_TYPE,
            EMPTY_INFORMATION: Object.assign({}, EMPTY_INFORMATION),
            information: EMPTY_INFORMATION,
            EMPTY_ACTION: Object.assign({}, EMPTY_ACTION),
            action:  Object.assign({}, EMPTY_ACTION),
            newTemplate: {
                unit: '',
                name: '',
                read: [],
                responsible: [],
                accounatable: [],
                consulted: [],
                informed: [],
                description: '',
                creator: '',
                formula: '',
                listAction: [],
                listInfo: []
            },
            editAction: false,
            addAction: false,
            editInfo: false,
            currentRole: localStorage.getItem('currentRole'),
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Drag and drop item in action table
    handleSortable = () => {
        var el1 = document.getElementById('actions');
        Sortable.create(el1, {
            chosenClass: 'chosen',
            animation: 500,
            onChange: function (evt) {
                window.$('#actions tr').each(function (index) {
                    window.$(this).find('td:nth-child(1)').html(index + 1);
                });
            },
            onEnd: async(evt) => {
                let listAction = this.state.newTemplate.listAction;
                const item = listAction[evt.oldIndex];
                listAction.splice(evt.oldIndex, 1);
                listAction.splice(evt.newIndex, 0, item);
            }, store:{
                /**
                 * Khắc phục lỗi với thư viện Sortable. Chi tiết lỗi như sau:
                 * Khi lưu thứ tự sắp xếp mới vào state, do state thay đổi, react render lại.
                 * Sortable phát hiện cấu trúc DOM thay đổi nên tự động thay đổi trở lại thứ tự các phần tử
                 * Kết quả: thứ tự trong State lưu một đằng, giao diện hiển thị thể hiện một nẻo
                 **/ 
                set: (sortable) => {
                    let state = this.state;
                    state.keyPrefix = Math.random(); // force react to destroy children
                    state.order = sortable.toArray();
                    this.setState({
                        ...state
                    })
                } 
            }
        });
        var el2 = document.getElementById('informations');
        Sortable.create(el2, {
            chosenClass: 'chosen',
            animation: 500,
            onChange: async(evt) => {
                window.$('#informations tr').each(function (index) {
                    window.$(this).find('td:nth-child(1)').html(index + 1);
                });
            },
            onEnd: async(evt) => {
                let listInfo = this.state.newTemplate.listInfo;
                const item = listInfo[evt.oldIndex];
                listInfo.splice(evt.oldIndex, 1);
                listInfo.splice(evt.newIndex, 0, item);
            }, store:{
                /**
                 * Khắc phục lỗi với thư viện Sortable. Chi tiết lỗi như sau:
                 * Khi lưu thứ tự sắp xếp mới vào state, do state thay đổi, react render lại.
                 * Sortable phát hiện cấu trúc DOM thay đổi nên tự động thay đổi trở lại thứ tự các phần tử
                 * Kết quả: thứ tự trong State lưu một đằng, giao diện hiển thị thể hiện một nẻo
                 **/ 
                set: (sortable) => {
                    let state = this.state;
                    state.keyPrefix = Math.random(); // force react to destroy children
                    state.order = sortable.toArray();
                    this.setState({
                        ...state
                    })
                } 
            }
        });
    }


    
    
    
    /**
     * Xử lý form lớn tasktemplate
     */
    isTaskTemplateFormValidated = () => {
        let result = 
            this.validateTaskTemplateUnit(this.state.newTemplate.unit, false) &&
            this.validateTaskTemplateRead(this.state.newTemplate.read, false) &&
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
        console.log(value);
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
        this.validateTaskTemplateUnit(value[0], true); // Single selection
    }
    validateTaskTemplateUnit = (value, willUpdateState=true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateUnit(value);

        if (willUpdateState){
            this.state.newTemplate.unit = value;
            this.state.newTemplate.errorOnUnit = msg;
            this.setState(state =>{
                return{
                    ...state,
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
            this.state.newTemplate.read = value;
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
        this.state.newTemplate.responsible = value;
        this.setState(state =>{
            return{
                ...state,
            };
        });
    }
    handleTaskTemplateAccountable = (value) => {
        this.state.newTemplate.accounatable = value;
        this.setState(state =>{
            return{
                ...state,
            };
        });
    }
    handleTaskTemplateConsult = (value) => {
        this.state.newTemplate.consulted = value;
        this.setState(state =>{
            return{
                ...state,
            };
        });
    }
    handleTaskTemplateInform = (value) => {
        this.state.newTemplate.informed = value;
        this.setState(state =>{
            return{
                ...state,
            };
        });
    }






    /**
     * Submit và clear form
     */
    // function: reset all data fields
    handleCancel = (event) => {
        event.preventDefault(); // Ngăn không submit
        this.handleClearInformation(event);
        this.handleClearAction(event);
        this.setState(state => {
            return {
                ...state,
                newTemplate: {
                    name: '',
                    read: [localStorage.getItem('currentRole')],
                    responsible: [],
                    accounatable: [],
                    informed: [],
                    description: '',
                    creator: localStorage.getItem('id'),
                    formula: '',
                    listAction: [],
                    listInfo: []
                },
                submitted: false,
                editAction: false,
                addAction: false,
                editInfo: false,
            }

        })
    }

    // Submit new template in data
    handleSubmit = async (event) => {
        const { newTemplate } = this.state;
        this.props.addNewTemplate(newTemplate);
        window.$("#addTaskTemplate").modal("hide");
    }




    handleCancelEditAction = (event) => {
        event.preventDefault(); // Ngăn không submit

        this.setState(state => {
            return {
                ...state,
                editAction: false,
                action: Object.assign({}, state.EMPTY_ACTION),
            }
        })
    }

    // function: reset all data fields of action table
    handleClearAction = (event) => {
        event.preventDefault(); // Ngăn không submit

        this.setState(state => {
            return {
                ...state,
                action: Object.assign({}, state.EMPTY_ACTION),
            }
        })
    }

    // function add action of template
    handleAddAction = (event) => {
        event.preventDefault(); // Ngăn không submit
        let { newTemplate } = this.state;
        this.setState(state => {
            const listAction = [...newTemplate.listAction, state.action]
            return {
                ...state,
                newTemplate: {
                    ...newTemplate,
                    listAction
                },
                action: Object.assign({}, state.EMPTY_ACTION),
            }
        })
    }

    // function edit item in action table
    handleEditAction = (action, index) => {
        this.setState(state => {
            return {
                ...state,
                editAction: true,
                indexAction: index,
                action: Object.assign({}, action),
            }
        });
    }

    // Save new data after edit action
    handleSaveEditedAction = (event) => {
        event.preventDefault(); // Ngăn không submit
        
        const { indexAction } = this.state;
        let { listAction } = this.state.newTemplate;
        var newList;
        if (listAction) {
            newList = listAction.map((item, index) => {
                return (index === indexAction) ? this.state.action : item;
            })
        }
        this.setState(state => {
            return {
                ...state,
                newTemplate: {
                    ...(this.state.newTemplate),
                    listAction: newList
                },
                editAction: false,
                action: Object.assign({}, state.EMPTY_ACTION),
            }
        })
    }

    // delete action in action table
    handleDeleteAction = (index) => {
        let { listAction } = this.state.newTemplate;
        var newList;
        if (listAction) {
            newList = listAction.filter((item, x) => index !== x);
        }
        this.setState(state => {
            return {
                ...state,
                newTemplate: {
                    ...(this.state.newTemplate),
                    listAction: newList
                },
            }
        })
    }

    // Edit information in information table
    editInformation = async (information, index) => {
        this.setState((state)=> {
            return {
                ...state,
                editInfo: true,
                indexInfo: index,
                information: Object.assign({}, information),
            }
        });
    }

    // Save new data after edit information in information table
    saveEditedInformation = (event) => {
        event.preventDefault(); // Ngăn không submit

        const { indexInfo } = this.state;
        
        let { listInfo } = this.state.newTemplate;
        var newListInfo;
        if (listInfo) {
            newListInfo = listInfo.map((item, index) => {
                return (index === indexInfo) ? this.state.information : item;
            })
        }
        this.setState(state => {
            return {
                ...state,
                newTemplate: {
                    ...(this.state.newTemplate),
                    listInfo: newListInfo
                },
                editInfo: false,
                information: Object.assign({}, state.EMPTY_INFORMATION),
            }
        })
    }

    handleCancelEditInformation = (event) => {
        event.preventDefault(); // Ngăn không submit

        this.setState(state => {
            return {
                ...state,
                editInfo: false,
                information: Object.assign({}, state.EMPTY_INFORMATION),
            }
        })
    }
    
    // function: reset all data fields of information table
    handleClearInformation = (event) => {
        event.preventDefault(); // Ngăn không submit

        this.setState(state => {
            return {
                ...state,
                information: Object.assign({}, state.EMPTY_INFORMATION),
            }
        })
    }

    // delete item in information table
    deleteInfo = (index) => {
        let { listInfo } = this.state.newTemplate;
        var newListInfo;
        if (listInfo) {
            newListInfo = listInfo.filter((item, x) => index !== x);
        }
        this.setState(state => {
            return {
                ...state,
                newTemplate: {
                    ...(this.state.newTemplate),
                    listInfo: newListInfo
                }
            }
        })
    }

    // add new information in information table
    addInfo = (event) => {
        event.preventDefault(); // Ngăn không submit

        let { newTemplate } = this.state;
        this.setState(state => {
            const listInfo = [...(newTemplate.listInfo), state.information];
            return {
                newTemplate: {
                    ...newTemplate,
                    listInfo
                },
                information: Object.assign({}, state.EMPTY_INFORMATION),
            }
        })
    }
    

    





    /**
     * Bộ xử lý cho Action Form 
    **/
    isActionFormValidated = () => {
        let result = 
            this.validateActionName(this.state.action.name, false) &&
            this.validateActionDesc(this.state.action.description, false);
        return result;
    }

    handleChangeActionName = (event) => {
        let value = event.target.value;
        this.validateActionName(value, true);
    }
    validateActionName = (value, willUpdateState=true) => {
        let msg = TaskTemplateFormValidator.validateActionName(value);

        if (willUpdateState){
            this.state.action.name = value;
            this.state.action.errorOnName = msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg == undefined;
    }

    handleChangeActionDesc = (event) => {
        let value = event.target.value;
        this.validateActionDesc(value, true);
    }
    validateActionDesc = (value, willUpdateState=true) => {
        let msg = TaskTemplateFormValidator.validateActionDescription(value);

        if (willUpdateState){
            this.state.action.description = value;
            this.state.action.errorOnDescription = msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg == undefined;
    }

    handleChangeActionMandatory= (event) => {
        let value = event.target.checked;
        this.state.action.mandatary = value;
        this.setState(state =>{
            return{
                ...state
            };
        });
    }





    /**
     * Bộ xử lý cho Information Form 
    **/
    isInfoFormValidated = () => {
        let result = 
            this.validateInfoName(this.state.information.name, false) &&
            this.validateInfoDesc(this.state.information.description, false) &&
            (this.state.information.type !== this.state.INFO_TYPE.SET ||
                (this.state.information.type === this.state.INFO_TYPE.SET && 
                    this.validateInfoSetOfValues(this.state.information.extra, false))
            );
        return result;
    }

    handleChangeInfoName = (event) => {
        let value = event.target.value;
        this.validateInfoName(value, true);
    }
    validateInfoName = (value, willUpdateState=true) => {
        let msg = TaskTemplateFormValidator.validateInfoName(value);

        if (willUpdateState){
            this.state.information.name = value;
            this.state.information.errorOnName = msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg == undefined;
    }

    handleChangeInfoDesc = (event) => {
        let value = event.target.value;
        this.validateInfoDesc(value, true);
    }
    validateInfoDesc = (value, willUpdateState=true) => {
        let msg = TaskTemplateFormValidator.validateInfoDescription(value);

        if (willUpdateState){
            this.state.information.description = value;
            this.state.information.errorOnDescription = msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg == undefined;
    }

    //function: show selection input
    handleChangeInfoType = (event) => { 
        let value = event.target.value;
        this.state.information.type = value;
        this.setState(state =>{
            return{
                ...state
            };
        });
    }

    handleChangeInfoSetOfValues = (event) => {
        let value = event.target.value;
        this.validateInfoSetOfValues(value);
    }
    validateInfoSetOfValues = (value, willUpdateState=true) => {
        let msg = TaskTemplateFormValidator.validateInfoSetOfValues(value);

        if (willUpdateState){
            this.state.information.extra = value;
            this.state.information.errorOnSetOfValues = msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg == undefined;
    }

    handleChangeInfoMandatory = (event) => {
        let value = event.target.checked;
        this.state.information.mandatary = value;
        this.setState(state =>{
            return{
                ...state
            };
        });
    }



    render() {
        var units, currentUnit, listAction, listInfo, listRole, usercompanys, userdepartments, role;
        const { newTemplate, submitted, action, information, addAction, addInfo } = this.state;
        const { department, user } = this.props;
        if (newTemplate.listAction) listAction = newTemplate.listAction;
        if (newTemplate.listInfo) listInfo = newTemplate.listInfo;
        

        if (department.unitofuser) {
            units = department.unitofuser;
            currentUnit = units.filter(item =>
                item.dean === this.state.currentRole
                || item.vice_dean === this.state.currentRole
                || item.employee === this.state.currentRole);
        }
        if (department.roleofuser){
            role = department.roleofuser;
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
                                        <div className={'form-group has-feedback' + (submitted && newTemplate.unit==="" ? ' has-error' : '')}>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Đơn vị*:</label>
                                            <div className={`col-sm-10 form-group ${this.state.newTemplate.errorOnUnit===undefined?"":"has-error"}`} style={{ width: '100%', marginLeft: "0px" }}>
                                                {role !== undefined &&
                                                    <SelectBox
                                                        id={`unit-select-box`}
                                                        className="form-control select2"
                                                        style={{width: "100%"}}
                                                        items={
                                                            role.map(x => {
                                                                return {value: x._id, text: x.name};
                                                            })
                                                        }
                                                        onChange={this.handleTaskTemplateUnit}
                                                        multiple={false}
                                                        emptySelection={true}
                                                        options={{placeholder: "Chọn đơn vị"}}
                                                    />
                                                }
                                                <ErrorLabel content={this.state.newTemplate.errorOnUnit}/>
                                            </div>
                                            {submitted && newTemplate.unit === "" &&
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
                                        <div className={'form-group has-feedback' + (submitted && newTemplate.read === [] ? ' has-error' : '')}>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Những người được phép xem*</label>
                                            <div className={`col-sm-10 form-group ${this.state.newTemplate.errorOnRead===undefined?"":"has-error"}`} style={{ width: '100%', marginLeft: "0px" }}>
                                                {listRole &&
                                                    <SelectBox
                                                        id={`read-select-box`}
                                                        className="form-control select2"
                                                        style={{width: "100%"}}
                                                        items={[
                                                            {value: listRole.dean._id, text: listRole.dean.name},
                                                            {value: listRole.vice_dean._id, text: listRole.vice_dean.name},
                                                            {value: listRole.employee._id, text: listRole.employee.name},
                                                        ]}
                                                        onChange={this.handleTaskTemplateRead}
                                                        multiple={true}
                                                        data-placeholder="Chọn vai trò được phép xem mẫu"
                                                    />
                                                }
                                                <ErrorLabel content={this.state.newTemplate.errorOnRead}/>
                                            </div>
                                            {submitted && newTemplate.read === "" &&
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
                                                        data-placeholder="Chọn người thực hiện"
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
                                                        data-placeholder="Chọn người thực hiện"
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
                                                        data-placeholder="Chọn người hỗ trợ"
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
                                                        data-placeholder="Chọn người quan sát"
                                                    />
                                                }
                                            </div>
                                        </div>
                                        <fieldset className="scheduler-border">
                                            <legend className="scheduler-border">Danh sách các hoạt động của công việc*</legend>
                                            <div className="control-group">
                                                <div className={'form-group has-feedback' + (addAction && !action.name ? ' has-error' : '')}>
                                                    <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Tên hoạt động*</label>
                                                    <div className={`col-sm-10 form-group ${this.state.action.errorOnName===undefined?"":"has-error"}`} style={{ width: '100%', marginLeft: "0px" }}>
                                                        <input type="text" className="form-control" placeholder="Tên hoạt động" value={action.name} onChange={this.handleChangeActionName} />
                                                        <ErrorLabel content={this.state.action.errorOnName}/>
                                                    </div>
                                                </div>
                                                <div className={'form-group has-feedback' + (addAction && !action.description ? ' has-error' : '')}>
                                                    <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Mô tả hoạt động*</label>
                                                    <div className={`col-sm-10 form-group ${this.state.action.errorOnDescription===undefined?"":"has-error"}`} style={{ width: '100%', marginLeft: "0px" }}>
                                                        <textarea type="text" className="form-control"name="description" placeholder="Mô tả hoạt động" value={action.description} onChange={this.handleChangeActionDesc} />
                                                        <ErrorLabel content={this.state.action.errorOnDescription}/>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-sm-2 control-label">
                                                        Bắt buộc &nbsp;
                                                        <input type="checkbox" className="" checked={action.mandatary} onChange={this.handleChangeActionMandatory} />
                                                    </label>
                                                </div>
                                                <div className="pull-right" style={{ marginBottom: '10px' }}>
                                                    {this.state.editAction ?
                                                        <React.Fragment>
                                                            <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={this.handleCancelEditAction}>Hủy chỉnh sửa</button>
                                                            <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isActionFormValidated()} onClick={this.handleSaveEditedAction}>Lưu</button>
                                                        </React.Fragment>:
                                                        <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isActionFormValidated()} onClick={this.handleAddAction}>Thêm</button>
                                                    }
                                                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearAction}>Xóa trắng</button>
                                                </div>
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: '10%' }}>STT</th>
                                                            <th title="Tên hoạt động">Tên hoạt động</th>
                                                            <th title="Mô tả">Mô tả</th>
                                                            <th title="Bắt buộc">Bắt buộc</th>
                                                            <th title="Hành động">Hành động</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="actions">
                                                        {
                                                            (typeof listAction === 'undefined' || listAction.length === 0) ? <tr><td colSpan={5}><center>Chưa có dữ liệu</center></td></tr> :
                                                                listAction.map((item, index) =>
                                                                    <tr key={`${this.state.keyPrefix}_${index}`}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{item.name}</td>
                                                                        <td>{item.description}</td>
                                                                        <td>{item.mandatary ? "Có" : "Không"}</td>
                                                                        <td>
                                                                            <a href="#abc" className="edit" title="Edit" data-toggle="tooltip" onClick={() => this.handleEditAction(item, index)}><i className="material-icons"></i></a>
                                                                            <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteAction(index)}><i className="material-icons"></i></a>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </fieldset>
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



                                        <fieldset className="scheduler-border">
                                            <legend className="scheduler-border">Danh sách các thông tin yêu cầu của công việc</legend>
                                            <div className="control-group">
                                                <div className={'form-group'}>
                                                    <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Tên thông tin</label>
                                                    <div className={`col-sm-10 form-group ${this.state.information.errorOnName===undefined?"":"has-error"}`} style={{ width: '100%', marginLeft: "0px" }}>
                                                        <input type="text" className="form-control" placeholder="Tên thông tin" value={information.name} onChange={this.handleChangeInfoName} />
                                                        <ErrorLabel content={this.state.information.errorOnName}/>
                                                    </div>
                                                </div>
                                                <div className={'form-group'}>
                                                    <label className="col-sm-4 control-label" htmlFor="inputDescriptionInfo" style={{ width: '100%', textAlign: 'left' }}>Mô tả thông tin</label>
                                                    <div className={`col-sm-10 form-group ${this.state.information.errorOnDescription===undefined?"":"has-error"}`} style={{ width: '100%', marginLeft: "0px" }}>
                                                        <textarea type="text" className="form-control" id="inputDescriptionInfo" name="description" placeholder="Mô tả thông tin" value={information.description} onChange={this.handleChangeInfoDesc} />
                                                        <ErrorLabel content={this.state.information.errorOnDescription}/>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-sm-4 control-label">Kiểu dữ liệu:</label>
                                                    <div className="col-sm-10" style={{ width: '100%' }}>
                                                        <select onChange={this.handleChangeInfoType} className="form-control" id="seltype" value={information.type} name="type" >
                                                            <option value="Văn bản">Văn bản</option>
                                                            <option value="Số">Số</option>
                                                            <option value="Ngày tháng">Ngày tháng</option>
                                                            <option value="Boolean">Boolean</option>
                                                            <option value="Tập giá trị">Tập giá trị</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                { this.state.information.type === this.state.INFO_TYPE.SET?
                                                    <div className={'form-group has-feedback' + (!information.type ? ' has-error' : '')}>
                                                        <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>{`Nhập tập giá trị:`}</label>
                                                        <div className={`col-sm-10 form-group ${this.state.information.errorOnSetOfValues===undefined?"":"has-error"}`} style={{ width: '100%', marginLeft: "0px" }}>
                                                            <textarea rows={5} type="text" className="form-control" value={information.extra} onChange={this.handleChangeInfoSetOfValues} placeholder={`Nhập tập giá trị, mỗi giá trị một dòng`} ref={input => this.setOfValues = input} />
                                                            <ErrorLabel content={this.state.information.errorOnSetOfValues}/>
                                                        </div>
                                                    </div>
                                                    : null
                                                }

                                                <div className="form-group">
                                                    <label className="col-sm-2 control-label">
                                                        Chỉ quản lý được điền? &nbsp;
                                                        <input type="checkbox" className="" checked={information.mandatary} onChange={this.handleChangeInfoMandatory} />
                                                    </label>
                                                </div>
                                                <div className="pull-right" style={{marginBottom: "10px"}}>
                                                    {this.state.editInfo ?
                                                        <React.Fragment>
                                                            <button className="btn btn-success" onClick={this.handleCancelEditInformation} style={{ marginLeft: "10px" }}>Hủy chỉnh sửa</button>
                                                            <button className="btn btn-success" disabled={!this.isInfoFormValidated()} onClick={this.saveEditedInformation} style={{ marginLeft: "10px" }}>Lưu</button>
                                                        </React.Fragment>:
                                                        <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isInfoFormValidated()} onClick={this.addInfo}>Thêm</button>
                                                    }
                                                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearInformation}>Xóa trắng</button>
                                                </div>
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: '10%' }}>Stt</th>
                                                            <th title="Tên trường thông tin">Tên trường thông tin</th>
                                                            <th title="Mô tả">Mô tả</th>
                                                            <th title="Kiểu dữ liệu">Kiểu dữ liệu</th>
                                                            <th title="Chỉ quản lý được điền?">Chỉ quản lý được điền?</th>
                                                            <th>Hành động</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="informations">
                                                        {
                                                            (typeof listInfo === 'undefined' || listInfo.length === 0) ? <tr><td colSpan={6}><center>Chưa có dữ liệu</center></td></tr> :
                                                                listInfo.map((item, index) =>
                                                                    <tr key={`${this.state.keyPrefix}_${index}`}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{item.name}</td>
                                                                        <td>{item.description}</td>
                                                                        <td>{item.type}</td>
                                                                        <td>{item.mandatary ? "Có" : "Không"}</td>
                                                                        <td>
                                                                            <a href="#abc" className="edit" title="Edit" onClick={() => this.editInformation(item, index)}><i className="material-icons"></i></a>
                                                                            <a href="#abc" className="delete" title="Delete" onClick={() => this.deleteInfo(index)}><i className="material-icons"></i></a>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success" disabled={!this.isTaskTemplateFormValidated()} onClick={this.handleSubmit}>Lưu</button>
                            <button type="cancel" className="btn btn-primary" data-dismiss="modal" onClick={this.handleCancel}>Xóa trắng</button>
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
    getRoleDeanOfUser: DepartmentActions.getRoleDeanOfUser
};
const connectedModalAddTaskTemplate = connect(mapState, actionCreators)(ModalAddTaskTemplate);
export { connectedModalAddTaskTemplate as ModalAddTaskTemplate };