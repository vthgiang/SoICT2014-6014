import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DepartmentActions } from '../redux/actions';
import { DialogModal, ButtonModal, ErrorLabel } from '../../../../common-components';
import { DepartmentValidator } from './organizationalUnitValidator';

class DepartmentCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            departmentName: '',
            departmentDescription: '',
            deans: [''],
            viceDeans: [''],
            employees: ['']
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
        const {departmentNameError, departmentDescriptionError, departmentDeanError, departmentViceDeanError, departmentEmployeeError} = this.state;
        console.log("state deans:", this.state)
        return ( 
            <React.Fragment>
                <ButtonModal modalID="modal-create-department" button_name={translate('manage_department.add')} title={translate('manage_department.add_title')}/>
                <DialogModal
                    isLoading={department.isLoading}
                    modalID="modal-create-department"
                    formID="form-create-department"
                    title={translate('manage_department.add_title')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-create-department">
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
                                    onChange={this.handleParent}>
                                        <option key={'noparent'} value={null}>{translate('manage_department.no_parent')}</option>
                                    {   
                                        department.list.map(department => 
                                            <option key={department._id} value={department._id}>{department.name}</option>    
                                        )
                                    }
                                </select>
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border"><span>{ translate('manage_department.roles_of_department') }</span></legend>
                            <div className={`form-group ${departmentDeanError===undefined?"":"has-error"}`}>
                                <a href="#add-dean" className="text-green pull-right" onClick={this.handleAddDean}><i className="material-icons">add_box</i></a>
                                <label>{ translate('manage_department.dean_name') }<span className="attention"> * </span></label>
                                {
                                    this.state.deans.length > 1 ?
                                    this.state.deans.map((dean, index)=>{
                                        return <div key={index} className="input-group">
                                            <input type="text" 
                                                className="form-control" 
                                                placeholder={ translate('manage_department.dean_example')}
                                                value={dean}
                                                onChange={(e)=>this.handleChangeDean(e, index)}
                                            />
                                                <a href="#delete-dean" 
                                                    className="input-group-addon text-red" 
                                                    style={{border: 'none'}} 
                                                    onClick={()=>this.handleRemoveDean(index)}><i className="fa fa-trash"></i>
                                                </a> 
                                            <br></br>
                                        </div>
                                    }): <input type="text" 
                                        className="form-control" 
                                        placeholder={ translate('manage_department.dean_example')}
                                        value={this.state.deans[0]}
                                        onChange={(e)=>this.handleChangeDean(e, 0)}
                                    />
                                }
                            </div> 

                            <div className="form-group">
                                <a href="#add-vicedean" className="text-green pull-right" onClick={this.handleAddViceDean}><i className="material-icons">add_box</i></a>
                                <label>{ translate('manage_department.vice_dean_name') }<span className="attention"> * </span></label>
                                {
                                    this.state.viceDeans.length > 1 ?
                                    this.state.viceDeans.map((vicedean, index)=>{
                                        return <div key={index} className="input-group">
                                            <input type="text" 
                                                className="form-control" 
                                                placeholder={ translate('manage_department.vice_dean_example')}
                                                value={vicedean}
                                                onChange={(e)=>this.handleChangeViceDean(e, index)}
                                            />
                                                <a href="#delete-dean" 
                                                    className="input-group-addon text-red" 
                                                    style={{border: 'none'}} 
                                                    onClick={()=>this.handleRemoveViceDean(index)}><i className="fa fa-trash"></i>
                                                </a> 
                                            <br></br>
                                        </div>
                                    }): <input type="text" 
                                        className="form-control" 
                                        placeholder={ translate('manage_department.vice_dean_example')}
                                        value={this.state.viceDeans[0]}
                                        onChange={(e)=>this.handleChangeViceDean(e, 0)}
                                    />
                                }
                            </div>

                            <div className="form-group">
                                <a href="#add-employee" className="text-green pull-right" onClick={this.handleAddEmployee}><i className="material-icons">add_box</i></a>
                                <label>{ translate('manage_department.employee_name') }<span className="attention"> * </span></label>
                                {
                                    this.state.employees.length > 1 ?
                                    this.state.employees.map((employee, index)=>{
                                        return <div key={index} className="input-group">
                                            <input type="text" 
                                                className="form-control" 
                                                placeholder={ translate('manage_department.employee_example')}
                                                value={employee}
                                                onChange={(e)=>this.handleChangeEmployee(e, index)}
                                            />
                                                <a href="#delete-dean" 
                                                    className="input-group-addon text-red" 
                                                    style={{border: 'none'}} 
                                                    onClick={()=>this.handleRemoveEmployee(index)}><i className="fa fa-trash"></i>
                                                </a> 
                                            <br></br>
                                        </div>
                                    }): <input type="text" 
                                        className="form-control" 
                                        placeholder={ translate('manage_department.dean_example')}
                                        value={this.state.employees[0]}
                                        onChange={(e)=>this.handleChangeEmployee(e, 0)}
                                    />
                                }
                            </div>
                        </fieldset>
                    </form>
                </DialogModal>
            </React.Fragment>
         );
    }

    isFormValidated = () => {
        let result = 
            this.validateName(this.state.departmentName, false) &&
            this.validateDescription(this.state.departmentDescription, false)
        return result;
    }

    save = () => {
        if(this.isFormValidated())
            return this.props.create({
                name: this.state.departmentName, 
                description: this.state.departmentDescription, 
                deans: this.state.deans, 
                viceDeans: this.state.viceDeans, 
                employees: this.state.employees, 
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

}

const mapState = state => state;
const getState = {
    create: DepartmentActions.create
}
 
export default connect(mapState, getState) (withTranslate(DepartmentCreateForm)); 
