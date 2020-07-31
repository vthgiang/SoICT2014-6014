import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TaskTemplateFormValidator} from './taskTemplateFormValidator';
import Sortable from 'sortablejs';
import { withTranslate } from 'react-redux-multilingual';
import {ErrorLabel} from '../../../../common-components';
import './tasktemplate.css';

class InformationForm extends Component{
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
    componentDidMount(){
        // Load library for sort action table
        this.handleSortable();
    }

    // Drag and drop item in action table
    handleSortable = () => {
        
        var el2 = document.getElementById('informations');
        Sortable.create(el2, {
            chosenClass: 'chosen',
            animation: 500,
            onChange: async(evt) => {
                window.$('#informations tr').each(function (index) {
                    window.$(this).find('td:nth-child(1)').html("p" + (index + 1));
                });
            },
            onEnd: async(evt) => {
                let taskInformations = this.state.taskInformations;
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
        const { translate } = this.props;
        var taskInformations =this.state.taskInformations;
        var information  =this.state.information;
        return(
            <fieldset className="scheduler-border">
                <legend className="scheduler-border">{translate('task_template.information_list')}</legend>
                
                <div className={`form-group ${this.state.information.errorOnName===undefined?"":"has-error"}`} >
                    <label className="control-label">{translate('task_template.infor_name')}</label>
                    <div>
                        <input type="text" className="form-control" placeholder={translate('task_template.infor_name')} value={information.name} onChange={this.handleChangeInfoName} />
                        <ErrorLabel content={this.state.information.errorOnName}/>
                    </div>
                </div>
                <div className={`form-group ${this.state.information.errorOnDescription===undefined?"":"has-error"}`} >
                    <label className="control-label" htmlFor="inputDescriptionInfo">{translate('task_template.description')}</label>
                    <div>
                        <textarea type="text" className="form-control" id="inputDescriptionInfo" name="description" placeholder={translate('task_template.description')} value={information.description} onChange={this.handleChangeInfoDesc} />
                        <ErrorLabel content={this.state.information.errorOnDescription}/>
                    </div>
                </div>
                <div className="form-group" >
                    <label className=" control-label">{translate('task_template.datatypes')}:</label>
                    <div style={{ width: '100%' }}>
                        <select onChange={this.handleChangeInfoType} className="form-control" id="seltype" value={information.type} name="type" >
                            <option value={this.INFO_TYPE.TEXT}>{translate('task_template.text')}</option>
                            <option value={this.INFO_TYPE.NUMBER}>{translate('task_template.number')}</option>
                            <option value={this.INFO_TYPE.DATE}>{translate('task_template.date')}</option>
                            <option value={this.INFO_TYPE.BOOLEAN}>Boolean</option>
                            <option value={this.INFO_TYPE.SET}>{translate('task_template.value_set')}</option>
                        </select>
                    </div>
                </div>

                { this.state.information.type === this.INFO_TYPE.SET?
                    <div className={`form-group ${this.state.information.errorOnSetOfValues===undefined?"":"has-error"}`} >
                        <label className="control-label">{translate('task_template.value_set')}</label>
                        
                        <textarea rows={5} type="text" className="form-control" value={information.extra} onChange={this.handleChangeInfoSetOfValues} placeholder={`Nhập tập giá trị, mỗi giá trị một dòng`} ref={input => this.setOfValues = input} />
                        <ErrorLabel content={this.state.information.errorOnSetOfValues}/>
                    </div>
                    : null
                }

                <div className="form-group" >
                    <label className="control-label">
                    {translate('task_template.manager_fill')} &nbsp;
                        <input type="checkbox" className="" checked={information.filledByAccountableEmployeesOnly} onChange={this.handleChangeInfoFilledByAccountableEmployeesOnly} />
                    </label>
                </div>
                <div className="pull-right" style={{marginBottom: "10px"}}>
                    {this.state.editInfo ?
                        <React.Fragment>
                            <button className="btn btn-success" onClick={this.handleCancelEditInformation} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                            <button className="btn btn-success" disabled={!this.isInfoFormValidated()} onClick={this.handleSaveEditedInformation} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                        </React.Fragment>:
                        <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isInfoFormValidated()} onClick={this.handleAddInformation}>{translate('task_template.add')}</button>
                    }
                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearInformation}>{translate('task_template.delete')}</button>
                </div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }} className="col-fixed">Mã</th>
                            <th title="Tên trường thông tin">{translate('task_template.infor_name')}</th>
                            <th title="Mô tả">{translate('task_template.description')}</th>
                            <th title="Kiểu dữ liệu">{translate('task_template.datatypes')}</th>
                            <th title="Chỉ quản lý được điền?">{translate('task_template.manager_fill')}?</th>
                            <th>{translate('task_template.action')}</th>
                        </tr>
                    </thead>
                    <tbody id="informations">
                        {
                            (typeof taskInformations === 'undefined' || taskInformations.length === 0) ? <tr><td colSpan={6}><center>{translate('task_template.no_data')}</center></td></tr> :
                                taskInformations.map((item, index) =>
                                <tr key={`${this.state.keyPrefix}_${index}`}>
                                    <td>p{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.type}</td>
                                    <td>{item.filledByAccountableEmployeesOnly ? translate('general.yes') : translate('general.no')}</td>
                                    <td>
                                        <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditInformation(item, index)}><i className="material-icons"></i></a>
                                        <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteInformation(index)}><i className="material-icons"></i></a>
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

const informationForm = connect()(withTranslate(InformationForm));
export { informationForm as InformationForm }
