import React, { Component } from 'react';
import { connect } from 'react-redux';
import  {taskTemplateActions} from '../redux/actions';
import { TaskTemplateFormValidator} from './taskTemplateFormValidator';
import Sortable from 'sortablejs';

import {SelectBox, ErrorLabel} from '../../../../common-components';
import './tasktemplate.css';

class ActionForm extends Component{

    componentDidMount(){
        // Load library for sort action table
        this.handleSortable();
    }

    constructor(props){
        super(props);
        let EMPTY_ACTION = {
            name: '',
            description: '',
            mandatory: true,
        };
        this.state={
            EMPTY_ACTION: Object.assign({}, EMPTY_ACTION),
            editAction: false,
            action:  Object.assign({}, EMPTY_ACTION),
            taskActions:this.props.initialData
        }
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
                let taskActions = this.state.newTemplate.taskActions;
                const item = taskActions[evt.oldIndex];
                taskActions.splice(evt.oldIndex, 1);
                taskActions.splice(evt.newIndex, 0, item);
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
    this.state.action.mandatory = value;
    this.setState(state =>{
        return{
            ...state
        };
    });
}
// cancel editing an action
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
handleAddAction = async (event) => {
    event.preventDefault(); // Ngăn không submit

    var EMPTY_ACTION = {
        name: '',
        description: '',
        mandatory: true,
    };
    await this.setState(state => {
         const taskActions = [...this.state.taskActions,state.action];
            return {
                ...state,
             taskActions:taskActions,             
             action: Object.assign({}, state.EMPTY_ACTION),
                 
            }
            
            
        })
         this.props.onDataChange(this.state.taskActions);
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
handleSaveEditedAction = async (event) => {
    event.preventDefault(); // Ngăn không submit

    const { indexAction } = this.state;
    let  taskActions  = this.state.taskActions;
    var newTaskActions;
    if (taskActions) {
        newTaskActions = taskActions.map((item, index) => {
            return (index === indexAction) ? this.state.action : item;
        })
    }
    await this.setState(state => {
        return {
            ...state,
            taskActions:newTaskActions,            
            editAction: false,
            action: Object.assign({}, state.EMPTY_ACTION),
        }
    })
    this.props.onDataChange(this.state.taskActions);
}

// delete action in action table
handleDeleteAction = async (index) => {
    let taskActions  = this.state.taskActions;
    var newTaskInformations;
    if (taskActions) {
        newTaskInformations = taskActions.filter((item, x) => index !== x);
    }
    await this.setState(state => {
        return {
            ...state,
            taskActions:newTaskInformations
        }
    })
    this.props.onDataChange(this.state.taskActions);
}

    render(){
        var action =this.state.action;
        var taskActions =this.state.taskActions;
        return(
            <fieldset className="scheduler-border">
            <legend className="scheduler-border">Danh sách các hoạt động của công việc*</legend>

            <div className={`form-group ${this.state.action.errorOnName===undefined?"":"has-error"}`} >
                <label className="control-label">Tên hoạt động*</label>
                <div>
                    <input type="text" className="form-control" placeholder="Tên hoạt động" value={action.name} onChange={this.handleChangeActionName} />
                    <ErrorLabel content={this.state.action.errorOnName}/>
                </div>
            </div>
            <div className={`form-group ${this.state.action.errorOnDescription===undefined?"":"has-error"}`} >
                <label className="control-label">Mô tả hoạt động*</label>
                <div>
                    <textarea type="text" className="form-control" name="description" placeholder="Mô tả hoạt động" value={action.description} onChange={this.handleChangeActionDesc} />
                    <ErrorLabel content={this.state.action.errorOnDescription}/>
                </div>
            </div>
            <div className="form-group" >
                <label className="control-label">
                    Bắt buộc &nbsp;
                    <input type="checkbox" className="" checked={action.mandatory} onChange={this.handleChangeActionMandatory} />
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
                        (typeof taskActions === 'undefined' || taskActions.length === 0) ? <tr><td colSpan={5}><center>Chưa có dữ liệu</center></td></tr> :
                            taskActions.map((item, index) =>
                                <tr key={`${this.state.keyPrefix}_${index}`}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.mandatory ? "Có" : "Không"}</td>
                                    <td>
                                        <a href="#abc" className="edit" title="Edit" data-toggle="tooltip" onClick={() => this.handleEditAction(item, index)}><i className="material-icons"></i></a>
                                        <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteAction(index)}><i className="material-icons"></i></a>
                                    </td>
                                </tr>
                            )
                    }
                </tbody>
            </table>
        </fieldset>
        
            )

    }
    

}
export { ActionForm as ActionForm };