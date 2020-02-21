import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DepartmentActions } from '../redux/actions';
import Swal from 'sweetalert2';

class DepartmentCreateWithParent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: '',
            description: '',
            dean: '',
            vice_dean: '',
            employee: '',
            parent: this.props.parentId
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

    save = (message) => {
        const { name, description, dean, vice_dean, employee, parent } = this.state;
        this.props
            .create({name, description, dean, vice_dean, employee, parent})
            .then(res => {
                Swal.fire({
                    icon: 'success',
                    title: message,
                    showConfirmButton: false,
                    timer: 5000
                }) 
            });
    }

    render() { 
        const { translate, department, parentId } = this.props;
        const { name, description, dean, vice_dean, employee } = this.state;

        return ( 
            <React.Fragment>
                <div className="modal modal-full fade" id={`modal-create-department-with-parent-${parentId}`}>
                    <div className="modal-dialog-full">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">{ translate('manage_department.add_title') }</h4>
                            </div>
                            <div className="modal-body">
                                <form style={{ marginTop: '50px', marginBottom: '20px' }}>
                                    
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                            <fieldset className="scheduler-border">
                                                <legend className="scheduler-border">{ translate('manage_department.info') }</legend>
                                                <div className="form-group">
                                                    <label>{ translate('manage_department.name') }<span className="attention"> * </span></label>
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
                                                        value={ parentId    }
                                                        onChange={this.inputChange}>
                                                            <option>{ translate('manage_department.select_parent') }</option>
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
                                                <legend className="scheduler-border">{ translate('manage_department.roles_of_department') }</legend>
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
                            </div>
                            <div className="modal-footer">
                                <p className="attention pull-left">(*): {translate('form.required')}</p>
                                <button type="button" className="btn btn-primary pull-right" style={{ marginRight: '8px' }} data-dismiss="modal"> { translate('form.close') }</button>
                                {
                                    (name !== '' && description !== '' && dean !== '' && vice_dean != '' && employee != '') &&
                                    <button 
                                        type="button" 
                                        className="btn btn-success" 
                                        onClick={() => this.save(
                                            translate('manage_department.add_success')
                                        )} 
                                        style={{ marginRight: '8px' }} 
                                        data-dismiss="modal"
                                        > { translate('form.save') }</button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}

const mapState = state => state;
const getState = {
    create: DepartmentActions.create
}
 
export default connect(mapState, getState) (withTranslate(DepartmentCreateWithParent)); 
