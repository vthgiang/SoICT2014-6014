import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel } from '../../../../common-components';
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
            deans: [...this.state.deans, '']
        });
    }

    handleChangeDean = (e, index) => {
        this.state.deans[index] = e.target.value;
        this.setState({ deans: this.state.deans });
    }

    handleRemoveDean = (index) => {
        this.state.deans.splice(index, 1);
        this.setState({deans: this.state.deans});
    }

    handleAddViceDean = (e) => {
        this.setState({
            viceDeans: [...this.state.viceDeans, '']
        });
    }

    handleChangeViceDean = (e, index) => {
        this.state.viceDeans[index] = e.target.value;
        this.setState({ viceDeans: this.state.viceDeans });
    }

    handleRemoveViceDean = (index) => {
        this.state.viceDeans.splice(index, 1);
        this.setState({viceDeans: this.state.viceDeans});
    }

    handleAddEmployee = (e) => {
        this.setState({
            employees: [...this.state.employees, '']
        });
    }

    handleChangeEmployee = (e, index) => {
        this.state.employees[index] = e.target.value;
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
        console.log("state: ", this.state)
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
                                <select 
                                    className="form-control" 
                                    style={{width: '100%'}} 
                                    value={departmentParent !== null ? departmentParent : undefined}
                                    onChange={this.handleParent}>
                                        <option key={'noparent'} value={null}>{translate('manage_department.no_parent')}</option>
                                    {   
                                        department.list.filter(department => department._id !== departmentId)
                                        .map(department => 
                                            <option key={department._id} value={department._id}>{department.name}</option>    
                                        )
                                    }
                                </select>
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border"><span>{ translate('manage_department.roles_of_department') }</span></legend>
                            <div className={`form-group ${departmentDeanError===undefined?"":"has-error"}`}>
                                {/* <a href="#add-dean" className="text-green pull-right" onClick={this.handleAddDean}><i className="material-icons">add_box</i></a> */}
                                <label>{ translate('manage_department.dean_name') }<span className="attention"> * </span></label>
                                {
                                    deans.map((dean, index)=>{
                                        return <input type="text" key={index} 
                                                className="form-control" 
                                                placeholder={ translate('manage_department.dean_example')}
                                                value={dean}
                                                onChange={(e)=>this.handleChangeDean(e, index)}
                                                style={{marginBottom: '5px'}}
                                            />
                                    })
                                }
                            </div> 

                            <div className="form-group">
                                {/* <a href="#add-vicedean" className="text-green pull-right" onClick={this.handleAddViceDean}><i className="material-icons">add_box</i></a> */}
                                <label>{ translate('manage_department.vice_dean_name') }<span className="attention"> * </span></label>
                                {
                                    viceDeans.map((vicedean, index)=>{
                                        return <input type="text" key={index}
                                                className="form-control" 
                                                placeholder={ translate('manage_department.vice_dean_example')}
                                                value={vicedean}
                                                onChange={(e)=>this.handleChangeViceDean(e, index)}
                                                style={{marginBottom: '5px'}}
                                            />
                                    })
                                }
                            </div>

                            <div className="form-group">
                                {/* <a href="#add-employee" className="text-green pull-right" onClick={this.handleAddEmployee}><i className="material-icons">add_box</i></a> */}
                                <label>{ translate('manage_department.employee_name') }<span className="attention"> * </span></label>
                                {
                                    employees.map((employee, index)=>{
                                        return <input type="text" key={index}
                                                className="form-control" 
                                                placeholder={ translate('manage_department.employee_example')}
                                                value={employee}
                                                onChange={(e)=>this.handleChangeEmployee(e, index)}
                                                style={{marginBottom: '5px'}}
                                            />
                                    })
                                }
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

    handleParent = (e) => {
        const {value} = e.target;
        this.setState(state => {
            return {
                ...state,
                departmentParent: value
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
