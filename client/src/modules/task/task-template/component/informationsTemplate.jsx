 
import React, { Component } from 'react';
import { connect } from 'react-redux';
import  {taskTemplateActions} from '../redux/actions';
import { TaskTemplateFormValidator} from './taskTemplateFormValidator';
import Sortable from 'sortablejs';

import {SelectBox, ErrorLabel} from '../../../../common-components';
import './tasktemplate.css';

class InformationForm extends Component{
    componentDidMount(){
        // Load library for sort action table
        this.handleSortable();
    }

    constructor(props){
        super(props);
        this.INFO_TYPE = {
            TEXT: "Text",
            NUMBER: "Number",
            DATE: "Date",
            BOOLEAN: "Boolean",
            SET: "SetOfValues",
        };
        this.EMPTY_INFORMATION = {
            name: '',
            description: '',
            type: this.INFO_TYPE.TEXT,
            extra: '',
            filledByAccountableEmployeesOnly: false
        };
       
        this.state={
            information: Object.assign({}, this.EMPTY_INFORMATION),
            taskInformations: this.props.initialData,
            editInfo: false,
        }
    }

    // Drag and drop item in action table
    handleSortable = () => {
        
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
                let taskInformations = this.state.newTemplate.taskInformations;
                const item = taskInformations[evt.oldIndex];
                taskInformations.splice(evt.oldIndex, 1);
                taskInformations.splice(evt.newIndex, 0, item);
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



    // Edit information in information table
    handleEditInformation = async (information, index) => {
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
    handleSaveEditedInformation = async (event) => {
        event.preventDefault(); // Ngăn không submit

        const { indexInfo } = this.state;
        
        let taskInformations  = this.state.taskInformations;
        var newTaskInformations;
        if (taskInformations) {
            newTaskInformations = taskInformations.map((item, index) => {
                return (index === indexInfo) ? this.state.information : item;
            })
        }
        await this.setState(state => {
            return {
                ...state,
                taskInformations: newTaskInformations,
                editInfo: false,
                information: Object.assign({}, this.EMPTY_INFORMATION),
            }
        })
        this.props.onDataChange(this.state.taskInformations);
    }

    handleCancelEditInformation = (event) => {
        event.preventDefault(); // Ngăn không submit

        this.setState(state => {
            return {
                ...state,
                editInfo: false,
                information: Object.assign({}, this.EMPTY_INFORMATION),
            }
        });
        
    }
    
    // function: reset all data fields of information table
    handleClearInformation = (event) => {
        event.preventDefault(); // Ngăn không submit

        this.setState(state => {
            return {
                ...state,
                information: Object.assign({}, this.EMPTY_INFORMATION),
            }
        })
    }

    // delete item in information table
    handleDeleteInformation = async (index) => {
        let  taskInformations  = this.state.taskInformations;
        var newTaskInformations;
        if (taskInformations) {
            newTaskInformations = taskInformations.filter((item, x) => index !== x);
        }
        await this.setState(state => {
            return {
                ...state,                
                taskInformations: newTaskInformations
                
            }
        })
        this.props.onDataChange(this.state.taskInformations);
    }

    // add new information in information table
    handleAddInformation = async (event) => {
        event.preventDefault(); // Ngăn không submit

        
        await this.setState(state => {
            const taskInformations = [...(this.state.taskInformations), state.information];
            return {
                ...state,
                taskInformations: taskInformations,
                information: Object.assign({}, this.EMPTY_INFORMATION),
            }
        })
        this.props.onDataChange(this.state.taskInformations);
    }

    /**
     * Bộ xử lý cho Information Form 
    **/
    isInfoFormValidated = () => {
        let result = 
            this.validateInfoName(this.state.information.name, false) &&
            this.validateInfoDesc(this.state.information.description, false) &&
            (this.state.information.type !== this.INFO_TYPE.SET ||
                (this.state.information.type === this.INFO_TYPE.SET && 
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

    handleChangeInfoFilledByAccountableEmployeesOnly = (event) => {
        let value = event.target.checked;
        this.state.information.filledByAccountableEmployeesOnly = value;
        this.setState(state =>{
            return{
                ...state
            };
        });
    }

    render(){
        var taskInformations =this.state.taskInformations;
        var information  =this.state.information;
        return(
            <fieldset className="scheduler-border">
                <legend className="scheduler-border">Danh sách các trường thông tin của công việc</legend>
                
                <div className={`form-group ${this.state.information.errorOnName===undefined?"":"has-error"}`} >
                    <label className="control-label">Tên thông tin</label>
                    <div>
                        <input type="text" className="form-control" placeholder="Tên thông tin" value={information.name} onChange={this.handleChangeInfoName} />
                        <ErrorLabel content={this.state.information.errorOnName}/>
                    </div>
                </div>
                <div className={`form-group ${this.state.information.errorOnDescription===undefined?"":"has-error"}`} >
                    <label className="control-label" htmlFor="inputDescriptionInfo">Mô tả thông tin</label>
                    <div>
                        <textarea type="text" className="form-control" id="inputDescriptionInfo" name="description" placeholder="Mô tả thông tin" value={information.description} onChange={this.handleChangeInfoDesc} />
                        <ErrorLabel content={this.state.information.errorOnDescription}/>
                    </div>
                </div>
                <div className="form-group" >
                    <label className=" control-label">Kiểu dữ liệu:</label>
                    <div style={{ width: '100%' }}>
                        <select onChange={this.handleChangeInfoType} className="form-control" id="seltype" value={information.type} name="type" >
                            <option value={this.INFO_TYPE.TEXT}>Văn bản</option>
                            <option value={this.INFO_TYPE.NUMBER}>Số</option>
                            <option value={this.INFO_TYPE.DATE}>Ngày tháng</option>
                            <option value={this.INFO_TYPE.BOOLEAN}>Boolean</option>
                            <option value={this.INFO_TYPE.SET}>Tập giá trị</option>
                        </select>
                    </div>
                </div>

                { this.state.information.type === this.INFO_TYPE.SET?
                    <div className={`form-group ${this.state.information.errorOnSetOfValues===undefined?"":"has-error"}`} >
                        <label className="control-label">{`Nhập tập giá trị:`}</label>
                        
                        <textarea rows={5} type="text" className="form-control" value={information.extra} onChange={this.handleChangeInfoSetOfValues} placeholder={`Nhập tập giá trị, mỗi giá trị một dòng`} ref={input => this.setOfValues = input} />
                        <ErrorLabel content={this.state.information.errorOnSetOfValues}/>
                    </div>
                    : null
                }

                <div className="form-group" >
                    <label className="control-label">
                        Chỉ quản lý được điền? &nbsp;
                        <input type="checkbox" className="" checked={information.filledByAccountableEmployeesOnly} onChange={this.handleChangeInfoFilledByAccountableEmployeesOnly} />
                    </label>
                </div>
                <div className="pull-right" style={{marginBottom: "10px"}}>
                    {this.state.editInfo ?
                        <React.Fragment>
                            <button className="btn btn-success" onClick={this.handleCancelEditInformation} style={{ marginLeft: "10px" }}>Hủy chỉnh sửa</button>
                            <button className="btn btn-success" disabled={!this.isInfoFormValidated()} onClick={this.handleSaveEditedInformation} style={{ marginLeft: "10px" }}>Lưu</button>
                        </React.Fragment>:
                        <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isInfoFormValidated()} onClick={this.handleAddInformation}>Thêm</button>
                    }
                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearInformation}>Xóa trắng</button>
                </div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th style={{ width: '10%' }}>STT</th>
                            <th title="Tên trường thông tin">Tên trường thông tin</th>
                            <th title="Mô tả">Mô tả</th>
                            <th title="Kiểu dữ liệu">Kiểu dữ liệu</th>
                            <th title="Chỉ quản lý được điền?">Chỉ quản lý được điền?</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody id="informations">
                        {
                            (typeof taskInformations === 'undefined' || taskInformations.length === 0) ? <tr><td colSpan={6}><center>Chưa có dữ liệu</center></td></tr> :
                                taskInformations.map((item, index) =>
                                    <tr key={`${this.state.keyPrefix}_${index}`}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.type}</td>
                                        <td>{item.filledByAccountableEmployeesOnly ? "Có" : "Không"}</td>
                                        <td>
                                            <a href="#abc" className="edit" title="Edit" onClick={() => this.handleEditInformation(item, index)}><i className="material-icons"></i></a>
                                            <a href="#abc" className="delete" title="Delete" onClick={() => this.handleDeleteInformation(index)}><i className="material-icons"></i></a>
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
export { InformationForm as InformationForm };
