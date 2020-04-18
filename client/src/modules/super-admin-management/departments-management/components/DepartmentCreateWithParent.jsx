import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DepartmentActions } from '../redux/actions';
import { ModalDialog, ErrorLabel } from '../../../../common-components';
import { DepartmentValidator } from './DepartmentValidator';

class DepartmentCreateWithParent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            departmentName: '',
            departmentDescription: '',
            departmentDean: '',
            departmentViceDean: '',
            departmentEmployee: ''
         }
    }

    render() { 
        const { translate, department } = this.props;
        const {departmentParent, departmentNameError, departmentDescriptionError, departmentDeanError, departmentViceDeanError, departmentEmployeeError} = this.state;

        return ( 
            <React.Fragment>
                <ModalDialog
                    size="75" isLoading={department.isLoading}
                    modalID="modal-create-department-with-parent"
                    formID="form-create-department-with-parent"
                    title={translate('manage_department.add_title')}
                    msg_success={translate('manage_department.add_success')}
                    msg_faile={translate('manage_department.add_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-create-department-with-parent">
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border"><span>{ translate('manage_department.info') }</span></legend>
                                    <div className={`form-group ${departmentNameError===undefined?"":"has-error"}`}>
                                        <label>{ translate('manage_department.name')  }<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" onChange={this.handleName}/><br/>
                                        <ErrorLabel content={departmentNameError}/>
                                    </div>
                                    <div className={`form-group ${departmentDescriptionError===undefined?"":"has-error"}`}>
                                        <label>{ translate('manage_department.description') }<span className="attention"> * </span></label>
                                        <textarea type="text" className="form-control" onChange={this.handleDescription}/><br/>
                                        <ErrorLabel content={departmentDescriptionError}/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.parent') }</label>
                                        <select 
                                            className="form-control" 
                                            style={{width: '100%'}} 
                                            onChange={this.handleParent}
                                            value={departmentParent}>
                                                <option key={'noparent'} value={null}>{translate('manage_department.no_parent')}</option>
                                            {   
                                                department.list.map(department => 
                                                    <option key={department._id} value={department._id}>{department.name}</option>    
                                                )
                                            }
                                        </select>
                                    </div>
                                </fieldset>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border"><span>{ translate('manage_department.roles_of_department') }</span></legend>
                                    <div className={`form-group ${departmentDeanError===undefined?"":"has-error"}`}>
                                        <label>{ translate('manage_department.dean_name') }<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" placeholder={ translate('manage_department.dean_example')} onChange={this.handleDean}/><br/>
                                        <ErrorLabel content={departmentDeanError}/>
                                    </div> 
                                    <div className={`form-group ${departmentViceDeanError===undefined?"":"has-error"}`}>
                                        <label>{ translate('manage_department.vice_dean_name') }<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" placeholder={ translate('manage_department.vice_dean_example') } onChange={this.handleViceDean}/><br/>
                                        <ErrorLabel content={departmentViceDeanError}/>
                                    </div>
                                    <div className={`form-group ${departmentEmployeeError===undefined?"":"has-error"}`}>
                                        <label>{ translate('manage_department.employee_name') }<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" placeholder={ translate('manage_department.employee_example') } onChange={this.handleEmployee}/><br/>
                                        <ErrorLabel content={departmentEmployeeError}/>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
    }

    // Thiet lap cac gia tri tu props vao state
    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.departmentParent !== prevState.departmentParent) {
            return {
                ...prevState,
                departmentParent: nextProps.departmentParent,
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
            this.validateDescription(this.state.departmentDescription, false) &&
            this.validateDean(this.state.departmentDean, false) &&
            this.validateViceDean(this.state.departmentViceDean, false) &&
            this.validateEmployee(this.state.departmentEmployee, false);
        return result;
    }

    save = () => {
        if(this.isFormValidated())
            return this.props.create({
                name: this.state.departmentName, 
                description: this.state.departmentDescription, 
                dean: this.state.departmentDean, 
                vice_dean: this.state.departmentViceDean, 
                employee: this.state.departmentEmployee, 
                parent: this.state.departmentParent
            });
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

    handleDean = (e) => {
        const {value} = e.target;
        this.validateDean(value, true);
    }
    validateDean = (value, willUpdateState=true) => {
        let msg = DepartmentValidator.validateName(value);
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    departmentDeanError: msg,
                    departmentDean: value,
                }
            });
        }
        return msg === undefined;
    }

    handleEmployee = (e) => {
        const {value} = e.target;
        this.validateEmployee(value, true);
    }
    validateEmployee = (value, willUpdateState=true) => {
        let msg = DepartmentValidator.validateName(value);
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    departmentEmployeeError: msg,
                    departmentEmployee: value,
                }
            });
        }
        return msg === undefined;
    }

    handleViceDean = (e) => {
        const {value} = e.target;
        this.validateViceDean(value, true);
    }
    validateViceDean = (value, willUpdateState=true) => {
        let msg = DepartmentValidator.validateName(value);
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    departmentViceDeanError: msg,
                    departmentViceDean: value,
                }
            });
        }
        return msg === undefined;
    }
}

const mapState = state => state;
const getState = {
    create: DepartmentActions.create
}
 
export default connect(mapState, getState) (withTranslate(DepartmentCreateWithParent)); 
