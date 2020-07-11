import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';
import { DepartmentActions } from '../redux/actions';
import { DepartmentValidator } from './organizationalUnitValidator';
class DepartmentEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deans: [],
            viceDeans: [],
            employees: []
        }
    }

    handleAddDean = (e) => {
        this.setState({
            deans: [...this.state.deans, {name:""}]
        });
    }

    handleChangeDean = (e, index) => {
        this.state.deans[index].name = e.target.value;
        this.setState({ deans: this.state.deans });
    }

    handleRemoveDean = (index) => {
        this.state.deans.splice(index, 1);
        this.setState({deans: this.state.deans});
    }

    handleAddViceDean = (e) => {
        this.setState({
            viceDeans: [...this.state.viceDeans, {name:""}]
        });
    }

    handleChangeViceDean = (e, index) => {
        this.state.viceDeans[index].name = e.target.value;
        this.setState({ viceDeans: this.state.viceDeans });
    }

    handleRemoveViceDean = (index) => {
        this.state.viceDeans.splice(index, 1);
        this.setState({viceDeans: this.state.viceDeans});
    }

    handleAddEmployee = (e) => {
        this.setState({
            employees: [...this.state.employees, {name:""}]
        });
    }

    handleChangeEmployee = (e, index) => {
        this.state.employees[index].name = e.target.value;
        this.setState({ employees: this.state.employees });
    }

    handleRemoveEmployee = (index) => {
        this.state.employees.splice(index, 1);
        this.setState({employees: this.state.employees});
    }

    render() { 
        const { translate, department } = this.props;
        const {
            departmentId,
            departmentName,
            departmentDescription,
            departmentParent,
            deans,
            viceDeans,
            employees,
            departmentNameError,
            departmentDescriptionError,
            departmentDeanError,
            departmentViceDeanError,
            departmentEmployeeError,
        } = this.state;
        
        return ( 
            <React.Fragment>
                <DialogModal
                    isLoading={department.isLoading}
                    modalID="modal-edit-department"
                    formID="form-edit-department"
                    title={translate('manage_department.info')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-edit-department">  
                    <fieldset className="scheduler-border">
                            <legend className="scheduler-border"><span>{ translate('manage_department.info') }</span></legend>
                            <div className={`form-group ${departmentNameError===undefined?"":"has-error"}`}>
                                <label>{ translate('manage_department.name')  }<span className="attention"> * </span></label>
                                <input type="text" className="form-control" onChange={this.handleName} value={departmentName}/><br/>
                                <ErrorLabel content={departmentNameError}/>
                            </div>
                            <div className={`form-group ${departmentDescriptionError===undefined?"":"has-error"}`}>
                                <label>{ translate('manage_department.description') }<span className="attention"> * </span></label>
                                <textarea type="text" className="form-control" onChange={this.handleDescription} value={departmentDescription}/><br/>
                                <ErrorLabel content={departmentDescriptionError}/>
                            </div>
                            <div className="form-group">
                                <label>{ translate('manage_department.parent') }</label>
                                <SelectBox
                                    id={`edit-owp-${departmentId}`}
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {[
                                        {text: "Không có phòng ban cha"}, ...department.list.filter(department => department._id !== departmentId).map( department => {return {value: department._id, text: department.name}})
                                    ]}
                                    onChange={this.handleParent}
                                    value={departmentParent}
                                    multiple={false}
                                />
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border"><span>{ translate('manage_department.roles_of_department') }</span></legend>
                            <div className="form-group">
                                <table className="table table-hover table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th><label>{ translate('manage_department.dean_name') }</label></th>
                                            <th style={{width: '40px'}} className="text-center"><a href="#add-dean" className="text-green" onClick={this.handleAddDean}><i className="material-icons">add_box</i></a></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            deans.length > 0 &&
                                            deans.map((dean, index)=>{
                                                return <tr key={`dean-add-${index}`}>
                                                    <td><input type="text" 
                                                        className="form-control" 
                                                        name={`dean${index}`}
                                                        placeholder={ translate('manage_department.dean_example')}
                                                        value={dean.name}
                                                        onChange={(e)=>this.handleChangeDean(e, index)}
                                                    /></td>
                                                    <td><a href="#delete-dean" 
                                                        className="text-red" 
                                                        style={{border: 'none'}} 
                                                        onClick={()=>this.handleRemoveDean(index)}><i className="fa fa-trash"></i>
                                                    </a></td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div> 

                            <div className="form-group">
                                <table className="table table-hover table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th><label>{ translate('manage_department.vice_dean_name') }</label></th>
                                            <th style={{width: '40px'}} className="text-center"><a href="#add-vicedean" className="text-green" onClick={this.handleAddViceDean}><i className="material-icons">add_box</i></a></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            viceDeans.length > 0 &&
                                            viceDeans.map((vicedean, index)=>{
                                                return <tr key={`vicedean-add-${index}`}>
                                                    <td><input type="text" 
                                                        className="form-control" 
                                                        name={`vicedean${index}`}
                                                        placeholder={ translate('manage_department.vice_dean_example')}
                                                        value={vicedean.name}
                                                        onChange={(e)=>this.handleChangeViceDean(e, index)}
                                                    /></td>
                                                    <td><a href="#delete-vice-dean" 
                                                        className="text-red" 
                                                        style={{border: 'none'}} 
                                                        onClick={()=>this.handleRemoveViceDean(index)}><i className="fa fa-trash"></i>
                                                    </a></td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>

                            <div className="form-group">
                                <table className="table table-hover table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th><label>{ translate('manage_department.employee_name') }</label></th>
                                            <th style={{width: '40px'}} className="text-center"><a href="#add-employee" className="text-green" onClick={this.handleAddEmployee}><i className="material-icons">add_box</i></a></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            employees.length > 0 &&
                                            employees.map((employee, index)=>{
                                                return <tr key={`employee-add${index}`}>
                                                    <td><input type="text" 
                                                        className="form-control" 
                                                        name={`employee${index}`}
                                                        placeholder={ translate('manage_department.employee_example')}
                                                        value={employee.name}
                                                        onChange={(e)=>this.handleChangeEmployee(e, index)}
                                                    /></td>
                                                    <td><a href="#delete-employee" 
                                                        className="text-red" 
                                                        style={{border: 'none'}} 
                                                        onClick={()=>this.handleRemoveEmployee(index)}><i className="fa fa-trash"></i>
                                                    </a></td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </fieldset>
                    </form>
                </DialogModal>
            </React.Fragment>
         );
    }

    // Thiet lap cac gia tri tu props vao state
    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.departmentId !== prevState.departmentId) {
            return {
                ...prevState,
                departmentId: nextProps.departmentId,
                departmentName: nextProps.departmentName,
                departmentDescription: nextProps.departmentDescription,
                departmentParent: nextProps.departmentParent,
                deans: nextProps.deans,
                viceDeans: nextProps.viceDeans,
                employees: nextProps.employees,
                departmentNameError: undefined,
                departmentDescriptionError: undefined,
                departmentDeanError: undefined,
                departmentViceDeanError: undefined,
                departmentEmployeeError: undefined,
            } 
        } else {
            return null;
        }
    }

    isFormValidated = () => {
        let result = 
            this.validateName(this.state.departmentName, false) &&
            this.validateDescription(this.state.departmentDescription, false)
        return result;
    }

    save = () => {
        const data = {
            _id: this.state.departmentId,
            name: this.state.departmentName,
            description: this.state.departmentDescription,
            parent: this.state.departmentParent,
            deans: this.state.deans,
            viceDeans: this.state.viceDeans,
            employees: this.state.employees
        };
        if(this.isFormValidated()) return this.props.edit(data);
    }

    handleParent = (value) => {
        this.setState(state => {
            return {
                ...state,
                departmentParent: value[0]
            }
        })
    }

    handleName = (e) => {
        const {value} = e.target;
        this.validateName(value, true);
    }
    validateName = (value, willUpdateState=true) => {
        let msg = DepartmentValidator.validateName(value);
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    departmentNameError: msg,
                    departmentName: value,
                }
            });
        }
        return msg === undefined;
    }

    handleDescription = (e) => {
        const {value} = e.target;
        this.validateDescription(value, true);
    }
    validateDescription = (value, willUpdateState=true) => {
        let msg = DepartmentValidator.validateName(value);
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    departmentDescriptionError: msg,
                    departmentDescription: value,
                }
            });
        }
        return msg === undefined;
    }
}

const mapState = state => state;
const getState = {
    edit: DepartmentActions.edit
}
export default connect(mapState, getState) (withTranslate(DepartmentEditForm)); 
