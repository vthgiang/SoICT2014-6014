import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DepartmentActions } from '../redux/actions';
import { ModalDialog, ModalButton } from '../../../../common-components';

class DepartmentCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: '',
            description: '',
            dean: '',
            vice_dean: '',
            employee: '',
            parent: null
         }
        this.inputChange = this.inputChange.bind(this);
        this.save = this.save.bind(this);
    }

    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    save = () => {
        const { name, description, dean, vice_dean, employee, parent } = this.state;
        return this.props.create({name, description, dean, vice_dean, employee, parent});     
    }

    render() { 
        const { translate,department } = this.props;
        const { name, description, dean, vice_dean, employee } = this.state;

        return ( 
            <React.Fragment>
                <ModalButton modalID="modal-create-department" button_name={translate('manage_department.add')} title={translate('manage_department.add_title')}/>
                <ModalDialog
                    size="75"
                    modalID="modal-create-department"
                    formID="form-create-department"
                    title={translate('manage_department.add_title')}
                    msg_success={translate('manage_department.add_success')}
                    msg_faile={translate('manage_department.add_faile')}
                    func={this.save}
                >
                    <form id="form-create-department">    
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border"><span style={{fontSize: '20px'}}>{ translate('manage_department.info') }</span></legend>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.name')  }<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" name="name" onChange={ this.inputChange }/><br/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.description') }<span className="attention"> * </span></label>
                                        <textarea type="text" className="form-control" name="description" onChange={ this.inputChange }/><br/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.parent') }</label>
                                        <select 
                                            className="form-control" 
                                            style={{width: '100%'}} 
                                            name="parent" 
                                            onChange={this.inputChange}>
                                                <option>---{ translate('manage_department.select_parent') }---</option>
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
                                    <legend className="scheduler-border"><span style={{fontSize: '20px'}}>{ translate('manage_department.roles_of_department') }</span></legend>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.dean_name') }<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" name="dean" onChange={ this.inputChange } placeholder={ translate('manage_department.dean_example') }/><br/>
                                    </div> 
                                    <div className="form-group">
                                        <label>{ translate('manage_department.vice_dean_name') }<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" name="vice_dean" onChange={ this.inputChange } placeholder={ translate('manage_department.vice_dean_example') }/><br/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.employee_name') }<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" name="employee" onChange={ this.inputChange } placeholder={ translate('manage_department.employee_example') }/><br/>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
    }
}

const mapState = state => state;
const getState = {
    create: DepartmentActions.create
}
 
export default connect(mapState, getState) (withTranslate(DepartmentCreateForm)); 
