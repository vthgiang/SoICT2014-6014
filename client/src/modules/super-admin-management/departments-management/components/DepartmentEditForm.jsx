import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog } from '../../../../common-components';
import { DepartmentActions } from '../redux/actions';

class DepartmentEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() { 
        const { translate, departmentInfo, department } = this.props;
        return ( 
            <React.Fragment>
                <ModalDialog
                    size="75" type="edit" isLoading={department.isLoading}
                    modalID={`modal-edit-department-${departmentInfo._id}`}
                    formID={`form-edit-department-${departmentInfo._id}`}
                    title={translate('manage_department.info')}
                    msg_success={translate('manage_department.edit_success')}
                    msg_faile={translate('manage_department.edit_faile')}
                    func={this.save}
                >
                    <form  id={`form-edit-department-${departmentInfo._id}`}>  
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border"><span>{ translate('manage_department.info') }</span></legend>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.name')  }<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" ref="name" defaultValue={departmentInfo.name}/><br/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.description') }<span className="attention"> * </span></label>
                                        <textarea type="text" className="form-control" ref="description" defaultValue={departmentInfo.description}/><br/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.parent') }</label>
                                        <select 
                                            className="form-control" 
                                            style={{width: '100%'}} 
                                            ref="parent" 
                                            defaultValue={departmentInfo.parent}>
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
                                    <legend className="scheduler-border"><span>{ translate('manage_department.roles_of_department') }</span></legend>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.dean_name') }<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" ref="dean" defaultValue={departmentInfo.dean.name} placeholder={ translate('manage_department.dean_example') }/><br/>
                                    </div> 
                                    <div className="form-group">
                                        <label>{ translate('manage_department.vice_dean_name') }<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" ref="vice_dean" defaultValue={departmentInfo.vice_dean.name} placeholder={ translate('manage_department.vice_dean_example') }/><br/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.employee_name') }<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" ref="employee" defaultValue={departmentInfo.employee.name} placeholder={ translate('manage_department.employee_example') }/><br/>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
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
        const data = this.refs;
        return this.props.edit({ 
            _id: this.props.departmentInfo._id,
            name: data.name.value,
            description: data.description.value,
            parent: data.parent.value,
            dean: data.dean.value,
            vice_dean: data.vice_dean.value,
            employee: data.employee.value
        });
    }
}

const mapState = state => state;
const getState = {
    edit: DepartmentActions.edit
}
export default connect(mapState, getState) (withTranslate(DepartmentEditForm)); 
